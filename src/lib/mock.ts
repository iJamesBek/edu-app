import { existsSync } from "node:fs";
import { join } from "node:path";
import { mockCourses } from "./mock-courses";
import { mockPosts } from "./mock-posts";
import { mockReviews } from "./mock-reviews";
import { mockTeachers } from "./mock-teachers";
import type { DataSource } from "./types";

/**
 * MOCK DATA — placeholder content until the real API is connected.
 * Only the 2500 (students) and 350 figures come from the current live site;
 * the Toshloq branch address and hours are real (old site); everything else is invented.
 */
const PHOTO_EXTS = ["webp", "jpg", "jpeg", "png"];

export const mockSource: DataSource = {
  async branches() {
    return [
      {
        // Real: address, hours and phone from it-shaharcha.uz. Classrooms and seats are invented.
        id: "toshloq",
        slug: "toshloq",
        name: { uz: "Toshloq filiali", ru: "Филиал Ташлак", en: "Toshloq branch" },
        address: {
          uz: "Toshloq tumani, “Yangi yo‘l” MFY, Alisher Navoiy ko‘chasi, 18-uy",
          ru: "Ташлакский район, МСГ «Янги йўл», ул. Алишера Навои, 18",
          en: "18 Alisher Navoiy St, Yangi Yo‘l, Toshloq district",
        },
        phone: "+998700107676",
        openingHours: "Mo-Sa 09:00-18:00",
        hours: { uz: "Dushanba–shanba, 09:00–18:00", ru: "Пн–Сб, 09:00–18:00", en: "Mon–Sat, 09:00–18:00" },
        classrooms: 8,
        seats: 120,
      },
      {
        // MOCK
        id: "fergana",
        slug: "fergana",
        name: { uz: "Farg‘ona filiali", ru: "Филиал Фергана", en: "Fergana branch" },
        address: { uz: "Farg‘ona shahri (namuna manzil)", ru: "г. Фергана (пример адреса)", en: "Fergana city (sample address)" },
        phone: "+998700107676",
        openingHours: "Mo-Sa 09:00-19:00",
        hours: { uz: "Dushanba–shanba, 09:00–19:00", ru: "Пн–Сб, 09:00–19:00", en: "Mon–Sat, 09:00–19:00" },
        classrooms: 6,
        seats: 90,
      },
      {
        // MOCK
        id: "margilan",
        slug: "margilan",
        name: { uz: "Marg‘ilon filiali", ru: "Филиал Маргилан", en: "Margilan branch" },
        address: { uz: "Marg‘ilon shahri (namuna manzil)", ru: "г. Маргилан (пример адреса)", en: "Margilan city (sample address)" },
        phone: "+998700107676",
        openingHours: "Mo-Sa 09:00-18:00",
        hours: { uz: "Dushanba–shanba, 09:00–18:00", ru: "Пн–Сб, 09:00–18:00", en: "Mon–Sat, 09:00–18:00" },
        classrooms: 4,
        seats: 60,
      },
    ];
  },

  async courses() {
    return mockCourses;
  },

  async teachers() {
    // Drop a photo into public/teachers/<slug>.(jpg|jpeg|png|webp) and it is picked up automatically.
    return mockTeachers.map((t) => {
      if (t.photo) return t;
      const ext = PHOTO_EXTS.find((e) => existsSync(join(process.cwd(), "public", "teachers", `${t.slug}.${e}`)));
      return ext ? { ...t, photo: `/teachers/${t.slug}.${ext}` } : t;
    });
  },

  async reviews({ courseId, page, perPage }) {
    const all = courseId ? mockReviews.filter((r) => r.courseId === courseId) : mockReviews;
    const from = (page - 1) * perPage;
    return { items: all.slice(from, from + perPage), total: all.length };
  },

  async reviewSummary(courseId) {
    const all = courseId ? mockReviews.filter((r) => r.courseId === courseId) : mockReviews;
    const byRating: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    for (const r of all) byRating[r.rating - 1]++;
    const average = all.length ? all.reduce((n, r) => n + r.rating, 0) / all.length : 0;
    return { count: all.length, average: Math.round(average * 10) / 10, byRating };
  },

  async stats() {
    return { students: 2500, mentors: 350, directions: 5, branches: 3 };
  },

  async posts() {
    return mockPosts;
  },

  async submitApplication(input) {
    // Mock: nothing is stored or sent anywhere. Only the server log shows it,
    // with the phone masked so personal data does not end up in logs.
    const id = `mock-${Date.now().toString(36)}`;
    console.info("[mock] application received", {
      id,
      courseId: input.courseId,
      branchId: input.branchId ?? null,
      status: input.status,
      locale: input.locale,
      phone: input.phone.replace(/\d(?=\d{2})/g, "•"),
    });
    await new Promise((r) => setTimeout(r, 600));
    return { id };
  },
};
