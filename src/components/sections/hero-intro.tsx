import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { heroIntro } from "@/constants/projects";

export function HeroIntro() {
  return (
    <SectionContainer className="pb-16 pt-10 md:pb-24 md:pt-14">
      <ScrollReveal>
        <p className="max-w-[1391px] font-body text-[clamp(1.125rem,2.5vw,2.5rem)] leading-[1.2] text-navy-dark">
          {heroIntro}
        </p>
      </ScrollReveal>
    </SectionContainer>
  );
}
