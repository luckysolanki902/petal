import catalog from "../icons/catalog.json";
export const iconCatalog = catalog;
const generic = new Set([
  "icons/file.svg",
  "icons/dashboard.svg",
  "icons/hierarchy.svg",
  "icons/todo.svg",
]);
export const isGenericIcon = (icon: string) => generic.has(icon);
const aliases: Record<string, string[]> = {
  nextdotjs: ["nextjs", "next.js", "next-js"],
  nodedotjs: ["nodejs", "node.js"],
  postgresql: ["postgres"],
  mongodb: ["mongo"],
  googlegemini: ["gemini"],
};
const brandMatchers = catalog
  .filter((i) => i.kind === "brand")
  .sort((a, b) => b.title.length - a.title.length)
  .map((icon) => {
    const slug = icon.id.replace("brand-", ""),
      title = icon.title.toLowerCase();
    const patterns = [
      slug,
      title,
      title.replace(/[^a-z0-9]+/g, "-"),
      ...(aliases[slug] || []),
    ]
      .filter((term) => term.length > 2)
      .map(
        (term) =>
          new RegExp(
            `(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`,
            "i",
          ),
      );
    return { icon, patterns };
  });
export function inferIcon(file: string, titles: string[] = []): string {
  const name = file.toLowerCase().replace(/\.json$/, ""),
    text = titles.slice(0, 30).join(" ").slice(0, 10000).toLowerCase();
  const match = (input: string) =>
    brandMatchers.find(({ patterns }) =>
      patterns.some((pattern) => pattern.test(input)),
    )?.icon;
  const brand = match(name);
  if (brand) return brand.path;
  const rules: [RegExp, string][] = [
    [/todo/, "list-todo"],
    [/migration|archive/, "archive-restore"],
    [/bulk|completed|checklist/, "list-checks"],
    [/notif|remind/, "bell-ring"],
    [/quota|security|permission|auth/, "shield-check"],
    [/database|storage|persist/, "database"],
    [/docker|container/, "container"],
    [/server|backend|api/, "server"],
    [/crash|exception/, "bug-off"],
    [/regression/, "bug-play"],

    [/observability|analytics|metric/, "chart-line"],
    [/test|verify|qa/, "flask-conical"],
    [/viewer|dashboard|interface|design/, "panels-top-left"],
    [/integration|sync/, "plug"],
    [/release|deploy/, "rocket"],
  ];
  const topic = rules.find(([rule]) => rule.test(name))?.[1];
  if (!topic) {
    const contextual = match(text);
    if (contextual) return contextual.path;
  }
  const id =
    topic ||
    (/bug\./.test(name)
      ? "bug"
      : /feature\./.test(name)
        ? "sparkles"
        : "file-text");
  return catalog.find((i) => i.id === "work-" + id)?.path || "icons/file.svg";
}
