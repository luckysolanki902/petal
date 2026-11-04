# Petal

Petal is a standalone, local-first Next.js workspace and Node CLI. All projects' JSON belongs in the shared local Git repository under PETAL_HOME/data/projects/ID, never in this app repository or npm package. Use the registered dataDir and CLI; old per-project tracker copies are backups. Use synthetic fixtures in tests.

- Read README.md for commands and architecture. Use npm and the committed lockfile.
- Keep project boundaries explicit. The registry is local to the user; requests select only registered IDs. Validate paths and reject traversal/symlink escape.
- Preserve arbitrary evidence, immutable creation dates and stable IDs. Revision conflicts keep drafts intact. All writers share the on-disk project lock.
- Default statuses: To do, Doing, Waiting, Done. Read the selected project configuration; status names, completion rules, categories/colors, typed fields, and labels can vary by project. Progress, estimated time and difficulty are assessed by the working agent; no fabricated completion. Keep the UI simple, warm cream, keyboard accessible and responsive.
- Single to-do toggles save immediately; single-row deletion has undo before Save and no confirmation. All staged row deletions require a final Save/Discard confirmation. File deletion requires confirmation. Notes are edited only in the sidebar. Checkpoint commits all projects locally and pushes only when an origin is connected in Settings; disclose that scope explicitly.
- Never include actual project data, user registry files, credentials, private paths or server state in source or package output.
- Run npm test, npm run typecheck, npm run build and package verification before delivery. Run Prettier only on changed supported files.
- No automatic publishing or pushing. A release requires explicit user authorization. Never attach the private data repository to the app repository remote.
