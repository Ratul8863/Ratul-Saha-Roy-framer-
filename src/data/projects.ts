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
    link: "#",
    image: "https://picsum.photos/seed/hostel/800/600",
    category: "Full stack",
    role: "Full stack (MERN-style)",
    year: "—",
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
        src: "https://picsum.photos/seed/hostel-a/1200/750",
        alt: "",
        caption: "Orders overview",
      },
      {
        src: "https://picsum.photos/seed/hostel-b/1200/750",
        alt: "",
        caption: "Role-based views",
      },
    ],
  },
  {
    slug: "hobbyhub",
    title: "HobbyHub",
    description:
      "Community product for discovering and joining local hobby groups—real-time friendly features with Firebase plus Express APIs. Practice in list/detail UX, forms, and collaborative data.",
    tags: ["React", "Firebase", "Express"],
    link: "#",
    image: "https://picsum.photos/seed/hobby/800/600",
    category: "Community",
    role: "Full stack · realtime data",
    year: "—",
    overview: [
      "HobbyHub explores how people discover groups and join activities nearby. Firebase handles auth and realtime-friendly data; Express fills in API-shaped workflows where a traditional backend fits better.",
      "List and detail UX, forms, and collaborative updates are the core practice surface—keeping states clear when multiple people touch the same group data.",
    ],
    highlights: [
      "Firebase-backed auth and live-friendly reads/writes",
      "Express APIs for structured server-side logic",
      "List/detail and form flows tuned for clarity",
    ],
    caseStudy: {
      problem:
        "People discover hobbies through browsing and trust—listings need to feel fresh, forms need to be forgiving, and updates should propagate when multiple members interact.",
      approach:
        "Firebase covers auth and collaborative-friendly data; Express fills gaps where server validation and aggregation fit better. List/detail patterns keep navigation shallow and predictable.",
      outcome:
        "A community-shaped prototype that shows how I combine realtime client state with traditional API boundaries for a balanced architecture.",
    },
    gallery: [
      {
        src: "https://picsum.photos/seed/hobby-a/1200/750",
        alt: "",
        caption: "Discover & browse",
      },
      {
        src: "https://picsum.photos/seed/hobby-b/1200/750",
        alt: "",
        caption: "Group detail & join flow",
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
