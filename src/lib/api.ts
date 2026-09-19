import "server-only";
import { cache } from "react";
import { mockSource } from "./mock";
import type {
  Branch,
  Course,
  DataSource,
  Locale,
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

export const api = { branches, courses, team, testimonials, stats };
