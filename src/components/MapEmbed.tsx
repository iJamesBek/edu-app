"use client";

import * as m from "framer-motion/m";
import { useState } from "react";
import { mapLinks } from "@/lib/map-links";

type Provider = "yandex" | "google";

export interface MapLabels {
  yandex: string;
  google: string;
  taxi: string;
  routeYandex: string;
  routeGoogle: string;
  copy: string;
  copied: string;
}

const ICON = {
  taxi: <path d="M5 11l1.6-4.2A2 2 0 018.5 5.5h7a2 2 0 011.9 1.3L19 11m-14 0h14m-14 0v6h2m12-6v6h-2m-10 0h10M7.5 14h.01M16.5 14h.01M10 3h4" />,
  route: <path d="M6 19a2 2 0 100-4 2 2 0 000 4zm12-10a2 2 0 100-4 2 2 0 000 4zM6 15V9a3 3 0 013-3h3m6 3v6a3 3 0 01-3 3h-3" />,
  copy: <path d="M9 9h10v10H9zM5 15V5h10" />,
};

function Icon({ d }: { d: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {d}
    </svg>
  );
}

/**
 * Map with a Yandex / Google switch, plus "call a taxi", route and copy-address actions.
 * Iframes are lazy: the browser loads them only when they scroll near the viewport.
 */
export function MapEmbed({
  geo,
  address,
  title,
  labels,
}: {
  geo: { lat: number; lng: number };
  address: string;
  title: string;
  labels: MapLabels;
}) {
  const [provider, setProvider] = useState<Provider>("yandex");
  const [copied, setCopied] = useState(false);
  const links = mapLinks(geo);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${address} (${geo.lat}, ${geo.lng})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; the route links still work */
    }
  }

  const action = "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5";

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-chalk/10 bg-ink-2">
        <div role="tablist" aria-label={title} className="absolute left-3 top-3 z-10 flex rounded-full bg-ink/85 p-1 backdrop-blur">
          {(["yandex", "google"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={provider === p}
              onClick={() => setProvider(p)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${provider === p ? "text-ink" : "text-chalk/75 hover:text-chalk"}`}
            >
              {provider === p && (
                <m.span layoutId="map-tab" className="absolute inset-0 rounded-full bg-amber" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{labels[p]}</span>
            </button>
          ))}
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/10]">
          {/* Both iframes stay mounted so switching is instant; only the selected one is visible */}
          {(["yandex", "google"] as const).map((p) => (
            <iframe
              key={p}
              title={`${title} — ${labels[p]}`}
              src={p === "yandex" ? links.yandexEmbed : links.googleEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              aria-hidden={provider !== p}
              tabIndex={provider === p ? 0 : -1}
              className={`absolute inset-0 size-full border-0 transition-opacity duration-300 ${provider === p ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href={links.taxi} target="_blank" rel="noopener noreferrer" className={`${action} bg-[#fc3f1d] text-white`}>
          <Icon d={ICON.taxi} />
          {labels.taxi}
        </a>
        <a href={links.routeYandex} target="_blank" rel="noopener noreferrer" className={`${action} bg-chalk/10 hover:bg-chalk/15`}>
          <Icon d={ICON.route} />
          {labels.routeYandex}
        </a>
        <a href={links.routeGoogle} target="_blank" rel="noopener noreferrer" className={`${action} bg-chalk/10 hover:bg-chalk/15`}>
          <Icon d={ICON.route} />
          {labels.routeGoogle}
        </a>
        <button type="button" onClick={copy} className={`${action} bg-chalk/10 hover:bg-chalk/15`}>
          <Icon d={ICON.copy} />
          <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
        </button>
      </div>
    </div>
  );
}
