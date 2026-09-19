import { getTranslations } from "next-intl/server";
import { Magnetic } from "@/motion/Magnetic";
import { CityScene } from "./CityScene";
import { HeroAurora } from "./HeroAurora";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-16 overflow-hidden pt-16 sm:-mt-20 sm:pt-20"
    >
      {/* Night sky */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 78% 20%, rgba(91,75,219,0.35), transparent 60%), radial-gradient(800px 500px at 10% 90%, rgba(34,199,214,0.14), transparent 60%), linear-gradient(180deg, #0a0f2c 0%, #121a45 100%)",
        }}
      />

      <HeroAurora />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          {/* Words blur in via CSS: the full sentence is plain text in the server HTML */}
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.1rem,5.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-balance"
          >
            {t("title")
              .split(" ")
              .map((word, i, all) => (
                <span
                  key={i}
                  className="word-in inline-block"
                  style={{ "--d": `${0.08 + i * 0.07}s` } as React.CSSProperties}
                >
                  {word}
                  {i < all.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
          </h1>
          <p
            className="rise mt-6 max-w-xl text-lg leading-relaxed text-chalk/75 sm:text-xl"
            style={{ "--d": "0.55s" } as React.CSSProperties}
          >
            {t("lead")}
          </p>
          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            <Magnetic>
              <a
                href="#courses"
                className="inline-flex items-center rounded-full bg-amber px-7 py-4 font-semibold text-ink shadow-[0_10px_40px_-10px_rgba(255,193,94,0.7)] transition-transform hover:-translate-y-0.5"
              >
                {t("ctaCourses")}
              </a>
            </Magnetic>
            <a
              href="#contact"
              className="inline-flex items-center rounded-full border border-chalk/25 px-7 py-4 font-semibold transition-colors hover:border-majolica hover:text-majolica"
            >
              {t("ctaConsult")}
            </a>
          </div>
        </div>

        <CityScene />
      </div>
    </section>
  );
}
