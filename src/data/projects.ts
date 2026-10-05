/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectExtraLink {
  label: string;
  href: string;
}

export interface ProjectGalleryItem {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ProjectCaseStudy {
  problem: string;
  approach: string;
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  category: string;
  /** Case-study meta */
  role?: string;
  year?: string;
  /** Long-form sections on the detail page */
  overview: string[];
  highlights?: string[];
  /** Challenge → how you worked → result */
  caseStudy?: ProjectCaseStudy;
  /** Extra screenshots (optional) */
  gallery?: ProjectGalleryItem[];
  /** Repo, Figma, docs — besides main `link` */
  extraLinks?: ProjectExtraLink[];
  /**
   * Extra names people might search (brands, domains, misspellings).
   * Used for meta keywords + JSON-LD — helps portfolio rank next to the live site.
   */
  seoAliases?: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "the-peptide-journey",
    title: "The Peptide Journey",
    seoAliases: [
      "Peptide Journey",
      "peptide store",
      "peptide e-commerce",
      "peptide.up.railway.app",
    ],
    description:
      "A production-oriented e-commerce platform featuring guest checkout, inventory reservation, authentication, payment integration, and a custom storefront experience.",
    tags: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Auth.js",
      "Tailwind",
      "Server Actions",
      "E-commerce",
      "Payments",
      "R2",
    ],
    link: "https://peptide.up.railway.app/giveaway",
    image: "/peptide-journey.png",
    category: "Full-Stack E-Commerce",
    role: "Solo / full-stack",
    year: "2026",
    overview: [
      "A production-ready peptide commerce platform built with Next.js 16, TypeScript, and MongoDB. Includes guest checkout, atomic inventory reservations, provider-agnostic payments with verified webhooks, and an admin suite — all without a separate backend server.",
      "The product surface spans a marketing site (protocols, quality, about), a MongoDB-backed shop, cart/checkout, account area, admin dashboard, and a Figma-driven launch giveaway with scroll-linked bottle motion. Brand UI follows a cream (#F5F0E8) and forest-green (#1A4A2E) design system.",
      "Business logic lives in-process via Server Actions, feature services, and MongoDB transactions — vertical slices under features, with thin actions that Zod-parse and call a single service.",
    ],
    highlights: [
      "Guest + authenticated carts (MongoDB httpOnly cookie) with merge-on-login — no localStorage",
      "Per-SKU inventory with reserved stock, checkout-time holds, and TTL sweeper for expired reservations",
      "Provider-agnostic payments; paid status only via HMAC-verified webhooks",
      "Admin suite for products, inventory, orders, customers, and analytics with audit logging",
      "Cloudflare R2 storage abstraction and transactional email via Nodemailer",
      "Giveaway page with CSS hero entrance and separate Lenis scroll-linked bottle floater",
    ],
    caseStudy: {
      problem:
        "A UK research-peptide store needed oversell-safe inventory, guest checkout without forced accounts, and payment truth that never trusts redirects — while keeping marketing protocols separate from live purchasable catalog stock.",
      approach:
        "Modeled inventory as available = onHand − reserved with multi-document MongoDB transactions at checkout; persisted guest carts server-side; introduced a PaymentProvider seam so only verified webhooks mark orders paid; kept marketing protocol data static and live catalog rows for cart/checkout.",
      outcome:
        "A production-ready Next.js commerce platform with guest checkout end-to-end, concurrency-safe money/inventory mutations, admin ops, and a cohesive cream / forest-green brand experience including a Figma-driven giveaway.",
    },
    gallery: [
      {
        src: "/peptide-journey.png",
        alt: "The Peptide Journey portfolio banner",
        caption: "Cream & forest-green brand banner",
      },
    ],
  },
  {
    slug: "mk-heating",
    title: "MK Heating",
    seoAliases: [
      "MK Heating East London",
      "boiler service East London",
      "boilerserviceeastlondon.co.uk",
      "MK Heating website",
    ],
    description:
      "A conversion-focused heating and plumbing website for an East London business, featuring local SEO pages, service information, booking CTAs, Google reviews, and a responsive branded interface.",
    tags: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "SEO",
      "Local Business",
      "UI Design",
      "Framer Motion",
      "East London",
    ],
    link: "https://www.boilerserviceeastlondon.co.uk/",
    image: "/mk-heating.png",
    category: "Client Website",
    role: "Full-stack frontend / UI implementation",
    year: "2026",
    overview: [
      "MK Heating is a premium website redesign for an East London heating and plumbing company. The project replaces a cluttered, spam-contaminated legacy site with a clean, conversion-focused experience — built for local SEO, fast mobile booking, and a clear brand presence.",
      "The site covers boiler repair, installation, servicing, central heating, emergency plumbing, and 22 local area landings across East London, with a brand-accurate navy, cream, and red design system.",
    ],
    highlights: [
      "Service hubs for Plumbing, Boiler, Central Heating, and Emergency",
      "22 East London local SEO area pages (Stepney, Bow, Hackney, Canary Wharf, and more)",
      "In-site Book Now modal plus mobile sticky Call / WhatsApp bar",
      "Google Business reviews with live API option and static fallback",
      "LocalBusiness structured data, metadata, and sitemap-ready structure",
      "Gas Safe / trust accreditations on key pages",
    ],
    caseStudy: {
      problem:
        "The previous live site had weak branding, casino/spam contamination, template junk with wrong locations, and poor structure for local SEO and conversion — visitors could not trust or book quickly.",
      approach:
        "Rebuilt in Next.js App Router with a navy/cream/red design system, service hubs plus East London area landings, booking modal and sticky mobile CTAs, Google reviews, and LocalBusiness schema — content migrated and cleaned from the live reference, scoped to heating & plumbing only.",
      outcome:
        "A brand-led, production-ready mockup that looks trustworthy on first glance, makes calling and booking obvious on mobile, supports local search with area + service pages, and matches a consistent design system ready for handoff or launch.",
    },
    gallery: [
      {
        src: "/mk-heating.png",
        alt: "MK Heating portfolio banner",
        caption: "Navy & cream brand banner",
      },
    ],
  },
  {
    slug: "aj-cleaning-london",
    title: "AJ Cleaning London",
    seoAliases: [
      "AJ Cleaning",
      "AJ Cleaning London website",
      "cleaning company London website",
    ],
    description:
      "A 39-page responsive marketing website built from a complete Figma redesign, featuring a shared design system, mega navigation, service and location pages, and an interactive Matter.js-powered CTA.",
    tags: [
      "HTML",
      "CSS",
      "JavaScript",
      "Matter.js",
      "Figma",
      "Responsive",
      "39 Pages",
      "Static Site",
    ],
    link: "https://aj-cleaning-london.vercel.app/",
    image: "/aj-cleaning-london.png",
    category: "Marketing Website",
    role: "Frontend design implementation from Figma",
    year: "2026",
    overview: [
      "AJ Cleaning London offers specialist steam cleaning for sofas, carpets, mattresses, rugs, curtains and more across Greater London. The website was redesigned end-to-end to match an approved Figma system: cream and teal brand palette, custom display typography, shared header/footer, service pages, area pages, pricing, landlords, FAQ, contact, and legal pages.",
      "Scope: 39 pages, fully responsive, design-system driven — static HTML/CSS/JS with no React or bundler, shared header/footer partials, and custom motion including Matter.js physics on the homepage CTA.",
    ],
    highlights: [
      "Figma-faithful redesign — layout, typography, spacing, and imagery matched to design frames",
      "Services and Areas mega-menus with hover panels that stay open while moving to links",
      "Core service pages plus regional and borough-level area coverage across London",
      "Landlords & letting agents enquiry flow, pricing, FAQ, about, contact, and legal pages",
      "Matter.js CTA physics — falling, draggable service badges with scroll-safe pointer handling",
      "Sticky rising CTAs and icon motion reused across redesigned pages",
    ],
    caseStudy: {
      problem:
        "The brand needed a large multi-page marketing site that stayed pixel-true to an approved Figma system across services, areas, pricing, and landlord flows — with custom interaction that never broke page scroll.",
      approach:
        "Implemented a static multi-page architecture with shared redesign partials, CSS design tokens, and page-specific stylesheets. Built mega-menus, service/area patterns, and a Matter.js physics CTA with sticky/scroll motion that keeps wheel and pointer events safe.",
      outcome:
        "A production-ready 39-page cream/teal marketing site — cohesive across devices, SEO-oriented in structure, and distinctive for its interactive homepage CTA without sacrificing responsiveness or scroll UX.",
    },
    gallery: [
      {
        src: "/aj-cleaning-london.png",
        alt: "AJ Cleaning London portfolio banner",
        caption: "Cream & teal brand banner with device mockups",
      },
    ],
  },
  {
    slug: "groundroots-initiative",
    title: "GroundRoots Initiative",
    seoAliases: [
      "GroundRoots",
      "groundroots.org",
      "GroundRoots Initiative East London",
      "Plaistow youth CIC",
      "Community Roots",
    ],
    description:
      "A full-stack platform for a London youth CIC combining a public website, Stripe-powered shop, and Academy Tracker for managing coaching and community activities.",
    tags: [
      "Full Stack",
      "React",
      "Vite",
      "Express",
      "MongoDB",
      "Stripe",
      "Community",
      "Youth",
      "East London",
      "Offline-first",
      "GDPR",
    ],
    link: "https://groundroots.org",
    image: "/groundroots.png",
    category: "Full-Stack Community Platform",
    role: "Full Stack — Architecture & Implementation",
    year: "2026",
    overview: [
      "GroundRoots Initiative (groundroots.org) is the public website and operations stack for a community CIC in Plaistow, East London. It promotes free youth sport and family programmes, takes donations/enquiries, sells merchandise via Stripe, and includes an internal Academy Tracker for coaches (children’s session data, offline-first sync, EU photo storage).",
      "One product surface: marketing site + Stripe shop + admin orders + Academy Tracker on a shared Express/Mongo foundation, with offline-first coach UX and UK/EU-conscious data storage.",
    ],
    highlights: [
      "Full-bleed marketing homepage — programmes, projects, team, gallery, contact",
      "Stripe Checkout shop with cart, order confirmation, delivery/returns",
      "Password-protected admin orders dashboard",
      "Academy Tracker: coach auth, invites, children/sessions, mutation queue / offline-first sync",
      "Policy pages for privacy, safeguarding, complaints, cookies, and terms",
      "SSG for crawler-visible HTML; WhatsApp and donation CTAs via env",
    ],
    caseStudy: {
      problem:
        "A grassroots youth organisation needed a credible public presence, a simple way for families to get involved, online shop/fundraising flows, and a GDPR-aware coach tool for academy sessions — without a separate fragile stack per feature.",
      approach:
        "Designed and shipped a shared Express/Mongo foundation with React + Vite SSG frontend: public marketing, Stripe Checkout shop, admin orders gate, and Academy Tracker with JWT/session auth, offline mutation queue, and Cloudflare R2 for child photos in the UK/EU.",
      outcome:
        "A live production platform at groundroots.org — marketing, shop, and coach tooling in one stack, from architecture through Railway/Vercel deploy and ongoing iteration.",
    },
    gallery: [
      {
        src: "/groundroots.png",
        alt: "GroundRoots Initiative portfolio banner",
        caption: "Youth community platform — device mockups",
      },
    ],
  },
  {
    slug: "ems-logistics-uk",
    title: "EMS Logistics UK",
    seoAliases: [
      "EMS Logistics",
      "EMS Logistics UK Limited",
      "emslogistics.co.uk",
      "UK logistics website",
      "Dartford freight logistics",
    ],
    description:
      "A multi-page corporate platform for a UK logistics company, covering services, partnerships, careers, and quote capture with a responsive interface and motion-led user experience.",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Logistics",
      "Full Stack",
      "Corporate Website",
      "SEO",
      "Lead Generation",
    ],
    link: "https://www.emslogistics.co.uk",
    image: "/ems-logistics.png",
    category: "Corporate Web Platform",
    role: "Full Stack — Architecture & Implementation",
    year: "2026",
    overview: [
      "EMS Logistics UK Limited is a corporate marketing website for a UK logistics, freight, and supply-chain operator based in Dartford (Kent), with Cardiff coverage and UK–EU transport services. The product showcases services, locations, partnerships, careers, and lead-gen quote/career enquiry flows.",
      "Rebuilt in Next.js App Router with centralized content, image CDN helpers, reusable section components, quote and career forms, legal pages, and cinematic scroll motion — aligned to EMS brand navy, cyan, and gold.",
    ],
    highlights: [
      "Homepage hero + stats, services, locations, partners, about, why-EMS, partnerships teaser, and quote form",
      "Dedicated Services, About, Partnerships, and Careers pages",
      "Lead capture: Get a Quote and careers enquiry flows",
      "SEO metadata per route, accessibility and legal pages",
      "Framer Motion scroll reveals with reduced-motion respect",
      "Responsive header/nav and premium editorial section layouts",
    ],
    caseStudy: {
      problem:
        "The brand needed a modern, performant, maintainable web presence for logistics services, partnerships, and recruitment — beyond a locked-in page builder.",
      approach:
        "Scoped against the existing Wix/reference site, then implemented a Next.js App Router rebuild with shared layout tokens, a component system, centralized content, quote/career forms, SEO metadata, and Playwright-assisted visual parity checks.",
      outcome:
        "A production-ready multi-page logistics marketing platform — 8 pages of architecture and implementation with motion-led UX, ready for deploy under the EMS brand system.",
    },
    gallery: [
      {
        src: "/ems-logistics.png",
        alt: "EMS Logistics UK portfolio banner",
        caption: "Logistics platform — device mockups",
      },
    ],
  },
  {
    slug: "siyar",
    title: "SIYAR",
    seoAliases: [
      "Siyar Institute",
      "siyarinstitute.org",
      "Siyar Islamic knowledge",
      "SIYAR platform",
    ],
    description:
      "Contributed to selected pages of a React and Node.js scholarly publishing platform featuring multilingual interfaces and admin-backed content management.",
    tags: [
      "React",
      "Vite",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind",
      "i18n",
      "Feature Development",
      "Frontend",
    ],
    link: "https://siyarinstitute.org",
    image: "/siyar.png",
    category: "Islamic Knowledge Platform",
    role: "Frontend / Feature Developer — selected pages",
    year: "2026",
    overview: [
      "Siyar Institute (siyarinstitute.org) is a multilingual Islamic knowledge / scholarly publishing platform — articles, books, videos, events, and an admin CMS — built as a React + Express monorepo.",
      "Contributed as a frontend/feature developer on selected pages and flows within an existing product codebase — not sole full-project ownership.",
    ],
    highlights: [
      "Multilingual public site (English / Arabic / Urdu)",
      "Articles, books, videos, and events content surfaces",
      "Admin dashboard and content management",
      "Media uploads via Cloudflare R2",
      "Selected-page UI and feature work within the existing Vite/React + Express stack",
    ],
    caseStudy: {
      problem:
        "The institute needed a modern web presence for research papers, multilingual content, and media.",
      approach:
        "Worked as a feature developer on selected pages and flows inside the React/Vite frontend with Express/MongoDB APIs, admin tooling, and cloud media storage — focusing on responsive UI and feature delivery rather than sole ownership.",
      outcome:
        "Shipped selected frontend contributions on the live scholarly platform at siyarinstitute.org, supporting multilingual Islamic knowledge publishing.",
    },
    gallery: [
      {
        src: "/siyar.png",
        alt: "SIYAR portfolio banner",
        caption: "Islamic knowledge platform — device mockups",
      },
    ],
  },
  {
    slug: "assubah",
    title: "As-Subah Academy",
    seoAliases: [
      "Assubah",
      "As Subah",
      "As-Subah",
      "assubah.com",
      "As-Subah Academy website",
      "Assubah Academy",
      "Assubah LMS",
      "Islamic learning platform Assubah",
    ],
    description:
      "Full-stack Islamic learning platform — architecture and implementation for courses, auth, payments, shop, applications, and admin — shipped to production at assubah.com.",
    tags: [
      "Full Stack",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Firebase",
      "Stripe",
      "LMS",
      "E-commerce",
      "Admin Dashboard",
    ],
    link: "https://www.assubah.com/",
    image: "/assubah.png",
    category: "Islamic learning platform",
    role: "Full Stack — Architecture & Implementation",
    year: "2024",
    overview: [
      "As-Subah Academy is a production Islamic learning platform that combines LMS, memberships, e-commerce, content publishing, and admin operations in one full-stack product.",
      "It serves live and on-demand courses/diplomas, membership plans and user dashboards, shop (cart, checkout, orders, inventory), live-course applications with admin enrollment, articles, research papers, donations, and a full admin CMS.",
      "React/Vite SPA + Express/MongoDB API — Firebase auth, Stripe and GoCardless payments, Cloudflare R2 media, queued email (Mailgun/SMTP via BullMQ + Redis), and optional Google Sheets sync for live applications. ~100+ frontend routes across public, user, and admin modules.",
    ],
    highlights: [
      "Course catalog with lesson player (video + optional PDF slides via pdf.js) and progress tracking",
      "Dynamic live-course applications, MongoDB storage, Google Sheets sync, admin enroll/cancel",
      "Stripe checkout/subscriptions and feature-flagged GoCardless Direct Debit",
      "Full shop: catalog, cart, checkout, wishlist, inventory, discounts, shipping zones",
      "Articles, research papers, Helmet + structured data, and niche campaign pages",
      "Admin CMS for courses, shop, email marketing, applicants, and moderation",
    ],
    caseStudy: {
      problem:
        "An education organization needed one connected product for courses, enrollments, payments (card + Direct Debit), shop, content, and day-to-day admin — instead of scattered forms, sheets, and tools.",
      approach:
        "Owned full-stack delivery: React frontend and Node/Express APIs, Firebase auth, MongoDB models, Stripe/GoCardless, R2 media, queued email, Sheets sync for applicants, and a large admin surface for courses, shop, and marketing.",
      outcome:
        "A unified production platform at assubah.com — LMS + commerce + admin in one product, with ~100+ routes and ongoing iteration as workflows evolved.",
    },
    gallery: [
      {
        src: "/assubah.png",
        alt: "As-Subah Academy portfolio banner",
        caption: "Islamic learning platform — device mockups",
      },
    ],
    extraLinks: [
      {
        label: "Related: As-Subah Outreach",
        href: "https://assubahoutreach.com",
      },
    ],
  },
  {
    slug: "as-subah-outreach",
    title: "As-Subah Outreach",
    seoAliases: [
      "Assubah Outreach",
      "As Subah Outreach",
      "assubahoutreach.com",
      "As-Subah charity",
      "Assubah donation platform",
    ],
    description:
      "Donation and fundraising platform for a UK Islamic charity: architecture through production deploy. Next.js UI, Express/MongoDB APIs, Stripe payments, Gift Aid, peer-to-peer fundraisers, and a full admin ops suite across multi-country appeals.",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Express",
      "Node.js",
      "MongoDB",
      "Stripe",
      "PayPal",
      "Gift Aid",
      "Full Stack",
    ],
    link: "https://assubahoutreach.com",
    image: "/outreach.png",
    category: "Charity donation platform",
    role: "Full Stack Developer — Architecture & Implementation",
    year: "2024",
    overview: [
      "As-Subah Outreach is a production UK Islamic charity platform for online donations, peer-to-peer fundraising, Gift Aid, Zakat-compliant giving, and multi-country humanitarian appeals — with a public donor experience and a full admin/ops backend.",
      "It is not a brochure site: payments, auth, campaign CMS, fundraisers, finance/Gift Aid, and email systems are all part of the product. Reach includes Afghanistan, Bangladesh, Pakistan, Gambia, and Palestine (UK Charity No. 1180159).",
      "Monorepo delivery: Next.js frontend on Vercel with Express/MongoDB APIs on Railway — Stripe and PayPal checkout, Cloudflare R2 media, transactional email, and optional Mailgun marketing queues.",
    ],
    highlights: [
      "Public donation UX with Stripe/PayPal checkout and confirmation flows",
      "Peer-to-peer fundraisers and teams with donor auth and dashboard",
      "Appeals, campaign CMS, countries/geo pages, and program pages (Zakat, Qurbani, water wells, food packs)",
      "Admin CRM: donations, recurring subscriptions, Gift Aid exports, finance/ledger, analytics",
      "Transactional email plus email marketing (Mailgun; optional Redis/BullMQ)",
      "~40+ Next.js routes plus a large admin surface — architecture through production deploy",
    ],
    caseStudy: {
      problem:
        "The charity needed a trustworthy modern donation and fundraising system: payments, Gift Aid, campaigns, P2P fundraisers, donor accounts, and admin tools — not a static marketing site.",
      approach:
        "Owned full-stack delivery from requirements and system design through implementation: Next.js App Router UI, Express/MongoDB APIs, Stripe/PayPal webhooks, JWT auth, Gift Aid workflows, Zakat and program pages, R2 storage, email systems, and deploy to Vercel/Railway.",
      outcome:
        "A live production platform at assubahoutreach.com serving donors and admins — end-to-end donations, fundraising, Gift Aid, multi-country appeals, and ops tooling for a UK-registered Islamic charity.",
    },
    gallery: [
      {
        src: "/outreach.png",
        alt: "As-Subah Outreach portfolio banner",
        caption: "Charity donation platform — device mockups",
      },
    ],
  },
  {
    slug: "mugas-platform",
    title: "MUGAS - University Astronomy Society Platform",
    seoAliases: [
      "MUGAS",
      "MUGAS platform",
      "mugas.vercel.app",
      "MBSTU Astronomy Society",
      "University Astronomy Society Platform",
    ],
    description:
      "Comprehensive MERN stack platform for Mawlana Bhashani Science and Technology University Astronomy Society (MUGAS). Features member management, research project tracking, event coordination, blog publishing, and interactive community tools to support astronomical research and education.",
    tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS", "MERN Stack"],
    link: "https://mugas.vercel.app/",
    image: "/mugas.png",
    category: "Web Application",
    role: "Full-stack Developer",
    year: "2024",
    overview: [
      "MUGAS needed a centralized platform to manage their growing astronomy community, research initiatives, and educational outreach programs. The platform serves as a hub for members, researchers, and the public to engage with astronomical content and activities.",
      "Built with modern web technologies focusing on scalability, user experience, and maintainability. Includes admin dashboard for content management, member verification system, research publication tools, and interactive features like event registration and blog commenting.",
    ],
    highlights: [
      "Complete member management system with verification and profile customization",
      "Research project tracking and publication system with co-authorship credits",
      "Event management with registration and attendance tracking",
      "Blog platform for astronomical content and educational materials",
      "Admin dashboard for comprehensive content and user management",
      "Responsive design optimized for desktop and mobile astronomy enthusiasts",
    ],
    caseStudy: {
      problem:
        "MUGAS lacked a centralized digital platform to coordinate their activities, manage membership, showcase research, and engage with the broader astronomy community. Members were using disparate tools for communication and content sharing, leading to fragmented experiences and difficulty in tracking contributions.",
      approach:
        "Designed a comprehensive MERN stack application with modular architecture. Implemented secure authentication, role-based access control, and RESTful APIs. Created intuitive user interfaces with consistent design patterns and optimized database schemas for research and member data.",
      outcome:
        "Delivered a robust platform that streamlines MUGAS operations, enhances member engagement, and provides a professional showcase for their astronomical research and educational initiatives. The platform has improved collaboration and made astronomical knowledge more accessible to the university community.",
    },
    gallery: [
      {
        src: "/mugas.png",
        alt: "MUGAS Admin Dashboard",
        caption: "Administrative interface for content management",
      },
      {
        src: "https://picsum.photos/seed/mugas-research/1200/750",
        alt: "Research Section",
        caption: "Research projects and publications showcase",
      },
      {
        src: "https://picsum.photos/seed/mugas-events/1200/750",
        alt: "Events Page",
        caption: "Event registration and community activities",
      },
    ],
    extraLinks: [
      {
        label: "MUGAS Official Website",
        href: "https://mugas.vercel.app/",
      },
    ],
  },
  {
    slug: "ecoscrap",
    title: "EcoScrap",
    seoAliases: [
      "EcoScrap",
      "Eco Scrap",
      "ecoscrap-solution.vercel.app",
      "e-waste recycling platform",
    ],
    description:
      "Comprehensive MERN stack platform for digital scrap collection and recycling, enabling users to sell or donate e-waste while empowering agents and partners. Focused on role-based access, secure transactions, and a responsive UI to promote sustainable waste management through technology.",
    tags: ["React", "Node.js", "MongoDB", "Firebase Auth", "Express", "MERN Stack", "Responsive Design"],
    link: "https://ecoscrap-solution.vercel.app",
    image: "/ecoscrap.png",
    category: "Web Application",
    role: "Full-stack development",
    year: "2024",
    overview: [
      "EcoScrap addresses the need for a digital marketplace in waste recycling, allowing users to request pickups for scrap items, track orders, and manage wallets—all with role-based permissions for users, agents, and admins.",
      "The platform integrates Firebase authentication for secure login, MongoDB for data persistence, and a React frontend for seamless user experiences across devices, ensuring scalability and maintainability as the user base grows.",
    ],
    highlights: [
      "Role-based authentication and authorization (User, Agent, Partner) with Firebase",
      "Real-time pickup requests, order tracking, and wallet transactions for fair compensation",
      "Responsive design with i18n support (English/Bengali) for broader accessibility",
      "Admin dashboards for managing categories, prices, donation projects, and user data",
    ],
    caseStudy: {
      problem:
        "Traditional scrap collection is inefficient, cash-based, and lacks transparency. Users needed a digital way to sell/donate waste securely, while agents required tools to manage pickups and ensure fair payouts.",
      approach:
        "Developed a full-stack solution with clear API endpoints for CRUD operations, integrated Firebase for auth and real-time updates, and built reusable React components for consistent UI. Prioritized security (e.g., token-based auth) and performance (e.g., pagination for large datasets).",
      outcome:
        "A functional marketplace that digitizes waste recycling, reduces cash transactions, and promotes environmental sustainability. The app supports ongoing growth with modular code and easy deployment via Vercel.",
    },
    gallery: [
      { src: "/ecoscrap.png", alt: "EcoScrap Dashboard", caption: "User dashboard for managing pickups and wallet" },
      { src: "/ecoscrap-pickup.png", alt: "Pickup Request Flow", caption: "Agent interface for handling pickup requests" },
      {
        src: "https://picsum.photos/seed/ecoscrap-mobile/1200/750",
        alt: "Mobile View",
        caption: "Responsive design on mobile devices",
      },
    ],
    extraLinks: [
      {
        label: "API Documentation",
        href: "https://ecoscrap-solution.vercel.app/",
      },
    ],
  },
  {
    slug: "jubileean-football-fest",
    title: "Jubileean Football Fest",
    seoAliases: [
      "Jubileean Football Fest",
      "Jubilee Football Fest",
      "jubileean-football-fest.vercel.app",
      "Government Jubilee High School football",
    ],
    description:
      "Official site for the annual alumni football tournament at Government Jubilee High School, Sunamganj. Includes live match control and scores (real-time updates), fixtures, teams, players, leaderboards, gallery, news, and an admin CMS—built with React, Node, MongoDB, and Socket.IO. Deployed on Vercel.",
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "REST API",
    ],
    link: "https://jubileean-football-fest.vercel.app/",
    image: "/jubileanfest.png",
    category: "Live site",
    role: "Full stack · real-time features",
    year: "2024",
    overview: [
      "Jubileean Football Fest is a tournament hub: fixtures, squads, live scores, media, and admin tooling in one place. Real-time updates mattered so spectators and organizers always see the same state during match days.",
      "The stack combines a React + TypeScript client, Node/Express APIs, MongoDB for persistence, and Socket.IO for live score and match-control flows. Deployment targets Vercel for the front end with a clear split for API and realtime services.",
    ],
    highlights: [
      "Live scoring and match control with Socket.IO",
      "Admin-oriented CMS patterns for content and tournament data",
      "Public areas for fixtures, teams, gallery, and news in one cohesive UI",
    ],
    caseStudy: {
      problem:
        "Tournament weekends need one source of truth for scores, fixtures, and media—spectators on phones and admins on the sideline must stay in sync without refresh hacks.",
      approach:
        "I built a typed React client on Vite, Express + MongoDB for domain data, and Socket.IO channels for live match control and score updates, with admin flows for content and structure.",
      outcome:
        "A single hub for the fest: public discovery (teams, gallery, news) plus realtime match state and tooling that organizers can run during the event.",
    },
    gallery: [
      { src: "/jubileanfest.png", alt: "Jubileean Football Fest", caption: "Tournament hub" },
      {
        src: "https://picsum.photos/seed/jubilean-live/1200/750",
        alt: "",
        caption: "Live scores & match context",
      },
    ],
  },
  {
    slug: "hostel-meals",
    title: "Hostel Meals",
    seoAliases: [
      "Hostel Meals",
      "Hostel Meal & Food Review Management Platform",
      "hostel meal management",
      "hostel-management-by-ratul.web.app",
    ],
    description:
      "A hostel meal and food-review platform with role-based access, premium Stripe subscriptions, and SaaS-style admin dashboards for meals, users, payments, and reviews.",
    tags: [
      "React.js",
      "React Router",
      "Tailwind CSS",
      "Firebase Auth",
      "Express.js",
      "MongoDB",
      "JWT",
      "Stripe",
      "React Hook Form",
    ],
    link: "https://hostel-management-by-ratul.web.app/",
    image: "/hostel-meals.png",
    category: "Full-Stack Platform",
    role: "Full Stack",
    year: "2024",
    overview: [
      "A web app that streamlines hostel food management through a secure role-based system, allowing users to explore meals and subscribe to premium plans, while admins efficiently manage meal content, users, and payments.",
      "Built as a scalable MERN-style product with Firebase Auth, JWT-secured APIs, Stripe memberships, and dashboards that stay usable on mobile.",
    ],
    highlights: [
      "Scalable role-based system with secure access and dynamic UI per user type",
      "Stripe premium membership plans (Silver / Gold / Platinum) with badge rendering and access control",
      "Admin dashboards with paginated analytics on orders, payments, and reviews",
      "Meal CRUD with image uploads, role assignment, subscription management, and review moderation",
      "Real-time updates and server-side search across operational flows",
    ],
    caseStudy: {
      problem:
        "Hostel meal operations needed role-aware access, premium subscriptions, and admin tooling for meals, payments, and reviews — without a fragmented stack of forms and spreadsheets.",
      approach:
        "Built a React + Express + MongoDB platform with Firebase Auth and JWT, Stripe membership tiers, and SaaS-style dashboards for orders, payments, and moderation.",
      outcome:
        "A live production app at hostel-management-by-ratul.web.app demonstrating end-to-end hostel meal management with subscriptions and admin ops.",
    },
    gallery: [
      {
        src: "/hostel-meals.png",
        alt: "Hostel Meals platform",
        caption: "Hostel meal management platform",
      },
    ],
    extraLinks: [
      {
        label: "Client Code",
        href: "https://github.com/Ratul8863/Hostel-Meals_Client",
      },
      {
        label: "Server Code",
        href: "https://github.com/Ratul8863/Hostel-Meals_Server",
      },
    ],
  },
  {
    slug: "hobbyhub",
    title: "HobbyHub",
    seoAliases: [
      "HobbyHub",
      "HobyHub",
      "Hobby Hub",
      "hobyhub-by-ratul.web.app",
      "Group Management Web App",
    ],
    description:
      "A community-driven group management app where people discover, join, or create local hobby groups and connect through events, dashboards, and real-time updates.",
    tags: [
      "React.js",
      "React Router",
      "Tailwind CSS",
      "Firebase Auth",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    link: "https://hobyhub-by-ratul.web.app/",
    image: "/hobbyhub.png",
    category: "Full-Stack Community App",
    role: "Full Stack",
    year: "2024",
    overview: [
      "HobbyHub is a community-driven web app where people can discover, join, or create local hobby-based groups (e.g. Fishing, Photography, Running) and connect with like-minded individuals.",
      "Users explore groups by category, popularity, or date; create and manage their own groups; and access personalized dashboards with stats, activity, and member insights.",
    ],
    highlights: [
      "Browse local hobby groups filtered by category, popularity, or date",
      "Create and manage interest-based groups with events and descriptions",
      "Personalized dashboards with group activity and member insights",
      "Firebase Auth with Express/MongoDB backend for community workflows",
    ],
    caseStudy: {
      problem:
        "People looking for local hobby communities needed a simple way to discover groups, join activities, and manage membership without heavy social-network complexity.",
      approach:
        "Built a React + Express + MongoDB app with Firebase Auth, group discovery filters, creator tools, and dashboards for activity and member insights.",
      outcome:
        "A live production community platform at hobyhub-by-ratul.web.app for discovering and running local hobby groups.",
    },
    gallery: [
      {
        src: "/hobbyhub.png",
        alt: "HobbyHub homepage",
        caption: "Hobby group discovery and community hub",
      },
    ],
    extraLinks: [
      {
        label: "Client Code",
        href: "https://github.com/Ratul8863/Hoby-hub-client",
      },
      {
        label: "Server Code",
        href: "https://github.com/Ratul8863/Hobby-hub-server",
      },
    ],
  },
  {
    slug: "product-recommendation",
    title: "Product Recommendation System",
    seoAliases: [
      "RecoSys",
      "Product Recommendation",
      "product-recommendation-byratul.web.app",
      "Interactive Review Platform",
    ],
    description:
      "An interactive review platform where users share product queries, exchange recommendations, and engage through a real-time activity feed of likes, shares, and suggestions.",
    tags: [
      "React.js",
      "React Router",
      "Tailwind CSS",
      "Firebase Auth",
      "Express.js",
      "MongoDB",
      "JWT",
      "Framer Motion",
    ],
    link: "https://product-recommendation-byratul.web.app/",
    image: "/product-recommendation.png",
    category: "Full-Stack Review Platform",
    role: "Full Stack",
    year: "2024",
    overview: [
      "A full-featured platform where users can share, explore, and interact with product-related queries and recommendations, with full control over their content and real-time social engagement.",
      "Users create tagged queries, explore others' recommendations, add personalized suggestions, and follow a live activity feed across the platform.",
    ],
    highlights: [
      "Create, update, and delete product-related queries with tags and context",
      "Explore queries and receive tailored product recommendations",
      "Add personalized recommendations and browse community suggestions",
      "Real-time activity feed for likes, shares, and recommendation activity",
    ],
    caseStudy: {
      problem:
        "Shoppers and reviewers needed a focused space to ask product questions, share recommendations, and see social engagement without a generic forum layout.",
      approach:
        "Implemented a React + Express + MongoDB stack with Firebase Auth, JWT APIs, Framer Motion UI, and a real-time-style activity feed for recommendation engagement.",
      outcome:
        "A live production review platform at product-recommendation-byratul.web.app for query-driven product recommendations.",
    },
    gallery: [
      {
        src: "/product-recommendation.png",
        alt: "Product Recommendation System homepage",
        caption: "RecoSys — queries and recommendations",
      },
    ],
    extraLinks: [
      {
        label: "Client Code",
        href: "https://github.com/Ratul8863/Product-Recommendations-client",
      },
      {
        label: "Server Code",
        href: "https://github.com/Ratul8863/Product-Recommendations-server",
      },
    ],
  },
];

export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((p) => p.slug === slug);
}

export function getProjectNeighbors(slug: string): {
  prev: Project | undefined;
  next: Project | undefined;
} {
  const i = getProjectIndex(slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? PROJECTS[i - 1] : undefined,
    next: i < PROJECTS.length - 1 ? PROJECTS[i + 1] : undefined,
  };
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
