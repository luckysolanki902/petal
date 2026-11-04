import { projects, projectStore } from "./registry";
import { StoreError } from "./store";
import { TODO, isComplete } from "./model";
import { storageSettings, setStorageOrigin } from "./vault";
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;
const MAX = 20 * 1024 * 1024;
export async function handle(
  request: Request,
  action: string,
): Promise<Response> {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (origin && LOCAL.test(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  const reply = (body: unknown, status = 200) =>
    Response.json(body, { status, headers });
  try {
    if (!LOCAL.test(new URL(request.url).origin))
      throw new StoreError(403, "Only local requests are allowed.");
    if (origin && !LOCAL.test(origin))
      throw new StoreError(403, "External origins are not allowed.");
    if (request.method === "OPTIONS")
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          "Access-Control-Allow-Methods": "GET, POST, DELETE",
          "Access-Control-Allow-Headers":
            "Content-Type, X-Progress-Save, X-Progress-Delete, X-Progress-Checkpoint",
        },
      });
    if (request.method === "GET" && action === "health")
      return reply({
        app: "petal",
        pid: process.pid,
        instance: process.env.PETAL_INSTANCE,
      });
    if (request.method === "GET" && action === "projects")
      return reply({ projects: await projects() });
    if (request.method === "GET" && action === "settings")
      return reply(await storageSettings());
    const selected = await projectStore(
      new URL(request.url).searchParams.get("project"),
    );
    const { store } = selected;
    if (request.method === "GET") {
      if (action === "workspace") {
        const workspace = await store.workspace();
        const projectSummaries = await Promise.all(
          selected.projects.map(async (project) => {
            try {
              const data =
                project.id === selected.project.id
                  ? workspace
                  : await (await projectStore(project.id)).store.workspace();
              const progressFiles = data.files.filter((f) => f.path !== TODO),
                todo = data.files.find((f) => f.path === TODO);
              return {
                id: project.id,
                progress: progressFiles.some((f) => f.error)
                  ? null
                  : progressFiles.reduce(
                      (n, f) =>
                        n +
                        f.rows.filter(
                          (row) => !isComplete(row, f.path, data.configuration),
                        ).length,
                      0,
                    ),
                todos: todo?.error
                  ? null
                  : todo?.rows.filter((row) => !row.done).length || 0,
              };
            } catch (error) {
              console.error(`[petal:project-summary] ${project.id}`, error);
              return {
                id: project.id,
                progress: null,
                todos: null,
                error: "Counts unavailable",
              };
            }
          }),
        );
        return reply({
          ...workspace,
          projectSummaries,
          projects: selected.projects,
          project: selected.project,
        });
      }
      if (action === "project-configuration")
        return reply(await store.projectConfiguration());
      if (action === "files") return reply({ files: await store.list() });
      if (["__save", "__delete", "__checkpoint"].includes(action))
        return reply({
          ok: true,
          deleteSupported: true,
          checkpointSupported: true,
        });
      throw new StoreError(404, "Unknown endpoint.");
    }
    const kind =
      action === "__checkpoint"
        ? "Checkpoint"
        : action === "__delete"
          ? "Delete"
          : "Save";
    if (request.headers.get(`X-Progress-${kind}`) !== "1")
      throw new StoreError(403, `Missing X-Progress-${kind} header.`);
    if (request.method !== (kind === "Delete" ? "DELETE" : "POST"))
      throw new StoreError(405, "Method not allowed.");
    if (kind === "Checkpoint") return reply(await store.checkpoint());
    const reader = request.body?.getReader();
    if (!reader) throw new StoreError(400, "Missing request body.");
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX) {
        await reader.cancel();
        throw new StoreError(413, "Request is too large.");
      }
      chunks.push(value);
    }
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new StoreError(400, "Body is not valid JSON.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new StoreError(400, "Expected a JSON object.");
    if (action === "settings")
      return reply(await setStorageOrigin(body.origin));
    if (action === "project-configuration-import") {
      if (typeof body.sourceProject !== "string")
        throw new StoreError(400, "Choose a registered source workspace.");
      const source = await projectStore(body.sourceProject);
      return reply({
        configuration: (await source.store.projectConfiguration())
          .configuration,
        source: { id: source.project.id, name: source.project.name },
      });
    }
    if (action === "project-configuration-preview")
      return reply(
        await store.previewConfiguration(
          body.configuration,
          body.revision,
          body.mapping,
        ),
      );
    if (action === "project-configuration")
      return reply(
        await store.saveConfiguration(
          body.configuration,
          body.revision,
          body.mapping,
          body.token,
        ),
      );
    if (typeof body.file !== "string")
      throw new StoreError(400, "Missing file path.");
    if (kind === "Delete")
      return reply(await store.deleteFile(body.file, body.revision));
    if (action === "__task")
      return reply(await store.addTask(body.file, body.title, body.category));
    if (action !== "__save") throw new StoreError(404, "Unknown endpoint.");
    return reply(
      body.edits
        ? await store.save(body.file, body.revision, body.edits)
        : await store.saveRows(body.file, body.rows, body.baseRows),
    );
  } catch (error) {
    console.error(`[progress:${action}] ${request.method} failed`, error);
    return reply(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error",
        details: error instanceof StoreError ? error.details : undefined,
      },
      error instanceof StoreError ? error.status : 500,
    );
  }
}
