/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { LandingHeader } from "../components/landing/LandingHeader";
import { HeroSection } from "../components/landing/HeroSection";
import { AboutSection } from "../components/landing/AboutSection";
import { WhatCanIDoSection } from "../components/landing/WhatCanIDoSection";
import { ProjectsSection } from "../components/landing/ProjectsSection";
import { TechStackSection } from "../components/landing/TechStackSection";
import { AchievementsSection } from "../components/landing/AchievementsSection";
import { ContactSection } from "../components/landing/ContactSection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { ScrollFloater } from "../components/landing/ScrollFloater";
import type { Project } from "../data/projects";
import type { Achievement } from "../data/achievements";

type LandingPageProps = {
  projects: Project[];
  achievements: Achievement[];
};

export default function LandingPage({ projects, achievements }: LandingPageProps) {
  return (
    <div className="relative min-h-dvh bg-bg text-ink antialiased">
      <LandingHeader projectCount={projects.length} />
      <ScrollFloater />
      <main id="main-content">
        {/* Sticky hero under-layer + About over-layer (curtain).
            id="home" must live on a non-sticky node — sticky #home reports
            the stuck viewport position, so nav “Home” would not scroll to top. */}
        <div id="home" className="relative scroll-mt-0">
          <div className="sticky top-0 z-[1]">
            <HeroSection />
          </div>
          <div className="relative z-[2]">
            <AboutSection />
          </div>
        </div>
        <WhatCanIDoSection />
        <ProjectsSection projects={projects} />
        <TechStackSection />
        <AchievementsSection achievements={achievements} />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
