import type { Metadata } from "next";
import LandingPage from "@/views/LandingPage";
import { PROJECTS } from "@/data/projects";
import { ACHIEVEMENTS } from "@/data/achievements";
import {
  buildCrawlSummary,
  defaultDescription,
  getSiteUrl,
  seoKeywords,
} from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: `Ratul Saha Roy — Software Developer | Full-Stack, AI/ML & Research`,
  description: defaultDescription,
  keywords: seoKeywords,
  alternates: { canonical: siteUrl },
  openGraph: {
    url: siteUrl,
    title: `Ratul Saha Roy — Software Developer | Full-Stack, AI/ML & Research`,
    description: defaultDescription,
    type: "website",
    siteName: "Ratul Saha Roy",
  },
  twitter: {
    card: "summary_large_image",
    title: `Ratul Saha Roy — Software Developer | Full-Stack, AI/ML & Research`,
    description: defaultDescription,
  },
};

/** SSG: static shell — projects/achievements come from the server so SSR and client share one snapshot. */
export default function Page() {
  return (
    <>
      {/* Full entity crawl text: projects, awards, company, university */}
      <p className="sr-only">{buildCrawlSummary()}</p>
      <LandingPage projects={PROJECTS} achievements={ACHIEVEMENTS} />
    </>
  );
}
