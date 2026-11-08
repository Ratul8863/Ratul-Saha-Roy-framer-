/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import {
  BrainCircuit,
  Clock3,
  Code2,
  Crown,
  Database,
  MessagesSquare,
  Mic2,
  Palette,
  PanelsTopLeft,
  Puzzle,
  RefreshCw,
  Satellite,
  ServerCog,
  Users,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  TECH_CATEGORIES,
  TECH_STACK,
  type TechStackItem,
} from "./landingData";

const FILTERS = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "Data & Cloud",
  "AI/ML",
  "Research Tool",
  "DevOps & Tools",
  "Design",
  "Soft Skills",
] as const;
type TechFilter = (typeof FILTERS)[number];
type TechCategoryFilter = Exclude<TechFilter, "All">;

type FanItem = {
  name: string;
  icon?: string;
  glyph?: LucideIcon;
  category: TechCategoryFilter;
};

const CATEGORY_TITLES: Record<TechCategoryFilter, string> = {
  Languages: "Languages",
  Frontend: "Frontend",
  Backend: "Backend",
  "Data & Cloud": "Data & Cloud",
  "AI/ML": "AI / ML",
  "Research Tool": "Research tools",
  "DevOps & Tools": "DevOps & tools",
  Design: "Design",
  "Soft Skills": "Soft Skills",
};

const CATEGORY_ICONS: Record<TechCategoryFilter, LucideIcon> = {
  Languages: Code2,
  Frontend: PanelsTopLeft,
  Backend: ServerCog,
  "Data & Cloud": Database,
  "AI/ML": BrainCircuit,
  "Research Tool": Satellite,
  "DevOps & Tools": Wrench,
  Design: Palette,
  "Soft Skills": Users,
};

const SKILL_ICONS: Record<string, LucideIcon> = {
  "Problem Solving": Puzzle,
  Teamwork: UsersRound,
  "Public Speaking": Mic2,
  Leadership: Crown,
  Debating: MessagesSquare,
  "Time Management": Clock3,
  Adaptability: RefreshCw,
};

const BRAND_ICONS: Record<string, string> = {
  JavaScript: "/landing/stack-icons/javascript.svg",
  Python: "/landing/stack-icons/python.svg",
  C: "/landing/stack-icons/c.svg",
  "C++": "/landing/stack-icons/cplusplus.svg",
  Java: "/landing/stack-icons/java.svg",
  TypeScript: "/landing/stack-icons/typescript.svg",
  "React.js": "/landing/stack-icons/react.svg",
  "Next.js": "/landing/stack-icons/nextjs.svg",
  HTML5: "/landing/stack-icons/html5.svg",
  CSS3: "/landing/stack-icons/css3.svg",
  "Tailwind CSS": "/landing/stack-icons/tailwindcss.svg",
  Redux: "/landing/stack-icons/redux.svg",
  "Framer Motion": "/landing/stack-icons/framer.svg",
  Recharts: "/landing/stack-icons/recharts.svg",
  "Node.js": "/landing/stack-icons/nodejs.svg",
  "Express.js": "/landing/stack-icons/express.svg",
  JWT: "/landing/stack-icons/jwt.svg",
  MongoDB: "/landing/stack-icons/mongodb.svg",
  MySQL: "/landing/stack-icons/mysql.svg",
  Firebase: "/landing/stack-icons/firebase.svg",
  "Firebase Auth": "/landing/stack-icons/firebase.svg",
  "Machine Learning": "/landing/stack-icons/tensorflow.svg",
  "Deep Learning": "/landing/stack-icons/pytorch.svg",
  "Data Analysis": "/landing/stack-icons/pandas.svg",
  QGIS: "/landing/stack-icons/qgis.svg",
  Git: "/landing/stack-icons/git.svg",
  GitHub: "/landing/stack-icons/github.svg",
  Docker: "/landing/stack-icons/docker.svg",
  "GitHub Actions": "/landing/stack-icons/github-actions.svg",
  Postman: "/landing/stack-icons/postman.svg",
  Vercel: "/landing/stack-icons/vercel.svg",
  Netlify: "/landing/stack-icons/netlify.svg",
  Render: "/landing/stack-icons/render.svg",
  "VS Code": "/landing/stack-icons/vscode.svg",
  Figma: "/landing/stack-icons/figma.svg",
  Canva: "/landing/stack-icons/canva.svg",
  Framer: "/landing/stack-icons/framer.svg",
};

