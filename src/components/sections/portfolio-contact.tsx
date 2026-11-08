import { PortfolioContactForm } from "@/components/forms/portfolio-contact-form";
import { BlockTextReveal } from "@/components/ui/block-text-reveal";

const CONTACT_INTRO =
  "Have a project in mind or an idea you’d love to bring to life? I’m always open to meaningful collaborations and exciting new challenges. Feel free to reach out through my socials or fill out the form below. Let’s create something impactful together.";

export function PortfolioContact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-black py-10 sm:py-[50px] lg:scroll-mt-6"
    >
      <div className="flex flex-col items-start gap-8 sm:gap-10 lg:flex-row lg:gap-12 xl:gap-[100px] 2xl:gap-[326px]">
        <BlockTextReveal
          text={CONTACT_INTRO}
          textColor="#f9f4eb"
          className="w-full max-w-[487px] font-body text-[14px] leading-5 tracking-[0.4px] uppercase sm:text-[20px] sm:leading-7 sm:tracking-[0.6px] lg:sticky lg:top-8 lg:w-[min(487px,38%)] lg:shrink-0"
        />
        <div className="w-full min-w-0 max-w-[813px] border border-dashed border-cream px-3 pb-5 pt-8 sm:px-[30px] sm:pb-[30px] sm:pt-[43px]">
          <PortfolioContactForm />
        </div>
      </div>
    </section>
  );
}
