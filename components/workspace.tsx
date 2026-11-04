"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Moon,
  Sun,
  Settings,
  Check,
  CheckCheck,
  ChevronRight,
  CloudUpload,
  Flower2,
  FolderHeart,
  LoaderCircle,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import ProjectSettings from "./project-settings";
import CustomFields from "./custom-fields";
import {
  DEFAULT_CONFIGURATION,
  completeStatus,
  type ProjectConfiguration,
} from "../lib/project-config";
import FileIcon from "./file-icon";
import { StackIcon, ChartLineUpIcon } from "@phosphor-icons/react";
import CategoryBadge, { categoryStyle } from "./category-badge";
import SelectMenu from "./select-menu";
import TodoDetails from "./todo-details";
import { DetailValue, dateLabel } from "./detail-value";
import {
  TODO,
  fileLabel,
  isComplete,
  type Workspace,
  type Row,
  type Edit,
  type Status,
  type TrackerFile,
} from "../lib/model";
type Drafts = Record<string, { revision: string; edits: Record<string, Edit> }>;
type Selection = { file: string; id: string };
const labels: Record<string, string> = {
  rootCause: "Findings",
  howFixed: "What changed",
  retestingSummary: "Verification",
  retestingFindings: "Verification details",
  statusDetail: "Where things stand",
  createdAt: "Opened",
  statusAt: "Last status change",
  doneAt: "Completed",
  est: "Estimated time",
  difficulty: "Difficulty",
  progress: "Progress",
};
const PREFS = "petal:view:v1",
  DRAFTS = "petal:drafts:v1";
const storageKey = (key: string) =>
  key +
  ":" +
  (new URLSearchParams(window.location.search).get("project") || "default");
