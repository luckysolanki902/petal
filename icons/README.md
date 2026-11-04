# Petal icon catalog

`catalog.json` indexes the bundled **Simple Icons** brand marks and **Lucide** work icons. SVGs are individual, minified assets: the browser requests only icons displayed on screen, not the whole catalog. Brand paths start with `brand-`; work paths start with `work-`.

```sh
petal icons list --search posthog
petal icons list --search bug
petal icons set --project PROJECT_ID --file data/bug.analytics.json --icon brand-posthog
petal icons auto --project PROJECT_ID
```

Assignments keep the existing `file-icons.json` shape: `{ "data/bug.analytics.json": { "icon": "icons/brand-posthog.svg" } }`. No row/schema changes are needed. `auto` replaces collection icon choices based on filenames and task titles; `set` is the explicit override. Neither command commits or pushes.

Petal uses CSS masks to tint these monochrome shapes. The file path determines the hue, so two files sharing a logo get stable, distinct variations without extra SVG copies. Light and dark themes adjust luminance for contrast. Existing external/multicolor icons retain their image rendering; failed images fall back to semantic work icons.

## Sources and redistribution

- [Simple Icons](https://github.com/simple-icons/simple-icons): project license in `SIMPLE-ICONS-LICENSE.txt`; full upstream disclaimer in `SIMPLE-ICONS-DISCLAIMER.md`. Brand names and marks remain their respective owners' property. Individual source/guideline/license references are preserved in each catalog entry. CC0 for the project does not imply every represented brand is unrestricted.
- [Lucide](https://github.com/lucide-icons/lucide): license and attribution in `LUCIDE-LICENSE.txt`.

Rebuild from the pinned development dependencies with `npm run build:icons`. The generator renders original upstream shapes and runs SVGO; generated SVGs are excluded from Prettier so their optimized bytes stay compact. Do not hand-edit generated assets. `catalog.json` and generator source are formatted normally.
