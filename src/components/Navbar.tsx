/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import { siteName } from "@/lib/site";
import { useHash } from "@/hooks/useHash";
import { useHomeScrollSection } from "@/hooks/useHomeScrollSection";

export type AppNavLink = { href: string; label: string; cta?: boolean };

export const APP_NAV_LINKS: AppNavLink[] = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact", cta: true },
];

function isNavActive(
  pathname: string | null,
  hash: string,
  label: string,
  cta?: boolean
): boolean {
  const path = pathname ?? "";
  if (path.startsWith("/projects")) {
    return label === "Projects";
  }
  if (path !== "/") {
    return false;
  }
  const h = hash === "" ? "#home" : hash;
  if (cta || label === "Contact") {
    return h === "#contact";
  }
  switch (label) {
    case "Home":
      return h === "#home";
    case "About":
      return h === "#about";
    case "Services":
      return h === "#services";
    case "Projects":
      return h === "#projects";
    default:
      return false;
  }
}

function useMobileCenterLabel(
  activeHomeHash: string
): { primary: string; secondary: string } {
  const pathname = usePathname();
  const params = useParams();
  const slug = params?.slug;

  if (pathname?.startsWith("/projects/") && typeof slug === "string") {
    const project = getProjectBySlug(slug);
    return {
      primary: project?.title ?? "Case study",
      secondary: "Case study",
    };
  }
  if (pathname === "/projects") {
    return { primary: "Projects", secondary: "Archive" };
  }

  const sectionByHash: Record<string, string> = {
    "#home": "Home",
    "#about": "About",
    "#services": "Services",
    "#projects": "Projects",
    "#contact": "Contact",
  };
  return {
    primary: siteName,
    secondary: sectionByHash[activeHomeHash] ?? "Portfolio",
  };
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const hash = useHash();
  const scrollSection = useHomeScrollSection();
  const navHash =
    pathname === "/" || pathname === "" ? scrollSection : hash;
  const mobileCenter = useMobileCenterLabel(scrollSection);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-3 right-3 top-3 z-50 max-w-none sm:left-1/2 sm:right-auto sm:top-6 sm:w-fit sm:max-w-none sm:-translate-x-1/2"
    >
      <div className="nav-pill flex items-center justify-between gap-3 px-3 py-2.5 sm:gap-8 sm:px-6 sm:py-3 sm:justify-start">
        <Link
          href="/"
          className="group/brand flex min-w-0 items-center gap-2 rounded-full outline-none transition-transform duration-300 hover:opacity-95 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent/45"
          aria-label="Home"
        >
          <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-[0_4px_14px_-4px_rgba(93,95,239,0.65)] ring-2 ring-white transition-transform duration-300 group-hover/brand:scale-105">
            <Image
              src="/profileimage.png"
              alt="Ratul Saha Roy"
              width={32}
              height={32}
              className="object-cover object-top"
              priority
            />
          </span>
          <span
            className="relative flex h-2 w-2 shrink-0"
            aria-hidden
            title="Available"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_12px_rgba(16,185,129,0.45)]" />
          </span>
        </Link>

        <Link
          href="/"
          className="flex min-w-0 max-w-[min(52vw,14rem)] flex-1 flex-col items-center justify-center px-1 text-center no-underline outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-xl lg:hidden"
          aria-label={`${siteName}, go to home`}
        >
          <span className="w-full truncate text-[10px] font-bold uppercase tracking-[0.14em] text-black sm:text-[11px]">
            {mobileCenter.primary}
          </span>
          <span className="w-full truncate text-[8px] font-bold uppercase tracking-[0.18em] text-black/45 sm:text-[9px]">
            {mobileCenter.secondary}
          </span>
        </Link>

        <div className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/50 lg:flex xl:gap-2 xl:text-[11px] xl:tracking-[0.2em]">
          {APP_NAV_LINKS.map(({ href, label, cta }) => {
            const active = isNavActive(pathname, navHash, label, cta);
            return cta ? (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 transition-all duration-300 ${
                  active
                    ? "bg-black text-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)] ring-2 ring-black/10 ring-offset-2 ring-offset-white/80"
                    : "bg-black text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] active:translate-y-0"
                }`}
              >
                {label}
              </Link>
            ) : (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-2 transition-colors duration-200 xl:px-3.5 ${
                  active
                    ? "text-black"
                    : "text-black/50 hover:text-black/80"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill-active"
                    className="absolute inset-0 -z-10 rounded-full bg-black/[0.06]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm transition-all duration-200 hover:border-black/18 hover:bg-white active:scale-95 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(70vh,28rem)] overflow-y-auto rounded-3xl border border-black/10 bg-white/95 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.2)] backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {APP_NAV_LINKS.map(({ href, label, cta }) => {
                  const active = isNavActive(pathname, navHash, label, cta);
                  return (
                    <Link
                      key={label}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={
                        cta
                          ? `mt-2 rounded-full py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] ${
                              active
                                ? "bg-black text-white ring-2 ring-black/15 ring-offset-2"
                                : "bg-black text-white"
                            }`
                          : `rounded-2xl px-4 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors ${
                              active
                                ? "bg-black/[0.07] text-black"
                                : "text-black/65 hover:bg-muted hover:text-black"
                            }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
