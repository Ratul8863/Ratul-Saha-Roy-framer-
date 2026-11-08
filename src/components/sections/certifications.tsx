import Image from "next/image";
import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { certificationsIntro } from "@/constants/services";

const certificates = [
  {
    src: "/achievements/ph-blackbelt.jpeg",
    alt: "Programming Hero Black Belt Web Developer credential — Ratul Saha Roy",
  },
  {
    src: "/achievements/kbk.jpeg",
    alt: "Kode By Kraft credential — Ratul Saha Roy",
  },
] as const;

export function CertificationsSection() {
  return (
    <SectionContainer id="certifications" className="py-16 md:py-24">
      <ScrollReveal>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:gap-[100px]">
          <h2 className="font-display text-[clamp(3.5rem,12vw,12.5rem)] uppercase leading-none text-navy">
            Earned &amp;
            <br />
            Learned
          </h2>
          <p className="max-w-[564px] flex-1 font-body text-[clamp(1.125rem,2vw,2rem)] leading-[1.3] text-text">
            {certificationsIntro}
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-[60px] grid gap-[40px] md:grid-cols-2 md:gap-[100px]">
        {certificates.map((certificate, index) => (
          <ScrollReveal key={certificate.src} delay={index * 0.08}>
            <figure className="shadow-[-6px_0_10px_rgba(0,0,0,0.25),6px_6px_10px_rgba(0,0,0,0.25)]">
              <Image
                src={certificate.src}
                alt={certificate.alt}
                width={1542}
                height={1090}
                className="h-auto w-full object-cover"
              />
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </SectionContainer>
  );
}
