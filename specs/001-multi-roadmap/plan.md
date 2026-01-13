# Implementation Plan: Multi-Roadmap Support

**Branch**: `001-multi-roadmap` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-multi-roadmap/spec.md`

## Summary

Transform the single-roadmap DevOps LMS into a multi-roadmap platform supporting both the existing DevOps roadmap (10 phases, 69 topics, 527 subtopics) and a new Full Stack Developer Interview Mastery roadmap (13 phases, 79 topics, 450+ skills). Key technical changes include:

- Creating a new landing page for roadmap selection at the root URL
- Adding a `Roadmap` entity as a top-level data structure
- Modifying `useProgress` composable to support per-roadmap progress tracking with localStorage migration
- Updating routing to support new roadmaps with URL prefixes while preserving existing DevOps URLs
- Updating certificate generation to be roadmap-specific

## Technical Context

**Language/Version**: TypeScript 5.x with Vue 3 Composition API
**Primary Dependencies**: Nuxt 4.x, @nuxt/content, Nuxt UI v4, Tailwind CSS
**Storage**: localStorage (client-side) - key: `devops-lms-progress`
**Testing**: Manual testing, `npm run lint`, `npm run typecheck`, `npm run build`
**Target Platform**: Static site (GitHub Pages) - browser-only, no SSR
**Project Type**: Web application (Nuxt 4 SPA)
**Performance Goals**: Static site generation, instant page transitions (SPA)
**Constraints**: Must work with `baseURL: '/devops/'`, no server-side APIs, SSR-safe patterns required
**Scale/Scope**: 2 roadmaps (expandable), ~1000+ total lessons across roadmaps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Content-First Architecture | ✅ PASS | New roadmap follows same content patterns in `content/` directory |
| II. Type Safety | ✅ PASS | New `Roadmap` interface will be added to `app/data/types.ts` |
| III. Component Reusability | ✅ PASS | Existing components (PhaseCard, TopicCard, etc.) will be reused with roadmap-aware props |
| IV. Comprehensive Documentation | ✅ PASS | All new code will include JSDoc and section comments per standard |
| V. Static-First Deployment | ✅ PASS | No server-side changes; continues with `npm run generate` |
| VI. Dark Mode Design | ✅ PASS | No styling changes; uses existing dark mode palette |
| VII. User Experience Standards | ✅ PASS | `cursor-pointer` on all interactive elements, consistent font system |
| VIII. Content Generation Tooling | ✅ PASS | This feature is UI-only; lesson content generation is out of scope |

**Gate Status**: ✅ PASS - All principles satisfied, no violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-multi-roadmap/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal interfaces)
├── checklists/          # Validation checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── components/
│   ├── RoadmapCard.vue              # NEW: Landing page roadmap selection card
│   ├── RoadmapSwitcher.vue          # NEW: Navigation component to switch roadmaps
│   ├── PhaseCard.vue                # MODIFY: Accept roadmap context
│   ├── TopicCard.vue                # MODIFY: Accept roadmap context
│   └── progress/
│       ├── OverallProgress.vue      # MODIFY: Per-roadmap progress display
│       └── PhaseProgress.vue        # MODIFY: Per-roadmap phase breakdown
├── composables/
│   ├── useProgress.ts               # MODIFY: Multi-roadmap progress storage
│   ├── useRoadmap.ts                # NEW: Roadmap context provider
│   └── useCertificate.ts            # MODIFY: Roadmap-specific certificates
├── data/
│   ├── types.ts                     # MODIFY: Add Roadmap interface
│   ├── roadmap.ts                   # RENAME/MODIFY → devops-roadmap.ts
│   ├── fullstack-roadmap.ts         # NEW: Full Stack roadmap data
│   └── roadmaps.ts                  # NEW: Registry of all roadmaps
├── pages/
│   ├── index.vue                    # MODIFY: Roadmap selection landing page
│   ├── progress.vue                 # MODIFY: Multi-roadmap progress dashboard
│   ├── certificate.vue              # MODIFY: Roadmap-specific certificate
│   ├── [phase]/[topic]/[subtopic].vue  # EXISTING: Works for DevOps
│   └── fullstack/                   # NEW: Full Stack roadmap routes
│       ├── index.vue                # Full Stack roadmap main page
│       └── [phase]/[topic]/[subtopic].vue  # Full Stack lesson pages
└── layouts/
    └── default.vue                  # MODIFY: Add roadmap switcher to header

content/
├── 1.phase-1-sdlc/                  # EXISTING: DevOps content (unchanged)
│   └── ...
└── fullstack/                       # NEW: Full Stack content directory
    └── 1.phase-1-web-fundamentals/  # Placeholder structure
        └── ...
```

**Structure Decision**: Web application with Nuxt 4 file-based routing. DevOps routes remain at root level (backward compatible), Full Stack routes use `/fullstack/` prefix. Both roadmaps share components and composables.

## Complexity Tracking

> No Constitution violations requiring justification. Feature uses existing patterns and components.

| Area | Complexity | Rationale |
|------|------------|-----------|
| Progress Migration | Medium | One-time migration of existing localStorage data to multi-roadmap structure |
| URL Routing | Low | DevOps URLs unchanged; only new roadmap needs route setup |
| Component Reuse | Low | Existing components receive roadmap context via props/provide |
