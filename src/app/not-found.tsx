import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="font-ui text-sm uppercase tracking-[0.18em] text-slate">
        404
      </p>
      <h1 className="mt-3 font-display text-5xl uppercase text-navy">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md font-body text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 bg-navy-btn px-5 py-3 font-ui text-sm font-semibold text-white hover:bg-navy"
      >
        Back Home
      </Link>
    </div>
  );
}
