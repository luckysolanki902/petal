import { workspaceSounds } from "../lib/notification-sounds";
import test from "node:test";
import assert from "node:assert/strict";
import {
  observeActivity,
  EMPTY_NOTIFICATIONS,
  noticeURL,
  parseNotifications,
  type ActivityRow,
} from "../lib/notifications";
const row: ActivityRow = {
  project: "alpha",
  workspace: "Alpha",
  file: "data/feature.work.json",
  row: "W1",
  title: "Synthetic task",
  status: "To do",
  done: false,
  todo: false,
};
const snap = (rows: ActivityRow[], unavailable: string[] = []) => ({
  projects: [
    { id: "alpha", name: "Alpha" },
    { id: "beta", name: "Beta" },
  ],
  rows,
  unavailable,
});
test("notifications baseline quietly, detect status and todo changes across workspaces once, and stay clear after clearing history", () => {
  const todo = {
    ...row,
    project: "beta",
    workspace: "Beta",
    file: "data/todo.json",
    row: "T1",
    todo: true,
  };
  const first = observeActivity(
    structuredClone(EMPTY_NOTIFICATIONS),
    snap([row, todo]),
  );
  assert.equal(first.added.length, 0);
  let id = 0;
  const second = observeActivity(
    first.state,
    snap([
      { ...row, status: "Doing" },
      { ...todo, done: true },
    ]),
    "2026-11-04T10:00:00Z",
    () => String(++id),
  );
  assert.equal(second.added.length, 2);
  assert.ok(second.added.some((n) => n.todo && n.done));
  assert.ok(
    second.added.some((n) => n.previous === "To do" && n.status === "Doing"),
  );
  const repeat = observeActivity(
    second.state,
    snap([
      { ...row, status: "Doing" },
      { ...todo, done: true },
    ]),
  );
  assert.equal(repeat.added.length, 0);
  const cleared = observeActivity(
    { ...repeat.state, notices: [] },
    snap([
      { ...row, status: "Doing" },
      { ...todo, done: true },
    ]),
  );
  assert.equal(cleared.state.notices.length, 0);
  const unavailable = observeActivity(
    cleared.state,
    snap([], ["alpha", "beta"]),
  );
  assert.equal(Object.keys(unavailable.state.baseline).length, 2);
  assert.equal(
    observeActivity(
      unavailable.state,
      snap([
        { ...row, status: "Done" },
        { ...todo, done: true },
      ]),
    ).added.length,
    1,
  );
  const href = noticeURL({ ...second.added[0], row: "T /?&" });
  assert.equal(
    new URL(href, "http://localhost").searchParams.get("row"),
    "T /?&",
  );
  assert.deepEqual(
    parseNotifications(JSON.stringify(second.state)),
    second.state,
  );
  assert.throws(() => parseNotifications('{"notices":[1]}'));
});

test("late snapshots cannot replay a newer transition or resurrect cleared history", () => {
  const state = observeActivity(EMPTY_NOTIFICATIONS, {
    ...snap([row]),
    observedAt: 100,
  }).state;
  const changed = observeActivity(state, {
    ...snap([{ ...row, status: "Done" }]),
    observedAt: 200,
  }).state;
  assert.equal(
    observeActivity(changed, { ...snap([row]), observedAt: 150 }).added.length,
    0,
  );
  assert.equal(
    observeActivity(
      { ...changed, notices: [] },
      { ...snap([row]), observedAt: 150 },
    ).state.notices.length,
    0,
  );
});

test("new workspace sounds use an available profile without changing existing choices", () => {
  assert.deepEqual(workspaceSounds(["a", "b", "c"], { a: 2, b: 0 }), {
    a: 2,
    b: 0,
    c: 1,
  });
  assert.deepEqual(workspaceSounds(["a", "b"], {}), { a: 0, b: 1 });
  const all = workspaceSounds(["a", "b", "c", "d", "e", "f", "g"], {});
  assert.equal(Object.keys(all).length, 7);
  assert.equal(new Set(Object.values(all)).size, 6);
});
