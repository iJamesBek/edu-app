import { Link } from "@/i18n/navigation";
import type { BlogCategory } from "@/lib/types";
import { PostCover } from "./PostCover";

/** Serializable card data: everything already translated and formatted on the server. */
export interface PostCardData {
  slug: string;
  category: BlogCategory;
  categoryLabel: string;
  title: string;
  excerpt: string;
  dateIso: string;
  dateLabel: string;
  readingLabel: string;
}

export function PostCard({ post, large = false }: { post: PostCardData; large?: boolean }) {
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-3xl border border-chalk/10 bg-ink-2 transition-colors hover:border-chalk/25 ${
        large ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[16/9] lg:aspect-auto lg:w-[58%]" : "aspect-[16/9]"}`}>
        <PostCover
          slug={post.slug}
          category={post.category}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.06]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold backdrop-blur">
          {post.categoryLabel}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${large ? "p-7 sm:p-10 lg:justify-center" : "p-6"}`}>
        <p className="text-sm text-chalk/55">
          <time dateTime={post.dateIso}>{post.dateLabel}</time>
          <span aria-hidden> · </span>
          {post.readingLabel}
        </p>
        <h3
          className={`mt-3 font-display font-bold leading-snug text-balance ${
            large ? "text-2xl sm:text-4xl" : "text-xl"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className={`mt-3 leading-relaxed text-chalk/65 ${large ? "text-lg" : ""}`}>{post.excerpt}</p>
      </div>
    </article>
  );
}
