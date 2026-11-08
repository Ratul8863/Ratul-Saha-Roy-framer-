"use server";

import { contactSchema } from "@/features/contact/schema";
import type { SubmitContactResult } from "@/features/contact/types";
import { hasMongoUri } from "@/lib/env";
import { connectMongo } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";

export async function submitContact(
  input: unknown
): Promise<SubmitContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  if (!hasMongoUri()) {
    return {
      success: false,
      message:
        "Database is not configured. Set MONGODB_URI to enable contact submissions.",
    };
  }

  try {
    await connectMongo();
    const doc = await ContactMessage.create(parsed.data);
    return {
      success: true,
      message: "Message sent successfully. I'll get back to you soon.",
      data: {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        message: doc.message,
        status: doc.status,
        createdAt: doc.createdAt.toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      message: "Unable to send your message right now. Please try again.",
    };
  }
}
