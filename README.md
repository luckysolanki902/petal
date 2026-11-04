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

## Start here

**One installation. A workspace for each project. A shared dashboard for you and your agents.**

[Install](#install-globally) · [Add a workspace](#add-a-workspace) · [Connect agents](#how-claude-code-and-codex-find-petal) · [CLI reference](#cli) · [Git backup](#global-git-backup) · [Development](#development)

## Install globally

Requires **Node.js 22+**, npm, and Git. No model API key or Petal account is needed.

```sh
# 1. Get the public application source
git clone https://github.com/luckysolanki902/petal.git
cd petal

# 2. Install dependencies and build the app
npm ci
npm run build

# 3. Make the petal command available from any directory
npm link

# 4. Install skills for your local coding agents
petal setup
```

`npm link` connects the global command to this checkout. Keep the checkout in place. If `petal` is not found, check that npm’s global executable directory is on your shell’s `PATH`, then open a new terminal. To update this installation, pull the latest app source, run `npm ci && npm run build`, then run `petal setup` to refresh managed skills.

Prefer an installable package instead of a linked checkout? Build and pack it:

```sh
npm pack
npm install -g ./petal-workspace-0.1.0.tgz
petal setup
```

The package name is `petal-workspace`; it is **not published to the npm registry yet**. Use the source or local tarball instructions above. A global install installs the command for your OS user, not every account on the machine.

## Add a workspace

### From the dashboard

Run `petal`, choose **Add workspace**, and enter a name and the full path to an existing source project folder. On a fresh installation, use **Add your first workspace**.

The setup form lets you choose whether to install global agent skills and connect the project’s instruction files. It explains both before writing anything. Adding a workspace never pushes data.

### From your terminal

```sh
cd /path/to/your/project
petal init --name "My project"
petal doctor
petal
```

Or name a source folder directly:

```sh
petal init /path/to/another/project --name "Another project"
```

Repeat for each project. Workspaces have independent tasks, categories, statuses, and fields. Switch between them in the dashboard. `petal init` creates the tracker in `~/.config/petal/data/projects/`, registers its source root, and adds a small managed section to `AGENTS.md` and `CLAUDE.md` in that source root. Existing instructions and tasks are preserved. Use `--no-agent-files` to skip those instruction files.

Re-running `init` is safe: it reconnects missing instruction sections without replacing tracker data. Workspace IDs and source paths are local to your machine; the project instruction block contains portable commands instead of a hard-coded machine ID. Each developer registers their own checkout.

`petal` starts or reuses a background server at `http://localhost:8766` and opens the browser. It keeps running after the terminal command finishes; stop it with `petal stop`.

## How Claude Code and Codex find Petal

| Piece             | What it does                                                              | Scope                                         |
| ----------------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| `petal setup`     | Installs the bundled `petal` skill                                        | Your OS user, across projects                 |
| `petal init`      | Connects `AGENTS.md` and `CLAUDE.md` to tracking                          | The selected source project                   |
| `petal task list` | Resolves the nearest registered source root and reads tasks/configuration | Current workspace                             |
| `petal doctor`    | Reports the current workspace and project instruction connection          | Current directory, or explicit `--project ID` |

The installed skill tells the agent to use the matching workspace automatically for substantial project work. **If there is no matching workspace, it asks “Create a Petal workspace for this project? Yes / No”, naming the folder first.** Yes creates it; No continues your work without tracking there. Errors such as a missing CLI or broken registry are reported, never mistaken for permission to create a replacement. An explicit request to set up that project already counts as consent.

Restart existing agent sessions after setup. In Claude Code you can explicitly invoke `/petal`; in Codex ask it to use the Petal skill. Skills guide model behavior; they are not a background watcher or a guarantee that every model will invoke them. Project instructions reinforce the connection in future sessions.

These discovery locations follow the official documentation for [Codex skills](https://developers.openai.com/codex/skills), [Claude Code skills](https://code.claude.com/docs/en/skills), and [OpenCode skills](https://opencode.ai/docs/skills/):

| Agent       | Default user skill directory                                        |
| ----------- | ------------------------------------------------------------------- |
| Codex       | `~/.agents/skills/petal/`                                           |
| Claude Code | `~/.claude/skills/petal/` (`CLAUDE_CONFIG_DIR` is respected)        |
| OpenCode    | `~/.config/opencode/skills/petal/` (`XDG_CONFIG_HOME` is respected) |

Existing unmanaged skills are preserved. Setup does not create a workspace for the Petal app itself. Cloud-only chats do not gain local filesystem access through a skill install; use a local-capable agent or a separately configured local connection.

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

| Command                                           | Purpose                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `petal`                                           | Start/reuse the dashboard and open it                                        |
| `petal --no-open --port 9000`                     | Run locally on a chosen port without opening a browser                       |
| `petal setup`                                     | Install or refresh managed skills for all supported agents                   |
| `petal skills install --agent codex`              | Install only the Codex skill (`claude`, `opencode`, or `all` also supported) |
| `petal init [PATH] --name "Project"`              | Register a source project and connect project instructions                   |
| `petal init [PATH] --no-agent-files`              | Register without editing project instruction files                           |
| `petal register PATH --data DIR --name "Project"` | Import an existing valid tracker directory                                   |
| `petal projects`                                  | List registered workspaces, IDs, and data locations as JSON                  |
| `petal doctor [--project ID]`                     | Check workspace and agent instruction wiring                                 |
| `petal status` / `petal stop`                     | Inspect or stop the verified local server                                    |
| `petal task list [--project ID]`                  | Read tasks, file revisions, and workspace configuration as JSON              |
| `petal --help`                                    | Show command help                                                            |

Task commands select the nearest registered source root from the working directory. Outside a registered project they fail safely; use an exact workspace ID from `petal projects` to select one explicitly. Dashboard launch can be global. A mistyped explicit project selector is an error.

### Add progress work or a to-do

```sh
cd /path/to/your/project
petal task add --title "Implement search" --file data/feature.work.json
petal task add --title "Review search behavior" --todo --category "Review"
petal task list
```

To work from any directory, add `--project PROJECT_ID`. Existing workspaces may use different progress filenames: use the paths returned by `task list`.

### Update an item without overwriting newer evidence

Read `petal task list --project PROJECT_ID`, then save a JSON patch containing only fields you want to change:

```json
{
  "status": "Doing",
  "progress": 60,
  "rootCause": "Implementation is ready; browser verification is still pending."
}
```

```sh
petal task update ITEM_ID --project PROJECT_ID \
  --file data/feature.work.json --input /path/to/patch.json \
  --revision REVISION_FROM_TASK_LIST
```

Use the workspace’s actual status names and custom field types from `configuration`, not assumptions from another project. IDs and creation dates are immutable. The CLI manages lifecycle timestamps. A stale revision rejects the update: reread and reconcile before retrying. Legacy tracker registration validates existing data and never silently rewrites it.

## Global Git backup

Open **Settings → Global Git backup**. Its origin and shared data directory apply to **every workspace on this machine**, while workflow settings remain per workspace.

1. Create an empty **private** Git repository with your Git provider.
2. Enter its SSH or HTTPS URL as the Git origin and save global settings.
3. Click **Checkpoint**, review its all-workspaces scope, and confirm.

Saving the origin never publishes by itself. A checkpoint validates trackers, commits local changes, and pushes when an origin is connected. Without an origin, checkpoints stay local. Your existing Git credentials handle authentication; do not put passwords in repository URLs. No background push, force-push, or automatic pull occurs. Push failures preserve the local commit and report the failure so you can resolve it and retry.

The data repository is separate from this public application repository. Never attach a private tracker-data origin to the app source repository or commit real task evidence into the app. Disconnect the data origin in global settings to return to local-only checkpoints.

## Troubleshooting

| Symptom                    | What to check                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Agent cannot find Petal    | Run `petal setup`, restart the agent, then run `petal doctor` from the source project                             |
| No matching workspace      | Run `petal projects`; initialize the correct source root or pass `--project ID`                                   |
| Instructions still missing | Re-run `petal init` in that source root; symlinked or malformed instruction blocks are reported for manual repair |
| Source checkout not built  | Run `npm ci` and `npm run build` in the Petal app checkout                                                        |
| Dashboard unavailable      | Run `petal status`; check the log at `~/.config/petal/server.log`; try an unused `--port`                         |
| Revision conflict          | Read the current item and merge your patch with the new evidence                                                  |
| Private Git push fails     | Check the data repository’s origin and your Git authentication; the local checkpoint is retained                  |

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
