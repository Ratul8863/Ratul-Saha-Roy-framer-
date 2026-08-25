import { ACHIEVEMENTS } from "@/data/achievements";
import { PROJECTS } from "@/data/projects";

/** Keep in sync with `siteName` in `@/lib/site`. */
const PERSON_NAME = "Ratul Saha Roy";

/** Stable bio / org facts used across meta + JSON-LD. */
export const SEO_BIO = {
  jobTitle: "Junior Software Developer",
  company: "Kode By Kraft",
  companyAliases: ["KodeByKraft", "Kode By Kraft", "KBK"],
  companyUrl: "https://kodebykraft.com/",
  university: "Metropolitan University, Sylhet",
  universityAliases: [
    "Metropolitan University",
    "Metropolitan University Sylhet",
    "MU Sylhet",
  ],
  degree: "Bachelor's in Computer Science & Engineering (CSE)",
  location: "Sylhet, Bangladesh",
} as const;

/**
 * Extra search phrases for events / awards (people type these in Google).
 */
const ACHIEVEMENT_SEARCH_PHRASES: string[] = [
  "Hult Prize",
  "Hult Prize On-Campus",
  "Hult Prize Metropolitan University",
  "EcoScrap Hult Prize",
  "NASA Space Apps Challenge",
  "NASA Space Apps Sylhet",
  "NASA Space Apps BASIS",
  "Team ULKA",
  "MillionX AI Build-a-Thon",
  "MillionX Bangladesh",
  "NagriPath",
  "Bornokontho",
  "InnovateX Hackathon",
  "InnovateX BUBT",
  "EarthSync",
  "Programming Hero",
  "Programming Hero Black Belt",
  "Black Belt Web Developer",
  "British Council Youth Climate Action",
  "FIVDB",
  "SUST Science Arena",
  "SSA Inter University Science Festival",
  "Metropolitan University Debating Club",
  "MUDC",
];

export function projectSearchTerms(): string[] {
  return PROJECTS.flatMap((p) => [p.title, ...(p.seoAliases ?? [])]);
}

export function achievementSearchTerms(): string[] {
  const fromData = ACHIEVEMENTS.flatMap((a) => [a.title, a.issuer]);
  return [...fromData, ...ACHIEVEMENT_SEARCH_PHRASES];
}

export function buildSiteSeoKeywords(): string[] {
  const base = [
    PERSON_NAME,
    "Ratul",
    "রাতুল সাহা রায়",
    "Ratul Roy",
    `${PERSON_NAME} portfolio`,
    `${PERSON_NAME} developer`,
    `${PERSON_NAME} web developer`,
    `${PERSON_NAME} MERN`,
    `${PERSON_NAME} Bangladesh`,
    `${PERSON_NAME} Sylhet`,
    SEO_BIO.company,
    ...SEO_BIO.companyAliases,
    `${PERSON_NAME} ${SEO_BIO.company}`,
    `${SEO_BIO.company} developer`,
    SEO_BIO.university,
    ...SEO_BIO.universityAliases,
    `${PERSON_NAME} Metropolitan University`,
    "CSE Metropolitan University Sylhet",
    "full stack developer Bangladesh",
    "MERN stack developer Sylhet",
    "React developer Bangladesh",
    "web developer Sylhet",
    "ratul-saha-roy.pro.bd",
  ];

  const unique = new Set<string>();
  for (const term of [
    ...base,
    ...projectSearchTerms(),
    ...achievementSearchTerms(),
  ]) {
    const t = term.trim();
    if (t.length >= 2) unique.add(t);
  }
  return Array.from(unique);
}

export function buildDefaultDescription(): string {
  const projectNames = PROJECTS.slice(0, 6)
    .map((p) => p.title)
    .join(", ");
  return (
    `${PERSON_NAME} — ${SEO_BIO.jobTitle} at ${SEO_BIO.company}; CSE student at ${SEO_BIO.university}. ` +
    `Full Stack (MERN) developer. Projects: ${projectNames}. ` +
    `Awards include Hult Prize On-Campus Champion, NASA Space Apps Sylhet 2nd Runner-Up, MillionX & InnovateX finalist. ` +
    `Portfolio: ratul-saha-roy.pro.bd`
  );
}

export function buildCrawlSummary(): string {
  const projects = PROJECTS.map((p) => {
    const aliases = p.seoAliases?.length
      ? `; also: ${p.seoAliases.slice(0, 3).join(", ")}`
      : "";
    return `${p.title} (${p.link}${aliases})`;
  }).join(". ");

  const awards = ACHIEVEMENTS.map(
    (a) => `${a.title} — ${a.issuer} (${a.date})`
  ).join(". ");

  return (
    `${PERSON_NAME} is a ${SEO_BIO.jobTitle} at ${SEO_BIO.company} (${SEO_BIO.companyUrl}) ` +
    `and a ${SEO_BIO.degree} student at ${SEO_BIO.university}, based in ${SEO_BIO.location}. ` +
    `Portfolio projects by ${PERSON_NAME}: ${projects}. ` +
    `Achievements and events: ${awards}.`
  );
}

export function personAwardNodes(siteUrl: string) {
  return ACHIEVEMENTS.filter(
    (a) => a.type === "award" || a.type === "certification"
  ).map((a) => ({
    "@type":
      a.type === "certification"
        ? "EducationalOccupationalCredential"
        : "Award",
    name: a.title,
    description: a.description,
    dateReceived: a.date,
    recognizedBy: {
      "@type": "Organization",
      name: a.issuer,
    },
    url: a.link || `${siteUrl}/#achievements`,
  }));
}

export function achievementsItemListJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#achievements`,
    name: `Awards, certifications & milestones — ${PERSON_NAME}`,
    description: `Hackathons, competitions, certifications, education, and career milestones of ${PERSON_NAME}.`,
    numberOfItems: ACHIEVEMENTS.length,
    itemListElement: ACHIEVEMENTS.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      description: `${a.title} — ${a.issuer}. ${a.description ?? ""}`,
      url: a.link || `${siteUrl}/#achievements`,
    })),
  };
}
