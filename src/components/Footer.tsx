import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PHONE, SOCIALS } from "@/lib/site";
import { api } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import logo from "../../public/brand/logo-light.png";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tc = await getTranslations("Common");
  const [branch] = await api.branches((await getLocale()) as Locale);
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-chalk/10 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-3 sm:px-6">
        <div>
          <Image src={logo} alt={tc("logoAlt")} sizes="200px" className="h-20 w-auto" />
          <p className="mt-4 text-chalk/60">{t("tagline")}</p>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-chalk/60">{t("contact")}</h2>
          <a href={`tel:${PHONE}`} className="mt-3 block text-2xl font-semibold tabular-nums hover:text-amber">
            +998 70 010 76 76
          </a>
          {branch && (
            <Link href="/contact" className="mt-3 block max-w-xs leading-snug text-chalk/65 hover:text-chalk">
              {branch.address}
              <span className="mt-1 block text-sm text-chalk/45">{branch.hours}</span>
            </Link>
          )}
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-chalk/60">{t("follow")}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {Object.entries(SOCIALS).map(([name, href]) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-chalk/20 px-4 py-2 text-sm capitalize transition-colors hover:border-majolica hover:text-majolica"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl px-4 text-sm text-chalk/45 sm:px-6">
        © {year} IT Shaharcha. {t("rights")}
      </p>
    </footer>
  );
}
