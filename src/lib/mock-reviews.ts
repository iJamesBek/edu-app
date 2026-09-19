import type { Locale, RawReview } from "./types";

/**
 * MOCK DATA — generated reviews for development (deterministic, ~120 items) so
 * pagination, filters and the summary can be tested at a realistic volume.
 */

const NAMES = [
  "Azizbek", "Madina", "Jahongir", "Sevara", "Otabek", "Nilufar", "Bekzod", "Dilshoda", "Sardor", "Kamola",
  "Shahzod", "Mohinur", "Javohir", "Gulnoza", "Doniyor", "Zarina", "Asadbek", "Malika", "Ulug‘bek", "Feruza",
];
const INITIALS = "ABDEGHIJKMNORSTUXYZ";

const TEXTS: Record<string, { lang: Locale; text: string }[]> = {
  "1": [
    { lang: "uz", text: "Scratch’dan boshlab Django’gacha yetib keldim. Eng yoqqani — har darsda kod yozamiz, nazariya kam." },
    { lang: "uz", text: "Python’ni noldan o‘rgandim. Mentor har bir xatoni sabr bilan tushuntirdi." },
    { lang: "ru", text: "Пришёл без опыта, сейчас делаю свой первый проект на Django. Очень понятная подача." },
  ],
  "3": [
    { lang: "uz", text: "Birinchi saytimni kursning ikkinchi oyida qildim. Hozir portfolio’da 6 ta loyiha bor." },
    { lang: "uz", text: "React bo‘limi zo‘r edi, real loyiha ustida jamoa bo‘lib ishladik." },
    { lang: "ru", text: "Отличная практика: каждый модуль заканчивается проектом, код проверяют по-настоящему." },
  ],
  "7": [
    { lang: "uz", text: "Flutter’da yozgan ilovam Google Play’da! Buni kurs boshida tasavvur ham qilmagandim." },
    { lang: "uz", text: "Dart sodda ekan. Mentor Firebase’ni juda tushunarli ko‘rsatdi." },
  ],
  "5": [
    { lang: "uz", text: "Portfolio yig‘ib, birinchi buyurtmani oldim. Figma’ni endi erkin ishlataman." },
    { lang: "uz", text: "Rang va tipografiya bo‘yicha darslar ko‘zimni ochdi. Juda ijodiy muhit." },
    { lang: "ru", text: "Сделала айдентику для знакомого кафе прямо во время курса. Спасибо ментору!" },
  ],
  "9": [
    { lang: "uz", text: "Robotimiz chiziq bo‘ylab yurganda butun guruh qarsak chaldi. Endi musobaqaga tayyorlanyapmiz." },
    { lang: "uz", text: "O‘g‘lim har darsdan keyin yangi narsa yig‘ib kelyapti. Rahmat ustozlarga!" },
  ],
  "8": [
    { lang: "uz", text: "O‘zim chizgan brelokni 3D printerda chiqardim — juda qiziqarli!" },
    { lang: "uz", text: "Fusion 360 qiyin tuyulgandi, lekin bosqichma-bosqich tushunib oldim." },
  ],
  "6": [
    { lang: "uz", text: "A2 dan B1 ga ko‘tarildim. Speaking club’lar eng foydali qismi." },
    { lang: "uz", text: "Endi texnik hujjatlarni lug‘atsiz o‘qiyman. O‘qituvchimiz ajoyib." },
    { lang: "ru", text: "Наконец перестала бояться говорить по-английски. Много живой практики." },
  ],
  "4": [
    { lang: "uz", text: "Ishda Excel’dan qo‘rqardim, endi hisobotlarni o‘zim tayyorlayman." },
    { lang: "uz", text: "Onam uchun olgan edim — endi o‘zi Telegram va pochtadan bemalol foydalanadi." },
  ],
};

const COURSE_IDS = Object.keys(TEXTS);

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generate(count: number): RawReview[] {
  const r = rng(2026);
  const start = Date.parse("2026-09-15T12:00:00+05:00");
  const out: RawReview[] = [];
  for (let i = 0; i < count; i++) {
    const courseId = COURSE_IDS[Math.floor(r() * COURSE_IDS.length)];
    const pool = TEXTS[courseId];
    const pick = pool[Math.floor(r() * pool.length)];
    const roll = r();
    out.push({
      id: `rv-${i + 1}`,
      author: `${NAMES[Math.floor(r() * NAMES.length)]} ${INITIALS[Math.floor(r() * INITIALS.length)]}.`,
      courseId,
      rating: roll > 0.22 ? 5 : roll > 0.06 ? 4 : 3,
      // roughly one review every 1–3 days, newest first
      date: new Date(start - i * (1 + Math.floor(r() * 3)) * 86_400_000).toISOString().slice(0, 10),
      text: pick.text,
      lang: pick.lang,
    });
  }
  return out;
}

export const mockReviews: RawReview[] = generate(120);
