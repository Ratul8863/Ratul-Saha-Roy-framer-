"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SECTION_IDS = ["home", "about", "services", "projects", "contact"] as const;

/**
 * Which homepage anchor section is currently “active” while scrolling.
 * URL hash alone is not enough — `hashchange` does not fire on scroll.
 */
export function useHomeScrollSection(): string {
  const pathname = usePathname();
  const [section, setSection] = useState<string>("#home");

  useEffect(() => {
    if (pathname !== "/" && pathname !== "") {
      return;
    }

    const pickActive = () => {
      const triggerY = window.innerHeight * 0.18;
      let current: (typeof SECTION_IDS)[number] = "home";

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= triggerY) {
          current = id;
        }
      }
      setSection(`#${current}`);
    };

    pickActive();
    const t = window.setTimeout(pickActive, 0);
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, [pathname]);

  return section;
}
