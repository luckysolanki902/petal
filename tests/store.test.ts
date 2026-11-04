import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createStore, StoreError } from "../lib/store";
const at = "2026-01-01T10:00:00Z";
async function fixture(t: any) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "petal-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "data"));
  await fs.writeFile(
    path.join(root, "data/feature.work.json"),
    JSON.stringify([
      {
        id: "W1",
        task: "Synthetic test work",
        status: "Doing",
        statusAt: at,
        createdAt: at,
        progress: 25,
        customEvidence: { nested: [false, 0, null] },
        comments: "Preserve me",
      },
    ]),
  );
  await fs.writeFile(
    path.join(root, "data/todo.json"),
    JSON.stringify([
      {
        id: "T1",
        task: "Synthetic todo",
        category: "General",
        done: false,
        doneAt: null,
        createdAt: at,
      },
    ]),
  );
  await fs.writeFile(
    path.join(root, "file-icons.json"),
    JSON.stringify({
      "data/feature.work.json": { icon: "icons/file.svg" },
      "data/todo.json": { icon: "icons/todo.svg" },
    }),
  );
  return { root, store: createStore(root) };
}
test("patches preserve evidence and dates; stale saves cannot overwrite a newer writer", async (t) => {
  const { store } = await fixture(t);
  const first = (await store.workspace()).files.find(
    (f) => f.path === "data/feature.work.json",
  )!;
  await store.save(first.path, first.revision, [
    { id: "W1", comments: "Updated", status: "Done" },
  ]);
  const saved = (await store.workspace()).files.find(
    (f) => f.path === first.path,
  )!;
  assert.equal(saved.rows[0].createdAt, at);
  assert.notEqual(saved.rows[0].statusAt, at);
  assert.deepEqual(saved.rows[0].customEvidence, { nested: [false, 0, null] });
  assert.equal(saved.rows[0].progress, 100);
  await assert.rejects(
    store.save(first.path, first.revision, [{ id: "W1", comments: "stale" }]),
    (e: StoreError) => e.status === 409,
  );
  assert.equal(
    (await store.workspace()).files.find((f) => f.path === first.path)!.rows[0]
      .comments,
    "Updated",
  );
});
test("to-do toggles maintain completion dates; reopening clears misleading 100%", async (t) => {
  const { store } = await fixture(t);
  let f = (await store.workspace()).files.find(
    (f) => f.path === "data/todo.json",
  )!;
  await store.save(f.path, f.revision, [{ id: "T1", done: true }]);
  f = (await store.workspace()).files.find(
    (f) => f.path === f.path && f.path === "data/todo.json",
  )!;
  assert.equal(f.rows[0].done, true);
  assert.equal(f.rows[0].progress, 100);
  assert.ok(f.rows[0].doneAt);
  await store.save(f.path, f.revision, [{ id: "T1", done: false }]);
  f = (await store.workspace()).files.find((f) => f.path === "data/todo.json")!;
  assert.equal(f.rows[0].doneAt, null);
  assert.equal(f.rows[0].progress, undefined);
});
test("path traversal, symlink escapes and deleting permanent todo are rejected", async (t) => {
  const { root, store } = await fixture(t);
  await assert.rejects(
    store.resolveFile("data/../tracker.json"),
    (e: StoreError) => e.status === 400,
  );
  await fs.symlink(
    path.join(root, "file-icons.json"),
    path.join(root, "data/escape.json"),
  );
  await assert.rejects(
    store.resolveFile("data/escape.json"),
    (e: StoreError) => e.status === 400,
  );
  await assert.rejects(
    store.deleteFile("data/todo.json", ""),
    (e: StoreError) => e.status === 403,
  );
});
test("AI patches are validated, immutable dates protected, and concurrent stores share a lock", async (t) => {
  const { root, store } = await fixture(t);
  const f = (await store.workspace()).files.find(
    (f) => f.path === "data/feature.work.json",
  )!;
  for (const patch of [
    { progress: 101 },
    { status: "Analyzing" },
    { difficulty: 0 },
    { createdAt: "2025-01-01T10:00:00Z" },
  ])
    await assert.rejects(store.updateTask(f.path, "W1", patch, f.revision));
  await fs.mkdir(path.join(root, ".petal-write-lock"));
  await assert.rejects(
    createStore(root).save(f.path, f.revision, [{ id: "W1", delete: true }]),
    (e: StoreError) => e.status === 409,
  );
  assert.equal(
    (await store.workspace()).files.find(
      (f) => f.path === "data/feature.work.json",
    )!.rows.length,
    1,
  );
});
test("row deletion and file deletion preserve unrelated files and catalog entries", async (t) => {
  const { root, store } = await fixture(t);
  let f = (await store.workspace()).files.find(
    (f) => f.path === "data/feature.work.json",
  )!;
  await store.save(f.path, f.revision, [{ id: "W1", delete: true }]);
  f = (await store.workspace()).files.find(
    (f) => f.path === "data/feature.work.json",
  )!;
  assert.equal(f.rows.length, 0);
  await store.deleteFile(f.path, f.revision);
  const catalog = JSON.parse(
    await fs.readFile(path.join(root, "file-icons.json"), "utf8"),
  );
  assert.deepEqual(Object.keys(catalog), ["data/todo.json"]);
  assert.equal((await store.workspace()).files[0].rows[0].id, "T1");
});
test("invalid trackers surface per-file errors and new task creation is typed", async (t) => {
  const { root, store } = await fixture(t);
  await fs.writeFile(path.join(root, "data/broken.json"), "[");
  assert.ok(
    (await store.workspace()).files.find((f) => f.path.endsWith("broken.json"))
      ?.error,
  );
  const added = await store.addTask("data/todo.json", "New synthetic todo");
  assert.equal(added.row.done, false);
  assert.equal(added.row.progress, 0);
  assert.ok(added.row.createdAt);
});
test("checkpoint commits only tracker files and excludes writer lock and unrelated staged work", async (t) => {
  const { root } = await fixture(t);
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execute = promisify(execFile);
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), "petal-git-"));
  t.after(() => fs.rm(parent, { recursive: true, force: true }));
  const repo = path.join(parent, "repo"),
    remote = path.join(parent, "remote.git");
  await fs.mkdir(repo);
  const git = (...args: string[]) => execute("git", args, { cwd: repo });
  await git("init", "-b", "main");
  await git("config", "user.email", "fixture@example.test");
  await git("config", "user.name", "Petal fixture");
  await git("init", "--bare", remote);
  await git("remote", "add", "origin", remote);
  await fs.writeFile(path.join(repo, "source.txt"), "initial");
  await git("add", "source.txt");
  await git("commit", "-m", "fixture");
  const dataDir = path.join(repo, ".petal");
  await fs.cp(root, dataDir, { recursive: true });
  await fs.writeFile(path.join(repo, "source.txt"), "unrelated staged edit");
  await git("add", "source.txt");
  const result = await createStore(dataDir).checkpoint();
  assert.equal(result.pushed, true);
  const committed = (await git("show", "--pretty=", "--name-only", "HEAD"))
    .stdout;
  assert.ok(committed.includes(".petal/data/todo.json"));
  assert.ok(!committed.includes("source.txt"));
  assert.ok(!committed.includes(".petal-write-lock"));
  assert.equal(
    (await git("diff", "--cached", "--name-only")).stdout.trim(),
    "source.txt",
  );
});

