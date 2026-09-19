"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ClickSpark from "@/components/bits/ClickSpark";
import { tierAtLeast } from "@/motion/device-tier";
import { useTier } from "@/motion/MotionProvider";

/** Page-wide extras: click sparks and a back-to-top button. */
export function Effects() {
  const t = useTranslations("Nav");
  const tier = useTier();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ClickSpark enabled={tierAtLeast(tier, "mid")} />
      <AnimatePresence>
        {showTop && (
          <m.button
            type="button"
            aria-label={t("top")}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: tier === "none" ? "auto" : "smooth" })
            }
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-5 right-5 z-50 grid size-12 place-items-center rounded-full bg-amber text-ink shadow-[0_10px_30px_-8px_rgba(255,193,94,0.8)]"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </m.button>
        )}
      </AnimatePresence>
    </>
  );
}
