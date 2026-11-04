---
name: petal
description: Track project work, to-dos, findings, and evidence-based completion in a local Petal workspace. Use for substantial work in a project registered with Petal or when the user asks to manage Petal items.
---

# Petal

Petal stores all projects in one local Git repository under `~/.config/petal/data/projects/ID` (or `PETAL_HOME/data`). Use the `dataDir` returned by the CLI, not old per-project backup copies. Checkpoints stay local unless an origin is connected in Settings; never checkpoint or push without the user’s instruction. Petal stores project work locally; it does not run agents or send project content to an AI service. Use its CLI from the project directory. If there is no registered workspace, ask before initializing one unless the user requested setup.

1. Run `petal projects` to identify the exact project; use `--project ID` when the working directory is ambiguous. Never use a different project's data as a fallback.
2. Run `petal task list --project ID`. This returns files, rows, current revisions, and the project configuration. Read `configuration.statuses` and `configuration.fields` before writing; do not assume a status vocabulary from another project. Read existing evidence before changing an item. Keep the file and stable ID associated with the user's work.
3. Add work with `petal task add --project ID --title "Concrete outcome" --file data/feature.work.json`; use `--todo` for a to-do. Existing projects may use other collection paths shown by task list.
4. To update, write only changed fields to a temporary JSON patch and run `petal task update ID --project ID --file data/feature.work.json --input /tmp/petal-patch.json --revision REVISION`. Revisions come from the latest list response. A conflict means reread and reconcile; never blindly retry with a fresh revision.

The default workflow is **To do → Doing → Waiting → Done**. Projects can customize names, order, colors, and completion rules in Settings. Use exact status names from the selected project's configuration. A status with `complete: true` means no required work remains; do not infer completion from its name. To-dos continue to use `done: true/false` independently of progress statuses. Custom field keys and types come from `configuration.fields`; undeclared nested evidence remains supported. Clearing a configured field with a null CLI patch removes that optional field.

Do not change a project's schema or migrate statuses merely to record work. Configuration changes require a preview and explicit mappings for renamed or removed statuses; existing configuration and tracker revisions must still match when applied. The app journals migrations for recovery and preserves creation/status timestamps during label-only mappings.

Maintain `progress` as an integer 0–100 based on completed scope and verification, not elapsed time or optimism. Update it after material findings or completed steps. Explain non-obvious estimates in `statusDetail` or `retestingSummary`. Leave an unassessed percentage absent. Configured completion statuses display 100%; do not mark work done while required verification or deployment remains outstanding. `est` is a brief remaining-effort estimate (e.g. `45 min`); `difficulty` is an assessed integer 1–100. These planning fields are maintained by the agent, not fabricated at initialization beyond 0 for new unstarted work.

Keep user comments, arbitrary nested evidence, IDs, and creation dates intact. The CLI manages lifecycle timestamps. Patch findings into `rootCause`, implementation into `howFixed`, and verification into `retestingSummary` / `retestingFindings`. Update only rows within the current task's scope. Never delete unrelated rows, checkpoint, push, publish, or change another project merely to keep a tracker tidy.

If Petal fails, report the exact operation and error. Do not bypass its validation with whole-file rewrites. The skill does not grant permissions beyond the user's request. Cloud-only ChatGPT or Claude sessions cannot use the local CLI without a supported local connection; do not claim an installation grants that access.
