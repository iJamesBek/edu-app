import { mockCourses } from "./mock-courses";
import { mockPosts } from "./mock-posts";
import { mockTeachers } from "./mock-teachers";
import type { DataSource } from "./types";

/**
 * MOCK DATA — placeholder content until the real API is connected.
 * Only the 2500 (students) and 350 figures come from the current live site;
 * the Toshloq branch address and hours are real (old site); everything else is invented.
 */
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
    return mockTeachers;
  },

  async testimonials() {
    return [
      {
        id: "r1",
        author: "Bitiruvchi A.",
        course: { uz: "Web dasturlash (Frontend)", ru: "Веб-разработка (Frontend)", en: "Web Development (Frontend)" },
        quote: {
          uz: "Bu yerda nazariya emas, amaliyot ko‘p. Birinchi loyihamni kursning o‘rtasidayoq topshirdim.",
          ru: "Здесь много практики, а не теории. Первый проект я сдал уже в середине курса.",
          en: "Lots of practice, not just theory. I shipped my first project halfway through the course.",
        },
      },
      {
        id: "r2",
        author: "Bitiruvchi B.",
        course: { uz: "Grafik dizayn", ru: "Графический дизайн", en: "Graphic Design" },
        quote: {
          uz: "Mentorlar har bir ishimni birga tahlil qilishdi. Portfolio tayyor bo‘lgach, birinchi buyurtma keldi.",
          ru: "Менторы разбирали каждую мою работу. Когда портфолио было готово, пришёл первый заказ.",
          en: "Mentors reviewed every piece with me. My first client came once the portfolio was ready.",
        },
      },
      {
        id: "r3",
        author: "Bitiruvchi C.",
        course: { uz: "Robototexnika", ru: "Робототехника", en: "Robotics" },
        quote: {
          uz: "Birinchi robotimiz chiziq bo‘ylab yurganda butun guruh qarsak chaldi. Endi musobaqaga tayyorlanyapmiz.",
          ru: "Когда наш первый робот поехал по линии, вся группа аплодировала. Теперь готовимся к соревнованиям.",
          en: "When our first robot followed the line, the whole group applauded. Now we are preparing for a competition.",
        },
      },
    ];
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
      locale: input.locale,
      phone: input.phone.replace(/\d(?=\d{2})/g, "•"),
    });
    await new Promise((r) => setTimeout(r, 600));
    return { id };
  },
};
