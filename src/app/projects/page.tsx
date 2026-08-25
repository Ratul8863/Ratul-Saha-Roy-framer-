import type { Metadata } from "next";
import ProjectsPage from "@/views/ProjectsPage";
import { projectsItemListJsonLd } from "@/lib/project-seo";
import { getSiteUrl, siteName } from "@/lib/site";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/projects`;

export const metadata: Metadata = {
  title: `Projects & Case Studies by ${siteName}`,
  description: `All portfolio projects by ${siteName} — Assubah (assubah.com), As-Subah Outreach, MK Heating, AJ Cleaning London, EcoScrap, MUGAS, and more live sites & MERN builds.`,
  keywords: [
    `${siteName} projects`,
    `${siteName} portfolio`,
    "Assubah developer",
    "As-Subah Academy",
    "As-Subah Outreach",
    "MK Heating website",
    "web developer case studies",
    "MERN projects Bangladesh",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    url: pageUrl,
    title: `Projects & Case Studies by ${siteName}`,
    description: `Shipped work by ${siteName}: Assubah, As-Subah Outreach, client sites, and full-stack products.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects & Case Studies by ${siteName}`,
    description: `Shipped work by ${siteName}: Assubah, As-Subah Outreach, client sites, and full-stack products.`,
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsItemListJsonLd()),
        }}
      />
      <ProjectsPage />
    </>
  );
}
