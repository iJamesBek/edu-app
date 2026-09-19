import { Link } from "@/i18n/navigation";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { Tilt } from "@/motion/Tilt";
import { Avatar } from "./ui/Avatar";

export interface TeacherCardData {
  slug: string;
  name: string;
  role: string;
  experienceLabel: string;
  skills: string[];
}

/** Whole card links to the teacher's profile. */
export function TeacherCard({ teacher }: { teacher: TeacherCardData }) {
  return (
    <Tilt className="h-full rounded-3xl">
      <SpotlightCard className="h-full rounded-3xl border border-chalk/10 bg-ink-2" spotlightColor="rgba(255, 193, 94, 0.18)">
        <article className="relative flex h-full flex-col">
          <Avatar name={teacher.name} className="aspect-[4/3] w-full" />
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-xl font-bold">
              <Link href={`/teachers/${teacher.slug}`} className="after:absolute after:inset-0 after:content-['']">
                {teacher.name}
              </Link>
            </h3>
            <p className="mt-1 text-chalk/65">{teacher.role}</p>
            <p className="mt-3 text-sm text-amber">{teacher.experienceLabel}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {teacher.skills.slice(0, 4).map((s) => (
                <li key={s} className="rounded-full bg-chalk/8 px-2.5 py-1 text-xs text-chalk/75">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </SpotlightCard>
    </Tilt>
  );
}
