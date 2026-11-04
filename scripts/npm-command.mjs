import fs from "node:fs";
import path from "node:path";
export function npmCommand(args) {
  const candidates = [
    process.env.npm_execpath,
    path.join(
      path.dirname(process.execPath),
      "node_modules/npm/bin/npm-cli.js",
    ),
    path.resolve(
      path.dirname(process.execPath),
      "../lib/node_modules/npm/bin/npm-cli.js",
    ),
  ];
  const cli = candidates.find(
    (file) => file && /npm-cli\.js$/.test(file) && fs.existsSync(file),
  );
  if (cli) return [process.execPath, cli, ...args];
  if (process.platform === "win32")
    throw new Error(
      "Run this check through npm run verify:package or npm run smoke:package so npm's CLI path is available.",
    );
  return ["npm", ...args];
}
