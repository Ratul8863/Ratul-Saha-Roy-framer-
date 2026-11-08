/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Shared content + layout constants for the landing page. */

export interface LandingNavLink {
  href: string;
  label: string;
}

export const LANDING_NAV_LINKS: LandingNavLink[] = [
  { href: "#about", label: "About" },
  { href: "#services", label: "What I Do" },
  { href: "#projects", label: "Selected Work" },
  { href: "#research", label: "Research" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";

/** GitHub + LinkedIn first (primary). */
export const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/ratulroy8863", icon: "github" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ratulroy8863", icon: "linkedin" },
  { name: "Facebook", href: "https://facebook.com/ratulroy8863", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com/ratulroy8863", icon: "instagram" },
] as const;

export interface SkillItem {
  name: string;
  description: string;
  image: string;
}

export const SKILLS: SkillItem[] = [
  {
    name: "Full-Stack Development",
    description:
      "I build complete web applications across the frontend and backend using React.js, Next.js, Node.js, Express.js, MongoDB, and MySQL. I work with authentication, REST APIs, dashboards, CRUD systems, payment integrations, and real-world application workflows.",
    image: "/service-01.png",
  },
  {
    name: "AI & Machine Learning",
    description:
      "I work with Artificial Intelligence and Machine Learning and am currently expanding into Deep Learning. I enjoy building predictive and intelligent systems, experimenting with data-driven approaches, and exploring how AI can be applied to practical software and research problems.",
    image: "/service-02.png",
  },
  {
    name: "Research, Data & Geospatial Computing",
    description:
      "I work on research problems involving Machine Learning, climate data, GIS, remote sensing, and environmental analysis. My work includes satellite-data processing, spatiotemporal analysis, and causal-impact analysis using datasets such as Landsat, Hansen Global Forest Change, JRC Tropical Moist Forest, and ESA CCI.",
    image: "/service-03.png",
  },
  {
    name: "Software Engineering & DevOps",
    description:
      "I work beyond application code—from API design and database architecture to testing, containerization, CI/CD, performance optimization, and deployment. I use Git/GitHub, Docker, GitHub Actions, Postman, and platforms such as Vercel, Netlify, and Render.",
    image: "/service-04.png",
  },
  {
    name: "Technical Leadership & Problem Solving",
    description:
      "I enjoy taking ownership of technical challenges, working across teams, and turning ideas into working solutions. I have contributed as a CTO, Team Leader, Full-Stack Developer, and technical team member across hackathons, client projects, production applications, and research initiatives.",
    image: "/service-05.png",
  },
];

/** About focus tags (matches original pill style). */
export const ABOUT_FOCUS = [
  "Software Development",
  "AI & Machine Learning",
  "Research & Data",
] as const;

export interface TechStackItem {
  name: string;
  icon: string;
  size: "lg" | "md";
}

export const TECH_STACK: TechStackItem[] = [
  { name: "HTML", icon: "/landing/stack-icons/html5.svg", size: "lg" },
  { name: "JavaScript", icon: "/landing/stack-icons/javascript.svg", size: "md" },
  { name: "Tailwind CSS", icon: "/landing/stack-icons/tailwindcss.svg", size: "md" },
  { name: "Node.js", icon: "/landing/stack-icons/nodejs.svg", size: "md" },
  { name: "Database", icon: "/landing/tech-icons/html.svg", size: "md" },
  { name: "Database", icon: "/landing/tech-icons/html.svg", size: "md" },
  { name: "Figma", icon: "/landing/stack-icons/figma.svg", size: "md" },
  { name: "GitHub", icon: "/landing/stack-icons/github.svg", size: "md" },
  { name: "Firebase", icon: "/landing/stack-icons/firebase.svg", size: "md" },
];

export interface TechCategory {
  title: string;
  tags: string[];
}

export const TECH_CATEGORIES: TechCategory[] = [
  {
    title: "Languages",
    tags: ["JavaScript", "Python", "C", "C++", "Java", "TypeScript"],
  },
  {
    title: "Frontend",
    tags: [
      "React.js",
      "Next.js",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux",
      "Framer Motion",
      "Recharts",
    ],
  },
  {
    title: "Backend",
    tags: ["Node.js", "Express.js", "REST APIs", "JWT", "Nodemailer"],
  },
  {
    title: "Data & Cloud",
    tags: ["MongoDB", "MySQL", "Firebase", "Firebase Auth"],
  },
  {
    title: "AI / ML",
    tags: ["Machine Learning", "Deep Learning", "Data Analysis", "Python"],
  },
  {
    title: "Research tools",
    tags: ["QGIS", "Landsat", "Remote Sensing", "GIS"],
  },
  {
    title: "DevOps & tools",
    tags: [
      "Git",
      "GitHub",
      "Docker",
      "GitHub Actions",
      "Postman",
      "Vercel",
      "Netlify",
      "Render",
      "VS Code",
    ],
  },
  {
    title: "Design",
    tags: ["Figma", "Canva", "Framer"],
  },
  {
    title: "Soft Skills",
    tags: [
      "Problem Solving",
      "Teamwork",
      "Public Speaking",
      "Leadership",
      "Debating",
      "Time Management",
      "Adaptability",
    ],
  },
];

export interface ResearchItem {
  category: string;
  title: string;
  subtitle?: string;
  body: string;
  focus: string;
  year: string;
  image: string;
}

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    category: "Rainfall",
    title: "Interpretable Machine Learning for Rainfall Predictability",
    subtitle:
      "Interpretable Machine Learning for Monthly Rainfall Predictability and Uncertainty-Aware Scenario Generation in Bangladesh's Haor Basin",
    body: "A research direction exploring interpretable machine learning approaches for rainfall prediction and uncertainty-aware scenario generation in the Haor Basin of Bangladesh.",
    focus: "Machine Learning · Explainable AI · Rainfall Prediction · Climate Data",
    year: "2026",
    image: "/research/research-rainfall-base.png",
  },
  {
    category: "Climate",
    title: "Climate Variability & Hydrometeorological Risk",
    subtitle:
      "Spatiotemporal Analysis of Climate Variability, Thunderstorm Dynamics and Hydrometeorological Risks in Bangladesh's Haor Basin",
    body: "A research project examining climate variability, thunderstorm dynamics, and associated hydrometeorological risks through spatial and temporal data analysis.",
    focus: "Climate Data · GIS · Remote Sensing · Spatiotemporal Analysis",
    year: "2026",
    image: "/research/research-rainfall-overlay-2.png",
  },
  {
    category: "Forest",
    title: "Forest Loss & Environmental Impact Analysis",
    body: "I have worked with Landsat, Hansen Global Forest Change, JRC Tropical Moist Forest, ESA CCI, and QGIS to analyze forest loss, fragmentation, carbon dynamics, and environmental change in Cox's Bazar over 2001–2025, including causal-impact analysis related to the Rohingya influx.",
    focus: "Remote Sensing · GIS · Environmental Data · Causal Inference",
    year: "2025",
    image: "/research/research-rainfall-overlay-3.png",
  },
];

export interface LeadershipItem {
  role: string;
  org: string;
  description: string;
}

export const LEADERSHIP_ITEMS: LeadershipItem[] = [
  {
    role: "Organising Secretary",
    org: "Metropolitan University Debating Club",
    description:
      "Contributing to the planning, coordination, and execution of university debating activities and events.",
  },
  {
    role: "Joint Secretary",
    org: "Metropolitan University Geography & Astronomical Society",
    description:
      "Contributing to technical, academic, astronomy, geography, and community initiatives within the university.",
  },
  {
    role: "CTO",
    org: "EcoScrap — Hult Prize On-Campus",
    description:
      "Led the technical direction, architecture, and system design of the team's circular-economy solution.",
  },
  {
    role: "Team Leader",
    org: "EarthSync — InnovateX Hackathon",
    description:
      "Led the technical team through ideation, development, and competition preparation, reaching the Top 50 among 170+ teams.",
  },
];
