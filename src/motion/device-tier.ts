/**
 * Motion tiers. Every animation in the app checks the tier so the same page
 * feels lavish on a desktop and stays smooth on a weak phone.
 *
 *   high — pointer effects (3D tilt, spotlight, magnetic buttons), twinkling windows
 *   mid  — scroll reveals and scroll parallax
 *   low  — short opacity fades only, no loops
 *   none — no motion (prefers-reduced-motion)
 */
export type Tier = "high" | "mid" | "low" | "none";

const ORDER: Tier[] = ["none", "low", "mid", "high"];

export function tierAtLeast(tier: Tier, min: Tier): boolean {
  return ORDER.indexOf(tier) >= ORDER.indexOf(min);
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string };
type NavigatorWithHints = Navigator & {
  deviceMemory?: number; // Chromium only, capped at 8
  connection?: NetworkInformation;
};

/** Cheap, synchronous guess from hardware hints. Safe to call only in the browser. */
export function detectInitialTier(): Tier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";

  const nav = navigator as NavigatorWithHints;
  const connection = nav.connection;
  if (
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return "low";
  }

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency || 4;

  let score = 0;
  // Safari and Firefox hide deviceMemory: assume a desktop-class machine only with a mouse.
  if (memory === undefined) score += finePointer ? 2 : 1;
  else if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;
  else if (memory <= 2) score -= 1;

  score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0;
  if (!finePointer) score -= 1; // phones and tablets never start at "high"

  return score >= 4 ? "high" : score >= 2 ? "mid" : "low";
}

/** Median frame time in ms over `durationMs`, or null if the tab is hidden. */
export function measureFrameTime(durationMs: number): Promise<number | null> {
  return new Promise((resolve) => {
    if (document.hidden) return resolve(null);

    const deltas: number[] = [];
    let last = 0;
    let start = 0;

    function frame(now: number) {
      if (document.hidden) return resolve(null);
      if (!start) start = now;
      if (last) deltas.push(now - last);
      last = now;

      if (now - start < durationMs) return requestAnimationFrame(frame);

      const usable = deltas.slice(2).sort((a, b) => a - b);
      resolve(usable.length ? usable[Math.floor(usable.length / 2)] : null);
    }
    requestAnimationFrame(frame);
  });
}

/** Step the tier down when the device cannot hold a smooth frame rate. Never steps up. */
export function adjustForFrameTime(tier: Tier, frameMs: number | null): Tier {
  if (frameMs === null || tier === "none" || tier === "low") return tier;
  if (frameMs > 34) return "low"; // under ~30 fps
  if (frameMs > 22) return tier === "high" ? "mid" : "low"; // under ~45 fps
  return tier;
}
