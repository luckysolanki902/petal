import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isDeepStrictEqual } from "node:util";
import type { Row, Edit, Workspace } from "./model";
import { STATUSES, TODO } from "./model";
const execute = promisify(execFile);
const require = createRequire(import.meta.url);
const validator = require("../tracker-validator.js") as {
  checkRows: (
    rows: unknown,
    file: string,
  ) => { valid: boolean; errors: string[] };
  schemaHash: string;
};
export class StoreError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
export function createStore(root: string, repositoryRoot: string = root) {
  let busy = false;
  async function locked<T>(work: () => Promise<T>) {
    if (busy)
      throw new StoreError(
        409,
        "Another operation is running; try again shortly.",
      );
    busy = true;
    const lock = path.join(repositoryRoot, ".petal-write-lock");
    let acquired = false;
    try {
      try {
        await fs.mkdir(lock);
        acquired = true;
        await fs.writeFile(
          path.join(lock, "owner.json"),
          JSON.stringify({ pid: process.pid, at: new Date().toISOString() }),
        );
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EEXIST")
          throw new StoreError(
            409,
            `Another Petal writer holds ${lock}. If its process is no longer running, remove the stale lock and retry.`,
          );
        throw error;
      }
      return await work();
    } finally {
      if (acquired) await fs.rm(lock, { recursive: true, force: true });
      busy = false;
    }
  }
  async function json(file: string) {
    return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
  }
  async function validate(rows: unknown, file: string) {
    const schema = JSON.parse(
      await fs.readFile(
        path.join(
          process.env.PETAL_APP_ROOT || process.cwd(),
          "tracker.schema.json",
        ),
        "utf8",
      ),
    );
    if (digest(JSON.stringify(schema)) !== validator.schemaHash)
      throw new StoreError(
        503,
        "Tracker validator is stale. Run npm run build:validator before saving.",
      );
    const result = validator.checkRows(rows, file);
    if (!result.valid)
      throw new StoreError(422, `Invalid tracker ${file}`, result.errors);
  }
  async function resolveFile(file: string) {
    if (
      typeof file !== "string" ||
      !/^data\/.+\.json$/.test(file) ||
      file.split("/").some((p) => p === ".." || p === ".") ||
      file.includes("\\")
    )
      throw new StoreError(400, "Expected a JSON file inside data/.");
    let resolved: string;
    try {
      resolved = await fs.realpath(path.join(root, file));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT")
        throw new StoreError(404, `${file} no longer exists.`);
      throw error;
    }
    const dataRoot = await fs.realpath(path.join(root, "data"));
    if (!resolved.startsWith(dataRoot + path.sep))
      throw new StoreError(400, "File must stay inside data/.");
    if (!(await fs.stat(resolved)).isFile())
      throw new StoreError(400, "Expected a file.");
    return resolved;
  }
  async function atomic(file: string, value: unknown) {
    const temp = `${file}.${randomUUID()}.tmp`;
    try {
      await fs.writeFile(temp, JSON.stringify(value, null, 2) + "\n", {
        flag: "wx",
      });
      await fs.rename(temp, file);
    } finally {
      await fs.rm(temp, { force: true });
    }
  }
  async function list(dir = "data"): Promise<string[]> {
    const entries = await fs.readdir(
      /* turbopackIgnore: true */ path.join(
        /* turbopackIgnore: true */ root,
        dir,
      ),
      { withFileTypes: true },
    );
    const arrays = await Promise.all(
      entries.map(async (e) =>
        e.isDirectory()
          ? list(`${dir}/${e.name}`)
          : e.isFile() && e.name.endsWith(".json")
            ? [`${dir}/${e.name}`]
            : [],
      ),
    );
    return arrays.flat().sort();
  }
  async function workspace(): Promise<Omit<Workspace, "projects" | "project">> {
    const warnings: string[] = [];
    let icons: Record<string, { icon: string }> = {};
    let estimates: Workspace["estimates"] = [];
    try {
      icons = await json("file-icons.json");
      if (!icons || typeof icons !== "object" || Array.isArray(icons))
        throw new Error("Expected an icon map");
    } catch (error) {
      warnings.push(`file-icons.json: ${String(error)}`);
      icons = {};
    }
    try {
      const value = await json("opened-date-estimates.json");
      const rows = Array.isArray(value) ? value : value.rows;
      if (!Array.isArray(rows)) throw new Error("Expected estimates rows");
      estimates = rows;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT")
        warnings.push(`opened-date-estimates.json: ${String(error)}`);
    }
    const files = await Promise.all(
      (await list()).map(async (file) => {
        let icon = icons[file]?.icon || "icons/file.svg";
        if (
          !/^icons\/[a-z0-9._-]+\.(svg|png|webp)$/i.test(icon) &&
          !/^https:\/\//.test(icon)
        )
          icon = "icons/file.svg";
        try {
          const text = await fs.readFile(await resolveFile(file), "utf8");
          const rows = JSON.parse(text);
          await validate(rows, file);
          return { path: file, rows, revision: digest(text), icon };
        } catch (error) {
          return {
            path: file,
            rows: [],
            revision: "",
            icon,
            error:
              error instanceof StoreError
                ? `${error.message}: ${JSON.stringify(error.details || "")}`
                : String(error),
          };
        }
      }),
    );
    return { files, estimates, warnings };
  }
  async function save(file: string, revision: string, edits: Edit[]) {
    return locked(async () => {
      if (!Array.isArray(edits) || !edits.length)
        throw new StoreError(400, "No edits supplied.");
      const resolved = await resolveFile(file);
      const text = await fs.readFile(resolved, "utf8");
      if (typeof revision !== "string" || digest(text) !== revision)
        throw new StoreError(
          409,
          `${file} changed since you started editing. Your draft is kept. Reload the latest file and review it before retrying.`,
        );
      const rows: Row[] = JSON.parse(text);
      await validate(rows, file);
      const ids = new Set<string>();
      for (const edit of edits) {
        if (
          !edit ||
          typeof edit.id !== "string" ||
          ids.has(edit.id) ||
          Object.keys(edit).some(
            (k) => !["id", "comments", "status", "done", "delete"].includes(k),
          )
        )
          throw new StoreError(400, "Invalid or duplicate edit.");
        ids.add(edit.id);
        const row = rows.find((r) => r.id === edit.id);
        if (!row) throw new StoreError(409, `Row ${edit.id} no longer exists.`);
        if ("delete" in edit && typeof edit.delete !== "boolean")
          throw new StoreError(400, "Invalid deletion value.");
        if ("comments" in edit) {
          if (typeof edit.comments !== "string")
            throw new StoreError(400, "Comment must be text.");
          row.comments = edit.comments;
        }
        if ("status" in edit) {
          if (file === TODO || !STATUSES.includes(edit.status!))
            throw new StoreError(400, "Invalid progress status.");
          if (row.status !== edit.status) {
            row.status = edit.status;
            row.statusAt = new Date().toISOString();
            if (row.status === "Done") row.progress = 100;
            else if (row.progress === 100) delete row.progress;
          }
        }
        if ("done" in edit) {
          if (file !== TODO || typeof edit.done !== "boolean")
            throw new StoreError(400, "Invalid to-do completion.");
          if (row.done !== edit.done) {
            row.done = edit.done;
            row.doneAt = edit.done ? new Date().toISOString() : null;
            if (edit.done) row.progress = 100;
            else if (row.progress === 100) delete row.progress;
          }
        }
      }
      const deleteIds = new Set(edits.filter((e) => e.delete).map((e) => e.id));
      const next = rows.filter((r) => !deleteIds.has(r.id));
      await validate(next, file);
      await atomic(resolved, next);
      return { ok: true, file, rows: next.length };
    });
  }
  // Compatibility endpoint for callers of the previous local server. Optimistic base required.
  async function saveRows(file: string, rows: Row[], baseRows: Row[]) {
    return locked(async () => {
      const resolved = await resolveFile(file);
      const previous: Row[] = JSON.parse(await fs.readFile(resolved, "utf8"));
      if (!Array.isArray(baseRows) || !isDeepStrictEqual(previous, baseRows))
        throw new StoreError(
          409,
          "The file changed or no baseRows were provided; reload before saving.",
        );
      await validate(rows, file);
      for (const row of rows) {
        const old = previous.find((r) => r.id === row.id);
        if (!old && row.createdAt === null)
          throw new StoreError(422, `New row ${row.id} requires createdAt.`);
        if (old && row.createdAt !== old.createdAt)
          throw new StoreError(422, `createdAt for ${row.id} is immutable.`);
        if (old && row.status !== old.status && row.statusAt === old.statusAt)
          throw new StoreError(
            422,
            `Changing status for ${row.id} requires a new statusAt.`,
          );
      }
      await atomic(resolved, rows);
      return { ok: true, file, rows: rows.length };
    });
  }
  async function git(...args: string[]) {
    try {
      return (
        await execute("git", args, {
          cwd: root,
          timeout: 180000,
          maxBuffer: 4 * 1024 * 1024,
          env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        })
      ).stdout.trim();
    } catch (error) {
      const e = error as Error & { stderr?: string };
      throw new StoreError(
        500,
        `git ${args[0]} failed: ${e.stderr || e.message}`,
      );
    }
  }
  async function checkpoint() {
    return locked(async () => {
      const branch = await git("branch", "--show-current");
      if (!branch)
        throw new StoreError(409, "Cannot checkpoint a detached HEAD.");
      const repo = await fs.realpath(
        /* turbopackIgnore: true */ await git("rev-parse", "--show-toplevel"),
      );
      const canonical = await fs.realpath(
        /* turbopackIgnore: true */ repositoryRoot,
      );
      const relative = path.relative(repo, canonical) || ".";
      const scope =
        relative === "." ? ":(top,glob)**" : `:(top,glob)${relative}/**`;
      const exclude = ":(top,exclude,glob)**/.petal-write-lock/**";
      const data = await workspace();
      if (data.files.some((f) => f.error) || data.warnings.length)
        throw new StoreError(
          422,
          "Fix tracker or metadata errors before checkpointing.",
        );
      if (repositoryRoot !== root) {
        for (const entry of await fs.readdir(
          path.join(repositoryRoot, "projects"),
          { withFileTypes: true },
        )) {
          if (!entry.isDirectory()) continue;
          const checked = await createStore(
            path.join(repositoryRoot, "projects", entry.name),
          ).workspace();
          if (checked.files.some((f) => f.error) || checked.warnings.length)
            throw new StoreError(
              422,
              `Fix tracker errors in project ${entry.name} before checkpointing.`,
            );
        }
      }
      await git("add", "-A", "--", scope, exclude);
      const files = (
        await git("diff", "--cached", "--name-only", "--", scope, exclude)
      )
        .split("\n")
        .filter(Boolean);
      let commit: string | null = null;
      if (files.length) {
        await git(
          "commit",
          "--only",
          "-m",
          `chore(petal): checkpoint ${files.length} files`,
          "--",
          scope,
          exclude,
        );
        commit = await git("rev-parse", "--short", "HEAD");
      }
      const hasOrigin = (await git("remote")).split("\n").includes("origin");
      try {
        if (hasOrigin) await git("push", "origin", `HEAD:${branch}`);
      } catch (error) {
        throw new StoreError(
          500,
          `${(error as Error).message}${commit ? " — commit exists locally but was not published." : ""}`,
          { commit, committed: !!commit, files },
        );
      }
      return {
        ok: true,
        committed: !!commit,
        commit,
        files,
        pushed: hasOrigin,
        branch,
      };
    });
  }
  async function deleteFile(file: string, revision: string) {
    return locked(async () => {
      if (path.basename(file).toLowerCase() === "todo.json")
        throw new StoreError(403, "The to-do file cannot be deleted.");
      const resolved = await resolveFile(file);
      const text = await fs.readFile(resolved, "utf8");
      if (digest(text) !== revision)
        throw new StoreError(
          409,
          "File changed; reload and review before deleting.",
        );
      // Deletion stays local. Checkpoint is the only action that publishes changes.
      const catalog = await json("file-icons.json");
      delete catalog[file];
      const oldCatalog = await fs.readFile(
        path.join(root, "file-icons.json"),
        "utf8",
      );
      await atomic(path.join(root, "file-icons.json"), catalog);
      try {
        await fs.unlink(resolved);
      } catch (error) {
        await fs.writeFile(path.join(root, "file-icons.json"), oldCatalog);
        throw error;
      }
      return { ok: true, file, published: false };
    });
  }
  async function addTask(file: string, title: string, category = "General") {
    return locked(async () => {
      if (!title.trim()) throw new StoreError(400, "A title is required.");
      const resolved = await resolveFile(file);
      const rows: Row[] = JSON.parse(await fs.readFile(resolved, "utf8"));
      const now = new Date().toISOString();
      const row: Row = {
        id: `${file === TODO ? "T" : "W"}-${randomUUID().slice(0, 8)}`,
        createdAt: now,
        progress: 0,
        ...(file === TODO
          ? { task: title, category, done: false, doneAt: null }
          : {
              status: "To do" as const,
              statusAt: now,
              ...(/(?:^|\/)bug\./.test(file)
                ? { bug: title }
                : { task: title }),
            }),
      };
      rows.push(row);
      await validate(rows, file);
      await atomic(resolved, rows);
      return { ok: true, row };
    });
  }
  async function updateTask(
    file: string,
    id: string,
    patch: Record<string, unknown>,
    revision: string,
  ) {
    return locked(async () => {
      const resolved = await resolveFile(file);
      const text = await fs.readFile(resolved, "utf8");
      if (digest(text) !== revision)
        throw new StoreError(
          409,
          "File changed. Read it again before updating.",
        );
      if (
        !patch ||
        typeof patch !== "object" ||
        Array.isArray(patch) ||
        [
          "id",
          "createdAt",
          "statusAt",
          "doneAt",
          "__proto__",
          "constructor",
        ].some((k) => k in patch && Object.hasOwn(patch, k))
      )
        throw new StoreError(
          400,
          "Patch cannot replace IDs or lifecycle timestamps.",
        );
      const rows: Row[] = JSON.parse(text);
      const row = rows.find((r) => r.id === id);
      if (!row) throw new StoreError(404, `Unknown item ${id}`);
      const status = row.status,
        done = row.done;
      Object.assign(row, patch);
      if (row.status !== status) row.statusAt = new Date().toISOString();
      if (row.done !== done)
        row.doneAt = row.done ? new Date().toISOString() : null;
      if (row.status === "Done" || row.done) row.progress = 100;
      await validate(rows, file);
      await atomic(resolved, rows);
      return { ok: true, row };
    });
  }
  return {
    withLock: locked,
    workspace,
    save,
    saveRows,
    deleteFile,
    checkpoint,
    list,
    resolveFile,
    addTask,
    updateTask,
  };
}
