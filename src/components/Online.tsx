import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/motion/Magnetic";
import { Reveal } from "@/motion/Reveal";
import { RotatingDirection, VelocityRibbons } from "./OnlineMotion";

export async function Online() {
  const t = await getTranslations("Online");

  return (
    <section id="campus" aria-labelledby="online-title" className="relative overflow-hidden py-20 sm:py-28">
      <VelocityRibbons />

      <div className="mx-auto mt-20 max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 id="online-title" className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-chalk/70">{t("lead")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-display text-2xl font-bold sm:text-3xl">
            <span>{t("rotPrefix")}</span>
            <RotatingDirection />
          </div>
          <p className="mt-10 font-display text-xl text-amber">{t("question")}</p>
          <div className="mt-6">
            <Magnetic>
              <Link
                href="/branches"
                className="inline-flex rounded-full bg-chalk px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {t("cta")}
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
