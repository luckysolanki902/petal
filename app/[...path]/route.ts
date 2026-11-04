import { projectStore } from "../../lib/registry";
import { promises as fs } from "node:fs";
import path from "node:path";
import { handle } from "../../lib/http";
import { StoreError } from "../../lib/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
async function dispatch(request: Request, context: Context) {
  const parts = (await context.params).path;
  const name = parts.join("/");
  if (name.startsWith("__") || name.startsWith("api/"))
    return handle(request, name.replace(/^api\//, ""));
  if (request.method !== "GET")
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  try {
    let file: string;
    let mime = "application/json";
    if (name.startsWith("data/"))
      file = await (
        await projectStore(new URL(request.url).searchParams.get("project"))
      ).store.resolveFile(name);
    else if (
      [
        "file-icons.json",
        "opened-date-estimates.json",
        "tracker.schema.json",
        "tracker-validator.js",
      ].includes(name)
    ) {
      const metadataRoot = [
        "file-icons.json",
        "opened-date-estimates.json",
      ].includes(name)
        ? (await projectStore(new URL(request.url).searchParams.get("project")))
            .project.dataDir
        : process.cwd();
      file = path.join(/* turbopackIgnore: true */ metadataRoot, name);
      if (name.endsWith(".js")) mime = "application/javascript";
    } else if (/^icons\/[a-z0-9._-]+\.(svg|png|webp)$/i.test(name)) {
      file = path.join(/* turbopackIgnore: true */ process.cwd(), name);
      mime = name.endsWith(".svg")
        ? "image/svg+xml"
        : name.endsWith(".png")
          ? "image/png"
          : "image/webp";
    } else return Response.json({ error: "Not found" }, { status: 404 });
    return new Response(
      new Uint8Array(await fs.readFile(/* turbopackIgnore: true */ file)),
      {
        headers: {
          "Content-Type": mime,
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    console.error(`[progress:read] ${name}`, error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not read file" },
      {
        status:
          error instanceof StoreError
            ? error.status
            : (error as NodeJS.ErrnoException).code === "ENOENT"
              ? 404
              : 500,
      },
    );
  }
}
export {
  dispatch as GET,
  dispatch as POST,
  dispatch as DELETE,
  dispatch as OPTIONS,
};
