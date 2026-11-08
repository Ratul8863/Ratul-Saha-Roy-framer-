import type { Metadata } from "next";
import { Anton, Manrope, Noto_Sans, Noto_Sans_JP, Outfit } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { IntroPreloader } from "@/components/layout/intro-preloader";
import { siteConfig } from "@/config/site";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const introSans = Noto_Sans({
  subsets: ["latin", "latin-ext", "devanagari"],
  weight: "400",
  variable: "--font-intro",
  display: "swap",
});

const introJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-intro-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.creator }],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${outfit.variable} ${manrope.variable} ${introSans.variable} ${introJp.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-body text-text">
        <IntroPreloader />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