test("to-do category edits use revision checks and preserve lifecycle dates", async (t) => {
  const { store } = await fixture(t),
    todo = (await store.workspace()).files.find(
      (f) => f.path === "data/todo.json",
    )!;
  await store.save(todo.path, todo.revision, [
    { id: "T1", category: "Personal" },
  ]);
  const saved = (await store.workspace()).files.find(
    (f) => f.path === todo.path,
  )!;
  assert.equal(saved.rows[0].category, "Personal");
  assert.equal(saved.rows[0].createdAt, at);
  assert.equal(saved.rows[0].doneAt, null);
  await assert.rejects(
    store.save(todo.path, todo.revision, [{ id: "T1", category: "Stale" }]),
  );
  const work = (await store.workspace()).files.find(
    (f) => f.path === "data/feature.work.json",
  )!;
  await assert.rejects(
    store.save(work.path, work.revision, [
      { id: "W1", category: "Wrong mode" },
    ]),
  );
});

test("single confirmed deletion returns a revision and preserves unrelated rows and evidence", async (t) => {
  const { store } = await fixture(t);
  await store.addTask("data/todo.json", "Keep this row", "General");
  const before = (await store.workspace()).files.find(
    (f) => f.path === "data/todo.json",
  )!;
  const keep = before.rows.find((r) => r.id !== "T1")!;
  const saved = await store.save(before.path, before.revision, [
    { id: "T1", delete: true },
  ]);
  const after = (await store.workspace()).files.find(
    (f) => f.path === before.path,
  )!;
  assert.equal(saved.revision, after.revision);
  assert.deepEqual(after.rows, [keep]);
  await assert.rejects(
    store.save(before.path, before.revision, [{ id: keep.id, delete: true }]),
  );
});
