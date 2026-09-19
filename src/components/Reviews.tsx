import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { toReviewCards } from "@/lib/reviews-view";
import type { Review, ReviewSummary } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";
import { RatingSummary } from "./reviews/RatingSummary";
import { ReviewCard, type ReviewCardData } from "./reviews/ReviewCard";

/** One endless row. The second copy exists only for the seamless loop, so it is hidden from assistive tech. */
function Row({ items, reverse }: { items: ReviewCardData[]; reverse?: boolean }) {
  return (
    <div className="marquee group/row relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="marquee-track gap-5 py-2" style={{ animationDirection: reverse ? "reverse" : "normal", animationDuration: "80s" }}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-5">
            {items.map((r) => (
              <li key={`${copy}-${r.id}`} className="shrink-0">
                <ReviewCard review={r} compact />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Home page reviews: rating summary, two slow rows of recent reviews moving in
 * opposite directions (pause on hover, still on weak devices), link to all reviews.
 * Scales to any number of reviews: only the newest page is loaded here.
 */
export async function Reviews({ items, summary }: { items: Review[]; summary: ReviewSummary }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Reviews");
  const cards = await toReviewCards(locale, items);
  const half = Math.ceil(cards.length / 2);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="overflow-hidden bg-dusk py-20 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-10 px-4 sm:px-6">
        <Reveal>
          <h2 id="reviews-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-chalk/80">{t("lead")}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <RatingSummary summary={summary} tone="on-dusk" />
        </Reveal>
      </div>

      <div className="mt-14 space-y-5">
        <Row items={cards.slice(0, half)} />
        <Row items={cards.slice(half)} reverse />
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/reviews"
          className="inline-flex rounded-full bg-chalk px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          {t("allReviews", { count: summary.count })}
        </Link>
      </div>
    </section>
  );
}
