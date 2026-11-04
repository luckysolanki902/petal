import type { CSSProperties } from "react";
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
export function categoryStyle(
  category: string,
  categories: { name: string; color: number }[] = [],
): CSSProperties {
  const hash = Array.from(category).reduce(
    (value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) >>> 0,
    0,
  );
  return {
    "--category-hue":
      categories.find((c) => c.name === category)?.color ??
      hues[category] ??
      hash % 360,
  } as CSSProperties;
}
export default function CategoryBadge({
  category,
  categories = [],
}: {
  category: string;
  categories?: { name: string; color: number }[];
}) {
  return (
    <span
      className="category-badge"
      style={categoryStyle(category, categories)}
    >
      <i aria-hidden="true" />
      {category}
    </span>
  );
}
