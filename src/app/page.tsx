import type { Metadata } from "next";
import HomePage from "@/views/HomePage";
import { defaultDescription, getSiteUrl, siteName } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  description: defaultDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    url: siteUrl,
    title: `${siteName} · Full Stack Web Developer (MERN)`,
    description: defaultDescription,
  },
  twitter: {
    title: `${siteName} · Full Stack Web Developer (MERN)`,
    description: defaultDescription,
  },
};

/** SSG: static shell; HomePage code-splits below-the-fold client sections. */
export default function Page() {
  return <HomePage />;
}
