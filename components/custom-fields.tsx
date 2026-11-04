import type { ProjectConfiguration } from "../lib/project-config";
import type { Row } from "../lib/model";
export default function CustomFields({
  configuration,
  row,
  disabled,
  onChange,
}: {
  configuration: ProjectConfiguration;
  row: Row;
  disabled: boolean;
  onChange: (fields: Record<string, unknown>) => void;
}) {
  if (!configuration.fields.length) return null;
  return (
    <section className="custom-fields">
      <h3>Project fields</h3>
      {configuration.fields.map((f) => (
        <label key={f.key}>
          {configuration.fieldLabels[f.key] || f.label}
          {f.type === "boolean" ? (
            <input
              type="checkbox"
              checked={row[f.key] === true}
              disabled={disabled}
              onChange={(e) => onChange({ [f.key]: e.target.checked })}
            />
          ) : (
            <input
              type={f.type === "number" ? "number" : "text"}
              step={f.type === "number" ? "any" : undefined}
              disabled={disabled}
              value={
                typeof row[f.key] === "string" || typeof row[f.key] === "number"
                  ? String(row[f.key])
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (f.type === "number" && !value) {
                  onChange({ [f.key]: null });
                  return;
                }
                onChange({
                  [f.key]: f.type === "number" ? Number(value) : value,
                });
              }}
            />
          )}
        </label>
      ))}
    </section>
  );
}
