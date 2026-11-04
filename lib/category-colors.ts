const hues: Record<string, number> = {
  "Admin-fix": 32,
  Verify: 150,
  MCP: 210,
  ClickUp: 275,
  Blitzy: 335,
  Maybe: 48,
  General: 195,
  Uncategorised: 220,
};
export function categoryHue(
  name: string,
  categories: { name: string; color: number }[] = [],
) {
  const hash = Array.from(name).reduce(
    (value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0,
    0,
  );
  return (
    categories.find((c) => c.name === name)?.color ?? hues[name] ?? hash % 360
  );
}
export function categoriesForSettings(
  saved: { name: string; color: number }[],
  used: string[],
) {
  const result = saved.map((c) => ({ ...c })),
    seen = new Set(result.map((c) => c.name));
  for (const name of used) {
    if (!seen.has(name)) {
      result.push({ name, color: categoryHue(name, saved) });
      seen.add(name);
    }
  }
  return result;
}
