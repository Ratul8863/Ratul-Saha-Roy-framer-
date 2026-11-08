import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { jsonCreated, jsonError, jsonSuccess } from "@/lib/api-response";
import { hasMongoUri } from "@/lib/env";
import { connectMongo } from "@/lib/mongodb";
import { Newsletter } from "@/models/Newsletter";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed.", 422, parsed.error.flatten());
  }

  if (!hasMongoUri()) {
    return jsonError(
      "MONGODB_URI is not configured. Newsletter subscriptions require a database.",
      503
    );
  }

  try {
    await connectMongo();
    const existing = await Newsletter.findOne({ email: parsed.data.email });
    if (existing) {
      return jsonSuccess(
        { id: String(existing._id), email: existing.email },
        { message: "Already subscribed." }
      );
    }

    const doc = await Newsletter.create(parsed.data);
    return jsonCreated(
      { id: String(doc._id), email: doc.email },
      "Subscribed successfully."
    );
  } catch {
    return jsonError("Failed to subscribe.", 500);
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "POST { email } to subscribe.",
  });
}
