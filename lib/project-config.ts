import type { Row } from "./model";
export type ProjectConfiguration = {
  statuses: { name: string; complete: boolean; color: number }[];
  categories: { name: string; color: number }[];
  fields: { key: string; label: string; type: "text" | "number" | "boolean" }[];
  fieldLabels: Record<string, string>;
};
export const DEFAULT_CONFIGURATION: ProjectConfiguration = {
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
export const CORE_FIELDS = new Set([
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
export function configurationErrors(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input))
    return ["Expected project configuration."];
  const c = input as ProjectConfiguration;
  if (
    Object.keys(c).some(
      (k) => !["statuses", "categories", "fields", "fieldLabels"].includes(k),
    )
  )
    errors.push("Unknown configuration key.");
  const names = (rows: unknown, kind: string, max: number) => {
    if (!Array.isArray(rows) || rows.length > max) {
      errors.push(`${kind} must be an array with at most ${max} entries.`);
      return false;
    }
    const used = new Set<string>();
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
            ? "Status names must be unique, trimmed text (1–60 characters)."
            : "Category names must be unique nonempty text.",
        );
      else used.add(kind === "Status" ? row.name.toLowerCase() : row.name);
      if (!Number.isInteger(row?.color) || row.color < 0 || row.color > 360)
        errors.push(`${kind} colors must be a hue from 0–360.`);
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
    const keys = new Set<string>();
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
export function rowConfigurationErrors(
  rows: Row[],
  file: string,
  c: ProjectConfiguration,
): string[] {
  const errors: string[] = [];
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
export const completeStatus = (
  status: unknown,
  c: ProjectConfiguration = DEFAULT_CONFIGURATION,
) => c.statuses.some((s) => s.name === status && s.complete);
