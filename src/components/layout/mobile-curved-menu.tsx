"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import {
  lockPageScroll,
  unlockPageScroll,
} from "@/providers/smooth-scroll-provider";

type Phase = "closed" | "opening" | "open" | "closing";

type MobileCurvedMenuProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Panel surface — keep in sync with existing nav chrome. */
  surfaceClassName: string;
  /** SVG curve fill — must match panel background. */
  curveFillClassName: string;
  /** Indicator / currentColor for the moving route dot. */
  indicatorClassName?: string;
  children: ReactNode;
  reduceMotion?: boolean;
};

const OPEN_DUR = 0.58;
const CLOSE_DUR = 0.52;
/**
 * Extra left pad so the Bézier bulge is never clipped by the SVG viewBox.
 * Keep control x >= 0; cubic mid reaches ~75% of the control offset.
 */
const MAX_BULGE = 160;
const JOIN_PAD = 2;

function buildCurvePath(h: number, bulge: number) {
  // Right edge joins the panel. Resting left edge sits at MAX_BULGE.
  // Positive bulge pulls controls further left (organic leading edge).
  const H = Math.max(1, h);
  const right = MAX_BULGE + JOIN_PAD;
  const left = MAX_BULGE;
  const cx = left - Math.min(Math.max(0, bulge), MAX_BULGE);
  return [
    `M ${right} 0`,
    `L ${right} ${H}`,
    `L ${left} ${H}`,
    `C ${cx} ${H * 0.78}, ${cx} ${H * 0.22}, ${left} 0`,
    "Z",
  ].join(" ");
}

/**
 * Dennis-style curved panel that sweeps in from the right.
 * Visual design of the children (routes, socials) stays untouched.
 */
