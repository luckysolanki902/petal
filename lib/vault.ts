import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { StoreError, createStore } from "./store";
const execute = promisify(execFile);
export const configDir =
  process.env.PETAL_HOME || path.join(os.homedir(), ".config", "petal");
export const vaultDir = path.join(configDir, "data");
export type Project = {
  id: string;
  name: string;
  root: string;
  dataDir: string;
};
export async function atomicJSON(file: string, value: unknown) {
  const temp = file + "." + randomUUID() + ".tmp";
  try {
    await fs.writeFile(temp, JSON.stringify(value, null, 2) + "\n", {
      flag: "wx",
      mode: 0o600,
    });
    await fs.rename(temp, file);
  } finally {
    await fs.rm(temp, { force: true });
  }
}
export async function gitVault(...args: string[]) {
  try {
    return (
      await execute("git", args, {
        cwd: vaultDir,
        timeout: 30000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      })
    ).stdout.trim();
  } catch (error) {
    const e = error as Error & { stderr?: string };
    throw new StoreError(
      500,
      `Data repository: git ${args[0]} failed: ${e.stderr || e.message}`,
    );
  }
}
export async function vaultLock<T>(work: () => Promise<T>): Promise<T> {
  await fs.mkdir(configDir, { recursive: true });
  const lock = path.join(configDir, "registry.lock");
  try {
    await fs.mkdir(lock);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST")
      throw new StoreError(
        409,
        "Another storage operation is running. Retry shortly.",
      );
    throw error;
  }
  try {
    return await work();
  } finally {
    await fs.rm(lock, { recursive: true, force: true });
  }
}
export async function ensureVault() {
  await fs.mkdir(path.join(vaultDir, "projects"), {
    recursive: true,
    mode: 0o700,
  });
  try {
    await fs.access(path.join(vaultDir, ".git"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await gitVault("init", "-b", "main");
    await gitVault("config", "user.name", "Petal");
    await gitVault("config", "user.email", "petal@localhost");
  }
  await fs.writeFile(
    path.join(vaultDir, ".gitignore"),
    ".petal-write-lock/\n**/.petal-write-lock/\n*.tmp\n**/*.tmp\n",
  );
}
export async function readProjects(): Promise<Project[]> {
  try {
    const list = JSON.parse(
      await fs.readFile(path.join(configDir, "projects.json"), "utf8"),
    );
    if (
      !Array.isArray(list) ||
      list.some(
        (p) =>
          !p ||
          !/^[a-zA-Z0-9_-]+$/.test(p.id) ||
          typeof p.name !== "string" ||
          !path.isAbsolute(p.root) ||
          !path.isAbsolute(p.dataDir),
      )
    )
      throw new StoreError(500, "Invalid project registry.");
    return list;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
async function snapshot(source: string): Promise<Map<string, Buffer>> {
  const files = new Map<string, Buffer>();
  async function walk(relative: string) {
    for (const entry of await fs.readdir(path.join(source, relative), {
      withFileTypes: true,
    })) {
      if (
        [".git", "node_modules", ".next", ".petal-write-lock"].includes(
          entry.name,
        )
      )
        continue;
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) await walk(name);
      else if (entry.name.endsWith(".json")) {
        if (!entry.isFile())
          throw new StoreError(
            409,
            `Cannot import symlink or special JSON file: ${name}`,
          );
        files.set(name, await fs.readFile(path.join(source, name)));
      }
    }
  }
  await walk("");
  return files;
}
export async function importProject(project: Project): Promise<Project> {
  const target = path.join(vaultDir, "projects", project.id);
  try {
    if ((await fs.realpath(project.dataDir)) === (await fs.realpath(target)))
      return { ...project, dataDir: target };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const before = await snapshot(project.dataDir);
  if (!before.has(path.join("data", "todo.json")))
    throw new StoreError(422, `${project.name}: data/todo.json is missing.`);
  const temp = target + "." + randomUUID() + ".tmp";
  await fs.mkdir(temp, { recursive: true });
  try {
    for (const [name, bytes] of before) {
      await fs.mkdir(path.dirname(path.join(temp, name)), { recursive: true });
      await fs.writeFile(path.join(temp, name), bytes);
    }
    const after = await snapshot(project.dataDir),
      copied = await snapshot(temp);
    if (
      before.size !== after.size ||
      before.size !== copied.size ||
      [...before].some(
        ([name, bytes]) =>
          !after.get(name)?.equals(bytes) || !copied.get(name)?.equals(bytes),
      )
    )
      throw new StoreError(
        409,
        `${project.name}: source changed during import. Registry was not changed.`,
      );
    try {
      const existing = await snapshot(target);
      if (
        existing.size === before.size &&
        [...before].every(([name, bytes]) => existing.get(name)?.equals(bytes))
      )
        return { ...project, dataDir: target };
      throw new StoreError(
        409,
        `Import target already exists with different content: ${target}. Review it before retrying.`,
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    await fs.rename(temp, target);
    return { ...project, dataDir: target };
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}
export async function projects(): Promise<Project[]> {
  const list = await readProjects();
  if (!list.some((p) => p.dataDir !== path.join(vaultDir, "projects", p.id)))
    return list;
  return vaultLock(async () => {
    await ensureVault();
    const current = await readProjects(),
      next: Project[] = [];
    // Back up the old registry before changing any registered paths.
    await fs.copyFile(
      path.join(configDir, "projects.json"),
      path.join(configDir, `projects.backup.${Date.now()}.json`),
    );
    for (const p of current) next.push(await importProject(p));
    await atomicJSON(path.join(configDir, "projects.json"), next);
    return next;
  });
}
export async function storageSettings() {
  await ensureVault();
  const remotes = (await gitVault("remote")).split("\n");
  const origin = remotes.includes("origin")
    ? await gitVault("remote", "get-url", "origin")
    : "";
  return { directory: vaultDir, origin };
}
export async function setStorageOrigin(value: unknown) {
  if (typeof value !== "string")
    throw new StoreError(400, "Origin must be text.");
  const origin = value.trim();
  if (
    origin &&
    (!/^(https:\/\/[^\s]+|ssh:\/\/[^\s]+|git@[^\s:]+:[^\s]+)$/.test(origin) ||
      /[\r\n\x00]/.test(origin))
  )
    throw new StoreError(
      400,
      "Use an HTTPS or SSH Git repository URL, or leave blank for local only.",
    );
  if (origin.startsWith("https://") && new URL(origin).password)
    throw new StoreError(
      400,
      "Use your Git credential manager instead of a password in the URL.",
    );
  return vaultLock(async () => {
    await ensureVault();
    return createStore(vaultDir).withLock(async () => {
      const previous = await storageSettings();
      if (origin)
        await gitVault(
          "remote",
          previous.origin ? "set-url" : "add",
          "origin",
          origin,
        );
      else if (previous.origin) await gitVault("remote", "remove", "origin");
      return storageSettings();
    });
  });
}
