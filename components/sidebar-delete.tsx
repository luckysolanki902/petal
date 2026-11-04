"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
export default function SidebarDelete({
  id,
  busy,
  onConfirm,
}: {
  id: string;
  busy: boolean;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming)
    return (
      <button
        className="text-button"
        disabled={busy}
        onClick={() => setConfirming(true)}
      >
        <Trash2 size={14} /> Delete item
      </button>
    );
  return (
    <div
      className="sidebar-delete-confirm"
      role="group"
      aria-label={`Confirm deletion of ${id}`}
    >
      <div>
        <strong>Delete {id}?</strong>
        <p>
          Only this item will be deleted. Its unsaved changes will be discarded.
          Other drafts stay unchanged.
        </p>
      </div>
      <div className="sidebar-delete-buttons">
        <button
          className="button"
          disabled={busy}
          onClick={() => setConfirming(false)}
        >
          No, keep it
        </button>
        <button className="button danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  );
}
