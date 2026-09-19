"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useState } from "react";
import LogoLoop from "@/components/bits/LogoLoop";
import ScrollFloat from "@/components/bits/ScrollFloat";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

/** Section heading whose letters float in with scroll (mid+ tier); plain heading otherwise. */
export function FloatHeading({ id, text, className }: { id?: string; text: string; className: string }) {
  const tier = useTier();
  return (
    <ScrollFloat
      id={id}
      animate={tierAtLeast(tier, "mid")}
      containerClassName="py-1"
      textClassName={className}
      scrollStart="top bottom-=5%"
      scrollEnd="bottom center"
      stagger={0.02}
    >
      {text}
    </ScrollFloat>
  );
}

/** Endless strip of tool names; still on weak devices. */
export function ToolsLoop({ tools, label }: { tools: string[]; label: string }) {
  const tier = useTier();
  const items = tools.map((t) => ({ node: <span>{t}</span>, title: t }));

  if (!tierAtLeast(tier, "mid")) {
    return (
      <ul aria-label={label} className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <li key={t} className="rounded-full border border-chalk/15 px-4 py-2 font-display text-lg font-bold">
            {t}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <LogoLoop
      logos={items}
      speed={tier === "high" ? 70 : 50}
      gap={16}
      logoHeight={56}
      pauseOnHover
      fadeOut
      fadeOutColor="#0a0f2c"
      ariaLabel={label}
      renderItem={(item) => (
        <span className="inline-flex h-14 items-center rounded-full border border-chalk/15 bg-ink-2 px-6 font-display text-xl font-bold whitespace-nowrap">
          {"title" in item ? item.title : null}
        </span>
      )}
    />
  );
}

/**
 * Mobile-only bottom bar with price and an enroll button. Appears once the hero
 * has scrolled away and hides while the application form is on screen.
 */
export function StickyApply({ price, cta, heroId, formId }: { price: string; cta: string; heroId: string; formId: string }) {
  const [heroGone, setHeroGone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const form = document.getElementById(formId);
    if (!hero || !form) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroGone(!e.isIntersecting);
        if (e.target === form) setFormVisible(e.isIntersecting);
      }
    });
    io.observe(hero);
    io.observe(form);
    return () => io.disconnect();
  }, [heroId, formId]);

  const show = heroGone && !formVisible;

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-chalk/10 bg-ink/90 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <span className="font-display text-lg font-bold tabular-nums">{price}</span>
            <a href={`#${formId}`} className="rounded-full bg-amber px-6 py-3 font-semibold text-ink">
              {cta}
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
