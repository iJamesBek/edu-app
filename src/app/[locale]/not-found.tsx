import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { api } from "@/lib/api";
import { localePath } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LostRobot } from "@/components/LostRobot";
import StarBorder from "@/components/bits/StarBorder";
import { Magnetic } from "@/motion/Magnetic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const [t, courses] = await Promise.all([getTranslations("NotFound"), api.courses(locale)]);
  const popular = courses.slice(0, 4);

  return (
    <>
      <Header />
      <main id="main" className="relative isolate overflow-hidden">
        <div aria-hidden className="drift absolute -left-40 top-20 -z-10 size-[460px] rounded-full bg-majolica opacity-15 blur-3xl" />
        <div className="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p aria-hidden className="rise font-display text-[clamp(5rem,14vw,9rem)] font-extrabold leading-none text-chalk/10">
              404
            </p>
            <h1 className="-mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-balance sm:-mt-10">
              {t("title")
                .split(" ")
                .map((word, i, arr) => (
                  <span key={i} className="word-in inline-block" style={{ "--d": `${0.1 + i * 0.06}s` } as React.CSSProperties}>
                    {word}
                    {i < arr.length - 1 ? " " : ""}
                  </span>
                ))}
            </h1>
            <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-chalk/70" style={{ "--d": "0.4s" } as React.CSSProperties}>
              {t("text")}
            </p>
            <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "0.55s" } as React.CSSProperties}>
              <Magnetic>
                <StarBorder as="a" href={localePath(locale, "/")} color="#22c7d6" speed="5s" backgroundColor="#ffc15e" textColor="#0a0f2c" borderColor="#ffc15e">
                  {t("home")}
                </StarBorder>
              </Magnetic>
              <Link href="/courses" className="inline-flex rounded-full border border-chalk/25 px-7 py-4 font-semibold transition-colors hover:border-majolica hover:text-majolica">
                {t("courses")}
              </Link>
            </div>
            <nav aria-label={t("popular")} className="rise mt-12" style={{ "--d": "0.7s" } as React.CSSProperties}>
              <p className="text-sm text-chalk/55">{t("popular")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {popular.map((c) => (
                  <li key={c.id}>
                    <Link href={`/courses/${c.slug}`} className="inline-block rounded-full bg-chalk/8 px-4 py-2 text-sm transition-colors hover:bg-chalk/15">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="rise flex justify-center" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <LostRobot label={t("title")} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
