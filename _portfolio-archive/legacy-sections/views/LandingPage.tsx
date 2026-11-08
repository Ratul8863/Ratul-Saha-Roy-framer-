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
import { ResearchSection } from "../components/landing/ResearchSection";
import { TechStackSection } from "../components/landing/TechStackSection";
import { AchievementsSection } from "../components/landing/AchievementsSection";
import { LeadershipSection } from "../components/landing/LeadershipSection";
import { ContactSection } from "../components/landing/ContactSection";
import { LandingFooter } from "../components/landing/LandingFooter";
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
      <main id="main-content">
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
        <ResearchSection />
        <AchievementsSection achievements={achievements} />
        <LeadershipSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
