import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { FreeGroup } from "@/lib/types";
import { Magnetic } from "@/motion/Magnetic";
import { Reveal } from "@/motion/Reveal";
import StarBorder from "@/components/bits/StarBorder";

const GROUPS = ["school", "unemployed", "other"] as const;

const ICON: Record<(typeof GROUPS)[number], React.ReactNode> = {
  school: <path d="M3 8l9-4 9 4-9 4zm4 2v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5M21 8v6" />,
  unemployed: <path d="M4 5h16v10H4zM8 19h8M12 15v4" />,
  other: <path d="M12 21a9 9 0 110-18 9 9 0 010 18zm0-5v.5M9.5 9a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.5" />,
};

/**
 * Who studies for free, based on Decree PQ-178 (facts from the center and its old site).
 * On a course page pass `freeFor` to highlight the groups that apply to that course.
 */
export async function FreeEligibility({
  freeFor,
  ctaHref = "/courses",
  headingId = "free-title",
}: {
  freeFor?: FreeGroup[];
  ctaHref?: string;
  headingId?: string;
}) {
  const t = await getTranslations("Free");

  return (
    <section aria-labelledby={headingId} className="relative isolate overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="drift absolute -right-40 top-10 -z-10 size-[520px] rounded-full bg-amber opacity-10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <span className="inline-block rounded-full bg-amber px-4 py-1.5 font-display text-sm font-bold text-ink">{t("badge")}</span>
            <h2 id={headingId} className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-chalk/75">{t("lead")}</p>
            <p className="mt-3 text-sm text-chalk/45">
              <a href="https://lex.uz/docs/-6927663" target="_blank" rel="noopener noreferrer" className="underline decoration-chalk/30 underline-offset-4 hover:text-chalk">
                {t("source")}
              </a>
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {GROUPS.map((g, i) => {
            const applies = g === "other" || !freeFor || freeFor.includes(g);
            return (
              <li key={g}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div
                    className={`flex h-full flex-col rounded-3xl p-7 transition-opacity ${
                      g === "other" ? "border border-dashed border-chalk/20" : "border border-chalk/10 bg-ink-2"
                    } ${applies ? "" : "opacity-45"}`}
                  >
                    <svg viewBox="0 0 24 24" className={`size-10 ${g === "other" ? "text-chalk/60" : "text-amber"}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {ICON[g]}
                    </svg>
                    <h3 className="mt-6 font-display text-xl font-bold">{t(`${g}.title`)}</h3>
                    <p className="mt-2 leading-relaxed text-chalk/70">{t(`${g}.text`)}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-10">
          <Magnetic>
            {ctaHref.startsWith("#") ? (
              <StarBorder as="a" href={ctaHref} color="#22c7d6" speed="5s" backgroundColor="#ffc15e" textColor="#0a0f2c" borderColor="#ffc15e">
                {t("cta")}
              </StarBorder>
            ) : (
              <Link href={ctaHref} className="inline-flex rounded-full bg-amber px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5">
                {t("cta")}
              </Link>
            )}
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
