import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import { StoreError } from "./store";
import { projects } from "./vault";
const execute = promisify(execFile);
export async function addWorkspace(body: Record<string, unknown>) {
  if (typeof body.root !== "string" || !path.isAbsolute(body.root.trim()))
    throw new StoreError(
      400,
      "Enter an absolute path to an existing project folder.",
    );
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.length > 120
  )
    throw new StoreError(400, "Enter a workspace name (up to 120 characters).");
  if (typeof body.agentFiles !== "boolean" || typeof body.skills !== "boolean")
    throw new StoreError(
      400,
      "Choose whether to connect project instructions and install skills.",
    );
  let root: string;
  try {
    root = await fs.realpath(body.root.trim());
    if (!(await fs.stat(root)).isDirectory())
      throw new Error("Not a directory");
  } catch {
    throw new StoreError(
      400,
      "Project folder does not exist or is not accessible. Enter its full local path.",
    );
  }
  const cli = path.join(
    process.env.PETAL_APP_ROOT || process.cwd(),
    "bin",
    "petal.mjs",
  );
  const run = async (args: string[]) => {
    try {
      await execute(process.execPath, [cli, ...args], {
        cwd: root,
        timeout: 30000,
        maxBuffer: 1024 * 1024,
      });
    } catch (error) {
      const e = error as Error & { stderr?: string };
      throw new StoreError(
        500,
        `Workspace setup could not finish: ${e.stderr?.trim() || e.message}. Existing tasks are preserved; review the error and retry.`,
      );
    }
  };
  if (body.skills) await run(["setup"]);
  await run([
    "init",
    root,
    "--name",
    body.name.trim(),
    ...(body.agentFiles ? [] : ["--no-agent-files"]),
  ]);
  const project = (await projects()).find((p) => p.root === root);
  if (!project)
    throw new StoreError(
      500,
      "Workspace registration was not found after setup.",
    );
  return { project };
}
