import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

// Locale params come from the parent layout's generateStaticParams.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "IT Shaharcha";

const TOWERS = [
  { x: 640, w: 110, h: 300, c: "#22c7d6" },
  { x: 770, w: 130, h: 420, c: "#5b4bdb" },
  { x: 920, w: 100, h: 250, c: "#22c7d6" },
  { x: 1040, w: 120, h: 350, c: "#5b4bdb" },
];

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });
  // Unbounded/Onest are not loaded here; the default font covers Latin and Cyrillic.

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(160deg, #121a45 0%, #0a0f2c 70%)",
          color: "#eef2fa",
          padding: 72,
        }}
      >
        {TOWERS.map((b) => (
          <div
            key={b.x}
            style={{
              position: "absolute",
              left: b.x,
              bottom: 0,
              width: b.w,
              height: b.h,
              background: b.c,
              opacity: 0.85,
              borderRadius: "10px 10px 0 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              padding: 18,
            }}
          >
            {Array.from({ length: Math.floor(b.h / 60) * 2 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: (b.w - 50) / 2,
                  height: 22,
                  borderRadius: 3,
                  background: i % 3 === 0 ? "#0a0f2c" : "#ffc15e",
                }}
              />
            ))}
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", width: 560, zIndex: 1 }}>
          <div style={{ fontSize: 34, color: "#ffc15e", fontWeight: 700 }}>IT Shaharcha</div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.08, marginTop: 28 }}>
            {t("title")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
