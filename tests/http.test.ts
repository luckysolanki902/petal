import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
test("HTTP rejects external origins, missing mutation headers and unregistered project IDs", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "petal-http-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  process.env.PETAL_HOME = dir;
  const { handle } = await import("../lib/http");
  const external = await handle(
    new Request("http://localhost:8766/__save", {
      method: "POST",
      headers: { origin: "https://attacker.example", "X-Progress-Save": "1" },
      body: "{}",
    }),
    "__save",
  );
  assert.equal(external.status, 403);
  const host = await handle(
    new Request("http://attacker.example/__save", {
      method: "POST",
      body: "{}",
    }),
    "__save",
  );
  assert.equal(host.status, 403);
  const unknown = await handle(
    new Request("http://localhost:8766/api/workspace?project=not-registered"),
    "workspace",
  );
  assert.equal(unknown.status, 404);
  const root = path.join(dir, "project");
  await fs.mkdir(path.join(root, "data"), { recursive: true });
  await fs.writeFile(path.join(root, "data/todo.json"), "[]");
  await fs.writeFile(
    path.join(root, "file-icons.json"),
    JSON.stringify({ "data/todo.json": { icon: "icons/todo.svg" } }),
  );
  await fs.writeFile(
    path.join(dir, "projects.json"),
    JSON.stringify([{ id: "fixture", name: "Fixture", root, dataDir: root }]),
  );
  const noHeader = await handle(
    new Request("http://localhost:8766/__save?project=fixture", {
      method: "POST",
      body: "{}",
    }),
    "__save",
  );
  assert.equal(noHeader.status, 403);
  const badJSON = await handle(
    new Request("http://localhost:8766/__save?project=fixture", {
      method: "POST",
      headers: { "X-Progress-Save": "1" },
      body: "{",
    }),
    "__save",
  );
  assert.equal(badJSON.status, 400);
  const read = await handle(
    new Request("http://localhost:8766/api/workspace?project=fixture"),
    "workspace",
  );
  assert.equal(read.status, 200);
  const body = await read.json();
  assert.equal(body.project.id, "fixture");
  assert.equal(body.files[0].rows.length, 0);
});
