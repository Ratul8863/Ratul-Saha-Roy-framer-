import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/section-container";
import { listProjects } from "@/features/projects/services/project-service";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected full-stack, client, and community projects by Ratul Saha Roy.",
};

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <SectionContainer className="py-16 md:py-24">
      <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-none text-navy">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl font-body text-text-muted">
        A collection of featured case studies and playground explorations.
      </p>
      <ul className="mt-12 divide-y divide-navy/10 border-y border-navy/10">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.slug}`}
              className="flex flex-col gap-2 py-6 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-display text-2xl uppercase text-navy md:text-3xl">
                {project.title}
              </span>
              <span className="font-ui text-sm text-slate">{project.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
