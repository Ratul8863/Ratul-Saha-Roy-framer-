# Project Details Page — Full Design Concept

## Visual Reference

![Project Details Page Mockup](file:///C:/Users/Asus/.gemini/antigravity/brain/fd313a1d-e76e-4017-a001-85f01e53dcad/project_details_mockup_1774630366933.png)

---

## Page URL

`/projects/:slug` — e.g. `/projects/jubileean-football-fest`

Each project gets a URL-friendly slug generated from its title.

---

## Page Sections (Top → Bottom)

### 1. Hero Banner
- **Full-width screenshot** of the project (rounded corners, subtle shadow)
- Greyscale by default → color on hover (matching the existing portfolio style)
- Parallax scroll effect for depth

### 2. Project Header
- **Category badge** — e.g. `Live Site`, `Full Stack` (accent-colored pill)
- **Title** — large display font (same `font-display` used site-wide)
- **Tagline** — one-liner summary in lighter text
- **Action buttons row:**
  - 🔗 "Visit Live Site" (primary, black button) — only if link exists
  - 💻 "View Source" (outline button) — only if GitHub repo exists
  - ⬇️ "Back to Projects" link

### 3. Two-Column Layout (desktop) / Single Column (mobile)

#### Left Column — Main Content

**Overview**
> 2–3 paragraphs describing the project in detail: what it does, who it's for, and why it matters.

**My Role**
> Bullet list of what you specifically contributed:
> - Designed and built the responsive frontend
> - Implemented real-time scores with Socket.IO
> - Built the admin CMS dashboard
> - Deployed and managed on Vercel

**Key Features**
> Numbered or bulleted feature list with short descriptions:
> 1. **Real-time match scores** — Live updates via WebSocket
> 2. **Admin CMS** — Create/edit matches, teams, players
> 3. **Leaderboard** — Auto-calculated standings with pagination
> 4. **Gallery** — Photo uploads with lazy loading

#### Right Column — Sidebar (sticky on scroll)

| Field | Example |
|-------|---------|
| **Tech Stack** | React, TypeScript, Node.js, MongoDB, Socket.IO (shown as tag pills) |
| **Timeline** | "3 months" or "Jan – Mar 2026" |
| **Status** | 🟢 Live / 🔵 In Progress / ⚪ Archived |
| **Team Size** | "Solo" or "3 developers" |
| **Category** | "Full Stack Web App" |

### 4. Screenshots Gallery
- **3–6 screenshots** in a responsive grid (2 cols desktop, 1 col mobile)
- Click to open a **lightbox** with full-size view and arrow navigation
- Captions below each screenshot (e.g. "Dashboard view", "Mobile leaderboard")

### 5. Challenges & Solutions
- **Accordion-style** expandable cards (2–4 items)
- Each has a challenge title that expands to reveal the solution
- Example:
  - **Challenge:** "Real-time score sync across 200+ connected clients"
  - **Solution:** "Used Socket.IO rooms per match with debounced state broadcasts, keeping latency under 100ms"

### 6. What I Learned
- Short paragraph or bullet list of takeaways
- Shows growth mindset — recruiters love this section
- Example: "This project deepened my understanding of WebSocket architecture and taught me how to structure a MongoDB schema for tournament-style hierarchical data."

### 7. Prev / Next Project Navigation
- Two cards at the bottom: **← Previous Project** | **Next Project →**
- Shows thumbnail + title for each
- Smooth transition between projects without going back to the archive

---

## Updated Data Model

The [Project](file:///f:/CODING/projects/portfolios/Ratul-Saha-Roy-framer-/src/data/projects.ts#6-14) interface in [data/projects.ts](file:///f:/CODING/projects/portfolios/Ratul-Saha-Roy-framer-/src/data/projects.ts) would be extended:

```typescript
export interface Project {
  // Existing fields
  title: string;
  description: string;       // used as tagline on detail page
  tags: string[];
  link: string;
  image: string;             // hero image
  category: string;

  // New fields
  slug: string;              // URL-friendly identifier
  overview: string[];        // array of paragraphs for detailed overview
  role: string[];            // bullet points of your contributions
  features?: string[];       // key feature list
  screenshots?: { src: string; caption: string }[];
  challenges?: { title: string; solution: string }[];
  learned?: string;          // what you learned paragraph
  github?: string;           // GitHub repo link (optional)
  timeline?: string;         // e.g. "Jan – Mar 2026"
  status?: "live" | "in-progress" | "archived";
  teamSize?: string;         // e.g. "Solo" or "3 developers"
}
```

## New Files

| File | Purpose |
|------|---------|
| `src/pages/ProjectDetailPage.tsx` | The detail page component |
| `src/components/ScreenshotGallery.tsx` | Lightbox gallery component |
| `src/components/ChallengeAccordion.tsx` | Expandable challenge/solution cards |
| `src/components/ProjectNav.tsx` | Prev/Next navigation at bottom |

## Routing Change

```tsx
// In App.tsx
<Route path="/projects/:slug" element={<ProjectDetailPage />} />
```

Project cards on homepage and archive page would link to `/projects/${project.slug}` instead of directly to the external site. The external link moves to a button inside the detail page.

## Animations & Interactions

- **Hero image:** fade-in with slight upward motion on load
- **Sidebar:** sticky with `position: sticky; top: 6rem`
- **Screenshots:** staggered fade-in as they scroll into view
- **Challenges:** smooth height animation on accordion open/close (using `AnimatePresence`)
- **Prev/Next cards:** subtle hover scale + image peek

---

> [!IMPORTANT]
> This changes user flow: project cards will **no longer** link directly to external sites. Instead, they navigate to the detail page, which has a prominent "Visit Live Site" button. This is a better UX for a portfolio — visitors see your thought process before the demo.
