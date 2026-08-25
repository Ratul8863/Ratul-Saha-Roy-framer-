/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { SKILLS } from "./landingData";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function AccordionItem({
  skill,
  index,
  isOpen,
  onOpen,
  dense = false,
}: {
  skill: (typeof SKILLS)[number];
  index: number;
  isOpen: boolean;
  onOpen: () => void;
  dense?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`flex flex-col ${dense ? "gap-4" : "gap-6"}`}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: 0.08 * index, ease: EASE }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between text-left ${
          dense ? "gap-3" : ""
        }`}
      >
        <span
          className={`font-baumans transition-colors duration-300 ${
            dense
              ? "min-w-0 flex-1 pr-1 text-[17px] leading-[28px] sm:text-[20px] sm:leading-[30px]"
              : "text-[24px] leading-[36px]"
          } ${isOpen ? "text-ink" : "text-muted"}`}
        >
          {index + 1}. {skill.name}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="shrink-0"
        >
          <ChevronDown
            className={`text-ink ${dense ? "h-5 w-5" : "h-6 w-6"}`}
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={
              reduceMotion
                ? { opacity: 1, height: "auto" }
                : { height: 0, opacity: 0 }
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0, height: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className={`font-baumans text-ink ${
                dense
                  ? "pb-1 text-[16px] leading-[28px] sm:text-[18px] sm:leading-[30px]"
                  : "pb-1 text-[20px] leading-[36px] text-justify"
              }`}
            >
              {skill.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="h-px w-full origin-left bg-ink/10"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.12 + 0.08 * index, ease: EASE }}
      />
    </motion.div>
  );
}

function SkillArt({
  skill,
  className,
  sizes,
}: {
  skill: (typeof SKILLS)[number];
  className: string;
  sizes: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 36, rotate: 2 }}
      whileInView={
        reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }
      }
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -4,
                rotate: -1.5,
                scale: 1.015,
                transition: { type: "spring", stiffness: 240, damping: 18 },
              }
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={skill.image}
            className="absolute inset-0 overflow-hidden rounded-[inherit]"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 1.05, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, filter: "blur(3px)" }
            }
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Image
              src={skill.image}
              alt={skill.name}
              fill
              sizes={sizes}
              className="float-slot-art object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function WhatCanIDoSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const active = SKILLS[Math.max(0, openIndex)] ?? SKILLS[0];
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg py-16 sm:py-20 lg:py-0">
      <div
        className="pointer-events-none absolute inset-y-0 left-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[80px] hidden w-px bg-ink/10 lg:block"
        aria-hidden
      />

      {/* Desktop */}
      <div className="relative mx-auto hidden h-[976px] w-full max-w-[1440px] lg:block">
        <div className="absolute left-[111px] top-[100px] flex w-[689px] flex-col gap-10">
          <div className="flex flex-col gap-4 text-ink">
            <motion.h2
              className="font-audiowide text-[48px] leading-[72px]"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              WHAT CAN I DO?
            </motion.h2>
            <motion.p
              className="font-baumans text-[24px] leading-[36px] text-justify"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            >
              Three ways I help teams and my own projects: solid front-end
              implementation, MERN-style full stack delivery, and clean
              integration between apps, APIs, and data stores.
            </motion.p>
          </div>

          <div className="flex flex-col gap-10 p-4">
            {SKILLS.map((skill, i) => (
              <AccordionItem
                key={skill.name}
                skill={skill}
                index={i}
                isOpen={openIndex === i}
                onOpen={() => setOpenIndex(i)}
              />
            ))}
          </div>
        </div>

        <div
          data-float-slot="services"
          data-float-image={active.image}
          className="absolute right-[160px] top-[250px]"
        >
          <SkillArt
            skill={active}
            sizes="360px"
            className="relative h-[460px] w-[360px] overflow-hidden rounded-lg shadow-[10px_10px_10px_0px_rgba(31,29,29,0.2)]"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 sm:px-10 lg:hidden">
        <div className="flex flex-col gap-4 text-ink">
          <motion.h2
            className="font-audiowide text-[32px] leading-[48px] sm:text-[40px] sm:leading-[56px]"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            WHAT CAN I DO?
          </motion.h2>
          <motion.p
            className="font-baumans text-[18px] leading-[30px] sm:text-[20px] sm:leading-[36px]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
          >
            Three ways I help teams and my own projects: solid front-end
            implementation, MERN-style full stack delivery, and clean
            integration between apps, APIs, and data stores.
          </motion.p>
        </div>

        <div className="flex flex-col gap-6">
          {SKILLS.map((skill, i) => (
            <AccordionItem
              key={skill.name}
              skill={skill}
              index={i}
              isOpen={openIndex === i}
              onOpen={() => setOpenIndex(i)}
              dense
            />
          ))}
        </div>

        <SkillArt
          skill={active}
          sizes="(max-width: 640px) 100vw, 360px"
          className="relative mx-auto h-[300px] w-full max-w-[360px] overflow-hidden rounded-lg shadow-[10px_10px_10px_0px_rgba(31,29,29,0.2)] sm:h-[400px]"
        />
      </div>
    </section>
  );
}
