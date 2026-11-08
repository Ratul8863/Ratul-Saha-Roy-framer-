"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { hasMongoUri } from "@/lib/env";
import { loginSchema } from "@/features/auth/schema";
import type { ActionResult } from "@/types";

export async function loginAction(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid email or password.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  if (!hasMongoUri()) {
    return {
      success: false,
      message:
        "MONGODB_URI is not configured. Auth requires a MongoDB connection in production.",
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, message: "Unable to sign in." };
    }

    return { success: true, message: "Signed in successfully." };
  } catch {
    return {
      success: false,
      message: "Invalid credentials or auth service unavailable.",
    };
  }
}
