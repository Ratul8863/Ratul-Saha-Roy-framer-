/** Production domain — never fall back to Vercel preview URLs in sitemap/OG. */
export const PRODUCTION_SITE_URL = "https://ratul-saha-roy.pro.bd";

/** Canonical site URL for metadata / Open Graph / sitemap. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  if (process.env.VERCEL_ENV === "production") return PRODUCTION_SITE_URL;

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return PRODUCTION_SITE_URL;
}

export const siteName = "Ratul Saha Roy";

export {
  buildCrawlSummary,
  buildDefaultDescription,
  buildSiteSeoKeywords,
  SEO_BIO,
} from "@/lib/seo-entities";

import {
  buildDefaultDescription,
  buildSiteSeoKeywords,
} from "@/lib/seo-entities";

export const defaultDescription = buildDefaultDescription();
export const seoKeywords = buildSiteSeoKeywords();

export const shortDescription =
  "Junior Software Developer at Kode By Kraft · CSE @ Metropolitan University, Sylhet · Full Stack (MERN) · Assubah, EcoScrap, Hult Prize, NASA Space Apps.";
