import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS } from "@/lib/projects";
import { getSiteUrl, siteName } from "@/lib/site";
import ProjectDetailPage from "@/views/ProjectDetailPage";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }
  const title = project.title;
  const description = project.description;
  const base = getSiteUrl();
  const canonical = `${base}/projects/${slug}`;
  const ogImage = project.image.startsWith("http")
    ? project.image
    : new URL(project.image, base).toString();

  return {
    title,
    description,
    alternates: { canonical },
    keywords: [...project.tags, "case study", "MERN", siteName],
    openGraph: {
      url: canonical,
      title: `${project.title} · Case study`,
      description,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · ${siteName}`,
      description,
      images: [ogImage],
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
}

/**
 * SSG via generateStaticParams. Data is static (TypeScript module), not ISR —
 * redeploy to refresh. If you move projects to a CMS, add `export const revalidate = 3600`
 * and fetch in this file or in a Server Component wrapper.
 */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ProjectDetailPage slug={slug} />;
}
