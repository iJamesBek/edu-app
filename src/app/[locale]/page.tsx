import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { courseListJsonLd, jsonLdString, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Courses } from "@/components/Courses";
import { FreeEligibility } from "@/components/FreeEligibility";
import { About } from "@/components/About";
import { WhyUs } from "@/components/WhyUs";
import { Team } from "@/components/Team";
import { Online } from "@/components/Online";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { LatestPosts } from "@/components/LatestPosts";
import { Location } from "@/components/Location";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const [t, courses, branches, stats, teachers, reviews, reviewSummary, posts] = await Promise.all([
    getTranslations({ locale, namespace: "Meta" }),
    api.courses(locale),
    api.branches(locale),
    api.stats(),
    api.teachers(locale),
    api.reviews(locale, 1, 16),
    api.reviewSummary(),
    api.posts(locale),
  ]);

  const jsonLd = [
    organizationJsonLd(locale, { name: t("siteName"), description: t("description"), branch: branches[0] }),
    websiteJsonLd(locale, t("siteName")),
    courseListJsonLd(courses, t("siteName"), locale),
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
        <FreeEligibility />
        <About stats={stats} courses={courses} />
        <WhyUs />
        <Team teachers={teachers} />
        <Online />
        <Reviews items={reviews.items} summary={reviewSummary} />
        <LatestPosts posts={posts} />
        {branches[0] && <Location branch={branches[0]} />}
      </main>
      <Footer />
    </>
  );
}
