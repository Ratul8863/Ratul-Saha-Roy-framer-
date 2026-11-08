import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F7FAFD] via-white to-[#E8EEF5] px-4">
      <div className="w-full max-w-md border border-navy/10 bg-white p-8 shadow-[0_20px_60px_rgba(0,32,69,0.08)]">
        <p className="font-ui text-xs uppercase tracking-[0.18em] text-slate">
          Admin
        </p>
        <h1 className="mt-2 font-display text-4xl uppercase text-navy">
          Sign In
        </h1>
        <p className="mt-3 font-body text-sm text-text-muted">
          Access the portfolio dashboard to manage projects and messages.
        </p>
        <div className="mt-8">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center font-ui text-sm text-slate">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
