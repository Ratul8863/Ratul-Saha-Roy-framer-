import type { Metadata } from "next";
import { CreativeCraftSection } from "@/components/sections/creative-craft";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack development, AI/ML, and research-driven software services by Ratul Saha Roy.",
};

export default function ServicesPage() {
  return <CreativeCraftSection />;
}
