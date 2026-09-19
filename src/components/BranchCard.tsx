import { Link } from "@/i18n/navigation";
import SpotlightCard from "@/components/bits/SpotlightCard";
import type { Branch } from "@/lib/types";

/** Google Maps link: exact point when known, address search otherwise. */
export function mapsUrl(branch: Pick<Branch, "address" | "geo">) {
  const q = branch.geo ? `${branch.geo.lat},${branch.geo.lng}` : branch.address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length === 12 ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}` : phone;
}

/** Branch summary. Title links to the branch page; the phone stays independently clickable. */
export function BranchCard({
  branch,
  labels,
  meta,
}: {
  branch: Branch;
  labels: { hours: string; details: string };
  meta?: string;
}) {
  return (
    <SpotlightCard className="h-full rounded-3xl border border-chalk/10 bg-ink-2 p-7" spotlightColor="rgba(34, 199, 214, 0.18)">
      <article className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold">
            <Link href="/contact" className="after:absolute after:inset-0 after:content-['']">
              {branch.name}
            </Link>
          </h3>
          <svg viewBox="0 0 24 24" className="size-7 shrink-0 text-majolica" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z" strokeLinejoin="round" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
        </div>
        <p className="mt-3 leading-relaxed text-chalk/70">{branch.address}</p>
        <p className="mt-4 text-sm text-chalk/55">
          {labels.hours}: <span className="text-chalk/85">{branch.hours}</span>
        </p>
        {meta && <p className="mt-1 text-sm text-chalk/55">{meta}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <a href={`tel:${branch.phone}`} className="relative z-10 text-sm tabular-nums text-chalk/80 hover:text-amber">
            {formatPhone(branch.phone)}
          </a>
          <span className="text-sm font-semibold text-amber">{labels.details}</span>
        </div>
      </article>
    </SpotlightCard>
  );
}
