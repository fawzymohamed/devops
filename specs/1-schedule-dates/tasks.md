# Tasks: Date-Based Schedule System

**Input**: Design documents from `/specs/1-schedule-dates/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: No automated test framework configured. Manual testing only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Paths are relative to repository root

---

## Phase 1: Setup (Type Definitions)

**Purpose**: Add type definitions required by all user stories

- [x] T001 Add StudySchedule interface to app/data/types.ts
- [x] T002 Extend RoadmapProgress interface with optional schedule field in app/data/types.ts

---

## Phase 2: Foundational (Core Composable)

**Purpose**: Create the useSchedule composable that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create useSchedule composable skeleton in app/composables/useSchedule.ts
- [x] T004 Implement hasSchedule() and getSchedule() functions in app/composables/useSchedule.ts
- [x] T005 Implement setSchedule() and removeSchedule() functions in app/composables/useSchedule.ts
- [x] T006 Implement date calculation helpers (addWeeks, calculateCompletion) in app/composables/useSchedule.ts
- [x] T007 Implement getProjectedRoadmapCompletion() in app/composables/useSchedule.ts
- [x] T008 Implement getProjectedPhaseCompletion() in app/composables/useSchedule.ts
- [x] T009 Implement formatProjectedDate() helper in app/composables/useSchedule.ts
- [x] T010 Add SSR-safe localStorage initialization in app/composables/useSchedule.ts

**Checkpoint**: useSchedule composable is complete and ready for UI integration

---

## Phase 3: User Story 1 - Configure Study Schedule (Priority: P1) 🎯 MVP

**Goal**: Users can set start date and study days per week on the Progress page

**Independent Test**: Navigate to /progress, select a roadmap, configure schedule (Jan 27, 2026, 6 days/week), save, reload page, verify schedule persists

### Implementation for User Story 1

- [x] T011 [US1] Create ScheduleSettings component skeleton in app/components/progress/ScheduleSettings.vue
- [x] T012 [US1] Add date input field for start date in app/components/progress/ScheduleSettings.vue
- [x] T013 [US1] Add number input (1-7) for study days per week in app/components/progress/ScheduleSettings.vue
- [x] T014 [US1] Implement form validation (1-7 days, valid date) in app/components/progress/ScheduleSettings.vue
- [x] T015 [US1] Connect form to useSchedule composable (setSchedule) in app/components/progress/ScheduleSettings.vue
- [x] T016 [US1] Add "Remove Schedule" button functionality in app/components/progress/ScheduleSettings.vue
- [x] T017 [US1] Pre-populate form with existing schedule on load in app/components/progress/ScheduleSettings.vue
- [x] T018 [US1] Add schedule settings section to progress page in app/pages/progress.vue
- [x] T019 [US1] Import and use useSchedule in progress page in app/pages/progress.vue
- [x] T020 [US1] Style ScheduleSettings with Nuxt UI components (UCard, UInput, UButton) in app/components/progress/ScheduleSettings.vue

**Checkpoint**: User Story 1 complete - schedule can be configured, saved, and persisted

---

## Phase 4: User Story 2 - View Projected Roadmap Completion Date (Priority: P1)

**Goal**: Users see overall roadmap completion date when schedule exists

**Independent Test**: Configure schedule, view roadmap overview, verify completion date displays correctly (~14 weeks for 79 topics at 6 days/week)

### Implementation for User Story 2

- [x] T021 [US2] Add projected completion display to progress overview card in app/pages/progress.vue
- [x] T022 [US2] Calculate and display roadmap completion date using useSchedule in app/pages/progress.vue
- [x] T023 [US2] Conditionally show completion date OR default stats based on hasSchedule in app/pages/progress.vue
- [x] T024 [US2] Format date display with formatProjectedDate helper in app/pages/progress.vue
- [x] T025 [US2] Add visual styling for projected date (icon, badge) in app/pages/progress.vue

**Checkpoint**: User Story 2 complete - roadmap completion date shows when schedule exists

---

## Phase 5: User Story 3 - View Projected Phase Completion Dates (Priority: P2)

**Goal**: Each phase shows its projected completion date instead of duration label

**Independent Test**: Configure schedule, view roadmap phases, verify each phase shows sequential completion dates

### Implementation for User Story 3

- [x] T026 [US3] Add projectedDate optional prop to PhaseCard in app/components/PhaseCard.vue
- [x] T027 [US3] Update PhaseCard badge to show date when projectedDate provided in app/components/PhaseCard.vue
- [x] T028 [US3] Keep duration badge as fallback when no projectedDate in app/components/PhaseCard.vue
- [x] T029 [US3] Calculate phase completion dates in roadmap pages using useSchedule
- [x] T030 [US3] Pass projectedDate to PhaseCard components in app/pages/index.vue (DevOps)
- [x] T031 [US3] Pass projectedDate to PhaseCard components in app/pages/fullstack/index.vue (Full Stack)
- [x] T032 [US3] Import and use useSchedule in roadmap index pages

**Checkpoint**: User Story 3 complete - phases show projected dates when schedule exists

---

## Phase 6: User Story 4 - Schedule Replaces Duration Labels (Priority: P2)

**Goal**: Duration labels hidden when schedule exists, dates shown instead

**Independent Test**: Configure schedule, verify "1-2 weeks" labels replaced with dates; remove schedule, verify duration labels return

### Implementation for User Story 4

- [x] T033 [US4] Update RoadmapTimeline to check hasSchedule and show dates in app/components/RoadmapTimeline.vue
- [x] T034 [US4] Ensure consistent date display across all roadmap views
- [x] T035 [US4] Test edge case: removing schedule reverts to duration labels
- [x] T036 [US4] Add visual distinction between date display and duration display (different icon)

**Checkpoint**: User Story 4 complete - dates replace duration labels throughout UI

---

## Phase 7: Polish & Edge Cases

**Purpose**: Handle edge cases and improve UX

- [x] T037 [P] Handle 0 topics edge case (display "Already complete") in useSchedule
- [x] T038 [P] Handle 7 days/week schedule (no weekly boundary issues)
- [x] T039 [P] Test localStorage cleared scenario (graceful fallback)
- [x] T040 [P] Add cursor-pointer class to all new buttons per CLAUDE.md
- [x] T041 Review and ensure dark mode styling consistency
- [x] T042 Manual testing: end-to-end schedule flow on both roadmaps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3-6 (User Stories)**: All depend on Phase 2 completion
- **Phase 7 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Phase 2 - Depends on US1 for schedule to exist
- **User Story 3 (P2)**: Can start after Phase 2 - Depends on US1 for schedule to exist
- **User Story 4 (P2)**: Can start after Phase 2 - Depends on US3 for PhaseCard changes

### Recommended Order

1. Phase 1 → Phase 2 (foundation complete)
2. US1 (schedule config) → US2 (roadmap date)
3. US3 (phase dates) → US4 (duration replacement)
4. Polish phase

### Parallel Opportunities

Within Phase 2:
- T004 and T005 can run in parallel (different functions)
- T007 and T008 can run in parallel (different functions)

Within User Story 3:
- T030 and T031 can run in parallel (different files)

---

## Parallel Example: Foundational Phase

```bash
# After T003 (skeleton), launch in parallel:
Task: "Implement hasSchedule() and getSchedule()"
Task: "Implement setSchedule() and removeSchedule()"

