import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { CATEGORY_ACCENT } from "@/lib/categories";
import { pageMetadata } from "@/lib/metadata";
import { branchJsonLd, breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatPhone } from "@/components/BranchCard";
import { MapEmbed } from "@/components/MapEmbed";
import { TeacherCard } from "@/components/TeacherCard";
import { CountUp } from "@/motion/CountUp";
import { Reveal } from "@/motion/Reveal";
import { Magnetic } from "@/motion/Magnetic";

export async function generateStaticParams() {
  return (await api.branchSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/branches/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const branch = await api.branchBySlug(locale, slug);
  if (!branch) return {};
  return pageMetadata({ locale, path: `/branches/${slug}`, title: branch.name, description: `${branch.address}. ${branch.hours}.` });
}

export default async function BranchPage({ params }: PageProps<"/[locale]/branches/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const branch = await api.branchBySlug(locale, slug);
  if (!branch) notFound();

  const [t, tb, td, tt, courses, teachers] = await Promise.all([
    getTranslations({ locale, namespace: "Branches" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    getTranslations({ locale, namespace: "Directions" }),
    getTranslations({ locale, namespace: "Teachers" }),
    api.courses(locale),
    api.teachers(locale),
  ]);

  const path = `/branches/${slug}`;
  const url = absoluteUrl(localePath(locale, path));
  const here = courses.filter((c) => c.branchIds.includes(branch.id));
  const staff = teachers.filter((x) => x.branchIds.includes(branch.id));

  const jsonLd = [
    branchJsonLd(branch, { url, name: `IT Shaharcha — ${branch.name}` }),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: tb("branches"), path: localePath(locale, "/branches") },
      { name: branch.name, path: localePath(locale, path) },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main">
        <section aria-labelledby="branch-title" className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-24">
          <div aria-hidden className="drift absolute -right-32 top-0 -z-10 size-[480px] rounded-full bg-majolica opacity-20 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: tb("branches"), href: "/branches" }, { label: branch.name }]} />
            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
              <div>
                <h1 id="branch-title" className="font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
                  {branch.name.split(" ").map((word, i, arr) => (
                    <span key={i} className="word-in inline-block" style={{ "--d": `${0.05 + i * 0.1}s` } as React.CSSProperties}>
                      {word}
                      {i < arr.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
                <dl className="rise mt-8 space-y-5" style={{ "--d": "0.25s" } as React.CSSProperties}>
                  <div>
                    <dt className="text-sm text-chalk/55">{t("address")}</dt>
                    <dd className="mt-1 text-xl leading-snug">{branch.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-chalk/55">{t("hours")}</dt>
                    <dd className="mt-1 text-xl">{branch.hours}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-chalk/55">{t("phone")}</dt>
                    <dd className="mt-1 text-xl tabular-nums">{formatPhone(branch.phone)}</dd>
                  </div>
                </dl>
                <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--d": "0.4s" } as React.CSSProperties}>
                  <Magnetic>
                    <a href={`tel:${branch.phone}`} className="inline-flex rounded-full bg-amber px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5">
                      {t("call")}
                    </a>
                  </Magnetic>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-chalk/25 px-7 py-4 font-semibold transition-colors hover:border-majolica hover:text-majolica"
                  >
                    {t("openMap")}
                  </a>
                </div>
                <dl className="rise mt-10 grid max-w-sm grid-cols-2 gap-6" style={{ "--d": "0.5s" } as React.CSSProperties}>
                  <div className="flex flex-col-reverse border-t-2 border-chalk/20 pt-3">
                    <dt className="mt-1 text-sm text-chalk/60">{t("roomsLabel")}</dt>
                    <dd><CountUp value={branch.classrooms} className="block font-display text-4xl font-extrabold" /></dd>
                  </div>
                  <div className="flex flex-col-reverse border-t-2 border-chalk/20 pt-3">
                    <dt className="mt-1 text-sm text-chalk/60">{t("seatsLabel")}</dt>
                    <dd><CountUp value={branch.seats} className="block font-display text-4xl font-extrabold" /></dd>
                  </div>
                </dl>
              </div>
              <div className="rise" style={{ "--d": "0.2s" } as React.CSSProperties}>
                <MapEmbed
                  query={branch.address}
                  title={t("mapTitle", { name: branch.name })}
                  labels={{ load: t("loadMap"), note: t("mapNote"), open: t("openMap") }}
                />
              </div>
            </div>
          </div>
        </section>

        {here.length > 0 && (
          <section aria-labelledby="branch-courses" className="bg-chalk py-16 text-ink sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <Reveal>
                <h2 id="branch-courses" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t("courses")}
                </h2>
              </Reveal>
              <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {here.map((c, i) => (
                  <li key={c.id}>
                    <Reveal delay={(i % 3) * 0.08} className="h-full">
                      <article className="relative flex h-full flex-col rounded-3xl bg-white p-7 transition-transform duration-300 hover:-translate-y-1">
                        <span className="inline-block self-start rounded-full px-3 py-1 text-xs font-semibold" style={{ background: CATEGORY_ACCENT[c.category] }}>
                          {td(c.category)}
                        </span>
                        <h3 className="mt-4 font-display text-xl font-bold leading-snug">
                          <Link href={`/courses/${c.slug}`} className="after:absolute after:inset-0 after:content-['']">
                            {c.title}
                          </Link>
                        </h3>
                        <p className="mt-3 text-ink/65">{c.summary}</p>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {staff.length > 0 && (
          <section aria-labelledby="branch-teachers" className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <Reveal>
                <h2 id="branch-teachers" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t("teachers")}
                </h2>
              </Reveal>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {staff.map((x, i) => (
                  <li key={x.id}>
                    <Reveal delay={(i % 4) * 0.08} className="h-full">
                      <TeacherCard teacher={{ slug: x.slug, name: x.name, role: x.role, skills: x.skills, photo: x.photo, experienceLabel: tt("experience", { count: x.experienceYears }) }} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <div className="border-t border-chalk/10 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Link href="/branches" className="font-semibold text-amber hover:underline">
              {t("back")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
