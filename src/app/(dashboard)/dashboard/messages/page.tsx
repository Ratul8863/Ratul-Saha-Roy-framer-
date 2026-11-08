import type { Metadata } from "next";
import { hasMongoUri } from "@/lib/env";
import { connectMongo } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Messages · Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardMessagesPage() {
  if (!hasMongoUri()) {
    return (
      <div className="space-y-8">
        <h1 className="font-display text-4xl uppercase text-navy">Messages</h1>
        <EmptyState
          title="Database unavailable"
          description="Configure MONGODB_URI to load contact messages."
        />
      </div>
    );
  }

  await connectMongo();
  const messages = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase text-navy">Messages</h1>
        <p className="mt-2 font-body text-sm text-text-muted">
          Recent contact form submissions.
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="New contact submissions will appear here."
        />
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={String(message._id)}
              className="border border-navy/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-ui text-sm font-semibold text-navy">
                  {message.subject}
                </p>
                <span className="font-ui text-xs uppercase text-slate">
                  {message.status}
                </span>
              </div>
              <p className="mt-1 font-body text-xs text-text-muted">
                {message.name} · {message.email}
              </p>
              <p className="mt-3 font-body text-sm text-text">{message.message}</p>
              {"phone" in message && (message.phone || message.budget) ? (
                <p className="mt-2 font-body text-xs text-text-muted">
                  {[message.phone, message.budget].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
