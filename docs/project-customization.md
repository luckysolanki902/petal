# Project customization

Workspace-specific configuration is available in Settings. Importing another workspace copies its settings into a draft; preview and apply are still required. It never copies tasks. Defaults are kept until a user applies a previewed change.

Each project is configured independently. One project's changes do not alter another project's validation or workflow.

| Setting           | Behavior                                                                            |
| ----------------- | ----------------------------------------------------------------------------------- |
| Workflow          | Ordered status names with explicit completion rules and colors                      |
| Categories        | Project-specific names and colors; existing categories remain readable              |
| Fields            | Optional custom text, number, and boolean fields; values are validated when present |
| Labels            | Rename displayed field labels without rewriting evidence keys                       |
| Migration         | Preview affected files and rows; require explicit mappings for statuses in use      |
| Agent integration | Return project configuration with task listings so agents use the correct workflow  |

IDs and original creation dates remain protected. Existing arbitrary JSON evidence must survive configuration changes. A new project defaults to To do, Doing, Waiting, and Done; existing projects retain their current behavior until the user applies a previewed change.

Applying changes checks both configuration and tracker revisions against a preview token. A pending migration journal restores prior file contents and configuration before the next operation after an interruption. Local migration audits keep the before/after contents. No configuration operation publishes data. Completion rules must be shared by the UI, CLI, save routes, bulk deletion, counts, and validation.

The current tracker schema already accepts arbitrary category names and extra JSON fields. Admin-fix is project data, not a required category. The base schema validates nonempty lifecycle strings; the store then validates each status against the selected project configuration. Core fields and dates keep their existing validation.
