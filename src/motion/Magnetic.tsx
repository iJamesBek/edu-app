"use client";

import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useRef } from "react";
import { useTier } from "./MotionProvider";

/** Pulls its child a few pixels toward the cursor. "high" tier with a mouse only. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const tier = useTier();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.6 });

  function onPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (tier !== "high" || e.pointerType !== "mouse" || !el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </m.span>
  );
}
