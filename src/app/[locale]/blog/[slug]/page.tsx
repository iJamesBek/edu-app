import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { headingId, toCardData } from "@/lib/blog-view";
import { ogImagePath, pageMetadata } from "@/lib/metadata";
import { blogPostingJsonLd, breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { absoluteUrl, localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostBody } from "@/components/blog/PostBody";
import { PostAside, type TocItem } from "@/components/blog/PostAside";
import { PostCard } from "@/components/blog/PostCard";
import { PostCover } from "@/components/blog/PostCover";
import { Reveal } from "@/motion/Reveal";
import { Magnetic } from "@/motion/Magnetic";

export async function generateStaticParams() {
  return (await api.postSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const post = await api.postBySlug(locale, slug);
  if (!post) return {};
  const base = pageMetadata({ locale, path: `/blog/${slug}`, title: post.title, description: post.excerpt });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const post = await api.postBySlug(locale, slug);
  if (!post) notFound();

  const [t, tb, format, all, courses] = await Promise.all([
    getTranslations({ locale, namespace: "Blog" }),
    getTranslations({ locale, namespace: "Breadcrumbs" }),
    getFormatter({ locale }),
    api.posts(locale),
    api.courses(locale),
  ]);

  const path = `/blog/${slug}`;
  const url = absoluteUrl(localePath(locale, path));
  const course = post.courseSlug ? courses.find((c) => c.slug === post.courseSlug) : undefined;
  const related = await toCardData(
    locale,
    [...all.filter((p) => p.id !== post.id && p.category === post.category), ...all.filter((p) => p.id !== post.id && p.category !== post.category)].slice(0, 3),
  );

  let h = 0;
  const toc: TocItem[] = post.body.flatMap((b) => (b.type === "h2" ? [{ id: headingId(b.text, h++), text: b.text }] : []));

  const jsonLd = [
    blogPostingJsonLd(locale, post, { url, image: absoluteUrl(ogImagePath(locale)) }),
    breadcrumbJsonLd([
      { name: tb("home"), path: localePath(locale, "/") },
      { name: tb("blog"), path: localePath(locale, "/blog") },
      { name: post.title, path: localePath(locale, path) },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Header />
      <main id="main">
        <article>
          <header className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
            <Breadcrumbs
              items={[
                { label: tb("home"), href: "/" },
                { label: tb("blog"), href: "/blog" },
                { label: post.title },
              ]}
            />
            <p className="rise mt-10 text-sm font-semibold text-amber">{t(`categories.${post.category}`)}</p>
            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.8rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {post.title.split(" ").map((word, i, arr) => (
                <span key={i} className="word-in inline-block" style={{ "--d": `${0.04 + i * 0.05}s` } as React.CSSProperties}>
                  {word}
                  {i < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="rise mt-6 text-xl leading-relaxed text-chalk/70" style={{ "--d": "0.3s" } as React.CSSProperties}>
              {post.excerpt}
            </p>
            <div
              className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-chalk/10 pt-6 text-sm text-chalk/60"
              style={{ "--d": "0.4s" } as React.CSSProperties}
            >
              <span>
                <span className="text-chalk">{post.author.name}</span> · {post.author.role}
              </span>
              <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), { dateStyle: "long" })}</time>
              <span>{t("readingTime", { count: post.readingMinutes })}</span>
            </div>
          </header>

          <div className="rise mx-auto mt-10 max-w-6xl px-4 sm:px-6" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <div className="overflow-hidden rounded-[2rem] border border-chalk/10">
              <PostCover slug={post.slug} category={post.category} className="block aspect-[16/7] w-full" />
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_16rem]">
            <div className="mx-auto w-full max-w-[68ch] lg:mx-0 lg:ml-auto">
              <PostBody blocks={post.body} />

              {course && (
                <Reveal className="mt-16">
                  <aside className="relative overflow-hidden rounded-3xl bg-majolica p-8 text-ink sm:p-10">
                    <p className="text-sm font-semibold opacity-70">{t("courseCta")}</p>
                    <p className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{course.title}</p>
                    <p className="mt-3 max-w-md opacity-80">{t("courseCtaText")}</p>
                    <div className="mt-6">
                      <Magnetic>
                        <Link
                          href={`/courses/${course.slug}`}
                          className="inline-flex rounded-full bg-ink px-6 py-3.5 font-semibold text-chalk transition-transform hover:-translate-y-0.5"
                        >
                          {t("courseCtaButton")}
                        </Link>
                      </Magnetic>
                    </div>
                  </aside>
                </Reveal>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <PostAside toc={toc} url={url} title={post.title} />
            </aside>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="border-t border-chalk/10 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="related-title" className="font-display text-3xl font-extrabold tracking-tight">
                  {t("related")}
                </h2>
                <Link href="/blog" className="font-semibold text-amber hover:underline">
                  {t("allPosts")}
                </Link>
              </div>
              <ul className="mt-10 grid gap-6 md:grid-cols-3">
                {related.map((p, i) => (
                  <li key={p.slug}>
                    <Reveal delay={i * 0.07} className="h-full">
                      <PostCard post={p} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
