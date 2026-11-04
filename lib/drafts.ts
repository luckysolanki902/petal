import type { Edit } from "./model";
export type Drafts = Record<
  string,
  { revision: string; edits: Record<string, Edit> }
>;
export function afterSidebarDelete(
  drafts: Drafts,
  file: string,
  id: string,
  expected: string,
  revision: string,
): Drafts {
  const draft = drafts[file];
  if (!draft) return drafts;
  const edits = { ...draft.edits };
  delete edits[id];
  const next = { ...drafts };
  if (Object.keys(edits).length)
    next[file] = {
      edits,
      revision: draft.revision === expected ? revision : draft.revision,
    };
  else delete next[file];
  return next;
}
