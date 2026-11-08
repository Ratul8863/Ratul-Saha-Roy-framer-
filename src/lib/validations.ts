import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  subject: z.string().trim().min(2, "Subject is required").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  phone: z.string().trim().max(40).optional(),
  website: z.string().trim().max(200).optional(),
  budget: z.string().trim().max(80).optional(),
  services: z.array(z.string()).optional(),
});

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  summary: z.string().trim().min(10),
  description: z.string().trim().min(20),
  role: z.string().trim().min(2),
  category: z.string().trim().min(2),
  coverImage: z.string().trim().min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
