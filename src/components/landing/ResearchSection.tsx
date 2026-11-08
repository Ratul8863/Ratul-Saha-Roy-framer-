"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RESEARCH_ITEMS } from "./landingData";

const ease = [0.22, 1, 0.36, 1] as const;

export function ResearchSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const wheelUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = RESEARCH_ITEMS[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const frameIsPinned = () => {
      const section = sectionRef.current;
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
    };

    const canChangeStage = (direction: number) => {
      const currentIndex = activeIndexRef.current;
      return !(
        (currentIndex === 0 && direction < 0) ||
        (currentIndex === RESEARCH_ITEMS.length - 1 && direction > 0)
      );
    };

    const changeStage = (direction: number) => {
      if (wheelLockedRef.current || !canChangeStage(direction)) return;

      const nextIndex = activeIndexRef.current + direction;
      wheelLockedRef.current = true;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      wheelUnlockTimerRef.current = setTimeout(() => {
        wheelLockedRef.current = false;
      }, 560);
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8 || !frameIsPinned()) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      if (!canChangeStage(direction)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      changeStage(direction);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;
      if (startY === null || currentY === undefined || !frameIsPinned()) return;

      const delta = startY - currentY;
      if (Math.abs(delta) < 8) return;
      const direction = delta > 0 ? 1 : -1;

      if (wheelLockedRef.current || canChangeStage(direction)) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;
      if (startY === null || endY === undefined || !frameIsPinned()) return;

      const delta = startY - endY;
      if (Math.abs(delta) < 42) return;
      const direction = delta > 0 ? 1 : -1;
      if (!canChangeStage(direction)) return;

      event.preventDefault();
      changeStage(direction);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    const section = sectionRef.current;
    section?.addEventListener("touchstart", handleTouchStart, { passive: true });
    section?.addEventListener("touchmove", handleTouchMove, { passive: false });
    section?.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      section?.removeEventListener("touchstart", handleTouchStart);
      section?.removeEventListener("touchmove", handleTouchMove);
      section?.removeEventListener("touchend", handleTouchEnd);
      if (wheelUnlockTimerRef.current) {
        clearTimeout(wheelUnlockTimerRef.current);
      }
    };
  }, []);

  const selectTopic = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  const tags = activeItem.focus
    .split("·")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="research"
      className="relative h-[130svh] scroll-mt-0 bg-bg"
    >
      <div className="sticky top-0 flex h-svh min-h-0 items-center overflow-hidden pb-3 pt-[76px] sm:pb-6 sm:pt-[76px] lg:py-4">
      <div className="relative mx-auto w-full max-w-[1328px] px-4 sm:px-6">
        <motion.div
          className="mx-auto flex max-w-[968px] flex-col items-center gap-2 text-center text-ink sm:gap-3 lg:gap-4"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="font-audiowide text-[26px] leading-[1.2] sm:text-[36px] lg:text-[48px] lg:leading-[72px]">
            AI, DATA &amp; RESEARCH
          </h2>
          <p className="font-baumans text-[15px] leading-[1.35] sm:text-[18px] sm:leading-[1.45] lg:text-[24px] lg:leading-[36px] [@media(max-width:767px)_and_(max-height:700px)]:hidden">
            Interests beyond application development — Artificial Intelligence,
            Machine Learning, environmental data, and computational research.
          </p>
        </motion.div>

        <motion.div
          className="mt-3 grid h-[calc(100svh-212px)] min-h-0 grid-rows-[minmax(0,1.45fr)_minmax(150px,1fr)] overflow-hidden rounded-xl bg-[#1a1a1a] sm:mt-5 sm:h-[calc(100svh-220px)] sm:rounded-2xl lg:mt-[30px] lg:h-[min(709px,calc(100svh-200px))] lg:grid-cols-[57.66%_42.34%] lg:grid-rows-none [@media(max-width:767px)_and_(max-height:700px)]:h-[calc(100svh-140px)] [@media(max-width:767px)_and_(max-height:700px)]:grid-rows-[minmax(0,2fr)_minmax(140px,1fr)]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="relative flex min-h-0 min-w-0 flex-col px-4 py-3 text-[#f5f5f5] sm:px-5 sm:py-4 lg:px-6 lg:py-[30px] [@media(min-width:1024px)_and_(max-height:700px)]:py-4">
            <div
              role="tablist"
              aria-label="Research topics"
              className="flex flex-wrap gap-x-3 gap-y-1 font-audiowide text-[12px] sm:text-[15px] lg:flex-col lg:items-start lg:gap-1 lg:text-[20px] [@media(min-width:1024px)_and_(max-height:700px)]:gap-0 [@media(min-width:1024px)_and_(max-height:700px)]:text-[14px]"
            >
              {RESEARCH_ITEMS.map((item, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={item.category}
                    id={`research-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="research-panel"
                    onClick={() => selectTopic(index)}
                    className={`cursor-pointer text-left leading-5 transition-colors duration-300 lg:leading-[1.45] [@media(min-width:1024px)_and_(max-height:700px)]:leading-5 ${
                      selected
                        ? "text-[#96ff88]"
                        : "text-[#f5f5f5] hover:text-[#96ff88]"
                    }`}
                  >
                    {selected ? "– " : ""}
                    {item.category}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeItem.category}
                id="research-panel"
                role="tabpanel"
                aria-labelledby={`research-tab-${activeIndex}`}
                className="flex min-h-0 flex-1 flex-col pt-3 sm:pt-5 lg:pt-[92px] [@media(min-width:1024px)_and_(max-height:700px)]:pt-4"
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 56, filter: "blur(6px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: -28, filter: "blur(4px)" }
                }
                transition={{
                  y: { type: "spring", stiffness: 150, damping: 24, mass: 0.7 },
                  opacity: { duration: 0.22, ease },
                  filter: { duration: 0.28, ease },
                }}
              >
                <p className="font-audiowide text-[18px] leading-6 text-[#888] sm:text-[22px] sm:leading-7 lg:text-[30px] lg:leading-[40px] [@media(min-width:1024px)_and_(max-height:700px)]:text-[22px] [@media(min-width:1024px)_and_(max-height:700px)]:leading-7">
                  {String(activeIndex + 1).padStart(2, "0")}
                </p>
                <div className="mt-1 flex flex-col gap-1 sm:mt-2 sm:gap-2 lg:mt-6 lg:gap-4 [@media(min-width:1024px)_and_(max-height:700px)]:mt-2 [@media(min-width:1024px)_and_(max-height:700px)]:gap-2">
                  <h3 className="max-w-[660px] font-audiowide text-[18px] font-normal leading-[22px] tracking-normal text-white sm:text-[22px] sm:leading-[28px] lg:text-[30px] lg:leading-[40px] [@media(max-width:767px)_and_(max-height:700px)]:text-[17px] [@media(max-width:767px)_and_(max-height:700px)]:leading-[21px] [@media(min-width:1024px)_and_(max-height:700px)]:text-[20px] [@media(min-width:1024px)_and_(max-height:700px)]:leading-[26px]">
                    {activeItem.title}
                  </h3>
                  <p className="max-w-[660px] font-anon text-[13px] leading-[18px] text-white sm:text-[14px] sm:leading-5 lg:text-[18px] lg:leading-[28px] [@media(max-width:767px)_and_(max-height:700px)]:text-[12px] [@media(max-width:767px)_and_(max-height:700px)]:leading-[17px] [@media(min-width:1024px)_and_(max-height:700px)]:text-[14px] [@media(min-width:1024px)_and_(max-height:700px)]:leading-5">
                    {activeItem.body}
                  </p>
                </div>

                <div className="mt-auto pt-2 font-anon text-[11px] sm:pt-3 sm:text-[12px] lg:pt-10 lg:text-[14px] [@media(min-width:1024px)_and_(max-height:700px)]:pt-3 [@media(min-width:1024px)_and_(max-height:700px)]:text-[12px]">
                  <div className="flex items-center justify-between border-y border-white/10 py-1.5 sm:py-2 lg:py-4 [@media(min-width:1024px)_and_(max-height:700px)]:py-2">
                    <span className="text-[#888]">Year</span>
                    <span className="font-bold text-white">{activeItem.year}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 py-1.5 sm:py-2 lg:py-4 [@media(min-width:1024px)_and_(max-height:700px)]:py-2">
                    <span className="text-[#888]">Tags</span>
                    <div className="flex flex-wrap justify-end gap-1 sm:gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#888] px-2 py-0.5 text-[9px] font-bold leading-none text-white sm:text-[11px] lg:px-3 lg:py-1 lg:text-[13px] [@media(min-width:1024px)_and_(max-height:700px)]:text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative min-h-0 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeItem.image}
                className="absolute inset-0"
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 72,
                        scale: 1.03,
                        clipPath: "inset(100% 0 0 0)",
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  clipPath: "inset(0% 0 0 0)",
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -34,
                        scale: 1.01,
                        clipPath: "inset(0 0 100% 0)",
                      }
                }
                transition={{
                  y: { type: "spring", stiffness: 140, damping: 24, mass: 0.75 },
                  scale: { duration: 0.44, ease },
                  opacity: { duration: 0.24, ease },
                  clipPath: { duration: 0.38, ease },
                }}
              >
                <Image
                  src={activeItem.image}
                  alt={`${activeItem.category} research visual`}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                  priority={activeIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
