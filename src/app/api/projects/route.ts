import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { jsonCreated, jsonError, jsonSuccess } from "@/lib/api-response";
import { hasMongoUri } from "@/lib/env";
import {
  createProjectService,
  listProjects,
} from "@/features/projects/services/project-service";

export async function GET() {
  const projects = await listProjects();
  return jsonSuccess(projects);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  if (!hasMongoUri()) {
    return jsonError("MONGODB_URI is required to create projects.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 422, parsed.error.flatten());
  }

  try {
    const project = await createProjectService(parsed.data);
    return jsonCreated(project, "Project created.");
  } catch {
    return jsonError("Failed to create project.", 500);
  }
}
