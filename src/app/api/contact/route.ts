import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { jsonCreated, jsonError } from "@/lib/api-response";
import { hasMongoUri } from "@/lib/env";
import { connectMongo } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 422, parsed.error.flatten());
  }

  if (!hasMongoUri()) {
    return jsonError(
      "MONGODB_URI is not configured. Contact submissions require a database.",
      503
    );
  }

  try {
    await connectMongo();
    const doc = await ContactMessage.create(parsed.data);
    return jsonCreated(
      {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        status: doc.status,
      },
      "Message received."
    );
  } catch {
    return jsonError("Failed to save message.", 500);
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "POST contact form payloads to this endpoint.",
  });
}
