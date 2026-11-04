// lib/store.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isDeepStrictEqual } from "node:util";

// lib/project-config.ts
var DEFAULT_CONFIGURATION = {
  statuses: [
    { name: "To do", complete: false, color: 220 },
    { name: "Doing", complete: false, color: 32 },
    { name: "Waiting", complete: false, color: 48 },
    { name: "Done", complete: true, color: 150 },
  ],
  categories: [],
  fields: [],
  fieldLabels: {},
};
var CORE_FIELDS = /* @__PURE__ */ new Set([
  "id",
  "status",
  "statusAt",
  "createdAt",
  "done",
  "doneAt",
  "task",
  "bug",
  "comments",
  "progress",
  "est",
  "difficulty",
  "category",
  "section",
  "severity",
  "rootCause",
  "howFixed",
  "evidence",
  "verification",
  "limitations",
  "retestingSummary",
  "retestingFindings",
  "referenceChecklist",
  "report",
  "reportState",
  "researchSources",
  "pullRequests",
  "statusDetail",
  "delete",
  "fields",
  "__proto__",
  "prototype",
  "constructor",
]);
function configurationErrors(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input))
    return ["Expected project configuration."];
  const c = input;
  if (
    Object.keys(c).some(
      (k) => !["statuses", "categories", "fields", "fieldLabels"].includes(k),
    )
  )
    errors.push("Unknown configuration key.");
  const names = (rows, kind, max) => {
    if (!Array.isArray(rows) || rows.length > max) {
      errors.push(`${kind} must be an array with at most ${max} entries.`);
      return false;
    }
    const used = /* @__PURE__ */ new Set();
    for (const row of rows) {
      if (
        !row ||
        typeof row !== "object" ||
        typeof row.name !== "string" ||
        !row.name.trim() ||
        (kind === "Status" &&
          (row.name !== row.name.trim() || row.name.length > 60)) ||
        used.has(kind === "Status" ? row.name.toLowerCase() : row.name)
      )
        errors.push(
          kind === "Status"
            ? "Status names must be unique, trimmed text (1\u201360 characters)."
            : "Category names must be unique nonempty text.",
        );
      else used.add(kind === "Status" ? row.name.toLowerCase() : row.name);
      if (!Number.isInteger(row?.color) || row.color < 0 || row.color > 360)
        errors.push(`${kind} colors must be a hue from 0\u2013360.`);
    }
    return true;
  };
  if (names(c.statuses, "Status", 24)) {
    if (
      c.statuses.some(
        (s) =>
          !s ||
          typeof s.complete !== "boolean" ||
          (typeof s.name === "string" &&
            ["active", "all"].includes(s.name.toLowerCase())),
      )
    )
      errors.push(
        "Statuses need a completion rule and cannot be named Active or All.",
      );
    if (
      !c.statuses.some((s) => s?.complete === false) ||
      !c.statuses.some((s) => s?.complete === true)
    )
      errors.push("Include at least one unfinished and one complete status.");
  }
  names(c.categories, "Category", 100);
  if (!Array.isArray(c.fields) || c.fields.length > 40)
    errors.push("Fields must be an array with at most 40 entries.");
  else {
    const keys = /* @__PURE__ */ new Set();
    for (const f of c.fields) {
      if (
        !f ||
        typeof f.key !== "string" ||
        !/^[a-zA-Z][a-zA-Z0-9_]{0,49}$/.test(f.key) ||
        CORE_FIELDS.has(f.key) ||
        keys.has(f.key)
      )
        errors.push(
          "Custom field keys must be unique identifiers and cannot replace protected core fields.",
        );
      else keys.add(f.key);
      if (
        !f ||
        typeof f.label !== "string" ||
        !f.label.trim() ||
        f.label.length > 80 ||
        !["text", "number", "boolean"].includes(f.type)
      )
        errors.push(
          "Each custom field needs a label and text, number, or boolean type.",
        );
    }
  }
  if (
    !c.fieldLabels ||
    typeof c.fieldLabels !== "object" ||
    Array.isArray(c.fieldLabels) ||
    Object.entries(c.fieldLabels).some(
      ([k, v]) =>
        !k.trim() ||
        k.length > 100 ||
        ["__proto__", "constructor", "prototype"].includes(k) ||
        typeof v !== "string" ||
        !v.trim() ||
        v.length > 80,
    )
  )
    errors.push("Field labels must be nonempty text, up to 80 characters.");
  return errors;
}
function rowConfigurationErrors(rows, file, c) {
  const errors = [];
  for (const row of rows) {
    if (
      file !== "data/todo.json" &&
      !c.statuses.some((s) => s.name === row.status)
    )
      errors.push(
        `${row.id}: status ${JSON.stringify(row.status)} is not configured for this project.`,
      );
    for (const f of c.fields) {
      if (!Object.hasOwn(row, f.key)) continue;
      const value = row[f.key];
      if (
        (f.type === "text" && typeof value !== "string") ||
        (f.type === "number" &&
          (typeof value !== "number" || !Number.isFinite(value))) ||
        (f.type === "boolean" && typeof value !== "boolean")
      )
        errors.push(`${row.id}.${f.key} must be ${f.type}.`);
    }
  }
  return errors;
}
var completeStatus = (status, c = DEFAULT_CONFIGURATION) =>
  c.statuses.some((s) => s.name === status && s.complete);

