import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TeacherCard } from "@/components/TeacherCard";
import { Reveal } from "@/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/teachers">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Teachers" });
  return pageMetadata({ locale, path: "/teachers", title: t("metaTitle"), description: t("description") });
}

export default async function TeachersPage({ params }: PageProps<"/[locale]/teachers">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const [t, tb, teachers] = await Promise.all([
    getTranslations({ locale, namespace: "Teachers" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    api.teachers(locale),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: teachers.map((x, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(localePath(locale, `/teachers/${x.slug}`)),
        name: x.name,
      })),
    },
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: t("title"), path: localePath(locale, "/teachers") },
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
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((x, i) => (
              <li key={x.id}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <TeacherCard
                    teacher={{ slug: x.slug, name: x.name, role: x.role, skills: x.skills, photo: x.photo, experienceLabel: t("experience", { count: x.experienceYears }) }}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
