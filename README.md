# Petal 🌼

**A little progress, everywhere.**

A calm, local-first workspace for you and your coding agents. Bring your projects into one cream-colored dashboard, keep evidence close to the work, and let your agent maintain the details while you decide what matters.

Petal is an independent app. Your project files stay in your projects. No account, subscription, model API key, or cloud database is required.

## Run from source

Requires Node.js 22 or newer, npm, and Git for checkpoints.

```sh
npm ci
npm run build
npm link
petal skills install
cd /path/to/your/project
petal init
petal
```

`petal init` creates a tracker under `~/.config/petal/data/projects/` and registers the project locally. It never rewrites your source code or agent configuration. Repeat it in another project; the dashboard's project selector switches between them. `petal` starts or reuses a background server at `http://localhost:8766` and opens your browser.

The package is prepared for npm distribution as `petal-workspace`; it is **not yet published**. Until a public release exists, use the source instructions or install a verified release tarball:

```sh
npm pack
npm install -g ./petal-workspace-0.1.0.tgz
```

## A simpler working day

| Status  | Meaning                                                    |
| ------- | ---------------------------------------------------------- |
| To do   | Ready to start                                             |
| Doing   | Investigation, implementation, or verification is underway |
| Waiting | A decision or external dependency needs attention          |
| Done    | No required work remains                                   |

Each item can also have an AI-maintained percentage, remaining-time estimate, and difficulty. An unassessed percentage displays a dash. Completion is an estimate of verified scope, not a timer. Done displays 100%.

- Switch collections with icon chips; keep the overview across all work when that is more useful.
- Click a row to see findings, references, arbitrary nested evidence, timestamps, and notes.
- Check a to-do once to save immediately. No confirmation dialog.
- Delete an individual item without a dialog, undo on its row, then review the final Save/Discard confirmation to persist.
- Bulk deletion includes hidden completed rows in the disclosed scope; it confirms before staging.
- Drafts survive reloads in the same browser session. Revision conflicts keep the draft and reject stale writes; review the latest evidence before discarding/reapplying it.
- Project switching is disabled while drafts are pending. Save or discard first.
- Checkpoint commits all registered project trackers to one shared Git repository. It stays local unless you connect an origin in Settings; with an origin, an explicit checkpoint also pushes. Disconnect the origin to return to local-only operation. No Git publication happens in the background.

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
