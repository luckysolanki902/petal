"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import CategoryBadge from "./category-badge";
import SelectMenu from "./select-menu";
import type { ProjectConfiguration } from "../lib/project-config";
type ConfigResponse = { configuration: ProjectConfiguration; revision: string };
type Preview = {
  token: string;
  files: { file: string; changes: number }[];
  totalChanges: number;
};
type Props = {
  project: string;
  workspaceName: string;
  workspaces: { id: string; name: string }[];
  disabled: boolean;
  categories: string[];
  statusUsage: Record<string, number>;
  fieldKeys: string[];
  request: <T>(url: string, body?: unknown) => Promise<T>;
  onApplied: () => Promise<void>;
};
const palette = [
  { value: "220", label: "Blue", color: 220 },
  { value: "32", label: "Amber", color: 32 },
  { value: "48", label: "Gold", color: 48 },
  { value: "150", label: "Green", color: 150 },
  { value: "180", label: "Teal", color: 180 },
  { value: "270", label: "Purple", color: 270 },
  { value: "335", label: "Rose", color: 335 },
  { value: "0", label: "Red", color: 0 },
];
const colorOptions = (color: number) =>
  palette.some((p) => p.color === color)
    ? palette
    : [{ value: String(color), label: "Custom", color }, ...palette];
