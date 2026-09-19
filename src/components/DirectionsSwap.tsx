"use client";

import CardSwap, { Card } from "@/components/bits/CardSwap";
import type { Category } from "@/lib/types";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

export interface DirectionCard {
  dir: Category;
  label: string;
  courses: string[];
}

const STYLE: Record<Category, { bg: string; fg: string }> = {
  programming: { bg: "var(--majolica)", fg: "var(--ink)" },
  design: { bg: "var(--amber)", fg: "var(--ink)" },
  marketing: { bg: "#ff8a9a", fg: "var(--ink)" },
  office: { bg: "var(--dusk)", fg: "var(--chalk)" },
};

/** Auto-swapping stack of direction cards (the old site's hero slider, reimagined). */
export function DirectionsSwap({ cards, label }: { cards: DirectionCard[]; label: string }) {
  const tier = useTier();

  return (
    <div
      role="group"
      aria-label={label}
      className="relative mx-auto h-[340px] w-full max-w-[420px] sm:h-[380px]"
    >
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 scale-[0.78] sm:scale-100">
        <CardSwap
          width={360}
          height={260}
          cardDistance={42}
          verticalDistance={48}
          delay={4200}
          pauseOnHover
          skewAmount={4}
          animate={tierAtLeast(tier, "mid")}
        >
          {cards.map((c) => (
            <Card
              key={c.dir}
              className="flex flex-col p-7 shadow-[0_30px_60px_-20px_rgba(10,15,44,0.55)]"
              style={{ background: STYLE[c.dir].bg, color: STYLE[c.dir].fg }}
            >
              <span className="font-display text-3xl font-extrabold leading-none">{c.label}</span>
              <ul className="mt-auto space-y-1.5 text-[15px] font-medium opacity-85">
                {c.courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </Card>
          ))}
        </CardSwap>
      </div>
    </div>
  );
}
