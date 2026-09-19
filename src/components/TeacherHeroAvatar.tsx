"use client";

import CircularText from "@/components/bits/CircularText";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

/** Portrait with a slowly spinning name ring (mid+ tier); a still ring otherwise. */
export function TeacherHeroAvatar({ ringText, children }: { ringText: string; children: React.ReactNode }) {
  const tier = useTier();
  const moving = tierAtLeast(tier, "mid");

  return (
    <div className="relative mx-auto grid size-[300px] place-items-center sm:size-[360px]">
      <div aria-hidden className="absolute inset-0 text-amber">
        {moving ? (
          <CircularText
            text={ringText}
            spinDuration={28}
            onHover="speedUp"
            className="!size-full !cursor-default !text-amber [&>span]:!text-[15px] [&>span]:font-display [&>span]:font-bold [&>span]:tracking-[0.2em] sm:[&>span]:!text-[17px]"
          />
        ) : (
          <div className="size-full rounded-full border border-dashed border-amber/40" />
        )}
      </div>
      <div className="size-[72%] overflow-hidden rounded-full ring-4 ring-ink">{children}</div>
    </div>
  );
}
