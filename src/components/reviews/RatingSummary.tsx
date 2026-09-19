import { getLocale, getTranslations } from "next-intl/server";
import { formatNumber } from "@/lib/format";
import type { ReviewSummary } from "@/lib/types";
import { Stars } from "./ReviewCard";

/** Big average, stars, count and a per-star histogram. */
export async function RatingSummary({ summary, tone = "dark" }: { summary: ReviewSummary; tone?: "dark" | "on-dusk" }) {
  const [t, locale] = await Promise.all([getTranslations("Reviews"), getLocale()]);
  const max = Math.max(1, ...summary.byRating);
  const muted = tone === "on-dusk" ? "text-chalk/75" : "text-chalk/60";

  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
      <div>
        <p className="text-sm font-semibold text-chalk/70">{t("average")}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-6xl font-extrabold tabular-nums">{formatNumber(summary.average, locale)}</span>
          <span className={muted}>/ 5</span>
        </p>
        <div className="mt-2">
          <Stars rating={summary.average} label={t("stars", { rating: summary.average })} className="size-5" />
        </div>
        <p className={`mt-2 text-sm ${muted}`}>{t("basedOn", { count: summary.count })}</p>
      </div>
      <ol className="w-full max-w-[16rem] space-y-1.5" aria-label={t("average")}>
        {[5, 4, 3, 2, 1].map((star) => {
          const n = summary.byRating[star - 1];
          return (
            <li key={star} className="flex items-center gap-3 text-sm">
              <span className={`w-3 tabular-nums ${muted}`}>{star}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-chalk/10">
                <span className="block h-full rounded-full bg-amber" style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className={`w-8 text-right tabular-nums ${muted}`}>{n}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
