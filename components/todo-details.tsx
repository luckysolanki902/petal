import { Check, Trash2 } from "lucide-react";
import { DetailValue, dateLabel } from "./detail-value";
import type { Row } from "../lib/model";
type Props = {
  row: Row;
  busy: boolean;
  deleted: boolean;
  dirty: boolean;
  onToggle: () => void;
  onNote: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onUndo: () => void;
};
const core = new Set([
  "id",
  "task",
  "bug",
  "done",
  "doneAt",
  "createdAt",
  "status",
  "statusAt",
  "category",
  "section",
  "comments",
  "progress",
  "difficulty",
  "est",
  "delete",
]);
export default function TodoDetails({
  row,
  busy,
  deleted,
  dirty,
  onToggle,
  onNote,
  onSave,
  onDelete,
  onUndo,
}: Props) {
  const details = Object.entries(row).filter(([key]) => !core.has(key));
  return (
    <div className="todo-panel">
      <div className="todo-panel-toolbar">
        <button
          className={`completion-control ${row.done ? "checked" : ""}`}
          disabled={busy || deleted}
          onClick={onToggle}
          role="checkbox"
          aria-checked={!!row.done}
          aria-label={row.done ? "Reopen to-do" : "Complete to-do"}
        >
          <span>{row.done && <Check size={14} />}</span>
          {row.done ? "Completed" : "Mark complete"}
        </button>
        <span className="todo-panel-category">
          {String(row.category || row.section || "General")}
        </span>
      </div>
      <section className="todo-task-copy rich-text">
        <h2 className="sr-only">Task</h2>
        <DetailValue value={String(row.task || row.bug || row.id)} />
      </section>
      <section className="todo-notes">
        <label htmlFor="todo-note">Notes</label>
        <textarea
          id="todo-note"
          rows={4}
          maxLength={2000}
          disabled={busy}
          value={row.comments || ""}
          placeholder="Add a note…"
          onChange={(e) => onNote(e.target.value)}
        />
        <div className="note-caption">
          <span>Saved with Save changes</span>
          <span>{(row.comments || "").length} / 2000</span>
        </div>
      </section>
      <section className="todo-planning" aria-label="AI planning">
        <div>
          <span>Progress</span>
          <strong>
            {row.done
              ? "100%"
              : typeof row.progress === "number"
                ? `${row.progress}%`
                : "—"}
          </strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong>{row.est || "—"}</strong>
        </div>
        <div>
          <span>Difficulty</span>
          <strong>
            {typeof row.difficulty === "number" ? `${row.difficulty}/100` : "—"}
          </strong>
        </div>
        <small>Assessed by your agent</small>
      </section>
      {details.length > 0 && (
        <details className="todo-extra">
          <summary>
            Additional details <span>{details.length}</span>
          </summary>
          {details.map(([key, value]) => (
            <section className="detail-section" key={key}>
              <h3>{key.replace(/([a-z])([A-Z])/g, "$1 $2")}</h3>
              <div className="rich-text">
                <DetailValue value={value} />
              </div>
            </section>
          ))}
        </details>
      )}
      <dl className="todo-timestamps">
        <div>
          <dt>Opened</dt>
          <dd>{dateLabel(row.createdAt)}</dd>
        </div>
        {row.done && (
          <div>
            <dt>Completed</dt>
            <dd>{dateLabel(row.doneAt)}</dd>
          </div>
        )}
      </dl>
      <div className="todo-panel-actions">
        <button
          className="text-button"
          disabled={busy}
          onClick={deleted ? onUndo : onDelete}
        >
          {!deleted && <Trash2 size={14} />}{" "}
          {deleted ? "Undo deletion" : "Delete item"}
        </button>
        {dirty && (
          <button className="button primary" disabled={busy} onClick={onSave}>
            Save changes
          </button>
        )}
      </div>
    </div>
  );
}
