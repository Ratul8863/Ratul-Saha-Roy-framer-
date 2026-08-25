/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AchievementType =
  | "award"
  | "certification"
  | "milestone"
  | "education";

export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  link?: string;
  type: AchievementType;
  /** Path under /public, e.g. "/achievements/cert.jpg" */
  image?: string;
  imageAlt?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Champion — Hult Prize On-Campus",
    issuer: "Hult Prize · Metropolitan University",
    date: "2026",
    description:
      "Team EcoScrap won the On-Campus Round. As CTO, led technical architecture and system design for a circular-economy scrap platform aligned with UN SDGs.",
    link: "https://ecoscrap-solution.vercel.app",
    type: "award",
    image: "/achievements/hult.jpeg",
    imageAlt:
      "EcoScrap team as Champion of Hult Prize On-Campus Round at Metropolitan University",
  },
  {
    title: "2nd Runner-Up — NASA Space Apps Challenge",
    issuer: "NASA · BASIS · Sylhet Regional",
    date: "2025",
    description:
      "Team ULKA placed 2nd Runner-Up at the Sylhet Regional Round. Contributed as Full-Stack Developer, Content Writer, and Video Editor, with guidance from MUGAS at Metropolitan University.",
    type: "award",
    image: "/achievements/nsac.jpeg",
    imageAlt:
      "Team ULKA at NASA International Space Apps Challenge, Sylhet Regional Round",
  },
  {
    title: "Top 60 Finalist — MillionX AI Build-a-Thon",
    issuer: "MillionX Bangladesh",
    date: "2026",
    description:
      "Team Bornokontho reached the Top 60 of 400+ teams nationwide with NagriPath — selected for the national final round representing Metropolitan University.",
    type: "award",
    image: "/achievements/millionx.jpeg",
    imageAlt:
      "Team Bornokontho at MillionX Bangladesh AI Build-a-Thon representing Metropolitan University",
  },
  {
    title: "Top 50 Finalist — InnovateX Hackathon",
    issuer: "BUBT IT Club · Programming Hero",
    date: "2025",
    description:
      "Team EarthSync (Team Leader) reached the Top 50 of 170+ teams nationwide and competed in the final on-site round at BUBT.",
    type: "award",
    image: "/achievements/innovatex.jpeg",
    imageAlt:
      "Team EarthSync at InnovateX Hackathon 2025, BUBT IT Club",
  },
  {
    title: "Jr. Software Developer",
    issuer: "Kode By Kraft",
    date: "2025 – Present",
    description:
      "Promoted from Web Developer Intern to Junior Software Developer — building impactful products and growing with the team.",
    link: "https://kodebykraft.com/",
    type: "milestone",
    image: "/achievements/kbk.jpeg",
    imageAlt:
      "Promotion announcement — Ratul Saha Roy as Jr. Software Developer at Kode By Kraft",
  },
  {
    title: "Black Belt Web Developer",
    issuer: "Programming Hero",
    date: "2025",
    description:
      "Awarded for outstanding performance in the Complete Web Development Course (Batch 11) — MERN stack, Firebase, and Tailwind CSS.",
    type: "certification",
    image: "/achievements/ph-blackbelt.jpeg",
    imageAlt:
      "Programming Hero Black Belt Web Developer certificate awarded to Ratul Saha Roy",
  },
  {
    title: "Complete Web Development — with Excellence",
    issuer: "Programming Hero",
    date: "2025",
    description:
      "Completed the Complete Web Development Course (Batch 11, WEB11-3237) with Excellence — JavaScript, React, and full-stack project work.",
    type: "certification",
    image: "/achievements/ph-completion.jpeg",
    imageAlt:
      "Programming Hero Certificate of Completion with Excellence — Complete Web Development Course",
  },
  {
    title: "Youth Climate Action Programme",
    issuer: "British Council · FIVDB",
    date: "2024 – 2025",
    description:
      "Participated in Building Agency of Youth in Climate Action — developed and implemented a Social Action Plan over six months of training and community engagement.",
    type: "certification",
    image: "/achievements/fivdb.jpeg",
    imageAlt:
      "Certificate of Participation — Youth Climate Action Program, British Council and FIVDB",
  },
  {
    title: "3-Minutes Idea Presentation",
    issuer: "SUST Science Arena",
    date: "2025",
    description:
      "Certificate of Appreciation for participating in the 3-Minutes Idea Presentation at SSA Inter University Science & Technology Festival, Edition 3.",
    type: "certification",
    image: "/achievements/ssa-fest.jpeg",
    imageAlt:
      "Certificate of Appreciation — SSA Inter University Science & Technology Festival Edition 3",
  },
  {
    title: "Runner-Up — Intra-MU Debating Competition",
    issuer: "Metropolitan University Debating Club",
    date: "2025",
    description:
      "Team অগ্নিবাণ reached Final Round Runner-Up at the First Intra-Metropolitan University Debating Competition — 8 teams across departments.",
    type: "award",
    image: "/achievements/debate.jpeg",
    imageAlt:
      "Certificate of Achievement — Final Round Runner-Up, Team অগ্নিবাণ, MUDC Debating Competition 2025",
  },
  {
    title: "Live Production Deployment",
    issuer: "As-Subah Academy",
    date: "2024",
    description:
      "Delivered and launched a full-stack Islamic learning platform currently serving real users in production.",
    link: "https://www.assubah.com/",
    type: "milestone",
    image: "/assubah.png",
    imageAlt: "As-Subah Academy live production website",
  },
  {
    title: "10+ Projects Shipped",
    issuer: "Personal & client work",
    date: "2024 – Present",
    description:
      "Built and published a growing portfolio of full-stack and front-end projects across the MERN stack.",
    type: "milestone",
    image: "/mugas.png",
    imageAlt: "Portfolio of shipped web projects",
  },
  {
    title: "Bachelor's in Computer Science & Engineering",
    issuer: "Metropolitan University, Sylhet",
    date: "Ongoing",
    description:
      "Pursuing CSE with a focus on software development, problem solving, and modern web technologies.",
    type: "education",
    image: "/service-01.png",
    imageAlt: "Computer Science and Engineering studies",
  },
];
