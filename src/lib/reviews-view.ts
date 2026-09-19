import "server-only";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReviewCardData } from "@/components/reviews/ReviewCard";
import type { Locale } from "@/i18n/routing";
import type { Review } from "./types";

/** Review card data with date and rating label localized on the server. */
export async function toReviewCards(locale: Locale, reviews: Review[]): Promise<ReviewCardData[]> {
  const [t, format] = await Promise.all([getTranslations({ locale, namespace: "Reviews" }), getFormatter({ locale })]);
  return reviews.map((r) => ({
    id: r.id,
    author: r.author,
    rating: r.rating,
    ratingLabel: t("stars", { rating: r.rating }),
    dateIso: r.date,
    dateLabel: format.dateTime(new Date(r.date), { day: "numeric", month: "short", year: "numeric" }),
    text: r.text,
    lang: r.lang,
    course: r.course ? { slug: r.course.slug, title: r.course.title } : null,
  }));
}
