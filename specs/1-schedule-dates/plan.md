# Implementation Plan: Date-Based Schedule System

**Branch**: `1-schedule-dates` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-schedule-dates/spec.md`

## Summary

Replace static duration labels (e.g., "1-2 weeks") with projected completion dates based on a user-configurable study schedule. Each roadmap has an independent schedule with start date and study days per week. Calculation uses 1 topic = 1 study day pace.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3 Composition API
**Primary Dependencies**: Nuxt 4.x, Nuxt UI v4, @nuxt/content, Tailwind CSS
**Storage**: localStorage (browser-side, consistent with existing progress tracking)
**Testing**: Manual testing (no automated test framework configured)
**Target Platform**: Web browser (static site, GitHub Pages/Vercel)
**Project Type**: Single Nuxt web application
**Performance Goals**: <1 second date calculation and display
**Constraints**: SSR-safe (must handle server-side rendering gracefully)
**Scale/Scope**: 2 roadmaps (DevOps: 69 topics, Full Stack: 79 topics)

## Constitution Check

*GATE: No project constitution defined. Proceeding with standard best practices.*

- [x] No complex patterns needed - simple composable + component updates
- [x] Uses existing localStorage patterns from useProgress
- [x] Backwards compatible - no changes to existing progress data structure
- [x] Consistent with existing codebase conventions

## Project Structure

### Documentation (this feature)

```text
specs/1-schedule-dates/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts needed)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── composables/
│   ├── useProgress.ts         # Existing - progress tracking
│   └── useSchedule.ts         # NEW - schedule management composable
├── components/
│   ├── PhaseCard.vue          # MODIFY - show projected date vs duration
│   ├── progress/
│   │   └── ScheduleSettings.vue  # NEW - schedule configuration UI
│   └── schedule/
│       └── ProjectedDate.vue     # NEW - date display component
├── pages/
│   └── progress.vue           # MODIFY - add schedule settings section
└── data/
    └── types.ts               # MODIFY - add StudySchedule interface
```

**Structure Decision**: Single Nuxt application with feature additions to existing composables, components, and pages. New `useSchedule` composable follows the same pattern as `useProgress`.

## Complexity Tracking

No violations - simple feature addition within existing patterns.

## Phase 0-1 Artifacts Generated

| Artifact | Status | Path |
|----------|--------|------|
| Research | Complete | `specs/1-schedule-dates/research.md` |
| Data Model | Complete | `specs/1-schedule-dates/data-model.md` |
| Quickstart | Complete | `specs/1-schedule-dates/quickstart.md` |
| Contracts | N/A | No API contracts needed (localStorage only) |
| Agent Context | Skipped | PowerShell not available |

## Next Steps

Run `/speckit.tasks` to generate the implementation task list.
