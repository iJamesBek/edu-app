"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import type { Branch, Category, Course } from "@/lib/types";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { Reveal } from "@/motion/Reveal";
import { Tilt } from "@/motion/Tilt";
import { useTier } from "@/motion/MotionProvider";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, CATEGORY_ACCENT } from "@/lib/categories";
import { PICK_DIRECTION_EVENT } from "./CityScene";


interface CoursesProps {
  courses: Course[];
  branches: Branch[];
  /** 1 on the /courses page, 2 as a home page section. */
  headingLevel?: 1 | 2;
}

export function Courses({ courses, branches, headingLevel = 2 }: CoursesProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const t = useTranslations("Courses");
  const td = useTranslations("Directions");
  const tf = useTranslations("Free");
  const tier = useTier();
  const [dir, setDir] = useState<Category | "all">("all");
  const [branch, setBranch] = useState<string>("all");

  useEffect(() => {
    const onPick = (e: Event) => setDir((e as CustomEvent<Category>).detail);
    window.addEventListener(PICK_DIRECTION_EVENT, onPick);
    return () => window.removeEventListener(PICK_DIRECTION_EVENT, onPick);
  }, []);

  const visible = useMemo(
    () =>
      courses.filter(
        (c) => (dir === "all" || c.category === dir) && (branch === "all" || c.branchIds.includes(branch)),
      ),
    [courses, dir, branch],
  );

  const chip = (selected: boolean) =>
    `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      selected ? "text-ink" : "text-chalk/75 hover:text-chalk"
    }`;

  return (
    <section id="courses" aria-labelledby="courses-title" className={`relative ${headingLevel === 1 ? "pb-20 pt-6 sm:pb-28" : "py-20 sm:py-28"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <Heading id="courses-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </Heading>
          <p className="mt-4 max-w-xl text-lg text-chalk/70">{t("lead")}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={t("filterDirection")} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4">
            {(["all", ...CATEGORIES] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={dir === d}
                onClick={() => setDir(d)}
                className={chip(dir === d)}
              >
                {dir === d && (
                  <m.span
                    layoutId="dir-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-chalk"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative whitespace-nowrap">{d === "all" ? t("all") : td(d)}</span>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 text-sm text-chalk/70">
            {t("filterBranch")}
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="rounded-full border border-chalk/20 bg-ink-2 px-4 py-2 text-chalk"
            >
              <option value="all">{t("all")}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          {t("resultCount", { count: visible.length })}
        </p>

        <m.ul layout={tier !== "none"} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((c, i) => (
              <m.li
                key={c.id}
                layout={tier !== "none"}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Reveal delay={i * 0.07} className="h-full">
                  <Tilt className="h-full rounded-3xl">
                    <SpotlightCard
                      className="h-full rounded-3xl border border-chalk/10 bg-ink-2"
                      spotlightColor="rgba(34, 199, 214, 0.22)"
                    >
                    <article className="relative flex h-full flex-col p-7">
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold text-ink"
                          style={{ background: CATEGORY_ACCENT[c.category] }}
                        >
                          {td(c.category)}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-chalk/60">
                          <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-semibold text-amber">{tf("badge")}</span>
                          {t("months", { count: c.durationMonths })}
                        </span>
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-bold leading-tight">
                        {/* Stretched link: the whole card opens the course page */}
                        <Link href={`/courses/${c.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {c.title}
                        </Link>
                      </h3>
                      <p className="mt-3 flex-1 leading-relaxed text-chalk/70">{c.summary}</p>
                      <div className="mt-7 flex items-center justify-between border-t border-chalk/10 pt-5">
                        <span className="text-sm text-chalk/60">{t(`level.${c.level}`)}</span>
                        <Link
                          href={`/courses/${c.slug}#apply`}
                          className="relative z-10 text-sm font-semibold text-amber hover:underline"
                        >
                          {t("apply")}
                        </Link>
                      </div>
                    </article>
                    </SpotlightCard>
                  </Tilt>
                </Reveal>
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>

        {visible.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-chalk/20 p-10 text-center">
            <h3 className="font-display text-xl font-bold">{t("emptyTitle")}</h3>
            <p className="mx-auto mt-3 max-w-md text-chalk/65">{t("emptyText")}</p>
            <button
              type="button"
              onClick={() => setBranch("all")}
              className="mt-6 rounded-full bg-majolica px-5 py-2.5 font-semibold text-ink"
            >
              {t("all")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
