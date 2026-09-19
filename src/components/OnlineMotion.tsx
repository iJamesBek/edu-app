"use client";

import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/lib/categories";
import RotatingText from "@/components/bits/RotatingText";
import ScrollVelocity from "@/components/bits/ScrollVelocity";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

const DIRS = CATEGORIES;

/** Two ribbons of direction names; they speed up and reverse with scroll velocity. */
export function VelocityRibbons() {
  const td = useTranslations("Directions");
  const tier = useTier();
  const line = DIRS.map((d) => td(d)).join("  ✦  ");

  return (
    <div aria-hidden className="-rotate-2 bg-majolica py-3 text-ink">
      <ScrollVelocity
        texts={[line, line]}
        velocity={tier === "high" ? 60 : 40}
        numCopies={4}
        animate={tierAtLeast(tier, "mid")}
        className="px-3 font-display text-2xl font-extrabold leading-tight sm:text-4xl"
        velocityMapping={{ input: [0, 1000], output: [0, 3] }}
        parallaxClassName="py-1"
      />
    </div>
  );
}

/** Direction name that rotates in place. Server HTML carries the first one. */
export function RotatingDirection() {
  const td = useTranslations("Directions");
  const tier = useTier();

  return (
    <RotatingText
      texts={DIRS.map((d) => td(d))}
      auto={tierAtLeast(tier, "low")}
      rotationInterval={2400}
      staggerDuration={0.012}
      staggerFrom="last"
      splitLevelClassName="overflow-hidden pb-1"
      mainClassName="inline-flex justify-center overflow-hidden rounded-2xl bg-amber px-4 py-1 text-ink"
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
    />
  );
}
