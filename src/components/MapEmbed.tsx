"use client";

import { useState } from "react";

/**
 * Click-to-load map: the Google iframe (heavy, and it sets third-party cookies)
 * loads only when the visitor asks for it.
 */
export function MapEmbed({ query, title, labels }: { query: string; title: string; labels: { load: string; note: string; open: string } }) {
  const [on, setOn] = useState(false);
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-chalk/10 bg-ink-2 sm:aspect-[16/10]">
      {on ? (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          {/* Decorative street grid */}
          <svg aria-hidden className="absolute inset-0 size-full opacity-30" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
            <g stroke="#eef2fa" strokeOpacity="0.25" strokeWidth="6" fill="none">
              <path d="M-10 60 L410 90 M-10 170 L410 150 M80 -10 L120 260 M260 -10 L230 260 M330 -10 L360 260" />
            </g>
            <circle cx="300" cy="70" r="10" fill="#ffc15e" />
            <circle cx="300" cy="70" r="24" fill="#ffc15e" fillOpacity="0.25" className="ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          </svg>
          <div className="relative">
            <button type="button" onClick={() => setOn(true)} className="rounded-full bg-amber px-6 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5">
              {labels.load}
            </button>
            <p className="mt-3 text-sm text-chalk/55">{labels.note}</p>
            <a href={openUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-majolica hover:underline">
              {labels.open}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
