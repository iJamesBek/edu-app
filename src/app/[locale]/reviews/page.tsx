import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";
import { toReviewCards } from "@/lib/reviews-view";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RatingSummary } from "@/components/reviews/RatingSummary";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Reveal } from "@/motion/Reveal";

const PER_PAGE = 12;

type Search = { course?: string; page?: string };

function parse(sp: Search) {
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  return { courseSlug: sp.course, page };
}

function href(courseSlug: string | undefined, page: number) {
  const q = new URLSearchParams();
  if (courseSlug) q.set("course", courseSlug);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/reviews?${s}` : "/reviews";
}

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/reviews">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { courseSlug, page } = parse((await searchParams) as Search);
  const t = await getTranslations({ locale, namespace: "Reviews" });
  const base = pageMetadata({ locale, path: "/reviews", title: t("metaTitle"), description: t("description") });
  // Filtered and paginated views canonicalize to themselves; hreflang stays on the base page.
  const self = href(courseSlug, page);
  return self === "/reviews" ? base : { ...base, alternates: { ...base.alternates, canonical: localePath(locale, self) } };
}

export default async function ReviewsPage({ params, searchParams }: PageProps<"/[locale]/reviews">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { courseSlug, page } = parse((await searchParams) as Search);

  const [t, tb, courses] = await Promise.all([
    getTranslations({ locale, namespace: "Reviews" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    api.courses(locale),
  ]);
  const course = courseSlug ? courses.find((c) => c.slug === courseSlug) : undefined;
  const [result, summary] = await Promise.all([
    api.reviews(locale, page, PER_PAGE, course?.id),
    api.reviewSummary(course?.id),
  ]);
  const cards = await toReviewCards(locale, result.items);

  const jsonLd = breadcrumbJsonLd([
    { name: tb("home"), path: localePath(locale, "/") },
    { name: t("title"), path: localePath(locale, "/reviews") },
  ]);

  const chip = (active: boolean) =>
    `inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? "bg-chalk text-ink" : "bg-chalk/8 text-chalk/75 hover:bg-chalk/15 hover:text-chalk"
    }`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main" className="pb-24">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: t("title") }]} />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-10">
            <Reveal>
              <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">{t("title")}</h1>
              <p className="mt-4 max-w-xl text-lg text-chalk/70">{course ? course.title : t("lead")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <RatingSummary summary={summary} />
            </Reveal>
          </div>

          <nav aria-label={t("filter")} className="no-scrollbar -mx-4 mt-12 overflow-x-auto px-4">
            <ul className="flex gap-2">
              <li>
                <Link href="/reviews" className={chip(!course)} aria-current={!course ? "page" : undefined}>
                  {t("all")}
                </Link>
              </li>
              {courses.map((c) => (
                <li key={c.id}>
                  <Link href={href(c.slug, 1)} className={chip(course?.id === c.id)} aria-current={course?.id === c.id ? "page" : undefined}>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {cards.length === 0 ? (
            <p className="mt-12 text-chalk/60">{t("empty")}</p>
          ) : (
            <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
              {cards.map((r, i) => (
                <li key={r.id} className="mb-5 break-inside-avoid">
                  <Reveal delay={(i % 3) * 0.06}>
                    <ReviewCard review={r} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          {result.pages > 1 && (
            <nav aria-label={t("pagination")} className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {page > 1 && (
                <Link href={href(courseSlug, page - 1)} rel="prev" className="rounded-full border border-chalk/20 px-5 py-2.5 text-sm font-semibold hover:border-amber hover:text-amber">
                  {t("prev")}
                </Link>
              )}
              {Array.from({ length: result.pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === result.pages || Math.abs(n - page) <= 1)
                .map((n, i, arr) => (
                  <span key={n} className="flex items-center gap-2">
                    {i > 0 && n - arr[i - 1] > 1 && <span className="text-chalk/40">…</span>}
                    <Link
                      href={href(courseSlug, n)}
                      aria-current={n === page ? "page" : undefined}
                      className={`grid size-10 place-items-center rounded-full text-sm font-semibold tabular-nums ${
                        n === page ? "bg-amber text-ink" : "bg-chalk/8 hover:bg-chalk/15"
                      }`}
                    >
                      {n}
                    </Link>
                  </span>
                ))}
              {page < result.pages && (
                <Link href={href(courseSlug, page + 1)} rel="next" className="rounded-full border border-chalk/20 px-5 py-2.5 text-sm font-semibold hover:border-amber hover:text-amber">
                  {t("next")}
                </Link>
              )}
              <p className="sr-only" aria-live="polite">
                {t("pageOf", { page, pages: result.pages })}
              </p>
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
