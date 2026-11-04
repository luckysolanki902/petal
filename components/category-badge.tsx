import type { CSSProperties } from "react";
import { categoryHue } from "../lib/category-colors";
export function categoryStyle(
  category: string,
  categories: { name: string; color: number }[] = [],
): CSSProperties {
  return {
    "--category-hue": categoryHue(category, categories),
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
