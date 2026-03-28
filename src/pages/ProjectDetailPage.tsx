/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useParams } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  LayoutGrid,
  Layers2,
  Mail,
  Target,
  TrendingUp,
  User,
  Download,
  Github,
  Linkedin,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { BackToTop } from "../components/BackToTop";
import {
  PROJECTS,
  getProjectBySlug,
  getProjectNeighbors,
  type Project,
} from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";
const LINKEDIN_HREF = "https://www.linkedin.com/in/ratulroy8863";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ------------------------------------------------------------------ */
/*  404                                                                */
/* ------------------------------------------------------------------ */

function ProjectNotFound() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-ink">
      <Navbar />
      <main className="px-5 pb-28 pt-28 sm:px-8 sm:pb-32 sm:pt-32 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-6 text-sm font-bold uppercase tracking-widest text-black/40">
            404
          </p>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Project not found
          </h1>
          <p className="mb-10 text-black/50">
            This case study does not exist or the link is outdated.
          </p>
          <Link
            to="/projects"
            className="glass-pill inline-flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black"
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

/* ------------------------------------------------------------------ */
/*  Footer (matches homepage)                                          */
/* ------------------------------------------------------------------ */

function DetailFooter() {
  return (
    <footer className="border-t border-black/5 bg-white px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:gap-8 md:flex-row md:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black font-bold text-white">
            R
          </div>
          <p className="max-w-xs text-xs font-medium sm:max-w-none sm:text-sm">
            © 2026 Ratul Saha Roy. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[9px] font-bold uppercase tracking-widest text-black/40 sm:text-[10px]">
          <a href="#" className="transition-colors hover:text-black">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-black">
            Terms of Service
          </a>
          <a
            href={RESUME_HREF}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-black"
          >
            <Download className="h-3 w-3 shrink-0" />
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Main content                                                       */
/* ------------------------------------------------------------------ */

function ProjectDetailContent({
  project,
  slug,
  others,
  prevProject,
  nextProject,
}: {
  project: Project;
  slug: string;
  others: Project[];
  prevProject: Project | undefined;
  nextProject: Project | undefined;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const canVisit = project.link && project.link !== "#";

  /* ── GSAP animations ── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* --- Entrance timeline --- */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.05,
      });

      tl.from(".pd-back", {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.06,
      })
        .from(
          ".pd-meta > *",
          { opacity: 0, y: 14, scale: 0.96, duration: 0.45, stagger: 0.07 },
          "-=0.35"
        )
        .from(
          ".pd-title-word",
          {
            yPercent: 108,
            duration: 0.9,
            stagger: 0.065,
            ease: "power4.out",
          },
          "-=0.5"
        )
        .from(
          ".pd-lead",
          { opacity: 0, y: 22, filter: "blur(6px)", duration: 0.65 },
          "-=0.55"
        );

      /* --- Hero image parallax + clip reveal --- */
      const figure = figureRef.current;
      const imgWrap = imgWrapRef.current;
      if (figure && imgWrap) {
        gsap.fromTo(
          figure,
          { clipPath: "inset(0% 3% 0% 3% round 28px)", opacity: 0.9 },
          {
            clipPath: "inset(0% 0% 0% 0% round 36px)",
            opacity: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: figure,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.85,
            },
          }
        );

        gsap.to(imgWrap, {
          yPercent: 9,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: figure,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      /*
       * Scroll-reveal: Uses CSS class toggle instead of gsap.from() opacity.
       * Elements start visible in the DOM. GSAP animates them with ScrollTrigger.
       * A global safety timer ensures NO element stays hidden longer than 3s.
       */

      // Collect all animated selectors for safety fallback
      const animatedSelectors: string[] = [];

      function scrollReveal(
        selector: string,
        fromVars: gsap.TweenVars,
        triggerSelector?: string
      ) {
        const triggerSel = triggerSelector || selector;
        const triggerEl = root.querySelector(triggerSel);
        const targets = root.querySelectorAll(selector);
        if (!triggerEl || targets.length === 0) return;

        animatedSelectors.push(selector);

        // Set initial hidden state
        gsap.set(selector, fromVars);

        // Create the "to" vars that restore visibility
        const toVars: gsap.TweenVars = { clearProps: "all" };
        if (fromVars.opacity !== undefined) toVars.opacity = 1;
        if (fromVars.y !== undefined) toVars.y = 0;
        if (fromVars.x !== undefined) toVars.x = 0;
        if (fromVars.scale !== undefined) toVars.scale = 1;
        if (fromVars.rotateZ !== undefined) toVars.rotateZ = 0;

        gsap.to(selector, {
          ...toVars,
          duration: fromVars.duration ?? 0.6,
          stagger: fromVars.stagger,
          ease: fromVars.ease ?? "power2.out",
          scrollTrigger: {
            trigger: triggerSel,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        });
      }

      /* --- Overview section --- */
      scrollReveal(".pd-overview-head", {
        opacity: 0,
        x: -24,
        duration: 0.7,
      });

      scrollReveal(
        ".pd-para",
        {
          opacity: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.14,
          ease: "power2.out",
        },
        ".pd-copy"
      );

      /* --- Highlights --- */
      scrollReveal(".pd-high-head", {
        opacity: 0,
        x: -20,
        duration: 0.6,
      });

      scrollReveal(
        ".pd-high-item",
        {
          opacity: 0,
          x: -16,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        },
        ".pd-high-list"
      );

      scrollReveal(
        ".pd-high-dot",
        {
          scale: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: "back.out(2)",
        },
        ".pd-high-list"
      );

      /* --- Sidebar --- */
      scrollReveal(".pd-aside", {
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: "power3.out",
      });

      scrollReveal(
        ".pd-tag",
        {
          opacity: 0,
          y: 14,
          rotateZ: -3,
          duration: 0.45,
          stagger: {
            each: 0.05,
            from: "random",
          },
          ease: "power2.out",
        },
        ".pd-tag-wrap"
      );

      /* --- Case study --- */
      scrollReveal(
        ".pd-case-title",
        {
          opacity: 0,
          y: 20,
          duration: 0.55,
        },
        ".pd-case-section"
      );

      scrollReveal(
        ".pd-case-card",
        {
          opacity: 0,
          y: 28,
          duration: 0.65,
          stagger: 0.14,
          ease: "power2.out",
        },
        ".pd-case-grid"
      );

      /* --- Gallery --- */
      scrollReveal(
        ".pd-gallery-title",
        {
          opacity: 0,
          y: 20,
          duration: 0.55,
        },
        ".pd-gallery-section"
      );

      scrollReveal(
        ".pd-gallery-item",
        {
          opacity: 0,
          y: 28,
          scale: 0.98,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
        },
        ".pd-gallery-grid"
      );

      /* --- Links --- */
      scrollReveal(
        ".pd-links-title",
        {
          opacity: 0,
          y: 16,
          duration: 0.5,
        },
        ".pd-links-section"
      );

      scrollReveal(
        ".pd-link-row",
        {
          opacity: 0,
          x: -16,
          duration: 0.5,
          stagger: 0.08,
        },
        ".pd-links-list"
      );

      /* --- More work --- */
      scrollReveal(
        ".pd-more-title",
        {
          opacity: 0,
          y: 24,
          duration: 0.6,
        },
        ".pd-more-section"
      );

      scrollReveal(
        ".pd-more-card",
        {
          opacity: 0,
          y: 32,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
        },
        ".pd-more-grid"
      );

      /* --- Ambient floating orbs --- */
      gsap.to(".pd-orbit-a", {
        x: 18,
        y: -12,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".pd-orbit-b", {
        x: -22,
        y: 16,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* --- Prev / Next --- */
      scrollReveal(
        ".pd-prevnext-card",
        {
          opacity: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
        },
        ".pd-prevnext"
      );

      /* --- Contact CTA --- */
      scrollReveal(
        ".pd-contact-block",
        {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power3.out",
        },
        ".pd-contact-section"
      );

      /*
       * GLOBAL SAFETY NET: After 3 seconds, force ALL animated elements visible.
       * This guarantees that no content stays hidden even if ScrollTrigger
       * misbehaves due to programmatic scrolling, viewport issues, etc.
       */
      const safetyTimer = setTimeout(() => {
        animatedSelectors.forEach((sel) => {
          const els = root.querySelectorAll(sel);
          els.forEach((el) => {
            gsap.set(el, { clearProps: "all" });
          });
        });
      }, 3000);
    }, root);

    return () => {
      ctx.revert();
    };
  }, [project.slug]);

  const titleWords = project.title.split(" ");

  /* Determine prev/next layout */
  const hasPrev = !!prevProject;
  const hasNext = !!nextProject;
  const hasBothNav = hasPrev && hasNext;
  const hasAnyNav = hasPrev || hasNext;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-ink">
      <Navbar />

      {/* ── Ambient background orbs ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-40 overflow-hidden"
        aria-hidden
      >
        <div className="pd-orbit-a absolute left-[12%] top-[22%] h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full bg-accent/[0.07] blur-[100px]" />
        <div className="pd-orbit-b absolute bottom-[8%] right-[5%] h-[min(48vw,360px)] w-[min(48vw,360px)] rounded-full bg-black/[0.045] blur-[90px]" />
      </div>

      <main className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10 xl:px-12">
        <div ref={rootRef} className="mx-auto max-w-6xl">

          {/* ============================================================ */}
          {/*  SECTION 1 — HEADER BLOCK                                    */}
          {/* ============================================================ */}
          <header className="mb-10 sm:mb-14 lg:mb-16">
            {/* Breadcrumbs */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Link
                to="/projects"
                className="pd-back glass-pill inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55 transition-colors hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                All projects
              </Link>
              <Link
                to="/"
                className="pd-back text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 transition-colors hover:text-black/60"
              >
                Home
              </Link>
            </div>

            {/* Meta strip */}
            <div className="pd-meta mb-6 flex flex-wrap items-center gap-4">
              <span className="inline-block rounded-full bg-muted px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/50 ring-1 ring-black/5">
                {project.category}
              </span>
              {project.year && project.year !== "—" && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black/40">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {project.year}
                </span>
              )}
              {project.role && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black/40">
                  <User className="h-3.5 w-3.5" aria-hidden />
                  {project.role}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-6 max-w-4xl font-display text-[clamp(2.25rem,min(8vw,12dvh),4.5rem)] font-extrabold leading-[0.95] tracking-tight [text-wrap:normal] sm:text-[clamp(2.5rem,min(7vw,11dvh),5rem)]">
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

            {/* Description */}
            <p className="pd-lead max-w-2xl text-base font-light leading-relaxed text-black/55 sm:text-lg">
              {project.description}
            </p>

            {/* CTA */}
            {canVisit && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-cta relative z-[1] mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-100 transition-opacity hover:opacity-90 sm:mt-8 sm:inline-flex sm:w-auto"
              >
                Visit live site
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
          </header>

          {/* ============================================================ */}
          {/*  SECTION 2 — HERO IMAGE                                      */}
          {/* ============================================================ */}
          <figure
            ref={figureRef}
            className="pd-figure mb-16 overflow-hidden rounded-[24px] border border-black/5 bg-muted sm:mb-20 sm:rounded-[32px] lg:mb-24 lg:rounded-[36px]"
          >
            <div
              ref={imgWrapRef}
              className="aspect-[16/10] w-full will-change-transform sm:aspect-[16/9]"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          </figure>

          {/* ============================================================ */}
          {/*  SECTION 3 — OVERVIEW + SIDEBAR                              */}
          {/*  Mobile: overview first, sidebar second                       */}
          {/*  Desktop (lg+): side-by-side 7/5 split                       */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 gap-10 border-t border-black/[0.06] pt-16 sm:gap-12 sm:pt-20 lg:grid-cols-12 lg:gap-14 lg:pt-24 xl:gap-16">
            {/* LEFT — Overview + Highlights */}
            <div
              id="overview"
              className="pd-copy min-w-0 lg:col-span-7 xl:col-span-8"
            >
              <h2 className="pd-overview-head mb-6 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Overview
              </h2>
              <div className="space-y-5 text-base font-light leading-relaxed text-black/60 sm:text-lg">
                {project.overview.map((para, i) => (
                  <p key={i} className="pd-para">
                    {para}
                  </p>
                ))}
              </div>

              {project.highlights && project.highlights.length > 0 && (
                <>
                  <h3 className="pd-high-head mb-4 mt-10 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                    Highlights
                  </h3>
                  <ul className="pd-high-list space-y-3 text-base font-light leading-relaxed text-black/60 sm:text-lg">
                    {project.highlights.map((line, i) => (
                      <li key={i} className="pd-high-item flex gap-3">
                        <span
                          className="pd-high-dot mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          aria-hidden
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* RIGHT — Stack & Tools sidebar */}
            <aside className="min-w-0 lg:col-span-5 xl:col-span-4">
              <div className="pd-aside top-24 space-y-6 rounded-[24px] border border-black/5 bg-white p-6 sm:top-28 sm:rounded-[28px] sm:p-8 lg:sticky">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
                  <LayoutGrid className="h-4 w-4" aria-hidden />
                  Stack & tools
                </div>
                <div className="pd-tag-wrap flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="pd-tag rounded-full border border-black/8 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-black/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* ============================================================ */}
          {/*  SECTION 4 — CASE STUDY                                      */}
          {/* ============================================================ */}
          {project.caseStudy && (
            <section
              className="pd-case-section mt-16 border-t border-black/[0.06] pt-16 sm:mt-20 sm:pt-20 lg:mt-24 lg:pt-24"
              aria-labelledby={`${slug}-case-heading`}
            >
              <h2
                id={`${slug}-case-heading`}
                className="pd-case-title mb-8 font-display text-2xl font-extrabold tracking-tight text-ink sm:mb-10 sm:text-3xl"
              >
                Challenge, approach & outcome
              </h2>
              <div className="pd-case-grid grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-5 lg:gap-8">
                <article className="pd-case-card flex flex-col rounded-[20px] border border-black/5 bg-white p-6 transition-all duration-300 hover:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.12)] hover:scale-[1.02] sm:rounded-[24px] sm:p-8">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Target className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mb-3 font-display text-lg font-extrabold tracking-tight sm:text-xl">
                    Challenge
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-black/60 sm:text-base">
                    {project.caseStudy.problem}
                  </p>
                </article>
                <article className="pd-case-card flex flex-col rounded-[20px] border border-black/5 bg-white p-6 transition-all duration-300 hover:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.12)] hover:scale-[1.02] sm:rounded-[24px] sm:p-8">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.06] text-ink">
                    <Layers2 className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mb-3 font-display text-lg font-extrabold tracking-tight sm:text-xl">
                    Approach
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-black/60 sm:text-base">
                    {project.caseStudy.approach}
                  </p>
                </article>
                <article className="pd-case-card flex flex-col rounded-[20px] border border-black/5 bg-white p-6 transition-all duration-300 hover:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.12)] hover:scale-[1.02] sm:rounded-[24px] sm:p-8">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <TrendingUp className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mb-3 font-display text-lg font-extrabold tracking-tight sm:text-xl">
                    Outcome
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-black/60 sm:text-base">
                    {project.caseStudy.outcome}
                  </p>
                </article>
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/*  SECTION 5 — GALLERY                                         */}
          {/* ============================================================ */}
          {project.gallery && project.gallery.length > 0 && (
            <section
              className="pd-gallery-section mt-16 border-t border-black/[0.06] pt-16 sm:mt-20 sm:pt-20 lg:mt-24 lg:pt-24"
              aria-labelledby={`${slug}-gallery-heading`}
            >
              <h2
                id={`${slug}-gallery-heading`}
                className="pd-gallery-title mb-8 font-display text-2xl font-extrabold tracking-tight sm:mb-10 sm:text-3xl"
              >
                Gallery
              </h2>
              <div className="pd-gallery-grid grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {project.gallery.map((item, gi) => (
                  <figure
                    key={`${slug}-g-${gi}`}
                    className="pd-gallery-item group overflow-hidden rounded-[20px] border border-black/5 bg-muted sm:rounded-[24px]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.alt ?? ""}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    </div>
                    {item.caption && (
                      <figcaption className="border-t border-black/5 px-5 py-4 text-sm font-light text-black/50">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/*  SECTION 6 — LINKS                                           */}
          {/* ============================================================ */}
          {project.extraLinks && project.extraLinks.length > 0 && (
            <section
              className="pd-links-section mt-16 border-t border-black/[0.06] pt-16 sm:mt-20 sm:pt-20 lg:mt-24 lg:pt-24"
              aria-labelledby={`${slug}-links-heading`}
            >
              <h2
                id={`${slug}-links-heading`}
                className="pd-links-title mb-6 font-display text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                Links
              </h2>
              <ul className="pd-links-list flex max-w-full flex-col gap-3 sm:max-w-xl">
                {project.extraLinks.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-link-row glass-pill flex items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ink transition-all hover:border-black/15 hover:shadow-sm"
                    >
                      <span>{item.label}</span>
                      <ExternalLink
                        className="h-4 w-4 shrink-0 text-black/40"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ============================================================ */}
          {/*  SECTION 7 — PREV / NEXT NAVIGATION                         */}
          {/*  Full-width card when only one direction available            */}
          {/* ============================================================ */}
          {hasAnyNav && (
            <nav
              className="pd-prevnext mt-16 border-t border-black/[0.06] pt-16 sm:mt-20 sm:pt-20 lg:mt-24 lg:pt-24"
              aria-label="Previous and next project"
            >
              <h2 className="mb-6 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-black/40 sm:mb-8">
                Previous & next case study
              </h2>
              <div
                className={`grid gap-4 sm:gap-5 ${
                  hasBothNav
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {prevProject && (
                  <Link
                    to={`/projects/${prevProject.slug}`}
                    className="pd-prevnext-card group flex min-h-[112px] flex-col justify-between rounded-[20px] border border-black/5 bg-white p-5 transition-all duration-300 hover:border-black/12 hover:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)] sm:min-h-[120px] sm:rounded-[24px] sm:p-8"
                  >
                    <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 sm:mb-3">
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Previous
                    </span>
                    <span className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-xl md:text-2xl">
                      {prevProject.title}
                    </span>
                  </Link>
                )}
                {nextProject && (
                  <Link
                    to={`/projects/${nextProject.slug}`}
                    className={`pd-prevnext-card group flex min-h-[112px] flex-col justify-between rounded-[20px] border border-black/5 bg-white p-5 text-left transition-all duration-300 hover:border-black/12 hover:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)] sm:min-h-[120px] sm:rounded-[24px] sm:p-8 ${
                      hasBothNav ? "sm:text-right" : ""
                    }`}
                  >
                    <span
                      className={`mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 sm:mb-3 ${
                        hasBothNav ? "sm:justify-end" : ""
                      }`}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-xl md:text-2xl">
                      {nextProject.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          )}

          {/* ============================================================ */}
          {/*  SECTION 8 — MORE WORK (max 2 projects, 2-col)              */}
          {/* ============================================================ */}
          {others.length > 0 && (
            <section
              className="pd-more-section mt-16 border-t border-black/[0.06] pt-16 sm:mt-20 sm:pt-20 lg:mt-24 lg:pt-24"
              aria-labelledby={`${slug}-more-heading`}
            >
              <h2
                id={`${slug}-more-heading`}
                className="pd-more-title mb-8 font-display text-2xl font-extrabold tracking-tight sm:mb-10 sm:text-3xl"
              >
                More work
              </h2>
              <div className="pd-more-grid grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                {others.map((p) => (
                  <div key={p.slug} className="pd-more-card min-h-0">
                    <Link
                      to={`/projects/${p.slug}`}
                      className="group block overflow-hidden rounded-[20px] border border-black/5 bg-white transition-all duration-500 hover:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.2)] sm:rounded-[24px]"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={p.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-2 p-5 sm:p-6">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent">
                          {p.category}
                        </span>
                        <p className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
                          {p.title}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black/40 transition-colors group-hover:text-black/70">
                          View case study
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/*  SECTION 9 — CONTACT CTA                                     */}
          {/* ============================================================ */}
          <section className="pd-contact-section mt-16 border-t border-black/[0.06] pt-16 sm:mt-20 sm:pt-20 lg:mt-24 lg:pt-24">
            <div className="pd-contact-block relative overflow-hidden rounded-[24px] border border-black/5 bg-black px-8 py-12 text-white sm:rounded-[32px] sm:px-12 sm:py-14">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl"
                aria-hidden
              />
              <div className="relative z-[1] max-w-xl">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  Let&apos;s talk
                </p>
                <h2 className="mb-4 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                  Building something similar?
                </h2>
                <p className="mb-8 text-sm font-light leading-relaxed text-white/65 sm:text-base">
                  If you need front-end implementation, MERN-style delivery, or
                  a focused product slice, reach out from the contact section.
                </p>
                <Link
                  to="/#contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90 sm:w-auto"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Go to contact
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ============================================================ */}
      {/*  SECTION 10 — FOOTER                                         */}
      {/* ============================================================ */}
      <DetailFooter />

      <BackToTop />

      {/* Subtle radial gradient overlay */}
      <div className="pointer-events-none fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_15%,rgba(93,95,239,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_85%,rgba(0,0,0,0.035),transparent_45%)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper                                                       */
/* ------------------------------------------------------------------ */

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const { prev, next } = slug ? getProjectNeighbors(slug) : { prev: undefined, next: undefined };
  const others = PROJECTS.filter(
    (p) =>
      p.slug !== slug &&
      p.slug !== prev?.slug &&
      p.slug !== next?.slug
  ).slice(0, 2);

  if (!project || !slug) {
    return <ProjectNotFound />;
  }

  return (
    <ProjectDetailContent
      project={project}
      slug={slug}
      others={others}
      prevProject={prev}
      nextProject={next}
    />
  );
}
