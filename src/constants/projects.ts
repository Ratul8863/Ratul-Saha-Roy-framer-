export type FeaturedProject = {
  slug: string;
  title: string;
  role: string[];
  projectName: string;
  category: string;
  description: string;
  /** Must be a flat rectangular mockup — CSS handles tilt off-center */
  coverImage: string;
  featured: boolean;
  active?: boolean;
};

export type PlaygroundProject = {
  slug: string;
  title: string;
  height: number;
  column: 1 | 2 | 3 | 4;
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "assubah",
    title: "As-Subah Academy",
    role: ["Full Stack"],
    projectName: "As-Subah Academy",
    category: "Islamic learning platform",
    description:
      "Full-stack Islamic learning platform — architecture and implementation for courses, auth, payments, shop, applications, and admin — shipped to production at assubah.com.",
    coverImage: "/assubah.png",
    featured: true,
    active: true,
  },
  {
    slug: "groundroots-initiative",
    title: "GroundRoots Initiative",
    role: ["Full Stack"],
    projectName: "GroundRoots",
    category: "Full-Stack Community Platform",
    description:
      "A full-stack platform for a London youth CIC combining a public website, Stripe-powered shop, and Academy Tracker for managing coaching and community activities.",
    coverImage: "/groundroots.png",
    featured: true,
  },
  {
    slug: "ems-logistics-uk",
    title: "EMS Logistics UK",
    role: ["Full Stack"],
    projectName: "EMS Logistics",
    category: "Corporate Web Platform",
    description:
      "A multi-page corporate platform for a UK logistics company, covering services, partnerships, careers, and quote capture with a responsive interface and motion-led user experience.",
    coverImage: "/ems-logistics.png",
    featured: true,
  },
  {
    slug: "the-peptide-journey",
    title: "The Peptide Journey",
    role: ["Full Stack"],
    projectName: "Peptide Journey",
    category: "Full-Stack E-Commerce",
    description:
      "A production-oriented e-commerce platform featuring guest checkout, inventory reservation, authentication, payment integration, and a custom storefront experience.",
    coverImage: "/peptide-journey.png",
    featured: true,
  },
  {
    slug: "mk-heating",
    title: "MK Heating",
    role: ["Frontend", "UI Implementation"],
    projectName: "MK Heating",
    category: "Client Website",
    description:
      "A conversion-focused heating and plumbing website for an East London business, featuring local SEO pages, service information, booking CTAs, Google reviews, and a responsive branded interface.",
    coverImage: "/mk-heating.png",
    featured: false,
  },
];

/** Playground masonry preserved for secondary pages — titles from TARGET projects. */
export const playgroundProjects: PlaygroundProject[] = [
  { slug: "assubah", title: "As-Subah Academy", height: 516, column: 1 },
  { slug: "groundroots-initiative", title: "GroundRoots", height: 313, column: 1 },
  { slug: "ems-logistics-uk", title: "EMS Logistics UK", height: 430, column: 1 },
  { slug: "the-peptide-journey", title: "Peptide Journey", height: 516, column: 2 },
  { slug: "aj-cleaning-london", title: "AJ Cleaning London", height: 267, column: 2 },
  { slug: "mk-heating", title: "MK Heating", height: 313, column: 2 },
  { slug: "as-subah-outreach", title: "As-Subah Outreach", height: 267, column: 3 },
  { slug: "siyar", title: "SIYAR", height: 430, column: 3 },
  { slug: "mugas-platform", title: "MUGAS", height: 516, column: 3 },
  { slug: "ecoscrap", title: "EcoScrap", height: 430, column: 4 },
  { slug: "hostel-meals", title: "Hostel Meals", height: 313, column: 4 },
  { slug: "hobbyhub", title: "HobbyHub", height: 430, column: 4 },
];

export type PortfolioCaseStudy = {
  slug: string;
  title: string;
  coverImage: string;
  summary: string;
  details: string;
  about: string;
  /** Live site — Feature Projects opens this instead of an internal detail page. */
  liveUrl?: string;
};

export type PortfolioListProject = {
  slug: string;
  title: string;
  category: string;
  year: string;
  /** Live site — All Projects opens this instead of an internal detail page. */
  liveUrl?: string;
};

