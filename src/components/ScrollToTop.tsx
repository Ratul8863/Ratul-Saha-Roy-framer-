"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLenis } from "@/lib/lenis";
import { useHash } from "@/hooks/useHash";

/**
 * Reload / first paint: always start at top (ignore URL hash).
 * After that, client navigations still honor `/#section` hashes.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const hash = useHash();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const booted = useRef(false);
  /** Drop the one stale hash read that happens right after we strip it on load. */
  const ignoreNextHash = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const l = lenisRef.current;
    const toTop = (immediate = true) => {
      if (l) l.scrollTo(0, { immediate });
      else window.scrollTo(0, 0);
    };
    const stripHash = () => {
      const clean = window.location.pathname + window.location.search;
      if (window.location.hash) {
        history.replaceState(null, "", clean || "/");
      }
    };

    // Full page load / reload — always begin at the start
    if (!booted.current) {
      booted.current = true;
      if (window.location.hash) {
        stripHash();
        ignoreNextHash.current = true;
      }
      toTop(true);
      return;
    }

    // Ignore the useHash sync that still saw the old hash before strip
    if (ignoreNextHash.current) {
      ignoreNextHash.current = false;
      stripHash();
      toTop(true);
      return;
    }

    // Client-side: navigate to a section hash
    if (hash) {
      if (hash === "#home") {
        toTop(true);
        return;
      }
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        if (l) {
          l.scrollTo(el, { offset: 0, lerp: 0.05, duration: 1.35 });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
    }

    // Path change with no hash — top of page
    toTop(true);
  }, [pathname, hash]);

  return null;
}
