import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru", "en"],
  defaultLocale: "uz",
  // uz lives at "/", ru at "/ru", en at "/en"
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
