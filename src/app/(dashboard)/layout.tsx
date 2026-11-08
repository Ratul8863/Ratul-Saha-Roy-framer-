import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dashboardNav } from "@/constants/navigation";
import { siteConfig } from "@/config/site";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-navy/10 bg-white px-6 py-8 lg:w-64 lg:border-b-0 lg:border-r">
          <Link href="/" className="font-display text-2xl uppercase text-navy">
            {siteConfig.shortName}
          </Link>
          <p className="mt-1 font-ui text-xs text-slate">Dashboard</p>
          <nav className="mt-8" aria-label="Dashboard">
            <ul className="space-y-2">
              {dashboardNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 font-ui text-sm text-navy transition-colors hover:bg-mist/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10 border-t border-navy/10 pt-6">
            <p className="font-ui text-sm font-medium text-navy">
              {session.user.name}
            </p>
            <p className="font-body text-xs text-text-muted">
              {session.user.email}
            </p>
          </div>
        </aside>
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
