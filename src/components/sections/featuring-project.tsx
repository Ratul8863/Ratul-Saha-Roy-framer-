"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { featuredProjects } from "@/constants/projects";
import { cn } from "@/lib/utils";
import { scrollToY } from "@/providers/smooth-scroll-provider";
import {
  CARD_BLUR,
  CARD_LOCAL,
  CARD_OPACITY,
  CARD_ROTATE_X,
  CARD_ROTATE_Y,
  CARD_ROTATE_Z,
  CARD_SCALE,
  CARD_X,
  CARD_Y,
  DEFAULT_FEATURED_INDEX,
  FRAME_TOP,
  FRAME_WIDTH,
  LIST_TRANSITION,
  META_TRANSITION,
  NUMBER_TRANSITION,
  SCROLL_SPRING,
  listOpacityForDistance,
} from "@/components/sections/featuring-motion";

const projects = featuredProjects;
const LAST = Math.max(1, projects.length - 1);

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function FeaturingProject() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(DEFAULT_FEATURED_INDEX);
  const rawIndex = useMotionValue(DEFAULT_FEATURED_INDEX);
  const floatIndex = useSpring(rawIndex, SCROLL_SPRING);

  useEffect(() => {
    if (reduceMotion) return;

    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.offsetHeight - window.innerHeight;
      if (max <= 0) return;
      const scrolled = Math.min(max, Math.max(0, -el.getBoundingClientRect().top));
      const float = (scrolled / max) * LAST;
      rawIndex.set(float);
      const next = Math.min(LAST, Math.max(0, Math.round(float)));
      setActiveIndex((current) => (current === next ? current : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [rawIndex, reduceMotion]);

  const active = projects[activeIndex] ?? projects[DEFAULT_FEATURED_INDEX];

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const absoluteTop = window.scrollY + el.getBoundingClientRect().top;
    const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
    scrollToY(absoluteTop + (index / LAST) * maxScroll);
  };

  if (reduceMotion) {
    return <StaticFeaturing />;
  }

  return (
    <div
      ref={trackRef}
      data-featuring-track
      className="relative"
      style={{ height: `${Math.max(projects.length, 2) * 140}vh` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-x-clip bg-white">
        <SectionContainer
          id="projects"
          className="relative flex h-full w-full flex-col pt-4 md:pt-5"
        >
          <h2 className="relative z-50 shrink-0 font-display text-[clamp(2.5rem,8vw,7rem)] uppercase leading-none text-navy">
            Featuring Project
          </h2>

          <div
            className="relative mt-2 hidden min-h-0 flex-1 xl:block"
            style={{ perspective: "1500px", perspectiveOrigin: "50% 42%" }}
          >
            <NumberCounter index={activeIndex} />

            {/* Cards move under / into the fixed frame */}
            <div
              className="absolute inset-0 z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              {projects.map((project, index) => (
                <StackCard
                  key={project.slug}
                  project={project}
                  index={index}
                  floatIndex={floatIndex}
                />
              ))}
            </div>

            {/* Fixed navy window — images straighten to fit this frame */}
            <FixedFrame />

            <MetaPanel active={active} />
            <ProjectList activeIndex={activeIndex} onSelect={scrollToIndex} />
          </div>

          <div className="mt-6 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto xl:hidden">
            <MobileStage
              active={active}
              activeIndex={activeIndex}
              floatIndex={floatIndex}
            />
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}

/** Always-on Figma frame. Cards align into this box when local === 0. */
function FixedFrame() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 z-30 aspect-[5/4] -translate-x-1/2 border-[10px] border-navy"
      style={{ top: FRAME_TOP, width: FRAME_WIDTH }}
      aria-hidden
    />
  );
}

/**
 * Flat image card: tilted above/below, straight when locked in the frame.
 */