/** Left → right order for the Figma arc. */
const ITEMS: TechStackItem[] = [
  TECH_STACK[4],
  TECH_STACK[3],
  TECH_STACK[2],
  TECH_STACK[1],
  TECH_STACK[0],
  TECH_STACK[5],
  TECH_STACK[6],
  TECH_STACK[7],
  TECH_STACK[8],
].filter(Boolean) as TechStackItem[];

const MID = 4;
/** Gentle auto-advance — slow enough to read each card. */
const AUTO_MS = 4200;
const CARD = 300;

const SHOWCASE_CATEGORIES: TechCategoryFilter[] = [
  "Data & Cloud",
  "Backend",
  "Frontend",
  "Languages",
  "Frontend",
  "Data & Cloud",
  "Design",
  "DevOps & Tools",
  "Data & Cloud",
];

const SHOWCASE_ITEMS: FanItem[] = ITEMS.map((item, index) => ({
  ...item,
  category: SHOWCASE_CATEGORIES[index],
}));

const CATEGORY_ITEMS = Object.fromEntries(
  (Object.keys(CATEGORY_TITLES) as TechCategoryFilter[]).map((filter) => {
    const category = TECH_CATEGORIES.find(
      (entry) => entry.title === CATEGORY_TITLES[filter],
    );
    return [
      filter,
      (category?.tags ?? []).map((name) => ({
        name,
        icon: BRAND_ICONS[name],
        glyph: SKILL_ICONS[name],
        category: filter,
      })),
    ];
  }),
) as Record<TechCategoryFilter, FanItem[]>;

const seenNames = new Set(SHOWCASE_ITEMS.map((item) => item.name.toLowerCase()));
const ALL_ITEMS = [
  ...SHOWCASE_ITEMS,
  ...(Object.values(CATEGORY_ITEMS).flat() as FanItem[]).filter((item) => {
    const key = item.name.toLowerCase();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  }),
];

function itemsForFilter(filter: TechFilter): FanItem[] {
  return filter === "All" ? ALL_ITEMS : CATEGORY_ITEMS[filter];
}

/**
 * Card-center X as % of full screen width (0% = left edge, 100% = right).
 * Uses the entire viewport — maximum width.
 */
const SLOT_X_PCT = [5.6, 15.1, 25.9, 36.1, 49.6, 60.7, 72.3, 84, 94.4];

const SLOT_META = [
  // The -25px compensation keeps scaled 250px cards aligned by their
  // visible top edge (CSS scale transforms around the card center).
  { y: 128, scale: 250 / 300, z: 1 },
  { y: 88, scale: 250 / 300, z: 2 },
  { y: 48, scale: 250 / 300, z: 3 },
  { y: 7, scale: 250 / 300, z: 4 },
  { y: 0, scale: 1, z: 10 },
  { y: 7, scale: 250 / 300, z: 4 },
  { y: 54, scale: 250 / 300, z: 3 },
  { y: 97, scale: 250 / 300, z: 2 },
  { y: 137, scale: 250 / 300, z: 1 },
] as const;

const move = {
  type: "spring" as const,
  stiffness: 48,
  damping: 22,
  mass: 1.15,
};

function wrap(i: number, count: number) {
  return ((i % count) + count) % count;
}

function slotForItem(itemIndex: number, active: number, count: number) {
  const half = Math.floor(count / 2);
  const relative = wrap(itemIndex - active + half, count) - half;
  const slot = MID + relative;
  return slot >= 0 && slot < SLOT_META.length ? slot : null;
}

function TechCard({
  name,
  icon,
  glyph,
  category,
}: {
  name: string;
  icon?: string;
  glyph?: LucideIcon;
  category: TechCategoryFilter;
}) {
  const FallbackIcon = glyph ?? CATEGORY_ICONS[category];

  return (
    <div
      className="flex h-[300px] w-[300px] items-center justify-center rounded-lg bg-ink p-[15px]"
    >
      <div className="flex h-[260px] w-[260px] flex-col items-center justify-center gap-2 rounded-lg bg-card p-6">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt=""
            className="h-[60px] w-[60px] object-contain"
          />
        ) : (
          <FallbackIcon
            className="h-[60px] w-[60px] text-accent"
            strokeWidth={1.6}
            aria-hidden
          />
        )}
        <p className="max-w-full text-center font-audiowide text-[clamp(18px,2vw,30px)] leading-tight text-ink">
          {name}
        </p>
      </div>
    </div>
  );
}

