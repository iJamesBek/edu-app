"use client";

import * as m from "framer-motion/m";
import { useId, useState } from "react";
import { useTier } from "@/motion/MotionProvider";

export interface AccordionItem {
  id: string;
  /** Small line above the title, e.g. "Part 2" */
  kicker?: string;
  title: string;
  /** Right-aligned meta, e.g. "6 topics" */
  meta?: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Ids open on first render */
  defaultOpen?: string[];
  /** Show an expand/collapse-all control with these labels */
  toggleAll?: { expand: string; collapse: string };
  /** Numbered markers for sequences (curriculum) */
  numbered?: boolean;
  tone?: "dark" | "light";
}

/**
 * Accessible disclosure list (button + region, aria-expanded/controls).
 */
export function Accordion({ items, defaultOpen = [], toggleAll, numbered, tone = "dark" }: AccordionProps) {
  const uid = useId();
  const tier = useTier();
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen));
  const allOpen = open.size === items.length;
  const light = tone === "light";

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      {toggleAll && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((i) => i.id)))}
            className={`text-sm font-semibold hover:underline ${light ? "text-ink/70" : "text-amber"}`}
          >
            {allOpen ? toggleAll.collapse : toggleAll.expand}
          </button>
        </div>
      )}
      <ul className="space-y-3">
        {items.map((item, i) => {
          const isOpen = open.has(item.id);
          const btn = `${uid}-b-${item.id}`;
          const panel = `${uid}-p-${item.id}`;
          return (
            <li
              key={item.id}
              className={`overflow-hidden rounded-3xl border transition-colors ${
                light
                  ? isOpen
                    ? "border-ink/20 bg-white"
                    : "border-ink/10 bg-white/60 hover:bg-white"
                  : isOpen
                    ? "border-chalk/20 bg-ink-2"
                    : "border-chalk/10 bg-ink-2/60 hover:bg-ink-2"
              }`}
            >
              <h3>
                <button
                  id={btn}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center gap-4 p-5 text-left sm:gap-5 sm:p-6"
                >
                  {numbered && (
                    <span
                      aria-hidden
                      className={`grid size-11 shrink-0 place-items-center rounded-2xl font-display text-base font-bold transition-colors ${
                        isOpen ? "bg-amber text-ink" : light ? "bg-ink/8 text-ink" : "bg-chalk/8 text-chalk"
                      }`}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    {item.kicker && (
                      <span className={`block text-sm ${light ? "text-ink/55" : "text-chalk/55"}`}>{item.kicker}</span>
                    )}
                    <span className="mt-0.5 block font-display text-lg font-bold leading-snug sm:text-xl">{item.title}</span>
                  </span>
                  {item.meta && (
                    <span className={`hidden shrink-0 text-sm sm:block ${light ? "text-ink/55" : "text-chalk/55"}`}>
                      {item.meta}
                    </span>
                  )}
                  <m.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    className={`grid size-9 shrink-0 place-items-center rounded-full ${light ? "bg-ink/8" : "bg-chalk/8"}`}
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </m.span>
                </button>
              </h3>
              {/* Closed panels stay in the HTML (collapsed + inert) so crawlers still read them */}
              <m.div
                id={panel}
                role="region"
                aria-labelledby={btn}
                aria-hidden={!isOpen}
                inert={!isOpen}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: tier === "none" ? 0 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className={`px-5 pb-6 sm:px-6 ${numbered ? "sm:pl-[5.25rem]" : ""}`}>{item.content}</div>
              </m.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
