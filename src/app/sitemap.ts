import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates, localePath } from "@/lib/site";

/** Add every new public page here. */
const PAGES = [{ path: "/", priority: 1, changeFrequency: "weekly" as const }];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, page.path)),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languageAlternates(page.path === "/" ? "/" : page.path) },
    })),
  );
}