export function MobileCurvedMenu({
  id,
  open,
  onOpenChange,
  surfaceClassName,
  curveFillClassName,
  indicatorClassName = "bg-cream",
  children,
  reduceMotion = false,
}: MobileCurvedMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("closed");
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lockedRef = useRef(false);
  const stateRef = useRef({ x: 100, bulge: MAX_BULGE });
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const applyVisual = useCallback(() => {
    const panel = panelRef.current;
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!panel) return;
    const { x, bulge } = stateRef.current;
    // Extra px hides the left curve cap when the panel sits off-screen right.
    const curveHide = (x / 100) * (MAX_BULGE + JOIN_PAD);
    panel.style.transform = `translate3d(calc(${x}% + ${curveHide}px),0,0)`;
    const h = panel.clientHeight || window.innerHeight;
    if (svg) {
      svg.setAttribute("viewBox", `0 0 ${MAX_BULGE + JOIN_PAD} ${h}`);
    }
    if (path) {
      path.setAttribute("d", buildCurvePath(h, bulge));
    }
  }, []);

  const setLocked = useCallback((on: boolean) => {
    if (on && !lockedRef.current) {
      lockPageScroll();
      lockedRef.current = true;
    } else if (!on && lockedRef.current) {
      unlockPageScroll();
      lockedRef.current = false;
    }
  }, []);

  const killTl = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
  }, []);

  const playOpen = useCallback(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!root || !panel) return;

    killTl();
    phaseRef.current = "opening";
    root.style.pointerEvents = "auto";
    root.setAttribute("aria-hidden", "false");
    setLocked(true);

    if (
      document.activeElement instanceof HTMLElement &&
      document.activeElement.id === "mobile-nav-toggle"
    ) {
      prevFocusRef.current = document.activeElement;
    }

    if (reduceMotion) {
      stateRef.current = { x: 0, bulge: 0 };
      applyVisual();
      if (content) gsap.set(content, { autoAlpha: 1, x: 0 });
      phaseRef.current = "open";
      window.requestAnimationFrame(() => {
        const first = content?.querySelector<HTMLElement>("a, button");
        first?.focus({ preventScroll: true });
      });
      return;
    }

    // Fresh open from fully closed; mid-close reverse keeps current x/bulge.
    if (stateRef.current.x >= 99) {
      stateRef.current = { x: 100, bulge: MAX_BULGE };
    }
    applyVisual();
    if (content) {
      gsap.set(content, {
        autoAlpha: stateRef.current.x > 80 ? 0.12 : 0.55,
        x: 28,
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        phaseRef.current = "open";
        stateRef.current = { x: 0, bulge: 0 };
        applyVisual();
        const first = content?.querySelector<HTMLElement>("a, button");
        first?.focus({ preventScroll: true });
      },
    });
    tlRef.current = tl;

    // Panel travels while bulge stays strong, then flattens near the settle.
    tl.to(
      stateRef.current,
      {
        x: 0,
        duration: OPEN_DUR,
        ease: "power3.inOut",
        onUpdate: applyVisual,
      },
      0,
    );
    tl.to(
      stateRef.current,
      {
        bulge: MAX_BULGE * 0.92,
        duration: OPEN_DUR * 0.45,
        ease: "none",
        onUpdate: applyVisual,
      },
      0,
    );
    tl.to(
      stateRef.current,
      {
        bulge: 0,
        duration: OPEN_DUR * 0.5,
        ease: "power2.inOut",
        onUpdate: applyVisual,
      },
      OPEN_DUR * 0.48,
    );
    if (content) {
      tl.to(
        content,
        { autoAlpha: 1, x: 0, duration: OPEN_DUR * 0.8, ease: "power2.out" },
        0.1,
      );
    }
  }, [applyVisual, killTl, reduceMotion, setLocked]);

  const playClose = useCallback(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root) return;

    killTl();
    phaseRef.current = "closing";

    if (reduceMotion) {
      stateRef.current = { x: 100, bulge: MAX_BULGE };
      applyVisual();
      if (content) gsap.set(content, { autoAlpha: 0 });
      root.style.pointerEvents = "none";
      root.setAttribute("aria-hidden", "true");
      setLocked(false);
      phaseRef.current = "closed";
      prevFocusRef.current?.focus({ preventScroll: true });
      return;
    }

    // Re-introduce curve as the panel retreats.
    if (stateRef.current.bulge < 20) {
      stateRef.current.bulge = MAX_BULGE * 0.35;
      applyVisual();
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        phaseRef.current = "closed";
        root.style.pointerEvents = "none";
        root.setAttribute("aria-hidden", "true");
        setLocked(false);
        stateRef.current = { x: 100, bulge: MAX_BULGE };
        applyVisual();
        prevFocusRef.current?.focus({ preventScroll: true });
      },
    });
    tlRef.current = tl;

    if (content) {
      tl.to(
        content,
        {
          autoAlpha: 0.15,
          x: 32,
          duration: CLOSE_DUR * 0.5,
          ease: "power2.in",
        },
        0,
      );
    }
    tl.to(
      stateRef.current,
      {
        bulge: MAX_BULGE * 0.9,
        duration: CLOSE_DUR * 0.55,
        ease: "power2.out",
        onUpdate: applyVisual,
      },
      0,
    );
    tl.to(
      stateRef.current,
      {
        x: 100,
        duration: CLOSE_DUR,
        ease: "power3.inOut",
        onUpdate: applyVisual,
      },
      0,
    );
  }, [applyVisual, killTl, reduceMotion, setLocked]);

  // Drive open/close from prop — supports reverse mid-flight.
  useEffect(() => {
    const phase = phaseRef.current;
    if (open) {
      if (phase === "open" || phase === "opening") return;
      playOpen();
    } else {
      if (phase === "closed" || phase === "closing") return;
      playClose();
    }
  }, [open, playClose, playOpen]);

  useEffect(() => {
    return () => {
      killTl();
      if (lockedRef.current) {
        unlockPageScroll();
        lockedRef.current = false;
      }
    };
  }, [killTl]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Resize — rebuild path with current bulge
  useEffect(() => {
    const onResize = () => applyVisual();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyVisual]);

  // Route hover indicator — single moving dot aligned to hovered / active link
  useLayoutEffect(() => {
    const host = hostRef.current;
    const indicator = indicatorRef.current;
    if (!host || !indicator) return;

    const list = host.querySelector("nav ul");
    if (!(list instanceof HTMLElement)) return;

    const links = Array.from(list.querySelectorAll("a"));
    if (links.length === 0) return;

    const moveTo = (el: Element | null, visible: boolean) => {
      if (!el || !(el instanceof HTMLElement)) {
        gsap.to(indicator, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      const hostRect = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const y = r.top - hostRect.top + r.height / 2 - 4;
      gsap.to(indicator, {
        y,
        autoAlpha: visible ? 1 : 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const activeLink = () => {
      const hash =
        typeof window !== "undefined" ? window.location.hash : "";
      return (
        links.find((a) => hash && a.getAttribute("href") === hash) ??
        links.find((a) => a.getAttribute("aria-current") === "page") ??
        links[0]
      );
    };

    const onEnter = (e: Event) => {
      const t = e.currentTarget;
      if (t instanceof Element) moveTo(t, true);
    };
    const onLeave = () => {
      moveTo(activeLink(), open);
    };

    links.forEach((a) => {
      a.addEventListener("pointerenter", onEnter);
      a.addEventListener("focus", onEnter);
    });
    list.addEventListener("pointerleave", onLeave);

    if (open) {
      moveTo(activeLink(), true);
    } else {
      gsap.set(indicator, { autoAlpha: 0 });
    }

    return () => {
      links.forEach((a) => {
        a.removeEventListener("pointerenter", onEnter);
        a.removeEventListener("focus", onEnter);
      });
      list.removeEventListener("pointerleave", onLeave);
    };
  }, [open, children]);

  // Initial closed paint
  useLayoutEffect(() => {
    stateRef.current = { x: 100, bulge: MAX_BULGE };
    applyVisual();
    const root = rootRef.current;
    if (root) {
      root.style.pointerEvents = "none";
      root.setAttribute("aria-hidden", "true");
    }
  }, [applyVisual]);

  const svgW = MAX_BULGE + JOIN_PAD;

  return (
    <div
      ref={rootRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 lg:hidden"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className={cn(
          "absolute inset-0 overflow-visible will-change-transform",
          surfaceClassName,
        )}
        style={{ transform: "translate3d(100%,0,0)" }}
      >
        {/* Curved leading edge — same fill as panel, extends left */}
        <svg
          ref={svgRef}
          className={cn(
            "pointer-events-none absolute top-0 left-0 h-full -translate-x-[calc(100%-1px)]",
            curveFillClassName,
          )}
          width={svgW}
          height="100%"
          viewBox={`0 0 ${svgW} 800`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path ref={pathRef} className="fill-current" />
        </svg>

        <div
          ref={contentRef}
          data-lenis-prevent
          className="relative flex h-full w-full flex-col overflow-y-auto overscroll-contain px-5 pt-18 pb-5"
        >
          <div ref={hostRef} className="relative min-h-0 flex-1">
            <span
              ref={indicatorRef}
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 right-2 z-20 size-1.5 rounded-full opacity-0 sm:right-3 sm:size-2",
                indicatorClassName,
              )}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Open-state close tile — cream plate + ink mark. */
export const MOBILE_MENU_CLOSE_BG = "#f9f4eb";
export const MOBILE_MENU_CLOSE_FG = "#1a1c1c";
/** @deprecated use MOBILE_MENU_CLOSE_BG */
export const MOBILE_MENU_CLOSE = MOBILE_MENU_CLOSE_BG;
/** @deprecated use MOBILE_MENU_CLOSE_BG */
export const MOBILE_MENU_BLUE = MOBILE_MENU_CLOSE_BG;
