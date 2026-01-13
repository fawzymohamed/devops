# Tasks: Multi-Roadmap Support

**Input**: Design documents from `/specs/001-multi-roadmap/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - omitting test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project**: Nuxt 4 application with `app/` source directory
- **Components**: `app/components/`
- **Composables**: `app/composables/`
- **Data**: `app/data/`
- **Pages**: `app/pages/`
- **Content**: `content/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and data layer foundation

- [ ] T001 Add Roadmap and MultiRoadmapProgress interfaces in app/data/types.ts
- [ ] T002 Add RoadmapProgress and GlobalSettings interfaces in app/data/types.ts
- [ ] T003 [P] Update roadmap.ts exports to use `devopsPhases` naming in app/data/roadmap.ts
- [ ] T004 [P] Create Full Stack roadmap data file in app/data/fullstack-roadmap.ts (convert from dev-plans/fullstack-interview-roadmap.md)
- [ ] T005 Create roadmap registry with both roadmaps in app/data/roadmaps.ts
- [ ] T006 Run `npm run typecheck` to verify all type definitions compile

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core composables that MUST be complete before ANY user story UI can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create useRoadmap composable with state and queries in app/composables/useRoadmap.ts
- [ ] T008 Add getRoadmapBySlug and getRoadmapById helper functions in app/composables/useRoadmap.ts
- [ ] T009 Add getContentPath and getRoutePath utility functions in app/composables/useRoadmap.ts
- [ ] T010 Refactor useProgress to use MultiRoadmapProgress structure in app/composables/useProgress.ts
- [ ] T011 Add progress data migration logic (v1 → v2) in app/composables/useProgress.ts
- [ ] T012 Update all useProgress functions to accept roadmapId parameter in app/composables/useProgress.ts
- [ ] T013 Add resetRoadmapProgress function for per-roadmap reset in app/composables/useProgress.ts
- [ ] T014 Run `npm run typecheck` and verify localStorage migration works in browser

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 6 - Data Layer for Full Stack Roadmap (Priority: P1) 🎯 MVP-A

**Goal**: Full Stack roadmap data loads and compiles without TypeScript errors

**Independent Test**: Import fullstack-roadmap.ts and verify TypeScript compilation succeeds. Iterate over phases/topics and verify data structure matches DevOps format.

### Implementation for User Story 6

- [ ] T015 [US6] Verify fullstack-roadmap.ts follows Phase interface structure in app/data/fullstack-roadmap.ts
- [ ] T016 [US6] Add priorityLabels configuration for Full Stack roadmap in app/data/roadmaps.ts
- [ ] T017 [US6] Compute and add stats (phaseCount, topicCount, subtopicCount, totalWeeks) for Full Stack roadmap in app/data/roadmaps.ts
- [ ] T018 [US6] Create placeholder content directory structure in content/fullstack/ (empty folders for phase structure)
- [ ] T019 [US6] Run `npm run typecheck` to verify Full Stack data compiles

**Checkpoint**: Full Stack roadmap data is complete and type-safe

---

## Phase 4: User Story 1 - Roadmap Selection Landing Page (Priority: P1) 🎯 MVP-B

**Goal**: Users see both roadmap options on homepage and can select one to explore

**Independent Test**: Navigate to http://localhost:5000/devops/ and verify both roadmap cards display with title, description, phase count, topic count, and progress indicator.

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create RoadmapCard component with props interface in app/components/RoadmapCard.vue
- [ ] T021 [P] [US1] Style RoadmapCard with UCard, progress ring, and stats grid in app/components/RoadmapCard.vue
- [ ] T022 [US1] Add click handler and navigation to roadmap on RoadmapCard in app/components/RoadmapCard.vue
- [ ] T023 [US1] Redesign index.vue to show roadmap selection above DevOps phases in app/pages/index.vue
- [ ] T024 [US1] Integrate RoadmapCard components for both roadmaps in app/pages/index.vue
- [ ] T025 [US1] Add progress percentage calculation per roadmap on landing page in app/pages/index.vue
- [ ] T026 [US1] Ensure DevOps phases section remains below roadmap selection in app/pages/index.vue
- [ ] T027 [US1] Run `npm run dev` and verify landing page shows both roadmap cards

**Checkpoint**: Landing page displays roadmap selection with progress indicators

---

## Phase 5: User Story 2 - Roadmap-Specific Navigation (Priority: P1) 🎯 MVP-C

**Goal**: Users can navigate within a roadmap with proper breadcrumbs and roadmap switching

