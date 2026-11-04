import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { gzipSync } from "node:zlib";
import { iconCatalog, inferIcon } from "../lib/icon-catalog";
import { iconHue } from "../lib/icon-color";
import { createStore } from "../lib/store";
test("bundled icons are unique, compact, safe SVG assets with provenance and required stack logos", async () => {
  assert.ok(iconCatalog.length >= 500);
  assert.equal(new Set(iconCatalog.map((i) => i.id)).size, iconCatalog.length);
  const svg = await Promise.all(
    iconCatalog.map(async (i) => {
      assert.match(i.path, /^icons\/(brand|work)-[a-z0-9._-]+\.svg$/);
      assert.ok(i.source.startsWith("https://"));
      assert.ok(i.license);
      const text = await fs.readFile(i.path, "utf8");
      assert.match(text, /<svg\b/);
      assert.match(text, /viewBox=/);
      assert.doesNotMatch(
        text,
        /<script|<foreignObject|\bon[a-z]+\s*=|<image|<iframe/i,
      );
      return text;
    }),
  );
  assert.ok(gzipSync(svg.join("")).length < 400000);
  for (const id of [
    "brand-posthog",
    "brand-github",
    "brand-docker",
    "brand-nextdotjs",
    "brand-nodedotjs",
    "work-server",
    "work-bug",
    "work-bug-off",
    "work-bug-play",
  ])
    assert.ok(
      iconCatalog.some((i) => i.id === id),
      id,
    );
});
test("icon inference matches providers before generic work and tint is stable per collection", () => {
  assert.equal(
    inferIcon("data/bug.posthog-quota.json"),
    "icons/brand-posthog.svg",
  );
  assert.equal(
    inferIcon("data/feature.nextjs.json"),
    "icons/brand-nextdotjs.svg",
  );
  assert.equal(
    inferIcon("data/bug.regression.json"),
    "icons/work-bug-play.svg",
  );
  assert.equal(inferIcon("data/bug.server.json"), "icons/work-server.svg");
  assert.equal(
    inferIcon("data/todo.json", ["Check Cloudflare logs"]),
    "icons/work-list-todo.svg",
  );
  assert.equal(
    inferIcon("data/migration/bug.archive.json", ["Discord history"]),
    "icons/work-archive-restore.svg",
  );
  assert.equal(iconHue("data/a.json"), iconHue("data/a.json"));
  assert.notEqual(
    iconHue("data/bug.posthog.json"),
    iconHue("data/feature.posthog.json"),
  );
});
test("icon assignment preserves tracker bytes and unrelated catalog metadata, rejecting unknown icons and paths", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "petal-icons-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "data"));
  const rows = "[]\n";
  await fs.writeFile(path.join(root, "data/todo.json"), rows);
  await fs.writeFile(
    path.join(root, "file-icons.json"),
    JSON.stringify({
      "data/todo.json": { icon: "icons/todo.svg", retained: "keep" },
      "data/unrelated.json": { icon: "icons/file.svg" },
    }),
  );
  const store = createStore(root);
  await store.assignIcon("data/todo.json", "brand-posthog");
  const catalog = JSON.parse(
    await fs.readFile(path.join(root, "file-icons.json"), "utf8"),
  );
  assert.equal(catalog["data/todo.json"].retained, "keep");
  assert.deepEqual(catalog["data/unrelated.json"], { icon: "icons/file.svg" });
  assert.equal(
    await fs.readFile(path.join(root, "data/todo.json"), "utf8"),
    rows,
  );
  await assert.rejects(store.assignIcon("data/todo.json", "not-a-real-icon"));
  await assert.rejects(store.assignIcon("../outside.json", "work-bug"));
  await store.autoIcons();
  assert.equal(
    await fs.readFile(path.join(root, "data/todo.json"), "utf8"),
    rows,
  );
});
