/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowUpRight, Mail, Download } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { BackToTop } from "../components/BackToTop";
import { PROJECTS, getProjectBySlug, type Project } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const RESUME_HREF = "/doc/RATUL%20SAHA%20ROY_New_FS.pdf";

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
      <main
        id="main-content"
        className="px-5 pb-28 pt-28 sm:px-8 sm:pb-32 sm:pt-32 lg:px-10 xl:px-12"
      >
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
            href="/projects"
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
/*  Case study layout helpers                                          */
/* ------------------------------------------------------------------ */

function DetailMetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-neutral-200 py-4 sm:grid-cols-[minmax(0,9rem)_1fr] sm:items-start sm:gap-12 sm:py-5 lg:grid-cols-[minmax(0,11rem)_1fr]">
      <div className="text-[10px] font-bold uppercase tracking-widest text-black/45">
        {label}
      </div>
      <div className="min-w-0 text-sm font-normal leading-relaxed text-black/75 sm:text-base">
        {children}
      </div>
    </div>
  );
}

function SectionTwoCol({
  id,
  label,
  labelClassName,
  children,
}: {
  id?: string;
  label: string;
  labelClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16"
    >
      <div className="lg:col-span-3 lg:pt-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 ${labelClassName ?? ""}`}
        >
          {label}
        </p>
      </div>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main content                                                       */
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
  const rootRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const canVisit = project.link && project.link !== "#";

  /* ── GSAP animations ── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const rootEl = root;
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;

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
          ".pd-meta",
          { opacity: 0, y: 14, duration: 0.45 },
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
        const triggerEl = rootEl.querySelector(triggerSel);
        const targets = rootEl.querySelectorAll(selector);
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
      scrollReveal(".pd-meta-table", {
        opacity: 0,
        y: 24,
        duration: 0.75,
        ease: "power3.out",
      });

      scrollReveal(".pd-visit-inline", {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: "power2.out",
      });

      /* --- Case study --- */
      scrollReveal(
        ".pd-case-title",
        {
          opacity: 0,
          y: 20,
          duration: 0.55,
          stagger: 0.08,
        },
        ".pd-case-section"
      );

      scrollReveal(
        ".pd-case-block",
        {
          opacity: 0,
          y: 28,
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out",
        },
        ".pd-case-section"
      );

      scrollReveal(
        ".pd-break-figure",
        {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
        },
        ".pd-break-section"
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
      safetyTimer = setTimeout(() => {
        animatedSelectors.forEach((sel) => {
          const els = rootEl.querySelectorAll(sel);
          els.forEach((el) => {
            gsap.set(el, { clearProps: "all" });
          });
        });
      }, 3000);
    }, root);

    return () => {
      if (safetyTimer !== undefined) clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [project.slug]);

  const titleWords = project.title.split(" ");

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

      <main
        id="main-content"
        className="px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10 xl:px-12"
      >
        <div ref={rootRef} className="mx-auto max-w-6xl">

          {/* Breadcrumbs */}
          <div className="mb-8 flex flex-wrap items-center gap-3 sm:mb-10">
            <Link
              href="/projects"
              className="pd-back glass-pill inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55 transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All projects
            </Link>
            <Link
              href="/"
              className="pd-back text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 transition-colors hover:text-black/60"
            >
              Home
            </Link>
          </div>

          {/* Hero — full-width image + title overlay (theme: scrim + white type) */}
          <figure
            ref={figureRef}
            className="pd-figure relative mb-12 overflow-hidden rounded-[24px] border border-black/5 bg-black sm:mb-14 sm:rounded-[28px] lg:mb-16 lg:rounded-[32px]"
          >
            <div
              ref={imgWrapRef}
              className="relative aspect-[16/11] w-full will-change-transform sm:aspect-[21/9] lg:aspect-[2.2/1]"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-90"
                referrerPolicy="no-referrer"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <p className="pd-meta mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                {project.category}
                {project.year && project.year !== "—" ? ` · ${project.year}` : ""}
              </p>
              <h1 className="max-w-4xl font-display text-[clamp(2rem,min(7vw,10dvh),4rem)] font-extrabold leading-[0.98] tracking-tight text-white [text-wrap:normal] sm:text-[clamp(2.25rem,min(6vw,9dvh),4.5rem)]">
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
            </figcaption>
          </figure>

          <p className="pd-lead mb-10 max-w-3xl text-base font-light leading-relaxed text-[#4B5563] sm:mb-12 sm:text-lg">
            {project.description}
          </p>

          {/* Overview — narrow label / wide content + meta table */}
          <section
            id="overview"
            className="border-t border-black/[0.06] pt-14 sm:pt-16 lg:pt-20"
          >
            <SectionTwoCol
              label="Overview"
              labelClassName="pd-overview-head"
            >
              <div className="pd-copy space-y-8">
                <div className="space-y-5 text-base font-light leading-relaxed text-[#4B5563] sm:text-lg">
                  {project.overview.map((para, i) => (
                    <p key={i} className="pd-para">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="pd-meta-table border-t border-neutral-200">
                  <DetailMetaRow label="Project">{project.title}</DetailMetaRow>
                  {project.year && project.year !== "—" && (
                    <DetailMetaRow label="Year">{project.year}</DetailMetaRow>
                  )}
                  {project.role && (
                    <DetailMetaRow label="Role">{project.role}</DetailMetaRow>
                  )}
                  <DetailMetaRow label="Category">{project.category}</DetailMetaRow>
                  <DetailMetaRow label="Services">
                    {project.tags.join(" · ")}
                  </DetailMetaRow>
                  <DetailMetaRow label="Website">
                    {canVisit ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-ink underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black/50"
                      >
                        {project.link.replace(/^https?:\/\//, "")}
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-black/40">—</span>
                    )}
                  </DetailMetaRow>
                </div>

                {canVisit && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-visit-inline pd-cta inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 sm:w-auto"
                  >
                    Visit live site
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                )}
              </div>
            </SectionTwoCol>
          </section>

          {/* Full-width visual break */}
          <section className="pd-break-section mt-14 sm:mt-16 lg:mt-20">
            <figure className="pd-break-figure overflow-hidden rounded-[20px] border border-black/5 bg-muted sm:rounded-[24px] lg:rounded-[28px]">
              <div className="relative aspect-[21/9] w-full min-h-[12rem] sm:min-h-[14rem]">
                <Image
                  src={
                    project.gallery && project.gallery.length > 0
                      ? project.gallery[0].src
                      : project.image
                  }
                  alt={
                    project.gallery?.[0]?.alt
                      ? `${project.title}: ${project.gallery[0].alt}`
                      : `${project.title} case study visual`
                  }
                  fill
                  sizes="100vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>
            </figure>
          </section>

          {/* ============================================================ */}
          {/*  SECTION 4 — CASE STUDY                                      */}
          {/* ============================================================ */}
          {project.caseStudy && (
            <section
              className="pd-case-section mt-14 space-y-14 border-t border-black/[0.06] pt-14 sm:mt-16 sm:space-y-16 sm:pt-16 lg:mt-20 lg:space-y-20 lg:pt-20"
              aria-label="Strategy and solution"
            >
              <SectionTwoCol
                label="The strategy"
                labelClassName="pd-case-title pd-high-head"
              >
                <div className="pd-case-block space-y-6">
                  <p className="text-base font-light leading-relaxed text-[#4B5563] sm:text-lg">
                    {project.caseStudy.problem}
                  </p>
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="pd-high-list space-y-3 text-base font-light leading-relaxed text-[#4B5563] sm:text-lg">
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
                  )}
                </div>
              </SectionTwoCol>

              <SectionTwoCol label="The solution" labelClassName="pd-case-title">
                <div className="pd-case-block space-y-5 text-base font-light leading-relaxed text-[#4B5563] sm:text-lg">
                  <p>{project.caseStudy.approach}</p>
                  <p>{project.caseStudy.outcome}</p>
                </div>
              </SectionTwoCol>
            </section>
          )}

          {/* ============================================================ */}
          {/*  SECTION 5 — GALLERY (commented out)                         */}
          {/* ============================================================ */}
          {/*
          {galleryForGrid.length > 0 && (
            <section
              className="pd-gallery-section mt-14 border-t border-black/[0.06] pt-14 sm:mt-16 sm:pt-16 lg:mt-20 lg:pt-20"
              aria-labelledby={`${slug}-gallery-heading`}
            >
              <SectionTwoCol
                id={`${slug}-gallery-heading`}
                label="Gallery"
                labelClassName="pd-gallery-title"
              >
                <div className="pd-gallery-grid space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {galleryForGrid.slice(0, 2).map((item, gi) => (
                      <figure
                        key={`${slug}-g-${gi}`}
                        className="pd-gallery-item group overflow-hidden rounded-[18px] border border-black/5 bg-muted sm:rounded-[22px]"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.alt ?? ""}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            referrerPolicy="no-referrer"
                            onLoad={() => ScrollTrigger.refresh()}
                          />
                        </div>
                        {item.caption && (
                          <figcaption className="border-t border-black/5 px-4 py-3 text-xs font-light text-black/50 sm:text-sm">
                            {item.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                  {galleryForGrid.slice(2).map((item, gi) => (
                    <figure
                      key={`${slug}-g-rest-${gi}`}
                      className="pd-gallery-item group overflow-hidden rounded-[18px] border border-black/5 bg-muted sm:rounded-[22px]"
                    >
                      <div className="aspect-[21/10] w-full min-h-[10rem] overflow-hidden sm:min-h-[12rem]">
                        <img
                          src={item.src}
                          alt={item.alt ?? ""}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          referrerPolicy="no-referrer"
                          onLoad={() => ScrollTrigger.refresh()}
                        />
                      </div>
                      {item.caption && (
                        <figcaption className="border-t border-black/5 px-4 py-3 text-xs font-light text-black/50 sm:text-sm">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </SectionTwoCol>
            </section>
          )}
          */}

          {/* ============================================================ */}
          {/*  SECTION 6 — LINKS (commented out)                           */}
          {/* ============================================================ */}
          {/*
          {project.extraLinks && project.extraLinks.length > 0 && (
            <section
              className="pd-links-section mt-14 border-t border-black/[0.06] pt-14 sm:mt-16 sm:pt-16 lg:mt-20 lg:pt-20"
              aria-labelledby={`${slug}-links-heading`}
            >
              <SectionTwoCol
                id={`${slug}-links-heading`}
                label="Links"
                labelClassName="pd-links-title"
              >
                <ul className="pd-links-list flex max-w-full flex-col gap-0 sm:max-w-2xl">
                  {project.extraLinks.map((item) => (
                    <li
                      key={`${item.label}-${item.href}`}
                      className="border-b border-neutral-200 last:border-b-0"
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pd-link-row flex items-center justify-between gap-4 py-4 text-sm font-medium text-ink transition-colors hover:text-black/70"
                      >
                        <span>{item.label}</span>
                        <ExternalLink
                          className="h-4 w-4 shrink-0 text-black/35"
                          aria-hidden
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </SectionTwoCol>
            </section>
          )}
          */}

          {/* ============================================================ */}
          {/*  SECTION 7 — PREV / NEXT NAVIGATION (commented out)          */}
          {/* ============================================================ */}
          {/*
          {hasAnyNav && (
            <nav
              className="pd-prevnext mt-14 border-t border-black/[0.06] pt-14 sm:mt-16 sm:pt-16 lg:mt-20 lg:pt-20"
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
          */}

          {/* ============================================================ */}
          {/*  SECTION 8 — MORE WORK (max 2 projects, 2-col)              */}
          {/* ============================================================ */}
          {others.length > 0 && (
            <section
              className="pd-more-section mt-14 border-t border-black/[0.06] pt-14 sm:mt-16 sm:pt-16 lg:mt-20 lg:pt-20"
              aria-labelledby={`${slug}-more-heading`}
            >
              <h2
                id={`${slug}-more-heading`}
                className="pd-more-title mb-10 text-center font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight sm:mb-12"
              >
                More work
              </h2>
              <div className="pd-more-grid grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                {others.map((p) => (
                  <div key={p.slug} className="pd-more-card min-h-0">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group block overflow-hidden rounded-[20px] border border-black/5 bg-white transition-all duration-500 hover:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.2)] sm:rounded-[24px]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <Image
                          src={p.image}
                          alt={`${p.title} project preview`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
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
          <section className="pd-contact-section mt-14 border-t border-black/[0.06] pt-14 sm:mt-16 sm:pt-16 lg:mt-20 lg:pt-20">
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
                  href="/#contact"
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
