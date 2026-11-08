import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { hasMongoUri } from "@/lib/env";
import { getPublicAppUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Settings · Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase text-navy">Settings</h1>
        <p className="mt-2 font-body text-sm text-text-muted">
          Account and environment status.
        </p>
      </div>

      <dl className="space-y-4 border border-navy/10 bg-white p-6">
        <div>
          <dt className="font-ui text-xs uppercase tracking-[0.16em] text-slate">
            Signed in as
          </dt>
          <dd className="mt-1 font-body text-sm text-text">
            {session?.user.email ?? "Unknown"}
          </dd>
        </div>
        <div>
          <dt className="font-ui text-xs uppercase tracking-[0.16em] text-slate">
            App URL
          </dt>
          <dd className="mt-1 font-body text-sm text-text">{getPublicAppUrl()}</dd>
        </div>
        <div>
          <dt className="font-ui text-xs uppercase tracking-[0.16em] text-slate">
            MongoDB
          </dt>
          <dd className="mt-1 font-body text-sm text-text">
            {hasMongoUri() ? "Configured" : "Missing MONGODB_URI"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
