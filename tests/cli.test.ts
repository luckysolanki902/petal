import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
const exec = promisify(execFile),
  cli = path.resolve("bin/petal.mjs");
test("CLI registers multiple isolated projects and updates only the requested project", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "petal-cli-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const env = { ...process.env, PETAL_HOME: path.join(dir, "config") };
  const run = (...args: string[]) =>
    exec(process.execPath, [cli, ...args], { env });
  for (const name of ["Alpha", "Beta"]) {
    const root = path.join(dir, name);
    await fs.mkdir(root);
    await run("init", root, "--name", name);
  }
  const agentHome = path.join(dir, "agent-home");
  await exec(process.execPath, [cli, "setup"], {
    env: {
      ...env,
      HOME: agentHome,
      USERPROFILE: agentHome,
      CLAUDE_CONFIG_DIR: path.join(agentHome, ".claude"),
      XDG_CONFIG_HOME: path.join(agentHome, ".config"),
    },
  });
  for (const skill of [
    ".claude/skills/petal/SKILL.md",
    ".agents/skills/petal/SKILL.md",
    ".config/opencode/skills/petal/SKILL.md",
  ])
    assert.match(
      await fs.readFile(path.join(agentHome, skill), "utf8"),
      /Yes \/ No/,
    );
  const list = JSON.parse((await run("projects")).stdout);
  assert.equal(list.length, 2);
  const icons = JSON.parse(
    (await run("icons", "list", "--search", "posthog")).stdout,
  );
  assert.ok(icons.some((i: any) => i.id === "brand-posthog"));
  await run(
    "icons",
    "set",
    "--project",
    list[0].id,
    "--file",
    "data/feature.work.json",
    "--icon",
    "brand-posthog",
  );
  assert.equal(
    JSON.parse(
      (await run("task", "list", "--project", list[0].id)).stdout,
    ).files.find((f: any) => f.path === "data/feature.work.json").icon,
    "icons/brand-posthog.svg",
  );

  await assert.rejects(
    run("task", "add", "--title", "Must not enter another workspace"),
  );
  const root = path.join(dir, "Alpha");
  const instructions = await fs.readFile(path.join(root, "AGENTS.md"), "utf8");
  assert.match(instructions, /petal task list/);
  await fs.writeFile(path.join(root, "CLAUDE.md"), "Existing team rules\n");
  await run("init", root);
  const connected = await fs.readFile(path.join(root, "CLAUDE.md"), "utf8");
  assert.ok(connected.startsWith("Existing team rules\n"));
  await run("init", root);
  assert.equal(
    await fs.readFile(path.join(root, "CLAUDE.md"), "utf8"),
    connected,
  );
  await run(
    "task",
    "add",
    "--project",
    list[0].id,
    "--title",
    "Synthetic item",
  );
  const alpha = JSON.parse(
      (await run("task", "list", "--project", list[0].id)).stdout,
    ),
    beta = JSON.parse(
      (await run("task", "list", "--project", list[1].id)).stdout,
    );
  const work = alpha.files.find(
    (f: any) => f.path === "data/feature.work.json",
  );
  assert.equal(work.rows.length, 1);
  assert.equal(
    beta.files.find((f: any) => f.path === work.path).rows.length,
    0,
  );
  const input = path.join(dir, "patch.json");
  await fs.writeFile(
    input,
    JSON.stringify({
      status: "Doing",
      progress: 40,
      rootCause: "Synthetic finding",
    }),
  );
  await run(
    "task",
    "update",
    work.rows[0].id,
    "--project",
    list[0].id,
    "--file",
    work.path,
    "--input",
    input,
    "--revision",
    work.revision,
  );
  await assert.rejects(
    run(
      "task",
      "update",
      work.rows[0].id,
      "--project",
      list[0].id,
      "--file",
      work.path,
      "--input",
      input,
      "--revision",
      work.revision,
    ),
  );
});
