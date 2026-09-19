"use client";

import { animate, useInView } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { tierAtLeast } from "./device-tier";
import { useTier } from "./MotionProvider";

/** Deterministic grouping so server and client text always match. */
export function formatNumber(value: number, locale: string): string {
  const separator = locale === "en" ? "," : " ";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
}

/** Counts up once when visible. The server renders the final value, so crawlers read the real number. */
export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const tier = useTier();
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !tierAtLeast(tier, "mid")) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = formatNumber(Math.round(v), locale) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, tier, value, suffix, locale]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(value, locale)}
      {suffix}
    </span>
  );
}
