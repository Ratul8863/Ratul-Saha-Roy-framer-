import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardProjects } from "@/features/projects/actions";
import { hasMongoUri } from "@/lib/env";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const projects = await getDashboardProjects();
  const dbReady = hasMongoUri();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase text-navy">Overview</h1>
        <p className="mt-2 font-body text-sm text-text-muted">
          Manage portfolio content and inbound messages.
        </p>
      </div>

      {!dbReady ? (
        <EmptyState
          title="MongoDB not connected"
          description="Set MONGODB_URI in your environment to enable live dashboard data and auth persistence."
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-navy/10 bg-white p-5">
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate">
            Projects
          </p>
          <p className="mt-3 font-display text-4xl text-navy">
            {projects.length}
          </p>
        </div>
        <div className="border border-navy/10 bg-white p-5">
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate">
            Messages
          </p>
          <p className="mt-3 font-display text-4xl text-navy">—</p>
        </div>
        <div className="border border-navy/10 bg-white p-5">
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-slate">
            Subscribers
          </p>
          <p className="mt-3 font-display text-4xl text-navy">—</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/projects"
          className="bg-navy-btn px-4 py-2 font-ui text-sm font-semibold text-white hover:bg-navy"
        >
          Manage Projects
        </Link>
        <Link
          href="/dashboard/messages"
          className="border border-navy/20 px-4 py-2 font-ui text-sm font-semibold text-navy hover:bg-navy/5"
        >
          View Messages
        </Link>
      </div>
    </div>
  );
}
