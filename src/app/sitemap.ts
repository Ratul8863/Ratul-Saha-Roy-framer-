import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
