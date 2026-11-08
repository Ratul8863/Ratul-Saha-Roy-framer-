import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionContainer } from "@/components/layout/section-container";
import {
  getProjectBySlugService,
  listProjects,
} from "@/features/projects/services/project-service";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugService(slug);
  if (!project) {
    return { title: "Project not found" };
  }
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugService(slug);
  if (!project) notFound();

  return (
    <SectionContainer className="py-16 md:py-24">
      <Link
        href="/projects"
        className="font-ui text-sm text-slate hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
      >
        ← All projects
      </Link>
      <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,4.75rem)] uppercase leading-none text-navy">
        {project.title}
      </h1>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-ui text-sm text-text-muted">
        <span>{project.role}</span>
        <span>{project.category}</span>
      </div>
      <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-text-muted md:text-lg">
        {project.description}
      </p>
      <div className="mt-10 overflow-hidden border border-navy/10">
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          width={1400}
          height={900}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </SectionContainer>
  );
}
