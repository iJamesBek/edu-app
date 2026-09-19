import type { Category } from "./types";

/** Display order of directions everywhere (filters, city, card stack, ribbons). */
export const CATEGORIES: Category[] = ["programming", "design", "robotics", "languages", "office"];

/** Accent color per direction, used for chips, card stacks and course pages. */
export const CATEGORY_ACCENT: Record<Category, string> = {
  programming: "var(--majolica)",
  design: "var(--amber)",
  robotics: "#ff8a9a",
  languages: "#8ee6a8",
  office: "#9fb4ff",
};
