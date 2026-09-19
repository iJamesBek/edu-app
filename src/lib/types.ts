import type { Locale } from "@/i18n/routing";

export type { Locale };

/** A string translated into every supported locale (raw shape from a data source). */
export type Localized = Record<Locale, string>;

export type Category = "programming" | "design" | "robotics" | "languages" | "office";

export type Level = "beginner" | "intermediate";

/* ---------- Raw shapes: what a DataSource returns ---------- */

export interface RawBranch {
  id: string;
  name: Localized;
}

export type Format = "offline" | "online" | "hybrid";

export interface RawCourse {
  id: string;
  /** English, URL-safe, stable: used in /courses/<slug> for every locale. */
  slug: string;
  category: Category;
  title: Localized;
  summary: Localized;
  description: Localized;
  durationMonths: number;
  lessonsPerWeek: number;
  level: Level;
  format: Format;
  branchIds: string[];
  modules: Localized[];
  outcomes: Localized[];
}

export type BlogCategory = "guides" | "news" | "stories" | "events";

/** Rich text as typed blocks: safe to render (no HTML injection) and easy for a CMS to emit. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export interface RawPost {
  id: string;
  /** English, URL-safe, stable: used in /blog/<slug> for every locale. */
  slug: string;
  category: BlogCategory;
  title: Localized;
  excerpt: Localized;
  body: Record<Locale, Block[]>;
  author: { name: string; role: Localized };
  /** ISO 8601 */
  publishedAt: string;
  updatedAt?: string;
  /** Optional course the post leads to (its slug). */
  courseSlug?: string;
}

export interface RawTeamMember {
  id: string;
  name: string;
  role: Localized;
}

export interface RawTestimonial {
  id: string;
  author: string;
  course: Localized;
  quote: Localized;
}

export interface Stats {
  students: number;
  mentors: number;
  directions: number;
  branches: number;
}

/* ---------- Resolved shapes: what pages and components receive ---------- */

export interface Branch {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  slug: string;
  category: Category;
  title: string;
  summary: string;
  durationMonths: number;
  level: Level;
  branchIds: string[];
}

export interface CourseDetail extends Course {
  description: string;
  lessonsPerWeek: number;
  format: Format;
  modules: string[];
  outcomes: string[];
}

export interface Post {
  id: string;
  slug: string;
  category: BlogCategory;
  title: string;
  excerpt: string;
  author: { name: string; role: string };
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  courseSlug?: string;
}

export interface PostDetail extends Post {
  body: Block[];
}

/** What the enrollment form sends. */
export interface ApplicationInput {
  name: string;
  phone: string;
  courseId: string;
  branchId?: string;
  locale: Locale;
}

export interface ApplicationResult {
  id: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface Testimonial {
  id: string;
  author: string;
  course: string;
  quote: string;
}

/**
 * The single seam between the UI and wherever data lives.
 * Implement this against the real backend and the UI does not change.
 */
export interface DataSource {
  branches(): Promise<RawBranch[]>;
  courses(): Promise<RawCourse[]>;
  team(): Promise<RawTeamMember[]>;
  testimonials(): Promise<RawTestimonial[]>;
  stats(): Promise<Stats>;
  posts(): Promise<RawPost[]>;
  submitApplication(input: ApplicationInput): Promise<ApplicationResult>;
}