**Independent Test**: Select Full Stack roadmap, verify navigation shows only Full Stack phases/topics, breadcrumb shows "Full Stack > Phase > Topic > Lesson".

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create fullstack/index.vue page showing Full Stack roadmap phases in app/pages/fullstack/index.vue
- [ ] T029 [P] [US2] Create fullstack/[phase]/[topic]/[subtopic].vue for Full Stack lessons in app/pages/fullstack/[phase]/[topic]/[subtopic].vue
- [ ] T030 [P] [US2] Create RoadmapSwitcher component for header navigation in app/components/RoadmapSwitcher.vue
- [ ] T031 [US2] Update PhaseCard to accept optional roadmapId prop in app/components/PhaseCard.vue
- [ ] T032 [US2] Update TopicCard to accept optional roadmapId prop in app/components/TopicCard.vue
- [ ] T033 [US2] Update breadcrumb generation to include roadmap name in lesson pages in app/pages/[phase]/[topic]/[subtopic].vue
- [ ] T034 [US2] Update breadcrumb for Full Stack lessons in app/pages/fullstack/[phase]/[topic]/[subtopic].vue
- [ ] T035 [US2] Add RoadmapSwitcher to default layout header in app/layouts/default.vue
- [ ] T036 [US2] Add "Coming Soon" badge display for lessons without content in app/components/TopicCard.vue
- [ ] T037 [US2] Run `npm run dev` and test navigation between roadmaps

**Checkpoint**: Full navigation works for both roadmaps with proper breadcrumbs

---

## Phase 6: User Story 3 - Isolated Progress Tracking (Priority: P1) 🎯 MVP-D

**Goal**: Progress is tracked separately per roadmap, completing DevOps lessons doesn't affect Full Stack progress

**Independent Test**: Complete a DevOps lesson, verify Full Stack progress remains at 0%. Export progress and verify both roadmaps are separate.

### Implementation for User Story 3

- [ ] T038 [US3] Update markComplete calls to include roadmapId in DevOps lesson page in app/pages/[phase]/[topic]/[subtopic].vue
- [ ] T039 [US3] Add markComplete calls with roadmapId in Full Stack lesson page in app/pages/fullstack/[phase]/[topic]/[subtopic].vue
- [ ] T040 [US3] Update PhaseCard progress queries to use roadmapId in app/components/PhaseCard.vue
- [ ] T041 [US3] Update TopicCard completion checks to use roadmapId in app/components/TopicCard.vue
- [ ] T042 [US3] Update OverallProgress component to accept and use roadmapId prop in app/components/progress/OverallProgress.vue
- [ ] T043 [US3] Verify export/import preserves progress for both roadmaps in app/composables/useProgress.ts
- [ ] T044 [US3] Test progress isolation between roadmaps in browser

**Checkpoint**: Progress is correctly isolated per roadmap

---

## Phase 7: User Story 5 - Roadmap-Specific Progress Dashboard (Priority: P2)

**Goal**: Progress dashboard shows all roadmaps with drill-down capabilities

**Independent Test**: Navigate to /progress and verify summary cards for both roadmaps with completion %, time spent, and Resume Learning buttons.

### Implementation for User Story 5

- [ ] T045 [US5] Redesign progress.vue to show multi-roadmap overview in app/pages/progress.vue
- [ ] T046 [US5] Add roadmap summary cards with stats grid in app/pages/progress.vue
- [ ] T047 [US5] Add per-roadmap Resume Learning button in app/pages/progress.vue
- [ ] T048 [US5] Update PhaseProgress component to accept roadmapId prop in app/components/progress/PhaseProgress.vue
- [ ] T049 [US5] Add roadmap filter query parameter support in app/pages/progress.vue
- [ ] T050 [US5] Add drill-down view to show phase-by-phase breakdown per roadmap in app/pages/progress.vue
- [ ] T051 [US5] Run `npm run dev` and test progress dashboard

**Checkpoint**: Progress dashboard shows comprehensive multi-roadmap view

---

## Phase 8: User Story 4 - Roadmap-Specific Certificates (Priority: P2)

**Goal**: Certificates show correct roadmap name and branding

**Independent Test**: Generate certificate for each roadmap and verify titles are "DevOps Master Certificate" and "Full Stack Interview Mastery Certificate".

### Implementation for User Story 4

