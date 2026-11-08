## Learned User Preferences

- Before implementing Figma, animation, or content work, inspect the existing stack, layouts, and shared components first; reuse them, and preserve the existing design, theme, alignment, and established card styles during content-only updates unless explicitly asked to change them.
- Implement Figma designs as pixel-accurate, production-ready pages integrated into the existing app architecture (not isolated mockups); when porting Suhan UI, treat that source implementation as the visual/motion source of truth.
- Prefers butter-smooth Lenis scrolling with soft inertia and richer motion polish over minimal motion — except where the source design specifies a flatter treatment.
- User communicates in Bangla (Bengali) and appreciates responses in Bangla when appropriate.
- SEO should improve discoverability for projects, achievements/events, employer, and university — not only the personal name — including AI/LLM surfaces; use "Developed by" (not "Built by") in project attribution/SEO copy; prefer user-supplied production URLs over staging or preview hosts.
- Site favicon/app icon should use the profile photo, not a letter "R" mark.
- Complete portfolio replacements must keep verified personal content, existing Git history, the Vercel project, and custom-domain continuity in the TARGET repo.
- Keep nested `Suhan-Portfolio/` as gitignored reference/source only — never treat it as the deployable app root.
- Hero portrait must be background-removed (transparent) so the animated ambient hero background remains visible behind it.
- Hero should use the Ratul portrait + mask pair, with a large full-width background "RATUL SAHA ROY" wordmark matched to Suhan sizing/stretch.

## Learned Workspace Facts

- Portfolio app is Next.js 16 + React 19 + TypeScript with Tailwind CSS 4; animation stack includes framer-motion, GSAP, and Lenis; auth/dashboard uses better-auth with mongoose.
- Active frontend is the Suhan-Portfolio UI foundation with Ratul content mapped in; TARGET GitHub/Vercel identity (`ratul-saha-roy`) and custom domain stay canonical.
- App Router uses `(public)`, `(auth)`, and `(dashboard)` route groups; public pages include home, about, contact, projects, project detail, and services.
- Homepage sections live under `src/components/sections/` (`PortfolioHero`, `FeatureProjects`, `AllProjects`, `PortfolioContact`); shared UI/layout live under `src/components/ui/` and `src/components/layout/`.
- Site identity and links live in `src/config/site.ts`; project/content constants live in `src/constants/`; Book A Call points to WhatsApp (`wa.me`), not Cal.com.
- Hero stage combines an animated ambient field, portrait/mask hover reveal via `/assets/ratul-hero.png` + `/assets/ratul-hero-mask.png`, and large `/assets/ratul-saha-roy.svg` wordmark.
- Production domain is `ratul-saha-roy.pro.bd` (canonical via `NEXT_PUBLIC_SITE_URL`); profile entities include employer Kode By Kraft and Metropolitan University, Sylhet (CSE).
- Former TARGET-only sections/content (Research, Achievements, Leadership, Tech Stack, and related SEO extras) are preserved under `_portfolio-archive/` for future use and are not currently shown in the active UI.
- Nested `Suhan-Portfolio/` is gitignored; migration reference/backup copies may exist outside the deployable app tree.
- SEO/LLM surfaces include `public/llms.txt`; app icon is `src/app/icon.png` from the profile photo.
