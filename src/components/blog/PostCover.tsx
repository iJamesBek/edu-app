import type { BlogCategory } from "@/lib/types";

/**
 * Generative cover art: no image files needed. The same slug always draws the
 * same picture (seeded), and each category has its own palette and motif.
 */

const PALETTE: Record<BlogCategory, [string, string, string]> = {
  guides: ["#22c7d6", "#5b4bdb", "#0a0f2c"],
  stories: ["#ffc15e", "#ff8a9a", "#121a45"],
  news: ["#9fb4ff", "#22c7d6", "#0a0f2c"],
  events: ["#8ee6a8", "#ffc15e", "#121a45"],
};

function seeded(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function PostCover({
  slug,
  category,
  className,
}: {
  slug: string;
  category: BlogCategory;
  className?: string;
}) {
  const r = seeded(slug);
  const [a, b, bg] = PALETTE[category];
  const id = `pc-${slug}`;
  const blobs = Array.from({ length: 3 }, (_, i) => ({
    cx: 80 + r() * 640,
    cy: 60 + r() * 330,
    rad: 120 + r() * 140,
    color: i % 2 ? b : a,
  }));
  const bars = Array.from({ length: 9 }, (_, i) => ({ x: 70 + i * 74, h: 40 + r() * 170 }));

  return (
    <svg viewBox="0 0 800 450" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#eef2fa" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="800" height="450" fill={bg} />
      <g filter={`url(#${id}-blur)`} opacity="0.85">
        {blobs.map((bl, i) => (
          <circle key={i} cx={bl.cx} cy={bl.cy} r={bl.rad} fill={bl.color} />
        ))}
      </g>
      <rect width="800" height="450" fill={`url(#${id}-grid)`} />

      {category === "guides" &&
        bars.map((bar, i) => (
          <rect key={i} x={bar.x} y={400 - bar.h} width="44" height={bar.h} rx="6" fill="#eef2fa" opacity={0.1 + i * 0.03} />
        ))}
      {category === "stories" && (
        <g fill="none" stroke="#eef2fa" strokeOpacity="0.35" strokeWidth="3">
          {[70, 120, 170].map((rad) => (
            <circle key={rad} cx="620" cy="225" r={rad} />
          ))}
        </g>
      )}
      {category === "events" && (
        <g fill="#eef2fa" opacity="0.25">
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => (
              <rect key={`${row}-${col}`} x={420 + col * 50} y={90 + row * 56} width="34" height="34" rx="8" opacity={(row + col) % 3 ? 0.5 : 1} />
            )),
          )}
        </g>
      )}
      {category === "news" && (
        <g stroke="#eef2fa" strokeOpacity="0.3" strokeWidth="10" strokeLinecap="round">
          {[120, 170, 220, 270, 320].map((y, i) => (
            <line key={y} x1="440" x2={640 + (i % 2) * 80} y1={y} y2={y} />
          ))}
        </g>
      )}
    </svg>
  );
}
