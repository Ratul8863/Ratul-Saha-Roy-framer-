export const siteConfig = {
  name: "Ratul Saha Roy",
  shortName: "RSR",
  title: "Ratul Saha Roy — Software Developer",
  description:
    "Junior Software Developer at Kode By Kraft · CSE @ Metropolitan University, Sylhet · Full-Stack, AI/ML & Research.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://ratul-saha-roy.pro.bd",
  locale: "en_US",
  email: "ratulroy8863@gmail.com",
  /** No Cal.com link in TARGET — WhatsApp uses verified phone from prior portfolio. */
  bookCallUrl: "https://wa.me/8801795908863",
  social: {
    facebook: "https://www.facebook.com/ratulroy8863",
    github: "https://github.com/ratulroy8863",
    instagram: "https://www.instagram.com/ratulroy8863",
    linkedin: "https://www.linkedin.com/in/ratulroy8863",
    whatsapp: "https://wa.me/8801795908863",
  },
  creator: "Ratul Saha Roy",
  role: "Software Developer",
} as const;

export type SiteConfig = typeof siteConfig;
