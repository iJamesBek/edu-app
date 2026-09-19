@AGENTS.md

# edu-app — IT Shaharcha

it-shaharcha.uz (Vite + React SPA) saytining Next.js'da qayta qurilishi. Maqsad: juda ko‘p, lekin bezovta qilmaydigan animatsiyalar ("wow" effekti), qurilma imkoniyatiga moslashadigan harakat tizimi va kuchli SEO.

Tayyor sahifalar: bosh sahifa, `/courses`, `/courses/[slug]` (ariza formasi bilan). Keyingi: jamoa, bitiruvchilar, aloqa, blog, online.

## Marshrutlar

- URL segmentlari va sluglar faqat inglizcha, barcha tillarda bir xil: `/courses/frontend-development`, `/ru/courses/frontend-development`. Tarjima qilinmaydi.
- Yangi sahifa: `src/app/[locale]/<english-path>/page.tsx`, `generateMetadata` ichida `pageMetadata()` (`src/lib/metadata.ts`), sahifada `Breadcrumbs` + `breadcrumbJsonLd()`, va `src/app/sitemap.ts` ga qo‘shing.

## Stack

- Next.js 16 (App Router, `src/`), React 19, TypeScript
- Tailwind CSS v4 (sozlamalar `src/app/globals.css` ichida, `tailwind.config` yo‘q)
- `framer-motion` (`LazyMotion` + `m` komponentlari bilan)
- `next-intl` — uch til: `uz` (asosiy), `ru`, `en`
- Paket menejeri: npm

Next.js 16 sizning bilimingizdan farq qiladi (`middleware` → `proxy`, async `params`). Kod yozishdan oldin `node_modules/next/dist/docs/` dagi tegishli qo‘llanmani o‘qing.

## Buyruqlar

```bash
npm run dev      # dev server
npm run build    # production build (SEO va tiplarni tekshirish uchun shu yerda sinang)
npm run lint
```

## Tuzilma

```
src/
  app/[locale]/       sahifalar, layout, metadata
  app/sitemap.ts, robots.ts, manifest.ts
  components/         UI bo‘limlari
  motion/             animatsiya tizimi (device tier, Reveal, CountUp, ...)
  i18n/               routing, navigation, request
  lib/                api.ts, mock.ts, types.ts, seo.ts, site.ts
  proxy.ts            next-intl proxy (til yo‘naltirish)
messages/             uz.json, ru.json, en.json
```

## Ma'lumotlar qatlami

- Sahifalar va komponentlar faqat `src/lib/api.ts` dagi `api.*` ni chaqiradi. `mock.ts` yoki `fetch` ni to‘g‘ridan-to‘g‘ri ishlatmang.
- Hozir ma'lumot `src/lib/mock.ts` dan keladi. Haqiqiy backendga o‘tish: `EDU_API_URL` ni sozlang (`.env.example`ga qarang). Backend JSON'i `Raw*` tiplaridan farq qilsa, faqat `api.ts` ichidagi `httpSource` da moslang.
- Mock'da faqat `2500` (o‘quvchi) va `350` raqamlari eski saytdan olingan. Filial, kurs, jamoa va fikrlar to‘qilgan placeholder.
- `api.ts` `server-only`: client komponentga kerakli ma'lumotni props orqali bering.
- Ariza: `ApplyForm` → Server Action `src/lib/actions.ts` (validatsiya, honeypot, telefonni `+998XXXXXXXXX` ga keltiradi) → `api.submitApplication`. Mock faqat server logiga yozadi (telefon yashirilgan). Real backend: `POST {EDU_API_URL}/applications`.

## Til (i18n)

- Yo‘nalish: `uz` → `/`, `ru` → `/ru`, `en` → `/en` (`localePrefix: "as-needed"`).
- Interfeys matnlari `messages/*.json` da. Uch faylda kalitlar bir xil bo‘lishi shart. Matn qo‘shsangiz, uchalasiga qo‘shing.
- Client komponentga faqat kerakli namespace'ni `NextIntlClientProvider` orqali bering (hamma xabarni emas).
- Navigatsiya uchun `next/link` emas, `@/i18n/navigation` dagi `Link` ni ishlating.
- Har bir sahifada `setRequestLocale(locale)` chaqiring (statik render uchun).

## Animatsiya qoidalari

Animatsiyalar ko‘p bo‘ladi, lekin har biri qurilmaga moslashadi. Bu loyihaning asosiy talabi.

