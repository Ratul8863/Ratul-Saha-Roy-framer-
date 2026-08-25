/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "@/lib/lenis";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const PILL_LINKS = [
  { hash: "#home", label: "Home" },
  { hash: "#about", label: "About" },
  { hash: "#projects", label: "Projects" },
  { hash: "#achievements", label: "Work" },
] as const;

interface LandingHeaderProps {
  projectCount: number;
}

export function LandingHeader({ projectCount: _pc }: LandingHeaderProps) {
  void _pc;
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/" || pathname === "";
  const [open, setOpen] = useState(false);
  /** false = full nav, true = “Available for Projects” compact pill */
  const [showAvailable, setShowAvailable] = useState(false);
  const lenis = useLenis();

  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    let lastY = window.scrollY;
    const TOP_SHOW_NAV = 48;
    const DIR_DELTA = 6;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= TOP_SHOW_NAV) {
        setShowAvailable(false);
      } else if (delta > DIR_DELTA) {
        setShowAvailable(true);
      } else if (delta < -DIR_DELTA) {
        setShowAvailable(false);
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  /** Home: in-page Lenis scroll. Other routes: navigate to /#section. */
  const goTo = (hash: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);

    if (!onHome) {
      router.push(`/${hash}`);
      return;
    }

    const scroll = () => {
      if (hash === "#home") {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (lenis) {
        lenis.scrollTo(hash, { offset: 0 });
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }
      history.pushState(null, "", hash);
    };

    requestAnimationFrame(() => requestAnimationFrame(scroll));
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-50 flex justify-center px-4 sm:top-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {!showAvailable ? (
              <motion.nav
                key="full"
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="nav-pill hidden items-center gap-1 py-1.5 pl-1.5 pr-1.5 lg:flex"
                aria-label="Primary"
              >
                <a
                  href={hrefFor("#home")}
                  onClick={goTo("#home")}
                  className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10"
                  aria-label="Home"
                >
                  <Image
                    src="/landing/hero-portrait-v3.png"
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover object-top"
                  />
                </a>
                <div className="flex items-center gap-0.5 px-1">
                  {PILL_LINKS.map((link) => (
                    <a
                      key={link.hash}
                      href={hrefFor(link.hash)}
                      onClick={goTo(link.hash)}
                      className="rounded-full px-3.5 py-2 font-anon text-[13px] font-bold tracking-wide text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <ThemeToggle className="mx-1" />
                <a
                  href={hrefFor("#contact")}
                  onClick={goTo("#contact")}
                  className="rounded-full bg-surface px-5 py-2.5 font-anon text-[13px] font-bold tracking-wide text-ink ring-1 ring-ink/15 transition-opacity hover:opacity-85 dark:bg-white dark:text-black dark:ring-0"
                >
                  Contact
                </a>
              </motion.nav>
            ) : (
              <motion.div
                key="compact"
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="nav-pill hidden items-center gap-2.5 py-1.5 pl-1.5 pr-3 lg:flex"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-ink/10">
                  <Image
                    src="/landing/hero-portrait-v3.png"
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover object-top"
                  />
                </div>
                <span className="font-anon text-[13px] font-bold text-ink">
                  Available for Projects
                </span>
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                <ThemeToggle />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="nav-pill flex items-center gap-2 px-4 py-2.5 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full">
              <Image
                src="/landing/hero-portrait-v3.png"
                alt=""
                fill
                sizes="28px"
                className="object-cover object-top"
              />
            </span>
            <Menu className="h-5 w-5 text-ink" aria-hidden />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-bg/98 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between px-6 py-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
              <span className="font-anon text-[13px] uppercase tracking-[0.2em] text-muted">
                Menu
              </span>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink transition-opacity hover:opacity-70"
                  aria-label="Close menu"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
              {[
                ...PILL_LINKS,
                { hash: "#contact" as const, label: "Contact" },
              ].map((link, i) => (
                <motion.a
                  key={link.hash}
                  href={hrefFor(link.hash)}
                  onClick={goTo(link.hash)}
                  className="font-audiowide text-[clamp(2rem,9vw,3.5rem)] uppercase leading-none tracking-tight text-muted transition-colors hover:text-ink"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.08 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
