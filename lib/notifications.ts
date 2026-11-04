export type ActivityRow = {
  project: string;
  workspace: string;
  file: string;
  row: string;
  title: string;
  status: string;
  done: boolean;
  todo: boolean;
};
export type ActivitySnapshot = {
  observedAt?: number;
  projects: { id: string; name: string }[];
  rows: ActivityRow[];
  unavailable: string[];
};
export type Notice = ActivityRow & {
  id: string;
  at: string;
  previous: string;
  read: boolean;
};
export type NotificationState = {
  observedAt?: number;
  baseline: Record<string, ActivityRow>;
  notices: Notice[];
};
export const EMPTY_NOTIFICATIONS: NotificationState = {
  baseline: {},
  notices: [],
};
export const activityKey = (r: ActivityRow) =>
  JSON.stringify([r.project, r.file, r.row]);
export function observeActivity(
  state: NotificationState,
  snapshot: ActivitySnapshot,
  now = new Date().toISOString(),
  id = () => crypto.randomUUID(),
): { state: NotificationState; added: Notice[] } {
  if (
    snapshot.observedAt &&
    state.observedAt &&
    snapshot.observedAt <= state.observedAt
  )
    return { state, added: [] };
  const baseline: Record<string, ActivityRow> = {};
  for (const [key, row] of Object.entries(state.baseline))
    if (snapshot.unavailable.includes(row.project)) baseline[key] = row;
  const added: Notice[] = [];
  for (const row of snapshot.rows) {
    const key = activityKey(row),
      before = state.baseline[key];
    baseline[key] = row;
    if (
      before &&
      (row.todo ? row.done !== before.done : row.status !== before.status)
    )
      added.push({
        ...row,
        previous: row.todo ? (before.done ? "Done" : "To do") : before.status,
        id: id(),
        at: now,
        read: false,
      });
  }
  return {
    state: {
      observedAt: snapshot.observedAt,
      baseline,
      notices: [...added.reverse(), ...state.notices].slice(0, 200),
    },
    added,
  };
}
export function noticeURL(n: Pick<Notice, "project" | "file" | "row" | "id">) {
  return (
    "/?" +
    new URLSearchParams({
      project: n.project,
      file: n.file,
      row: n.row,
      notice: n.id,
    }).toString()
  );
}
export function noticeChange(n: Notice) {
  return n.todo
    ? n.done
      ? "To-do completed"
      : "To-do reopened"
    : `${n.previous} → ${n.status}`;
}
export function parseNotifications(text: string | null): NotificationState {
  if (!text) return structuredClone(EMPTY_NOTIFICATIONS);
  const s = JSON.parse(text);
  const row = (r: any) =>
    r &&
    ["project", "workspace", "file", "row", "title", "status"].every(
      (k) => typeof r[k] === "string",
    ) &&
    typeof r.done === "boolean" &&
    typeof r.todo === "boolean";
  if (
    !s ||
    typeof s.baseline !== "object" ||
    !s.baseline ||
    Array.isArray(s.baseline) ||
    !Object.values(s.baseline).every(row) ||
    !Array.isArray(s.notices) ||
    !s.notices.every(
      (n: any) =>
        row(n) &&
        typeof n.id === "string" &&
        typeof n.at === "string" &&
        typeof n.previous === "string" &&
        typeof n.read === "boolean",
    )
  )
    throw Error("Saved notification history is invalid.");
  return {
    observedAt: typeof s.observedAt === "number" ? s.observedAt : undefined,
    baseline: s.baseline,
    notices: s.notices.slice(0, 200),
  };
}
