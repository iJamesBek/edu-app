import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { courseListJsonLd, jsonLdString, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Courses } from "@/components/Courses";
import { About } from "@/components/About";
import { WhyUs } from "@/components/WhyUs";
import { Team } from "@/components/Team";
import { Online } from "@/components/Online";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const [t, courses, branches, stats, team, testimonials] = await Promise.all([
    getTranslations({ locale, namespace: "Meta" }),
    api.courses(locale),
    api.branches(locale),
    api.stats(),
    api.team(locale),
    api.testimonials(locale),
  ]);

  const jsonLd = [
    organizationJsonLd(locale, { name: t("siteName"), description: t("description") }),
    websiteJsonLd(locale, t("siteName")),
    courseListJsonLd(courses, t("siteName")),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <Header />
      <main id="main">
        <Hero />
        <Courses courses={courses} branches={branches} />
        <About stats={stats} courses={courses} />
        <WhyUs />
        <Team members={team} />
        <Online />
        <Reviews items={testimonials} />
      </main>
      <Footer />
    </>
  );
}
