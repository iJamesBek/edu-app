"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";
import { useTier } from "@/motion/MotionProvider";

/** Manual carousel: no autoplay, so it never moves while someone is reading. */
export function Reviews({ items }: { items: Testimonial[] }) {
  const t = useTranslations("Reviews");
  const tier = useTier();
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const item = items[index];

  const go = (step: number) =>
    setState(([i]) => [(i + step + items.length) % items.length, step]);

  const offset = tier === "none" || tier === "low" ? 0 : 60;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-dusk py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="reviews-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-lg text-chalk/80">{t("lead")}</p>
          </div>
          <div className="flex gap-2">
            {[
              { step: -1, label: t("prev"), d: "M15 6l-6 6 6 6" },
              { step: 1, label: t("next"), d: "M9 6l6 6-6 6" },
            ].map((b) => (
              <button
                key={b.step}
                type="button"
                onClick={() => go(b.step)}
                aria-label={b.label}
                className="grid size-12 place-items-center rounded-full border border-chalk/40 transition-colors hover:bg-chalk hover:text-dusk"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d={b.d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="relative mt-12 min-h-[18rem] sm:min-h-[15rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <m.figure
              key={item.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * offset }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * offset }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <blockquote className="font-display text-[clamp(1.4rem,3.2vw,2.3rem)] font-medium leading-snug text-balance">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 bg-amber" aria-hidden />
                <span>
                  <span className="block font-semibold">{item.author}</span>
                  <span className="block text-sm text-chalk/75">{item.course}</span>
                </span>
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>

        {/* Every review stays in the server HTML for crawlers */}
        <ul className="sr-only">
          {items.map((r) => (
            <li key={r.id}>
              {r.author}: {r.quote}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex gap-2" aria-hidden>
          {items.map((r, i) => (
            <span
              key={r.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10 bg-amber" : "w-4 bg-chalk/35"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
