import { mockCourses } from "./mock-courses";
import type { DataSource } from "./types";

/**
 * MOCK DATA — placeholder content until the real API is connected.
 * Only the 2500 (students) and 350 figures come from the current live site;
 * branches, courses, team and testimonials are invented for development.
 */
export const mockSource: DataSource = {
  async branches() {
    return [
      { id: "tashkent", name: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" } },
      { id: "samarkand", name: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" } },
      { id: "andijan", name: { uz: "Andijon", ru: "Андижан", en: "Andijan" } },
    ];
  },

  async courses() {
    return mockCourses;
  },

  async team() {
    return [
      { id: "t1", name: "Mentor A.", role: { uz: "Frontend mentori", ru: "Ментор по Frontend", en: "Frontend mentor" } },
      { id: "t2", name: "Mentor B.", role: { uz: "Dizayn mentori", ru: "Ментор по дизайну", en: "Design mentor" } },
      { id: "t3", name: "Mentor C.", role: { uz: "Backend mentori", ru: "Ментор по Backend", en: "Backend mentor" } },
      { id: "t4", name: "Mentor D.", role: { uz: "Marketing mentori", ru: "Ментор по маркетингу", en: "Marketing mentor" } },
    ];
  },

  async testimonials() {
    return [
      {
        id: "r1",
        author: "Bitiruvchi A.",
        course: { uz: "Frontend dasturlash", ru: "Frontend-разработка", en: "Frontend Development" },
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
        course: { uz: "SMM va marketing", ru: "SMM и маркетинг", en: "SMM & Marketing" },
        quote: {
          uz: "Bepul coworking juda qo‘l keldi: dars tugagach ham shu yerda ishlayman.",
          ru: "Бесплатный коворкинг очень выручил: после занятий я продолжаю работать здесь.",
          en: "The free coworking space helped a lot: I keep working here after class.",
        },
      },
    ];
  },

  async stats() {
    return { students: 2500, mentors: 350, directions: 4, branches: 3 };
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
