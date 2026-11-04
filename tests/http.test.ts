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
  const globalSettings = await handle(
    new Request("http://localhost:8766/api/settings?project=missing", {
      method: "POST",
      headers: { "X-Progress-Save": "1" },
      body: JSON.stringify({ origin: "" }),
    }),
    "settings",
  );
  assert.equal(globalSettings.status, 200);
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
  assert.deepEqual(body.projectSummaries, [
    { id: "fixture", progress: 0, todos: 0 },
  ]);
  const second = path.join(dir, "second");
  await fs.mkdir(path.join(second, "data"), { recursive: true });
  const at = "2026-01-01T10:00:00Z";
  await fs.writeFile(
    path.join(second, "data/feature.work.json"),
    JSON.stringify([
      {
        id: "W1",
        task: "Synthetic active work",
        status: "Doing",
        statusAt: at,
        createdAt: at,
      },
      {
        id: "W2",
        task: "Synthetic finished work",
        status: "Done",
        statusAt: at,
        createdAt: at,
      },
    ]),
  );
  await fs.writeFile(
    path.join(second, "data/todo.json"),
    JSON.stringify([
      {
        id: "T1",
        task: "Synthetic open todo",
        category: "General",
        createdAt: at,
        done: false,
        doneAt: null,
      },
      {
        id: "T2",
        task: "Synthetic complete todo",
        category: "General",
        createdAt: at,
        done: true,
        doneAt: at,
      },
    ]),
  );
  await fs.writeFile(
    path.join(second, "file-icons.json"),
    JSON.stringify({
      "data/feature.work.json": { icon: "icons/file.svg" },
      "data/todo.json": { icon: "icons/todo.svg" },
    }),
  );
  const registry = JSON.parse(
    await fs.readFile(path.join(dir, "projects.json"), "utf8"),
  );
  registry.push({
    id: "second",
    name: "Second",
    root: second,
    dataDir: second,
  });
  await fs.writeFile(path.join(dir, "projects.json"), JSON.stringify(registry));
  const overview = await (
    await handle(
      new Request("http://localhost:8766/api/workspace?project=fixture"),
      "workspace",
    )
  ).json();
  assert.deepEqual(
    overview.projectSummaries.find((s: any) => s.id === "second"),
    { id: "second", progress: 1, todos: 1 },
  );
  const importResponse = await handle(
    new Request(
      "http://localhost:8766/api/project-configuration-import?project=fixture",
      {
        method: "POST",
        headers: { "X-Progress-Save": "1" },
        body: JSON.stringify({ sourceProject: "second" }),
      },
    ),
    "project-configuration-import",
  );
  assert.equal(importResponse.status, 200);
  const imported = await importResponse.json();
  assert.equal(imported.source.id, "second");
  assert.equal(imported.configuration.statuses.length, 4);
  const targetAfter = await (
    await handle(
      new Request("http://localhost:8766/api/workspace?project=fixture"),
      "workspace",
    )
  ).json();
  assert.equal(targetAfter.files[0].rows.length, 0);
  const badImport = await handle(
    new Request(
      "http://localhost:8766/api/project-configuration-import?project=fixture",
      {
        method: "POST",
        headers: { "X-Progress-Save": "1" },
        body: JSON.stringify({ sourceProject: "not-registered" }),
      },
    ),
    "project-configuration-import",
  );
  assert.equal(badImport.status, 404);
  const activity = await handle(
    new Request("http://localhost:8766/api/activity?project=not-registered"),
    "activity",
  );
  assert.equal(activity.status, 200);
  const activityBody = await activity.json();
  assert.equal(activityBody.projects.length, 2);
  assert.ok(
    activityBody.rows.some(
      (r: any) =>
        r.project === "second" && r.row === "W1" && r.status === "Doing",
    ),
  );
  assert.deepEqual(activityBody.unavailable, []);
  const forbiddenActivity = await handle(
    new Request("http://localhost:8766/api/activity", {
      headers: { origin: "https://example.com" },
    }),
    "activity",
  );
  assert.equal(forbiddenActivity.status, 403);
});
