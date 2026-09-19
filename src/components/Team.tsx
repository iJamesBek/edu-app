import { getTranslations } from "next-intl/server";
import type { TeamMember } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";
import { Tilt } from "@/motion/Tilt";

const TINTS = ["var(--majolica)", "var(--amber)", "var(--dusk)", "#ff8a9a"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function Team({ members }: { members: TeamMember[] }) {
  const t = await getTranslations("Team");

  return (
    <section id="team" aria-labelledby="team-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h2 id="team-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-chalk/70">{t("lead")}</p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {members.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 0.08}>
                <Tilt className="rounded-3xl">
                  <figure className="overflow-hidden rounded-3xl border border-chalk/10 bg-ink-2">
                    {/* Placeholder portrait until real photos come from the API */}
                    <div
                      className="grid aspect-[4/5] place-items-center"
                      style={{
                        background: `radial-gradient(circle at 50% 35%, ${TINTS[i % TINTS.length]}, transparent 70%)`,
                      }}
                    >
                      <span className="font-display text-5xl font-extrabold text-ink/80" aria-hidden>
                        {initials(p.name)}
                      </span>
                    </div>
                    <figcaption className="p-5">
                      <span className="block font-display font-bold">{p.name}</span>
                      <span className="mt-1 block text-sm text-chalk/60">{p.role}</span>
                    </figcaption>
                  </figure>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
