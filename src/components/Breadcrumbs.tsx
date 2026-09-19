import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export interface Crumb {
  label: string;
  /** Omit on the current page. */
  href?: string;
}

/** Visible breadcrumb trail. Pair with breadcrumbJsonLd() for search engines. */
export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations("Breadcrumbs");

  return (
    <nav aria-label={t("label")} className="text-sm text-chalk/55">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && (
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-chalk">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-chalk/85">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
