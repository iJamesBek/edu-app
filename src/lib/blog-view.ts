import "server-only";
import { getFormatter, getTranslations } from "next-intl/server";
import type { PostCardData } from "@/components/blog/PostCard";
import type { Locale } from "@/i18n/routing";
import type { Post } from "./types";

/** Turns posts into card data with dates and labels already localized on the server. */
export async function toCardData(locale: Locale, posts: Post[]): Promise<PostCardData[]> {
  const [t, format] = await Promise.all([
    getTranslations({ locale, namespace: "Blog" }),
    getFormatter({ locale }),
  ]);
  return posts.map((p) => ({
    slug: p.slug,
    category: p.category,
    categoryLabel: t(`categories.${p.category}`),
    title: p.title,
    excerpt: p.excerpt,
    dateIso: p.publishedAt,
    dateLabel: format.dateTime(new Date(p.publishedAt), { dateStyle: "long" }),
    readingLabel: t("readingTime", { count: p.readingMinutes }),
  }));
}

/** Stable, readable id for an in-article heading, used by the table of contents. */
export function headingId(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${index + 1}-${base || "section"}`;
}
