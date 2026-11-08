import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { ctaCopy } from "@/constants/services";

export function CtaSection() {
  return (
    <SectionContainer id="contact" className="py-16 md:py-24 lg:py-[120px]">
      <ScrollReveal>
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:gap-[100px]">
          <h2 className="max-w-[835px] font-display text-[clamp(3.5rem,12vw,12.5rem)] uppercase leading-none text-navy">
            Make It Happen
          </h2>
          <p className="max-w-[707px] flex-1 font-body text-[clamp(1.125rem,2vw,2rem)] leading-[1.3] text-text">
            {ctaCopy}
          </p>
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
}
