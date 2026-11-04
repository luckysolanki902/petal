#!/usr/bin/env node
import fs from "node:fs/promises";
import { existsSync, openSync, closeSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
const APP = fileURLToPath(new URL("../", import.meta.url));
process.env.PETAL_APP_ROOT = APP;
const HOME =
  process.env.PETAL_HOME || path.join(os.homedir(), ".config", "petal");
const registryFile = path.join(HOME, "projects.json"),
  stateFile = path.join(HOME, "server.json");
const args = process.argv.slice(2);
function flag(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
}
async function read(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return fallback;
    throw new Error(`Cannot read ${file}: ${e.message}`);
  }
}
async function atomic(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = file + "." + randomUUID() + ".tmp";
  try {
    await fs.writeFile(tmp, JSON.stringify(value, null, 2) + "\n", {
      flag: "wx",
      mode: 0o600,
    });
    await fs.rename(tmp, file);
  } finally {
    await fs.rm(tmp, { force: true });
  }
}
async function projects() {
  return (await import("../dist/vault.mjs")).projects();
}
async function selectProject() {
  const list = await projects();
  const name = flag("--project");
  const cwd = await fs.realpath(process.cwd());
  const p = name
    ? list.find((p) => p.id === name || p.name === name)
    : list
        .filter((p) => cwd === p.root || cwd.startsWith(p.root + path.sep))
        .sort((a, b) => b.root.length - a.root.length)[0] || list[0];
  if (!p)
    throw new Error("No project found. Run petal init in a project first.");
  return p;
}
async function register(root, dataDir, name) {
  root = await fs.realpath(root);
  dataDir = await fs.realpath(dataDir);
  if (!existsSync(path.join(dataDir, "data", "todo.json")))
    throw new Error("Expected data/todo.json inside the data directory.");
  const { createStore } = await import("../dist/store.mjs");
  const check = await createStore(dataDir).workspace();
  const errors = check.files.filter((f) => f.error);
  if (errors.length)
    throw new Error(
      "Invalid tracker data: " +
        errors.map((f) => f.path + ": " + f.error).join("\n"),
    );
  const vault = await import("../dist/vault.mjs");
  await projects();
  return vault.vaultLock(async () => {
    await vault.ensureVault();
    const list = await vault.readProjects();
    const existing = list.find((p) => p.root === root);
    const id =
      existing?.id ||
      createHash("sha256").update(root).digest("hex").slice(0, 12);
    const item =
      existing ||
      (await vault.importProject({
        id,
        name: name || path.basename(root),
        root,
        dataDir,
      }));
    if (name) item.name = name;
    const at = list.findIndex((p) => p.id === id);
    if (at < 0) list.push(item);
    else list[at] = item;
    await atomic(registryFile, list);
    console.log(`Registered ${item.name} (${id})\nData: ${item.dataDir}`);
    return item;
  });
}

