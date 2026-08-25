/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import type { Project } from "@/data/projects";

const TRANSITION_DURATION = "680ms";
const TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const TRANSITION_ALL = `flex ${TRANSITION_DURATION} ${TRANSITION_EASING}, opacity 400ms ease`;

/* SPECTOR-style: hover ≈ 50% / 25% / 25% width + taller active row */
const CARD_FLEX_DEFAULT = 1;
const CARD_FLEX_ACTIVE = 2;
const CARD_FLEX_SIBLING = 1;

const ROW_FLEX_DEFAULT = 1;
const ROW_FLEX_ACTIVE = 1.55;
const ROW_FLEX_INACTIVE = 0.78;

const GRID_HEIGHT_IDLE = "clamp(500px, 70vh, 760px)";
const GRID_HEIGHT_HOVER = "clamp(560px, 78vh, 860px)";

function ProjectCard({
  project,
  index,
  isActive,
  isDimmed,
  flex,
  onEnter,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  flex: number;
  onEnter: () => void;
}) {
  const number = String(index + 1).padStart(2, "0");
  const tags = project.tags.slice(0, 4);

  return (
    <div
      className="group/card relative min-w-0 overflow-hidden rounded-[6px]"
      style={{
        flex,
        transition: `${TRANSITION_ALL}, filter 500ms ease, opacity 500ms ease`,
        opacity: isDimmed ? 0.55 : 1,
        filter: isDimmed ? "saturate(0.7) brightness(0.85)" : "none",
      }}
      onMouseEnter={onEnter}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-30 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        aria-label={`View ${project.title}`}
        onFocus={onEnter}
      />

      {/* Image */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="pointer-events-none object-cover"
        style={{
          transition: `transform ${TRANSITION_DURATION} ${TRANSITION_EASING}, filter 500ms ease`,
          transform: isActive ? "scale(1.08)" : "scale(1.01)",
          filter: isActive ? "brightness(1.05)" : "brightness(0.92)",
        }}
        priority={index < 3}
      />

      {/* Idle vignette — always present, soft */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 42%), linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 40%)",
          opacity: isActive ? 0 : 1,
          transition: "opacity 400ms ease",
        }}
      />

      {/* Active cinematic scrim */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.1) 62%, transparent 100%)",
          opacity: isActive ? 1 : 0,
          transition: "opacity 450ms ease",
        }}
      />

      {/* Hover light sweep */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden
      >
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%)",
            transform: isActive ? "translateX(30%)" : "translateX(-60%)",
            transition: `transform ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
            opacity: isActive ? 1 : 0,
          }}
        />
      </div>

      {/* Inner frame */}
      <div
        className="pointer-events-none absolute inset-[6px] z-[3] rounded-[3px]"
        style={{
          border: "1px solid rgba(255,255,255,0.22)",
          opacity: isActive ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
        aria-hidden
      />

      {/* Idle index watermark */}
      <span
        className="pointer-events-none absolute left-4 top-3 z-[4] font-audiowide text-[42px] leading-none tracking-tight text-white/[0.18]"
        style={{
          opacity: isActive ? 0 : 1,
          transition: "opacity 350ms ease",
        }}
        aria-hidden
      >
        {number}
      </span>

      {/* Idle title strip — always readable, subtle */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] px-4 pb-4 pt-10"
        style={{
          opacity: isActive ? 0 : 1,
          transform: isActive ? "translateY(8px)" : "translateY(0)",
          transition: `opacity 300ms ease, transform 400ms ${TRANSITION_EASING}`,
        }}
      >
        <p className="font-anon text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
          {project.category}
        </p>
        <h3 className="mt-1 line-clamp-2 font-audiowide text-[15px] leading-snug text-white/90">
          {project.title}
        </h3>
      </div>

      {/* Active rich overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] flex flex-col justify-between p-5 sm:p-6"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 400ms ease ${isActive ? "80ms" : "0ms"}, transform 480ms ${TRANSITION_EASING} ${isActive ? "80ms" : "0ms"}`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 font-anon text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
              {project.category}
            </span>
            {project.year ? (
              <span className="font-anon text-[12px] text-white/55">{project.year}</span>
            ) : null}
          </div>
          <span className="font-audiowide text-[22px] leading-none text-white/25" aria-hidden>
            {number}
          </span>
        </div>

        <div className="max-w-[520px]">
          <h3 className="font-audiowide text-[clamp(18px,1.6vw,28px)] leading-[1.15] text-white">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 font-baumans text-[15px] leading-relaxed text-white/75 sm:text-[16px]">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/12 px-2.5 py-1 font-anon text-[11px] text-white/85 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)]">
              <ArrowDownRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ElasticGrid({ projects }: { projects: Project[] }) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeRow = activeCard !== null ? (activeCard < 3 ? 0 : 1) : null;
  const isHovering = activeCard !== null;

  const getCardFlex = useCallback(
    (index: number): number => {
      if (activeCard === null) return CARD_FLEX_DEFAULT;
      const cardRow = index < 3 ? 0 : 1;
      const hoveredRow = activeCard < 3 ? 0 : 1;
      if (cardRow !== hoveredRow) return CARD_FLEX_DEFAULT;
      if (index === activeCard) return CARD_FLEX_ACTIVE;
      return CARD_FLEX_SIBLING;
    },
    [activeCard]
  );

  const topRowFlex = activeRow === 0 ? ROW_FLEX_ACTIVE : activeRow === 1 ? ROW_FLEX_INACTIVE : ROW_FLEX_DEFAULT;
  const bottomRowFlex = activeRow === 1 ? ROW_FLEX_ACTIVE : activeRow === 0 ? ROW_FLEX_INACTIVE : ROW_FLEX_DEFAULT;

  const handleMouseLeave = useCallback(() => {
    setActiveCard(null);
  }, []);

  const topRow = projects.slice(0, 3);
  const bottomRow = projects.slice(3, 6);

  return (
    <div
      ref={gridRef}
      className="flex w-full flex-col gap-[4px] overflow-hidden"
      onMouseLeave={handleMouseLeave}
      style={{
        height: isHovering ? GRID_HEIGHT_HOVER : GRID_HEIGHT_IDLE,
        transition: `height ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    >
      {/* Top Row */}
      <div
        className="flex min-h-0 gap-[4px] overflow-hidden"
        style={{
          flex: topRowFlex,
          transition: TRANSITION_ALL,
        }}
      >
        {topRow.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            isActive={activeCard === i}
            isDimmed={isHovering && activeCard !== i}
            flex={getCardFlex(i)}
            onEnter={() => setActiveCard(i)}
          />
        ))}
      </div>

      {/* Bottom Row */}
      <div
        className="flex min-h-0 gap-[4px] overflow-hidden"
        style={{
          flex: bottomRowFlex,
          transition: TRANSITION_ALL,
        }}
      >
        {bottomRow.map((project, i) => {
          const cardIndex = i + 3;
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              index={cardIndex}
              isActive={activeCard === cardIndex}
              isDimmed={isHovering && activeCard !== cardIndex}
              flex={getCardFlex(cardIndex)}
              onEnter={() => setActiveCard(cardIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const displayProjects = projects.slice(0, 6);
  const mobileProjects = projects.slice(0, 4);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section id="projects" className="relative overflow-hidden bg-bg py-16 sm:py-20 lg:py-0">
      {/* Desktop */}
      <div className="relative hidden w-full flex-col items-center lg:flex">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-[1120px] flex-col items-center gap-4 px-10 pt-[100px] pb-10 text-center text-ink"
        >
          <h2 className="font-audiowide text-[48px] leading-[72px]">RECENT PROJECTS</h2>
          <p className="font-baumans text-[24px] leading-[36px]">
            A collection of projects where thoughtful design meets practical development - built to solve real problems, perform smoothly, and create better digital experiences.
          </p>
        </motion.div>

        {/* Elastic Accordion Grid — full viewport width */}
        <div className="w-full">
          <ElasticGrid projects={displayProjects} />
        </div>

        {/* View All button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-10"
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-full bg-accent py-4 pl-5 pr-2 transition-transform hover:scale-105"
          >
            <span className="font-anon text-[16px] font-bold text-on-accent">View All Projects</span>
            <span className="flex h-[47px] w-[47px] items-center justify-center rounded-full bg-on-accent/15">
              <ArrowDownRight className="h-5 w-5 text-on-accent" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Mobile / Tablet */}
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 sm:px-10 lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4 text-center text-ink"
        >
          <h2 className="font-audiowide text-[32px] leading-[44px] sm:text-[40px] sm:leading-[56px]">
            RECENT PROJECTS
          </h2>
          <p className="font-baumans text-[18px] leading-[28px] sm:text-[20px] sm:leading-[32px]">
            A collection of projects where thoughtful design meets practical development.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {mobileProjects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative h-[240px] overflow-hidden rounded-lg bg-card sm:h-[280px]"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <span
                className="absolute left-3 top-2 font-audiowide text-[28px] leading-none text-white/20"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-anon text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
                  {project.category}
                </p>
                <h3 className="mt-1 line-clamp-2 font-audiowide text-[15px] leading-snug text-white sm:text-[16px]">
                  {project.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/15 px-2 py-0.5 font-anon text-[10px] text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-full bg-accent py-3 pl-5 pr-2 transition-transform hover:scale-105"
          >
            <span className="font-anon text-[14px] font-bold text-on-accent">View All Projects</span>
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-on-accent/15">
              <ArrowDownRight className="h-4 w-4 text-on-accent" />
            </span>
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
