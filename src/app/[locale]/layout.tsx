import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { MotionProvider } from "@/motion/MotionProvider";
import { ScrollProgress } from "@/motion/ScrollProgress";
import { Effects } from "@/components/Effects";
import { OG_LOCALE, SITE_URL, absoluteUrl, languageAlternates, localePath } from "@/lib/site";
import "../globals.css";

const display = Unbounded({
  variable: "--f-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const body = Onest({
  variable: "--f-body",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0f2c",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  const url = absoluteUrl(localePath(locale, "/"));

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s — ${t("siteName")}` },
    description: t("description"),
    applicationName: t("siteName"),
    alternates: { canonical: url, languages: languageAlternates("/") },
    openGraph: {
      type: "website",
      url,
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary_large_image",
      site: "@itshaharcha",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Common" });
  const messages = await getMessages();
  // Client components only need these namespaces; everything else stays on the server.
  const clientMessages = {
    Nav: messages.Nav,
    Courses: messages.Courses,
    Directions: messages.Directions,
    DirectionsShort: messages.DirectionsShort,
    Hero: messages.Hero,
    Reviews: messages.Reviews,
    Apply: messages.Apply,
    Blog: messages.Blog,
  };

  return (
    <html lang={locale as Locale} className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a href="#main" className="skip-link">
          {t("skip")}
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <ScrollProgress />
            {children}
            <Effects />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