async function api<T>(
  url: string,
  body?: unknown,
  kind = "Save",
  method = "POST",
): Promise<T> {
  const target = new URL(url, window.location.origin);
  const project = new URLSearchParams(window.location.search).get("project");
  if (project) target.searchParams.set("project", project);
  const response = await fetch(
    target,
    body === undefined
      ? { cache: "no-store" }
      : {
          method,
          headers: {
            "Content-Type": "application/json",
            [`X-Progress-${kind}`]: "1",
          },
          body: JSON.stringify(body),
        },
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      [
        result.error || `Request failed (${response.status})`,
        result.details ? JSON.stringify(result.details) : "",
      ]
        .filter(Boolean)
        .join(" · "),
    );
  return result;
}
function ProgressMeter({
  row,
  file,
  configuration = DEFAULT_CONFIGURATION,
}: {
  row: Row;
  file: string;
  configuration?: ProjectConfiguration;
}) {
  const done = isComplete(row, file, configuration);
  const percent = done
    ? 100
    : typeof row.progress === "number"
      ? row.progress
      : null;
  return (
    <div
      className={`progress-meter ${done ? "complete" : ""}`}
      aria-label={
        percent === null ? "Progress not yet assessed" : `${percent}% complete`
      }
    >
      <span className="meter-track">
        <i style={{ width: `${percent ?? 0}%` }} />
      </span>
      <span>{percent === null ? "—" : `${percent}%`}</span>
    </div>
  );
}
export default function ProgressWorkspace() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [settingsSection, setSettingsSection] = useState<"project" | "backup">(
    "project",
  );
  const [settingsOpen, setSettingsOpen] = useState(false),
    [storage, setStorage] = useState<{
      directory: string;
      origin: string;
    } | null>(null),
    [origin, setOrigin] = useState("");
  const settingsRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);
  useEffect(() => {
    if (settingsOpen) settingsRef.current?.showModal();
    else settingsRef.current?.close();
  }, [settingsOpen]);
  function changeTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("petal:theme", next);
    } catch {
      setMessage(
        "Theme changed for this session. Browser storage is unavailable.",
      );
    }
  }
  async function openSettings() {
    await run(async () => {
      const result = await api<{ directory: string; origin: string }>(
        "/api/settings",
      );
      setStorage(result);
      setOrigin(result.origin);
      setSettingsOpen(true);
    });
  }
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [data, setData] = useState<Workspace | null>(null),
    [loadError, setLoadError] = useState("");
  const [mode, setMode] = useState<"progress" | "todo">("progress"),
    [scope, setScope] = useState("all"),
    [filter, setFilter] = useState("Active"),
    [todoFilter, setTodoFilter] = useState("To do"),
    [category, setCategory] = useState("all"),
    [sort, setSort] = useState("default");
  const [selected, setSelected] = useState<Selection | null>(null),
    [drafts, setDrafts] = useState<Drafts>({}),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [actionError, setActionError] = useState("");
  const [confirm, setConfirm] = useState<
      null | "bulk" | "checkpoint" | "file" | "add" | "save"
    >(null),
    [ready, setReady] = useState(false);
  const busyRef = useRef(false),
    loadingRef = useRef(false),
    mounted = useRef(true),
    drawerRef = useRef<HTMLDialogElement>(null),
    confirmRef = useRef<HTMLDialogElement>(null);
  const refresh = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const result = await api<Workspace>("/api/workspace");
      if (mounted.current) {
        setData(result);
        setLoadError("");
      }
    } catch (error) {
      if (mounted.current) setLoadError((error as Error).message);
    } finally {
      loadingRef.current = false;
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    try {
      const p = JSON.parse(localStorage.getItem(storageKey(PREFS)) || "null");
      if (p) {
        setMode(p.mode === "todo" ? "todo" : "progress");
        setScope(typeof p.scope === "string" ? p.scope : "all");
        setFilter(typeof p.filter === "string" ? p.filter : "Active");
        setTodoFilter(
          ["To do", "Done", "All"].includes(p.todoFilter)
            ? p.todoFilter
            : "To do",
        );
        setCategory(typeof p.category === "string" ? p.category : "all");
        setSort(
          ["default", "newest", "oldest", "progress"].includes(p.sort)
            ? p.sort
            : "default",
        );
      }
      const d = JSON.parse(sessionStorage.getItem(storageKey(DRAFTS)) || "{}");
      if (
        d &&
        typeof d === "object" &&
        !Array.isArray(d) &&
        Object.values(d).every(
          (v: any) =>
            v &&
            typeof v.revision === "string" &&
            v.edits &&
            typeof v.edits === "object",
        )
      )
        setDrafts(d);
    } catch {
      setMessage(
        "Saved view preferences could not be restored. Your tracker files are unchanged.",
      );
    }
    setReady(true);
    void refresh();
    const timer = setInterval(() => void refresh(), 6000);
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [refresh]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        storageKey(PREFS),
        JSON.stringify({ mode, scope, filter, todoFilter, category, sort }),
      );
      sessionStorage.setItem(storageKey(DRAFTS), JSON.stringify(drafts));
    } catch {
      /* Drafts remain in memory if browser storage is unavailable. */
    }
  }, [ready, mode, scope, filter, todoFilter, category, sort, drafts]);
  const dirtyCount = Object.values(drafts).reduce(
    (n, f) => n + Object.keys(f.edits).length,
    0,
  );
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirtyCount) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyCount]);
  useEffect(() => {
    if (selected && !drawerRef.current?.open) drawerRef.current?.showModal();
    else if (!selected) drawerRef.current?.close();
  }, [selected]);
  useEffect(() => {
    if (confirm && !confirmRef.current?.open) confirmRef.current?.showModal();
    else if (!confirm) confirmRef.current?.close();
  }, [confirm]);
  const configuration = data?.configuration || DEFAULT_CONFIGURATION;
  const statuses = configuration.statuses.map((s) => s.name);
  useEffect(() => {
    if (
      data &&
      ![
        "Active",
        "All",
        ...data.configuration.statuses.map((s) => s.name),
      ].includes(filter)
    )
      setFilter("Active");
  }, [data, filter]);
  const files = data?.files ?? [],
    progressFiles = files.filter((f) => f.path !== TODO),
    todoFile = files.find((f) => f.path === TODO);
  const effective = (row: Row, file: string): Row => {
    const { fields, ...patch } = drafts[file]?.edits[row.id] || {};
    return { ...row, ...patch, ...fields };
  };
  const allProgress = progressFiles
    .filter((f) => !f.error)
    .flatMap((f) =>
      f.rows.map((row) => ({ file: f, row: effective(row, f.path) })),
    );
  const activeCount = allProgress.filter(
      ({ row }) => !completeStatus(row.status, configuration),
    ).length,
    todoOpen = todoFile?.rows.filter((r) => !r.done).length || 0;
  const currentFiles =
    mode === "todo"
      ? todoFile
        ? [todoFile]
        : []
      : scope === "all"
        ? progressFiles
        : progressFiles.filter((f) => f.path === scope);
  const items = currentFiles
    .filter((f) => !f.error)
    .flatMap((file) =>
      file.rows.map((row) => ({ file, row: effective(row, file.path) })),
    );
  const categories = [
    ...new Set(
      items.map((x) =>
        String(x.row.category || x.row.section || "Uncategorised"),
      ),
    ),
  ].sort();
  const categoryOf = (row: Row) =>
    String(row.category || row.section || "Uncategorised");
  const matchesProgress = (row: Row, status: string) =>
    status === "All" ||
    (status === "Active" && !completeStatus(row.status, configuration)) ||
    row.status === status;
  const matchesTodo = (row: Row, status: string) =>
    status === "All" || !!row.done === (status === "Done");
  const statusCount = (status: string) =>
    items.filter(({ row }) =>
      mode === "todo"
        ? (category === "all" || categoryOf(row) === category) &&
          matchesTodo(row, status)
        : matchesProgress(row, status),
    ).length;
  const categoryCount = (value: string) =>
    items.filter(
      ({ row }) =>
        matchesTodo(row, todoFilter) &&
        (value === "all" || categoryOf(row) === value),
    ).length;
  const fileCount = (file: TrackerFile) =>
    file.rows.filter((row) =>
      matchesProgress(effective(row, file.path), filter),
    ).length;
  const visible = items
    .filter(({ row }) =>
      mode === "todo"
        ? matchesTodo(row, todoFilter) &&
          (category === "all" || categoryOf(row) === category)
        : matchesProgress(row, filter),
    )
    .sort((a, b) => {
      if (sort === "progress")
        return Number(b.row.progress || 0) - Number(a.row.progress || 0);
      if (sort === "newest" || sort === "oldest")
        return (
          ((Date.parse(a.row.createdAt || "") || 0) -
            (Date.parse(b.row.createdAt || "") || 0)) *
          (sort === "newest" ? -1 : 1)
        );
      const order = (r: Row) =>
        completeStatus(r.status, configuration)
          ? statuses.length
          : statuses.indexOf(r.status || "") < 0
            ? statuses.length + 1
            : statuses.length - 1 - statuses.indexOf(r.status || "");
      return order(a.row) - order(b.row);
    });
  const selectedFile = files.find((f) => f.path === selected?.file),
    originalRow = selectedFile?.rows.find((r) => r.id === selected?.id),
    selectedRow =
      originalRow && selectedFile
        ? effective(originalRow, selectedFile.path)
        : null;
  const totalTodo = todoFile?.rows.length || 0,
    doneTodo = totalTodo - todoOpen;
  function stage(file: TrackerFile, id: string, patch: Partial<Edit>) {
    setActionError("");
    setDrafts((previous) => ({
      ...previous,
      [file.path]: {
        revision: previous[file.path]?.revision ?? file.revision,
        edits: {
          ...previous[file.path]?.edits,
          [id]: { ...previous[file.path]?.edits[id], id, ...patch },
        },
      },
    }));
  }
  function undoRow(file: string, id: string) {
    setDrafts((previous) => {
      const next = structuredClone(previous);
      if (next[file]) {
        delete next[file].edits[id];
        if (!Object.keys(next[file].edits).length) delete next[file];
      }
      return next;
    });
  }
  async function run(work: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setActionError("");
    try {
      await work();
    } catch (error) {
      setActionError((error as Error).message);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  const deletionCount = Object.values(drafts).reduce(
    (n, d) => n + Object.values(d.edits).filter((e) => e.delete).length,
    0,
  );
  function requestSave() {
    if (deletionCount) setConfirm("save");
    else void save();
  }
  function discardDeletions() {
    setDrafts((previous) => {
      const next = structuredClone(previous);
      for (const [file, draft] of Object.entries(next)) {
        for (const [id, edit] of Object.entries(draft.edits)) {
          delete edit.delete;
          if (Object.keys(edit).length === 1) delete draft.edits[id];
        }
        if (!Object.keys(draft.edits).length) delete next[file];
      }
      return next;
    });
    setConfirm(null);
  }
  async function save() {
    await run(async () => {
      const errors: string[] = [];
      for (const [file, draft] of Object.entries(drafts)) {
        try {
          await api("/__save", {
            file,
            revision: draft.revision,
            edits: Object.values(draft.edits),
          });
          setDrafts((previous) => {
            const next = { ...previous };
            delete next[file];
            return next;
          });
        } catch (error) {
          errors.push((error as Error).message);
        }
      }
      await refresh();
      if (errors.length) throw new Error(errors.join("\n"));
      setMessage("Changes saved.");
    });
  }
  async function toggleTodo(file: TrackerFile, row: Row) {
    await run(async () => {
      const draft = drafts[file.path];
      await api("/__save", {
        file: file.path,
        revision: draft?.revision ?? file.revision,
        edits: [{ id: row.id, done: !row.done }],
      });
      // Refresh revisions only after this server accepted our original revision.
      const result = await api<Workspace>("/api/workspace");
      setData(result);
      const latest = result.files.find((f) => f.path === file.path);
      if (latest)
        setDrafts((previous) =>
          previous[file.path]
            ? {
                ...previous,
                [file.path]: {
                  ...previous[file.path],
                  revision: latest.revision,
                },
              }
            : previous,
        );
      setMessage(row.done ? "Moved back to your to-do list." : "Marked done.");
    });
  }
  function deleteRow(file: TrackerFile, row: Row) {
    stage(file, row.id, { delete: true });
    setMessage(
      `${row.id} marked for deletion. Undo or review deletions when ready.`,
    );
  }
  const completed = items.filter(
    (x) =>
      isComplete(x.row, x.file.path, configuration) &&
      !drafts[x.file.path]?.edits[x.row.id]?.delete,
  );
  async function confirmAction() {
    const action = confirm;
    setConfirm(null);
    if (action === "save") {
      await save();
      return;
    }
    if (action === "bulk") {
      for (const x of completed) stage(x.file, x.row.id, { delete: true });
      setMessage(
        `${completed.length} completed items marked for deletion. Save to apply.`,
      );
      return;
    }
    await run(async () => {
      if (action === "add") {
        const file =
          mode === "todo"
            ? TODO
            : scope !== "all"
              ? scope
              : progressFiles[0]?.path;
        if (!file)
          throw new Error("No work collection. Run petal init to create one.");
        await api("/__task", { file, title: newTitle, category: newCategory });
        setNewTitle("");
        setFilter("All");
        setTodoFilter("All");
        await refresh();
        setMessage("Item added.");
      }
      if (action === "checkpoint") {
        const result = await api<{ commit: string | null; pushed: boolean }>(
          "/__checkpoint",
          {},
          "Checkpoint",
        );
        setMessage(
          result.pushed
            ? "Checkpoint committed and pushed to origin."
            : result.commit
              ? `Checkpoint ${result.commit} saved locally.`
              : "Local checkpoint is up to date.",
        );
      }
      if (action === "file" && scope !== "all") {
        const file = files.find((f) => f.path === scope);
        if (!file) return;
        await api(
          "/__delete",
          { file: scope, revision: file.revision },
          "Delete",
          "DELETE",
        );
        setScope("all");
        setMessage(
          "File removed locally. Publish it with your next checkpoint.",
        );
        await refresh();
      }
    });
  }
  function openRow(file: TrackerFile, row: Row) {
    setSelected({ file: file.path, id: row.id });
  }
  return (
    <div className="workspace">
      <div className="night-sky" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <header className="topbar">
        <a className="brand" href="/" aria-label="Progress home">
          <span className="brand-flower">
            <Flower2 size={25} />
          </span>
          <span>
            petal<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="top-actions">
          <button
            className="icon-button"
            onClick={changeTheme}
            aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-button"
            aria-label="Settings"
            title="Settings"
            disabled={busy}
            onClick={() => void openSettings()}
          >
            <Settings size={18} />
          </button>
          <div className="project-control">
            <span>WORKSPACE</span>
            <SelectMenu
              className="project-dropdown"
              label="Project"
              value={data?.project?.id || ""}
              disabled={dirtyCount > 0 || busy}
              title={
                dirtyCount
                  ? "Save or discard drafts before switching projects"
                  : "Switch project"
              }
              options={(data?.projects || []).map((p) => {
                const summary = data?.projectSummaries?.find(
                  (s) => s.id === p.id,
                );
                return {
                  value: p.id,
                  label: p.name,
                  stats: [
                    { label: "progress", value: summary?.progress ?? null },
                    { label: "to-dos", value: summary?.todos ?? null },
                  ],
                  description: summary?.error,
                };
              })}
              onChange={(value) => {
                window.location.href = "/?project=" + encodeURIComponent(value);
              }}
            />
          </div>
          <button
            className="button checkpoint"
            onClick={() => setConfirm("checkpoint")}
            disabled={busy || dirtyCount > 0}
            title={
              dirtyCount
                ? "Save your changes before checkpointing"
                : "Checkpoint all project data; push only if an origin is connected"
            }
          >
            <CloudUpload size={16} />
            Checkpoint
          </button>
        </div>
      </header>
      <nav className="mode-tabs" aria-label="Workspace mode">
        <button
          aria-current={mode === "progress" ? "page" : undefined}
          onClick={() => {
            setMode("progress");
            setSelected(null);
          }}
        >
          <ChartLineUpIcon size={18} weight="duotone" />
          Progress<span>{activeCount}</span>
        </button>
        <button
          aria-current={mode === "todo" ? "page" : undefined}
          onClick={() => {
            setMode("todo");
            setSelected(null);
          }}
        >
          <CheckCheck size={16} />
          To-do<span>{todoOpen}</span>
        </button>
      </nav>
      {loadError && (
        <div className="notice error" role="alert">
          <span>
            <strong>Couldn’t refresh the workspace.</strong> {loadError}
          </span>
          <button onClick={() => void refresh()}>Retry</button>
        </div>
      )}
      {actionError && (
        <div className="notice error" role="alert">
          <span>{actionError}</span>
          <button onClick={() => setActionError("")} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}
      {data?.warnings.map((w) => (
        <div className="notice error" key={w}>
          {w}
          <button onClick={() => void refresh()}>Retry</button>
        </div>
      ))}
      {mode === "progress" ? (
        <>
          <section className="file-navigation">
            <div className="section-caption">
              <span>Files</span>
              <small>{progressFiles.length} files</small>
            </div>
            <div
              className="file-chips"
              role="group"
              aria-label="Choose a tracker"
            >
              <button
                className={`all-files ${scope === "all" ? "selected" : ""}`}
                onClick={() => setScope("all")}
                aria-pressed={scope === "all"}
              >
                <StackIcon size={19} weight="duotone" />
                All work{" "}
                <span className="chip-count">
                  {
                    allProgress.filter(({ row }) =>
                      matchesProgress(row, filter),
                    ).length
                  }
                </span>
              </button>
              {progressFiles.map((file) => (
                <button
                  key={file.path}
                  className={`file-chip ${scope === file.path ? "selected" : ""} ${file.error ? "has-error" : ""}`}
                  onClick={() => setScope(file.path)}
                  aria-label={`Open ${fileLabel(file.path)}${file.error ? " · file error" : ` · ${fileCount(file)} items`}`}
                  aria-pressed={scope === file.path}
                  title={file.path}
                >
                  <FileIcon icon={file.icon} file={file.path} />
                  {!file.error && (
                    <span className="chip-count">{fileCount(file)}</span>
                  )}
                  {file.error && <i />}
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="todo-summary">
          {todoOpen} open · {doneTodo} done · {totalTodo} total
        </p>
      )}
      <section className="work-section">
        <div className="work-heading">
          <div>
            <h2>
              {mode === "todo"
                ? "To-do"
                : scope === "all"
                  ? "All work"
                  : fileLabel(scope)}
            </h2>
          </div>
          <div className="work-tools">
            <button
              className="button"
              disabled={busy || dirtyCount > 0}
              onClick={() => setConfirm("add")}
            >
              <Plus size={14} />
              New item
            </button>
            <button
              className="icon-button"
              onClick={() => void refresh()}
              title="Refresh workspace"
              aria-label="Refresh workspace"
            >
              <RotateCcw size={15} />
            </button>
            <SelectMenu
              label="Sort work"
              value={sort}
              onChange={setSort}
              options={[
                {
                  value: "default",
                  label: "Needs attention first",
                  description: "Later open stages first",
                },
                {
                  value: "newest",
                  label: "Newest first",
                  description: "Most recently opened",
                },
                {
                  value: "oldest",
                  label: "Oldest first",
                  description: "Earliest opened",
                },
                {
                  value: "progress",
                  label: "Most progress",
                  description: "Highest completion first",
                },
              ]}
            />
          </div>
        </div>
        <div className="list-toolbar">
          <div
            className="filter-pills"
            role="group"
            aria-label={
              mode === "todo" ? "Filter to-dos" : "Current status filter"
            }
          >
            {(mode === "todo"
              ? ["To do", "Done", "All"]
              : ["Active", "All", ...statuses]
            ).map((value) => (
              <button
                key={value}
                aria-pressed={(mode === "todo" ? todoFilter : filter) === value}
                onClick={() =>
                  mode === "todo" ? setTodoFilter(value) : setFilter(value)
                }
              >
                {value}
                <span className="chip-count">{statusCount(value)}</span>
              </button>
            ))}
          </div>
          <span className="item-count">
            {visible.length} {visible.length === 1 ? "item" : "items"}
          </span>
        </div>
        {mode === "todo" && categories.length > 1 && (
          <div className="category-chips">
            <button
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
            >
              All categories{" "}
              <span className="chip-count">{categoryCount("all")}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className="category-filter"
                style={categoryStyle(c, configuration.categories)}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
                <span className="chip-count">{categoryCount(c)}</span>
              </button>
            ))}
          </div>
        )}
        {currentFiles
          .filter((f) => f.error)
          .map((file) => (
            <div className="notice error" key={file.path}>
              <div>
                <strong>{file.path}</strong>
                <p>{file.error}</p>
                <a href={`/${file.path}`} target="_blank" rel="noreferrer">
                  Inspect file ↗
                </a>
              </div>
              <button onClick={() => void refresh()}>Retry</button>
            </div>
          ))}
        {!data && !loadError ? (
          <div className="empty-state">
            <LoaderCircle className="spinning" />
            <h3>Loading workspace…</h3>
          </div>
        ) : !visible.length ? (
          <div className="empty-state">
            <h3>{items.length ? "No matching items." : "No items yet."}</h3>
            <p>
              {items.length
                ? "No items match this view. Try another filter."
                : "Your tracked work will appear here."}
            </p>
            {items.length > 0 && (
              <button
                className="button"
                onClick={() => {
                  setFilter("All");
                  setTodoFilter("All");
                  setCategory("all");
                }}
              >
                Show everything
              </button>
            )}
          </div>
        ) : (
          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Work items"
          >
            <table className="work-table">
              <thead>
                <tr>
                  {mode === "todo" && <th scope="col">Done</th>}
                  <th scope="col">ID</th>
                  <th scope="col">Work item</th>
                  <th scope="col">{mode === "todo" ? "Category" : "Status"}</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Opened</th>
                  <th scope="col">Notes</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map(({ file, row }) => {
                  const edit = drafts[file.path]?.edits[row.id],
                    deleted = edit?.delete;
                  return (
                    <tr
                      key={`${file.path}:${row.id}`}
                      className={deleted ? "is-deleting" : ""}
                    >
                      {mode === "todo" && (
                        <td>
                          <button
                            className={`todo-check ${row.done ? "checked" : ""}`}
                            role="checkbox"
                            aria-checked={!!row.done}
                            aria-label={`${row.done ? "Reopen" : "Complete"} ${row.id}`}
                            disabled={busy || !!deleted}
                            onClick={() => void toggleTodo(file, row)}
                          >
                            {row.done && <Check size={15} />}
                          </button>
                        </td>
                      )}
                      <td className="row-id">
                        {row.id}
                        {edit && (
                          <span className="draft-mark" title="Unsaved changes">
                            {" "}
                            •
                          </span>
                        )}
                      </td>
                      <td className="item-title">
                        <button onClick={() => openRow(file, row)}>
                          {String(row.task || row.bug || row.id)}
                        </button>
                        <div className="item-meta">
                          {mode === "progress" && scope === "all" && (
                            <span>{fileLabel(file.path)}</span>
                          )}
                          {row.severity && <span>{row.severity}</span>}
                          {row.est && <span>{row.est}</span>}
                        </div>
                      </td>
                      <td>
                        {mode === "todo" ? (
                          <CategoryBadge
                            category={categoryOf(row)}
                            categories={configuration.categories}
                          />
                        ) : (
                          <span
                            className="status-badge configured-status"
                            style={categoryStyle(
                              row.status || "",
                              configuration.statuses.map((s) => ({
                                name: s.name,
                                color: s.color,
                              })),
                            )}
                          >
                            <i />
                            {row.status}
                          </span>
                        )}
                      </td>
                      <td>
                        <ProgressMeter
                          row={row}
                          file={file.path}
                          configuration={configuration}
                        />
                      </td>
                      <td className="row-date">
                        {dateLabel(row.createdAt, false)}
                      </td>
                      <td className="row-notes">
                        {row.comments || <span className="muted">—</span>}
                      </td>
                      <td>
                        <div className="row-actions">
                          {deleted ? (
                            <button
                              className="undo-button"
                              disabled={busy}
                              onClick={() => undoRow(file.path, row.id)}
                            >
                              Undo
                            </button>
                          ) : (
                            <button
                              className="icon-button"
                              aria-label={`Delete ${row.id}`}
                              disabled={busy}
                              onClick={() => deleteRow(file, row)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          <button
                            className="icon-button"
                            aria-label={`Details for ${row.id}`}
                            onClick={() => openRow(file, row)}
                          >
                            <ChevronRight size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="list-footer">
          <span>
            <i className="live-dot" />
            Saved locally · refreshes automatically
          </span>
          <div>
            <button
              className="text-button"
              disabled={!completed.length || busy}
              onClick={() => setConfirm("bulk")}
            >
              Delete all done
              {scope === "all" && mode === "progress" ? " in all files" : ""}
            </button>
            {scope !== "all" && mode === "progress" && (
              <button
                className="text-button"
                disabled={busy || dirtyCount > 0}
                onClick={() => setConfirm("file")}
              >
                Delete collection
              </button>
            )}
          </div>
        </div>
      </section>
      {message && (
        <div className="toast" role="status">
          <Check size={16} />
          <span>{message}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
      {dirtyCount > 0 && (
        <div className="save-bar">
          <div>
            <span className="draft-indicator" />
            <strong>
              {dirtyCount} unsaved {dirtyCount === 1 ? "change" : "changes"}
            </strong>
            <span></span>
          </div>
          <button
            className="button"
            disabled={busy}
            onClick={() => {
              setDrafts({});
              setActionError("");
              setMessage("Drafts discarded. Saved work is unchanged.");
            }}
          >
            Discard
          </button>
          <button
            className="button primary"
            disabled={busy}
            onClick={requestSave}
          >
            {busy ? (
              <LoaderCircle className="spinning" size={15} />
            ) : (
              <Check size={15} />
            )}
            {deletionCount
              ? `Review ${deletionCount} ${deletionCount === 1 ? "deletion" : "deletions"}`
              : "Save changes"}
          </button>
        </div>
      )}
      <dialog
        ref={drawerRef}
        className={`detail-dialog ${selectedFile?.path === TODO ? "todo-detail" : ""}`}
        onCancel={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        <div className="detail-shell">
          {actionError && (
            <div className="notice error" role="alert">
              {actionError}
            </div>
          )}
          <header className="drawer-top">
            <div className="drawer-context">
              <span className="drawer-context-icon">
                {selectedFile?.path === TODO ? (
                  <CheckCheck size={16} />
                ) : (
                  <FolderHeart size={16} />
                )}
              </span>
              <div>
                <strong>
                  {selectedFile?.path === TODO ? "To-do" : "Work item"}
                </strong>
                <span>{selectedRow?.id || ""}</span>
              </div>
            </div>
            <button
              className="icon-button"
              aria-label="Close details"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
          </header>
          {selectedRow && selectedFile ? (
            selectedFile.path === TODO ? (
              <TodoDetails
                row={selectedRow}
                configuration={configuration}
                categories={[
                  ...new Set(
                    (todoFile?.rows || []).map((r) =>
                      String(r.category || r.section || "General"),
                    ),
                  ),
                ]}
                onCategory={(category) =>
                  stage(selectedFile, selectedRow.id, { category })
                }
                onFields={(fields) =>
                  stage(selectedFile, selectedRow.id, {
                    fields: {
                      ...drafts[selectedFile.path]?.edits[selectedRow.id]
                        ?.fields,
                      ...fields,
                    },
                  })
                }
                busy={busy}
                deleted={
                  !!drafts[selectedFile.path]?.edits[selectedRow.id]?.delete
                }
                dirty={dirtyCount > 0}
                onToggle={() => void toggleTodo(selectedFile, selectedRow)}
                onNote={(comments) =>
                  stage(selectedFile, selectedRow.id, { comments })
                }
                onSave={requestSave}
                onDelete={() => deleteRow(selectedFile, selectedRow)}
                onUndo={() => undoRow(selectedFile.path, selectedRow.id)}
              />
            ) : (
              <>
                <div className="drawer-title">
                  <p className="eyebrow">
                    {selectedRow.id} · {fileLabel(selectedFile.path)}
                  </p>
                  <h2>{String(selectedRow.task || selectedRow.bug)}</h2>
                </div>
                <div className="drawer-controls">
                  {selectedFile.path === TODO ? (
                    <button
                      className={`button ${selectedRow.done ? "sage-button" : "primary"}`}
                      disabled={busy}
                      onClick={() => void toggleTodo(selectedFile, selectedRow)}
                    >
                      <Check size={15} />
                      {selectedRow.done
                        ? "Completed · Reopen"
                        : "Mark complete"}
                    </button>
                  ) : (
                    <div className="status-field">
                      <span className="select-field-label">Status</span>
                      <SelectMenu
                        label="Status"
                        value={selectedRow.status || "To do"}
                        disabled={busy}
                        options={statuses.map((status) => ({
                          value: status,
                          label: status,
                        }))}
                        onChange={(value) =>
                          stage(selectedFile, selectedRow.id, {
                            status: value as Status,
                          })
                        }
                      />
                    </div>
                  )}
                  <div>
                    <label>
                      Progress <span>updated by AI</span>
                    </label>
                    <ProgressMeter
                      row={selectedRow}
                      file={selectedFile.path}
                      configuration={configuration}
                    />
                  </div>
                </div>
                {selectedFile.path === TODO && (
                  <div className="todo-category">
                    {String(
                      selectedRow.category || selectedRow.section || "General",
                    )}
                  </div>
                )}
                <div className="planning-facts">
                  <div>
                    <span>Estimated time</span>
                    <strong>{selectedRow.est || "Not assessed"}</strong>
                  </div>
                  <div>
                    <span>Difficulty</span>
                    <strong>
                      {selectedRow.difficulty
                        ? `${selectedRow.difficulty} / 100`
                        : "Not assessed"}
                    </strong>
                  </div>
                </div>
                <div className="date-facts">
                  <span>
                    {data?.estimates.some(
                      (e) =>
                        e.file === selectedFile.path &&
                        e.id === selectedRow.id &&
                        e.createdAt === selectedRow.createdAt,
                    )
                      ? "Opened (estimated)"
                      : "Opened"}
                    <strong>{dateLabel(selectedRow.createdAt)}</strong>
                  </span>
                  <span>
                    {selectedFile.path === TODO
                      ? "Completed"
                      : "Status changed"}
                    <strong>
                      {selectedFile.path === TODO && !selectedRow.done
                        ? "Not yet"
                        : dateLabel(
                            selectedFile.path === TODO
                              ? selectedRow.doneAt
                              : selectedRow.statusAt,
                          )}
                    </strong>
                  </span>
                </div>
                <CustomFields
                  configuration={configuration}
                  row={selectedRow}
                  disabled={busy}
                  onChange={(fields) =>
                    stage(selectedFile, selectedRow.id, {
                      fields: {
                        ...drafts[selectedFile.path]?.edits[selectedRow.id]
                          ?.fields,
                        ...fields,
                      },
                    })
                  }
                />
                <section className="detail-section note-section">
                  <label htmlFor="row-comment">Notes</label>
                  <textarea
                    id="row-comment"
                    maxLength={2000}
                    rows={5}
                    disabled={busy}
                    value={selectedRow.comments || ""}
                    placeholder="Add a note…"
                    onChange={(e) =>
                      stage(selectedFile, selectedRow.id, {
                        comments: e.target.value,
                      })
                    }
                  />
                  <small>
                    {(selectedRow.comments || "").length} / 2000 · saved with
                    Save changes
                  </small>
                </section>
                {Object.entries(selectedRow)
                  .filter(
                    ([key]) =>
                      !configuration.fields.some((f) => f.key === key) &&
                      ![
                        "id",
                        "task",
                        "bug",
                        "status",
                        "statusAt",
                        "createdAt",
                        "done",
                        "doneAt",
                        "comments",
                        "progress",
                        "est",
                        "difficulty",
                        "delete",
                        "category",
                        "section",
                      ].includes(key),
                  )
                  .map(([key, value]) => (
                    <section className="detail-section" key={key}>
                      <h3>
                        {configuration.fieldLabels[key] ||
                          labels[key] ||
                          key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                      </h3>
                      <div className="rich-text">
                        <DetailValue value={value} />
                      </div>
                    </section>
                  ))}
                <div className="drawer-bottom">
                  {dirtyCount > 0 && (
                    <button
                      className="button primary"
                      disabled={busy}
                      onClick={requestSave}
                    >
                      Save changes
                    </button>
                  )}
                  {drafts[selectedFile.path]?.edits[selectedRow.id]?.delete ? (
                    <button
                      className="button"
                      disabled={busy}
                      onClick={() => undoRow(selectedFile.path, selectedRow.id)}
                    >
                      Undo deletion
                    </button>
                  ) : (
                    <button
                      className="text-button"
                      disabled={busy}
                      onClick={() => deleteRow(selectedFile, selectedRow)}
                    >
                      <Trash2 size={14} />
                      Delete this item
                    </button>
                  )}
                </div>
              </>
            )
          ) : (
            <div className="empty-state">
              This item is no longer available. Close this panel and refresh.
            </div>
          )}
        </div>
      </dialog>
      <dialog
        ref={settingsRef}
        className="settings-dialog"
        onCancel={() => setSettingsOpen(false)}
      >
        <header className="drawer-top">
          <strong>Settings</strong>
          <button
            className="icon-button"
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
          >
            <X size={19} />
          </button>
        </header>
        <div className="settings-body">
          <nav className="settings-sections" aria-label="Settings sections">
            <button
              aria-pressed={settingsSection === "project"}
              onClick={() => setSettingsSection("project")}
            >
              Project
            </button>
            <button
              aria-pressed={settingsSection === "backup"}
              onClick={() => setSettingsSection("backup")}
            >
              Global Git backup
            </button>
          </nav>
          {settingsOpen && data && (
            <section hidden={settingsSection !== "project"}>
              <ProjectSettings
                project={data.project.id}
                workspaceName={data.project.name}
                workspaces={data.projects}
                disabled={dirtyCount > 0 || busy}
                categories={[
                  ...new Set(
                    (todoFile?.rows || []).map((r) =>
                      String(r.category || r.section || "Uncategorised"),
                    ),
                  ),
                ]}
                statusUsage={Object.fromEntries(
                  configuration.statuses.map((s) => [
                    s.name,
                    allProgress.filter(({ row }) => row.status === s.name)
                      .length,
                  ]),
                )}
                fieldKeys={[
                  ...new Set(
                    files.flatMap((f) =>
                      f.rows.flatMap((row) =>
                        Object.keys(row).filter(
                          (key) =>
                            ![
                              "id",
                              "task",
                              "bug",
                              "status",
                              "statusAt",
                              "createdAt",
                              "done",
                              "doneAt",
                              "comments",
                              "progress",
                              "est",
                              "difficulty",
                              "category",
                              "section",
                            ].includes(key),
                        ),
                      ),
                    ),
                  ),
                ]}
                request={api}
                onApplied={refresh}
              />
            </section>
          )}
          <section hidden={settingsSection !== "backup"}>
            <h2>Global data repository</h2>
            <p>
              Applies to every workspace on this machine. All workspaces share
              this Git repository and push destination.
            </p>
            <code className="storage-path">{storage?.directory}</code>
            <label htmlFor="storage-origin">
              Git origin <span>Optional</span>
            </label>
            <input
              id="storage-origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="git@github.com:you/petal-data.git"
              disabled={busy}
            />
            <p>
              Leave empty to keep checkpoints local. Connecting an origin
              enables pushing all project data when you create a checkpoint. Use
              a private repository for private work.
            </p>
            {actionError && (
              <div className="notice error" role="alert">
                {actionError}
              </div>
            )}
            <div className="settings-actions">
              <button className="button" onClick={() => setSettingsOpen(false)}>
                Cancel
              </button>
              <button
                className="button primary"
                disabled={busy || !storage}
                onClick={() =>
                  void run(async () => {
                    const result = await api<{
                      directory: string;
                      origin: string;
                    }>("/api/settings", { origin });
                    setStorage(result);
                    setSettingsOpen(false);
                    setMessage(
                      result.origin
                        ? "Origin connected. Checkpoints will commit and push."
                        : "Local only. Checkpoints will not push.",
                    );
                  })
                }
              >
                Save global settings
              </button>
            </div>
          </section>
        </div>
      </dialog>
      <dialog
        className="confirm-dialog"
        ref={confirmRef}
        onCancel={() => setConfirm(null)}
      >
        <h2>
          {confirm === "add"
            ? "New item"
            : confirm === "save"
              ? "Save deletions?"
              : confirm === "checkpoint"
                ? "Create checkpoint?"
                : confirm === "file"
                  ? "Remove this collection?"
                  : "Delete completed items?"}
        </h2>
        <p>
          {confirm === "add"
            ? "Enter a title. Details can be added later."
            : confirm === "save"
              ? `Delete ${deletionCount} marked ${deletionCount === 1 ? "item" : "items"} and save your other pending edits? Discard deletions keeps the items and preserves your other edits.`
              : confirm === "checkpoint"
                ? "Commit tracker data for all projects to the shared local repository. If an origin is connected in Settings, this also pushes to it."
                : confirm === "file"
                  ? `${scope} and its icon entry will be removed locally. This doesn’t push to your remote.`
                  : `Mark ${completed.length} completed items ${mode === "progress" && scope === "all" ? "across all progress files" : "in this file"} for deletion, including items hidden by filters. You can undo before saving.`}
        </p>
        {confirm === "add" && (
          <>
            <input
              className="new-item-input"
              aria-label="New item title"
              placeholder="Item title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              maxLength={2000}
            />
            {mode === "todo" && (
              <SelectMenu
                label="New to-do category"
                value={newCategory}
                options={[
                  ...new Set([
                    "General",
                    ...configuration.categories.map((c) => c.name),
                    ...(todoFile?.rows || []).map((r) =>
                      String(r.category || r.section || "General"),
                    ),
                  ]),
                ].map((name) => ({
                  value: name,
                  label: name,
                  color: configuration.categories.find((c) => c.name === name)
                    ?.color,
                }))}
                onChange={setNewCategory}
              />
            )}
          </>
        )}
        {confirm === "save" && (
          <ul className="deletion-summary">
            {Object.entries(drafts).flatMap(([file, draft]) =>
              Object.values(draft.edits)
                .filter((e) => e.delete)
                .map((e) => (
                  <li key={`${file}:${e.id}`}>
                    <strong>{e.id}</strong> · {fileLabel(file)}
                  </li>
                )),
            )}
          </ul>
        )}
        <div>
          {confirm === "save" && (
            <button className="button" onClick={discardDeletions}>
              Discard deletions
            </button>
          )}
          <button className="button" onClick={() => setConfirm(null)}>
            Cancel
          </button>
          <button
            className="button primary"
            disabled={confirm === "add" && !newTitle.trim()}
            onClick={() => void confirmAction()}
          >
            {confirm === "add"
              ? "Add item"
              : confirm === "save"
                ? "Delete & save"
                : confirm === "checkpoint"
                  ? "Create checkpoint"
                  : confirm === "file"
                    ? "Delete collection"
                    : "Mark for deletion"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