function StackCard({
  project,
  index,
  floatIndex,
}: {
  project: (typeof projects)[number];
  index: number;
  floatIndex: MotionValue<number>;
}) {
  const local = useTransform(floatIndex, (v) => v - index);
  const stops = [...CARD_LOCAL];

  const y = useTransform(local, stops, [...CARD_Y]);
  const xShift = useTransform(local, stops, [...CARD_X]);
  const x = useTransform(xShift, (v) => `calc(-50% + ${v}px)`);
  const rotateX = useTransform(local, stops, [...CARD_ROTATE_X]);
  const rotateY = useTransform(local, stops, [...CARD_ROTATE_Y]);
  const rotateZ = useTransform(local, stops, [...CARD_ROTATE_Z]);
  const scale = useTransform(local, stops, [...CARD_SCALE]);
  const opacity = useTransform(local, stops, [...CARD_OPACITY]);
  const blur = useTransform(local, stops, [...CARD_BLUR]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  const zIndex = useTransform(local, (v) => {
    const dist = Math.abs(v);
    // Incoming slightly above exiting; center highest under the frame ring
    const bias = v < 0 ? 2 : v > 0.15 ? -2 : 4;
    return Math.round(24 - dist * 8 + bias);
  });

  return (
    <motion.div
      className="absolute left-1/2 aspect-[5/4] will-change-transform"
      style={{
        top: FRAME_TOP,
        width: FRAME_WIDTH,
        y,
        x,
        rotateX,
        rotateY,
        rotateZ,
        scale,
        opacity,
        filter,
        zIndex,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative h-full w-full overflow-hidden bg-white shadow-[0_22px_55px_rgba(0,32,69,0.12)]">
        <Image
          src={project.coverImage}
          alt={project.projectName}
          fill
          sizes="40vw"
          className="object-cover object-top"
          priority={index <= 3}
        />
      </div>
    </motion.div>
  );
}

function MetaPanel({ active }: { active: (typeof projects)[number] }) {
  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{ left: "0%", top: "14%", width: "24%" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
          transition={META_TRANSITION}
          className="flex gap-8 font-body text-base leading-5"
        >
          <div className="flex gap-6">
            <p className="shrink-0 text-text-dim">Role</p>
            <div className="flex flex-col gap-1 text-navy-dark">
              {active.role.map((role) => (
                <p key={role}>{role}</p>
              ))}
            </div>
          </div>
          <div className="flex gap-6 whitespace-nowrap">
            <p className="shrink-0 text-text-dim">Project</p>
            <p className="font-ui text-navy-dark">{active.projectName}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NumberCounter({ index }: { index: number }) {
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{ left: "2%", top: "52%" }}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="font-display leading-none text-black"
          style={{ fontSize: "clamp(5.5rem, 14vw, 11rem)" }}
          initial={{ y: "70%", opacity: 0, filter: "blur(12px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(12px)" }}
          transition={NUMBER_TRANSITION}
        >
          {padIndex(index)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function ProjectList({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const translateY = useMemo(() => {
    const itemH = 104;
    return 160 - activeIndex * itemH;
  }, [activeIndex]);

  return (
    <div
      className="absolute z-40 overflow-hidden"
      style={{ left: "72%", top: "6%", width: "28%", height: "88%" }}
    >
      <motion.ul
        className="flex flex-col gap-9"
        animate={{ y: translateY }}
        transition={LIST_TRANSITION}
      >
        {projects.map((project, index) => {
          const distance = Math.abs(index - activeIndex);
          return (
            <motion.li
              key={project.slug}
              animate={{ opacity: listOpacityForDistance(distance) }}
              transition={LIST_TRANSITION}
            >
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                <p className="font-ui text-[clamp(1.05rem,1.3vw,1.35rem)] leading-7 text-navy-dark">
                  {project.title}
                </p>
                <p className="mt-1.5 font-body text-sm leading-6 text-navy-dark md:text-[15px]">
                  {project.description}
                </p>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

function MobileStage({
  active,
  activeIndex,
  floatIndex,
}: {
  active: (typeof projects)[number];
  activeIndex: number;
  floatIndex: MotionValue<number>;
}) {
  return (
    <>
      <div className="relative mx-auto h-[46vh] w-full max-w-md">
        <div className="pointer-events-none absolute inset-0 z-20 border-8 border-navy" />
        <div className="relative h-full overflow-hidden" style={{ perspective: "1100px" }}>
          {projects.map((project, index) => (
            <MobileCard
              key={project.slug}
              project={project}
              index={index}
              floatIndex={floatIndex}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={META_TRANSITION}
          className="space-y-4"
        >
          <div className="flex flex-wrap gap-8 font-body text-base">
            <div className="flex gap-6">
              <p className="text-text-dim">Role</p>
              <div className="text-navy-dark">
                {active.role.map((role) => (
                  <p key={role}>{role}</p>
                ))}
              </div>
            </div>
            <div className="flex gap-6">
              <p className="text-text-dim">Project</p>
              <p className="font-ui text-navy-dark">{active.projectName}</p>
            </div>
          </div>
          <p className="font-display text-6xl text-black">{padIndex(activeIndex)}</p>
        </motion.div>
      </AnimatePresence>

      <ul className="flex flex-col gap-5 pb-10">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            className={cn(index === activeIndex ? "opacity-100" : "opacity-20")}
          >
            <Link href={`/projects/${project.slug}`} className="block">
              <p className="font-ui text-xl text-navy-dark">{project.title}</p>
              <p className="mt-1 font-body text-sm text-navy-dark">
                {project.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function MobileCard({
  project,
  index,
  floatIndex,
}: {
  project: (typeof projects)[number];
  index: number;
  floatIndex: MotionValue<number>;
}) {
  const local = useTransform(floatIndex, (v) => v - index);
  const y = useTransform(local, [-1, 0, 1], ["100%", "0%", "-100%"]);
  const rotateY = useTransform(local, [-1, 0, 1], [-8, 0, 18]);
  const opacity = useTransform(local, [-1, -0.2, 0, 0.2, 1], [0.25, 0.85, 1, 0.85, 0.25]);
  const zIndex = useTransform(local, (v) => Math.round(16 - Math.abs(v) * 8));

  return (
    <motion.div
      className="absolute inset-0 bg-white will-change-transform"
      style={{ y, rotateY, opacity, zIndex, transformOrigin: "50% 55%" }}
    >
      <Image
        src={project.coverImage}
        alt={project.projectName}
        fill
        sizes="100vw"
        className="object-cover object-top"
      />
    </motion.div>
  );
}

function StaticFeaturing() {
  const active = projects.find((p) => p.active) ?? projects[DEFAULT_FEATURED_INDEX];

  return (
    <SectionContainer id="projects" className="py-16">
      <h2 className="font-display text-[clamp(3rem,10vw,8rem)] uppercase leading-none text-navy">
        Featuring Project
      </h2>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
        <div>
          <p className="text-text-dim">Role</p>
          {active.role.map((role) => (
            <p key={role} className="text-navy-dark">
              {role}
            </p>
          ))}
          <p className="mt-4 text-text-dim">Project</p>
          <p className="font-ui text-navy-dark">{active.projectName}</p>
          <p className="mt-8 font-display text-7xl">03</p>
        </div>
        <div className="relative aspect-[5/4] border-[10px] border-navy">
          <Image
            src={active.coverImage}
            alt={active.projectName}
            fill
            className="object-cover object-top"
          />
        </div>
        <ul className="space-y-6">
          {projects.map((project) => (
            <li
              key={project.slug}
              className={project.active ? "opacity-100" : "opacity-20"}
            >
              <Link href={`/projects/${project.slug}`}>
                <p className="font-ui text-xl">{project.title}</p>
                <p className="mt-1 text-sm">{project.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
