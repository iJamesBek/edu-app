"use client";

import { useScroll, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useTier } from "./MotionProvider";

/** Thin amber bar showing page scroll progress. Hidden when motion is off. */
export function ScrollProgress() {
  const tier = useTier();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  if (tier === "none" || tier === "low") return null;

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-majolica via-amber to-dusk"
    />
  );
}
