import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { api } from "@/lib/api";
import { absoluteUrl, languageAlternates, localePath } from "@/lib/site";

type Entry = { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" };

/** Every public page goes here. Course pages come from the data source. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await api.courseSlugs();
  const pages: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
    ...slugs.map((slug) => ({ path: `/courses/${slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
  ];

  const lastModified = new Date();
  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, page.path)),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languageAlternates(page.path) },
    })),
  );
}
