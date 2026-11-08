import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { services, servicesIntro } from "@/constants/services";
import { cn } from "@/lib/utils";

export function CreativeCraftSection() {
  return (
    <SectionContainer id="services" className="py-16 md:py-24">
      <ScrollReveal>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="font-display text-[clamp(3.5rem,12vw,12.5rem)] uppercase leading-none text-navy">
            Creative
            <br />
            Craft
          </h2>
          <p className="max-w-[714px] font-body text-[clamp(1.125rem,2vw,2rem)] leading-[1.3] text-text">
            {servicesIntro}
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-[60px] flex flex-col gap-10">
        {services.map((service, index) => (
          <article
            key={service.id}
            className={cn(
              "sticky flex flex-col gap-10 p-8 text-white md:flex-row md:items-center md:gap-[60px] md:p-10 xl:gap-[100px]",
              service.tone === "navy" ? "bg-navy" : "bg-slate",
              index === 0 && "top-4",
              index === 1 && "top-8",
              index === 2 && "top-12 relative"
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-16 md:gap-[100px]">
              <h3
                className={cn(
                  "font-display text-[clamp(2.5rem,8vw,9.375rem)] uppercase leading-[0.9]",
                  service.id === "product-design" && "max-w-[12ch]"
                )}
              >
                {service.title}
              </h3>
              <div className="flex flex-col gap-10 md:flex-row md:gap-[100px] xl:gap-[150px]">
                <p className="max-w-[577px] font-body text-[clamp(1rem,1.5vw,1.5rem)] leading-[1.4]">
                  {service.description}
                </p>
                <ul className="flex min-w-[180px] flex-col gap-0.5 font-body text-base leading-6">
                  {service.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className={cn(
                "w-full shrink-0 bg-gray md:w-[38%] md:max-w-[509px]",
                service.id === "product-design"
                  ? "min-h-[280px] md:min-h-[554px] md:self-stretch"
                  : "aspect-[509/400] md:h-[400px]"
              )}
              aria-hidden
            />
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
