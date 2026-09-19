import "server-only";
import { cache } from "react";
import { mockSource } from "./mock";
import type {
  ApplicationInput,
  ApplicationResult,
  Branch,
  Course,
  CourseDetail,
  Block,
  DataSource,
  Locale,
  Post,
  PostDetail,
  RawPost,
  Stats,
  TeamMember,
  Testimonial,
} from "./types";

/**
 * Data access layer. Pages and components call `api.*` and never care where
 * the data comes from.
 *
 * Switching from mock to a real backend:
 *   1. Set EDU_API_URL (see .env.example).
 *   2. If the backend's JSON differs from the Raw* types in ./types, map it
 *      inside `httpSource` below. Nothing else changes.
 */

const REVALIDATE_SECONDS = 60 * 60;

function httpSource(baseUrl: string): DataSource {
  const root = baseUrl.replace(/\/$/, "");

  async function get<T>(path: string, tag: string): Promise<T> {
    const res = await fetch(`${root}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
    });
    if (!res.ok) {
      throw new Error(`EDU API ${path} responded ${res.status}`);
    }
    return (await res.json()) as T;
  }

  return {
    branches: () => get("/branches", "branches"),
    courses: () => get("/courses", "courses"),
    team: () => get("/team", "team"),
    testimonials: () => get("/testimonials", "testimonials"),
    stats: () => get("/stats", "stats"),
    posts: () => get("/posts", "posts"),
    async submitApplication(input) {
      const res = await fetch(`${root}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(input),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`EDU API /applications responded ${res.status}`);
      return (await res.json()) as ApplicationResult;
    },
  };
}

const source: DataSource = process.env.EDU_API_URL
  ? httpSource(process.env.EDU_API_URL)
  : mockSource;

export const dataSourceName = process.env.EDU_API_URL ? "http" : "mock";

/* Each call is deduplicated per request via React cache(). */

const branches = cache(async (locale: Locale): Promise<Branch[]> =>
  (await source.branches()).map((b) => ({ id: b.id, name: b.name[locale] })),
);

const courses = cache(async (locale: Locale): Promise<Course[]> =>
  (await source.courses()).map((c) => ({
    id: c.id,
    slug: c.slug,
    category: c.category,
    title: c.title[locale],
    summary: c.summary[locale],
    durationMonths: c.durationMonths,
    level: c.level,
    branchIds: c.branchIds,
  })),
);

const courseBySlug = cache(async (locale: Locale, slug: string): Promise<CourseDetail | null> => {
  const c = (await source.courses()).find((x) => x.slug === slug);
  if (!c) return null;
  return {
    id: c.id,
    slug: c.slug,
    category: c.category,
    title: c.title[locale],
    summary: c.summary[locale],
    description: c.description[locale],
    durationMonths: c.durationMonths,
    lessonsPerWeek: c.lessonsPerWeek,
    level: c.level,
    format: c.format,
    branchIds: c.branchIds,
    modules: c.modules.map((m) => m[locale]),
    outcomes: c.outcomes.map((o) => o[locale]),
  };
});

/** Locale-independent list of slugs, for generateStaticParams and the sitemap. */
const courseSlugs = cache(async (): Promise<string[]> => (await source.courses()).map((c) => c.slug));

const team = cache(async (locale: Locale): Promise<TeamMember[]> =>
  (await source.team()).map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role[locale],
  })),
);

const testimonials = cache(async (locale: Locale): Promise<Testimonial[]> =>
  (await source.testimonials()).map((t) => ({
    id: t.id,
    author: t.author,
    course: t.course[locale],
    quote: t.quote[locale],
  })),
);

const stats = cache(async (): Promise<Stats> => source.stats());

/* ---------- Blog ---------- */

function wordsIn(blocks: Block[]): number {
  const text = blocks
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.text))
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

function toPost(p: RawPost, locale: Locale): Post {
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    title: p.title[locale],
    excerpt: p.excerpt[locale],
    author: { name: p.author.name, role: p.author.role[locale] },
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    // ~180 words a minute, never below 1
    readingMinutes: Math.max(1, Math.round(wordsIn(p.body[locale]) / 180)),
    courseSlug: p.courseSlug,
  };
}

const byNewest = (a: RawPost, b: RawPost) => b.publishedAt.localeCompare(a.publishedAt);

/** Newest first. */
const posts = cache(async (locale: Locale): Promise<Post[]> =>
  [...(await source.posts())].sort(byNewest).map((p) => toPost(p, locale)),
);

const postBySlug = cache(async (locale: Locale, slug: string): Promise<PostDetail | null> => {
  const p = (await source.posts()).find((x) => x.slug === slug);
  return p ? { ...toPost(p, locale), body: p.body[locale] } : null;
});

const postSlugs = cache(async () =>
  (await source.posts()).map((p) => ({ slug: p.slug, lastModified: p.updatedAt ?? p.publishedAt })),
);

/** Not cached: every call is a new submission. */
function submitApplication(input: ApplicationInput): Promise<ApplicationResult> {
  return source.submitApplication(input);
}

export const api = {
  branches,
  courses,
  courseBySlug,
  courseSlugs,
  team,
  testimonials,
  stats,
  posts,
  postBySlug,
  postSlugs,
  submitApplication,
};
