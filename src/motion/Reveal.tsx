"use client";

import { useInView } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useRef, useState } from "react";
import { useTier } from "./MotionProvider";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds. Use index * 0.08 to stagger siblings. */
  delay?: number;
  /** Start offset in px. */
  y?: number;
}

/**
 * Fade-and-rise once when scrolled into view.
 *
 * SEO/no-JS safe: the server HTML is fully visible. After mount, only elements
 * that start below the fold are hidden (instantly, off-screen) and then revealed.
 */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const tier = useTier();
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.88) {
      setArmed(true);
    }
  }, []);

  const calm = tier === "low";
  const visible = !armed || inView || tier === "none";

  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={visible ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: calm ? 0 : y, transition: { duration: 0 } },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: calm ? 0.3 : 0.75,
            delay: calm ? 0 : delay,
            ease: [0.2, 0.8, 0.2, 1],
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}
