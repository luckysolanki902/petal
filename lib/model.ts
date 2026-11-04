export const STATUSES = ["To do", "Doing", "Waiting", "Done"] as const;
export type Status = (typeof STATUSES)[number];
export type Row = {
  id: string;
  createdAt: string | null;
  status?: Status;
  statusAt?: string;
  task?: string;
  bug?: string;
  comments?: string;
  done?: boolean;
  doneAt?: string | null;
  category?: string;
  section?: string;
  severity?: string;
  est?: string;
  difficulty?: number;
  progress?: number;
  [key: string]: unknown;
};
export type TrackerFile = {
  path: string;
  rows: Row[];
  revision: string;
  icon: string;
  error?: string;
};
export type Workspace = {
  projects: { id: string; name: string; root: string; dataDir: string }[];
  project: { id: string; name: string; root: string; dataDir: string };
  files: TrackerFile[];
  estimates: { file: string; id: string; createdAt: string }[];
  warnings: string[];
};
export type Edit = {
  id: string;
  comments?: string;
  status?: Status;
  done?: boolean;
  delete?: boolean;
};
export const TODO = "data/todo.json";
export const isComplete = (row: Row, file: string) =>
  file === TODO ? row.done === true : row.status === "Done";
export const fileLabel = (file: string) =>
  file
    .split("/")
    .pop()!
    .replace(/\.json$/, "");
