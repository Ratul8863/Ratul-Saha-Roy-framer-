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
}

export const PROJECTS: Project[] = [
  {
    slug: "assubah",
    title: "Assubah",
    description:
      "Developed a modern, responsive marketing and platform experience for Assubah—structured layout, clear information hierarchy, and attention to performance. Focused on clean UI, smooth interactions, and a maintainable front-end so the site stays fast and easy to extend.",
    tags: ["React", "Tailwind CSS", "Responsive UI", "Performance"],
    link: "https://www.assubah.com/",
    image: "/assubah.png",
    category: "Live site",
    role: "Front-end development",
    year: "2024",
    overview: [
      "Assubah needed a marketing-facing experience that feels calm, trustworthy, and fast on every device. I focused on a clear typographic hierarchy, generous spacing, and components that stay consistent as content grows.",
      "Performance and maintainability were priorities: lean layouts, sensible breakpoints, and patterns that make it straightforward to add new sections without fighting the design system.",
    ],
    highlights: [
      "Responsive layout with a consistent component language across pages",
      "Emphasis on readability, spacing, and subtle motion where it helps",
      "Structure aimed at long-term maintainability and quick iteration",
    ],
    caseStudy: {
      problem:
        "The brand needed a public site that feels credible and fast, scales with new marketing sections, and stays easy for collaborators to extend without layout drift.",
      approach:
        "I structured pages around repeatable layout primitives, tuned typography and spacing for scanability, and kept interactions lightweight so performance stays stable as content grows.",
      outcome:
        "A cohesive marketing surface that reads well on mobile and desktop, with a component-friendly structure that supports ongoing updates and iteration.",
    },
    gallery: [
      { src: "/assubah.png", alt: "Assubah", caption: "Primary marketing surface" },
      {
        src: "https://picsum.photos/seed/assubah-ui/1200/750",
        alt: "",
        caption: "Section rhythm & spacing study",
      },
    ],
    extraLinks: [
      {
        label: "Related: As-Subah Outreach",
        href: "https://www.assubahoutreach.com/",
      },
    ],
  },
  {
    slug: "as-subah-outreach",
    title: "As-Subah Outreach",
    description:
      "Charity website for sustainable support across multiple countries—donations, appeals, and impact storytelling for As-Subah Outreach. Emphasis on readable content, responsive sections, and reliable structure so donors can explore appeals and trust how the organization presents its work online.",
    tags: ["React", "Express", "MongoDB", "REST APIs"],
    link: "https://www.assubahoutreach.com/",
    image: "/outreach.png",
    category: "Live site",
    role: "Full stack–oriented delivery",
    year: "2024",
    overview: [
      "As-Subah Outreach connects donors with appeals and impact stories across regions. The site had to carry emotional storytelling without sacrificing clarity—especially on mobile, where many users first discover the organization.",
      "I worked with a structure that separates content types (appeals, impact, ways to give) so the experience scales as campaigns change. API-backed flows support dynamic data where the product needs it.",
    ],
    highlights: [
      "Donor-friendly layouts with strong readability and trust cues",
      "REST-backed sections integrated with Express and MongoDB patterns",
      "Responsive sections tuned for long-form content and calls to action",
    ],
    caseStudy: {
      problem:
        "Donors and supporters needed a clear path from story to action—appeals, impact, and ways to give—without overwhelming mobile readers or burying trust signals.",
      approach:
        "I separated content types into predictable sections, leaned on readable type and whitespace, and wired dynamic areas to REST APIs so campaigns can update without redeploying static copy everywhere.",
      outcome:
        "A charity-facing experience that balances emotion and clarity, with room to grow as new appeals and regions come online.",
    },
    gallery: [
      { src: "/outreach.png", alt: "As-Subah Outreach", caption: "Appeals & storytelling" },
      {
        src: "https://picsum.photos/seed/outreach-flow/1200/750",
        alt: "",
        caption: "Donor journey & CTAs",
      },
    ],
  },
  {
    slug: "mugas-platform",
    title: "MUGAS - University Astronomy Society Platform",
    description:
      "Developed a comprehensive MERN stack platform for Mawlana Bhashani Science and Technology University Astronomy Society (MUGAS). Features member management, research project tracking, event coordination, blog publishing, and interactive community tools to support astronomical research and education.",
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
        src: "/mugas-dashboard.png",
        alt: "MUGAS Admin Dashboard",
        caption: "Administrative interface for content management",
      },
      {
        src: "/mugas-research.png",
        alt: "Research Section",
        caption: "Research projects and publications showcase",
      },
      {
        src: "/mugas-events.png",
        alt: "Events Page",
        caption: "Event registration and community activities",
      },
      {
        src: "/mugas-team.png",
        alt: "Team Section",
        caption: "Member profiles and leadership showcase",
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
    description:
      "Built a comprehensive MERN stack platform for digital scrap collection and recycling, enabling users to sell or donate e-waste while empowering agents and partners. Focused on role-based access, secure transactions, and a responsive UI to promote sustainable waste management through technology.",
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
    description:
      "Full stack app for hostel meal management: role-based access, orders, and secure flows. Sharpens my MERN patterns—REST APIs, auth-minded design, and dashboards that stay usable on mobile.",
    tags: ["React", "Node.js", "Stripe", "JWT"],
    link: "https://hostel-management-by-ratul.web.app/",
    image: "/hostel-meals.png",
    category: "Live site",
    role: "Full stack · real-time features",
    year: "2024",
    overview: [
      "A product-shaped exercise in meal ordering and operations for a hostel context: roles, orders, and flows that need to stay understandable on small screens.",
      "The focus is on predictable REST contracts, JWT-oriented access patterns, and dashboards that do not overwhelm—so the same codebase can grow toward production hardening.",
    ],
    highlights: [
      "Role-based views and order flows",
      "Payment-oriented integration patterns (Stripe)",
      "Mobile-first dashboard layout",
    ],
    caseStudy: {
      problem:
        "Hostel meal operations need simple roles, predictable ordering, and flows that still work when everyone is on a phone—without exposing sensitive actions.",
      approach:
        "I modeled REST resources around orders and roles, used JWT-shaped access patterns, and kept dashboard density low so the same screens work for students and staff.",
      outcome:
        "A MERN-style reference build that demonstrates how I structure auth-aware UI, payments, and mobile-first dashboards for real constraints.",
    },
    gallery: [
      {
        src: "/hostel-meals.png",
        alt: "Hostel Meals orders overview",
        caption: "Orders overview",
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
