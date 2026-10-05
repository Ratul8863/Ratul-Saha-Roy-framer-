import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ratul Saha Roy",
    short_name: "Ratul Saha Roy",
    description:
      "Ratul Saha Roy — Software Developer working across Full-Stack, AI/ML & Research. Portfolio of shipped projects, awards, and case studies.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#0f0f0f",
    icons: [
      {
        src: "/ratul-saha-roy-profile-v3.png",
        sizes: "96x96",
        type: "image/png",
      },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
