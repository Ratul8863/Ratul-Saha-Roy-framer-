# Portfolio Archive Manifest

Created during the `portfolio-redesign` migration.

## Purpose

Preserve TARGET (Ratul) content and assets that are **not** part of the SOURCE homepage UI, so they can be reintroduced later without inventing data.

## TARGET-only sections (not shown in the new UI)

| Section | Source files |
|---|---|
| Research | `content/landingData.ts` → `RESEARCH_ITEMS`, `assets/research/` |
| Achievements | `content/achievements.ts`, `assets/achievements/` |
| Leadership | `content/landingData.ts` → `LEADERSHIP_ITEMS` |
| Tech Stack | `content/landingData.ts` → `TECH_STACK`, `TECH_CATEGORIES` |
| What Can I Do / Services (old) | `content/landingData.ts` → `SKILLS`, `assets/` service images |
| Old Duncan landing chrome | `legacy-sections/` |

## Content files

- `content/projects.ts` — full project case studies (restore point)
- `content/achievements.ts`
- `content/landingData.ts` — nav, socials, skills, research, leadership, tech
- `content/site.ts`, `seo-entities.ts`, `project-seo.ts`
- `seo/` — `llms.txt`, `humans.txt`, OG defaults

## Recovery

1. Read the data file under `content/`.
2. Map fields into a new SOURCE-style section component when requested.
3. Copy needed assets from `assets/` into `public/`.
4. Pre-migration UI also remains recoverable from Git history on commits before this redesign branch lands.

## Notes

- No secrets are stored here.
- This folder is excluded from TypeScript compilation.
- Do not import archive modules into the active app.
