import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";
import { branchJsonLd, breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BranchCard } from "@/components/BranchCard";
import { Reveal } from "@/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/branches">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Branches" });
  return pageMetadata({ locale, path: "/branches", title: t("metaTitle"), description: t("description") });
}

export default async function BranchesPage({ params }: PageProps<"/[locale]/branches">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const [t, tb, branches, courses] = await Promise.all([
    getTranslations({ locale, namespace: "Branches" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    api.branches(locale),
    api.courses(locale),
  ]);

  const jsonLd = [
    ...branches.map((b) => branchJsonLd(b, { url: absoluteUrl(localePath(locale, `/branches/${b.slug}`)), name: `IT Shaharcha — ${b.name}` })),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: t("title"), path: localePath(locale, "/branches") },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main" className="pb-24">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: t("title") }]} />
          <Reveal className="mt-8">
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">{t("title")}</h1>
            <p className="mt-4 max-w-xl text-lg text-chalk/70">{t("lead")}</p>
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((b, i) => {
              const count = courses.filter((c) => c.branchIds.includes(b.id)).length;
              return (
                <li key={b.id}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <BranchCard
                      branch={b}
                      labels={{ hours: t("hours"), details: t("details") }}
                      meta={`${t("rooms", { count: b.classrooms })} · ${t("seats", { count: b.seats })} · ${count} ${tb("courses").toLowerCase()}`}
                    />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
