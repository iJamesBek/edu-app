import { getTranslations } from "next-intl/server";
import type { Stats } from "@/lib/types";
import { CountUp } from "@/motion/CountUp";
import { Reveal } from "@/motion/Reveal";

export async function About({ stats }: { stats: Stats }) {
  const t = await getTranslations("About");
  const items = [
    { value: stats.students, suffix: "+", label: t("stats.students") },
    { value: stats.mentors, suffix: "+", label: t("stats.mentors") },
    { value: stats.directions, suffix: "", label: t("stats.directions") },
    { value: stats.branches, suffix: "", label: t("stats.branches") },
  ];

  return (
    <section aria-labelledby="about-title" className="relative overflow-hidden bg-chalk py-20 text-ink sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 id="about-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-xl leading-relaxed">{t("text1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">{t("text2")}</p>
        </Reveal>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 self-center">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t-2 border-ink pt-4">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp
                    value={s.value}
                    suffix={s.suffix}
                    className="block font-display text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold leading-none tabular-nums"
                  />
                  <span className="mt-2 block text-ink/70">{s.label}</span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
