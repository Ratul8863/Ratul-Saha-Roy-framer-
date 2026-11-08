"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { hasMongoUri } from "@/lib/env";
import { projectSchema } from "@/features/projects/schema";
import {
  createProjectService,
  deleteProjectService,
  listProjects,
  updateProjectService,
} from "@/features/projects/services/project-service";
import type { ActionResult, ProjectDTO } from "@/types";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getDashboardProjects(): Promise<ProjectDTO[]> {
  return listProjects({ publishedOnly: false });
}

export async function createProjectAction(
  input: unknown
): Promise<ActionResult<ProjectDTO>> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }
  if (!hasMongoUri()) {
    return {
      success: false,
      message: "MONGODB_URI is required to manage projects.",
    };
  }

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid project data.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const project = await createProjectService(parsed.data);
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return {
      success: true,
      message: "Project created.",
      data: project,
    };
  } catch {
    return { success: false, message: "Failed to create project." };
  }
}

export async function updateProjectAction(
  id: string,
  input: unknown
): Promise<ActionResult<ProjectDTO>> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }
  if (!hasMongoUri()) {
    return {
      success: false,
      message: "MONGODB_URI is required to manage projects.",
    };
  }

  const parsed = projectSchema.partial().safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid project data.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const project = await updateProjectService(id, parsed.data);
    if (!project) {
      return { success: false, message: "Project not found." };
    }
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    return {
      success: true,
      message: "Project updated.",
      data: project,
    };
  } catch {
    return { success: false, message: "Failed to update project." };
  }
}

export async function deleteProjectAction(
  id: string
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }
  if (!hasMongoUri()) {
    return {
      success: false,
      message: "MONGODB_URI is required to manage projects.",
    };
  }

  try {
    const deleted = await deleteProjectService(id);
    if (!deleted) {
      return { success: false, message: "Project not found." };
    }
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return { success: true, message: "Project deleted." };
  } catch {
    return { success: false, message: "Failed to delete project." };
  }
}
