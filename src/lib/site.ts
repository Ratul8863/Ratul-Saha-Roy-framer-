/** Canonical site URL for metadata / Open Graph (set in production). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}

export const siteName = "Ratul Saha Roy";
export const defaultDescription =
  "Full stack web developer (MERN) based in Sylhet, Bangladesh — modern responsive apps, smooth motion, and interfaces that feel as good as they look.";
