import { createStore, StoreError } from "./store";
import { projects, vaultDir } from "./vault";
export { projects, configDir } from "./vault";
export type { Project } from "./vault";
const cache = new Map<string, ReturnType<typeof createStore>>();
export async function projectStore(id: string | null) {
  const all = await projects();
  const project = id ? all.find((p) => p.id === id) : all[0];
  if (!project)
    throw new StoreError(
      404,
      "No project selected. Run petal init in a project, or petal register PATH --data PATH.",
    );
  let store = cache.get(project.dataDir);
  if (!store) {
    store = createStore(project.dataDir, vaultDir);
    cache.set(project.dataDir, store);
  }
  return { store, project, projects: all };
}
