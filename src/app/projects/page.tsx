import type { Metadata } from "next";
import ProjectsPage from "@/views/ProjectsPage";
import { getSiteUrl, siteName } from "@/lib/site";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/projects`;

export const metadata: Metadata = {
  title: "Project archive",
  description: `All portfolio projects and case studies by ${siteName} — MERN builds, live sites, and experiments.`,
  alternates: { canonical: pageUrl },
  openGraph: {
    url: pageUrl,
    title: `Project archive · ${siteName}`,
    description: `Full list of shipped work and case studies by ${siteName}.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Project archive · ${siteName}`,
    description: `Full list of shipped work and case studies by ${siteName}.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

/** SSG: static grid; 3D tilt cards remain client-only in the view. */
export default function Page() {
  return <ProjectsPage />;
}
