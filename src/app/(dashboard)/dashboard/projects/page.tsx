import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardProjects } from "@/features/projects/actions";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Projects · Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardProjectsPage() {
  const projects = await getDashboardProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase text-navy">Projects</h1>
        <p className="mt-2 font-body text-sm text-text-muted">
          Published and draft portfolio projects.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create projects via the API once MongoDB is connected."
        />
      ) : (
        <ul className="divide-y divide-navy/10 border border-navy/10 bg-white">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-ui text-sm font-semibold text-navy">
                  {project.title}
                </p>
                <p className="font-body text-xs text-text-muted">
                  {project.category} · {project.published ? "Published" : "Draft"}
                </p>
              </div>
              <Link
                href={`/projects/${project.slug}`}
                className="font-ui text-xs font-medium text-slate underline-offset-4 hover:underline"
              >
                View public page
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