function CategoryPills({
  activeFilter,
  onChange,
  mobile = false,
}: {
  activeFilter: TechFilter;
  onChange: (filter: TechFilter) => void;
  mobile?: boolean;
}) {
  const pill = (filter: TechFilter) => (
    <button
      type="button"
      key={filter}
      onClick={() => onChange(filter)}
      aria-pressed={activeFilter === filter}
      className={`flex h-[35px] shrink-0 items-center rounded-full border px-5 font-anon text-[16px] font-bold leading-[22px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        activeFilter === filter
          ? "border-accent bg-ink text-bg"
          : "border-border bg-transparent text-ink hover:border-accent hover:bg-surface"
      }`}
    >
      {filter}
    </button>
  );

  if (!mobile) {
    return (
      <div
        className="flex flex-col items-center gap-4"
        aria-label="Tech stack categories"
      >
        <div className="flex items-center gap-[26px]">
          {FILTERS.slice(0, 7).map(pill)}
        </div>
        <div className="flex items-center gap-[26px]">
          {FILTERS.slice(7).map(pill)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-full gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Tech stack categories"
    >
      {FILTERS.map(pill)}
    </div>
  );
}

function DesktopFan() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(MID);
  const [activeFilter, setActiveFilter] = useState<TechFilter>("All");
  const [paused, setPaused] = useState(false);
  const items = itemsForFilter(activeFilter);
  const count = items.length;

  useEffect(() => {
    if (paused || reduceMotion || count <= 1) return;
    const id = window.setInterval(
      () => setActive((a) => wrap(a + 1, count)),
      AUTO_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, count]);

  const selectFilter = useCallback((filter: TechFilter) => {
    setActiveFilter(filter);
    setActive(filter === "All" ? MID : 0);
  }, []);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -60 || info.velocity.x < -400) {
        setActive((a) => wrap(a + 1, count));
      } else if (info.offset.x > 60 || info.velocity.x > 400) {
        setActive((a) => wrap(a - 1, count));
      }
    },
    [count],
  );

  return (
    <div
      className="relative hidden h-[834px] w-screen overflow-hidden lg:block"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="pointer-events-none absolute left-1/2 top-[100px] z-20 -translate-x-1/2 whitespace-nowrap font-audiowide text-[48px] leading-[72px] text-ink">
        Tech Stack
      </h2>

      <div className="absolute left-1/2 top-[196px] z-20 w-max -translate-x-1/2">
        <CategoryPills
          activeFilter={activeFilter}
          onChange={selectFilter}
        />
      </div>

      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={onDragEnd}
      >
        {items.map((tech, itemIndex) => {
          const slotIndex = slotForItem(itemIndex, active, count);
          if (slotIndex === null) return null;
          const meta = SLOT_META[slotIndex];
          const featured = slotIndex === MID;
          const leftPct = SLOT_X_PCT[slotIndex];

          return (
            <motion.button
              key={`${activeFilter}-${tech.name}-${itemIndex}`}
              type="button"
              aria-label={tech.name}
              aria-current={featured || undefined}
              className="absolute border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              style={{
                top: 322 + CARD / 2,
                marginTop: -CARD / 2,
                width: CARD,
                height: CARD,
                zIndex: meta.z,
                marginLeft: -CARD / 2,
              }}
              initial={false}
              animate={{
                left: `${leftPct}%`,
                y: meta.y,
                scale: meta.scale,
              }}
              transition={reduceMotion ? { duration: 0 } : move}
              onClick={() => setActive(itemIndex)}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: meta.y - 10,
                      transition: { type: "spring", stiffness: 300, damping: 24 },
                    }
              }
            >
              <TechCard
                name={tech.name}
                icon={tech.icon}
                glyph={tech.glyph}
                category={tech.category}
              />
            </motion.button>
          );
        })}
      </motion.div>

    </div>
  );
}

const MOBILE_CARD = 168;
const MOBILE_SWIPE_PX = 48;

