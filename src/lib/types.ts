import type { Locale } from "@/i18n/routing";

export type { Locale };

/** A string translated into every supported locale (raw shape from a data source). */
export type Localized = Record<Locale, string>;

export type Category = "programming" | "design" | "marketing" | "office";

export type Level = "beginner" | "intermediate";

/* ---------- Raw shapes: what a DataSource returns ---------- */

export interface RawBranch {
  id: string;
  name: Localized;
}

export interface RawCourse {
  id: string;
  slug: string;
  category: Category;
  title: Localized;
  summary: Localized;
  durationMonths: number;
  level: Level;
  branchIds: string[];
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
}
