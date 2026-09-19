import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { CATEGORY_ACCENT } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, courseJsonLd, faqJsonLd, jsonLdString } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ApplyForm } from "@/components/ApplyForm";
import { BranchCard } from "@/components/BranchCard";
import { TeacherCard } from "@/components/TeacherCard";
import { Accordion } from "@/components/ui/Accordion";
import { FloatHeading, StickyApply, ToolsLoop } from "@/components/course/CourseMotion";
import SpotlightCard from "@/components/bits/SpotlightCard";
import StarBorder from "@/components/bits/StarBorder";
import { RatingSummary } from "@/components/reviews/RatingSummary";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { toReviewCards } from "@/lib/reviews-view";
import { Reveal } from "@/motion/Reveal";
import { Magnetic } from "@/motion/Magnetic";

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

const AUDIENCE = ["beginners", "switchers", "students"] as const;
const OFFLINE = ["lab", "mentor", "group", "coworking"] as const;
const FAQ = ["experience", "laptop", "missed", "certificate", "installments"] as const;

const AUDIENCE_ICON: Record<(typeof AUDIENCE)[number], React.ReactNode> = {
  beginners: <path d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2l2.1 2.1m0-11.4l-2.1 2.1M8.4 15.6l-2.1 2.1M12 8a4 4 0 110 8 4 4 0 010-8z" />,
  switchers: <path d="M4 7h13l-3-3m3 3l-3 3M20 17H7l3 3m-3-3l3-3" />,
  students: <path d="M3 8l9-4 9 4-9 4zm4 2v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" />,
};

const OFFLINE_ICON: Record<(typeof OFFLINE)[number], React.ReactNode> = {
  lab: <path d="M4 5h16v10H4zM8 19h8M12 15v4" />,
  mentor: <path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 2.7-5 6-5s6 2 6 5m-2-5c1-.6 2.4-1 4-1 3.3 0 6 2 6 5" />,
  group: <path d="M12 4l8 4-8 4-8-4zm-8 8l8 4 8-4M4 16l8 4 8-4" />,
  coworking: <path d="M4 18h16M6 18V9h12v9M9 9V6h6v3" />,
};

