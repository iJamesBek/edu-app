/**
 * Generated portrait for people without a photo yet: initials over a soft,
 * seeded gradient. Same name, same picture, on server and client.
 */

const TINTS = ["#22c7d6", "#ffc15e", "#5b4bdb", "#ff8a9a", "#8ee6a8", "#9fb4ff"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, className = "", textClassName = "text-5xl" }: { name: string; className?: string; textClassName?: string }) {
  const h = hash(name);
  const a = TINTS[h % TINTS.length];
  const b = TINTS[(h >> 3) % TINTS.length];
  return (
    <div
      aria-hidden
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${a}, transparent 60%), radial-gradient(circle at 75% 80%, ${b}, transparent 55%), #121a45`,
      }}
    >
      <span className={`font-display font-extrabold text-ink/80 mix-blend-multiply ${textClassName}`}>{initials(name)}</span>
    </div>
  );
}
