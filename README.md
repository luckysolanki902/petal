# Petal

Local task and progress tracking for **Claude Code, OpenAI Codex, and OpenCode**.

Petal gives coding agents and people a shared project dashboard backed by JSON files and Git. Track tasks, to-dos, findings, notes, and verified progress across multiple projects. It runs on your machine without an account, a model API key, or a cloud database.

- **Agent skills:** install instructions for Claude Code, Codex, and OpenCode.
- **Multiple projects:** one dashboard and one separate, local Git repository for tracker data.
- **Project customization:** statuses, completion rules, categories/colors, typed custom fields, and labels with previewed migrations.
- **Evidence alongside work:** preserve findings, verification, nested metadata, IDs, and dates.
- **Explicit Git sync:** checkpoints stay local unless you connect an origin in Settings.
- **Light and dark themes:** cream or a black sky with shooting stars; keyboard-accessible menus and reduced-motion support.

[Source](https://github.com/luckysolanki902/petal) · [Issues](https://github.com/luckysolanki902/petal/issues) · [MIT license](LICENSE)

## Run from source

Requires Node.js 22 or newer, npm, and Git for checkpoints.

```sh
git clone https://github.com/luckysolanki902/petal.git
cd petal
npm ci
npm run build
npm link
petal setup
cd /path/to/your/project
petal init
petal
```

`petal init` creates a tracker under `~/.config/petal/data/projects/` and registers the project locally. It adds a small managed section to the source project’s `AGENTS.md` and `CLAUDE.md`, preserving existing instructions. This lets agents discover tracking from the source directory. Use `--no-agent-files` to skip this. Repeat it in another project; the dashboard's project selector switches between them. `petal` starts or reuses a background server at `http://localhost:8766` and opens your browser.

The npm package name is `petal-workspace`; it is **not yet published to npm**. Use the source instructions above or create a local installable tarball:

```sh
npm pack
npm install -g ./petal-workspace-0.1.0.tgz
```

## Task tracking

| Status  | Meaning                                                    |
| ------- | ---------------------------------------------------------- |
| To do   | Ready to start                                             |
| Doing   | Investigation, implementation, or verification is underway |
| Waiting | A decision or external dependency needs attention          |
| Done    | No required work remains                                   |

These are the defaults; projects can define their own workflow and completion rules in Settings.

Each item can also have an AI-maintained percentage, remaining-time estimate, and difficulty. An unassessed percentage displays a dash. Completion is an estimate of verified scope, not a timer. Configured completion statuses display 100%.

- Switch collections with icon chips; keep the overview across all work when that is more useful.
- Click a row to see findings, references, arbitrary nested evidence, timestamps, and notes.
- Check a to-do once to save immediately. No confirmation dialog.
- Delete an individual item without a dialog, undo on its row, then review the final Save/Discard confirmation to persist.
- Bulk deletion includes hidden completed rows in the disclosed scope; it confirms before staging.
- Drafts survive reloads in the same browser session. Revision conflicts keep the draft and reject stale writes; review the latest evidence before discarding/reapplying it.
- Project switching is disabled while drafts are pending. Save or discard first.
- Checkpoint commits all registered project trackers to one shared Git repository. It stays local unless you connect an origin in Settings; with an origin, an explicit checkpoint also pushes. Disconnect the origin to return to local-only operation. No Git publication happens in the background.

## Project configuration in Settings

Open **Settings → Project** to customize the selected project:

| Area          | Options                                                               |
| ------------- | --------------------------------------------------------------------- |
| Workflow      | Status names, order, colors, and which statuses complete work         |
| Categories    | Suggested category names and colors; existing names stay valid        |
| Custom fields | Optional text, number, and checkbox fields, editable in item details  |
| Labels        | Display names for findings, changes, verification, and status details |

Click **Review changes**, review the affected files, then **Apply changes**. Renaming or removing an existing status needs an explicit mapping. A stale preview cannot overwrite newer tracker changes. The app preserves IDs, evidence, creation dates, and status dates during label mappings, keeps a local migration audit, and journals multi-file writes so an interrupted application can roll back on the next operation. Changing a field type is rejected when existing values conflict; removing a definition preserves its saved values as extra evidence.

Configuration lives in `project-settings.json` beside the project's `data/` directory. The dashboard, CLI, save routes, counts, completion percentages, and bulk deletion share these rules. Agents receive the configuration from `petal task list`; they should use its exact status names and field types. Changing Settings never publishes data. To reuse a setup, choose **Import from another workspace**. It copies configuration into the editor only; it never copies tasks or changes the source workspace. Review and apply it separately. New workspaces have no preset categories, custom fields, or display-label overrides. To-do categories appear in list filters, table badges, and the item sidebar; they can be assigned when adding or editing a to-do. Settings automatically shows category names already used by the workspace, with matching colors, even before explicit definitions have been saved. [Configuration details](docs/project-customization.md).

## CLI

```sh
petal --no-open --port 9000
petal status
petal stop
petal projects
petal register /path/to/project --data /path/to/project/progress --name "My project"
petal task list --project PROJECT_ID
petal task add --title "Verify the new onboarding" --todo --project PROJECT_ID
petal task update ITEM_ID --project PROJECT_ID --file data/feature.work.json \
  --input /tmp/petal-patch.json --revision REVISION_FROM_TASK_LIST
```

A patch contains only changed fields, for example:

```json
{
  "status": "Doing",
  "progress": 60,
  "rootCause": "Implementation is ready; browser verification is still pending."
}
```

IDs and creation dates are immutable. The CLI sets status/completion timestamps. Invalid or stale edits leave the saved file untouched. Legacy trackers must be migrated to the current schema before registration; registration never silently rewrites them.

## Global installation and adding workspaces

After the global `npm link` or tarball install above, run `petal setup` once per user. This installs the bundled skills without creating a workspace. In every source project you want to track, run:

```sh
cd /path/to/project
petal init --name "My workspace"
petal doctor
petal
```

Repeat for another project. Each workspace has its own workflow, categories, and fields; **Settings → Global Git backup** applies to all workspaces. The CLI selects the nearest registered source root. Task commands outside registered projects fail instead of silently editing another workspace; use `--project ID` when explicit selection is needed. Re-running `init` connects missing agent instruction files without replacing tasks.

Skills provide reusable tracking instructions; project instruction files tell the agent to use them here. Discovery follows [Codex skills](https://developers.openai.com/codex/skills), [Claude Code skills](https://code.claude.com/docs/en/skills), and [OpenCode skills](https://opencode.ai/docs/skills/). Restart existing agent sessions after installing skills. Installation does not guarantee every model automatically invokes a skill; the project instructions and explicit `petal` invocation provide a direct path.

## Agent skills

```sh
petal skills install
petal skills install --agent codex
```

Installs the bundled `petal` skill into the current user's Claude Code, Codex, and OpenCode skill directories. Existing unmanaged skills are not overwritten. Restart or refresh the agent session to discover it. The skill teaches agents to preserve evidence, use revision-checked patches, and update percentages honestly.

Cloud-only ChatGPT or Claude chats do not gain access to your local machine through a skill install. Use a local-capable agent or an explicitly configured local connection. No remote connector, credentials, or broad tool permissions are installed.

## Files & architecture

```text
petal/                       Application repository / installed package
  app/                       Next.js page and local API routes
  components/                React workspace and evidence rendering
  lib/                       Schema validation, file storage, project registry
  bin/                       Cross-platform Node CLI and server launcher
  skills/petal/              Portable agent instructions
  tests/                     Isolated, synthetic fixtures

~/.config/petal/             User-local registry, process state, and logs
  projects.json              Project names, source roots, and tracker locations
  data/                      One Git repository, no origin by default
    projects/PROJECT_ID/
      data/feature.work.json
      data/todo.json
      file-icons.json
```

Existing registrations are imported into the shared repository with byte-for-byte JSON verification. Stable project IDs are preserved. The original JSON files remain as backups, and a timestamped registry backup is saved before switching paths. Use the CLI and the registered `dataDir` thereafter; the old copies are not synchronized. All JSON below a registered tracker directory is imported, including audits and operations metadata; application source and Git history are excluded.

Settings shows the shared repository path and optional Git origin. Saving an origin does not contact the remote or publish anything; the next explicitly confirmed Checkpoint pushes. Authentication uses your existing Git SSH keys or credential manager. Push failures preserve the local commit and report its ID so the checkpoint can be retried. No force-push or automatic pull is performed.

Set `PETAL_HOME` to use a different registry/state/data directory. Project registration uses canonical absolute paths; move a project by registering its new location. Tracker rows are JSON arrays. Additional fields can contain arbitrary JSON, and are shown only in details. The schema and generated validator are bundled with the app.

The server binds only to `127.0.0.1`. Mutation requests require a local origin (when present) and a dedicated header. Writes use a shared on-disk lock, schema validation, revision checks, and atomic file replacement. A stale `.petal-write-lock` after a crash is reported explicitly; verify the recorded PID is gone before removing it. Project registry entries are trusted local configuration, not arbitrary paths supplied by browser requests.

The UI uses system fonts, with cream light mode and a black-sky dark mode with subtle stars and animated shooting stars (disabled when reduced motion is preferred). Toggle the theme in the header; your choice is saved in this browser. Notes are edited only in the details sidebar. No product analytics or AI calls are included.

## Development

```sh
npm run dev
npm run build:validator       # after editing tracker.schema.json
npm run typecheck
npm test
npm run build
```

Tests use temporary directories; never test deletion or publication on real project data. Keep meaningful store, CLI, and HTTP tests alongside changes. Verify the desktop and narrow layouts in a browser. Format only changed files with Prettier.

Before publishing, inspect `npm pack --dry-run` and the tarball for private data and machine-specific paths. A release should have green tests and build, a public repository, and an audited package. Packaging is supported; registry publication and a hosted service are not automatic.

## Contributing

Small, thoughtful improvements are welcome. Preserve local ownership, clear error messages, accessibility, and the distinction between estimated progress and verified completion. File an issue before a major schema or synchronization change. Do not include real project evidence, credentials, or private user paths in issues or fixtures.

## License

MIT. Provider logos in `icons/` identify integrations; their names and marks belong to their respective owners and do not imply endorsement.
