import { npmCommand } from "./npm-command.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import net from "node:net";
const execute = promisify(execFile),
  app = fileURLToPath(new URL("../", import.meta.url)),
  root = await fs.mkdtemp(path.join(os.tmpdir(), "petal-install-"));
const env = {
  ...process.env,
  PETAL_HOME: path.join(root, "config"),
  NEXT_TELEMETRY_DISABLED: "1",
};
const npm = (args, options) => {
  const [command, ...parameters] = npmCommand(args);
  return execute(command, parameters, options);
};
let cli;
const run = (...args) =>
  execute(process.execPath, [cli, ...args], { env, cwd: root, timeout: 60000 });
try {
  const packed = JSON.parse(
    (
      await npm(
        ["pack", "--ignore-scripts", "--pack-destination", root, "--json"],
        { cwd: app },
      )
    ).stdout,
  )[0];
  await npm(
    [
      "install",
      "--prefix",
      path.join(root, "install"),
      "--omit=dev",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      path.join(root, packed.filename),
    ],
    { timeout: 180000 },
  );
  cli = path.join(root, "install/node_modules/petal-workspace/bin/petal.mjs");
  const project = path.join(root, "demo");
  await fs.mkdir(project);
  await run("init", project, "--name", "Package fixture");
  const port = await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
  await run("--no-open", "--port", String(port));
  const response = await fetch(`http://127.0.0.1:${port}/api/workspace`);
  if (!response.ok)
    throw new Error(
      `Installed package API failed (${response.status}): ${await response.text()}`,
    );
  const data = await response.json();
  const extraProject = path.join(root, "extra-project");
  await fs.mkdir(extraProject);
  const added = await fetch(`http://127.0.0.1:${port}/api/workspaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Progress-Save": "1" },
    body: JSON.stringify({
      root: extraProject,
      name: "Package onboarding",
      skills: false,
      agentFiles: true,
    }),
  });
  if (!added.ok)
    throw new Error(
      `Installed package onboarding failed: ${await added.text()}`,
    );
  if (
    !(await fs.readFile(path.join(extraProject, "CLAUDE.md"), "utf8")).includes(
      "petal task list",
    )
  )
    throw new Error(
      "Packaged onboarding did not connect project instructions.",
    );
  if (
    data.project.name !== "Package fixture" ||
    data.files.length !== 2 ||
    data.configuration.statuses.length !== 4
  )
    throw new Error("Installed package returned unexpected project data.");
  console.log(
    "Installed tarball startup, project API, and default workflow passed.",
  );
} finally {
  try {
    if (cli) await run("stop");
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}
