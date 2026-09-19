import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Branch } from "@/lib/types";
import { Reveal } from "@/motion/Reveal";
import { formatPhone } from "./BranchCard";
import { MapEmbed } from "./MapEmbed";

/** Home page "find us" block: address, hours, phone, map with taxi and route actions. */
export async function Location({ branch }: { branch: Branch }) {
  const [t, tb] = await Promise.all([getTranslations("Map"), getTranslations("Branches")]);
  if (!branch.geo) return null;

  return (
    <section id="location" aria-labelledby="location-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <Reveal>
          <h2 id="location-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("sectionTitle")}
          </h2>
          <p className="mt-4 text-lg text-chalk/70">{t("sectionLead")}</p>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-sm text-chalk/55">{tb("address")}</dt>
              <dd className="mt-1 text-lg leading-snug">{branch.address}</dd>
            </div>
            <div>
              <dt className="text-sm text-chalk/55">{tb("hours")}</dt>
              <dd className="mt-1 text-lg">{branch.hours}</dd>
            </div>
            <div>
              <dt className="text-sm text-chalk/55">{tb("phone")}</dt>
              <dd className="mt-1 text-lg tabular-nums">
                <a href={`tel:${branch.phone}`} className="hover:text-amber">
                  {formatPhone(branch.phone)}
                </a>
              </dd>
            </div>
          </dl>
          <Link href="/contact" className="mt-8 inline-block font-semibold text-amber hover:underline">
            {tb("title")}
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <MapEmbed
            geo={branch.geo}
            address={branch.address}
            title={tb("mapTitle", { name: branch.name })}
            labels={{
              yandex: t("yandex"),
              google: t("google"),
              taxi: t("taxi"),
              routeYandex: t("routeYandex"),
              routeGoogle: t("routeGoogle"),
              copy: t("copy"),
              copied: t("copied"),
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
