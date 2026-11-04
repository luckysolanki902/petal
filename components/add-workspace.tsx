"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Plus, X, FolderPlus, Sparkles } from "lucide-react";
export default function AddWorkspace({
  disabled = false,
  first = false,
}: {
  disabled?: boolean;
  first?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [open, setOpen] = useState(false),
    [name, setName] = useState(""),
    [root, setRoot] = useState("");
  const [agentFiles, setAgentFiles] = useState(true),
    [skills, setSkills] = useState(true);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Progress-Save": "1" },
        body: JSON.stringify({ name, root, agentFiles, skills }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Workspace setup failed.");
      window.location.href =
        "/?project=" + encodeURIComponent(result.project.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Workspace setup failed.");
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
        {first ? "Add your first workspace" : "Add workspace"}
      </button>
      <dialog
        ref={dialog}
        className="workspace-onboarding"
        onCancel={(e) => {
          if (busy) e.preventDefault();
          else setOpen(false);
        }}
      >
        <header className="drawer-top">
          <strong>
            <FolderPlus size={18} /> New workspace
          </strong>
          <button
            className="icon-button"
            aria-label="Close workspace setup"
            disabled={busy}
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </header>
        <form onSubmit={submit} className="onboarding-body">
          <h2>A home for your project’s progress</h2>
          <p>
            Connect an existing project folder. Tasks and settings stay separate
            for each workspace, with JSON stored in your shared Petal data
            repository.
          </p>
          <label htmlFor={`${id}-name`}>Workspace name</label>
          <input
            id={`${id}-name`}
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My project"
            disabled={busy}
            autoFocus
          />
          <label htmlFor={`${id}-root`}>Project folder · full path</label>
          <input
            id={`${id}-root`}
            required
            value={root}
            onChange={(e) => setRoot(e.target.value)}
            placeholder="/path/to/your/project"
            disabled={busy}
          />
          <small>
            The source folder on this machine, where your agent works.
          </small>
          <section className="agent-connect">
            <h3>
              <Sparkles size={17} /> Connect your coding agents
            </h3>
            <label className="setup-choice">
              <input
                type="checkbox"
                checked={skills}
                onChange={(e) => setSkills(e.target.checked)}
                disabled={busy}
              />
              <span>
                Install Petal skills globally
                <small>
                  Claude Code, Codex, and OpenCode can use the skill across
                  projects. Existing unmanaged skills are preserved.
                </small>
              </span>
            </label>
            <label className="setup-choice">
              <input
                type="checkbox"
                checked={agentFiles}
                onChange={(e) => setAgentFiles(e.target.checked)}
                disabled={busy}
              />
              <span>
                Connect this project’s instructions
                <small>
                  Adds a managed section to AGENTS.md and CLAUDE.md. Existing
                  instructions are preserved.
                </small>
              </span>
            </label>
            <p>
              Restart existing agent sessions after installing. The skill uses
              the current workspace automatically and asks Yes / No before
              creating one for a new project.
            </p>
          </section>
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <div className="settings-actions">
            <button
              type="button"
              className="button"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="button primary" disabled={busy}>
              {busy ? "Connecting…" : "Create workspace"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
