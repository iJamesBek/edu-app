import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { OG_LOCALE, absoluteUrl, languageAlternates, localePath } from "./site";
import { routing } from "@/i18n/routing";

/**
 * Per-page metadata with canonical, hreflang and Open Graph filled in.
 * `path` is locale-less, e.g. "/courses" or "/courses/graphic-design".
 */
export function pageMetadata(input: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Use the full title as-is instead of the layout's "%s — IT Shaharcha" template. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(localePath(input.locale, input.path));
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url, languages: languageAlternates(input.path) },
    openGraph: {
      type: "website",
      url,
      title: input.title,
      description: input.description,
      locale: OG_LOCALE[input.locale],
      alternateLocale: routing.locales.filter((l) => l !== input.locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description },
  };
}
