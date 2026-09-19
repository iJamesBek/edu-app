import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IT Shaharcha",
    short_name: "IT Shaharcha",
    description: "Dasturlash, dizayn va marketing o‘quv markazi",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f2c",
    theme_color: "#0a0f2c",
    lang: "uz",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
