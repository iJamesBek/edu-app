"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { PHONE } from "@/lib/site";
import logo from "../../public/brand/logo-light.png";

const SECTIONS = [
  { href: "/courses", key: "courses" },
  { href: "/#team", key: "team" },
  { href: "/#reviews", key: "alumni" },
  { href: "/#online", key: "online" },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-ink/80 shadow-[0_1px_0_rgba(238,242,250,0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:h-20 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src={logo}
            alt={t("logoAlt")}
            priority
            sizes="160px"
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav aria-label={t("menu")} className="ml-4 hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              aria-current={pathname === s.href ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-chalk/8 hover:text-chalk ${
                !s.href.includes("#") && pathname.startsWith(s.href) ? "text-amber" : "text-chalk/75"
              }`}
            >
              {t(s.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${PHONE}`}
            className="hidden rounded-full border border-chalk/20 px-4 py-2 text-sm tabular-nums transition-colors hover:border-amber hover:text-amber md:inline-block"
            aria-label={t("call")}
          >
            +998 70 010 76 76
          </a>

          <div role="group" aria-label={t("language")} className="flex rounded-full bg-chalk/8 p-1">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                  l === locale ? "bg-amber text-ink" : "text-chalk/70 hover:text-chalk"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("close") : t("menu")}
            className="grid size-10 place-items-center rounded-full bg-chalk/8 lg:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span
                className={`absolute left-0 h-0.5 w-4 bg-chalk transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-4 bg-chalk transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-4 bg-chalk transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-nav"
            aria-label={t("menu")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border-t border-chalk/10 px-4 pb-6 pt-2 lg:hidden"
          >
            {SECTIONS.map((s) => (
              <Link
                key={s.key}
                href={s.href}
                onClick={() => setOpen(false)}
                className="block border-b border-chalk/8 py-4 font-display text-lg"
              >
                {t(s.key)}
              </Link>
            ))}
            <a href={`tel:${PHONE}`} className="mt-5 block text-amber tabular-nums">
              +998 70 010 76 76
            </a>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
