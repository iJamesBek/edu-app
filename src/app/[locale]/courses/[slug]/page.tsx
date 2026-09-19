import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { CATEGORY_ACCENT } from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, courseJsonLd, jsonLdString } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ApplyForm } from "@/components/ApplyForm";
import { Reveal } from "@/motion/Reveal";
import { Magnetic } from "@/motion/Magnetic";
import SpotlightCard from "@/components/bits/SpotlightCard";

// Locales come from the parent layout; this adds one page per course.
export async function generateStaticParams() {
  return (await api.courseSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/courses/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const course = await api.courseBySlug(locale, slug);
  if (!course) return {};
  return pageMetadata({ locale, path: `/courses/${slug}`, title: course.title, description: course.summary });
}

export default async function CoursePage({ params }: PageProps<"/[locale]/courses/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const course = await api.courseBySlug(locale, slug);
  if (!course) notFound();

  const [t, tc, tb, td, tm, ta, courses, branches] = await Promise.all([
    getTranslations({ locale, namespace: "CoursePage" }),
    getTranslations({ locale, namespace: "Courses" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    getTranslations({ locale, namespace: "Directions" }),
    getTranslations({ locale, namespace: "Meta" }),
    getTranslations({ locale, namespace: "Apply" }),
    api.courses(locale),
    api.branches(locale),
  ]);

  const path = `/courses/${slug}`;
  const courseBranches = branches.filter((b) => course.branchIds.includes(b.id));
  const related = courses.filter((c) => c.id !== course.id).slice(0, 3);
  const accent = CATEGORY_ACCENT[course.category];

  const facts = [
    { label: t("duration"), value: tc("months", { count: course.durationMonths }) },
    { label: t("schedule"), value: t("lessonsPerWeek", { count: course.lessonsPerWeek }) },
    { label: t("level"), value: tc(`level.${course.level}`) },
    { label: t("format"), value: t(`formats.${course.format}`) },
  ];

  const jsonLd = [
    courseJsonLd(locale, course, { providerName: tm("siteName"), url: absoluteUrl(localePath(locale, path)) }),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: tb("courses"), path: localePath(locale, "/courses") },
      { name: course.title, path: localePath(locale, path) },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main">
        {/* Hero */}
        <section aria-labelledby="course-title" className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-24">
          <div
            aria-hidden
            className="drift absolute -right-40 -top-40 -z-10 size-[520px] rounded-full opacity-25 blur-3xl"
            style={{ background: accent }}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: tb("home"), href: "/" },
                { label: tb("courses"), href: "/courses" },
                { label: course.title },
              ]}
            />

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <span
                  className="rise inline-block rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink"
                  style={{ background: accent }}
                >
                  {td(course.category)}
                </span>
                <h1
                  id="course-title"
                  className="mt-6 font-display text-[clamp(2.3rem,6vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-balance"
                >
                  {course.title.split(" ").map((word, i, all) => (
                    <span
                      key={i}
                      className="word-in inline-block"
                      style={{ "--d": `${0.05 + i * 0.08}s` } as React.CSSProperties}
                    >
                      {word}
                      {i < all.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
                <p
                  className="rise mt-6 max-w-2xl text-lg leading-relaxed text-chalk/75 sm:text-xl"
                  style={{ "--d": "0.35s" } as React.CSSProperties}
                >
                  {course.description}
                </p>
                <div className="rise mt-9" style={{ "--d": "0.5s" } as React.CSSProperties}>
                  <Magnetic>
                    <a
                      href="#apply"
                      className="inline-flex rounded-full bg-amber px-7 py-4 font-semibold text-ink shadow-[0_10px_40px_-10px_rgba(255,193,94,0.7)] transition-transform hover:-translate-y-0.5"
                    >
                      {t("apply")}
                    </a>
                  </Magnetic>
                </div>
              </div>

              <dl
                className="rise grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-chalk/10"
                style={{ "--d": "0.25s" } as React.CSSProperties}
              >
                {facts.map((f) => (
                  <div key={f.label} className="bg-ink-2 p-5 sm:p-6">
                    <dt className="text-sm text-chalk/55">{f.label}</dt>
                    <dd className="mt-2 font-display text-lg font-bold leading-snug">{f.value}</dd>
                  </div>
                ))}
                <div className="col-span-2 bg-ink-2 p-5 sm:p-6">
                  <dt className="text-sm text-chalk/55">{t("branches")}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {courseBranches.map((b) => (
                      <span key={b.id} className="rounded-full border border-chalk/15 px-3 py-1 text-sm">
                        {b.name}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Curriculum: a real sequence, so the numbers carry meaning */}
        <section aria-labelledby="program-title" className="bg-chalk py-20 text-ink sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <h2 id="program-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t("program")}
              </h2>
            </Reveal>
            <ol className="relative border-l-2 border-ink/15 pl-8">
              {course.modules.map((mod, i) => (
                <li key={mod} className="relative pb-8 last:pb-0">
                  <Reveal delay={i * 0.06}>
                    <span
                      aria-hidden
                      className="absolute -left-[3.05rem] top-0 grid size-9 place-items-center rounded-full font-display text-sm font-bold text-ink ring-4 ring-chalk"
                      style={{ background: accent }}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-1 font-display text-xl font-bold leading-snug">{mod}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Outcomes */}
        <section aria-labelledby="outcomes-title" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <h2 id="outcomes-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t("outcomes")}
              </h2>
            </Reveal>
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {course.outcomes.map((o, i) => (
                <li key={o}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <SpotlightCard
                      className="h-full rounded-3xl border border-chalk/10 bg-ink-2 p-7"
                      spotlightColor="rgba(255, 193, 94, 0.18)"
                    >
                      <svg viewBox="0 0 24 24" className="relative size-8" fill="none" stroke={accent} strokeWidth="2" aria-hidden>
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="relative mt-5 font-display text-xl font-bold leading-snug">{o}</p>
                    </SpotlightCard>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Apply */}
        <section id="apply" aria-labelledby="apply-title" className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal className="rounded-[2rem] border border-chalk/10 bg-ink-2 p-6 sm:p-10">
              <h2 id="apply-title" className="font-display text-3xl font-extrabold tracking-tight">
                {ta("title")}
              </h2>
              <p className="mt-3 text-chalk/65">{ta("lead")}</p>
              <div className="mt-8">
                <ApplyForm
                  courses={courses.map((c) => ({ id: c.id, title: c.title, branchIds: c.branchIds }))}
                  branches={branches}
                  defaultCourseId={course.id}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Related */}
        <section aria-labelledby="related-title" className="border-t border-chalk/10 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-title" className="font-display text-3xl font-extrabold tracking-tight">
                {t("related")}
              </h2>
              <Link href="/courses" className="font-semibold text-amber hover:underline">
                {t("allCourses")}
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((c, i) => (
                <li key={c.id}>
                  <Reveal delay={i * 0.07} className="h-full">
                    <SpotlightCard
                      className="h-full rounded-3xl border border-chalk/10 bg-ink-2 p-7"
                      spotlightColor="rgba(34, 199, 214, 0.2)"
                    >
                      <p className="relative text-sm text-chalk/55">{td(c.category)}</p>
                      <h3 className="relative mt-3 font-display text-xl font-bold">
                        <Link href={`/courses/${c.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {c.title}
                        </Link>
                      </h3>
                      <p className="relative mt-3 text-chalk/65">{c.summary}</p>
                    </SpotlightCard>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
