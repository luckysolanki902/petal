import { npmCommand } from "./npm-command.mjs";
import fs from "node:fs";
import os from "node:os";
import { execFileSync } from "node:child_process";
const [command, ...args] = npmCommand([
  "pack",
  "--dry-run",
  "--ignore-scripts",
  "--json",
]);
const [pack] = JSON.parse(execFileSync(command, args, { encoding: "utf8" }));
const forbidden = pack.files.filter(({ path }) =>
  /(^|\/)(\.petal|node_modules|\.git|data\/projects)(\/|$)|(^|\/)(projects\.json|server\.json|server\.log|\.env[^/]*)$|\.tsbuildinfo$/.test(
    path,
  ),
);
if (forbidden.length)
  throw new Error(
    `Private or runtime files in package: ${forbidden.map((f) => f.path).join(", ")}`,
  );
for (const required of [
  "bin/petal.mjs",
  "dist/store.mjs",
  "dist/vault.mjs",
  "skills/petal/SKILL.md",
  "tracker.schema.json",
  ".next/app-path-routes-manifest.json",
]) {
  if (!pack.files.some((f) => f.path === required))
    throw new Error(`Missing package file: ${required}`);
}
for (const file of pack.files) {
  if (!/\.(?:json|js|mjs|cjs|ts|tsx|css|html|md|yaml|txt)$/.test(file.path))
    continue;
  const content = fs.readFileSync(file.path, "utf8");
  if (content.includes(process.cwd()) || content.includes(os.homedir() + "/"))
    throw new Error(`Machine-specific path in package file: ${file.path}`);
}
console.log(
  `Package verified: ${pack.entryCount} files; private tracker data, registry, and runtime state excluded.`,
);
