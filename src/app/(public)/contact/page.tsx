import type { Metadata } from "next";
import { ContactFormSection } from "@/components/sections/contact-form-section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ratul Saha Roy for software collaborations and projects.",
};

export default function ContactPage() {
  return <ContactFormSection />;
}
