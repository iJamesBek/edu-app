"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { BlogCategory } from "@/lib/types";
import { useTier } from "@/motion/MotionProvider";
import { Reveal } from "@/motion/Reveal";
import { PostCard, type PostCardData } from "./PostCard";

const CATS: BlogCategory[] = ["guides", "stories", "events", "news"];

/** Featured newest post plus a filterable grid. Every post is in the server HTML. */
export function BlogList({ posts }: { posts: PostCardData[] }) {
  const t = useTranslations("Blog");
  const tier = useTier();
  const [cat, setCat] = useState<BlogCategory | "all">("all");

  const available = CATS.filter((c) => posts.some((p) => p.category === c));
  const visible = useMemo(() => (cat === "all" ? posts : posts.filter((p) => p.category === cat)), [posts, cat]);
  const [featured, ...rest] = visible;

  return (
    <>
      <Reveal delay={0.05}>
        <div role="group" aria-label={t("filter")} className="no-scrollbar -mx-4 mt-10 flex gap-1 overflow-x-auto px-4">
          {(["all", ...available] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                cat === c ? "text-ink" : "text-chalk/75 hover:text-chalk"
              }`}
            >
              {cat === c && (
                <m.span
                  layoutId="blog-pill"
                  className="absolute inset-0 rounded-full bg-chalk"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{c === "all" ? t("all") : t(`categories.${c}`)}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {!featured && <p className="mt-12 text-chalk/60">{t("empty")}</p>}

      <AnimatePresence mode="popLayout" initial={false}>
        {featured && (
          <m.div
            key={`featured-${featured.slug}`}
            layout={tier !== "none"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-8"
          >
            <Reveal>
              <PostCard post={featured} large />
            </Reveal>
          </m.div>
        )}
      </AnimatePresence>

      <m.ul layout={tier !== "none"} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {rest.map((p, i) => (
            <m.li
              key={p.slug}
              layout={tier !== "none"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Reveal delay={i * 0.07} className="h-full">
                <PostCard post={p} />
              </Reveal>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </>
  );
}