/** Single ease for all props — no spring bounce / no left% layout thrash. */
const MOVE_MOBILE = {
  duration: 0.88,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

/**
 * Fan arc as offset from center (fraction of stage half-width).
 * Driven with translateX — GPU only, butter-smooth on mobile.
 */
const MOBILE_META = [
  { xFrac: -0.96, y: 78, scale: 0.58, z: 1, rot: 32 },
  { xFrac: -0.72, y: 58, scale: 0.66, z: 2, rot: 24 },
  { xFrac: -0.46, y: 36, scale: 0.76, z: 3, rot: 14 },
  { xFrac: -0.23, y: 14, scale: 0.88, z: 5, rot: 7 },
  { xFrac: 0, y: 0, scale: 1, z: 12, rot: 0 },
  { xFrac: 0.23, y: 14, scale: 0.88, z: 5, rot: -7 },
  { xFrac: 0.46, y: 36, scale: 0.76, z: 3, rot: -14 },
  { xFrac: 0.72, y: 58, scale: 0.66, z: 2, rot: -24 },
  { xFrac: 0.96, y: 78, scale: 0.58, z: 1, rot: -32 },
] as const;

function MobileFan() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(MID);
  const [activeFilter, setActiveFilter] = useState<TechFilter>("All");
  const [paused, setPaused] = useState(false);
  const items = itemsForFilter(activeFilter);
  const count = items.length;
  const [stageW, setStageW] = useState(360);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const panAxis = useRef<"x" | "y" | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageW(Math.max(280, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || count <= 1) return;
    const id = window.setInterval(
      () => setActive((a) => wrap(a + 1, count)),
      AUTO_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, count]);

  const selectFilter = useCallback((filter: TechFilter) => {
    setActiveFilter(filter);
    setActive(filter === "All" ? MID : 0);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setPaused(true);
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    panAxis.current = null;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || panAxis.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    panAxis.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      setPaused(false);
      const start = touchStart.current;
      const axis = panAxis.current;
      touchStart.current = null;
      panAxis.current = null;
      if (!start || axis !== "x" || reduceMotion) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      if (dx <= -MOBILE_SWIPE_PX)
        setActive((a) => wrap(a + 1, count));
      else if (dx >= MOBILE_SWIPE_PX)
        setActive((a) => wrap(a - 1, count));
    },
    [reduceMotion, count],
  );

  const half = stageW * 0.48;
  const tween = reduceMotion ? { duration: 0 } : MOVE_MOBILE;

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-6 overflow-x-clip px-0 py-4 sm:gap-8 sm:px-2 lg:hidden">
      <h2 className="px-4 font-audiowide text-[clamp(1.75rem,8vw,2.5rem)] leading-tight text-ink">
        Tech Stack
      </h2>

      <CategoryPills
        activeFilter={activeFilter}
        onChange={selectFilter}
        mobile
      />

      <div
        ref={stageRef}
        className="relative h-[300px] w-full max-w-[100vw] select-none sm:h-[340px]"
        style={{
          touchAction: "pan-y",
          perspective: reduceMotion ? undefined : "1200px",
          perspectiveOrigin: "50% 42%",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          setPaused(false);
          touchStart.current = null;
          panAxis.current = null;
        }}
      >
        {items.map((tech, itemIndex) => {
          const slotIndex = slotForItem(itemIndex, active, count);
          if (slotIndex === null) return null;
          const meta = MOBILE_META[slotIndex];
          const featured = slotIndex === MID;
          const far = Math.abs(slotIndex - MID) >= 4;
          const x = meta.xFrac * half;
          const FallbackIcon = tech.glyph ?? CATEGORY_ICONS[tech.category];

          return (
            <motion.button
              key={`m-${activeFilter}-${tech.name}-${itemIndex}`}
              type="button"
              aria-label={tech.name}
              aria-current={featured || undefined}
              tabIndex={featured ? 0 : -1}
              className="absolute top-[52px] left-1/2 border-0 bg-transparent p-0 sm:top-[60px]"
              style={{
                width: MOBILE_CARD,
                height: MOBILE_CARD,
                marginLeft: -MOBILE_CARD / 2,
                zIndex: meta.z,
                pointerEvents: Math.abs(slotIndex - MID) <= 2 ? "auto" : "none",
                transformStyle: "preserve-3d",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              initial={false}
              animate={{
                x,
                y: meta.y,
                scale: meta.scale,
                rotateY: reduceMotion ? 0 : meta.rot,
                opacity: far ? 0 : 1,
              }}
              transition={tween}
              onClick={() => setActive(itemIndex)}
            >
              {/* Solid shell — opaque while cards pass each other */}
              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-ink p-2 ${
                  featured
                    ? "shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                    : "shadow-md"
                }`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-lg bg-card px-2 py-3">
                  {tech.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tech.icon}
                      alt=""
                      className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                      draggable={false}
                    />
                  ) : (
                    <FallbackIcon
                      className="h-11 w-11 text-accent sm:h-12 sm:w-12"
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  )}
                  <p className="max-w-full truncate px-1 text-center font-audiowide text-[13px] leading-tight text-ink sm:text-[15px]">
                    {tech.name}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}

export function TechStackSection() {
  return (
    <section
      id="stack"
      className="relative w-full overflow-x-hidden bg-bg py-16 sm:py-20 lg:py-0"
    >
      <DesktopFan />
      <MobileFan />
    </section>
  );
}
