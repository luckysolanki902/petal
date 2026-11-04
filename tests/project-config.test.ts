import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createStore, StoreError } from "../lib/store";
import {
  DEFAULT_CONFIGURATION,
  configurationErrors,
} from "../lib/project-config";
const at = "2026-01-01T10:00:00Z",
  file = "data/feature.work.json";
async function fixture(t: any) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "petal-config-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "data"));
  await fs.writeFile(
    path.join(root, file),
    JSON.stringify([
      {
        id: "W1",
        task: "Synthetic work",
        status: "Doing",
        statusAt: at,
        createdAt: at,
        progress: 40,
        comments: "Keep",
        proof: { nested: [false, 0, null] },
      },
    ]),
  );
  await fs.writeFile(path.join(root, "data/todo.json"), "[]");
  await fs.writeFile(
    path.join(root, "file-icons.json"),
    JSON.stringify({
      [file]: { icon: "icons/file.svg" },
      "data/todo.json": { icon: "icons/todo.svg" },
    }),
  );
  return { root, store: createStore(root) };
}
test("project workflows require explicit mappings and a fresh preview, preserving dates and evidence", async (t) => {
  const { root, store } = await fixture(t),
    other = await fixture(t);
  const initial = await store.projectConfiguration(),
    configuration = structuredClone(initial.configuration);
  configuration.statuses = [
    { name: "Planned", complete: false, color: 210 },
    { name: "Review", complete: false, color: 260 },
    { name: "Shipped", complete: true, color: 150 },
  ];
  configuration.fields = [
    { key: "effortPoints", label: "Effort points", type: "number" },
  ];
  await assert.rejects(
    store.previewConfiguration(configuration, initial.revision, {}),
    (e) => (e as StoreError).status === 422,
  );
  const mapping = { Doing: "Review" },
    preview = await store.previewConfiguration(
      configuration,
      initial.revision,
      mapping,
    );
  const before = (await store.workspace()).files.find((f) => f.path === file)!;
  await store.save(file, before.revision, [{ id: "W1", comments: "New note" }]);
  await assert.rejects(
    store.saveConfiguration(
      configuration,
      initial.revision,
      mapping,
      preview.token,
    ),
    (e) => (e as StoreError).status === 409,
  );
  const fresh = await store.previewConfiguration(
    configuration,
    initial.revision,
    mapping,
  );
  await store.saveConfiguration(
    configuration,
    initial.revision,
    mapping,
    fresh.token,
  );
  const migrated = (await store.workspace()).files.find(
    (f) => f.path === file,
  )!;
  assert.equal(migrated.rows[0].status, "Review");
  assert.equal(migrated.rows[0].createdAt, at);
  assert.equal(migrated.rows[0].statusAt, at);
  assert.equal(migrated.rows[0].comments, "New note");
  assert.deepEqual(migrated.rows[0].proof, { nested: [false, 0, null] });
  assert.deepEqual(
    (await other.store.projectConfiguration()).configuration,
    DEFAULT_CONFIGURATION,
  );
  await store.save(file, migrated.revision, [
    { id: "W1", status: "Shipped", fields: { effortPoints: 3 } },
  ]);
  let current = (await store.workspace()).files.find((f) => f.path === file)!;
  assert.equal(current.rows[0].progress, 100);
  assert.equal(current.rows[0].effortPoints, 3);
  await assert.rejects(
    store.save(file, current.revision, [
      { id: "W1", fields: { effortPoints: "bad" } },
    ]),
  );
  await assert.rejects(
    store.save(file, current.revision, [
      { id: "W1", fields: { createdAt: "bad" } },
    ]),
  );
  await store.updateTask(
    file,
    "W1",
    { status: "Review", effortPoints: null },
    current.revision,
  );
  current = (await store.workspace()).files.find((f) => f.path === file)!;
  assert.equal(current.rows[0].progress, undefined);
  assert.equal(current.rows[0].effortPoints, undefined);
  const added = await store.addTask(file, "Another synthetic item");
  assert.equal(added.row.status, "Planned");
  assert.ok(
    (await fs.readdir(path.join(root, "migrations"))).some((n) =>
      n.startsWith("project-settings-"),
    ),
  );
});
test("invalid configuration never writes, and completion rule changes normalize progress", async (t) => {
  const { store } = await fixture(t),
    base = await store.projectConfiguration();
  for (const patch of [
    { statuses: [] },
    { fields: [{ key: "id", label: "ID", type: "text" }] },
    { statuses: [{ name: 5, complete: true, color: 0 }] },
    {
      categories: [
        { name: "Duplicate", color: 2 },
        { name: "duplicate", color: 3 },
      ],
    },
  ]) {
    const config = { ...base.configuration, ...patch };
    assert.ok(configurationErrors(config).length);
    await assert.rejects(store.previewConfiguration(config, base.revision, {}));
  }
  const config = structuredClone(base.configuration);
  config.statuses.find((s) => s.name === "Doing")!.complete = true;
  const preview = await store.previewConfiguration(config, base.revision, {});
  await store.saveConfiguration(config, base.revision, {}, preview.token);
  assert.equal(
    (await store.workspace()).files.find((f) => f.path === file)!.rows[0]
      .progress,
    100,
  );
  await assert.rejects(
    store.saveConfiguration(config, base.revision, {}, preview.token),
    (e) => (e as StoreError).status === 409,
  );
});
test("interrupted multi-file settings migration is rolled back before the next read", async (t) => {
  const { root, store } = await fixture(t),
    before = await fs.readFile(path.join(root, file), "utf8");
  await fs.writeFile(path.join(root, file), "[]");
  await fs.writeFile(
    path.join(root, "project-settings.json"),
    JSON.stringify({ ...DEFAULT_CONFIGURATION, statuses: [] }),
  );
  await fs.writeFile(
    path.join(root, ".petal-config-transaction.json"),
    JSON.stringify({
      state: "pending",
      beforeConfiguration: null,
      afterConfiguration: JSON.stringify({
        ...DEFAULT_CONFIGURATION,
        statuses: [],
      }),
      files: [{ file, before, after: "[]" }],
    }),
  );
  const ws = await store.workspace();
  assert.equal(ws.files.find((f) => f.path === file)!.rows[0].id, "W1");
  assert.deepEqual(ws.configuration, DEFAULT_CONFIGURATION);
  await assert.rejects(
    fs.access(path.join(root, ".petal-config-transaction.json")),
  );
});

