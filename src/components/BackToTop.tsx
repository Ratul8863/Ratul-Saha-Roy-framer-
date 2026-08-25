/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLenis } from "@/lib/lenis";
import { useState, useEffect } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;
    let lastShown = false;
    const onScroll = () => {
      if (raf !== 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > 500;
        if (next !== lastShown) {
          lastShown = next;
          setIsVisible(next);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => {
            if (lenis) {
              lenis.scrollTo(0, { duration: 1.4, lerp: 0.05 });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-on-accent shadow-2xl transition-opacity hover:opacity-85 sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
        >
          <ArrowUpRight className="w-6 h-6 -rotate-45" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
