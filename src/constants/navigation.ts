export type NavItem = {
  id: string;
  label: string;
  href: string;
  number: string;
};

export const primaryNav: NavItem[] = [
  { id: "projects", number: "01", label: "My Projects", href: "#projects" },
  { id: "about", number: "02", label: "About Me", href: "#about" },
  { id: "services", number: "03", label: "Services", href: "#services" },
  {
    id: "certifications",
    number: "05",
    label: "Certification",
    href: "#certifications",
  },
  { id: "contact", number: "04", label: "Contact Me", href: "#contact" },
];

/** Homepage Figma nav — in-page anchors for the dark portfolio layout */
export const homeNav: NavItem[] = [
  { id: "projects", number: "01", label: "Feature Projects", href: "#projects" },
  { id: "all-projects", number: "02", label: "All Projects", href: "#all-projects" },
  { id: "contact", number: "03", label: "Contact Me", href: "#contact" },
];

export const footerLinks = [
  { label: "My Projects", href: "#projects" },
  { label: "About Me", href: "#about" },
  { label: "Service", href: "#services" },
  { label: "Certification", href: "#certifications" },
  { label: "Contact", href: "#contact" },
] as const;

export const darkFooterSectionLinks = [
  { label: "Feature Projects", href: "#projects" },
  { label: "All Projects", href: "#all-projects" },
  { label: "Contact Form", href: "#contact" },
] as const;

export const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Settings", href: "/dashboard/settings" },
] as const;