// lib/model.ts
var TODO = "data/todo.json";

// lib/store.ts
var execute = promisify(execFile);
var require2 = createRequire(import.meta.url);
var validator = require2("../tracker-validator.js");
var StoreError = class extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
};
var digest = (text) => createHash("sha256").update(text).digest("hex");
function createStore(root, repositoryRoot = root) {
  let busy = false;
  async function locked(work) {
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
          JSON.stringify({
            pid: process.pid,
            at: /* @__PURE__ */ new Date().toISOString(),
          }),
        );
      } catch (error) {
        if (error.code === "EEXIST")
          throw new StoreError(
            409,
            `Another Petal writer holds ${lock}. If its process is no longer running, remove the stale lock and retry.`,
          );
        throw error;
      }
      await recoverConfiguration();
      return await work();
    } finally {
      if (acquired) await fs.rm(lock, { recursive: true, force: true });
      busy = false;
    }
  }
  async function json(file) {
    return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
  }
  async function validate(rows, file, configuration) {
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
    const errors = rowConfigurationErrors(
      rows,
      file,
      configuration || (await projectConfiguration()).configuration,
    );
    if (errors.length)
      throw new StoreError(422, `Invalid project fields in ${file}`, errors);
  }
  async function resolveFile(file) {
    if (
      typeof file !== "string" ||
      !/^data\/.+\.json$/.test(file) ||
      file.split("/").some((p) => p === ".." || p === ".") ||
      file.includes("\\")
    )
      throw new StoreError(400, "Expected a JSON file inside data/.");
    let resolved;
    try {
      resolved = await fs.realpath(path.join(root, file));
    } catch (error) {
      if (error.code === "ENOENT")
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
  async function atomic(file, value) {
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
  const configPath = path.join(root, "project-settings.json"),
    transactionPath = path.join(root, ".petal-config-transaction.json");
  async function optionalText(file) {
    try {
      return await fs.readFile(file, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }
  async function atomicText(file, text) {
    const temp = file + "." + randomUUID() + ".tmp";
    try {
      await fs.writeFile(temp, text, { flag: "wx" });
      await fs.rename(temp, file);
    } finally {
      await fs.rm(temp, { force: true });
    }
  }
  async function projectConfiguration() {
    await ensureConfigurationRecovered();
    const text = await optionalText(configPath),
      configuration =
        text === null
          ? structuredClone(DEFAULT_CONFIGURATION)
          : JSON.parse(text);
    const errors = configurationErrors(configuration);
    if (errors.length)
      throw new StoreError(422, "Invalid project-settings.json", errors);
    return {
      configuration,
      revision: digest(text ?? JSON.stringify(DEFAULT_CONFIGURATION)),
    };
  }
  async function recoverConfiguration() {
    const text = await optionalText(transactionPath);
    if (!text) return;
    const transaction = JSON.parse(text);
    if (transaction.state !== "committed") {
      if (
        !Array.isArray(transaction.files) ||
        transaction.files.some(
          (f) =>
            typeof f.file !== "string" ||
            !/^data\/.+\.json$/.test(f.file) ||
            f.file.split("/").includes("..") ||
            typeof f.before !== "string",
        )
      )
        throw new StoreError(
          503,
          "Invalid configuration recovery journal; inspect it before retrying.",
        );
      const currentConfiguration = await optionalText(configPath);
      if (
        currentConfiguration !== transaction.beforeConfiguration &&
        currentConfiguration !== transaction.afterConfiguration
      )
        throw new StoreError(
          503,
          "Project configuration was edited outside an unfinished migration; inspect the recovery journal before proceeding.",
        );
      for (const f of transaction.files) {
        const current = await fs.readFile(await resolveFile(f.file), "utf8");
        if (current !== f.before && current !== f.after)
          throw new StoreError(
            503,
            `${f.file} was edited outside an unfinished migration; recovery will not overwrite it.`,
          );
      }
      for (const f of transaction.files)
        await atomicText(await resolveFile(f.file), f.before);
      if (transaction.beforeConfiguration === null)
        await fs.rm(configPath, { force: true });
      else await atomicText(configPath, transaction.beforeConfiguration);
    }
    await fs.rm(transactionPath, { force: true });
  }
  async function ensureConfigurationRecovered() {
    if (await optionalText(transactionPath)) {
      if (busy)
        throw new StoreError(
          409,
          "Project settings migration is running; retry shortly.",
        );
      await locked(async () => {});
    }
  }
  async function configurationPlan(input, revision, mapping = {}) {
    await ensureConfigurationRecovered();
    const current = await projectConfiguration();
    if (current.revision !== revision)
      throw new StoreError(
        409,
        "Project settings changed. Reload Settings before retrying.",
      );
    const errors = configurationErrors(input);
    if (errors.length)
      throw new StoreError(422, "Invalid project configuration", errors);
    if (
      !mapping ||
      typeof mapping !== "object" ||
      Array.isArray(mapping) ||
      Object.entries(mapping).some(
        ([k, v]) =>
          ["__proto__", "constructor", "prototype"].includes(k) ||
          typeof v !== "string",
      )
    )
      throw new StoreError(400, "Expected explicit status mappings.");
    const configuration = input,
      files = [],
      revisions = {};
    for (const file of await list()) {
      const before = await fs.readFile(await resolveFile(file), "utf8"),
        rows = JSON.parse(before);
      await validate(rows, file, current.configuration);
      revisions[file] = digest(before);
      let changed = 0;
      for (const row of rows) {
        if (file !== TODO) {
          const oldStatus = row.status;
          const name = Object.hasOwn(mapping, row.status)
            ? mapping[row.status]
            : row.status;
          if (!configuration.statuses.some((s) => s.name === name))
            throw new StoreError(
              422,
              `${file}: map status ${JSON.stringify(row.status)} to a configured status before applying.`,
            );
          if (name !== row.status) {
            row.status = name;
            changed++;
          }
          const wasComplete = completeStatus(oldStatus, current.configuration);
          if (completeStatus(name, configuration)) {
            if (row.progress !== 100) {
              row.progress = 100;
              changed++;
            }
          } else if (row.progress === 100 && wasComplete) {
            delete row.progress;
            changed++;
          }
        }
      }
      await validate(rows, file, configuration);
      const after = JSON.stringify(rows, null, 2) + "\n";
      if (changed) files.push({ file, before, after, rows: changed });
    }
    const token = digest(
      JSON.stringify({ configuration, mapping, revision, revisions }),
    );
    return { configuration, files, token };
  }
  async function previewConfiguration(input, revision, mapping) {
    const plan = await configurationPlan(input, revision, mapping);
    return {
      token: plan.token,
      files: plan.files.map((f) => ({ file: f.file, changes: f.rows })),
      totalChanges: plan.files.reduce((n, f) => n + f.rows, 0),
    };
  }
  async function saveConfiguration(input, revision, mapping, token) {
    return locked(async () => {
      const plan = await configurationPlan(input, revision, mapping);
      if (typeof token !== "string" || token !== plan.token)
        throw new StoreError(
          409,
          "Preview is stale. Preview the current files again before applying.",
        );
      const beforeConfiguration = await optionalText(configPath),
        id = randomUUID(),
        journal = {
          state: "pending",
          id,
          beforeConfiguration,
          afterConfiguration:
            JSON.stringify(plan.configuration, null, 2) + "\n",
          files: plan.files,
        };
      await atomic(transactionPath, journal);
      try {
        for (const f of plan.files)
          await atomicText(await resolveFile(f.file), f.after);
        await atomic(configPath, plan.configuration);
        await fs.mkdir(path.join(root, "migrations"), { recursive: true });
        await atomic(
          path.join(root, "migrations", `project-settings-${id}.json`),
          {
            at: /* @__PURE__ */ new Date().toISOString(),
            before:
              beforeConfiguration === null
                ? DEFAULT_CONFIGURATION
                : JSON.parse(beforeConfiguration),
            after: plan.configuration,
            files: plan.files,
          },
        );
        await atomic(transactionPath, { ...journal, state: "committed" });
      } catch (error) {
        try {
          await recoverConfiguration();
        } catch (recovery) {
          throw new StoreError(
            503,
            "Settings migration failed and rollback needs recovery. Do not edit tracker files until the next successful writer recovers the journal.",
            { cause: String(error), recovery: String(recovery) },
          );
        }
        throw error;
      }
      await fs.rm(transactionPath, { force: true });
      return {
        ok: true,
        ...(await projectConfiguration()),
        migratedFiles: plan.files.length,
      };
    });
  }
  async function list(dir = "data") {
    const entries = await fs.readdir(
      /* turbopackIgnore: true */
      path.join(
        /* turbopackIgnore: true */
        root,
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
  async function workspace() {
    await ensureConfigurationRecovered();
    const { configuration, revision: configRevision } =
      await projectConfiguration();
    const warnings = [];
    let icons = {};
    let estimates = [];
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
      if (error.code !== "ENOENT")
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
          await validate(rows, file, configuration);
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
    if (
      (await optionalText(transactionPath)) ||
      (await projectConfiguration()).revision !== configRevision
    )
      throw new StoreError(
        409,
        "Project configuration changed during refresh. Retry shortly.",
      );
    return { files, estimates, warnings, configuration };
  }
  async function save(file, revision, edits) {
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
      const rows = JSON.parse(text);
      await validate(rows, file);
      const { configuration } = await projectConfiguration();
      const ids = /* @__PURE__ */ new Set();
      for (const edit of edits) {
        if (
          !edit ||
          typeof edit.id !== "string" ||
          ids.has(edit.id) ||
          Object.keys(edit).some(
            (k) =>
              ![
                "id",
                "comments",
                "status",
                "done",
                "delete",
                "fields",
                "category",
              ].includes(k),
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
        if ("category" in edit) {
          if (
            file !== TODO ||
            typeof edit.category !== "string" ||
            !edit.category.trim()
          )
            throw new StoreError(
              400,
              "A to-do category must be nonempty text.",
            );
          row.category = edit.category;
        }
        if ("status" in edit) {
          if (
            file === TODO ||
            !configuration.statuses.some((s) => s.name === edit.status)
          )
            throw new StoreError(400, "Invalid progress status.");
          if (row.status !== edit.status) {
            row.status = edit.status;
            row.statusAt = /* @__PURE__ */ new Date().toISOString();
            if (completeStatus(row.status, configuration)) row.progress = 100;
            else if (row.progress === 100) delete row.progress;
          }
        }
        if ("fields" in edit) {
          if (
            !edit.fields ||
            typeof edit.fields !== "object" ||
            Array.isArray(edit.fields) ||
            Object.keys(edit.fields).some(
              (k) => !configuration.fields.some((f) => f.key === k),
            )
          )
            throw new StoreError(
              400,
              "Only configured custom fields can be edited here.",
            );
          for (const [key, value] of Object.entries(edit.fields)) {
            if (value === null) delete row[key];
            else row[key] = value;
          }
        }
        if ("done" in edit) {
          if (file !== TODO || typeof edit.done !== "boolean")
            throw new StoreError(400, "Invalid to-do completion.");
          if (row.done !== edit.done) {
            row.done = edit.done;
            row.doneAt = edit.done
              ? /* @__PURE__ */ new Date().toISOString()
              : null;
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
  async function saveRows(file, rows, baseRows) {
    return locked(async () => {
      const resolved = await resolveFile(file);
      const previous = JSON.parse(await fs.readFile(resolved, "utf8"));
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
  async function git(...args) {
    try {
      return (
        await execute("git", args, {
          cwd: root,
          timeout: 18e4,
          maxBuffer: 4 * 1024 * 1024,
          env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        })
      ).stdout.trim();
    } catch (error) {
      const e = error;
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
        /* turbopackIgnore: true */
        await git("rev-parse", "--show-toplevel"),
      );
      const canonical = await fs.realpath(
        /* turbopackIgnore: true */
        repositoryRoot,
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
      let commit = null;
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
          `${error.message}${commit ? " \u2014 commit exists locally but was not published." : ""}`,
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
  async function deleteFile(file, revision) {
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
  async function addTask(file, title, category = "General") {
    return locked(async () => {
      if (!title.trim()) throw new StoreError(400, "A title is required.");
      const resolved = await resolveFile(file);
      const rows = JSON.parse(await fs.readFile(resolved, "utf8"));
      const { configuration } = await projectConfiguration();
      const now = /* @__PURE__ */ new Date().toISOString();
      const row = {
        id: `${file === TODO ? "T" : "W"}-${randomUUID().slice(0, 8)}`,
        createdAt: now,
        progress: 0,
        ...(file === TODO
          ? { task: title, category, done: false, doneAt: null }
          : {
              status: configuration.statuses.find((s) => !s.complete).name,
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
  async function updateTask(file, id, patch, revision) {
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
      const rows = JSON.parse(text);
      const row = rows.find((r) => r.id === id);
      if (!row) throw new StoreError(404, `Unknown item ${id}`);
      const status = row.status,
        done = row.done;
      Object.assign(row, patch);
      if (row.status !== status)
        row.statusAt = /* @__PURE__ */ new Date().toISOString();
      if (row.done !== done)
        row.doneAt = row.done ? /* @__PURE__ */ new Date().toISOString() : null;
      const { configuration } = await projectConfiguration();
      for (const f of configuration.fields)
        if (Object.hasOwn(patch, f.key) && patch[f.key] === null)
          delete row[f.key];
      if (completeStatus(row.status, configuration) || row.done)
        row.progress = 100;
      else if (
        row.progress === 100 &&
        (row.status !== status || row.done !== done)
      )
        delete row.progress;
      await validate(rows, file);
      await atomic(resolved, rows);
      return { ok: true, row };
    });
  }
  return {
    projectConfiguration,
    previewConfiguration,
    saveConfiguration,
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
export { StoreError, createStore };
