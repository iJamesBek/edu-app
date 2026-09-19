"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";
import {
  adjustForFrameTime,
  detectInitialTier,
  measureFrameTime,
  type Tier,
} from "./device-tier";

const TierContext = createContext<Tier>("mid");

export function useTier(): Tier {
  return useContext(TierContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Server and first client render agree on "mid"; the real tier is set after mount.
  const [tier, setTier] = useState<Tier>("mid");

  useEffect(() => {
    const root = document.documentElement;
    const apply = (next: Tier) => {
      root.dataset.motion = next;
      setTier(next);
    };

    const initial = detectInitialTier();
    apply(initial);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReducedChange = () => apply(reduced.matches ? "none" : detectInitialTier());
    reduced.addEventListener("change", onReducedChange);

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Measure real frame time once the page has settled; hydration would skew an earlier probe.
    if (initial === "high" || initial === "mid") {
      const probe = () => {
        timer = setTimeout(async () => {
          const frameMs = await measureFrameTime(800);
          if (!cancelled) apply(adjustForFrameTime(initial, frameMs));
        }, 1200);
      };
      if (document.readyState === "complete") probe();
      else window.addEventListener("load", probe, { once: true });
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      reduced.removeEventListener("change", onReducedChange);
    };
  }, []);

  return (
    <TierContext.Provider value={tier}>
      {/* strict: using `motion.*` instead of the lighter `m.*` throws in development */}
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </TierContext.Provider>
  );
}
