import type { ProjectDocument } from "@/models/Project";
import type { ProjectDTO } from "@/types";
import { connectMongo } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { hasMongoUri } from "@/lib/env";
import {
  featuredProjects,
  playgroundProjects,
  portfolioAllProjects,
  portfolioCaseStudies,
} from "@/constants/projects";

function toDTO(doc: ProjectDocument): ProjectDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    description: doc.description,
    role: doc.role,
    category: doc.category,
    coverImage: doc.coverImage,
    featured: doc.featured,
    published: doc.published,
    tags: doc.tags ?? [],
    order: doc.order ?? 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function staticProjects(): ProjectDTO[] {
  const featured = featuredProjects.map((project, index) => ({
    id: `static-featured-${project.slug}`,
    title: project.title,
    slug: project.slug,
    summary: project.description,
    description: project.description,
    role: project.role.join(" / "),
    category: project.category,
    coverImage: project.coverImage,
    featured: project.featured,
    published: true,
    tags: [],
    order: index,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));

  const playground = playgroundProjects.map((project, index) => ({
    id: `static-play-${project.slug}`,
    title: project.title,
    slug: project.slug,
    summary: `${project.title} exploratory design work.`,
    description: `${project.title} is part of the playground collection exploring product and interface ideas.`,
    role: "Software Developer",
    category: "Playground",
    coverImage: "/assets/featured-framed.png",
    featured: false,
    published: true,
    tags: ["playground"],
    order: 100 + index,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));

  const knownSlugs = new Set([
    ...featured.map((project) => project.slug),
    ...playground.map((project) => project.slug),
  ]);

  const caseStudies = portfolioCaseStudies
    .filter((project) => !knownSlugs.has(project.slug))
    .map((project, index) => ({
      id: `static-case-${project.slug}`,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: `${project.summary} ${project.about}`,
      role: "UI Designer",
      category: "Featured",
      coverImage: project.coverImage,
      featured: true,
      published: true,
      tags: ["case-study"],
      order: 200 + index,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    }));

  caseStudies.forEach((project) => knownSlugs.add(project.slug));

  const listExtras = portfolioAllProjects
    .filter((project) => !knownSlugs.has(project.slug))
    .map((project, index) => ({
      id: `static-list-${project.slug}`,
      title: project.title,
      slug: project.slug,
      summary: `${project.title} — ${project.category}.`,
      description: `${project.title} is a ${project.category} project from ${project.year}.`,
      role: "UI Designer",
      category: project.category,
      coverImage: "/assets/featured-framed.png",
      featured: false,
      published: true,
      tags: [],
      order: 300 + index,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    }));

  return [...featured, ...playground, ...caseStudies, ...listExtras];
}

export async function listProjects(options?: {
  publishedOnly?: boolean;
}): Promise<ProjectDTO[]> {
  if (!hasMongoUri()) {
    return staticProjects().filter((project) =>
      options?.publishedOnly === false ? true : project.published
    );
  }

  try {
    await connectMongo();
    const query =
      options?.publishedOnly === false ? {} : { published: true };
    const docs = await Project.find(query).sort({ order: 1, createdAt: -1 });
    if (docs.length === 0) {
      return staticProjects();
    }
    return docs.map(toDTO);
  } catch {
    return staticProjects();
  }
}

export async function getProjectBySlugService(
  slug: string
): Promise<ProjectDTO | null> {
  if (!hasMongoUri()) {
    return staticProjects().find((project) => project.slug === slug) ?? null;
  }

  try {
    await connectMongo();
    const doc = await Project.findOne({ slug, published: true });
    if (!doc) {
      return staticProjects().find((project) => project.slug === slug) ?? null;
    }
    return toDTO(doc);
  } catch {
    return staticProjects().find((project) => project.slug === slug) ?? null;
  }
}

export async function createProjectService(
  input: Omit<ProjectDTO, "id" | "createdAt" | "updatedAt">
): Promise<ProjectDTO> {
  await connectMongo();
  const doc = await Project.create(input);
  return toDTO(doc);
}

export async function updateProjectService(
  id: string,
  input: Partial<Omit<ProjectDTO, "id" | "createdAt" | "updatedAt">>
): Promise<ProjectDTO | null> {
  await connectMongo();
  const doc = await Project.findByIdAndUpdate(id, input, { new: true });
  return doc ? toDTO(doc) : null;
}

export async function deleteProjectService(id: string): Promise<boolean> {
  await connectMongo();
  const result = await Project.findByIdAndDelete(id);
  return Boolean(result);
}
