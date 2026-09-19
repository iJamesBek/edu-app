import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { api } from "@/lib/api";
import { absoluteUrl, languageAlternates, localePath } from "@/lib/site";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  lastModified?: string;
};

/** Every public page goes here. Course pages come from the data source. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, posts, teachers, branches] = await Promise.all([
    api.courseSlugs(),
    api.postSlugs(),
    api.teacherSlugs(),
    api.branchSlugs(),
  ]);
  const pages: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
    ...slugs.map((slug) => ({ path: `/courses/${slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    { path: "/teachers", priority: 0.7, changeFrequency: "monthly" },
    ...teachers.map((slug) => ({ path: `/teachers/${slug}`, priority: 0.6, changeFrequency: "monthly" as const })),
    { path: "/branches", priority: 0.8, changeFrequency: "monthly" },
    ...branches.map((slug) => ({ path: `/branches/${slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: p.lastModified,
    })),
  ];

  const now = new Date();
  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, page.path)),
      lastModified: page.lastModified ? new Date(page.lastModified) : now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languageAlternates(page.path) },
    })),
  );
}
