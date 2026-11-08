"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import {
  playgroundIntro,
  playgroundProjects,
} from "@/constants/projects";
import { cn } from "@/lib/utils";

export function PlaygroundSection() {
  const reduceMotion = useReducedMotion();
  const columns = [1, 2, 3, 4] as const;

  return (
    <SectionContainer className="py-16 md:py-24">
      <ScrollReveal>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="font-display text-[clamp(3.5rem,12vw,12.5rem)] uppercase leading-none text-navy">
            Play
            <br />
            Ground
          </h2>
          <p className="max-w-[714px] font-body text-[clamp(1.125rem,2vw,2rem)] leading-[1.3] text-text">
            {playgroundIntro}
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-[60px] grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-10">
        {columns.map((column) => (
          <div
            key={column}
            className={cn(
              "flex flex-col gap-[100px]",
              column === 2 && "xl:mt-20",
              column === 3 && "xl:mt-5",
              column === 4 && "xl:mt-10"
            )}
          >
            {playgroundProjects
              .filter((project) => project.column === column)
              .map((project) => (
                <motion.div
                  key={project.slug}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                  >
                    <div
                      className="relative w-full bg-gray"
                      style={{
                        height: project.height,
                        maxHeight: "48vw",
                        minHeight: 180,
                      }}
                    >
                      {project.slug === "fogbox" ? (
                        <span className="absolute left-1/2 top-[51%] flex size-[96px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy font-ui text-2xl text-white md:size-[120px]">
                          View
                        </span>
                      ) : null}
                    </div>
                    <p className="font-ui text-2xl leading-8 text-text">
                      {project.title}
                    </p>
                  </Link>
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
