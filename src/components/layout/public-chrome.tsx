"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionModeToggle } from "@/components/layout/motion-mode-toggle";
import { SiteLiquidCursor } from "@/components/layout/site-liquid-cursor";
import { homeNav } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {/* Outside overflow-x-clip so fixed FX control is never cropped at edges. */}
      <MotionModeToggle />
      <div
        className={cn(
          "min-h-screen overflow-x-clip",
          isHome ? "bg-black" : "bg-white",
        )}
      >
        <SiteLiquidCursor />
        <div className={isHome ? "intro-rise-target" : undefined}>
          {/*
            Sidebar + main share one row. Sidebar is sticky inside that row,
            so when the footer (below) enters view the whole row — and sidebar —
            scrolls up together.
          */}
          <div
            className={cn(
              "lg:flex lg:items-start",
              isHome ? "lg:gap-5 lg:px-5 lg:pt-5" : "lg:pr-5",
            )}
          >
            <SidebarNav
              variant={isHome ? "dark" : "light"}
              items={isHome ? homeNav : undefined}
            />
            <div className="min-w-0 flex-1">
              <main
                id="main-content"
                className={cn(isHome ? "pt-0" : "pt-4 sm:pt-5", "lg:pt-0")}
              >
                {children}
              </main>
              {isHome ? null : <SiteFooter variant="light" />}
            </div>
          </div>
          {isHome ? <SiteFooter variant="dark" /> : null}
        </div>
      </div>
    </>
  );
}
