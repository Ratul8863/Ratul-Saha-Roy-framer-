/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, type To } from "react-router-dom";

export type AppNavLink = { to: To; label: string; cta?: boolean };

export const APP_NAV_LINKS: AppNavLink[] = [
  { to: { pathname: "/", hash: "home" }, label: "Home" },
  { to: { pathname: "/", hash: "about" }, label: "About" },
  { to: { pathname: "/", hash: "services" }, label: "Services" },
  { to: { pathname: "/", hash: "projects" }, label: "Projects" },
  { to: { pathname: "/", hash: "contact" }, label: "Contact", cta: true },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      className="fixed top-3 left-3 right-3 sm:top-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 sm:w-fit sm:max-w-none max-w-none"
    >
      <div className="glass-pill px-3 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between gap-3 sm:gap-8 sm:justify-start">
        <Link
          to="/"
          className="flex items-center gap-2 min-w-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Home"
        >
          <div className="w-8 h-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">
            R
          </div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase hidden sm:block truncate max-w-[9rem] sm:max-w-none">
            MERN · Sylhet
          </span>
          <div className="w-2 h-2 shrink-0 rounded-full bg-green-500 animate-pulse" aria-hidden />
        </Link>
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[10px] xl:text-[11px] font-bold uppercase tracking-widest text-black/60 flex-wrap justify-end">
          {APP_NAV_LINKS.map(({ to, label, cta }) =>
            cta ? (
              <Link
                key={label}
                to={to}
                className="px-4 py-2 bg-black text-white rounded-full hover:opacity-90 transition-opacity"
              >
                {label}
              </Link>
            ) : (
              <Link key={label} to={to} className="hover:text-black transition-colors">
                {label}
              </Link>
            )
          )}
        </div>
        <button
          type="button"
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white/80 text-black"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="lg:hidden fixed inset-0 top-0 z-40 bg-black/40 backdrop-blur-sm"
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
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-3xl border border-black/10 bg-white/95 backdrop-blur-md shadow-xl p-4 max-h-[min(70vh,28rem)] overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {APP_NAV_LINKS.map(({ to, label, cta }) => (
                  <Link
                    key={label}
                    to={to}
                    className={
                      cta
                        ? "mt-2 text-center py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest"
                        : "py-3.5 px-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-black/70 hover:bg-muted hover:text-black transition-colors"
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
