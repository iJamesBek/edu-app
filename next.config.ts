import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The site serves one location; old branch URLs point to the contact page
  async redirects() {
    return [
      { source: "/branches/:path*", destination: "/contact", permanent: true },
      { source: "/:locale(ru|en)/branches/:path*", destination: "/:locale/contact", permanent: true },
    ];
  },
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
