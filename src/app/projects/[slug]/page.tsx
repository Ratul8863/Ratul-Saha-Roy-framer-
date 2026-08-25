import type { Metadata } from "next";
import { getProjectBySlug, PROJECTS } from "@/lib/projects";
import {
  projectJsonLd,
  projectSeoDescription,
  projectSeoKeywords,
  projectSeoTitle,
} from "@/lib/project-seo";
import { getSiteUrl } from "@/lib/site";
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

  const base = getSiteUrl();
  const canonical = `${base}/projects/${slug}`;
  const title = projectSeoTitle(project);
  const description = projectSeoDescription(project);
  const ogImage = project.image.startsWith("http")
    ? project.image
    : new URL(project.image, base).toString();

  return {
    title,
    description,
    alternates: { canonical },
    keywords: projectSeoKeywords(project),
    authors: [{ name: "Ratul Saha Roy", url: base }],
    creator: "Ratul Saha Roy",
    openGraph: {
      url: canonical,
      title,
      description,
      type: "article",
      siteName: "Ratul Saha Roy",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — built by Ratul Saha Roy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
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
        "max-snippet": -1,
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
  const project = getProjectBySlug(slug);

  return (
    <>
      {project ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectJsonLd(project)),
          }}
        />
      ) : null}
      {/* Crawler-visible attribution: ties live brand ↔ you */}
      {project ? (
        <p className="sr-only">
          {project.title} was developed by Ratul Saha Roy.
          {project.seoAliases?.length
            ? ` Also known as: ${project.seoAliases.join(", ")}.`
            : ""}{" "}
          Live website: {project.link}. Full case study on Ratul Saha Roy&apos;s
          portfolio at {getSiteUrl()}/projects/{project.slug}.
        </p>
      ) : null}
      <ProjectDetailPage slug={slug} />
    </>
  );
}
