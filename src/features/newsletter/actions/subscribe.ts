"use server";

import { newsletterSchema } from "@/features/newsletter/schema";
import type { ActionResult, NewsletterDTO } from "@/types";
import { hasMongoUri } from "@/lib/env";
import { connectMongo } from "@/lib/mongodb";
import { Newsletter } from "@/models/Newsletter";

export async function subscribeNewsletter(
  input: unknown
): Promise<ActionResult<NewsletterDTO>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid email address.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  if (!hasMongoUri()) {
    return {
      success: false,
      message:
        "Database is not configured. Set MONGODB_URI to enable newsletter subscriptions.",
    };
  }

  try {
    await connectMongo();
    const existing = await Newsletter.findOne({ email: parsed.data.email });
    if (existing) {
      return {
        success: true,
        message: "You're already subscribed. Thanks for staying connected!",
        data: {
          id: String(existing._id),
          email: existing.email,
          createdAt: existing.createdAt.toISOString(),
        },
      };
    }

    const doc = await Newsletter.create(parsed.data);
    return {
      success: true,
      message: "Subscribed successfully.",
      data: {
        id: String(doc._id),
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      message: "Unable to subscribe right now. Please try again.",
    };
  }
}
