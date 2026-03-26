/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { PROJECTS, type Project } from "../data/projects";
import { Navbar } from "../components/Navbar";
import { BackToTop } from "../components/BackToTop";

function TiltProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.55 });
  const springY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.55 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-16, 16]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const canVisit = project.link && project.link !== "#";

  return (
    <motion.article
      className="min-h-0 [perspective:1400px]"
      initial={{ opacity: 0, y: 72, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.11,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        className="relative h-full rounded-[28px] sm:rounded-[36px] border border-black/10 bg-white overflow-hidden shadow-[0_28px_90px_-32px_rgba(0,0,0,0.18)] group/card"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(93,95,239,0.12) 0%, transparent 45%, rgba(0,0,0,0.04) 100%)",
            transform: "translateZ(1px)",
          }}
        />

        <div
          className="aspect-[16/10] overflow-hidden bg-muted"
          style={{
            transform: "translateZ(42px)",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover grayscale group-hover/card:grayscale-0"
            referrerPolicy="no-referrer"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70"
            style={{ transform: "translateZ(2px)" }}
          />
        </div>

        <div
          className="relative space-y-4 p-6 sm:p-8"
          style={{
            transform: "translateZ(56px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-accent">
                {project.category}
              </span>
              <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {project.title}
              </h2>
            </div>
            {canVisit ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 text-ink transition-colors hover:bg-black hover:text-white"
                aria-label={`Open ${project.title}`}
              >
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover/card:rotate-45" />
              </a>
            ) : (
              <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-black/15 text-black/30">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            )}
          </div>
          <p className="text-sm font-light leading-relaxed text-black/55 sm:text-base">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/8 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-3xl"
          style={{ transform: "translateZ(20px)" }}
        />
      </motion.div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-ink">
      <Navbar />

      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-32 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.header
            className="mb-14 sm:mb-20 lg:mb-24"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              className="glass-pill mb-8 inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55 transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back home
            </Link>
            <h1 className="mb-5 max-w-4xl font-display text-[clamp(2.5rem,min(11vw,16dvh),6.25rem)] font-extrabold leading-[0.92] tracking-tight">
              Project <span className="text-accent">Archive</span>
            </h1>
            <p className="max-w-2xl text-base font-light leading-relaxed text-black/50 sm:text-lg">
              Every build here is part of my MERN journey—live sites, full-stack apps,
              and experiments. Hover cards for a 3D tilt; open the arrow when a public
              link is available.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
            {PROJECTS.map((project, i) => (
              <div key={project.title} className="min-h-0">
                <TiltProjectCard project={project} index={i} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <BackToTop />

      <div className="pointer-events-none fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(93,95,239,0.07),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.04),transparent_50%)]" />
        <motion.div
          className="absolute left-[-20%] top-[15%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-accent/[0.09] blur-[100px]"
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-15%] h-[min(60vw,420px)] w-[min(60vw,420px)] rounded-full bg-black/[0.04] blur-[90px]"
          animate={{ x: [0, -20, 0], y: [0, 14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
