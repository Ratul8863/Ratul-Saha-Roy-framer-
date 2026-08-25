/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Shared content + layout constants for the landing page (v3 light theme). */

export interface LandingNavLink {
  href: string;
  label: string;
}

export const LANDING_NAV_LINKS: LandingNavLink[] = [
  { href: "#projects", label: "My Project" },
  { href: "#about", label: "About Me" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";

export const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com/ratulroy8863", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com/ratulroy8863", icon: "instagram" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ratulroy8863", icon: "linkedin" },
  { name: "GitHub", href: "https://github.com/ratulroy8863", icon: "github" },
] as const;

export interface SkillItem {
  name: string;
  description: string;
  image: string;
}

export const SKILLS: SkillItem[] = [
  {
    name: "Responsive UI (front-end).",
    description:
      "I turn layouts into fast, responsive React and Tailwind interfaces\u2014clear structure, thoughtful spacing, and motion where it helps. I am a developer who cares about usability and polish; I do not position myself as a dedicated UI/UX designer, but I ship interfaces that feel intentional.",
    image: "/service-01.png",
  },
  {
    name: "Full stack (MERN)",
    description:
      "End-to-end features with MongoDB, Express, React, and Node\u2014REST APIs, auth-aware flows, and dashboards that stay maintainable. Same mindset I use on internships and personal builds: real data, real constraints, real users.",
    image: "/service-02.png",
  },
  {
    name: "APIs, data & integrations",
    description:
      "REST APIs, Firebase when the product needs realtime or auth helpers, and sensible database choices (MongoDB or MySQL). I focus on predictable contracts between client and server so features are easier to test and extend.",
    image: "/service-03.png",
  },
];

export const SKILL_TAGS = [
  "Web Design",
  "Web Development",
  "UI/UX Design",
  "Branding",
] as const;

export interface TechStackItem {
  name: string;
  icon: string;
  size: "lg" | "md";
}

export const TECH_STACK: TechStackItem[] = [
  { name: "HTML", icon: "/landing/tech-icons/html.svg", size: "lg" },
  { name: "JavaScript", icon: "/landing/tech-icons/javascript.svg", size: "md" },
  { name: "TailWind", icon: "/landing/tech-icons/tailwind.svg", size: "md" },
  { name: "Node JS", icon: "/landing/tech-icons/nodejs.svg", size: "md" },
  { name: "DataBase", icon: "/landing/tech-icons/database.svg", size: "md" },
  { name: "DataBase", icon: "/landing/tech-icons/database.svg", size: "md" },
  { name: "Figma", icon: "/landing/tech-icons/figma.svg", size: "md" },
  { name: "GitHub", icon: "/landing/tech-icons/github.svg", size: "md" },
  { name: "FireBase", icon: "/landing/tech-icons/firebase.svg", size: "md" },
];
