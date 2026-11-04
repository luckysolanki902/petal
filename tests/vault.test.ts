import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createStore } from "../lib/store";

test("shared repository imports exact JSON, keeps IDs and sources, checkpoints all projects locally, and settings never push", async (t) => {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), "petal-vault-"));
  t.after(() => fs.rm(home, { recursive: true, force: true }));
  process.env.PETAL_HOME = home;
  const vault = await import("../lib/vault");
  const registry = [];
  for (const id of ["alpha", "beta"]) {
    const root = path.join(home, "source-" + id);
    await fs.mkdir(path.join(root, "data"), { recursive: true });
    await fs.mkdir(path.join(root, "migrations"));
    await fs.writeFile(path.join(root, "data/todo.json"), "[]\n");
    await fs.writeFile(
      path.join(root, "file-icons.json"),
      '{"data/todo.json":{"icon":"icons/todo.svg"}}\n',
    );
    await fs.writeFile(
      path.join(root, "migrations/audit.json"),
      '{"nested":[false,0,null]}\n',
    );
    registry.push({ id, name: id, root, dataDir: root });
  }
  await fs.writeFile(
    path.join(home, "projects.json"),
    JSON.stringify(registry),
  );
  // A previous interrupted import can be safely adopted only when byte-identical.
  await vault.ensureVault();
  await vault.importProject(registry[0]);
  const migrated = await vault.projects();
  assert.deepEqual(
    migrated.map((p) => p.id),
    ["alpha", "beta"],
  );
  assert.deepEqual(await vault.projects(), migrated);
  for (let i = 0; i < migrated.length; i++) {
    assert.equal(
      migrated[i].dataDir,
      path.join(vault.vaultDir, "projects", registry[i].id),
    );
    for (const name of [
      "data/todo.json",
      "file-icons.json",
      "migrations/audit.json",
    ]) {
      assert.deepEqual(
        await fs.readFile(path.join(migrated[i].dataDir, name)),
        await fs.readFile(path.join(registry[i].dataDir, name)),
      );
    }
  }
  assert.equal((await vault.storageSettings()).origin, "");
  const checkpoint = await createStore(
    migrated[0].dataDir,
    vault.vaultDir,
  ).checkpoint();
  assert.equal(checkpoint.pushed, false);
  assert.ok(checkpoint.commit);
  const committed = await vault.gitVault(
    "ls-tree",
    "-r",
    "--name-only",
    "HEAD",
  );
  assert.match(committed, /projects\/alpha\/data\/todo.json/);
  assert.match(committed, /projects\/beta\/migrations\/audit.json/);
  assert.doesNotMatch(committed, /write-lock|owner.json/);
  await vault.setStorageOrigin("git@example.test:person/private-data.git");
  assert.equal(
    (await vault.storageSettings()).origin,
    "git@example.test:person/private-data.git",
  );
  assert.equal(
    await vault.gitVault("rev-parse", "--short", "HEAD"),
    checkpoint.commit,
  );
  await assert.rejects(vault.setStorageOrigin("--upload-pack=bad"));
  await assert.rejects(
    vault.setStorageOrigin("https://user:password@example.test/repo.git"),
  );
  await vault.setStorageOrigin("");
  assert.equal((await vault.storageSettings()).origin, "");
  await fs.mkdir(path.join(vault.vaultDir, ".petal-write-lock"));
  await assert.rejects(
    createStore(migrated[1].dataDir, vault.vaultDir).addTask(
      "data/todo.json",
      "must not write",
    ),
  );
});
