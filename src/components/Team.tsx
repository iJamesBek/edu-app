import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Teacher } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";
import { TeacherCard } from "./TeacherCard";

/** Home page teaser: four teachers, each card opens the profile. */
export async function Team({ teachers }: { teachers: Teacher[] }) {
  const t = await getTranslations("Team");
  const tt = await getTranslations("Teachers");

  return (
    <section id="team" aria-labelledby="team-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="team-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-chalk/70">{t("lead")}</p>
          </div>
          <Link href="/teachers" className="font-semibold text-amber hover:underline">
            {tt("back")}
          </Link>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.slice(0, 4).map((x, i) => (
            <li key={x.id}>
              <Reveal delay={i * 0.08} className="h-full">
                <TeacherCard
                  teacher={{ slug: x.slug, name: x.name, role: x.role, skills: x.skills, photo: x.photo, experienceLabel: tt("experience", { count: x.experienceYears }) }}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