export default function ProjectSettings({
  project,
  workspaceName,
  workspaces,
  disabled,
  categories,
  statusUsage,
  fieldKeys,
  request,
  onApplied,
}: Props) {
  const [section, setSection] = useState("statuses");
  const [sourceProject, setSourceProject] = useState("");
  const [base, setBase] = useState<ConfigResponse | null>(null),
    [draft, setDraft] = useState<ProjectConfiguration | null>(null),
    [mapping, setMapping] = useState<Record<string, string>>({}),
    [preview, setPreview] = useState<Preview | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function load() {
    setError("");
    try {
      const result = await request<ConfigResponse>(
        "/api/project-configuration",
      );
      setBase(result);
      setDraft(structuredClone(result.configuration));
      setMapping({});
      setPreview(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, [project]);
  function change(next: ProjectConfiguration) {
    setDraft(next);
    setPreview(null);
    setError("");
    setMessage("");
  }
  async function submit(apply: boolean) {
    if (!draft || !base) return;
    setBusy(true);
    setError("");
    try {
      if (apply && preview) {
        const result = await request<ConfigResponse>(
          "/api/project-configuration",
          {
            configuration: draft,
            revision: base.revision,
            mapping,
            token: preview.token,
          },
        );
        setBase(result);
        setDraft(structuredClone(result.configuration));
        setPreview(null);
        setMessage("Project settings applied locally.");
        await onApplied();
      } else {
        setPreview(
          await request<Preview>("/api/project-configuration-preview", {
            configuration: draft,
            revision: base.revision,
            mapping,
          }),
        );
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!draft || !base)
    return (
      <section className="project-settings">
        <h2>{workspaceName} settings</h2>
        {error ? (
          <div role="alert">
            {error}
            <button className="button" onClick={() => void load()}>
              Retry
            </button>
          </div>
        ) : (
          <p>Loading project settings…</p>
        )}
      </section>
    );
  const locked = disabled || busy;
  return (
    <section className="project-settings">
      <h2>{workspaceName} settings</h2>
      <p>Customize this project’s workflow, categories, and fields.</p>
      {disabled && (
        <p className="notice">
          Save or discard tracker drafts before changing project settings.
        </p>
      )}
      {workspaces.some((w) => w.id !== project) && (
        <details className="config-import">
          <summary>Import from another workspace</summary>
          <p>
            Copy its statuses, categories, fields, and labels into this editor.
            Tasks stay where they are. Review and apply before this workspace
            changes.
          </p>
          <div className="config-import-controls">
            <SelectMenu
              label="Import settings from"
              value={sourceProject}
              disabled={disabled || busy}
              options={[
                { value: "", label: "Choose workspace" },
                ...workspaces
                  .filter((w) => w.id !== project)
                  .map((w) => ({ value: w.id, label: w.name })),
              ]}
              onChange={setSourceProject}
            />
            <button
              className="button"
              disabled={!sourceProject || disabled || busy}
              onClick={() => {
                setBusy(true);
                setError("");
                void request<{
                  configuration: ProjectConfiguration;
                  source: { name: string };
                }>("/api/project-configuration-import", { sourceProject })
                  .then((result) => {
                    change(structuredClone(result.configuration));
                    setMapping({});
                    setMessage(
                      `Imported from ${result.source.name} into this draft. Review changes to continue.`,
                    );
                  })
                  .catch((e) => setError((e as Error).message))
                  .finally(() => setBusy(false));
              }}
            >
              Import into draft
            </button>
          </div>
        </details>
      )}
      <nav className="config-tabs" aria-label="Project settings sections">
        {[
          ["statuses", "Statuses"],
          ["categories", "To-do categories"],
          ["fields", "Fields"],
          ["labels", "Labels"],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={section === value}
            onClick={() => setSection(value)}
          >
            {label}
          </button>
        ))}
      </nav>
      <fieldset disabled={locked} hidden={section !== "statuses"}>
        <legend>Statuses</legend>
        <p>
          Name each stage and choose whether it keeps work open or marks it
          complete.
        </p>
        {draft.statuses.map((status, i) => (
          <div className="config-status" key={i}>
            <input
              aria-label={`Status ${i + 1} name`}
              value={status.name}
              maxLength={60}
              onChange={(e) =>
                change({
                  ...draft,
                  statuses: draft.statuses.map((s, n) =>
                    n === i ? { ...s, name: e.target.value } : s,
                  ),
                })
              }
            />
            <SelectMenu
              className="color-picker"
              label={`Status ${i + 1} color`}
              disabled={locked}
              value={String(status.color)}
              options={colorOptions(status.color)}
              onChange={(value) =>
                change({
                  ...draft,
                  statuses: draft.statuses.map((s, n) =>
                    n === i ? { ...s, color: Number(value) } : s,
                  ),
                })
              }
            />
            <SelectMenu
              label={`Status ${i + 1} behavior`}
              disabled={locked}
              value={status.complete ? "complete" : "open"}
              options={[
                { value: "open", label: "Open work" },
                { value: "complete", label: "Completed" },
              ]}
              onChange={(value) =>
                change({
                  ...draft,
                  statuses: draft.statuses.map((s, n) =>
                    n === i ? { ...s, complete: value === "complete" } : s,
                  ),
                })
              }
            />
            <button
              className="icon-button"
              aria-label={`Move status ${i + 1} up`}
              disabled={i === 0}
              onClick={() => {
                const statuses = [...draft.statuses];
                [statuses[i - 1], statuses[i]] = [statuses[i], statuses[i - 1]];
                change({ ...draft, statuses });
              }}
            >
              <ArrowUp size={14} />
            </button>
            <button
              className="icon-button"
              aria-label={`Remove status ${i + 1}`}
              onClick={() =>
                change({
                  ...draft,
                  statuses: draft.statuses.filter((_, n) => n !== i),
                })
              }
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          className="button"
          onClick={() =>
            change({
              ...draft,
              statuses: [
                ...draft.statuses,
                { name: "New status", complete: false, color: 210 },
              ],
            })
          }
        >
          <Plus size={14} />
          Add status
        </button>
        {base.configuration.statuses.some(
          (s) =>
            !draft.statuses.some((next) => next.name === s.name) &&
            (statusUsage[s.name] || 0) > 0,
        ) && (
          <>
            {" "}
            <h3>Move existing items</h3>
            <p>
              Choose the new stage for items in the status you renamed or
              removed.
            </p>
            {base.configuration.statuses
              .filter(
                (s) =>
                  !draft.statuses.some((next) => next.name === s.name) &&
                  (statusUsage[s.name] || 0) > 0,
              )
              .map((status) => (
                <div className="config-mapping" key={status.name}>
                  <span>{status.name}</span>
                  <SelectMenu
                    label={`Map ${status.name}`}
                    disabled={locked}
                    value={
                      mapping[status.name] ||
                      (draft.statuses.some((s) => s.name === status.name)
                        ? status.name
                        : "")
                    }
                    options={[
                      { value: "", label: "Choose destination" },
                      ...draft.statuses.map((s) => ({
                        value: s.name,
                        label: s.name || "Unnamed",
                      })),
                    ]}
                    onChange={(value) => {
                      setMapping((previous) => ({
                        ...previous,
                        [status.name]: value,
                      }));
                      setPreview(null);
                    }}
                  />
                </div>
              ))}
          </>
        )}
      </fieldset>
      <fieldset disabled={locked} hidden={section !== "categories"}>
        <legend>To-do categories</legend>
        <p>
          Group to-dos by work area or purpose, such as Work, Personal, or
          Errands. Categories appear as filter chips above your to-do list and
          colored badges in its table and sidebar.
        </p>
        <div className="category-location-preview">
          <span className="preview-caption">
            Example · above your to-do list
          </span>
          <div className="preview-chips">
            <span>All categories</span>
            {(draft.categories.length
              ? draft.categories.slice(0, 3)
              : [
                  { name: "Work", color: 220 },
                  { name: "Personal", color: 270 },
                ]
            ).map((c) => (
              <CategoryBadge
                key={c.name}
                category={c.name || "Category"}
                categories={
                  draft.categories.length
                    ? draft.categories
                    : [
                        { name: "Work", color: 220 },
                        { name: "Personal", color: 270 },
                      ]
                }
              />
            ))}
          </div>
          <div className="preview-todo">
            <span>Example to-do</span>
            <CategoryBadge
              category={draft.categories[0]?.name || "Work"}
              categories={
                draft.categories.length
                  ? draft.categories
                  : [{ name: "Work", color: 220 }]
              }
            />
          </div>
          <span className="preview-caption">
            The same badge appears in the item’s sidebar.
          </span>
        </div>
        {draft.categories.map((category, i) => (
          <div className="config-category" key={i}>
            <input
              aria-label={`Category ${i + 1} name`}
              value={category.name}
              maxLength={60}
              onChange={(e) =>
                change({
                  ...draft,
                  categories: draft.categories.map((c, n) =>
                    n === i ? { ...c, name: e.target.value } : c,
                  ),
                })
              }
            />
            <SelectMenu
              className="color-picker"
              label={`Category ${i + 1} color`}
              disabled={locked}
              value={String(category.color)}
              options={colorOptions(category.color)}
              onChange={(value) =>
                change({
                  ...draft,
                  categories: draft.categories.map((c, n) =>
                    n === i ? { ...c, color: Number(value) } : c,
                  ),
                })
              }
            />
            <button
              className="icon-button"
              aria-label={`Remove category ${i + 1}`}
              onClick={() =>
                change({
                  ...draft,
                  categories: draft.categories.filter((_, n) => n !== i),
                })
              }
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="config-actions">
          <button
            className="button"
            onClick={() =>
              change({
                ...draft,
                categories: [
                  ...draft.categories,
                  { name: "New category", color: 210 },
                ],
              })
            }
          >
            <Plus size={14} />
            Add category
          </button>
          {categories.some(
            (name) => !draft.categories.some((c) => c.name === name),
          ) && (
            <button
              className="button"
              onClick={() =>
                change({
                  ...draft,
                  categories: [
                    ...draft.categories,
                    ...categories
                      .filter(
                        (name) =>
                          !draft.categories.some((c) => c.name === name),
                      )
                      .map((name, i) => ({ name, color: (i * 59 + 32) % 360 })),
                  ],
                })
              }
            >
              Import current categories
            </button>
          )}
        </div>
      </fieldset>
      <fieldset disabled={locked} hidden={section !== "fields"}>
        <legend>Custom fields</legend>
        <p>
          Add details such as Owner or Budget. These appear as editable inputs
          in each item’s sidebar. Removing a field here keeps its saved values
          as evidence.
        </p>
        {draft.fields.map((field, i) => (
          <div className="config-field" key={i}>
            <input
              aria-label={`Field ${i + 1} key`}
              placeholder="fieldKey"
              value={field.key}
              onChange={(e) =>
                change({
                  ...draft,
                  fields: draft.fields.map((f, n) =>
                    n === i ? { ...f, key: e.target.value } : f,
                  ),
                })
              }
            />
            <input
              aria-label={`Field ${i + 1} label`}
              placeholder="Display label"
              value={field.label}
              onChange={(e) =>
                change({
                  ...draft,
                  fields: draft.fields.map((f, n) =>
                    n === i ? { ...f, label: e.target.value } : f,
                  ),
                })
              }
            />
            <SelectMenu
              label={`Field ${i + 1} type`}
              value={field.type}
              disabled={locked}
              options={[
                { value: "text", label: "Text" },
                { value: "number", label: "Number" },
                { value: "boolean", label: "Checkbox" },
              ]}
              onChange={(value) =>
                change({
                  ...draft,
                  fields: draft.fields.map((f, n) =>
                    n === i
                      ? { ...f, type: value as "text" | "number" | "boolean" }
                      : f,
                  ),
                })
              }
            />
            <button
              className="icon-button"
              aria-label={`Remove field ${i + 1}`}
              onClick={() =>
                change({
                  ...draft,
                  fields: draft.fields.filter((_, n) => n !== i),
                })
              }
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          className="button"
          onClick={() =>
            change({
              ...draft,
              fields: [...draft.fields, { key: "", label: "", type: "text" }],
            })
          }
        >
          <Plus size={14} />
          Add field
        </button>
      </fieldset>
      <fieldset disabled={locked} hidden={section !== "labels"}>
        <legend>Field labels</legend>
        <p>
          Choose your own display names for extra fields in the item sidebar.
          Custom fields already use the labels you give them in Fields.
        </p>
        {!Object.keys(draft.fieldLabels).length && (
          <p className="config-empty">
            No custom labels yet. Add a label for a saved field, or create your
            own field in Fields.
          </p>
        )}
        {Object.entries(draft.fieldLabels).map(([key, value], i) => (
          <div className="config-label-edit" key={i}>
            <label>
              Saved field
              <input
                aria-label={`Label ${i + 1} field`}
                value={key}
                maxLength={100}
                placeholder="e.g. owner"
                onChange={(e) => {
                  const next = e.target.value;
                  if (next !== key && Object.hasOwn(draft.fieldLabels, next)) {
                    setError("That field already has a label.");
                    return;
                  }
                  change({
                    ...draft,
                    fieldLabels: Object.fromEntries(
                      Object.entries(draft.fieldLabels).map(([k, v], n) => [
                        n === i ? next : k,
                        v,
                      ]),
                    ),
                  });
                }}
              />
            </label>
            <label>
              Display name
              <input
                aria-label={`Label ${i + 1} name`}
                value={value}
                maxLength={80}
                placeholder="e.g. Assigned to"
                onChange={(e) =>
                  change({
                    ...draft,
                    fieldLabels: {
                      ...draft.fieldLabels,
                      [key]: e.target.value,
                    },
                  })
                }
              />
            </label>
            <button
              className="icon-button"
              aria-label={`Remove label ${i + 1}`}
              onClick={() => {
                const fieldLabels = { ...draft.fieldLabels };
                delete fieldLabels[key];
                change({ ...draft, fieldLabels });
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="config-actions">
          <button
            className="button"
            onClick={() => {
              let key =
                fieldKeys.find((k) => !Object.hasOwn(draft.fieldLabels, k)) ||
                "customField";
              let i = 2;
              const base = key;
              while (Object.hasOwn(draft.fieldLabels, key)) key = base + i++;
              change({
                ...draft,
                fieldLabels: {
                  ...draft.fieldLabels,
                  [key]: key.replace(/([a-z])([A-Z])/g, "$1 $2"),
                },
              });
            }}
          >
            <Plus size={14} />
            Add label
          </button>
        </div>
      </fieldset>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {message && <p role="status">{message}</p>}
      {preview && (
        <div className="config-preview">
          <strong>Review changes</strong>
          <p>
            {preview.totalChanges} changes in {preview.files.length} tracker
            files. Creation and status dates are preserved. The new
            configuration applies only to this project.
          </p>
          {preview.files.map((f) => (
            <div key={f.file}>
              {f.file} · {f.changes} changes
            </div>
          ))}
        </div>
      )}
      <div className="config-actions">
        <button
          className="button"
          disabled={locked}
          onClick={() => void load()}
        >
          Reload saved
        </button>
        <button
          className="button primary"
          disabled={locked}
          onClick={() => void submit(!!preview)}
        >
          {busy ? "Working…" : preview ? "Apply changes" : "Review changes"}
        </button>
      </div>
    </section>
  );
}