export const portfolioCaseStudies: PortfolioCaseStudy[] = [
  {
    slug: "assubah",
    title: "As-Subah Academy",
    coverImage: "/assubah.png",
    liveUrl: "https://www.assubah.com/",
    summary:
      "Full-stack Islamic learning platform — architecture and implementation for courses, auth, payments, shop, applications, and admin — shipped to production at assubah.com.",
    details:
      "As-Subah Academy is a production Islamic learning platform that combines LMS, memberships, e-commerce, content publishing, and admin operations in one full-stack product.",
    about:
      "Role: Full Stack — Architecture & Implementation. Stack spans React/Vite, Express/MongoDB, Firebase auth, Stripe/GoCardless, and Cloudflare R2 media.",
  },
  {
    slug: "groundroots-initiative",
    title: "GroundRoots Initiative",
    coverImage: "/groundroots.png",
    liveUrl: "https://groundroots.org",
    summary:
      "A full-stack platform for a London youth CIC combining a public website, Stripe-powered shop, and Academy Tracker for managing coaching and community activities.",
    details:
      "GroundRoots Initiative (groundroots.org) is the public website and operations stack for a community CIC in Plaistow, East London — marketing, Stripe shop, and coach tooling on a shared foundation.",
    about:
      "Role: Full Stack — Architecture & Implementation. Developed by Ratul Saha Roy for GroundRoots Initiative.",
  },
  {
    slug: "ems-logistics-uk",
    title: "EMS Logistics UK",
    coverImage: "/ems-logistics.png",
    liveUrl: "https://www.emslogistics.co.uk",
    summary:
      "A multi-page corporate platform for a UK logistics company, covering services, partnerships, careers, and quote capture with a responsive interface and motion-led user experience.",
    details:
      "EMS Logistics UK Limited is a corporate marketing website for a UK logistics, freight, and supply-chain operator — services, locations, partnerships, careers, and lead-gen flows.",
    about:
      "Role: Full Stack — Architecture & Implementation. Developed by Ratul Saha Roy.",
  },
  {
    slug: "the-peptide-journey",
    title: "The Peptide Journey",
    coverImage: "/peptide-journey.png",
    liveUrl: "https://peptide.up.railway.app/giveaway",
    summary:
      "A production-oriented e-commerce platform featuring guest checkout, inventory reservation, authentication, payment integration, and a custom storefront experience.",
    details:
      "Built with Next.js, TypeScript, and MongoDB — guest checkout, atomic inventory reservations, provider-agnostic payments with verified webhooks, and an admin suite.",
    about:
      "Role: Solo / full-stack. Developed by Ratul Saha Roy.",
  },
  {
    slug: "mk-heating",
    title: "MK Heating",
    coverImage: "/mk-heating.png",
    liveUrl: "https://www.boilerserviceeastlondon.co.uk/",
    summary:
      "A conversion-focused heating and plumbing website for an East London business, featuring local SEO pages, service information, booking CTAs, Google reviews, and a responsive branded interface.",
    details:
      "Premium website redesign for an East London heating and plumbing company — local SEO, fast mobile booking, and a clear brand presence.",
    about:
      "Role: Full-stack frontend / UI implementation. Developed by Ratul Saha Roy.",
  },
];

export const portfolioAllProjects: PortfolioListProject[] = [
  {
    slug: "assubah",
    title: "As-Subah Academy",
    category: "Full Stack",
    year: "2024",
    liveUrl: "https://www.assubah.com/",
  },
  {
    slug: "groundroots-initiative",
    title: "GroundRoots Initiative",
    category: "Full Stack",
    year: "2026",
    liveUrl: "https://groundroots.org",
  },
  {
    slug: "ems-logistics-uk",
    title: "EMS Logistics UK",
    category: "Full Stack",
    year: "2026",
    liveUrl: "https://www.emslogistics.co.uk",
  },
  {
    slug: "the-peptide-journey",
    title: "The Peptide Journey",
    category: "Full-Stack E-Commerce",
    year: "2026",
    liveUrl: "https://peptide.up.railway.app/giveaway",
  },
  {
    slug: "mk-heating",
    title: "MK Heating",
    category: "Client Website",
    year: "2026",
    liveUrl: "https://www.boilerserviceeastlondon.co.uk/",
  },
  {
    slug: "aj-cleaning-london",
    title: "AJ Cleaning London",
    category: "Marketing Website",
    year: "2026",
    liveUrl: "https://aj-cleaning-london.vercel.app/",
  },
  {
    slug: "siyar",
    title: "SIYAR",
    category: "Feature Development",
    year: "2026",
    liveUrl: "https://siyarinstitute.org",
  },
  {
    slug: "as-subah-outreach",
    title: "As-Subah Outreach",
    category: "Full Stack",
    year: "2024",
    liveUrl: "https://assubahoutreach.com",
  },
  {
    slug: "mugas-platform",
    title: "MUGAS",
    category: "Web Application",
    year: "2024",
    liveUrl: "https://mugas.vercel.app/",
  },
  {
    slug: "ecoscrap",
    title: "EcoScrap",
    category: "Web Application",
    year: "2024",
    liveUrl: "https://ecoscrap-solution.vercel.app",
  },
  {
    slug: "jubileean-football-fest",
    title: "Jubileean Football Fest",
    category: "Live site",
    year: "2024",
    liveUrl: "https://jubileean-football-fest.vercel.app/",
  },
  {
    slug: "hostel-meals",
    title: "Hostel Meals",
    category: "Full-Stack Platform",
    year: "2024",
    liveUrl: "https://hostel-management-by-ratul.web.app/",
  },
  {
    slug: "hobbyhub",
    title: "HobbyHub",
    category: "Full-Stack Community App",
    year: "2024",
    liveUrl: "https://hobyhub-by-ratul.web.app/",
  },
  {
    slug: "product-recommendation",
    title: "Product Recommendation System",
    category: "Full-Stack Review Platform",
    year: "2024",
    liveUrl: "https://product-recommendation-byratul.web.app/",
  },
];

export const playgroundIntro =
  "A selection of projects I have shipped across full-stack products, client platforms, and community tools — each focused on practical software that solves real problems.";

export const heroIntro =
  "I am a Computer Science & Engineering student and Junior Software Developer at Kode By Kraft, working across full-stack development, artificial intelligence, and research-driven computing. I build production-ready software and turn ideas into practical solutions across hackathons, research, and client work.";

export const heroMarqueeItems = [
  "FULL-STACK DEVELOPMENT",
  "AI & MACHINE LEARNING",
  "RESEARCH & DATA",
  "SOFTWARE ENGINEERING",
  "REACT & NEXT.JS",
  "PROBLEM SOLVING",
] as const;

export function getProjectBySlug(slug: string) {
  return (
    featuredProjects.find((project) => project.slug === slug) ??
    playgroundProjects.find((project) => project.slug === slug)
  );
}