- [ ] T052 [US4] Update useCertificate to accept roadmapId parameter in app/composables/useCertificate.ts
- [ ] T053 [US4] Update certificate ID format to include roadmap identifier in app/composables/useCertificate.ts
- [ ] T054 [US4] Update generateCourseCertificate to use roadmap.certificateTitle in app/composables/useCertificate.ts
- [ ] T055 [US4] Update certificate.vue to handle roadmap query parameter in app/pages/certificate.vue
- [ ] T056 [US4] Add roadmap selection UI if no roadmap specified in app/pages/certificate.vue
- [ ] T057 [US4] Update canGenerateCertificate calls to include roadmapId in app/pages/certificate.vue
- [ ] T058 [US4] Test certificate generation for both roadmaps

**Checkpoint**: Certificates are roadmap-specific with correct branding

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T059 [P] Run `npm run lint` and fix any linting errors
- [ ] T060 [P] Run `npm run typecheck` and fix any type errors
- [ ] T061 [P] Run `npm run build` to verify production build succeeds
- [ ] T062 Verify DevOps URLs still work without changes (backward compatibility)
- [ ] T063 Verify Full Stack URLs work with /fullstack prefix
- [ ] T064 Test localStorage migration with existing DevOps progress data
- [ ] T065 Verify static generation works with `npm run generate`
- [ ] T066 Update CLAUDE.md to document multi-roadmap architecture
- [ ] T067 Final walkthrough: test all user stories end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 (Phase 3)**: Depends on Foundational - Data layer must be complete
- **User Story 1 (Phase 4)**: Depends on US6 - Needs roadmap data to display cards
- **User Story 2 (Phase 5)**: Depends on US1 - Needs landing page to navigate from
- **User Story 3 (Phase 6)**: Depends on US2 - Needs navigation to track progress
- **User Story 5 (Phase 7)**: Depends on US3 - Needs progress tracking to display
- **User Story 4 (Phase 8)**: Depends on US3 - Needs progress tracking for eligibility
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

```
US6 (Data Layer) ─────┐
                      ├──▶ US1 (Landing Page) ──▶ US2 (Navigation) ──▶ US3 (Progress) ─┬──▶ US5 (Dashboard)
Foundational ─────────┘                                                                 └──▶ US4 (Certificates)
```

### Within Each User Story

- Models/data before services/composables
- Composables before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T003 and T004 can run in parallel (different files)
- **Phase 4**: T020 and T021 can run in parallel (same file, different aspects)
- **Phase 5**: T028, T029, T030 can run in parallel (different files)
- **Phase 9**: T059, T060, T061 can run in parallel (different validation commands)

---

## Parallel Example: User Story 1

```bash
# Launch all parallelizable tasks for User Story 1 together:
Task: "Create RoadmapCard component with props interface in app/components/RoadmapCard.vue"
Task: "Style RoadmapCard with UCard, progress ring, and stats grid in app/components/RoadmapCard.vue"
```

---

## Parallel Example: User Story 2

```bash
# Launch all parallelizable tasks for User Story 2 together:
Task: "Create fullstack/index.vue page showing Full Stack roadmap phases"
Task: "Create fullstack/[phase]/[topic]/[subtopic].vue for Full Stack lessons"
Task: "Create RoadmapSwitcher component for header navigation"
```

---

## Implementation Strategy

### MVP First (User Stories 6 + 1)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T014)
3. Complete Phase 3: User Story 6 - Data Layer (T015-T019)
4. Complete Phase 4: User Story 1 - Landing Page (T020-T027)
5. **STOP and VALIDATE**: Both roadmaps visible on landing page
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Core infrastructure ready
2. Add US6 (Data Layer) → Full Stack data available
3. Add US1 (Landing Page) → Users can see roadmap options → **MVP Demo!**
4. Add US2 (Navigation) → Users can browse Full Stack roadmap
5. Add US3 (Progress) → Per-roadmap progress tracking works
6. Add US5 (Dashboard) → Full progress overview
7. Add US4 (Certificates) → Complete feature set

### Single Developer Strategy

Complete phases in order:
1. Setup → Foundational → US6 → US1 → US2 → US3 → US5 → US4 → Polish

Each phase delivers testable functionality.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- DevOps URLs must remain unchanged for backward compatibility
- Full Stack URLs use /fullstack prefix
- Progress migration is automatic and transparent to users

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 67 |
| **Setup Tasks** | 6 |
| **Foundational Tasks** | 8 |
| **User Story 6 Tasks** | 5 |
| **User Story 1 Tasks** | 8 |
| **User Story 2 Tasks** | 10 |
| **User Story 3 Tasks** | 7 |
| **User Story 5 Tasks** | 7 |
| **User Story 4 Tasks** | 7 |
| **Polish Tasks** | 9 |
| **Parallel Opportunities** | 12 tasks marked [P] |
| **MVP Scope** | US6 + US1 (Landing page with both roadmaps) |
