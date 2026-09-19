"use client";

import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
}

/** Sticky table of contents that highlights the section being read, plus share links. */
export function PostAside({ toc, url, title }: { toc: TocItem[]; url: string; title: string }) {
  const t = useTranslations("Blog");
  const [active, setActive] = useState<string | null>(toc[0]?.id ?? null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const headings = toc.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [toc]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the Telegram link still works */
    }
  }

  const telegram = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="space-y-10">
      {toc.length > 1 && (
        <nav aria-label={t("contents")}>
          <p className="font-display text-sm font-bold text-chalk/55">{t("contents")}</p>
          <ol className="relative mt-4 space-y-1 border-l border-chalk/10">
            {toc.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  {isActive && (
                    <m.span
                      layoutId="toc-marker"
                      aria-hidden
                      className="absolute -left-px top-0 h-full w-0.5 bg-amber"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`block py-1.5 pl-4 text-sm leading-snug transition-colors ${
                      isActive ? "text-chalk" : "text-chalk/55 hover:text-chalk"
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div>
        <p className="font-display text-sm font-bold text-chalk/55">{t("share")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-chalk/20 px-4 py-2 text-sm transition-colors hover:border-majolica hover:text-majolica"
          >
            Telegram
          </a>
          <button
            type="button"
            onClick={copy}
            className="rounded-full border border-chalk/20 px-4 py-2 text-sm transition-colors hover:border-amber hover:text-amber"
          >
            <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
