import { getTranslations } from "next-intl/server";
import { CATEGORIES } from "@/lib/categories";
import type { Course, Stats } from "@/lib/types";
import { CountUp } from "@/motion/CountUp";
import { Reveal } from "@/motion/Reveal";
import { DirectionsSwap, type DirectionCard } from "./DirectionsSwap";

const ORDER = CATEGORIES;

export async function About({ stats, courses }: { stats: Stats; courses: Course[] }) {
  const t = await getTranslations("About");
  const td = await getTranslations("Directions");

  const items = [
    { value: stats.students, suffix: "+", label: t("stats.students") },
    { value: stats.mentors, suffix: "+", label: t("stats.mentors") },
    { value: stats.directions, suffix: "", label: t("stats.directions") },
    { value: stats.branches, suffix: "", label: t("stats.branches") },
  ];

  const cards: DirectionCard[] = ORDER.map((dir) => ({
    dir,
    label: td(dir),
    courses: courses.filter((c) => c.category === dir).map((c) => c.title),
  })).filter((c) => c.courses.length > 0);

  return (
    <section aria-labelledby="about-title" className="relative overflow-hidden bg-chalk py-20 text-ink sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <h2 id="about-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-6 text-xl leading-relaxed">{t("text1")}</p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">{t("text2")}</p>
          </Reveal>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10">
            {items.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="border-t-2 border-ink pt-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <CountUp
                      value={s.value}
                      suffix={s.suffix}
                      className="block font-display text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-none tabular-nums"
                    />
                    <span className="mt-2 block text-ink/70">{s.label}</span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={0.15}>
          <DirectionsSwap cards={cards} label={t("directionsLabel")} />
        </Reveal>
      </div>
    </section>
  );
}
