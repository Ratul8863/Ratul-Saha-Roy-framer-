import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Ratul Saha Roy, Junior Software Developer at Kode By Kraft and CSE student at Metropolitan University, Sylhet.",
};

export default function AboutPage() {
  return <AboutSection />;
}
