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
  RawBranch,
  RawTeacher,
  Teacher,
  Review,
  ReviewPage,
  ReviewSummary,
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
    teachers: () => get("/teachers", "teachers"),
    reviews: ({ courseId, page, perPage }) =>
      get(`/reviews?page=${page}&per_page=${perPage}${courseId ? `&course=${encodeURIComponent(courseId)}` : ""}`, "reviews"),
    reviewSummary: (courseId) => get(`/reviews/summary${courseId ? `?course=${encodeURIComponent(courseId)}` : ""}`, "reviews"),
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

function toBranch(b: RawBranch, locale: Locale): Branch {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name[locale],
    address: b.address[locale],
    landmark: b.landmark?.[locale],
    phone: b.phone,
    openingHours: b.openingHours,
    hours: b.hours[locale],
    classrooms: b.classrooms,
    seats: b.seats,
  };
}

const branches = cache(async (locale: Locale): Promise<Branch[]> =>
  (await source.branches()).map((b) => toBranch(b, locale)),
);

const branchBySlug = cache(async (locale: Locale, slug: string): Promise<Branch | null> => {
  const b = (await source.branches()).find((x) => x.slug === slug);
  return b ? toBranch(b, locale) : null;
});

const branchSlugs = cache(async () => (await source.branches()).map((b) => b.slug));

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
    teacherIds: c.teacherIds,
    nextStart: c.nextStart,
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
    sections: c.sections.map((sec) => ({ title: sec.title[locale], topics: sec.topics })),
    outcomes: c.outcomes.map((o) => o[locale]),
    tools: c.tools,
    teacherIds: c.teacherIds,
    hoursPerLesson: c.hoursPerLesson,
    groupSize: c.groupSize,
    freeFor: c.freeFor,
    nextStart: c.nextStart,
  };
});

/** Locale-independent list of slugs, for generateStaticParams and the sitemap. */
const courseSlugs = cache(async (): Promise<string[]> => (await source.courses()).map((c) => c.slug));

function toTeacher(t: RawTeacher, locale: Locale): Teacher {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    role: t.role[locale],
    bio: t.bio[locale],
    motto: t.motto[locale],
    experienceYears: t.experienceYears,
    studentsTaught: t.studentsTaught,
    skills: t.skills,
    branchIds: t.branchIds,
    photo: t.photo,
  };
}

const teachers = cache(async (locale: Locale): Promise<Teacher[]> =>
  (await source.teachers()).map((t) => toTeacher(t, locale)),
);

const teacherBySlug = cache(async (locale: Locale, slug: string): Promise<Teacher | null> => {
  const t = (await source.teachers()).find((x) => x.slug === slug);
  return t ? toTeacher(t, locale) : null;
});

const teacherSlugs = cache(async () => (await source.teachers()).map((t) => t.slug));

/** Courses a teacher leads (courses list their teachers, not the other way round). */
const coursesByTeacher = cache(async (locale: Locale, teacherId: string): Promise<Course[]> =>
  (await courses(locale)).filter((c) => c.teacherIds.includes(teacherId)),
);

const reviews = cache(
  async (locale: Locale, page = 1, perPage = 12, courseId?: string): Promise<ReviewPage> => {
    const [{ items, total }, raw] = await Promise.all([
      source.reviews({ courseId, page, perPage }),
      source.courses(),
    ]);
    const byId = new Map(raw.map((c) => [c.id, c]));
    return {
      items: items.map((r): Review => {
        const c = byId.get(r.courseId);
        return {
          id: r.id,
          author: r.author,
          rating: r.rating,
          date: r.date,
          text: r.text,
          lang: r.lang,
          course: c ? { id: c.id, slug: c.slug, title: c.title[locale] } : null,
        };
      }),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / perPage)),
    };
  },
);

const reviewSummary = cache((courseId?: string): Promise<ReviewSummary> => source.reviewSummary(courseId));

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
  branchBySlug,
  branchSlugs,
  teachers,
  teacherBySlug,
  teacherSlugs,
  coursesByTeacher,
  courses,
  courseBySlug,
  courseSlugs,
  reviews,
  reviewSummary,
  stats,
  posts,
  postBySlug,
  postSlugs,
  submitApplication,
};
