"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { homeNav, primaryNav, type NavItem } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/shared/social-links";
import { LiquidCarveButton } from "@/components/ui/liquid-carve-button";
import {
  MobileCurvedMenu,
  MOBILE_MENU_CLOSE_BG,
  MOBILE_MENU_CLOSE_FG,
} from "@/components/layout/mobile-curved-menu";
import { scrollToY } from "@/providers/smooth-scroll-provider";
import { cn } from "@/lib/utils";

type SidebarVariant = "light" | "dark";

/** Home logo: other pages → `/`; already on home → scroll to top. */
function BrandHomeLink({
  className,
  onNavigate,
  children,
}: {
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={className}
      aria-label={`${siteConfig.shortName} home`}
      onClick={(event) => {
        onNavigate?.();
        if (pathname !== "/") return;
        event.preventDefault();
        scrollToY(0);
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
      }}
    >
      {children}
    </Link>
  );
}

function NavContent({
  onNavigate,
  variant,
  items,
  compact = false,
}: {
  onNavigate?: () => void;
  variant: SidebarVariant;
  items: NavItem[];
  /** Mobile drawer: Dennis-like text routes instead of fill cards. */
  compact?: boolean;
}) {
  const isDark = variant === "dark";

  /* Mobile curved menu — clean text list like the reference video */
  if (compact) {
    return (
      <div className="flex h-full flex-col gap-8">
        <nav aria-label="Primary" className="min-h-0 flex-1">
          <p
            className={cn(
              "mb-5 font-ui text-[11px] font-medium tracking-[0.22em] uppercase",
              isDark ? "text-cream/45" : "text-ink/45",
            )}
          >
            Navigation
          </p>
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-baseline gap-3 py-2.5 pr-8 font-body transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2",
                    isDark
                      ? "text-cream hover:opacity-100 focus-visible:ring-cream"
                      : "text-ink hover:opacity-100 focus-visible:ring-navy",
                    "opacity-90",
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 font-ui text-[11px] tracking-wide",
                      isDark ? "text-cream/40" : "text-ink/40",
                    )}
                  >
                    {item.number}
                  </span>
                  <span className="text-[clamp(1.75rem,7vw,2.35rem)] leading-[1.15] tracking-[-0.02em]">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex shrink-0 flex-col gap-5 pt-6">
          <LiquidCarveButton
            label="Book A Call"
            href={siteConfig.bookCallUrl}
            newTab
            onClick={onNavigate}
            fill={isDark ? "#f9f4eb" : "#002b5d"}
            textColor={isDark ? "#1a1c1c" : "#ffffff"}
            blobColor={isDark ? "#000000" : "#010c17"}
            blobSize={78}
            smoothness={42}
            rounded={0}
            transition={{
              type: "tween",
              ease: [0.22, 1, 0.36, 1],
              duration: 0.45,
            }}
            padding="18px 16px"
            className={
              isDark
                ? "w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                : "w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            }
          />
          <div>
            <p
              className={cn(
                "mb-3 font-ui text-[11px] font-medium tracking-[0.22em] uppercase",
                isDark ? "text-cream/45" : "text-ink/45",
              )}
            >
              Socials
            </p>
            <SocialLinks variant={isDark ? "cream" : "light"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        isDark ? "gap-[30px]" : "gap-6",
      )}
    >
      <BrandHomeLink
        className="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        onNavigate={onNavigate}
      >
        {isDark ? (
          <Image
            src="/assets/logo-r-cream.svg"
            alt={siteConfig.shortName}
            width={64}
            height={80}
            className="h-[80px] w-[64px]"
            priority
          />
        ) : (
          <Image
            src="/assets/logo-rsr.svg"
            alt={siteConfig.shortName}
            width={214}
            height={81}
            className="h-auto w-full max-w-[180px]"
            priority
          />
        )}
      </BrandHomeLink>

      <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex min-h-0 flex-1">
              <a
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "sidebar-fill-btn group relative flex w-full flex-col justify-between overflow-hidden p-4 font-body text-lg focus-visible:outline-none focus-visible:ring-2",
                  isDark
                    ? "sidebar-fill-btn--dark bg-ink text-cream focus-visible:ring-cream"
                    : "sidebar-fill-btn--light bg-mist font-ui text-text focus-visible:ring-navy",
                )}
              >
                <span className="relative z-10 flex items-center justify-between">
                  <span
                    className={cn(
                      "sidebar-fill-btn__num inline-block origin-left",
                      isDark && "text-center leading-[26px]",
                    )}
                  >
                    {item.number}
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "sidebar-fill-btn__icon size-6 shrink-0",
                      isDark ? "opacity-100" : "opacity-80",
                    )}
                    aria-hidden
                  />
                </span>
                <span
                  className={cn(
                    "sidebar-fill-btn__label relative z-10 mt-8 inline-block origin-left",
                    isDark && "tracking-[1.8px]",
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 flex-col gap-4">
        <LiquidCarveButton
          label="Book A Call"
          href={siteConfig.bookCallUrl}
          newTab
          onClick={onNavigate}
          fill={isDark ? "#f9f4eb" : "#002b5d"}
          textColor={isDark ? "#1a1c1c" : "#ffffff"}
          blobColor={isDark ? "#000000" : "#010c17"}
          blobSize={78}
          smoothness={42}
          rounded={0}
          transition={{
            type: "tween",
            ease: [0.22, 1, 0.36, 1],
            duration: 0.45,
          }}
          padding="18px 16px"
          className={
            isDark
              ? "w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
              : "w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          }
        />
        <div className={cn(isDark ? "bg-ink px-4 py-3" : "bg-navy-btn px-4 py-3")}>
          <SocialLinks variant={isDark ? "cream" : "light"} />
        </div>
      </div>
    </div>
  );
}

/**
 * Menu toggle — sharp square tile (portfolio geometry), not Dennis circle.
 * Closed: outlined ink square + bars. Open: cream plate + ink X (Book A Call tokens).
 */
function MenuToggleButton({
  open,
  isDark,
  onToggle,
  menuId,
  reduceMotion,
}: {
  open: boolean;
  isDark: boolean;
  onToggle: () => void;
  menuId: string;
  reduceMotion: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const lineA = useRef<HTMLSpanElement>(null);
  const lineB = useRef<HTMLSpanElement>(null);
  const lineC = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const a = lineA.current;
    const b = lineB.current;
    const c = lineC.current;
    if (!btn || !a || !b || !c) return;

    const dur = reduceMotion ? 0.01 : 0.32;
    const ease = "power3.inOut";
    const lineBase = { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" };
    // Same footprint open/closed — only fill + icon morph (sharp corners always).
    const size = 48;

    if (open) {
      const openBg = isDark ? MOBILE_MENU_CLOSE_BG : "#1a1c1c";
      const openFg = isDark ? MOBILE_MENU_CLOSE_FG : "#f9f4eb";
      gsap.to(btn, {
        width: size,
        height: size,
        borderRadius: 0,
        backgroundColor: openBg,
        borderColor: openBg,
        color: openFg,
        padding: 0,
        duration: dur,
        ease,
        overwrite: "auto",
      });
      gsap.to(a, {
        ...lineBase,
        y: 0,
        rotation: 45,
        width: 18,
        height: 2,
        duration: dur,
        ease,
        overwrite: "auto",
      });
      gsap.to(b, {
        ...lineBase,
        autoAlpha: 0,
        scaleX: 0.35,
        duration: dur * 0.35,
        ease,
        overwrite: "auto",
      });
      gsap.to(c, {
        ...lineBase,
        y: 0,
        rotation: -45,
        width: 18,
        height: 2,
        duration: dur,
        ease,
        overwrite: "auto",
      });
    } else {
      gsap.to(btn, {
        width: size,
        height: size,
        borderRadius: 0,
        backgroundColor: "transparent",
        borderColor: isDark ? "#1a1c1c" : "rgba(0,43,93,0.35)",
        color: isDark ? "#1a1c1c" : "#002b5d",
        padding: 0,
        duration: dur,
        ease,
        overwrite: "auto",
      });
      gsap.to(a, {
        ...lineBase,
        y: -7,
        rotation: 0,
        width: 22,
        height: 1.5,
        duration: dur,
        ease,
        overwrite: "auto",
      });
      gsap.to(b, {
        ...lineBase,
        autoAlpha: 1,
        scaleX: 1,
        width: 22,
        height: 1.5,
        duration: dur,
        ease,
        overwrite: "auto",
      });
      gsap.to(c, {
        ...lineBase,
        y: 7,
        rotation: 0,
        width: 22,
        height: 1.5,
        duration: dur,
        ease,
        overwrite: "auto",
      });
    }
  }, [open, isDark, reduceMotion]);

  useEffect(() => {
    const btn = btnRef.current;
    const a = lineA.current;
    const b = lineB.current;
    const c = lineC.current;
    if (!btn || !a || !b || !c) return;
    const base = { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" };
    gsap.set(btn, {
      width: 48,
      height: 48,
      borderRadius: 0,
      backgroundColor: "transparent",
      borderColor: isDark ? "#1a1c1c" : "rgba(0,43,93,0.35)",
      color: isDark ? "#1a1c1c" : "#002b5d",
    });
    gsap.set(a, { ...base, y: -7, rotation: 0, width: 22, height: 1.5 });
    gsap.set(b, { ...base, autoAlpha: 1, scaleX: 1, width: 22, height: 1.5 });
    gsap.set(c, { ...base, y: 7, rotation: 0, width: 22, height: 1.5 });
  }, [isDark]);

  return (
    <button
      ref={btnRef}
      type="button"
      id="mobile-nav-toggle"
      aria-controls={menuId}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
      className={cn(
        "relative z-[70] inline-flex size-12 shrink-0 items-center justify-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isDark
          ? "border-ink text-ink focus-visible:ring-cream focus-visible:ring-offset-black"
          : "border-navy/35 text-navy focus-visible:ring-navy focus-visible:ring-offset-white",
      )}
    >
      <span className="relative size-6" aria-hidden>
        <span
          ref={lineA}
          className="absolute top-1/2 left-1/2 h-[1.5px] w-[22px] bg-current"
        />
        <span
          ref={lineB}
          className="absolute top-1/2 left-1/2 h-[1.5px] w-[22px] bg-current"
        />
        <span
          ref={lineC}
          className="absolute top-1/2 left-1/2 h-[1.5px] w-[22px] bg-current"
        />
      </span>
    </button>
  );
}

export function SidebarNav({
  variant = "light",
  items,
}: {
  variant?: SidebarVariant;
  items?: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = variant === "dark";
  const navItems = items ?? (isDark ? homeNav : primaryNav);
  const menuDomId = "mobile-curved-nav";

  return (
    <>
      <aside
        className={cn(
          /* Sticky in-flow: scrolls away when footer arrives (not fixed overlay). */
          "z-40 hidden shrink-0 flex-col self-start lg:flex",
          isDark
            ? "intro-rise-sidebar sticky top-5 h-[calc(100svh-2.5rem)] w-[214px] bg-transparent"
            : "sticky top-5 h-[calc(100svh-2.5rem)] w-[234px] bg-white px-5 py-5",
        )}
      >
        <div className="flex h-full flex-col">
          <NavContent variant={variant} items={navItems} />
        </div>
      </aside>

      <div
        className={cn(
          /* Home mobile: chrome sits ON the hero (fixed). Other pages sticky. */
          "flex items-center justify-between px-2.5 py-2.5 lg:hidden",
          isDark
            ? "fixed inset-x-0 top-0 border-b border-transparent"
            : "sticky top-0 border-b border-navy/10",
          open ? "z-[60]" : "z-40",
          /* Open: blend into curved panel; closed: keep light chrome. */
          open
            ? isDark
              ? "bg-black"
              : "bg-white"
            : isDark
              ? "bg-white"
              : "bg-white/95 backdrop-blur",
        )}
      >
        <BrandHomeLink
          onNavigate={() => {
            if (open) setOpen(false);
          }}
        >
          {isDark ? (
            <Image
              src={open ? "/assets/logo-r-cream.svg" : "/assets/logo-r-ink.svg"}
              alt={siteConfig.shortName}
              width={30}
              height={38}
              className="h-[38px] w-auto"
              unoptimized
            />
          ) : (
            <Image
              src="/assets/logo-rsr.svg"
              alt={siteConfig.shortName}
              width={56}
              height={32}
            />
          )}
        </BrandHomeLink>

        <MenuToggleButton
          open={open}
          isDark={isDark}
          menuId={menuDomId}
          reduceMotion={reduceMotion}
          onToggle={() => setOpen((v) => !v)}
        />
      </div>

      <MobileCurvedMenu
        id={menuDomId}
        open={open}
        onOpenChange={setOpen}
        reduceMotion={reduceMotion}
        surfaceClassName={
          isDark ? "bg-black text-cream" : "bg-white text-ink"
        }
        curveFillClassName={isDark ? "text-black" : "text-white"}
        indicatorClassName={isDark ? "bg-cream" : "bg-navy"}
      >
        <NavContent
          variant={variant}
          items={navItems}
          compact
          onNavigate={() => setOpen(false)}
        />
      </MobileCurvedMenu>
    </>
  );
}
