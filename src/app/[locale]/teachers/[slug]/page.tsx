import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { CATEGORY_ACCENT } from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdString, personJsonLd } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TeacherCard } from "@/components/TeacherCard";
import { TeacherHeroAvatar } from "@/components/TeacherHeroAvatar";
import { TeacherPhoto } from "@/components/ui/TeacherPhoto";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { CountUp } from "@/motion/CountUp";
import { Reveal } from "@/motion/Reveal";

export async function generateStaticParams() {
  return (await api.teacherSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/teachers/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const teacher = await api.teacherBySlug(locale, slug);
  if (!teacher) return {};
  return pageMetadata({ locale, path: `/teachers/${slug}`, title: `${teacher.name} — ${teacher.role}`, description: teacher.bio });
}

export default async function TeacherPage({ params }: PageProps<"/[locale]/teachers/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const teacher = await api.teacherBySlug(locale, slug);
  if (!teacher) notFound();

  const [t, tb, td, courses, all] = await Promise.all([
    getTranslations({ locale, namespace: "Teachers" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    getTranslations({ locale, namespace: "Directions" }),
    api.coursesByTeacher(locale, teacher.id),
    api.teachers(locale),
  ]);

  const path = `/teachers/${slug}`;
  const url = absoluteUrl(localePath(locale, path));
  const others = all.filter((x) => x.id !== teacher.id).slice(0, 3);
  const ring = `${teacher.name} • ${teacher.role} • `.toUpperCase();

  const jsonLd = [
    personJsonLd(teacher, { url, courses: courses.map((c) => c.title) }),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: tb("teachers"), path: localePath(locale, "/teachers") },
      { name: teacher.name, path: localePath(locale, path) },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main">
        <section aria-labelledby="teacher-name" className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-24">
          <div aria-hidden className="drift absolute -left-40 top-10 -z-10 size-[500px] rounded-full bg-dusk opacity-30 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: tb("teachers"), href: "/teachers" }, { label: teacher.name }]} />
            <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
              <div className="rise order-first lg:order-last">
                <TeacherHeroAvatar ringText={ring}>
                  <TeacherPhoto name={teacher.name} photo={teacher.photo} sizes="300px" priority className="size-full" textClassName="text-7xl" />
                </TeacherHeroAvatar>
              </div>
              <div>
                <p className="rise text-amber">{teacher.role}</p>
                <h1 id="teacher-name" className="mt-3 font-display text-[clamp(2.4rem,6vw,4.8rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
                  {teacher.name.split(" ").map((word, i, arr) => (
                    <span key={i} className="word-in inline-block" style={{ "--d": `${0.05 + i * 0.1}s` } as React.CSSProperties}>
                      {word}
                      {i < arr.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
                <blockquote className="rise mt-6 border-l-4 border-amber pl-5 font-display text-xl leading-snug text-chalk/85 sm:text-2xl" style={{ "--d": "0.3s" } as React.CSSProperties}>
                  “{teacher.motto}”
                </blockquote>
                <dl className="rise mt-10 grid max-w-md grid-cols-2 gap-6" style={{ "--d": "0.4s" } as React.CSSProperties}>
                  <div className="flex flex-col-reverse border-t-2 border-chalk/20 pt-3">
                    <dt className="mt-1 text-chalk/60">{t("years")}</dt>
                    <dd>
                      <CountUp value={teacher.experienceYears} className="block font-display text-5xl font-extrabold tabular-nums" />
                    </dd>
                  </div>
                  <div className="flex flex-col-reverse border-t-2 border-chalk/20 pt-3">
                    <dt className="mt-1 text-chalk/60">{t("studentsLabel")}</dt>
                    <dd>
                      <CountUp value={teacher.studentsTaught} suffix="+" className="block font-display text-5xl font-extrabold tabular-nums" />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="about-teacher" className="bg-chalk py-16 text-ink sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <h2 id="about-teacher" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("about")}
              </h2>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed">{teacher.bio}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-xl font-bold">{t("skills")}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {teacher.skills.map((s) => (
                  <li key={s} className="rounded-full bg-ink px-4 py-2 font-medium text-chalk">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {courses.length > 0 && (
          <section aria-labelledby="teacher-courses" className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <Reveal>
                <h2 id="teacher-courses" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t("courses")}
                </h2>
              </Reveal>
              <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((c, i) => (
                  <li key={c.id}>
                    <Reveal delay={i * 0.08} className="h-full">
                      <SpotlightCard className="h-full rounded-3xl border border-chalk/10 bg-ink-2 p-7" spotlightColor="rgba(34, 199, 214, 0.2)">
                        <span className="relative inline-block rounded-full px-3 py-1 text-xs font-semibold text-ink" style={{ background: CATEGORY_ACCENT[c.category] }}>
                          {td(c.category)}
                        </span>
                        <h3 className="relative mt-4 font-display text-xl font-bold leading-snug">
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

        <section aria-labelledby="other-teachers" className="border-t border-chalk/10 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="other-teachers" className="font-display text-3xl font-extrabold tracking-tight">
                {t("others")}
              </h2>
              <Link href="/teachers" className="font-semibold text-amber hover:underline">
                {t("back")}
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((x, i) => (
                <li key={x.id}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <TeacherCard teacher={{ slug: x.slug, name: x.name, role: x.role, skills: x.skills, photo: x.photo, experienceLabel: t("experience", { count: x.experienceYears }) }} />
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
