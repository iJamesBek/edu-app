import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, courseListJsonLd, jsonLdString } from "@/lib/seo";
import { localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Courses } from "@/components/Courses";
import { ApplyForm } from "@/components/ApplyForm";
import { Reveal } from "@/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/courses">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "CoursesPage" });
  return pageMetadata({ locale, path: "/courses", title: t("metaTitle"), description: t("description") });
}

export default async function CoursesPage({ params }: PageProps<"/[locale]/courses">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const [t, tb, tm, ta, courses, branches] = await Promise.all([
    getTranslations({ locale, namespace: "CoursesPage" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    getTranslations({ locale, namespace: "Meta" }),
    getTranslations({ locale, namespace: "Apply" }),
    api.courses(locale),
    api.branches(locale),
  ]);

  const jsonLd = [
    courseListJsonLd(courses, tm("siteName"), locale),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: t("title"), path: localePath(locale, "/courses") },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: t("title") }]} />
        </div>
        <Courses courses={courses} branches={branches} headingLevel={1} />

        <section id="apply" aria-labelledby="apply-title" className="pb-24">
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
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
