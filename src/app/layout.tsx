import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Gasoek_One, Audiowide, Anonymous_Pro, Baumans, Anton } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { defaultDescription, getSiteUrl, seoKeywords } from "@/lib/site";
import { projectsItemListJsonLd } from "@/lib/project-seo";
import {
  achievementsItemListJsonLd,
  achievementSearchTerms,
  personAwardNodes,
  projectSearchTerms,
  SEO_BIO,
} from "@/lib/seo-entities";
import { PROJECTS } from "@/lib/projects";

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

// Landing page (dark, editorial) typography — approximates the "Nord" display face.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

// Oversized footer wordmark — matches the design's "Gasoek One" heading.
const gasoek = Gasoek_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gasoek-one",
  weight: ["400"],
});

const audiowide = Audiowide({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-audiowide",
  weight: ["400"],
});

const anonymousPro = Anonymous_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anonymous-pro",
  weight: ["400", "700"],
});

const baumans = Baumans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baumans",
  weight: ["400"],
});

const anton = Anton({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
  weight: ["400"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Ratul Saha Roy | Full Stack Web Developer (MERN)`,
    template: `%s | Ratul Saha Roy`,
  },
  description: defaultDescription,
  applicationName: "Ratul Saha Roy",
  keywords: seoKeywords,
  authors: [{ name: "Ratul Saha Roy", url: siteUrl }],
  creator: "Ratul Saha Roy",
  publisher: "Ratul Saha Roy",
  category: "technology",
  // Google needs a crawlable favicon that is a multiple of 48px
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ratul Saha Roy",
    title: `Ratul Saha Roy | Full Stack Web Developer (MERN)`,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Ratul Saha Roy — Full Stack Web Developer Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Ratul Saha Roy | Full Stack Web Developer (MERN)`,
    description: defaultDescription,
    images: [`${siteUrl}/og-default.png`],
    creator: "@ratulroy8863",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    "application-name": "Ratul Saha Roy",
  },
};

function JsonLd() {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Ratul Saha Roy",
    givenName: "Ratul",
    familyName: "Saha Roy",
    alternateName: ["Ratul", "রাতুল সাহা রায়", "Ratul Roy"],
    url: siteUrl,
    image: [
      `${siteUrl}/og-default.png`,
      `${siteUrl}/landing/hero-portrait-v3.png`,
      `${siteUrl}/apple-icon.png`,
    ],
    jobTitle: [SEO_BIO.jobTitle, "Full Stack Web Developer"],
    description: defaultDescription,
    email: "ratulroy8863@gmail.com",
    telephone: "+8801795908863",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sylhet",
      addressRegion: "Sylhet Division",
      addressCountry: "BD",
    },
    nationality: {
      "@type": "Country",
      name: "Bangladesh",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: SEO_BIO.university,
      alternateName: [...SEO_BIO.universityAliases],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sylhet",
        addressCountry: "BD",
      },
    },
    worksFor: {
      "@type": "Organization",
      name: SEO_BIO.company,
      alternateName: [...SEO_BIO.companyAliases],
      url: SEO_BIO.companyUrl,
    },
    award: personAwardNodes(siteUrl).map((a) => a.name),
    hasCredential: personAwardNodes(siteUrl).filter(
      (a) => a["@type"] === "EducationalOccupationalCredential"
    ),
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "MERN Stack",
      "Full Stack Development",
      "Web Development",
      "REST APIs",
      "Firebase",
      "Responsive Web Design",
      ...projectSearchTerms(),
      ...achievementSearchTerms(),
      SEO_BIO.company,
      SEO_BIO.university,
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: SEO_BIO.jobTitle,
      occupationLocation: {
        "@type": "City",
        name: "Sylhet",
      },
      skills:
        "React, Next.js, Node.js, Express, MongoDB, TypeScript, JavaScript, Tailwind CSS, Firebase, REST APIs",
    },
    sameAs: [
      "https://github.com/ratulroy8863",
      "https://www.linkedin.com/in/ratulroy8863",
      "https://www.facebook.com/ratulroy8863",
      "https://www.instagram.com/ratulroy8863",
      SEO_BIO.companyUrl,
      ...PROJECTS.map((p) => p.link),
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    // Google site name (shows next to favicon in SERP) — keep short & exact
    name: "Ratul Saha Roy",
    alternateName: [
      "Ratul Saha Roy Portfolio",
      "Ratul Saha Roy — Full Stack Web Developer",
    ],
    description: defaultDescription,
    publisher: { "@id": `${siteUrl}/#person` },
    inLanguage: "en-US",
  };

  const profilePageData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: "Ratul Saha Roy",
    description: defaultDescription,
    mainEntity: { "@id": `${siteUrl}/#person` },
    isPartOf: { "@id": `${siteUrl}/#website` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: `${siteUrl}/projects`,
        },
      ],
    },
  };

  const projectsList = projectsItemListJsonLd();
  const achievementsList = achievementsItemListJsonLd(siteUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(achievementsList) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const themeBoot = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='dark';var r=document.documentElement;r.classList.remove('dark','light');r.classList.add(t);r.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} ${gasoek.variable} ${audiowide.variable} ${anonymousPro.variable} ${baumans.variable} ${anton.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="geo.region" content="BD-60" />
        <meta name="geo.placename" content="Sylhet, Bangladesh" />
        <meta name="geo.position" content="24.8949;91.8687" />
        <meta name="ICBM" content="24.8949, 91.8687" />
        <link rel="canonical" href={siteUrl} />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <JsonLd />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent/50"
            >
              Skip to main content
            </a>
            <ScrollToTop />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
