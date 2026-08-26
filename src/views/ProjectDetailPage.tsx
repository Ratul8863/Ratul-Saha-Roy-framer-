/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Project detail — cinematic case study with richer motion.
 * Landing tokens + LandingHeader; soft 3D depth / scrub / springs.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useLenis } from "@/lib/lenis";
import { LandingHeader } from "../components/landing/LandingHeader";
import { BackToTop } from "../components/BackToTop";
import {
  PROJECTS,
  getProjectBySlug,
  getProjectNeighbors,
  type Project,
  type ProjectGalleryItem,
} from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring" as const, stiffness: 60, damping: 18, mass: 0.9 };

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ------------------------------------------------------------------ */
/*  Journey                                                            */
/* ------------------------------------------------------------------ */

interface JourneyStop {
  number: string;
  label: string;
  content: ReactNode;
}

function buildJourneyStops(project: Project): JourneyStop[] {
  const stops: JourneyStop[] = [];

  if (project.overview.length > 0) {
    stops.push({
      number: "01",
      label: "Overview",
      content: (
        <div className="space-y-4">
          {project.overview.map((para, i) => (
            <p
              key={i}
              className="font-baumans text-[16px] leading-[1.55] text-ink sm:text-[18px]"
            >
              {para}
            </p>
          ))}
        </div>
      ),
    });
  }

  if (project.caseStudy) {
    stops.push({
      number: "02",
      label: "The Challenge",
      content: (
        <p className="font-baumans text-[16px] leading-[1.55] text-ink sm:text-[18px]">
          {project.caseStudy.problem}
        </p>
      ),
    });
  }

  if (project.highlights && project.highlights.length > 0) {
    stops.push({
      number: "03",
      label: "Key Highlights",
      content: (
        <ul className="space-y-3">
          {project.highlights.map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-3 font-baumans text-[15px] leading-normal text-ink sm:text-[17px]"
            >
              <Plus
                className="mt-0.5 h-4 w-4 shrink-0 text-accent sm:h-5 sm:w-5"
                strokeWidth={2.5}
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (project.caseStudy) {
    stops.push({
      number: "04",
      label: "The Approach",
      content: (
        <p className="font-baumans text-[16px] leading-[1.55] text-ink sm:text-[18px]">
          {project.caseStudy.approach}
        </p>
      ),
    });
    stops.push({
      number: "05",
      label: "The Outcome",
      content: (
        <p className="font-baumans text-[16px] leading-[1.55] text-ink sm:text-[18px]">
          {project.caseStudy.outcome}
        </p>
      ),
    });
  }

  return stops;
}

const NAV_SECTIONS = [
  { id: "pd-hero", label: "Hero" },
  { id: "pd-details", label: "Details" },
  { id: "pd-journey", label: "Journey" },
  { id: "pd-gallery", label: "Gallery" },
  { id: "pd-more", label: "More" },
  { id: "pd-contact", label: "Contact" },
];

/* ------------------------------------------------------------------ */
/*  Magnetic button                                                    */
/* ------------------------------------------------------------------ */

function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  const onMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.28);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tech Marquee                                                       */
/* ------------------------------------------------------------------ */

function TechMarquee({ tags }: { tags: string[] }) {
  const doubled = [...tags, ...tags, ...tags, ...tags];
  return (
    <div className="relative overflow-hidden py-3" aria-hidden>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent sm:w-24" />
      <div className="marquee-track flex w-max gap-3">
        {doubled.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2.5 font-anon text-[11px] font-bold tracking-wide text-ink shadow-[0_0_0_1px_transparent]"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

function StatsStrip({ project }: { project: Project }) {
  const stats = [
    { label: "Stack", value: project.tags.length },
    { label: "Highlights", value: project.highlights?.length ?? 0 },
    {
      label: "Year",
      value: parseInt(project.year ?? "0", 10) || 0,
      raw: project.year,
    },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <div className="pd-stats mx-auto grid max-w-[1440px] grid-cols-3 gap-2.5 px-4 sm:gap-5 sm:px-10 lg:px-[100px]">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ ...SPRING, delay: i * 0.08 }}
          className="relative overflow-hidden rounded-[18px] border-[3px] border-ink bg-card px-2 py-3.5 text-center sm:rounded-[26px] sm:px-4 sm:py-6"
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/20 blur-2xl"
            aria-hidden
          />
          <p
            className="pd-stat-number relative font-audiowide text-2xl text-accent sm:text-4xl"
            data-target={stat.value}
            data-raw={stat.raw ?? ""}
          >
            0
          </p>
          <p className="relative mt-1 font-anon text-[10px] font-bold uppercase tracking-widest text-muted">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: ProjectGalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[currentIndex];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <motion.div
      className="lightbox-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative mx-4 max-h-[85vh] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={SPRING}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close lightbox"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative overflow-hidden rounded-[16px] border-[3px] border-accent/40 bg-card">
          <Image
            src={item.src}
            alt={item.alt ?? ""}
            width={1200}
            height={750}
            className="h-auto max-h-[80vh] w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        {item.caption && (
          <p className="mt-3 text-center font-baumans text-sm text-white/70">
            {item.caption}
          </p>
        )}
        {items.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-anon text-xs text-white/50">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky nav                                                         */
/* ------------------------------------------------------------------ */

function StickyNav({ activeId }: { activeId: string }) {
  return (
    <nav
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-2.5 xl:flex"
      aria-label="Page sections"
    >
      {NAV_SECTIONS.map((sec) => {
        const active = activeId === sec.id;
        return (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            title={sec.label}
            className={`block rounded-full transition-all duration-500 ${
              active
                ? "h-2.5 w-7 bg-accent shadow-[0_0_12px_color-mix(in_srgb,var(--theme-accent)_55%,transparent)]"
                : "h-2.5 w-2.5 border border-ink/25 bg-card hover:border-accent/60"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(sec.id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        );
      })}
    </nav>
  );
}

function ProjectNotFound() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-ink">
      <LandingHeader projectCount={PROJECTS.length} />
      <main
        id="main-content"
        className="px-5 pb-28 pt-28 sm:px-8 sm:pb-32 sm:pt-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-6 font-anon text-sm font-bold uppercase tracking-widest text-muted">
            404
          </p>
          <h1 className="mb-4 font-audiowide text-4xl sm:text-5xl">
            Project not found
          </h1>
          <p className="mb-10 font-baumans text-muted">
            This case study does not exist or the link is outdated.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-anon text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All projects
          </Link>
        </div>
      </main>
      <BackToTop />
    </div>
  );
}

function DetailFooter() {
  return (
    <footer className="border-t border-ink/10 bg-card px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-audiowide text-sm text-on-accent">
            R
          </div>
          <p className="font-baumans text-xs sm:text-sm">
            &copy; 2026 Ratul Saha Roy. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-anon text-[9px] font-bold uppercase tracking-widest text-muted sm:text-[10px]">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <Link href="/projects" className="hover:text-ink">
            Projects
          </Link>
          <a
            href={RESUME_HREF}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-ink"
          >
            <Download className="h-3 w-3" />
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Chapter — soft 3D depth card                                       */
/* ------------------------------------------------------------------ */

function ChapterCard({
  stop,
  index,
  reduceMotion,
}: {
  stop: JourneyStop;
  index: number;
  reduceMotion: boolean | null;
}) {
  const flip = index % 2 === 1;

  return (
    <motion.article
      className="pd-chapter relative"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 56,
              rotateX: 8,
              scale: 0.96,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.85, ease: EASE, delay: Math.min(index * 0.06, 0.24) }}
      style={{ transformPerspective: 1200, transformOrigin: "center top" }}
    >
      <div className="absolute -left-3 top-8 hidden h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-accent via-ink/20 to-transparent lg:block" />
      <div
        className={`absolute -left-[7px] top-10 hidden h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg lg:block`}
        aria-hidden
      />

      <div className="group relative overflow-hidden rounded-[30px] border-[5px] border-solid border-ink bg-card p-5 transition-shadow duration-500 hover:shadow-[0_24px_60px_-28px_color-mix(in_srgb,var(--theme-accent)_35%,transparent)] sm:p-7 lg:grid lg:grid-cols-12 lg:gap-10 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--theme-accent) 12%, transparent), transparent 40%)",
          }}
          aria-hidden
        />
        <div
          className={`relative flex flex-col gap-3 lg:col-span-4 ${flip ? "lg:order-2" : ""}`}
        >
          <motion.span
            className="font-audiowide text-[40px] leading-none text-accent/25 sm:text-[56px]"
            initial={reduceMotion ? false : { x: flip ? 40 : -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {stop.number}
          </motion.span>
          <h3 className="font-audiowide text-[22px] leading-[1.2] text-ink sm:text-[26px]">
            {stop.label}
          </h3>
          <motion.div
            className="h-1 origin-left rounded-full bg-accent"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            style={{ width: 88 }}
          />
        </div>
        <div className={`relative min-w-0 lg:col-span-8 ${flip ? "lg:order-1" : ""}`}>
          {stop.content}
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function ProjectDetailContent({
  project,
  slug,
  others,
}: {
  project: Project;
  slug: string;
  others: Project[];
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroStickyRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const mobileImgWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  const canVisit = Boolean(project.link && project.link !== "#");
  const allGallery = project.gallery ?? [];
  const journeyStops = buildJourneyStops(project);
  const { prev: prevProject, next: nextProject } = getProjectNeighbors(slug);
  const hasAnyNav = prevProject || nextProject;

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState(NAV_SECTIONS[0].id);
  const [activeChapter, setActiveChapter] = useState(0);
  /** Sticky live CTA — visible once the hero scrolls away */
  const [showLiveDock, setShowLiveDock] = useState(false);

  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    ScrollTrigger.refresh();
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel || !canVisit) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setShowLiveDock(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [canVisit, project.slug]);

  useEffect(() => {
    const ids = NAV_SECTIONS.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onChapterMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.25,
            },
          },
        );
      }

      /* Hero entrance — word stagger (no rotateX mid-fold clutter) */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.04 });
      tl.from(".pd-crumb", { opacity: 0, y: 18, duration: 0.5, stagger: 0.05 })
        .from(".pd-meta", { opacity: 0, y: 14, duration: 0.4 }, "-=0.28")
        .from(
          ".pd-title-word",
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.75,
            stagger: 0.07,
            ease: "power4.out",
          },
          "-=0.35",
        )
        .from(".pd-lead", { opacity: 0, y: 18, duration: 0.55 }, "-=0.4")
        .from(".pd-hero-cta", { opacity: 0, y: 14, duration: 0.4, stagger: 0.06 }, "-=0.35");

      /* Floating orbs */
      gsap.to(".pd-orb-a", {
        y: 28,
        x: -18,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".pd-orb-b", {
        y: -22,
        x: 16,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* Home-style curtain parallax — layered drift while content slides over */
      const heroSticky = heroStickyRef.current;
      const parallaxEnd = () => `+=${Math.round(window.innerHeight * 0.9)}`;
      const parallaxScrub = heroSticky
        ? {
            trigger: heroSticky,
            start: "top top",
            end: parallaxEnd,
            scrub: 0.55,
            invalidateOnRefresh: true,
          }
        : null;

      const figure = figureRef.current;
      const imgWrap = imgWrapRef.current;
      const mobileImgWrap = mobileImgWrapRef.current;

      if (parallaxScrub && imgWrap) {
        gsap.fromTo(
          imgWrap,
          { yPercent: -6, scale: 1.14 },
          { yPercent: 14, scale: 1.04, ease: "none", scrollTrigger: parallaxScrub },
        );
      }

      if (parallaxScrub && mobileImgWrap) {
        gsap.fromTo(
          mobileImgWrap,
          { yPercent: -4, scale: 1.1 },
          { yPercent: 12, scale: 1.02, ease: "none", scrollTrigger: parallaxScrub },
        );
      }

      const watermark = root.querySelector(".pd-hero-watermark");
      if (parallaxScrub && watermark) {
        gsap.fromTo(
          watermark,
          { yPercent: -8, scale: 1 },
          {
            yPercent: 22,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { ...parallaxScrub, scrub: 0.35 },
          },
        );
      }

      const caption = root.querySelector(".pd-hero-caption");
      if (parallaxScrub && caption) {
        gsap.fromTo(
          caption,
          { y: 0 },
          { y: -72, ease: "none", scrollTrigger: { ...parallaxScrub, scrub: 0.4 } },
        );
      }

      const crumbs = root.querySelector(".pd-hero-crumbs");
      if (parallaxScrub && crumbs) {
        gsap.fromTo(
          crumbs,
          { y: 0, opacity: 1 },
          { y: -48, opacity: 0.55, ease: "none", scrollTrigger: { ...parallaxScrub, scrub: 0.45 } },
        );
      }

      if (parallaxScrub && figure) {
        gsap.fromTo(
          figure,
          { opacity: 1 },
          {
            opacity: 0.72,
            ease: "none",
            scrollTrigger: {
              trigger: heroSticky,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * 0.45)}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      /* Stats count-up */
      root.querySelectorAll(".pd-stat-number").forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") ?? "0", 10);
        const raw = el.getAttribute("data-raw") ?? "";
        if (target <= 0) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            if (raw && raw.length === 4) {
              (el as HTMLElement).textContent = String(Math.round(obj.val));
            } else {
              (el as HTMLElement).textContent = String(Math.round(obj.val));
            }
          },
        });
      });

      /* Desktop gallery horizontal scrub */
      const gPin = galleryPinRef.current;
      const gTrack = galleryTrackRef.current;
      if (gPin && gTrack && window.innerWidth >= 768 && allGallery.length > 1) {
        const getScroll = () =>
          Math.max(0, gTrack.scrollWidth - gPin.clientWidth);
        gsap.to(gTrack, {
          x: () => -getScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: gPin,
            start: "top top",
            end: () => `+=${getScroll() + window.innerHeight * 0.35}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      /* Gallery items soft float */
      gsap.utils.toArray<HTMLElement>(".pd-gallery-card").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          rotateY: i % 2 === 0 ? -6 : 6,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
    }, root);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [project.slug, journeyStops.length, allGallery.length]);

  const titleWords = project.title.split(" ");
  const metaBits = [
    project.category,
    project.year && project.year !== "—" ? project.year : null,
  ].filter(Boolean) as string[];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-ink">
      <div ref={progressRef} className="scroll-progress" />
      <StickyNav activeId={activeNav} />
      <LandingHeader projectCount={PROJECTS.length} />

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="pd-orb-a absolute left-[8%] top-[18%] h-[min(42vw,320px)] w-[min(42vw,320px)] rounded-full bg-accent/[0.09] blur-[90px]" />
        <div className="pd-orb-b absolute bottom-[12%] right-[6%] h-[min(38vw,280px)] w-[min(38vw,280px)] rounded-full bg-accent/[0.06] blur-[80px]" />
      </div>

      {lightboxIdx !== null && allGallery.length > 0 && (
        <Lightbox
          items={allGallery}
          currentIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() =>
            setLightboxIdx((prev) =>
              prev !== null
                ? (prev - 1 + allGallery.length) % allGallery.length
                : 0,
            )
          }
          onNext={() =>
            setLightboxIdx((prev) =>
              prev !== null ? (prev + 1) % allGallery.length : 0,
            )
          }
        />
      )}

      <main id="main-content" className="pb-20 sm:pb-24">
        <div ref={rootRef}>
          {/* ===== HERO — sticky curtain + parallax (home-style) ===== */}
          <section id="pd-hero" className="relative scroll-mt-0">
            <div ref={heroStickyRef} className="sticky top-0 z-[1] overflow-hidden">
            {/* ── Mobile: stacked ── */}
            <div className="sm:hidden">
              <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2.5 px-4 pb-4 pt-[5.5rem]">
                <Link
                  href="/projects"
                  className="pd-crumb inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 font-anon text-[10px] font-bold uppercase tracking-[0.16em] text-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  All projects
                </Link>
                <Link
                  href="/"
                  className="pd-crumb font-anon text-[10px] font-bold uppercase tracking-[0.16em] text-muted"
                >
                  Home
                </Link>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
                <div ref={mobileImgWrapRef} className="absolute inset-0 will-change-transform">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="px-4 py-6">
                <p className="pd-meta mb-2 font-anon text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                  {metaBits.join(" · ")}
                </p>
                {project.role && (
                  <p className="mb-3 font-baumans text-[14px] leading-snug text-muted">
                    {project.role}
                  </p>
                )}
                <h1 className="pd-title-word mb-3 font-audiowide text-[1.75rem] leading-[1.1] text-ink">
                  {project.title}
                </h1>
                <p className="pd-lead mb-5 font-baumans text-[15px] leading-[1.55] text-ink/85">
                  {project.description}
                </p>
                {canVisit && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-hero-cta inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-anon text-[11px] font-bold uppercase tracking-[0.2em] text-on-accent"
                  >
                    Visit live site
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                )}
              </div>
            </div>

            {/* ── Tablet+ : cinematic overlay ── */}
            <figure
              ref={figureRef}
              className="pd-figure relative hidden w-screen max-w-[100vw] overflow-hidden border-0 bg-ink sm:block"
              style={{ marginLeft: "calc(50% - 50vw)" }}
            >
              <p
                className="pd-hero-watermark pointer-events-none absolute inset-0 z-[1] flex items-center justify-end overflow-hidden pr-[4%] font-audiowide text-[clamp(3.5rem,13vw,10rem)] uppercase leading-[0.88] tracking-tight text-white/[0.07] select-none sm:pr-[6%]"
                aria-hidden
              >
                {project.title}
              </p>
              <div
                ref={imgWrapRef}
                className="relative aspect-[16/10] w-full will-change-transform lg:aspect-[2.35/1] lg:min-h-[min(72vh,700px)]"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                  referrerPolicy="no-referrer"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/20 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent lg:via-black/20" />

              <div className="pd-hero-crumbs absolute inset-x-0 top-0 z-[3] mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-5 pb-2 pt-[5.75rem] sm:px-10 lg:px-[100px] lg:pt-24">
                <Link
                  href="/projects"
                  className="pd-crumb inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-4 py-2.5 font-anon text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  All projects
                </Link>
                <Link
                  href="/"
                  className="pd-crumb font-anon text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-white"
                >
                  Home
                </Link>
                {canVisit && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-crumb ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-anon text-[10px] font-bold uppercase tracking-[0.18em] text-on-accent shadow-[0_0_20px_color-mix(in_srgb,var(--theme-accent)_35%,transparent)] transition-transform hover:scale-[1.03]"
                  >
                    Live site
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
              </div>

              <figcaption className="pd-hero-caption absolute inset-x-0 bottom-0 z-[3] mx-auto w-full max-w-[1440px] px-5 pb-8 sm:px-10 sm:pb-12 lg:px-[100px] lg:pb-14">
                <div className="max-w-xl rounded-[24px] border border-white/10 bg-black/55 p-5 backdrop-blur-md sm:max-w-2xl sm:rounded-[28px] sm:p-7 lg:max-w-[36rem]">
                  <p className="pd-meta mb-3 font-anon text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                    {metaBits.join(" · ")}
                    {project.role ? (
                      <span className="mt-1.5 block normal-case tracking-normal text-white/55">
                        {project.role}
                      </span>
                    ) : null}
                  </p>
                  <h1 className="mb-4 font-audiowide text-[clamp(1.85rem,5.5vw,3.25rem)] leading-[1.08] text-white">
                    {titleWords.map((word, i) => (
                      <span
                        key={`${slug}-w-${i}`}
                        className="inline-block overflow-hidden align-bottom"
                      >
                        <span className="pd-title-word inline-block will-change-transform">
                          {word}
                          {i < titleWords.length - 1 ? "\u00A0" : ""}
                        </span>
                      </span>
                    ))}
                  </h1>
                  <p className="pd-lead mb-6 font-baumans text-[15px] leading-[1.5] text-white/85 sm:text-[17px]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {canVisit && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pd-hero-cta inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-anon text-[11px] font-bold uppercase tracking-[0.2em] text-on-accent shadow-[0_0_28px_color-mix(in_srgb,var(--theme-accent)_40%,transparent)]"
                      >
                        Visit live site
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </a>
                    )}
                    <Link
                      href="/projects"
                      className="pd-hero-cta inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 font-anon text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                      All projects
                    </Link>
                  </div>
                </div>
              </figcaption>
            </figure>
            </div>

            <div ref={heroSentinelRef} className="pointer-events-none h-px w-full" aria-hidden />

          {/* Content slides over pinned hero (curtain) */}
          <div className="relative z-[2] bg-bg pt-8 sm:pt-14">
            <div className="mb-8 sm:mb-12">
              <TechMarquee tags={project.tags} />
            </div>

            <StatsStrip project={project} />

            {/* Live strip — tablet+ only (mobile has hero CTA + sticky dock) */}
            {canVisit && (
              <div className="mx-auto mt-8 hidden max-w-[1440px] px-5 sm:mt-10 sm:block sm:px-10 lg:px-[100px]">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-stretch gap-3 overflow-hidden rounded-[24px] border-[4px] border-accent bg-accent/10 px-5 py-4 transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:rounded-[28px] sm:px-7 sm:py-5"
                >
                  <div className="min-w-0">
                    <p className="font-anon text-[10px] font-bold uppercase tracking-[0.22em] text-accent transition-colors group-hover:text-on-accent">
                      Live project
                    </p>
                    <p className="mt-1 truncate font-baumans text-[15px] text-ink transition-colors group-hover:text-on-accent sm:text-[17px]">
                      {project.link.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-anon text-[11px] font-bold uppercase tracking-[0.18em] text-on-accent transition-colors group-hover:bg-ink group-hover:text-bg sm:px-6">
                    Open live site
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </a>
              </div>
            )}

            {/* DETAILS */}
            <section
              id="pd-details"
              className="mx-auto mt-14 max-w-[1440px] px-5 sm:mt-16 sm:px-10 lg:mt-20 lg:px-[100px]"
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, ease: EASE }}
                className="overflow-hidden rounded-[30px] border-[5px] border-ink bg-card p-5 sm:p-8"
                onMouseMove={onChapterMove}
              >
                <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
                  <div>
                    <h2 className="font-audiowide text-[22px] sm:text-[28px]">
                      Details
                    </h2>
                    <motion.div
                      className="mt-2 h-1 origin-left rounded-full bg-accent"
                      initial={reduceMotion ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: EASE }}
                      style={{ width: 100 }}
                    />
                  </div>
                  {canVisit && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 font-anon text-[10px] font-bold uppercase tracking-widest text-on-accent sm:px-5"
                    >
                      Visit live
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <dl className="divide-y divide-ink/10">
                  {(
                    [
                      ["Project", project.title],
                      project.year && project.year !== "—"
                        ? ["Year", project.year]
                        : null,
                      project.role ? ["Role", project.role] : null,
                      ["Category", project.category],
                      ["Stack", project.tags.join(" · ")],
                    ] as ([string, string] | null)[]
                  )
                    .filter(Boolean)
                    .map((row, i) => {
                      const [label, value] = row as [string, string];
                      return (
                        <motion.div
                          key={label}
                          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                          className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-10 sm:py-5"
                        >
                          <dt className="font-anon text-[10px] font-bold uppercase tracking-widest text-muted">
                            {label}
                          </dt>
                          <dd className="font-baumans text-[15px] leading-relaxed sm:text-[17px]">
                            {value}
                          </dd>
                        </motion.div>
                      );
                    })}
                  <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-10 sm:py-5">
                    <dt className="font-anon text-[10px] font-bold uppercase tracking-widest text-muted">
                      Website
                    </dt>
                    <dd className="font-baumans text-[15px] sm:text-[17px]">
                      {canVisit ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                        >
                          {project.link.replace(/^https?:\/\//, "")}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-muted">&mdash;</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {project.extraLinks && project.extraLinks.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.extraLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-bg px-4 py-2 font-anon text-[11px] font-bold transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </section>

            {/* JOURNEY */}
            {journeyStops.length > 0 && (
              <section
                id="pd-journey"
                className="mx-auto mt-20 max-w-[1440px] px-5 sm:mt-24 sm:px-10 lg:px-[100px]"
                aria-label="Project journey"
              >
                <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-14">
                  <motion.p
                    className="font-anon text-[10px] font-bold uppercase tracking-[0.28em] text-accent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    Case study
                  </motion.p>
                  <h2 className="font-audiowide text-[clamp(1.85rem,4.5vw,3rem)]">
                    The Journey
                  </h2>
                  <p className="max-w-[38ch] font-baumans text-[16px] sm:text-[18px]">
                    From problem to shipped outcome — scroll the chapters.
                  </p>
                </div>

                {/* Chapter pills */}
                <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10">
                  {journeyStops.map((s, i) => (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => {
                        setActiveChapter(i);
                        document
                          .getElementById(`pd-chapter-${i}`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className={`rounded-full px-3.5 py-1.5 font-anon text-[11px] font-bold transition-all ${
                        activeChapter === i
                          ? "bg-accent text-on-accent"
                          : "border border-ink/20 bg-card text-muted hover:text-ink"
                      }`}
                    >
                      {s.number} {s.label}
                    </button>
                  ))}
                </div>

                <div
                  className="relative flex flex-col gap-6 lg:gap-10 lg:pl-8"
                  style={{ perspective: 1400 }}
                >
                  {journeyStops.map((stop, i) => (
                    <div
                      key={stop.number}
                      id={`pd-chapter-${i}`}
                      onFocus={() => setActiveChapter(i)}
                      onMouseEnter={() => setActiveChapter(i)}
                    >
                      <ChapterCard
                        stop={stop}
                        index={i}
                        reduceMotion={reduceMotion}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* GALLERY */}
            {allGallery.length > 0 && (
              <section
                id="pd-gallery"
                className="mt-20 sm:mt-24"
                aria-labelledby={`${slug}-gallery-heading`}
              >
                <div className="mx-auto mb-8 max-w-[1440px] px-5 text-center sm:mb-10 sm:px-10 lg:px-[100px]">
                  <h2
                    id={`${slug}-gallery-heading`}
                    className="font-audiowide text-[clamp(1.85rem,4.5vw,3rem)]"
                  >
                    Gallery
                  </h2>
                  <p className="mt-2 font-baumans text-[16px] sm:text-[18px]">
                    Scroll through the frames
                    <span className="hidden sm:inline"> — pinned horizontal scrub</span>
                    .
                  </p>
                </div>

                {/* Mobile stack — scroll safe */}
                <div className="flex flex-col gap-4 px-5 sm:hidden">
                  {allGallery.map((item, gi) => (
                    <figure
                      key={`${slug}-gm-${gi}`}
                      className="pd-gallery-card cursor-pointer overflow-hidden rounded-[24px] border-[4px] border-ink bg-card"
                      onClick={() => setLightboxIdx(gi)}
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={item.src}
                          alt={item.alt ?? ""}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                          onLoad={() => ScrollTrigger.refresh()}
                        />
                      </div>
                      {item.caption && (
                        <figcaption className="border-t border-ink/10 px-4 py-3 font-baumans text-sm">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>

                {/* Desktop / tablet scrub */}
                <div
                  ref={galleryPinRef}
                  className="relative hidden h-dvh overflow-hidden sm:block"
                >
                  <div
                    ref={galleryTrackRef}
                    className="flex h-full items-center gap-6 px-[8vw] will-change-transform"
                    style={{ width: "max-content" }}
                  >
                    {allGallery.map((item, gi) => (
                      <figure
                        key={`${slug}-gd-${gi}`}
                        className="pd-gallery-card group relative h-[min(62vh,520px)] w-[min(78vw,720px)] shrink-0 cursor-pointer overflow-hidden rounded-[28px] border-[5px] border-ink bg-card"
                        onClick={() => setLightboxIdx(gi)}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt ?? ""}
                          fill
                          sizes="80vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          referrerPolicy="no-referrer"
                          onLoad={() => ScrollTrigger.refresh()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
                          <div>
                            <p className="font-anon text-[10px] font-bold uppercase tracking-widest text-accent">
                              {String(gi + 1).padStart(2, "0")} /{" "}
                              {String(allGallery.length).padStart(2, "0")}
                            </p>
                            {item.caption && (
                              <p className="mt-1 max-w-md font-baumans text-sm text-white sm:text-base">
                                {item.caption}
                              </p>
                            )}
                          </div>
                          <span className="rounded-full bg-accent px-4 py-1.5 font-anon text-[10px] font-bold uppercase tracking-widest text-on-accent opacity-0 transition-opacity group-hover:opacity-100">
                            Expand
                          </span>
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* MORE WORK */}
            {others.length > 0 && (
              <section
                id="pd-more"
                className="mx-auto mt-20 max-w-[1440px] px-5 sm:mt-24 sm:px-10 lg:px-[100px]"
                aria-labelledby={`${slug}-more-heading`}
              >
                <h2
                  id={`${slug}-more-heading`}
                  className="mb-10 text-center font-audiowide text-[clamp(1.85rem,4.5vw,3rem)] sm:mb-14"
                >
                  More work
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  {others.map((p, i) => {
                    const number = String(i + 1).padStart(2, "0");
                    return (
                      <motion.article
                        key={p.slug}
                        initial={reduceMotion ? false : { opacity: 0, y: 36, rotateY: i === 0 ? -4 : 4 }}
                        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : { y: -8, transition: SPRING }
                        }
                        style={{ transformPerspective: 1000 }}
                        className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border-[5px] border-ink bg-card"
                      >
                        <Link
                          href={`/projects/${p.slug}`}
                          className="absolute inset-0 z-[2]"
                          aria-label={`View ${p.title} case study`}
                        />
                        <div className="relative z-[1] flex flex-1 flex-col gap-3.5 p-5 sm:p-6">
                          <div className="flex items-start justify-between gap-3 font-audiowide text-[20px] leading-[1.2] sm:text-[24px]">
                            <h3 className="min-w-0 flex-1 line-clamp-2">
                              {p.title}
                            </h3>
                            <span className="shrink-0 tabular-nums text-accent">
                              /{number}
                            </span>
                          </div>
                          <div className="h-1 w-20 rounded-full bg-ink transition-all duration-500 group-hover:w-28 group-hover:bg-accent" />
                          <p className="line-clamp-2 font-baumans text-[15px] sm:text-[16px]">
                            {p.description}
                          </p>
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface">
                            <Image
                              src={p.image}
                              alt={`${p.title} project preview`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="mt-auto font-anon text-[12px] font-bold uppercase tracking-wider text-muted transition-colors group-hover:text-accent">
                            Case study →
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* PREV / NEXT */}
            {hasAnyNav && (
              <nav
                className="mx-auto mt-20 max-w-[1440px] px-5 sm:mt-24 sm:px-10 lg:px-[100px]"
                aria-label="Previous and next project"
              >
                <h2 className="mb-8 text-center font-anon text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Continue exploring
                </h2>
                <div
                  className={`grid gap-4 sm:gap-5 ${
                    prevProject && nextProject
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {prevProject && (
                    <Link
                      href={`/projects/${prevProject.slug}`}
                      className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[28px] border-[5px] border-ink bg-card p-6 transition-transform hover:-translate-y-1 sm:min-h-[170px] sm:p-8"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-[0.08] transition-opacity group-hover:opacity-[0.16]">
                        <Image
                          src={prevProject.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                      </div>
                      <span className="relative z-[1] mb-2 inline-flex items-center gap-2 font-anon text-[10px] font-bold uppercase tracking-widest text-muted">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Previous
                      </span>
                      <span className="relative z-[1] font-audiowide text-lg leading-tight sm:text-xl md:text-2xl">
                        {prevProject.title}
                      </span>
                    </Link>
                  )}
                  {nextProject && (
                    <Link
                      href={`/projects/${nextProject.slug}`}
                      className={`group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[28px] border-[5px] border-ink bg-card p-6 transition-transform hover:-translate-y-1 sm:min-h-[170px] sm:p-8 ${
                        prevProject ? "sm:items-end sm:text-right" : ""
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-[0.08] transition-opacity group-hover:opacity-[0.16]">
                        <Image
                          src={nextProject.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                      </div>
                      <span
                        className={`relative z-[1] mb-2 inline-flex items-center gap-2 font-anon text-[10px] font-bold uppercase tracking-widest text-muted ${
                          prevProject ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="relative z-[1] font-audiowide text-lg leading-tight sm:text-xl md:text-2xl">
                        {nextProject.title}
                      </span>
                    </Link>
                  )}
                </div>
              </nav>
            )}

            {/* CONTACT */}
            <section
              id="pd-contact"
              className="mx-auto mt-20 max-w-[1440px] px-5 sm:mt-24 sm:px-10 lg:px-[100px]"
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, ease: EASE }}
                className="relative overflow-hidden rounded-[30px] border-[5px] border-ink bg-ink px-8 py-14 text-bg sm:px-12 sm:py-16"
              >
                <motion.div
                  className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-accent/35 blur-3xl"
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: [1, 1.2, 1], x: [0, -20, 0] }
                  }
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <motion.div
                  className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: [1.1, 0.9, 1.1], y: [0, -16, 0] }
                  }
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <div className="relative z-[1] max-w-xl">
                  <p className="mb-3 font-anon text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                    Let&apos;s talk
                  </p>
                  <h2 className="mb-4 font-audiowide text-2xl leading-tight sm:text-3xl">
                    Building something similar?
                  </h2>
                  <p className="mb-8 font-baumans text-[16px] leading-relaxed text-bg/70 sm:text-[18px]">
                    Need front-end implementation, MERN-style delivery, or a
                    focused product slice — reach out from contact.
                  </p>
                  <Magnetic className="inline-flex">
                    <Link
                      href="/#contact"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-anon text-[10px] font-bold uppercase tracking-[0.2em] text-on-accent shadow-[0_0_32px_color-mix(in_srgb,var(--theme-accent)_45%,transparent)] sm:w-auto"
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                      Go to contact
                    </Link>
                  </Magnetic>
                </div>
              </motion.div>
            </section>
          </div>
          </section>
        </div>
      </main>

      <DetailFooter />
      <BackToTop />

      {/* Sticky live dock — always findable while reading the case study */}
      {canVisit && (
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 transition-all duration-300 ${
            showLiveDock && lightboxIdx === null
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-8 opacity-0"
          }`}
          aria-hidden={!showLiveDock || lightboxIdx !== null}
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={showLiveDock && lightboxIdx === null ? 0 : -1}
            className={`inline-flex max-w-full items-center gap-3 rounded-full border-[3px] border-ink bg-accent px-5 py-3.5 font-anon text-[11px] font-bold uppercase tracking-[0.18em] text-on-accent shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.03] sm:gap-4 sm:px-7 sm:py-4 sm:text-[12px] ${
              showLiveDock && lightboxIdx === null
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-accent/70 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-on-accent" />
            </span>
            <span className="truncate">Visit live site</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
          </a>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage({ slug }: { slug: string }) {
  const project = slug ? getProjectBySlug(slug) : undefined;
  const others = PROJECTS.filter((p) => p.slug !== slug).slice(0, 2);

  if (!project || !slug) {
    return <ProjectNotFound />;
  }

  return (
    <ProjectDetailContent project={project} slug={slug} others={others} />
  );
}
