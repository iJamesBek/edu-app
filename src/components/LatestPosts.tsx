import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { toCardData } from "@/lib/blog-view";
import type { Post } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";
import { PostCard } from "./blog/PostCard";

/** Home page teaser: the three newest posts. */
export async function LatestPosts({ posts }: { posts: Post[] }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Blog");
  const cards = await toCardData(locale, posts.slice(0, 3));
  if (!cards.length) return null;

  return (
    <section aria-labelledby="latest-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("latest")}
          </h2>
          <Link href="/blog" className="font-semibold text-amber hover:underline">
            {t("allPosts")}
          </Link>
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.08} className="h-full">
                <PostCard post={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
