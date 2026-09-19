import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IT Shaharcha",
    short_name: "IT Shaharcha",
    description: "Yoshlar axborot texnologiyalari markazi",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f2c",
    theme_color: "#0a0f2c",
    lang: "uz",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
