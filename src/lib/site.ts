import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://it-shaharcha.uz"
).replace(/\/$/, "");

export const PHONE = "+998700107676";

export const SOCIALS = {
  telegram: "https://t.me/itshaharcha",
  instagram: "https://www.instagram.com/itshaharcha",
  youtube: "https://www.youtube.com/@itshaharcha",
} as const;

export const OG_LOCALE: Record<Locale, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export const HREFLANG: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en",
};

/** Path for a locale, honouring localePrefix "as-needed". `path` starts with "/" or is "". */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** hreflang map (plus x-default) for `alternates.languages` and the sitemap. */
export function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[HREFLANG[locale]] = absoluteUrl(localePath(locale, path));
  }
  languages["x-default"] = absoluteUrl(localePath(routing.defaultLocale, path));
  return languages;
}
