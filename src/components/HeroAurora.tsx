"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

// WebGL (ogl) is loaded only on devices that get it, and only after the page is idle.
const Aurora = dynamic(() => import("@/components/bits/Aurora"), { ssr: false });

export function HeroAurora() {
  const tier = useTier();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const id = ric(() => setIdle(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, []);

  if (!idle || !tierAtLeast(tier, "mid")) return null;

  return (
    <div aria-hidden className="aurora-in pointer-events-none absolute inset-x-0 top-0 -z-10 h-[75%] opacity-60 mix-blend-screen">
      <Aurora
        colorStops={["#22c7d6", "#5b4bdb", "#ffc15e"]}
        amplitude={tier === "high" ? 1.1 : 0.8}
        blend={0.55}
        speed={tier === "high" ? 0.8 : 0.5}
      />
    </div>
  );
}
