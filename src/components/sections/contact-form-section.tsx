import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function ContactFormSection() {
  return (
    <SectionContainer id="contact" className="py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <ScrollReveal>
          <p className="font-ui text-sm uppercase tracking-[0.18em] text-slate">
            Contact
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] uppercase leading-none text-navy">
            Let&apos;s Talk
          </h2>
          <p className="mt-5 max-w-md font-body text-base leading-relaxed text-text-muted">
            Tell me about your product, timeline, and goals. I&apos;ll get back
            with next steps and how we can collaborate.
          </p>
          <div className="mt-10">
            <p className="mb-3 font-ui text-sm font-medium text-navy">
              Stay in the loop
            </p>
            <NewsletterForm />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ContactForm />
        </ScrollReveal>
      </div>
    </SectionContainer>
  );
}
