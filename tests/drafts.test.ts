import test from "node:test";
import assert from "node:assert/strict";
import { afterSidebarDelete } from "../lib/drafts";
test("confirmed sidebar deletion drops only its own draft and preserves other pending edits and deletions", () => {
  const drafts = {
    "data/todo.json": {
      revision: "old",
      edits: {
        T1: { id: "T1", comments: "Own unsaved note" },
        T2: { id: "T2", delete: true },
        T3: { id: "T3", comments: "Keep draft" },
      },
    },
    "data/work.json": {
      revision: "another",
      edits: { W1: { id: "W1", delete: true } },
    },
  };
  const result = afterSidebarDelete(
    drafts,
    "data/todo.json",
    "T1",
    "old",
    "new",
  );
  assert.equal(result["data/todo.json"].revision, "new");
  assert.equal(result["data/todo.json"].edits.T1, undefined);
  assert.deepEqual(
    result["data/todo.json"].edits.T2,
    drafts["data/todo.json"].edits.T2,
  );
  assert.deepEqual(
    result["data/todo.json"].edits.T3,
    drafts["data/todo.json"].edits.T3,
  );
  assert.equal(result["data/work.json"], drafts["data/work.json"]);
  assert.ok(drafts["data/todo.json"].edits.T1);
  assert.equal(
    afterSidebarDelete(drafts, "data/todo.json", "T1", "unmatched", "new")[
      "data/todo.json"
    ].revision,
    "old",
  );
});
