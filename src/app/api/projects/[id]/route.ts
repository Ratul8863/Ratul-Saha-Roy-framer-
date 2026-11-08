import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { hasMongoUri } from "@/lib/env";
import {
  deleteProjectService,
  getProjectBySlugService,
  listProjects,
  updateProjectService,
} from "@/features/projects/services/project-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const projects = await listProjects({ publishedOnly: false });
  const byId = projects.find((project) => project.id === id);
  if (byId) return jsonSuccess(byId);

  const bySlug = await getProjectBySlugService(id);
  if (!bySlug) return jsonError("Project not found.", 404);
  return jsonSuccess(bySlug);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return jsonError("Unauthorized.", 401);
  if (!hasMongoUri()) {
    return jsonError("MONGODB_URI is required to update projects.", 503);
  }

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 422, parsed.error.flatten());
  }

  try {
    const project = await updateProjectService(id, parsed.data);
    if (!project) return jsonError("Project not found.", 404);
    return jsonSuccess(project, { message: "Project updated." });
  } catch {
    return jsonError("Failed to update project.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return jsonError("Unauthorized.", 401);
  if (!hasMongoUri()) {
    return jsonError("MONGODB_URI is required to delete projects.", 503);
  }

  const { id } = await context.params;
  try {
    const deleted = await deleteProjectService(id);
    if (!deleted) return jsonError("Project not found.", 404);
    return jsonSuccess({ id }, { message: "Project deleted." });
  } catch {
    return jsonError("Failed to delete project.", 500);
  }
}
