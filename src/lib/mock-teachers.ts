import type { Localized, RawTeacher } from "./types";

/** MOCK DATA — invented teachers for development. Replace with real profiles from the API. */

const L = (uz: string, ru: string, en: string): Localized => ({ uz, ru, en });

export const mockTeachers: RawTeacher[] = [
  {
    id: "t-jasur",
    slug: "jasur-karimov",
    name: "Jasur Karimov",
    role: L("Frontend mentori", "Ментор по Frontend", "Frontend mentor"),
    bio: L(
      "6 yildan beri veb-ilovalar yasaydi: avval agentlikda, keyin mahsulot jamoasida. Darslarda har bir mavzuni real loyiha misolida ko‘rsatadi va har bir o‘quvchining kodini alohida tekshiradi.",
      "6 лет делает веб-приложения: сначала в агентстве, затем в продуктовой команде. На занятиях показывает каждую тему на реальном проекте и проверяет код каждого ученика.",
      "Has built web apps for 6 years, first at an agency, then in a product team. Shows every topic on a real project and reviews each student’s code personally.",
    ),
    motto: L("Eng yaxshi dars — o‘zing yozgan kod.", "Лучший урок — код, который написал сам.", "The best lesson is code you wrote yourself."),
    experienceYears: 6,
    studentsTaught: 340,
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Git"],
    branchIds: ["toshloq", "margilan"],
  },
  {
    id: "t-aziz",
    slug: "aziz-rahimov",
    name: "Aziz Rahimov",
    role: L("Backend va mobil mentor", "Ментор по backend и мобильной разработке", "Backend & mobile mentor"),
    bio: L(
      "Python va Flutter bo‘yicha mutaxassis. Startaplar uchun server va mobil ilovalar yasagan. O‘quvchilarga murakkab narsani oddiy tilda tushuntirishni yaxshi ko‘radi.",
      "Специалист по Python и Flutter. Делал серверы и мобильные приложения для стартапов. Любит объяснять сложное простым языком.",
      "A Python and Flutter specialist who has built servers and mobile apps for startups. Loves explaining hard things in plain words.",
    ),
    motto: L("Avval ishlasin, keyin chiroyli bo‘lsin.", "Сначала пусть работает, потом — красиво.", "Make it work first, then make it pretty."),
    experienceYears: 7,
    studentsTaught: 410,
    skills: ["Python", "Django", "PostgreSQL", "Docker", "Dart", "Flutter", "Firebase"],
    branchIds: ["toshloq"],
  },
  {
    id: "t-malika",
    slug: "malika-yusupova",
    name: "Malika Yusupova",
    role: L("Grafik dizayn mentori", "Ментор по графическому дизайну", "Graphic design mentor"),
    bio: L(
      "Brend identifikatsiyasi va ijtimoiy tarmoq dizayni bilan shug‘ullanadi. O‘quvchilari bilan birga haqiqiy buyurtmalarga o‘xshash topshiriqlar ustida ishlaydi.",
      "Занимается айдентикой брендов и дизайном для соцсетей. Вместе с учениками работает над заданиями, похожими на реальные заказы.",
      "Works on brand identity and social media design, and has students tackle briefs that look like real client work.",
    ),
    motto: L("Dizayn — bu chiroy emas, yechim.", "Дизайн — это не красота, а решение.", "Design isn’t decoration, it’s a solution."),
    experienceYears: 5,
    studentsTaught: 260,
    skills: ["Figma", "Photoshop", "Illustrator", "Branding", "Typography"],
    branchIds: ["toshloq", "fergana"],
  },
  {
    id: "t-bekzod",
    slug: "bekzod-tursunov",
    name: "Bekzod Tursunov",
    role: L("Robototexnika va 3D mentori", "Ментор по робототехнике и 3D", "Robotics & 3D mentor"),
    bio: L(
      "Muhandis. O‘quvchilari bilan viloyat va respublika robototexnika musobaqalarida qatnashgan. 3D printerlarni o‘zi yig‘adi va sozlaydi.",
      "Инженер. С учениками участвовал в областных и республиканских соревнованиях по робототехнике. Сам собирает и настраивает 3D-принтеры.",
      "An engineer who has taken students to regional and national robotics competitions. Builds and tunes 3D printers himself.",
    ),
    motto: L("Qo‘l bilan yig‘ilgan narsa esdan chiqmaydi.", "То, что собрал руками, не забывается.", "What you build with your hands, you never forget."),
    experienceYears: 8,
    studentsTaught: 380,
    skills: ["Arduino", "C++", "Electronics", "Fusion 360", "3D printing"],
    branchIds: ["toshloq", "fergana"],
  },
  {
    id: "t-nigora",
    slug: "nigora-aliyeva",
    name: "Nigora Aliyeva",
    role: L("Ingliz tili o‘qituvchisi", "Преподаватель английского", "English teacher"),
    bio: L(
      "IELTS 8.0. Darslarini muloqotga qurib, har bir darsda gapirish amaliyotiga ko‘p vaqt ajratadi. IT uchun ingliz tili bo‘yicha alohida modul muallifi.",
      "IELTS 8.0. Строит уроки вокруг общения и много времени отдаёт разговорной практике. Автор отдельного модуля английского для IT.",
      "IELTS 8.0. Builds lessons around conversation with lots of speaking practice, and wrote the English-for-IT module.",
    ),
    motto: L("Xato qilishdan qo‘rqmang — gapiring.", "Не бойтесь ошибок — говорите.", "Don’t fear mistakes — speak."),
    experienceYears: 9,
    studentsTaught: 620,
    skills: ["IELTS", "Speaking", "Grammar", "English for IT"],
    branchIds: ["toshloq", "fergana", "margilan"],
  },
  {
    id: "t-dilnoza",
    slug: "dilnoza-hasanova",
    name: "Dilnoza Hasanova",
    role: L("Kompyuter savodxonligi va Scratch", "Компьютерная грамотность и Scratch", "Computer literacy & Scratch"),
    bio: L(
      "Yangi boshlovchilar bilan ishlash ustasi. Kattalarga ham, bolalarga ham kompyuterni qo‘rqmasdan ishlatishni o‘rgatadi.",
      "Мастер работы с новичками. Учит и взрослых, и детей пользоваться компьютером без страха.",
      "Great with beginners: teaches adults and kids alike to use a computer without fear.",
    ),
    motto: L("Har bir mutaxassis bir kun boshlovchi bo‘lgan.", "Каждый специалист когда-то был новичком.", "Every expert was once a beginner."),
    experienceYears: 4,
    studentsTaught: 520,
    skills: ["Windows", "Word", "Excel", "PowerPoint", "Scratch"],
    branchIds: ["toshloq", "margilan"],
  },
];
