"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import Stack from "@/components/bits/Stack";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";

const TINTS = ["var(--chalk)", "var(--amber)", "var(--majolica)", "#ffd6dc"];

/** Draggable stack of review cards. Never autoplays, so it doesn't move while someone reads. */
export function Reviews({ items }: { items: Testimonial[] }) {
  const t = useTranslations("Reviews");

  // Last card renders on top; reverse so the first review is the one people see first.
  const cards = useMemo(
    () =>
      [...items].reverse().map((r, i) => (
        <figure
          key={r.id}
          className="flex h-full flex-col justify-between p-7 text-ink sm:p-9"
          style={{ background: TINTS[i % TINTS.length] }}
        >
          <blockquote className="font-display text-lg font-medium leading-snug sm:text-xl">“{r.quote}”</blockquote>
          <figcaption className="mt-6">
            <span className="block font-semibold">{r.author}</span>
            <span className="block text-sm opacity-70">{r.course}</span>
          </figcaption>
        </figure>
      )),
    [items],
  );

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="overflow-hidden bg-dusk py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <h2 id="reviews-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-chalk/80">{t("lead")}</p>
          <p className="mt-8 inline-flex items-center gap-3 text-chalk/75">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M8 13V5.5a1.5 1.5 0 013 0V12m0-1.5v-2a1.5 1.5 0 013 0V12m0-1a1.5 1.5 0 013 0v4.5a5.5 5.5 0 01-5.5 5.5h-1.2a5 5 0 01-4-2l-3-4a1.5 1.5 0 012.3-1.9L8 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("hint")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div aria-hidden className="mx-auto h-[300px] w-full max-w-[400px] sm:h-[320px]">
            <Stack key={items.map((r) => r.id).join()} cards={cards} sensitivity={140} sendToBackOnClick mobileClickOnly />
          </div>
          {/* The stack is visual only; this list is what crawlers and screen readers read */}
          <ul className="sr-only">
            {items.map((r) => (
              <li key={r.id}>
                <blockquote>{r.quote}</blockquote> — {r.author}, {r.course}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
