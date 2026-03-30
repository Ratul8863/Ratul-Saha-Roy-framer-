"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Syncs with `window.location.hash` and updates on pathname / hash changes (Next.js has no `useLocation().hash`). */
export function useHash(): string {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(typeof window !== "undefined" ? window.location.hash : "");
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return hash;
}
