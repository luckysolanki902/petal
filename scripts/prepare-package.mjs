import fs from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const manifestPath = path.join(root, ".next", "required-server-files.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
function portable(value) {
  if (typeof value === "string" && value === root) return ".";
  if (typeof value === "string" && value.startsWith(root + path.sep))
    return "./" + path.relative(root, value);
  if (Array.isArray(value)) return value.map(portable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, portable(item)]),
    );
  return value;
}
const clean = portable(manifest);
await fs.writeFile(manifestPath, JSON.stringify(clean, null, 2) + "\n");
await fs.writeFile(
  path.join(root, ".next", "required-server-files.js"),
  "self.__SERVER_FILES_MANIFEST=" + JSON.stringify(clean) + ";\n",
);
console.log("Prepared portable Next.js runtime manifests.");
