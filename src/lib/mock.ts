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
    return [
      {
        id: "c-office",
        slug: "office-it-foundation",
        category: "office",
        title: {
          uz: "Office / IT Foundation",
          ru: "Office / IT Foundation",
          en: "Office / IT Foundation",
        },
        summary: {
          uz: "Kompyuter savodxonligi va amaliy dasturlar bilan ishonchli ishlash.",
          ru: "Компьютерная грамотность и уверенная работа с прикладными программами.",
          en: "Computer literacy and confident work with everyday productivity tools.",
        },
        durationMonths: 2,
        level: "beginner",
        branchIds: ["tashkent", "samarkand", "andijan"],
      },
      {
        id: "c-design",
        slug: "graphic-design",
        category: "design",
        title: {
          uz: "Grafik dizayn",
          ru: "Графический дизайн",
          en: "Graphic Design",
        },
        summary: {
          uz: "Ijodiy va texnologik ko‘nikmalarni rivojlantiruvchi dastur.",
          ru: "Программа, развивающая творческие и технические навыки.",
          en: "A program that builds creative and technical skills together.",
        },
        durationMonths: 5,
        level: "beginner",
        branchIds: ["tashkent", "samarkand"],
      },
      {
        id: "c-frontend",
        slug: "frontend-development",
        category: "programming",
        title: {
          uz: "Frontend dasturlash",
          ru: "Frontend-разработка",
          en: "Frontend Development",
        },
        summary: {
          uz: "HTML, CSS, JavaScript va React bilan real loyihalar yaratish.",
          ru: "Создание реальных проектов на HTML, CSS, JavaScript и React.",
          en: "Build real projects with HTML, CSS, JavaScript and React.",
        },
        durationMonths: 8,
        level: "intermediate",
        branchIds: ["tashkent", "andijan"],
      },
      {
        id: "c-python",
        slug: "python-backend",
        category: "programming",
        title: {
          uz: "Python va backend",
          ru: "Python и backend",
          en: "Python & Backend",
        },
        summary: {
          uz: "Python, ma’lumotlar bazasi va API yaratish asoslaridan boshlab.",
          ru: "От основ Python до баз данных и создания API.",
          en: "From Python basics to databases and building APIs.",
        },
        durationMonths: 8,
        level: "intermediate",
        branchIds: ["tashkent"],
      },
      {
        id: "c-smm",
        slug: "smm-marketing",
        category: "marketing",
        title: {
          uz: "SMM va marketing",
          ru: "SMM и маркетинг",
          en: "SMM & Marketing",
        },
        summary: {
          uz: "Kontent, reklama va tahlil: brendni ijtimoiy tarmoqlarda o‘stirish.",
          ru: "Контент, реклама и аналитика: развитие бренда в соцсетях.",
          en: "Content, ads and analytics: growing a brand on social media.",
        },
        durationMonths: 4,
        level: "beginner",
        branchIds: ["samarkand", "andijan"],
      },
    ];
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
};
