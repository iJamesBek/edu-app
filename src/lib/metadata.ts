import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { OG_LOCALE, absoluteUrl, languageAlternates, localePath } from "./site";
import { routing } from "@/i18n/routing";

/** Locale OG image route; the default locale has no prefix ("/opengraph-image"). */
export function ogImagePath(locale: Locale) {
  return localePath(locale, "/opengraph-image");
}

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
  // Pages that set their own openGraph lose the file-based image, so point to it explicitly.
  const image = { url: ogImagePath(input.locale), width: 1200, height: 630 };
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
      images: [image],
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description, images: [image.url] },
  };
}
