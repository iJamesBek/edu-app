import { getTranslations } from "next-intl/server";
import { Magnetic } from "@/motion/Magnetic";
import { Reveal } from "@/motion/Reveal";

export async function Online() {
  const t = await getTranslations("Online");
  const td = await getTranslations("Directions");
  const words = (["programming", "design", "marketing", "office"] as const).map((k) => td(k));

  return (
    <section id="online" aria-labelledby="online-title" className="relative overflow-hidden py-20 sm:py-28">
      {/* Endless ribbon of directions; pauses on hover, stops on weak devices */}
      <div aria-hidden className="marquee pointer-events-auto -rotate-2 bg-majolica py-4 text-ink">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {Array.from({ length: 3 }).flatMap((_, r) =>
                words.map((w) => (
                  <span key={`${copy}-${r}-${w}`} className="flex items-center font-display text-2xl font-extrabold sm:text-3xl">
                    <span className="px-6">{w}</span>
                    <span className="size-2.5 rounded-full bg-ink" />
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 id="online-title" className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-chalk/70">{t("lead")}</p>
          <p className="mt-10 font-display text-xl text-amber">{t("question")}</p>
          <div className="mt-6">
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex rounded-full bg-chalk px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {t("cta")}
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
