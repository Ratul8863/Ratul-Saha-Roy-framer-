export type SocialPlatform =
  | "facebook"
  | "behance"
  | "dribbble"
  | "instagram"
  | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  number?: string;
}

export type MessageStatus = "new" | "read" | "archived";

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface NewsletterDTO {
  id: string;
  email: string;
  createdAt: string;
}

export interface ProjectDTO {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  role: string;
  category: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationDTO {
  id: string;
  title: string;
  issuer: string;
  image: string;
  issuedAt?: string;
  credentialUrl?: string;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
