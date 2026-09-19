import type { Locale } from "@/i18n/routing";
import type { Course } from "./types";
import { PHONE, SITE_URL, SOCIALS, absoluteUrl, localePath } from "./site";

type JsonLd = Record<string, unknown>;

/** Serialise for an inline <script>: "<" is escaped so content can never close the tag. */
export function jsonLdString(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(
  locale: Locale,
  input: { name: string; description: string },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(localePath(locale, "/")),
    logo: absoluteUrl("/icon.svg"),
    telephone: PHONE,
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    availableLanguage: ["uz", "ru", "en"],
    sameAs: Object.values(SOCIALS),
  };
}

export function websiteJsonLd(locale: Locale, name: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name,
    url: absoluteUrl(localePath(locale, "/")),
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function courseListJsonLd(courses: Course[], providerName: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.summary,
        provider: { "@type": "EducationalOrganization", name: providerName },
      },
    })),
  };
}
