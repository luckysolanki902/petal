import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
test("first workspace onboarding validates paths and preserves existing instructions on retries", async (t) => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "petal-onboarding-"));
  t.after(() => fs.rm(temp, { recursive: true, force: true }));
  process.env.PETAL_HOME = path.join(temp, "config");
  const { handle } = await import("../lib/http");
  const post = (body: unknown, headers = { "X-Progress-Save": "1" }) =>
    handle(
      new Request("http://localhost:8766/api/workspaces", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }),
      "workspaces",
    );
  assert.equal((await post({}, {} as any)).status, 403);
  assert.equal(
    (
      await post({
        root: "relative",
        name: "Demo",
        skills: false,
        agentFiles: true,
      })
    ).status,
    400,
  );
  const root = path.join(temp, "project");
  await fs.mkdir(root);
  await fs.writeFile(
    path.join(root, "AGENTS.md"),
    "Existing repository rules\n",
  );
  const body = { root, name: "Demo", skills: false, agentFiles: true };
  const first = await post(body);
  assert.equal(first.status, 200, await first.clone().text());
  const { project } = await first.json();
  assert.equal(project.root, await fs.realpath(root));
  const instructions = await fs.readFile(path.join(root, "AGENTS.md"), "utf8");
  assert.ok(instructions.startsWith("Existing repository rules\n"));
  assert.match(instructions, /petal task list/);
  assert.equal((await post(body)).status, 200);
  assert.equal(
    await fs.readFile(path.join(root, "AGENTS.md"), "utf8"),
    instructions,
  );
  const registry = JSON.parse(
    await fs.readFile(path.join(temp, "config/projects.json"), "utf8"),
  );
  assert.equal(registry.length, 1);
  assert.deepEqual(
    JSON.parse(
      await fs.readFile(path.join(project.dataDir, "data/todo.json"), "utf8"),
    ),
    [],
  );
  const secondRoot = path.join(temp, "other");
  await fs.mkdir(secondRoot);
  assert.equal(
    (
      await post({
        ...body,
        root: secondRoot,
        name: "Other",
        agentFiles: false,
      })
    ).status,
    200,
  );
  await assert.rejects(fs.access(path.join(secondRoot, "AGENTS.md")));
  assert.equal(
    (await post({ ...body, root: path.join(temp, "missing") })).status,
    400,
  );
});
