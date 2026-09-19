import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Teacher photos and other media from the backend
    remotePatterns: [
      { protocol: "https", hostname: "itshaharcha.pythonanywhere.com" },
      ...(process.env.EDU_MEDIA_HOST ? [{ protocol: "https" as const, hostname: process.env.EDU_MEDIA_HOST }] : []),
    ],
  },
};

export default withNextIntl(nextConfig);
