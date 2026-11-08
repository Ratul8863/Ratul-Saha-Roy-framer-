import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const socialItems = [
  {
    key: "facebook",
    href: siteConfig.social.facebook,
    label: "Facebook",
    glyph: "f",
    creamIcon: "/assets/social-facebook-cream.svg",
  },
  {
    key: "github",
    href: siteConfig.social.github,
    label: "GitHub",
    glyph: "Gh",
    creamIcon: "/assets/social-linkedin-cream.svg",
  },
  {
    key: "instagram",
    href: siteConfig.social.instagram,
    label: "Instagram",
    glyph: "Ig",
    creamIcon: "/assets/social-instagram-cream.svg",
  },
  {
    key: "linkedin",
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
    glyph: "in",
    iconSrc: "/assets/linkedin-icon.svg",
    creamIcon: "/assets/social-linkedin-cream.svg",
  },
] as const;

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
  variant?: "default" | "light" | "cream";
}

export function SocialLinks({
  className,
  iconClassName,
  variant = "default",
}: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center justify-between gap-2", className)}>
      {socialItems.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={cn(
              "inline-flex size-6 items-center justify-center font-ui text-[10px] font-semibold uppercase transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2",
              variant === "cream"
                ? "text-cream opacity-80 hover:opacity-100 focus-visible:ring-cream"
                : variant === "light"
                  ? "text-white hover:opacity-80 focus-visible:ring-navy"
                  : "text-navy hover:opacity-80 focus-visible:ring-navy",
              iconClassName
            )}
          >
            {variant === "cream" ? (
              item.key === "github" ? (
                <span aria-hidden>{item.glyph}</span>
              ) : (
                <Image
                  src={item.creamIcon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                  aria-hidden
                />
              )
            ) : "iconSrc" in item && item.iconSrc && variant === "light" ? (
              <Image
                src={item.iconSrc}
                alt=""
                width={20}
                height={20}
                className="size-5"
                aria-hidden
              />
            ) : (
              <span aria-hidden>{item.glyph}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
