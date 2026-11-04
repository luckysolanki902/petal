export const NOTIFICATION_SOUNDS = [
  { name: "Soft bell", notes: [660, 880] },
  { name: "Glass", notes: [1046, 1318] },
  { name: "Warm chime", notes: [440, 554, 659] },
  { name: "Orbit", notes: [523, 784, 1046] },
  { name: "Droplet", notes: [987, 659] },
  { name: "Bloom", notes: [587, 740, 880] },
];
export function workspaceSounds(
  ids: string[],
  saved: Record<string, unknown>,
): Record<string, number> {
  const next: Record<string, number> = {},
    used = new Set<number>();
  for (const id of ids) {
    const n = saved[id];
    if (
      typeof n === "number" &&
      Number.isInteger(n) &&
      n >= 0 &&
      n < NOTIFICATION_SOUNDS.length
    ) {
      next[id] = n;
      used.add(n);
    }
  }
  for (const [index, id] of ids.entries())
    if (next[id] === undefined) {
      const free = NOTIFICATION_SOUNDS.findIndex((_, i) => !used.has(i));
      next[id] = free < 0 ? index % NOTIFICATION_SOUNDS.length : free;
      used.add(next[id]);
    }
  return next;
}
