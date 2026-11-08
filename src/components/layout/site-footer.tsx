import Image from "next/image";
import Link from "next/link";
import { darkFooterSectionLinks, footerLinks } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/shared/social-links";
import { FooterWordmark } from "@/components/layout/footer-wordmark";

const darkSocialLinks = [
  { label: "Gmail", href: `mailto:${siteConfig.email}` },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "GitHub", href: siteConfig.social.github },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "What's App", href: siteConfig.social.whatsapp },
] as const;

function LightFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="mx-auto w-full max-w-[1920px] px-5 pb-10 pt-8 md:px-8">
        <div className="relative mb-[60px] w-full">
          <Image
            src="/assets/footer-rsr.svg"
            alt={siteConfig.shortName}
            width={1880}
            height={619}
            className="h-auto w-full"
            priority={false}
          />
        </div>

        <div className="border border-white">
          <div className="grid grid-cols-1 border-b border-white sm:grid-cols-3 lg:grid-cols-5">
            {footerLinks.map((link) => (
              <div
                key={link.href}
                className="border-b border-white last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <a
                  href={link.href}
                  className="inline-flex w-full items-center gap-2.5 bg-white px-4 py-3.5 font-ui text-sm leading-5 text-text transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:py-4 sm:text-base"
                >
                  <span className="size-5 shrink-0 bg-text" aria-hidden />
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          <div className="relative h-[180px] overflow-hidden md:h-[300px]">
            <Image
              src="/assets/footer-pattern.svg"
              alt=""
              fill
              className="object-cover object-top"
              sizes="100vw"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <p className="font-body text-base leading-6 text-white">Explore:</p>
          <SocialLinks
            variant="light"
            className="gap-2.5"
            iconClassName="size-10"
          />
        </div>

        <p className="mt-8 text-center font-body text-sm text-white/70">
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          <Link
            href="/login"
            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}

function FooterLinkRow({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center justify-between gap-3 py-0.5 pr-1 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
    >
      <span className="min-w-0 origin-left font-ui text-base font-light leading-6 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:scale-[1.08]">
        {label}
      </span>
      <span className="flex size-5 shrink-0 items-center justify-center overflow-visible">
        <Image
          src="/assets/footer-arrow.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden
          className="transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-0 group-hover:scale-110 group-hover:rotate-6"
        />
      </span>
    </a>
  );
}

function DarkFooter() {
  return (
    <footer className="relative z-10 bg-black text-cream">
      <div className="mx-auto w-full max-w-[1920px] px-4 pb-8 pt-10 sm:px-5 sm:pb-10 sm:pt-[50px]">
        <div className="flex w-full flex-col border border-cream lg:flex-row lg:items-stretch">
          <FooterWordmark />

          <div className="flex w-full flex-col justify-center border-t border-cream p-5 sm:p-8 md:p-[50px] lg:max-w-[538px] lg:border-t-0 lg:border-x">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="font-body text-sm capitalize leading-6 tracking-[0.48px] text-cream/70 sm:text-base">
                  Sections
                </p>
                <div className="flex flex-col gap-1.5">
                  {darkFooterSectionLinks.map((link) => (
                    <div key={link.href} className="flex flex-col gap-1.5">
                      <FooterLinkRow label={link.label} href={link.href} />
                      <div className="h-px w-full bg-cream/80" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="font-body text-sm capitalize leading-6 tracking-[0.48px] text-cream/70 sm:text-base">
                  Social
                </p>
                <div className="flex flex-col gap-1.5">
                  {darkSocialLinks.map((link) => (
                    <div key={link.label} className="flex flex-col gap-1.5">
                      <FooterLinkRow label={link.label} href={link.href} />
                      <div className="h-px w-full bg-cream/80" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center border-t border-cream px-5 py-8 sm:px-8 sm:py-10 md:px-[100px] md:py-11 lg:border-t-0">
            <Image
              src="/assets/footer-r-mark.svg"
              alt=""
              width={265}
              height={332}
              className="h-auto w-[min(42vw,160px)] sm:w-[min(100%,220px)] lg:w-[min(100%,265px)]"
            />
          </div>
        </div>

        <p className="mt-8 text-center font-body text-sm text-cream/70">
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          <Link
            href="/login"
            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function SiteFooter({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  return variant === "dark" ? <DarkFooter /> : <LightFooter />;
}