async function init() {
  const target = path.resolve(
    args[1] && !args[1].startsWith("-") ? args[1] : ".",
  );
  const root = await fs.realpath(target);
  const existing = (await projects()).find((p) => p.root === root);
  if (existing) return existing;
  const vault = await import("../dist/vault.mjs");
  await vault.ensureVault();
  const id = createHash("sha256").update(root).digest("hex").slice(0, 12);
  const dir = path.join(vault.vaultDir, "projects", id);
  if (existsSync(dir)) {
    if (!existsSync(path.join(dir, "data", "todo.json")))
      throw new Error(
        `${dir} exists but is not a Petal workspace; no files were overwritten.`,
      );
    return register(root, dir, flag("--name"));
  }
  await fs.mkdir(path.join(dir, "data"), { recursive: true });
  await atomic(path.join(dir, "data", "todo.json"), []);
  await atomic(path.join(dir, "data", "feature.work.json"), []);
  await atomic(path.join(dir, "file-icons.json"), {
    "data/todo.json": { icon: "icons/todo.svg" },
    "data/feature.work.json": { icon: "icons/file.svg" },
  });
  await fs.writeFile(
    path.join(dir, "AGENTS.md"),
    "Use the Petal skill to track work here. Run `petal task list` and `petal task update --help`. Read configuration.statuses and configuration.fields from task list. The default statuses are To do, Doing, Waiting, Done; projects can customize them. Keep progress 0–100 evidence-based. Preserve IDs, creation dates, comments and arbitrary evidence. Never publish without user authorization.\n",
  );
  await fs.writeFile(
    path.join(dir, ".gitignore"),
    ".petal-write-lock/\n*.tmp\n",
  );
  return register(root, dir, flag("--name"));
}
async function health(state) {
  if (!state) return null;
  try {
    const res = await fetch(`http://127.0.0.1:${state.port}/api/health`, {
      signal: AbortSignal.timeout(1500),
    });
    const body = await res.json();
    return body.app === "petal" &&
      body.instance === state.instance &&
      body.pid === state.pid
      ? body
      : null;
  } catch {
    return null;
  }
}
async function status() {
  const state = await read(stateFile, null);
  if (await health(state)) {
    console.log(
      `Petal is running at http://localhost:${state.port} (pid ${state.pid})`,
    );
    return state;
  }
  console.log("Petal is not running.");
  return null;
}
async function stop() {
  const state = await read(stateFile, null);
  if (!(await health(state))) {
    console.log("No verified Petal process to stop.");
    return;
  }
  process.kill(state.pid, "SIGTERM");
  await fs.rm(stateFile, { force: true });
  console.log("Petal stopped.");
}
async function start() {
  let state = await read(stateFile, null);
  if (!(await health(state))) {
    if (!existsSync(path.join(APP, ".next", "BUILD_ID")))
      throw new Error(
        "This source checkout has not been built. Run npm install && npm run build in the Petal app directory.",
      );
    const port = Number(flag("--port", "8766"));
    if (!Number.isInteger(port) || port < 1024 || port > 65535)
      throw new Error("Port must be an integer between 1024 and 65535.");
    await fs.mkdir(HOME, { recursive: true });
    const lock = path.join(HOME, "start.lock");
    try {
      await fs.mkdir(lock);
    } catch (e) {
      if (e.code === "EEXIST")
        throw new Error("Another start is running; retry shortly.");
      throw e;
    }
    try {
      state = await read(stateFile, null);
      if (!(await health(state))) {
        const logFile = path.join(HOME, "server.log"),
          fd = openSync(logFile, "a");
        const instance = randomUUID();
        const child = spawn(
          process.execPath,
          [path.join(APP, "bin", "server.mjs")],
          {
            cwd: APP,
            detached: true,
            stdio: ["ignore", fd, fd],
            env: {
              ...process.env,
              PETAL_HOME: HOME,
              PETAL_INSTANCE: instance,
              PETAL_PORT: String(port),
              NEXT_TELEMETRY_DISABLED: "1",
            },
          },
        );
        closeSync(fd);
        child.on("error", (e) =>
          console.error(`Petal launch failed: ${e.message}`),
        );
        child.unref();
        state = { pid: child.pid, port, instance };
        let ok = false;
        for (let i = 0; i < 100; i++) {
          if (await health(state)) {
            ok = true;
            break;
          }
          await new Promise((r) => setTimeout(r, 200));
        }
        if (!ok) {
          try {
            process.kill(child.pid, "SIGTERM");
          } catch {}
          throw new Error(
            `Petal did not start. See ${logFile}; port ${port} may be occupied.`,
          );
        }
        await atomic(stateFile, state);
      }
    } finally {
      await fs.rm(lock, { recursive: true, force: true });
    }
  }
  let project;
  try {
    project = await selectProject();
  } catch {}
  const url = `http://localhost:${state.port}/${project ? "?project=" + project.id : ""}`;
  console.log(`Petal → ${url}`);
  if (!args.includes("--no-open")) {
    const command =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
          ? "cmd"
          : "xdg-open";
    const child = spawn(
      command,
      process.platform === "win32" ? ["/c", "start", "", url] : [url],
      { stdio: "ignore", detached: true },
    );
    child.on("error", () => console.log(`Open ${url} in your browser.`));
    child.unref();
  }
}
async function skills() {
  const targets = {
    claude: path.join(os.homedir(), ".claude", "skills", "petal"),
    codex: path.join(os.homedir(), ".agents", "skills", "petal"),
    opencode: path.join(
      process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"),
      "opencode",
      "skills",
      "petal",
    ),
  };
  const choice = flag("--agent", "all");
  if (choice !== "all" && !targets[choice])
    throw new Error("Agent must be claude, codex, opencode or all.");
  for (const [agent, dest] of Object.entries(targets)) {
    if (choice !== "all" && choice !== agent) continue;
    const marker = path.join(dest, ".petal-managed");
    if (existsSync(dest) && !existsSync(marker)) {
      console.log(
        `Skipped ${agent}: ${dest} already exists and is not managed by Petal.`,
      );
      continue;
    }
    await fs.mkdir(dest, { recursive: true });
    await fs.cp(path.join(APP, "skills", "petal"), dest, { recursive: true });
    await fs.writeFile(marker, "Managed by petal skills install.\n");
    console.log(`Installed ${agent} skill: ${dest}`);
  }
  console.log(
    "Restart or refresh your agent session to discover the skill. Cloud-only chats require a separate local connection.",
  );
}
async function task() {
  const p = await selectProject();
  const { createStore } = await import("../dist/store.mjs");
  const store = createStore(
    p.dataDir,
    (await import("../dist/vault.mjs")).vaultDir,
  );
  const action = args[1];
  const ws = await store.workspace();
  if (action === "list") {
    console.log(JSON.stringify({ project: p, ...ws }, null, 2));
    return;
  }
  const file = flag(
    "--file",
    args.includes("--todo") ? "data/todo.json" : "data/feature.work.json",
  );
  if (action === "add") {
    const title = flag("--title");
    if (!title) throw new Error('Use --title "A clear task"');
    console.log(
      JSON.stringify(
        await store.addTask(file, title, flag("--category", "General")),
        null,
        2,
      ),
    );
    return;
  }
  if (action === "update") {
    const id = args[2],
      input = flag("--input"),
      revision = flag("--revision");
    if (!id || !input || !revision)
      throw new Error(
        "Use petal task update ID --file data/...json --input patch.json --revision REVISION (from task list).",
      );
    const patch = await read(path.resolve(input), null);
    console.log(
      JSON.stringify(
        await store.updateTask(file, id, patch, revision),
        null,
        2,
      ),
    );
    return;
  }
  throw new Error(
    "Use task list, task add --title TITLE [--todo], or task update ID --file FILE --input PATCH.json --revision REVISION.",
  );
}
const help = `Petal — a little progress, everywhere.\n\npetal                         Start/reuse the dashboard and open this project\npetal --no-open [--port 8766]   Start in the background\npetal init [path] [--name X]   Create central tracker and register a project\npetal register PATH --data DIR [--name X]  Connect existing tracker data\npetal projects                List registered projects\npetal status | stop           Inspect or stop the verified local server\npetal skills install [--agent all|claude|codex|opencode]\npetal task list [--project ID] Read tasks and file revisions as JSON\npetal task add --title TEXT [--todo] [--file data/feature.work.json]\npetal task update ID --file FILE --input PATCH.json --revision REVISION\n\nNo cloud account, telemetry or background agent calls. Git publishing is explicit in the dashboard.\n`;
try {
  if (args.includes("--help") || args[0] === "help") {
    console.log(help);
  } else
    switch (args[0]) {
      case "init":
        await init();
        break;
      case "register":
        if (!args[1] || !flag("--data"))
          throw new Error("Use register PROJECT_PATH --data TRACKER_DIRECTORY");
        await register(
          path.resolve(args[1]),
          path.resolve(flag("--data")),
          flag("--name"),
        );
        break;
      case "projects":
        console.log(JSON.stringify(await projects(), null, 2));
        break;
      case "status":
        await status();
        break;
      case "stop":
        await stop();
        break;
      case "skills":
        if (args[1] !== "install") throw new Error("Use petal skills install");
        await skills();
        break;
      case "task":
        await task();
        break;
      case undefined:
      case "--no-open":
      case "--port":
      case "--project":
        await start();
        break;
      default:
        throw new Error(`Unknown command ${args[0]}. Run petal --help.`);
    }
} catch (error) {
  console.error(`Petal: ${error.message}`);
  process.exitCode = 1;
}
