import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/ScrollToTop";
import { defaultDescription, getSiteUrl, siteName } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["600", "700", "800"],
  preload: true,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} · Full Stack Web Developer (MERN)`,
    template: `%s · ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "Ratul Saha Roy",
    "full stack developer",
    "MERN stack",
    "React",
    "Node.js",
    "MongoDB",
    "Sylhet",
    "Bangladesh",
    "web developer",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} · Full Stack Web Developer (MERN)`,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} · Full Stack Web Developer (MERN)`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    url: siteUrl,
    jobTitle: "Full Stack Web Developer",
    email: "ratulroy8863@gmail.com",
    telephone: "+8801795908863",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sylhet",
      addressCountry: "BD",
    },
    sameAs: [
      "https://github.com/ratulroy8863",
      "https://www.linkedin.com/in/ratulroy8863",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <body>
        <JsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent/50"
        >
          Skip to main content
        </a>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