- Qurilma darajasi (`tier`): `high | mid | low | none`. `navigator.deviceMemory`, `hardwareConcurrency`, `saveData`, sensorli ekran va qisqa FPS o‘lchovi asosida aniqlanadi. `prefers-reduced-motion` doim `none` beradi.
- Har bir animatsiya o‘z darajasini tekshiradi. `high` — 3D tilt, pointer parallax, spotlight, yorug‘ oynalar miltillashi. `mid` — scroll reveal va scroll parallax. `low` — faqat qisqa opacity. `none` — harakat yo‘q.
- Bezovta qilmaslik: reveal faqat bir marta ishlaydi, davomiyligi 0.4–0.9 s, scroll o‘g‘irlanmaydi. O‘qiladigan kontent (fikrlar) o‘zi aylanmaydi; faqat dekorativ elementlar (CardSwap, RotatingText) o‘zi aylanadi, ekranda bo‘lganda va hover’da to‘xtab.
- Faqat `transform` va `opacity` ni animatsiya qiling. `width`, `height`, `top`, `left` ni emas.
- Cheksiz (loop) animatsiyalar ekrandan chiqqanda va `low`/`none` da to‘xtaydi.
- Kontent SEO uchun serverda to‘liq ko‘rinishi kerak. Server HTML'da hech narsa `opacity: 0` bilan yashirinmaydi. Reveal mount'dan keyingina ishga tushadi, birinchi ekrandagi elementlar CSS keyframe bilan chiqadi.
- O‘z kodimizda kichik bundle uchun `motion` o‘rniga `m` (`framer-motion/m`) ishlating.
- Sinash uchun darajani URL orqali majburlash mumkin: `/?motion=high`, `mid`, `low`, `none`.

## React Bits

- `src/components/bits/` — reactbits.dev dan olingan komponentlar (TS-TW variant, registry: `https://reactbits.dev/r/<Name>-TS-TW.json`).
- Importlar `motion/react` dan `framer-motion` ga almashtirilgan (bitta kutubxona). Mahalliy o‘zgarishlar `edu:` izohi bilan belgilangan.
- Har bir komponent darajaga bo‘ysunadi: `Aurora` (WebGL, `ogl`) faqat `mid`+ va idle'dan keyin yuklanadi; `CardSwap`, `ScrollVelocity`, `ClickSpark` `low`/`none` da to‘xtaydi; ekrandan chiqqanda render/interval to‘xtaydi.
- Yangi React Bits komponent qo‘shsangiz: `Math.random` render ichida bo‘lmasin (hydration), cheksiz `requestAnimationFrame` ekrandan tashqarida to‘xtasin, `useTier()` bilan cheklansin.
- Litsenziya: MIT + Commons Clause (komponentlarni loyihada ishlatish mumkin, o‘zini sotish mumkin emas).

## SEO qoidalari

- Barcha kontent serverda render bo‘ladi (SSR/SSG). Muhim matnni faqat clientda chizmang.
- Har sahifada `generateMetadata`: title, description, canonical, `alternates.languages` (hreflang: `uz`, `ru`, `en`, `x-default`), Open Graph, Twitter.
- Bitta `<h1>` va tartibli `h2`/`h3` iyerarxiyasi. Rasm uchun `next/image` va mazmunli `alt`. Shrift uchun `next/font`.
- JSON-LD `src/lib/seo.ts` orqali beriladi. Yangi sahifa qo‘shsangiz, sitemap'ga ham qo‘shing.
- `NEXT_PUBLIC_SITE_URL` canonical, sitemap va hreflang uchun asos.
- SEO alohida katta bosqich: kalit so‘zlar, kontent strategiyasi, Yandex Webmaster va Search Console keyin ko‘riladi.

## Dizayn tizimi

Konsepsiya: "shaharcha" — bosh sahifa qahramoni tungi shaharcha; har bir bino bitta yo‘nalish, yorug‘ oynalar — o‘quvchilar.

Ranglar (`globals.css` dagi tokenlar): `ink #0A0F2C`, `majolica #22C7D6`, `amber #FFC15E`, `chalk #EEF2FA`, `dusk #5B4BDB`.
Shriftlar: Unbounded (sarlavha), Onest (matn). Ikkalasi lotin, lotin-kengaytma va kirill harflarini qo‘llaydi.

- Ranglarni to‘g‘ridan-to‘g‘ri hex bilan yozmang, token ishlating.
- Kontrast va klaviatura fokusi ko‘rinib turishi shart. Har bir interaktiv element `:focus-visible` holatiga ega bo‘lsin.
- Mobil (400px) dan boshlab moslashuvchan.

## Git

- `origin`: `git@github.com:iJamesBek/edu-app.git` (SSH; Ubuntu'da HTTPS bilan muammo bo‘lgani uchun).
- Foydalanuvchi so‘ramaguncha `git push` qilmang.
- `.env*` fayllar commit qilinmaydi (`.env.example` bundan mustasno).
