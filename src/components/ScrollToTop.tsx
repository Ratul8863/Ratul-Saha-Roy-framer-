"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useHash } from "@/hooks/useHash";

export function ScrollToTop() {
  const pathname = usePathname();
  const hash = useHash();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
