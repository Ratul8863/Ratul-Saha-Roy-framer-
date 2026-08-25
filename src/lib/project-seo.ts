import type { Project } from "@/data/projects";
import { PROJECTS } from "@/lib/projects";
import { getSiteUrl, siteName } from "@/lib/site";

/** Title that ties the live brand to you as the developer. */
export function projectSeoTitle(project: Project): string {
  return `${project.title} by ${siteName} — Case Study`;
}

/** Description that names you + live site so Google associates both. */
export function projectSeoDescription(project: Project): string {
  const role = project.role ?? "Full stack web developer";
  let host = "";
  try {
    host = new URL(project.link).hostname.replace(/^www\./, "");
  } catch {
    host = project.link;
  }
  return (
    `${project.title} — ${role} by ${siteName}. ` +
    `${project.description} ` +
    `Live site: ${host}. View the full case study on ${siteName}'s portfolio.`
  );
}

export function projectSeoKeywords(project: Project): string[] {
  const aliases = project.seoAliases ?? [];
  let host = "";
  try {
    host = new URL(project.link).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }
  return [
    project.title,
    ...aliases,
    siteName,
    `${project.title} ${siteName}`,
    `${project.title} developer`,
    `${project.title} web developer`,
    `${project.title} case study`,
    `built by ${siteName}`,
    host,
    ...project.tags,
    "portfolio",
    "MERN",
  ].filter(Boolean);
}

/** CreativeWork + WebSite schema linking you as creator of the live project. */
export function projectJsonLd(project: Project) {
  const base = getSiteUrl();
  const canonical = `${base}/projects/${project.slug}`;
  const image = project.image.startsWith("http")
    ? project.image
    : new URL(project.image, base).toString();

  const person = { "@id": `${base}/#person` };

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "WebSite"],
    "@id": `${canonical}#work`,
    name: project.title,
    alternateName: project.seoAliases ?? [],
    description: projectSeoDescription(project),
    url: canonical,
    image,
    dateCreated: project.year,
    creator: person,
    author: person,
    contributor: person,
    about: project.title,
    keywords: projectSeoKeywords(project).join(", "),
    sameAs: [project.link],
    isPartOf: { "@id": `${base}/#website` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
      url: canonical,
      name: projectSeoTitle(project),
      description: projectSeoDescription(project),
      isPartOf: { "@id": `${base}/#website` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: base,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${base}/projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: canonical,
          },
        ],
      },
    },
  };

  return creativeWork;
}

/** Homepage / archive list of all projects for discovery. */
export function projectsItemListJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${base}/#projects`,
    name: `Web projects built by ${siteName}`,
    description: `Portfolio case studies and live websites developed by ${siteName}, including Assubah, As-Subah Outreach, and other full-stack products.`,
    numberOfItems: PROJECTS.length,
    itemListElement: PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: `${base}/projects/${project.slug}`,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        url: `${base}/projects/${project.slug}`,
        sameAs: project.link,
        creator: { "@id": `${base}/#person` },
        alternateName: project.seoAliases ?? [],
      },
    })),
  };
}
