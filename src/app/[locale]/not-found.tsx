import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-amber">404</p>
        <h1 className="mt-4 font-display text-xl">Sahifa topilmadi · Страница не найдена · Page not found</h1>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-majolica px-6 py-3 font-semibold text-ink"
        >
          IT Shaharcha
        </Link>
      </div>
    </main>
  );
}
