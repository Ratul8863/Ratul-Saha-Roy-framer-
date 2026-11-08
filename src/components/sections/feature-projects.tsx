"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioCaseStudies } from "@/constants/projects";
import { BlockTextReveal } from "@/components/ui/block-text-reveal";
import {
  DEFAULT_FULL_MOTION,
  MOTION_MODE_EVENT,
  readFullMotion,
} from "@/lib/motion-mode";

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

function subscribeMotionMode(onStoreChange: () => void) {
  window.addEventListener(MOTION_MODE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(MOTION_MODE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

gsap.registerPlugin(ScrollTrigger);

/**
 * Kala-verified camera (trykala.com/script.js):
 * - Section owns perspective: 800px
 * - Scroll owns .track translateX only
 * - Shared pointer drives .scene-wrapper + heading (siblings under perspective)
 * - Wrapper: depth 140, rotate 28, rightMaxRotate 3, intensity 0.35
 * - Heading: depth 140, rotate 8 (same translate, weaker rotate)
 * - Damp: tx += (nx - tx) * 0.12 per frame
 *
 * Local-plane approach capped apparent width ~1.11× and felt flat.
 * Scene-wrapper matches measured Kala left/right ratio ~2.1× without the
 * earlier 5.6× singularity (that came from larger unbounded angles).
 */
const SCENE_PERSPECTIVE = 800;
const INTENSITY = 0.35;
const DAMP = 0.12;
const WRAPPER_DEPTH = 140;
const WRAPPER_ROTATE = 28;
const WRAPPER_RIGHT_MAX = 3;
const HEADING_DEPTH = 140;
const HEADING_ROTATE = 8;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canUseDesktopShowcase() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(any-pointer: fine)").matches
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function projectHref(project: (typeof portfolioCaseStudies)[number]) {
  return project.liveUrl ?? `/projects/${project.slug}`;
}

function projectLinkProps(project: (typeof portfolioCaseStudies)[number]) {
  if (!project.liveUrl) return {};
  return {
    target: "_blank" as const,
    rel: "noopener noreferrer",
  };
}

type CaseStudy = (typeof portfolioCaseStudies)[number];

/** Figma project side copy: title / summary / details / About Project. */
const detailCopyClass =
  "font-body text-sm leading-5 tracking-[0.06em] sm:text-base sm:leading-6 sm:tracking-[0.1em]";

function ProjectDetailsPanel({ project }: { project: CaseStudy }) {
  return (
    <div className="flex w-full flex-col gap-6 lg:gap-[34px]">
      <div className="flex flex-col gap-3 lg:gap-[14px]">
        <BlockTextReveal
          as="h3"
          text={project.title}
          textColor="#f9f4eb"
          className="font-ui text-xl font-black uppercase leading-7 sm:text-2xl sm:leading-[30px]"
        />
        <div className="h-px w-full bg-cream/80" aria-hidden />
        <BlockTextReveal
          text={project.summary}
          textColor="rgba(249,244,235,0.6)"
          className={detailCopyClass}
        />
        <div className="h-px w-full bg-cream/80" aria-hidden />
        <BlockTextReveal
          text={project.details}
          textColor="rgba(249,244,235,0.6)"
          className={detailCopyClass}
        />
      </div>
      <div className="flex flex-col gap-3 lg:gap-[14px]">
        <BlockTextReveal
          as="h4"
          text="About Project"
          textColor="#f9f4eb"
          className="font-ui text-xl font-black uppercase leading-7 sm:text-2xl sm:leading-[30px]"
        />
        <div className="h-px w-full bg-cream/80" aria-hidden />
        <BlockTextReveal
          text={project.about}
          textColor="rgba(249,244,235,0.6)"
          className={detailCopyClass}
        />
      </div>
    </div>
  );
}

export function FeatureProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const overProjectRef = useRef(false);
  const portalReady = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );
  const fullMotion = useSyncExternalStore(
    subscribeMotionMode,
    readFullMotion,
    () => DEFAULT_FULL_MOTION,
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    const cursor = cursorRef.current;
    if (!section || !stage || !scene || !track) return;

    let ctx: gsap.Context | undefined;
    let resizeTimer = 0;
    let rafId = 0;
    let enabled = false;
    let cursorOk = false; // View Project circle (independent of FX)
    let enhance = false; // pointer 3D depth (FX On only)
    let inView = false;
    let desktopOk = canUseDesktopShowcase();
    let reduceMotion = prefersReducedMotion();

    const pointer = {
      nx: 0,
      ny: 0,
      tx: 0,
      ty: 0,
      cx: window.innerWidth / 2,
      cy: window.innerHeight / 2,
    };

    // Cache section rect — refresh only when scroll/resize dirties it.
    let sectionRect = section.getBoundingClientRect();
    let rectDirty = true;
    const refreshSectionRect = () => {
      sectionRect = section.getBoundingClientRect();
      rectDirty = false;
    };
    const markRectDirty = () => {
      rectDirty = true;
    };

    const setLayerHint = (on: boolean) => {
      const value = on ? "transform" : "auto";
      scene.style.willChange = value;
      track.style.willChange = value;
      if (heading) heading.style.willChange = value;
    };

    const cursorCore = cursor?.querySelector<HTMLElement>("[data-cursor-core]");

    if (cursor) {
      cursor.style.left = `${pointer.cx}px`;
      cursor.style.top = `${pointer.cy}px`;
      cursor.style.opacity = "0";
      if (cursorCore) cursorCore.style.transform = "translate(-50%, -50%) scale(0)";
    }

    const resetCamera = () => {
      scene.style.transform = "translate3d(0,0,0) rotateY(0deg) rotateX(0deg)";
      if (heading) {
        heading.style.transform =
          "translate3d(0,0,0) rotateY(0deg) rotateX(0deg)";
      }
      pointer.tx = 0;
      pointer.ty = 0;
      pointer.nx = 0;
      pointer.ny = 0;
      setLayerHint(false);
    };

    const setupScroll = () => {
      ctx?.revert();
      ScrollTrigger.getById("feature-projects-pin")?.kill();
      desktopOk = canUseDesktopShowcase();
      reduceMotion = prefersReducedMotion();
      cursorOk = desktopOk && !reduceMotion;
      enhance = cursorOk && readFullMotion();
      refreshSectionRect();

      if (cursor) {
        cursor.style.opacity = "0";
        if (cursorCore) cursorCore.style.transform = "translate(-50%, -50%) scale(0)";
      }

      if (reduceMotion || !desktopOk) {
        gsap.set(track, { clearProps: "transform" });
        resetCamera();
        enabled = false;
        cursorOk = false;
        enhance = false;
        return;
      }

      enabled = true;
      if (!enhance) resetCamera();

      ctx = gsap.context(() => {
        /**
         * Layout-only travel (offsetLeft / clientWidth) so 3D camera
         * transforms cannot shrink the distance. Ends with the last
         * project centered in the section — not stuck peeking on the right.
         */
        const getTravel = () => {
          const items = track.querySelectorAll<HTMLElement>(
            ".selected-projects__item",
          );
          const last = items[items.length - 1];
          if (!last) return 0;

          const trackLeftInSection =
            scene.offsetLeft + stage.offsetLeft + track.offsetLeft;
          const lastCenterInSection =
            trackLeftInSection + last.offsetLeft + last.offsetWidth / 2;
          const targetCenter = section.clientWidth / 2;

          return Math.max(0, lastCenterInSection - targetCenter);
        };

        gsap.set(track, { x: 0 });

        gsap.to(track, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            id: "feature-projects-pin",
            trigger: section,
            start: "top top",
            // Extra tail so the last card isn't only 1px at pin end
            // before Lenis carries the page into the next section.
            end: () =>
              `+=${Math.max(getTravel() / 1.15, window.innerHeight * 0.85) + window.innerHeight * 0.2}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    setupScroll();

    const applyCamera = () => {
      if (!enabled || !enhance || reduceMotion || !inView) {
        rafId = 0;
        return;
      }

      pointer.tx += (pointer.nx - pointer.tx) * DAMP;
      pointer.ty += (pointer.ny - pointer.ty) * DAMP;

      const dx = -pointer.tx * WRAPPER_DEPTH * INTENSITY;
      const dy = -pointer.ty * WRAPPER_DEPTH * INTENSITY;
      let ry = pointer.tx * WRAPPER_ROTATE * INTENSITY;
      const rx = pointer.ty * -WRAPPER_ROTATE * INTENSITY;
      if (pointer.tx > 0) {
        ry = Math.min(ry, WRAPPER_RIGHT_MAX);
      }

      scene.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotateY(${ry}deg) rotateX(${rx}deg)`;

      if (heading) {
        const hDx = -pointer.tx * HEADING_DEPTH * INTENSITY;
        const hDy = -pointer.ty * HEADING_DEPTH * INTENSITY;
        const hRy = pointer.tx * HEADING_ROTATE * INTENSITY;
        const hRx = pointer.ty * -HEADING_ROTATE * INTENSITY;
        heading.style.transform = `translate3d(${hDx}px, ${hDy}px, 0) rotateY(${hRy}deg) rotateX(${hRx}deg)`;
      }

      if (
        Math.abs(pointer.nx - pointer.tx) > 0.001 ||
        Math.abs(pointer.ny - pointer.ty) > 0.001
      ) {
        rafId = window.requestAnimationFrame(applyCamera);
      } else {
        rafId = 0;
      }
    };

    const tickCamera = () => {
      if (!rafId && enabled && enhance && inView) {
        rafId = window.requestAnimationFrame(applyCamera);
      }
    };

    const applyCursor = () => {
      if (!cursor || !cursorOk) return;
      const overHit = overProjectRef.current && inView;
      // left/top track the pointer instantly (no transition).
      // Scale lives on the inner core so the spring pop doesn't drag position.
      cursor.style.left = `${pointer.cx}px`;
      cursor.style.top = `${pointer.cy}px`;
      cursor.style.opacity = overHit ? "1" : "0";
      if (cursorCore) {
        cursorCore.style.transform = overHit
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0)";
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled || reduceMotion || !inView) return;

      pointer.cx = event.clientX;
      pointer.cy = event.clientY;

      // Hit-test under the pointer — more reliable than enter/leave with
      // overlapping 3D planes / synthetic mouse moves.
      const under = document.elementFromPoint(event.clientX, event.clientY);
      overProjectRef.current = Boolean(
        under instanceof Element && under.closest("[data-project-hit]"),
      );
      applyCursor();

      if (!enhance) return;
      if (rectDirty) refreshSectionRect();

      const nx =
        ((event.clientX - sectionRect.left) /
          Math.max(sectionRect.width, 1) -
          0.5) *
        2;
      const ny =
        ((event.clientY - sectionRect.top) /
          Math.max(sectionRect.height, 1) -
          0.5) *
        2;

      pointer.nx = clamp(nx, -1, 1);
      pointer.ny = clamp(ny, -1, 1);
      tickCamera();
    };

    const onPointerLeave = () => {
      overProjectRef.current = false;
      pointer.nx = 0;
      pointer.ny = 0;
      applyCursor();
      tickCamera();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setupScroll, 160);
    };

    // Only burn GPU/RAF while this section is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) {
          refreshSectionRect();
          setLayerHint(enabled && enhance);
          if (enhance) tickCamera();
        } else {
          if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          }
          overProjectRef.current = false;
          pointer.nx = 0;
          pointer.ny = 0;
          applyCursor();
          resetCamera();
        }
      },
      { root: null, threshold: 0.05, rootMargin: "10% 0px" },
    );
    io.observe(section);

    const onMotionMode = () => {
      setupScroll();
      if (inView && enhance) {
        setLayerHint(true);
        tickCamera();
      }
    };

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", markRectDirty, { passive: true });
    window.addEventListener(MOTION_MODE_EVENT, onMotionMode);

    const fontsReady =
      "fonts" in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();
    void fontsReady.then(() => ScrollTrigger.refresh());

    return () => {
      io.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", markRectDirty);
      window.removeEventListener(MOTION_MODE_EVENT, onMotionMode);
      ctx?.revert();
      ScrollTrigger.getById("feature-projects-pin")?.kill();
      setLayerHint(false);
    };
  }, [portalReady, fullMotion]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="selected-projects relative scroll-mt-24 bg-black text-cream lg:scroll-mt-6 lg:flex lg:h-svh lg:flex-row lg:items-start lg:gap-10 lg:overflow-hidden lg:px-[42px]"
      style={{
        // Perspective must sit on the same element that directly parents
        // the heading + scene targets (Kala: .projects-section).
        perspective: `${SCENE_PERSPECTIVE}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/*
        Cursor must live outside the perspective section — CSS perspective
        turns fixed children into section-local coords (offset bug).
      */}
      {portalReady
        ? createPortal(
            <div
              ref={cursorRef}
              data-projects-cursor
              className="pointer-events-none fixed top-0 left-0 z-[90] hidden lg:block"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              <div
                data-cursor-core
                className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-cream text-center font-ui text-[14px] font-semibold uppercase leading-[1.2] text-ink"
                style={{
                  transform: "translate(-50%, -50%) scale(0)",
                  transition:
                    "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                View
                <br />
                Project
              </div>
            </div>,
            document.body,
          )
        : null}

      <BlockTextReveal
        ref={headingRef}
        as="h2"
        text={"Feature\nProjects"}
        textColor="#f9f4eb"
        className="selected-projects__heading z-0 w-full max-w-full shrink-0 px-5 pt-8 font-ui text-[clamp(2.125rem,10.5vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] sm:pt-10 sm:text-[clamp(2.75rem,9vw,4rem)] lg:w-max lg:overflow-visible lg:px-0 lg:pt-[90px] lg:pr-[0.12em] lg:text-[clamp(4rem,12vw,11.25rem)] lg:leading-none lg:tracking-[-0.02em]"
      />

      <div className="flex flex-col gap-8 px-5 pb-12 pt-6 sm:gap-10 sm:pt-8 lg:hidden">
        {portfolioCaseStudies.map((project) => (
          <article key={project.slug} className="flex flex-col gap-4 sm:gap-5">
            <Link
              href={projectHref(project)}
              {...projectLinkProps(project)}
              className="relative block aspect-[16/10] overflow-hidden border border-cream/40 p-3 sm:p-4"
            >
              <span className="relative block h-full w-full overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={`${project.title} preview`}
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </span>
            </Link>
            <ProjectDetailsPanel project={project} />
          </article>
        ))}
      </div>

      {/*
        Direct child of the perspective section — mirrors Kala's
        .projects-container-wrapper (width: max-content, camera target).
      */}
      <div
        ref={sceneRef}
        className="selected-projects__scene relative z-10 hidden h-full w-max shrink-0 lg:block"
      >
        <div
          ref={stageRef}
          className="selected-projects__stage flex h-full items-center"
        >
          <div
            ref={trackRef}
            className="selected-projects__track flex w-max items-end gap-[100px] pr-[min(40vw,560px)]"
          >
            {portfolioCaseStudies.map((project, index) => (
              <article
                key={project.slug}
                className="selected-projects__item relative flex shrink-0 items-center gap-6"
              >
                {/*
                  Uniform landscape media box (Crafted Routes / North Gate ~1.61).
                  No backdrop-blur — expensive under CSS 3D; border only.
                */}
                <Link
                  href={projectHref(project)}
                  {...projectLinkProps(project)}
                  data-project-hit
                  className="selected-projects__frame relative block shrink-0 border border-[#767676] bg-black/40 p-[clamp(12px,4vw,42px)]"
                >
                  <span className="relative block aspect-[1.61] h-[min(70vh,630px)] w-auto overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={`${project.title} website preview`}
                      fill
                      sizes="(max-width: 1280px) 70vw, 1014px"
                      className="object-cover object-top"
                      priority={index < 3}
                      loading="eager"
                      quality={75}
                    />
                  </span>
                </Link>

                <Link
                  href={projectHref(project)}
                  {...projectLinkProps(project)}
                  data-project-hit
                  className="selected-projects__info relative z-10 mb-1 block w-[min(450px,28vw)] shrink-0 bg-black py-3 text-cream"
                >
                  <ProjectDetailsPanel project={project} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
