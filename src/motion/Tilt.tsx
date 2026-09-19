"use client";

import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useRef } from "react";
import { useTier } from "./MotionProvider";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

/** 3D tilt with a moving glare. Active only on the "high" tier with a mouse. */
export function Tilt({ children, className, max = 7 }: TiltProps) {
  const tier = useTier();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (tier !== "high" || e.pointerType !== "mouse" || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`group/tilt relative will-change-transform ${className ?? ""}`}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.16), transparent 45%)",
        }}
      />
    </m.div>
  );
}
