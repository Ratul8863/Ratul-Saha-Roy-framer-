## Learned User Preferences

- Before implementing Figma or animation work, inspect the existing stack, layouts, and shared components first; reuse them and avoid recreating layouts or duplicating shared UI.
- Implement Figma designs as pixel-accurate, production-ready pages integrated into the existing app architecture (not isolated mockups).
- Treat supplied reference MP4s as the visual source of truth for section animations.
- Prefers butter-smooth site scrolling with soft inertia rather than default browser scroll.
- When iterating on motion, prefers smoother, more creative polish (3D depth, softer springs, refined arcs) over minimal or basic motion — except where Figma specifies a flat treatment.
- For Achievements, prefer continuous drag scrub (cards follow the pointer) and reject 3D fold/coverflow when it conflicts with the flat Figma design; mobile motion should stay butter-smooth without gaps showing the next card through.
- User communicates in Bangla (Bengali) and appreciates responses in Bangla when appropriate.
- Scroll-up should reveal the full navbar; scroll-down should show the compact "Available for Projects" pill (direction-based, not position-based).
- When adding or correcting project live links, prefer the user-supplied production URL over staging or preview hosts.
- Landing, `/projects`, and project detail should share the Duncan-style dark theme and semantic tokens — not the older light Figma chrome or the old editorial detail look.
- Prefer semantic theme tokens (`bg-bg`, `bg-surface`, `bg-card`, `text-ink`, `text-muted`, `bg-accent`, `text-on-accent`, `border-border`) over hardcoded light/dark hex colors when editing UI.
- SEO should improve discoverability for the portfolio on searches for projects, achievements/events, employer, and university — not only the personal name.

## Learned Workspace Facts

- Portfolio app is Next.js 15 + React 19 + TypeScript with Tailwind CSS 4; animation stack includes `motion` v12, GSAP, and Lenis.
- Landing sections live under `src/components/landing/` (Hero, About, What Can I Do, Recent Projects, Tech Stack, Achievements, Contact, Footer); sticky hero curtain keeps `id="home"` on a non-sticky wrapper so Home nav scrolls to top.
- Default theme is Duncan-style dark (`html.dark` / not `.light`): `#0f0f0f` background, `#c8ff00` accent, grain overlay; `html.light` tokens remain; colors map through semantic Tailwind tokens in `src/app/globals.css`.
- Achievements uses a flat horizontal scrub carousel (Figma 121:508 thick-border cards, continuous drag), not a 3D fold/coverflow.
- Tech Stack uses a fan/staircase coverflow-style rotating card layout (~3 cards visible), with slow auto-advance plus manual drag.
- Site-wide Lenis smooth scroll is wired via `SmoothScroll`; GSAP ScrollTrigger syncs on project detail; Lenis stops while the menu is open.
- Production domain is `ratul-saha-roy.pro.bd` (canonical via `NEXT_PUBLIC_SITE_URL`); deployed on Vercel (project `ratul-saha-roy`, user `ratul8863`).
- SEO infrastructure includes dynamic OG/Twitter images, JSON-LD schemas (Person + WebSite + ProfilePage), web manifest, and keyword/description constants in `src/lib/site.ts` aimed at name, projects, achievements, employer, and school.
- Project data (slugs, banners, descriptions) is managed in `src/data/projects.ts` and re-exported from `src/lib/projects.ts`; new banners are typically staged in `doc/` then copied into `public/`.
- Achievement entries live in `src/data/achievements.ts`; images are served from `public/achievements/` (sources often staged under `doc/achivements/`).
- Recent Projects uses a full-bleed elastic hover-expanding card grid (`ElasticGrid`); mobile shows 4 projects.
- `LandingHeader.tsx` uses scroll-direction detection to toggle full navbar vs compact pill; `/projects` and `ProjectDetailPage.tsx` reuse landing chrome — detail is a cinematic case-study (full-bleed hero, zigzag chapters, gallery lightbox), not the old editorial `Navbar`.