# Then after those complete, launch in parallel:
Task: "Implement getProjectedRoadmapCompletion()"
Task: "Implement getProjectedPhaseCompletion()"
```

---

## Implementation Strategy

### MVP First (User Stories 1-2)

1. Complete Phase 1: Setup (types)
2. Complete Phase 2: Foundational (useSchedule composable)
3. Complete Phase 3: User Story 1 (schedule configuration)
4. Complete Phase 4: User Story 2 (roadmap completion date)
5. **STOP and VALIDATE**: Test schedule config and date display
6. Demo: "Users can configure schedule and see roadmap completion date"

### Full Feature

7. Complete Phase 5: User Story 3 (phase dates)
8. Complete Phase 6: User Story 4 (replace duration labels)
9. Complete Phase 7: Polish and edge cases
10. Final validation: all acceptance scenarios pass

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | 2 | Type definitions |
| Phase 2 | 8 | useSchedule composable |
| Phase 3 (US1) | 10 | Schedule configuration UI |
| Phase 4 (US2) | 5 | Roadmap completion date |
| Phase 5 (US3) | 7 | Phase completion dates |
| Phase 6 (US4) | 4 | Duration label replacement |
| Phase 7 | 6 | Polish & edge cases |
| **Total** | **42** | |

### Tasks per User Story

- **US1**: 10 tasks (P1 - MVP core)
- **US2**: 5 tasks (P1 - primary value)
- **US3**: 7 tasks (P2 - phase milestones)
- **US4**: 4 tasks (P2 - cleanup/polish)

### MVP Scope

Complete US1 + US2 for minimum viable feature:
- Users can configure schedule
- Users see roadmap completion date

This delivers the core value proposition with 25 tasks (Phases 1-4).
