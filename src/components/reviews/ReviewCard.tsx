import { Link } from "@/i18n/navigation";
import { initials } from "@/components/ui/Avatar";

export function Stars({ rating, label, className = "size-4" }: { rating: number; label: string; className?: string }) {
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - (n - 1)));
        return (
          <svg key={n} viewBox="0 0 24 24" className={className} aria-hidden>
            <defs>
              <linearGradient id={`st-${n}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#ffc15e" />
                <stop offset={`${fill * 100}%`} stopColor="#eef2fa" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"
              fill={`url(#st-${n}-${Math.round(fill * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

export interface ReviewCardData {
  id: string;
  author: string;
  rating: number;
  ratingLabel: string;
  dateIso: string;
  dateLabel: string;
  text: string;
  lang: string;
  course: { slug: string; title: string } | null;
}

/** A single review. `lang` marks text written in another language than the page. */
export function ReviewCard({ review, compact = false }: { review: ReviewCardData; compact?: boolean }) {
  return (
    <figure
      className={`flex h-full flex-col rounded-3xl border border-chalk/10 bg-ink-2 ${compact ? "w-[320px] p-6 sm:w-[360px]" : "p-7"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} label={review.ratingLabel} />
        <time dateTime={review.dateIso} className="text-xs text-chalk/45">
          {review.dateLabel}
        </time>
      </div>
      <blockquote lang={review.lang} className={`mt-4 flex-1 leading-relaxed text-chalk/85 ${compact ? "line-clamp-4" : "text-[1.05rem]"}`}>
        “{review.text}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-chalk/10 font-display text-sm font-bold">
          {initials(review.author)}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{review.author}</span>
          {review.course &&
            (compact ? (
              <span className="block truncate text-sm text-chalk/55">{review.course.title}</span>
            ) : (
              <Link href={`/courses/${review.course.slug}`} className="block truncate text-sm text-majolica hover:underline">
                {review.course.title}
              </Link>
            ))}
        </span>
      </figcaption>
    </figure>
  );
}
