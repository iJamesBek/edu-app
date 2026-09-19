import { getTranslations } from "next-intl/server";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { Reveal } from "@/motion/Reveal";
import { Tilt } from "@/motion/Tilt";

const KEYS = ["coworking", "quality", "contests", "masterclasses", "jobs", "certificate"] as const;

const ICONS: Record<(typeof KEYS)[number], React.ReactNode> = {
  coworking: <path d="M4 18h16M6 18V9h12v9M9 9V6h6v3" />,
  quality: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />,
  contests: <path d="M8 4h8v5a4 4 0 01-8 0zM5 5h3v3a3 3 0 01-3-3zm14 0h-3v3a3 3 0 003-3zM12 13v4m-4 3h8" />,
  masterclasses: <path d="M3 8l9-4 9 4-9 4zm4 2v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" />,
  jobs: <path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16" />,
  certificate: <path d="M5 4h14v11H5zM8 8h8M8 11h5m1 4l-1 5 3-2 3 2-1-5" />,
};

export async function WhyUs() {
  const t = await getTranslations("WhyUs");

  return (
    <section aria-labelledby="why-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h2 id="why-title" className="max-w-3xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {t("title")}
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-chalk/10 sm:grid-cols-2 lg:grid-cols-3">
          {KEYS.map((key, i) => (
            <li key={key} className="bg-ink">
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <Tilt max={4} className="h-full">
                  <SpotlightCard className="h-full" spotlightColor="rgba(255, 193, 94, 0.16)">
                  <div className="relative h-full p-8 sm:p-10">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-10 text-majolica"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {ICONS[key]}
                    </svg>
                    <h3 className="mt-6 font-display text-xl font-bold">{t(`items.${key}.title`)}</h3>
                    <p className="mt-3 leading-relaxed text-chalk/65">{t(`items.${key}.text`)}</p>
                  </div>
                  </SpotlightCard>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
