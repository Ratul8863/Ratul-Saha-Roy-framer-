/**
 * Server-safe project data accessors (static module; no fetch).
 * Use from Server Components, generateMetadata, generateStaticParams.
 */
export {
  PROJECTS,
  getProjectBySlug,
  getProjectNeighbors,
  type Project,
} from "@/data/projects";
