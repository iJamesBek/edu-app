import type { Locale } from "@/i18n/routing";

export type { Locale };

/** A string translated into every supported locale (raw shape from a data source). */
export type Localized = Record<Locale, string>;

export type Category = "programming" | "design" | "robotics" | "languages" | "office";

export type Level = "beginner" | "intermediate";

/* ---------- Raw shapes: what a DataSource returns ---------- */

export interface RawBranch {
  id: string;
  /** English, URL-safe: /branches/<slug> */
  slug: string;
  name: Localized;
  address: Localized;
  landmark?: Localized;
  phone: string;
  /** e.g. "Mo-Sa 09:00-18:00" (schema.org openingHours format) */
  openingHours: string;
  /** Human-readable version of openingHours */
  hours: Localized;
  classrooms: number;
  seats: number;
}

export type Format = "offline" | "online" | "hybrid";

/** Eligibility for free study */
export type FreeGroup = "school" | "unemployed";

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
  /** Curriculum: sections in order, each with its topics (tech names, not translated) */
  sections: { title: Localized; topics: string[] }[];
  outcomes: Localized[];
  tools: string[];
  teacherIds: string[];
  hoursPerLesson: number;
  groupSize: number;
  /**
   * Who studies this course for free. All courses are free for school students;
   * computer literacy is also free for any age if not officially employed.
   */
  freeFor: FreeGroup[];
  /** ISO date of the next group start */
  nextStart: string;
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

export interface RawTeacher {
  id: string;
  /** English, URL-safe: /teachers/<slug> */
  slug: string;
  name: string;
  role: Localized;
  bio: Localized;
  experienceYears: number;
  studentsTaught: number;
  skills: string[];
  branchIds: string[];
  /** Short quote shown on the profile */
  motto: Localized;
  /** Photo: absolute URL or a path under /public (e.g. /teachers/jasur-karimov.jpg). Falls back to a generated avatar. */
  photo?: string;
}

/** A student review. Written once, in the student's own language (not translated). */
export interface RawReview {
  id: string;
  author: string;
  courseId: string;
  /** 1–5 */
  rating: number;
  /** ISO date */
  date: string;
  text: string;
  lang: Locale;
}

export interface ReviewQuery {
  courseId?: string;
  /** 1-based */
  page: number;
  perPage: number;
}

export interface ReviewSummary {
  count: number;
  average: number;
  /** count per star, index 0 = 1 star */
  byRating: [number, number, number, number, number];
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
  slug: string;
  name: string;
  address: string;
  landmark?: string;
  phone: string;
  openingHours: string;
  hours: string;
  classrooms: number;
  seats: number;
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
  teacherIds: string[];
  nextStart: string;
}

export interface CourseDetail extends Course {
  description: string;
  lessonsPerWeek: number;
  format: Format;
  sections: { title: string; topics: string[] }[];
  outcomes: string[];
  tools: string[];
  hoursPerLesson: number;
  groupSize: number;
  freeFor: FreeGroup[];
  nextStart: string;
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
  /** Eligibility for free study, as stated by the applicant */
  status: ApplicantStatus;
  locale: Locale;
}

export type ApplicantStatus = "school" | "unemployed" | "other";

export interface ApplicationResult {
  id: string;
}

export interface Teacher {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  motto: string;
  experienceYears: number;
  studentsTaught: number;
  skills: string[];
  branchIds: string[];
  photo?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  lang: Locale;
  course: { id: string; slug: string; title: string } | null;
}

export interface ReviewPage {
  items: Review[];
  total: number;
  page: number;
  pages: number;
}

/**
 * The single seam between the UI and wherever data lives.
 * Implement this against the real backend and the UI does not change.
 */
export interface DataSource {
  branches(): Promise<RawBranch[]>;
  courses(): Promise<RawCourse[]>;
  teachers(): Promise<RawTeacher[]>;
  /** Newest first. Paginate on the server: there can be thousands. */
  reviews(query: ReviewQuery): Promise<{ items: RawReview[]; total: number }>;
  reviewSummary(courseId?: string): Promise<ReviewSummary>;
  stats(): Promise<Stats>;
  posts(): Promise<RawPost[]>;
  submitApplication(input: ApplicationInput): Promise<ApplicationResult>;
}
