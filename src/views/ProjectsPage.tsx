/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Projects archive — Figma 3rd-version theme (same card chrome as Achievements).
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { PROJECTS, type Project } from "../data/projects";
import { LandingHeader } from "../components/landing/LandingHeader";
import { BackToTop } from "../components/BackToTop";

function ProjectArchiveCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");
  const canVisit = Boolean(project.link && project.link !== "#");
  const highlights = [
    project.category,
    ...project.tags.slice(0, 2),
  ].filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.06, 0.36),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border-[5px] border-solid border-ink bg-card text-ink"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-[2]"
        aria-label={`View ${project.title} case study`}
      />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-3.5 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-3 font-audiowide text-[22px] leading-[1.2] sm:text-[26px] xl:text-[28px]">
              <h2 className="min-w-0 flex-1 line-clamp-2">{project.title}</h2>
              <span className="shrink-0 tabular-nums">/{number}</span>
            </div>
            <div className="h-1 w-[100px] rounded-full bg-ink" />
          </div>

          <p className="line-clamp-3 font-baumans text-[16px] leading-[1.55] text-ink sm:text-[18px] sm:leading-[1.55]">
            {project.description}
          </p>
        </div>

        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-surface">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
        </div>

        <ul className="mt-auto flex flex-col gap-2">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 sm:gap-4">
              <Plus className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2.5} aria-hidden />
              <span className="min-w-0 truncate font-baumans text-[14px] leading-[1.4] sm:text-[16px]">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="pointer-events-none relative z-[3] flex items-center justify-between gap-3 pt-1">
          <span className="font-anon text-[12px] font-bold uppercase tracking-wider text-muted">
            Case study →
          </span>
          {canVisit ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink bg-bg text-ink transition-colors hover:bg-accent hover:text-on-accent hover:border-accent"
              aria-label={`Open ${project.title} live site`}
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowUpRight className="h-5 w-5" />
            </a>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-dashed border-ink/25 text-ink/30">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-ink">
      <LandingHeader projectCount={PROJECTS.length} />

      <div
        className="pointer-events-none absolute inset-y-0 left-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />

      <main
        id="main-content"
        className="relative mx-auto w-full max-w-[1440px] px-5 pb-24 pt-28 sm:px-10 sm:pt-32 lg:px-[100px] lg:pb-28 lg:pt-36"
      >
        <motion.header
          className="mb-12 flex flex-col items-center text-center sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 font-anon text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-accent hover:text-on-accent hover:border-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back home
          </Link>
          <h1 className="mb-4 font-audiowide text-[clamp(2.25rem,6vw,3rem)] leading-[1.15] text-ink sm:text-[48px] sm:leading-[72px]">
            PROJECTS
          </h1>
          <p className="max-w-[34ch] font-baumans text-[17px] leading-[1.5] text-ink sm:max-w-xl sm:text-[24px] sm:leading-[36px]">
            Live sites, full-stack builds, and experiments from the MERN journey.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          {PROJECTS.map((project, i) => (
            <ProjectArchiveCard
              key={project.slug}
              project={project}
              index={i}
            />
          ))}
        </div>
      </main>

      <BackToTop />
    </div>
  );
}