export default async function CoursePage({ params }: PageProps<"/[locale]/courses/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const course = await api.courseBySlug(locale, slug);
  if (!course) notFound();

  const [t, tc, tb, td, tm, ta, tt, tbr, tr, format, courses, branches, teachers, reviewPage, reviewSummary] = await Promise.all([
    getTranslations({ locale, namespace: "CoursePage" }),
    getTranslations({ locale, namespace: "Courses" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    getTranslations({ locale, namespace: "Directions" }),
    getTranslations({ locale, namespace: "Meta" }),
    getTranslations({ locale, namespace: "Apply" }),
    getTranslations({ locale, namespace: "Teachers" }),
    getTranslations({ locale, namespace: "Branches" }),
    getTranslations({ locale, namespace: "Reviews" }),
    getFormatter({ locale }),
    api.courses(locale),
    api.branches(locale),
    api.teachers(locale),
    api.reviews(locale, 1, 3, course.id),
    api.reviewSummary(course.id),
  ]);
  const reviewCards = await toReviewCards(locale, reviewPage.items);

  const path = `/courses/${slug}`;
  const url = absoluteUrl(localePath(locale, path));
  const accent = CATEGORY_ACCENT[course.category];
  const courseBranches = branches.filter((b) => course.branchIds.includes(b.id));
  const courseTeachers = teachers.filter((x) => course.teacherIds.includes(x.id));
  const related = courses.filter((c) => c.id !== course.id && c.category === course.category).slice(0, 3);

  const money = (v: number) => `${formatNumber(Math.round(v / 1000) * 1000, locale)} ${t("currency")}`;
  const total = course.priceMonthly * course.durationMonths;
  const halfTotal = total * 0.95;
  const fullTotal = total * 0.9;
  const startDate = format.dateTime(new Date(course.nextStart), { day: "numeric", month: "long" });

  const facts = [
    { label: t("duration"), value: tc("months", { count: course.durationMonths }) },
    { label: t("schedule"), value: t("scheduleValue", { days: course.lessonsPerWeek, hours: course.hoursPerLesson }) },
    { label: t("groupSize"), value: t("groupValue", { count: course.groupSize }) },
    { label: t("nextStart"), value: startDate },
  ];

  const faq = FAQ.map((k) => ({ q: t(`faq.${k}.q`), a: t(`faq.${k}.a`) }));

  const jsonLd = [
    courseJsonLd(locale, course, {
      providerName: tm("siteName"),
      url,
      instructors: courseTeachers.map((x) => x.name),
      rating: reviewSummary,
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: tb("courses"), path: localePath(locale, "/courses") },
      { name: course.title, path: localePath(locale, path) },
    ]),
  ];

  const plans = [
    { key: "monthly", price: `${money(course.priceMonthly)}`, suffix: t("perMonth"), note: t("months", { count: course.durationMonths }), popular: true },
    { key: "half", price: money(halfTotal / 2), suffix: "× 2", note: t("save", { amount: money(total - halfTotal) }), popular: false },
    { key: "full", price: money(fullTotal), suffix: "", note: t("save", { amount: money(total - fullTotal) }), popular: false },
  ] as const;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main">
        {/* ---------- Hero ---------- */}
        <section id="course-hero" aria-labelledby="course-title" className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-24">
          <div aria-hidden className="drift absolute -right-40 -top-40 -z-10 size-[560px] rounded-full opacity-25 blur-3xl" style={{ background: accent }} />
          <div aria-hidden className="drift absolute -bottom-60 -left-40 -z-10 size-[420px] rounded-full bg-dusk opacity-30 blur-3xl" style={{ "--d": "-4s" } as React.CSSProperties} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: tb("courses"), href: "/courses" }, { label: course.title }]} />

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end">
              <div>
                <div className="rise flex flex-wrap gap-2">
                  <span className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink" style={{ background: accent }}>
                    {td(course.category)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-chalk/20 px-3.5 py-1.5 text-sm font-semibold">
                    <span className="relative flex size-2">
                      <span className="ring absolute inset-0 rounded-full bg-majolica" />
                      <span className="relative size-2 rounded-full bg-majolica" />
                    </span>
                    {t("offline")}
                  </span>
                </div>
                <h1 id="course-title" className="mt-6 font-display text-[clamp(2.2rem,5.6vw,4.4rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-balance">
                  {course.title.split(" ").map((word, i, all) => (
                    <span key={i} className="word-in inline-block" style={{ "--d": `${0.05 + i * 0.06}s` } as React.CSSProperties}>
                      {word}
                      {i < all.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
                <p className="rise mt-6 max-w-2xl text-lg leading-relaxed text-chalk/75 sm:text-xl" style={{ "--d": "0.35s" } as React.CSSProperties}>
                  {course.description}
                </p>
                <div className="rise mt-9 flex flex-wrap items-center gap-4" style={{ "--d": "0.5s" } as React.CSSProperties}>
                  <Magnetic>
                    <StarBorder as="a" href="#apply" color="#ffc15e" speed="5s" backgroundColor="#ffc15e" textColor="#0a0f2c" borderColor="#ffc15e">
                      {t("apply")}
                    </StarBorder>
                  </Magnetic>
                  <p className="text-chalk/70">
                    <span className="font-display text-2xl font-bold text-chalk tabular-nums">{money(course.priceMonthly)}</span> {t("perMonth")}
                  </p>
                </div>
              </div>

              <dl className="rise grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-chalk/10" style={{ "--d": "0.25s" } as React.CSSProperties}>
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
                      <Link key={b.id} href={`/branches/${b.slug}`} className="rounded-full border border-chalk/15 px-3 py-1 text-sm transition-colors hover:border-amber hover:text-amber">
                        {b.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ---------- Audience ---------- */}
        <section aria-labelledby="audience-title" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FloatHeading id="audience-title" text={t("audienceTitle")} className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" />
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {AUDIENCE.map((k, i) => (
                <li key={k}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <SpotlightCard className="h-full rounded-3xl border border-chalk/10 bg-ink-2 p-7" spotlightColor="rgba(34, 199, 214, 0.18)">
                      <svg viewBox="0 0 24 24" className="relative size-10" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {AUDIENCE_ICON[k]}
                      </svg>
                      <h3 className="relative mt-6 font-display text-xl font-bold">{t(`audience.${k}.title`)}</h3>
                      <p className="relative mt-3 leading-relaxed text-chalk/65">{t(`audience.${k}.text`)}</p>
                    </SpotlightCard>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Curriculum ---------- */}
        <section aria-labelledby="program-title" className="bg-chalk py-16 text-ink sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <h2 id="program-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {t("program")}
                </h2>
                <p className="mt-4 text-lg text-ink/65">
                  {tc("months", { count: course.durationMonths })} · {t("topicsCount", { count: course.sections.reduce((n, s) => n + s.topics.length, 0) })}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <Accordion
                tone="light"
                numbered
                defaultOpen={["0"]}
                toggleAll={{ expand: t("expandAll"), collapse: t("collapseAll") }}
                items={course.sections.map((sec, i) => ({
                  id: String(i),
                  kicker: t("sectionLabel", { n: i + 1 }),
                  title: sec.title,
                  meta: t("topicsCount", { count: sec.topics.length }),
                  content: (
                    <ul className="flex flex-wrap gap-2">
                      {sec.topics.map((topic) => (
                        <li key={topic} className="rounded-full bg-ink/6 px-3.5 py-1.5 text-sm font-medium">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ),
                }))}
              />
            </Reveal>
          </div>
        </section>

        {/* ---------- Tools + outcomes ---------- */}
        <section aria-labelledby="tools-title" className="overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FloatHeading id="tools-title" text={t("toolsTitle")} className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" />
          </div>
          <div className="mt-10">
            <ToolsLoop tools={course.tools} label={t("toolsTitle")} />
          </div>
          <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
            <h3 className="font-display text-2xl font-bold">{t("outcomes")}</h3>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {course.outcomes.map((o, i) => (
                <li key={o}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <div className="flex h-full gap-4 rounded-3xl border border-chalk/10 p-6">
                      <svg viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" stroke={accent} strokeWidth="2.2" aria-hidden>
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="font-display text-lg font-bold leading-snug">{o}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Teachers ---------- */}
        {courseTeachers.length > 0 && (
          <section aria-labelledby="teachers-title" className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <FloatHeading id="teachers-title" text={t("teachersTitle")} className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" />
                <Link href="/teachers" className="font-semibold text-amber hover:underline">
                  {tt("back")}
                </Link>
              </div>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courseTeachers.map((x, i) => (
                  <li key={x.id}>
                    <Reveal delay={i * 0.08} className="h-full">
                      <TeacherCard
                        teacher={{ slug: x.slug, name: x.name, role: x.role, skills: x.skills, photo: x.photo, experienceLabel: tt("experience", { count: x.experienceYears }) }}
                      />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---------- Offline format ---------- */}
        <section aria-labelledby="offline-title" className="relative overflow-hidden bg-dusk py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FloatHeading id="offline-title" text={t("offlineTitle")} className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl" />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OFFLINE.map((k, i) => (
                <li key={k}>
                  <Reveal delay={i * 0.07} className="h-full">
                    <div className="h-full rounded-3xl bg-ink/25 p-7 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="size-9 text-amber" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {OFFLINE_ICON[k]}
                      </svg>
                      <h3 className="mt-5 font-display text-lg font-bold">{t(`offlineItems.${k}.title`)}</h3>
                      <p className="mt-2 leading-relaxed text-chalk/80">{t(`offlineItems.${k}.text`)}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Where ---------- */}
        <section aria-labelledby="where-title" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FloatHeading id="where-title" text={t("whereTitle")} className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" />
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courseBranches.map((b, i) => (
                <li key={b.id}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <BranchCard branch={b} labels={{ hours: tbr("hours"), details: t("branchCta") }} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Reviews ---------- */}
        {reviewSummary.count > 0 && (
          <section aria-labelledby="course-reviews" className="bg-dusk py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-wrap items-end justify-between gap-8">
                <FloatHeading id="course-reviews" text={tr("courseReviews")} className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" />
                <RatingSummary summary={reviewSummary} tone="on-dusk" />
              </div>
              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {reviewCards.map((r, i) => (
                  <li key={r.id}>
                    <Reveal delay={i * 0.08} className="h-full">
                      <ReviewCard review={r} />
                    </Reveal>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href={`/reviews?course=${course.slug}`} className="inline-flex rounded-full bg-chalk px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5">
                  {tr("allReviews", { count: reviewSummary.count })}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Pricing ---------- */}
        <section aria-labelledby="pricing-title" className="border-t border-chalk/10 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <FloatHeading id="pricing-title" text={t("pricingTitle")} className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" />
            <p className="mt-3 text-chalk/60">{t("total", { amount: money(total) })}</p>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {plans.map((p, i) => (
                <li key={p.key}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <div
                      className={`relative flex h-full flex-col rounded-3xl p-7 ${
                        p.popular ? "bg-amber text-ink" : "border border-chalk/10 bg-ink-2"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-lg font-bold">{t(`plans.${p.key}`)}</h3>
                        {p.popular && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-amber">{t("popular")}</span>}
                      </div>
                      <p className="mt-6 font-display text-3xl font-extrabold tabular-nums">
                        {p.price} <span className="text-base font-bold opacity-70">{p.suffix}</span>
                      </p>
                      <p className={`mt-2 text-sm ${p.popular ? "text-ink/70" : "text-chalk/60"}`}>{p.note}</p>
                      <a
                        href="#apply"
                        className={`mt-8 rounded-full px-6 py-3.5 text-center font-semibold transition-transform hover:-translate-y-0.5 ${
                          p.popular ? "bg-ink text-chalk" : "bg-chalk/10"
                        }`}
                      >
                        {t("apply")}
                      </a>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section aria-labelledby="faq-title" className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <Reveal>
              <h2 id="faq-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t("faqTitle")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Accordion items={faq.map((f, i) => ({ id: String(i), title: f.q, content: <p className="leading-relaxed text-chalk/75">{f.a}</p> }))} />
            </Reveal>
          </div>
        </section>

        {/* ---------- Apply ---------- */}
        <section id="apply" aria-labelledby="apply-title" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal className="rounded-[2rem] border border-chalk/10 bg-ink-2 p-6 sm:p-10">
              <h2 id="apply-title" className="font-display text-3xl font-extrabold tracking-tight text-balance">
                {t("finalTitle")}
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

        {/* ---------- Related ---------- */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className="border-t border-chalk/10 py-16 sm:py-20">
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
                      <SpotlightCard className="h-full rounded-3xl border border-chalk/10 bg-ink-2 p-7" spotlightColor="rgba(34, 199, 214, 0.2)">
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
        )}
      </main>
      <StickyApply price={`${money(course.priceMonthly)} ${t("perMonth")}`} cta={t("mobileCta")} heroId="course-hero" formId="apply" />
      <Footer />
    </>
  );
}