test("recovery refuses to overwrite edits made outside an unfinished migration", async (t) => {
  const { root, store } = await fixture(t),
    before = await fs.readFile(path.join(root, file), "utf8");
  const outside = before.replace('"Keep"', '"External edit"');
  await fs.writeFile(path.join(root, file), outside);
  await fs.writeFile(
    path.join(root, ".petal-config-transaction.json"),
    JSON.stringify({
      state: "pending",
      beforeConfiguration: null,
      afterConfiguration: "{}",
      files: [{ file, before, after: "[]" }],
    }),
  );
  await assert.rejects(
    store.workspace(),
    (e) => (e as StoreError).status === 503,
  );
  assert.equal(await fs.readFile(path.join(root, file), "utf8"), outside);
});

test("a failure after row and configuration writes rolls the real transaction back", async (t) => {
  const { root, store } = await fixture(t),
    base = await store.projectConfiguration(),
    before = await fs.readFile(path.join(root, file), "utf8"),
    config = structuredClone(base.configuration);
  config.statuses.find((s) => s.name === "Doing")!.name = "Review";
  const mapping = { Doing: "Review" },
    preview = await store.previewConfiguration(config, base.revision, mapping);
  await fs.writeFile(path.join(root, "migrations"), "Synthetic obstruction");
  await assert.rejects(
    store.saveConfiguration(config, base.revision, mapping, preview.token),
  );
  assert.equal(await fs.readFile(path.join(root, file), "utf8"), before);
  assert.deepEqual(
    (await store.projectConfiguration()).configuration,
    DEFAULT_CONFIGURATION,
  );
  await assert.rejects(
    fs.access(path.join(root, ".petal-config-transaction.json")),
  );
});

test("renaming an unfinished status preserves agent-assessed progress", async (t) => {
  const { store } = await fixture(t),
    fileState = (await store.workspace()).files.find((f) => f.path === file)!;
  await store.updateTask(file, "W1", { progress: 100 }, fileState.revision);
  const base = await store.projectConfiguration(),
    config = structuredClone(base.configuration);
  config.statuses.find((s) => s.name === "Doing")!.name = "Building";
  const mapping = { Doing: "Building" },
    preview = await store.previewConfiguration(config, base.revision, mapping);
  await store.saveConfiguration(config, base.revision, mapping, preview.token);
  assert.equal(
    (await store.workspace()).files.find((f) => f.path === file)!.rows[0]
      .progress,
    100,
  );
});
