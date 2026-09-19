import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { toCardData } from "@/lib/blog-view";
import { pageMetadata } from "@/lib/metadata";
import { blogJsonLd, breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogList } from "@/components/blog/BlogList";
import { Reveal } from "@/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return pageMetadata({ locale, path: "/blog", title: t("metaTitle"), description: t("description") });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const [t, tb, posts] = await Promise.all([
    getTranslations({ locale, namespace: "Blog" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    api.posts(locale),
  ]);
  const cards = await toCardData(locale, posts);

  const jsonLd = [
    blogJsonLd(locale, { name: t("metaTitle"), description: t("description"), posts }),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: t("title"), path: localePath(locale, "/blog") },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main" className="pb-24">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <Breadcrumbs items={[{ label: tb("home"), href: "/" }, { label: t("title") }]} />
          <Reveal className="mt-8">
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">{t("title")}</h1>
            <p className="mt-4 max-w-xl text-lg text-chalk/70">{t("lead")}</p>
          </Reveal>
          <BlogList posts={cards} />
        </div>
      </main>
      <Footer />
    </>
  );
}
