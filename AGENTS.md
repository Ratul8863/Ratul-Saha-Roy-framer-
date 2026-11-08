## Learned User Preferences

- Before implementing Figma, animation, or content work, inspect the existing stack, layouts, and shared components first; reuse them, and preserve the existing design, theme, alignment, and established card styles during content-only updates unless explicitly asked to change them.
- Implement Figma designs as pixel-accurate, production-ready pages integrated into the existing app architecture (not isolated mockups); treat supplied reference MP4s as the visual source of truth for section animations when provided.
- Prefers butter-smooth Lenis scrolling with soft inertia and richer motion polish (3D depth, softer springs, refined arcs) over minimal motion — except where Figma specifies a flat treatment.
- For Achievements, prefer continuous drag scrub (cards follow the pointer) and reject 3D fold/coverflow when it conflicts with the flat Figma design; mobile motion should stay butter-smooth without gaps showing the next card through.
- User communicates in Bangla (Bengali) and appreciates responses in Bangla when appropriate.
- Scroll-up should reveal the full navbar; scroll-down should show the compact "Available for Projects" pill (direction-based, not position-based).
- Landing, `/projects`, and project detail should share the Duncan-style dark theme and semantic tokens — not the older light Figma chrome or the old editorial detail look.
- Prefer semantic theme tokens (`bg-bg`, `bg-surface`, `bg-card`, `text-ink`, `text-muted`, `bg-accent`, `text-on-accent`, `border-border`) over hardcoded light/dark hex colors when editing UI.
- SEO should improve discoverability for projects, achievements/events, employer, and university — not only the personal name — including AI/LLM surfaces; use "Developed by" (not "Built by") in project attribution/SEO copy; prefer user-supplied production URLs over staging or preview hosts.
- Do NOT re-add `ScrollFloater` or the About→Services portrait shift animation; user removed it — About portrait stays static, services use sticky stacking panels only; service images should be landscape/horizontal, sharp (not soft/blurry), colorful, and not overly robotic or too dark.
- Research (`#research` / AI, DATA & RESEARCH): sticky pinned frame; start content changes only after the full frame is in view; one scroll step advances one Rainfall→Climate→Forest state with title, body, and image rising from below; keep transitions snappy; mobile must stay stacked and responsive.
- Site favicon/app icon should use the profile photo, not a letter "R" mark; on mobile/small screens Selected Work should stay static (no scroll-reveal entrance animation).

## Learned Workspace Facts

- Portfolio app is Next.js 15 + React 19 + TypeScript with Tailwind CSS 4; animation stack includes `motion` v12, GSAP, and Lenis; site-wide Lenis is wired via `SmoothScroll`, GSAP ScrollTrigger syncs on project detail, and Lenis stops while the menu is open.
- Landing sections live under `src/components/landing/` (Hero, About, What Can I Do, Recent Projects, Research, Achievements, Leadership, Tech Stack, Contact, Footer); sticky hero curtain keeps `id="home"` on a non-sticky wrapper so Home nav scrolls to top; `LandingHeader.tsx` toggles full navbar vs compact pill on scroll direction; `/projects` and project detail reuse landing chrome (cinematic case-study, not old editorial `Navbar`).
- What Can I Do (`WhatCanIDoSection`, `#services`) uses CSS sticky stacking panels with z-index occlusion — not accordion or GSAP pin; panels pin below `LandingHeader`; mobile uses compact text+image stack (no `mt-auto` image push); `#services` is `isolate z-[1]`, `#projects` is `isolate z-10`.
- About desktop layout: text left, portrait right, `px-[111px]` grid columns aligned with What Can I Do service panels; service images are landscape `/service-01.png` … `/service-05.png` in `public/`.
- Default theme is Duncan-style dark (`html.dark` / not `.light`): `#0f0f0f` background, `#c8ff00` accent, grain overlay; `html.light` tokens remain; colors map through semantic Tailwind tokens in `src/app/globals.css`.
- Achievements uses a flat horizontal scrub carousel (Figma 121:508 thick-border cards, continuous drag), not a 3D fold/coverflow; desktop card stage needs enough height so metadata is not clipped (~580px+).
- Research (`ResearchSection`, `#research`) is a sticky scroll-driven Rainfall/Climate/Forest showcase (title, copy, metadata, image); Leadership (`LeadershipSection`) sits between Achievements and Tech Stack with items from `landingData`.
- Tech Stack uses a fan/staircase coverflow-style rotating card layout (~3 cards visible), with slow auto-advance plus manual drag; category filter pills must be clickable and filter the fan cards; stack icons must match stack names; no extra full-toolkit grid or nav dots.
- Production domain is `ratul-saha-roy.pro.bd` (canonical via `NEXT_PUBLIC_SITE_URL`); deployed on Vercel (project `ratul-saha-roy`, user `ratul8863`); profile entities include employer Kode By Kraft and Metropolitan University, Sylhet (CSE).
- SEO infrastructure includes dynamic OG/Twitter images, JSON-LD schemas (Person + WebSite + ProfilePage), web manifest, `llms.txt`/`humans.txt`/`llms-full.txt`, `src/lib/seo-entities.ts`, and keyword/description constants in `src/lib/site.ts`.
- Project data lives in `src/data/projects.ts`; achievements in `src/data/achievements.ts` (`public/achievements/`); new assets staged in `doc/` then copied to `public/`; research imagery under `public/research/`.
- Recent Projects uses `ElasticGrid` elastic hover expand on desktop; mobile shows a static project list (no scroll-reveal entrance animation).
