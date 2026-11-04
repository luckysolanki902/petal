import { projects, projectStore } from "./registry";
import { TODO } from "./model";
import type { ActivitySnapshot } from "./notifications";
export async function activitySnapshot(): Promise<ActivitySnapshot> {
  const observedAt = Date.now();
  const all = await projects();
  const results = await Promise.all(
    all.map(async (p) => {
      try {
        const data = await (await projectStore(p.id)).store.workspace();
        if (data.files.some((f) => f.error))
          throw Error("Some tracker files could not be read.");
        return {
          rows: data.files.flatMap((f) =>
            f.rows.map((r) => ({
              project: p.id,
              workspace: p.name,
              file: f.path,
              row: r.id,
              title: String(r.task || r.bug || r.id),
              status: String(r.status || ""),
              done: r.done === true,
              todo: f.path === TODO,
            })),
          ),
          error: false,
        };
      } catch (error) {
        console.error(`[petal:activity] ${p.id}`, error);
        return { rows: [], error: true };
      }
    }),
  );
  return {
    observedAt,
    projects: all.map((p) => ({ id: p.id, name: p.name })),
    rows: results.flatMap((r) => r.rows),
    unavailable: all.filter((_, i) => results[i].error).map((p) => p.id),
  };
}
