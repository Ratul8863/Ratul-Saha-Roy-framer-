"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { portfolioAllProjects } from "@/constants/projects";

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

/**
 * Cursor follow tuned to dennissnellenberg.com/archive:
 * - one ball; Website label stays centered inside it
 * - tiny inner magnetic drift only (never a second floating layer)
 * - size opens via width/height
 * - active-big ≈ 1.66 * clamp(3.75em, 5.5vw, 5em)
 */
const BALL_DAMP = 0.35;
const LABEL_DAMP = 0.35;
const LABEL_MAX_DRIFT = 3;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canUseCursor() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(any-pointer: fine)").matches
  );
}

function ballSizePx() {
  const em = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const vw = window.innerWidth / 100;
  const base = Math.min(5 * em, Math.max(3.75 * em, 5.5 * vw));
  return Math.round(base * 1.66);
}

export function AllProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const portalReady = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const cursor = cursorRef.current;
    const ball = ballRef.current;
    const label = labelRef.current;
    if (!section || !list || !cursor || !ball || !label) return;

    let rafId = 0;
    let active = false;
    let reduceMotion = prefersReducedMotion();
    let desktopOk = canUseCursor();
    let enhance = desktopOk && !reduceMotion;
    let size = ballSizePx();

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ballPos = { x: mouse.x, y: mouse.y };
    const labelDrift = { x: 0, y: 0 };

    const setListCursor = (hide: boolean) => {
      list.style.cursor = hide ? "none" : "";
      list.querySelectorAll<HTMLElement>("a").forEach((node) => {
        node.style.cursor = hide ? "none" : "";
      });
    };

    const sizeEase = (open: boolean) =>
      open
        ? "width 0.4s cubic-bezier(0.34, 1, 0.64, 1), height 0.4s cubic-bezier(0.34, 1, 0.64, 1)"
        : "width 0.4s cubic-bezier(0.36, 0, 0.66, 0), height 0.4s cubic-bezier(0.36, 0, 0.66, 0)";

    const applySize = (open: boolean) => {
      const dim = open ? `${size}px` : "0px";
      ball.style.transition = sizeEase(open);
      ball.style.width = dim;
      ball.style.height = dim;
    };

    const refreshMode = () => {
      reduceMotion = prefersReducedMotion();
      desktopOk = canUseCursor();
      enhance = desktopOk && !reduceMotion;
      size = ballSizePx();
      if (!enhance) {
        active = false;
        applySize(false);
        setListCursor(false);
        section.classList.remove("is-cursor-active");
      } else if (active) {
        applySize(true);
      }
    };

    const tick = () => {
      rafId = 0;
      if (!enhance) return;

      ballPos.x += (mouse.x - ballPos.x) * BALL_DAMP;
      ballPos.y += (mouse.y - ballPos.y) * BALL_DAMP;

      const targetX = Math.max(
        -LABEL_MAX_DRIFT,
        Math.min(LABEL_MAX_DRIFT, (mouse.x - ballPos.x) * 0.15),
      );
      const targetY = Math.max(
        -LABEL_MAX_DRIFT,
        Math.min(LABEL_MAX_DRIFT, (mouse.y - ballPos.y) * 0.15),
      );
      labelDrift.x += (targetX - labelDrift.x) * LABEL_DAMP;
      labelDrift.y += (targetY - labelDrift.y) * LABEL_DAMP;

      ball.style.left = `${ballPos.x}px`;
      ball.style.top = `${ballPos.y}px`;
      label.style.transform = `translate3d(${labelDrift.x}px, ${labelDrift.y}px, 0)`;

      const stillMoving =
        Math.abs(mouse.x - ballPos.x) > 0.2 ||
        Math.abs(mouse.y - ballPos.y) > 0.2 ||
        Math.abs(targetX - labelDrift.x) > 0.05 ||
        Math.abs(targetY - labelDrift.y) > 0.05;

      if (stillMoving || active) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const requestTick = () => {
      if (!rafId && enhance) rafId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enhance) return;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      requestTick();
    };

    const onListEnter = () => {
      if (!enhance) return;
      active = true;
      size = ballSizePx();
      ballPos.x = mouse.x;
      ballPos.y = mouse.y;
      labelDrift.x = 0;
      labelDrift.y = 0;
      ball.style.left = `${mouse.x}px`;
      ball.style.top = `${mouse.y}px`;
      label.style.transform = "translate3d(0,0,0)";
      applySize(true);
      setListCursor(true);
      section.classList.add("is-cursor-active");
      requestTick();
    };

    const onListLeave = () => {
      active = false;
      applySize(false);
      setListCursor(false);
      section.classList.remove("is-cursor-active");
    };

    const onResize = () => {
      refreshMode();
      requestTick();
    };

    refreshMode();
    applySize(false);
    list.addEventListener("pointerenter", onListEnter);
    list.addEventListener("pointerleave", onListLeave);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => onResize();
    motionMq.addEventListener("change", onMq);
    desktopMq.addEventListener("change", onMq);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      list.removeEventListener("pointerenter", onListEnter);
      list.removeEventListener("pointerleave", onListLeave);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      motionMq.removeEventListener("change", onMq);
      desktopMq.removeEventListener("change", onMq);
      setListCursor(false);
      section.classList.remove("is-cursor-active");
    };
  }, [portalReady]);

  return (
    <section
      ref={sectionRef}
      id="all-projects"
      data-liquid-cursor-hide
      className="all-projects scroll-mt-24 bg-black px-0 py-5 sm:py-[50px] lg:scroll-mt-6"
    >
      {portalReady
        ? createPortal(
            <div
              ref={cursorRef}
              className="pointer-events-none fixed inset-0 z-[90] hidden lg:block"
              aria-hidden="true"
            >
              <div
                ref={ballRef}
                className="all-projects__ball absolute top-0 left-0 flex items-center justify-center overflow-hidden rounded-full"
                style={{
                  width: 0,
                  height: 0,
                  transform: "translate(-50%, -60%)",
                  willChange: "transform, width, height",
                  background:
                    "radial-gradient(circle at 38% 32%, #ffffff 0%, #f9f4eb 62%, #ebe3d4 100%)",
                }}
              >
                <span
                  ref={labelRef}
                  className="inline-flex items-center justify-center gap-[0.33em] whitespace-nowrap font-ui text-[1.125em] font-medium leading-none tracking-[0.01em] text-ink"
                >
                  Website
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M3.5 10.5L10.5 3.5M10.5 3.5H5.5M10.5 3.5V8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>,
            document.body,
          )
        : null}

      {/* Figma 700:29 — header left 10 / top 20, title 36/40, line gap 10 */}
      <div className="flex items-center gap-2.5 px-2.5 lg:px-0">
        <h2 className="shrink-0 font-ui text-[36px] font-black uppercase leading-10 text-cream lg:text-[64px] lg:leading-[72px]">
          All Projects
        </h2>
        <div className="h-px min-w-0 flex-1 bg-cream" aria-hidden />
      </div>

      {/*
        Mobile (700:29): list gap 20 around each divider → ~40px between rows.
        Row: px 10, left stack gap 16 (title 20/24 + meta 16/24), right col 41×72.
      */}
      <ul
        ref={listRef}
        className="all-projects__list mt-5 flex flex-col lg:mt-10 lg:border-t lg:border-cream/80"
      >
        {portfolioAllProjects.map((project) => {
          const href = project.liveUrl ?? `/projects/${project.slug}`;
          const external = Boolean(project.liveUrl);

          return (
            <li
              key={project.slug}
              className="border-b border-cream/80 last:border-b-0 lg:last:border-b"
            >
              <Link
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="all-projects__row group flex items-center justify-between gap-3 px-2.5 py-5 font-body text-cream capitalize transition-[color,background-color,opacity] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-inset lg:gap-6 lg:px-[60px] lg:py-10 lg:hover:bg-cream lg:hover:text-ink"
              >
                <div className="flex h-[72px] min-w-0 flex-1 flex-col justify-between lg:h-auto lg:flex-row lg:items-center lg:gap-6">
                  <span className="all-projects__title min-w-0 text-[20px] leading-6 tracking-[0.6px] lg:w-[360px] lg:text-[1.75rem] lg:leading-[48px] lg:tracking-[0.48px]">
                    {project.title}
                  </span>
                  <span className="all-projects__meta min-w-0 text-base leading-6 tracking-[0.48px] text-cream lg:w-[460px] lg:flex-none lg:text-[1.75rem] lg:leading-[48px] lg:group-hover:text-ink">
                    {project.category}
                  </span>
                </div>

                <div className="flex h-[72px] w-[41px] shrink-0 flex-col items-end justify-between lg:h-auto lg:w-auto lg:flex-row lg:items-center lg:gap-6">
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-full bg-cream p-2.5 text-ink lg:hidden"
                  >
                    <img
                      src="/assets/all-projects-link-icon.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="size-5"
                    />
                  </span>
                  <span className="all-projects__meta text-base leading-6 tracking-[0.48px] text-cream lg:text-[1.75rem] lg:leading-[48px] lg:group-hover:text-ink">
                    {project.year}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
