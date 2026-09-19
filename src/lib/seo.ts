import type { Locale } from "@/i18n/routing";
import type { Branch, Course, CourseDetail, Post, PostDetail, Teacher } from "./types";
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
    logo: absoluteUrl("/brand/logo-light.png"),
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

export function courseListJsonLd(courses: Course[], providerName: string, locale?: Locale): JsonLd {
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
        ...(locale ? { url: absoluteUrl(localePath(locale, `/courses/${course.slug}`)) } : {}),
        provider: { "@type": "EducationalOrganization", name: providerName },
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const COURSE_MODE: Record<CourseDetail["format"], string> = {
  offline: "Onsite",
  online: "Online",
  hybrid: "Blended",
};

export function courseJsonLd(
  locale: Locale,
  course: CourseDetail,
  input: { providerName: string; url: string; instructors?: string[] },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${input.url}#course`,
    name: course.title,
    description: course.description,
    url: input.url,
    inLanguage: locale,
    educationalLevel: course.level,
    teaches: course.outcomes,
    syllabusSections: course.sections.map((sec) => ({
      "@type": "Syllabus",
      name: sec.title,
      description: sec.topics.join(", "),
    })),
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: course.priceMonthly,
      priceCurrency: "UZS",
      url: input.url,
    },
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: input.providerName,
      sameAs: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: COURSE_MODE[course.format],
      startDate: course.nextStart,
      inLanguage: locale,
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
        repeatCount: course.durationMonths * 4,
        duration: `PT${course.hoursPerLesson * 60}M`,
      },
      instructor: input.instructors?.map((name) => ({ "@type": "Person", name })),
    },
  };
}

export function blogJsonLd(locale: Locale, input: { name: string; description: string; posts: Post[] }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absoluteUrl(localePath(locale, "/blog"))}#blog`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(localePath(locale, "/blog")),
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: input.posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(localePath(locale, `/blog/${p.slug}`)),
      datePublished: p.publishedAt,
    })),
  };
}

export function blogPostingJsonLd(locale: Locale, post: PostDetail, input: { url: string; image: string }): JsonLd {
  const words = post.body.map((b) => (b.type === "ul" ? b.items.join(" ") : b.text)).join(" ");
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${input.url}#article`,
    mainEntityOfPage: input.url,
    headline: post.title,
    description: post.excerpt,
    image: input.image,
    inLanguage: locale,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    wordCount: words.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${post.readingMinutes}M`,
    author: { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${absoluteUrl(localePath(locale, "/blog"))}#blog` },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function personJsonLd(teacher: Teacher, input: { url: string; courses: string[] }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${input.url}#person`,
    name: teacher.name,
    jobTitle: teacher.role,
    description: teacher.bio,
    url: input.url,
    knowsAbout: teacher.skills,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    ...(input.courses.length ? { hasOccupation: { "@type": "Occupation", name: teacher.role } } : {}),
  };
}

export function branchJsonLd(branch: Branch, input: { url: string; name: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${input.url}#branch`,
    name: input.name,
    url: input.url,
    telephone: branch.phone,
    openingHours: branch.openingHours,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressCountry: "UZ",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}
