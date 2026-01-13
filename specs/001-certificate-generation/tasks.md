# Tasks: Phase Certificate Generation

**Branch**: `001-certificate-generation` | **Date**: 2026-01-13
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md)

## Task Legend

- **Priority**: P1 (Critical), P2 (Important), P3 (Nice-to-have)
- **Story Reference**: US1-US5 (see spec.md for details)
- **Dependency**: Tasks must be completed in order within each phase

---

## Phase 0: Setup & Infrastructure

- [X] [T001] [P1] Create feature branch `001-certificate-generation` if not exists
- [X] [T002] [P1] Create `app/components/certificate/` directory structure

---

## Phase 1: Type Definitions (Foundation)

> Dependencies: None. Required by all other phases.

- [X] [T003] [P1] [US1,US5] Add `PhaseCertificateData` interface to `app/data/types.ts`
  - Fields: certificateId, userName, completionDate, phaseNumber, phaseName, phaseSlug, lessonsCompleted, totalLessons, averageQuizScore, hoursSpent
  - Include JSDoc documentation per constitution

- [X] [T004] [P1] [US5] Add `CourseCertificateData` interface to `app/data/types.ts`
  - Fields: certificateId, userName, completionDate, totalLessonsCompleted, totalHoursSpent, overallQuizScore, phaseCompletionDates[]
  - Include JSDoc documentation

- [X] [T005] [P1] [US4] Add `CertificateStatus` type to `app/data/types.ts`
  - Type: `'locked' | 'unlocked' | 'downloaded'`

- [X] [T006] [P1] [US4] Add `PhaseCertificateStatus` interface to `app/data/types.ts`
  - Fields: phaseNumber, phaseName, phaseSlug, status, completionPercentage, lessonsCompleted, totalLessons, completedAt?

- [X] [T007] [P1] [US3] Extend `UserProgress` interface in `app/data/types.ts`
  - Add optional `userName?: string` field
  - Backward compatible (no migration needed)

---

## Phase 2: Composable Extension

> Dependencies: Phase 1 (type definitions)

- [X] [T008] [P1] [US1] Add `buildPhaseCertificateData(phaseSlug: string)` to `app/composables/useCertificate.ts`
  - Returns `PhaseCertificateData` for a completed phase
  - Generates certificate ID format: `DEVOPS-P{num}-{timestamp}-{random}`
  - Pulls data from useProgress composable

- [X] [T009] [P1] [US5] Add `buildCourseCertificateData()` to `app/composables/useCertificate.ts`
  - Returns `CourseCertificateData` when all 527 lessons complete
  - Generates certificate ID format: `DEVOPS-MASTER-{timestamp}-{random}`
  - Aggregates data across all phases

- [X] [T010] [P1] [US4] Add `getPhaseCertificateStatuses()` to `app/composables/useCertificate.ts`
  - Returns `PhaseCertificateStatus[]` for all 10 phases
  - Maps phase completion from useProgress to certificate status

- [X] [T011] [P1] [US1] Add `canUnlockPhaseCertificate(phaseSlug: string)` to `app/composables/useCertificate.ts`
  - Returns boolean (true when phase is 100% complete)

- [X] [T012] [P1] [US5] Add `canUnlockCourseCertificate()` to `app/composables/useCertificate.ts`
  - Returns boolean (true when all 10 phases are 100% complete)

- [X] [T013] [P2] [US1] Add `getPhaseQuizAverage(phaseSlug: string)` to `app/composables/useCertificate.ts`
  - Returns average quiz score (0-100) for a specific phase

- [X] [T014] [P2] [US1] Add `getPhaseHoursSpent(phaseSlug: string)` to `app/composables/useCertificate.ts`
  - Returns hours spent on a specific phase (derived from lesson time)

- [X] [T015] [P2] [US2] Modify `downloadCertificate()` to support phase-specific filenames
  - Phase: `DevOps-Phase{num}-Certificate-{ID}.pdf`
  - Course: `DevOps-Master-Certificate-{ID}.pdf`

---

## Phase 3: Name Management (US3)

> Dependencies: Phase 1 (T007 - UserProgress extension)

- [ ] [T016] [P2] [US3] Create `app/components/certificate/NameInputModal.vue`
  - Modal component for name entry/edit
  - Input validation (non-empty, trimmed)
  - Save button with loading state
  - Cancel button to dismiss
  - Uses Nuxt UI `UModal`, `UInput`, `UButton`
  - Apply `cursor-pointer` to all buttons

- [ ] [T017] [P2] [US3] Add `setUserName(name: string)` to `app/composables/useProgress.ts`
  - Saves userName to localStorage progress data
  - Validates non-empty string

- [ ] [T018] [P2] [US3] Add `getUserName()` to `app/composables/useProgress.ts`
  - Returns saved userName or undefined if not set

- [ ] [T019] [P2] [US3] Add `hasUserName()` to `app/composables/useProgress.ts`
  - Returns boolean for quick check

---

## Phase 4: Certificate Preview Component (US1, US2)

> Dependencies: Phase 1, Phase 2

- [X] [T020] [P1] [US1] Create `app/components/certificate/CertificatePreview.vue`
  - Visual certificate design component
  - Props: `certificateData: PhaseCertificateData | CourseCertificateData`, `type: 'phase' | 'course'`
  - Dark mode design with gold/amber accent
  - Displays: learner name, phase/course name, completion date, lessons count, hours, quiz score, certificate ID
  - A4 landscape aspect ratio (297:210)
  - Ref exposed for PDF capture (`certificateRef`)

- [X] [T021] [P1] [US1] Implement phase certificate variant in CertificatePreview
  - Phase number badge
  - Phase-specific title (e.g., "Phase 1: Software Development Lifecycle")
  - Lessons completed / total display

- [X] [T022] [P1] [US5] Implement course certificate variant in CertificatePreview
  - "DevOps Master Certificate" title
  - Gold border for prestige
  - Aggregate statistics display
  - All 10 phase completion indicators

---

## Phase 5: Download Button Component (US2)

> Dependencies: Phase 4

- [ ] [T023] [P1] [US2] Create `app/components/certificate/CertificateDownloadButton.vue`
  - Props: `certificateRef: HTMLElement`, `filename: string`, `disabled: boolean`
  - Emits: `download:start`, `download:complete`, `download:error`
  - Loading state during PDF generation
  - Uses html2canvas + jsPDF from existing composable
  - Error display with retry capability
  - Apply `cursor-pointer` class

- [ ] [T024] [P1] [US2] Integrate with useCertificate composable
  - Call generatePDF and downloadCertificate functions
  - Handle error states

---

## Phase 6: Dashboard Card Component (US4)

> Dependencies: Phase 2 (T010)

- [ ] [T025] [P2] [US4] Create `app/components/certificate/CertificateCard.vue`
  - Props: `status: PhaseCertificateStatus`
  - Visual distinction for locked vs unlocked states
  - Locked: Progress bar, percentage, lessons remaining
  - Unlocked: "View Certificate" button, completion date badge
  - Phase icon/number display
  - Hover states for interactivity
  - Apply `cursor-pointer` to interactive elements

- [ ] [T026] [P2] [US4] Add "Resume Learning" link for locked phases
  - Links to first incomplete lesson in phase
  - Uses getResumeLearningData from useProgress

---

## Phase 7: Certificate Dashboard Page (US4)

> Dependencies: Phase 3, Phase 4, Phase 5, Phase 6

- [ ] [T027] [P1] [US4] Create `app/pages/certificate.vue`
  - Route: `/certificate`
  - Page title and breadcrumb
  - Grid layout for 10 phase certificate cards
  - Responsive: 1 col mobile, 2 col tablet, 3 col desktop

- [ ] [T028] [P2] [US4] Add overall progress summary section
  - Total phases completed / 10
  - Total lessons completed / 527
  - Visual progress ring

- [ ] [T029] [P2] [US3] Integrate name entry modal
  - Prompt on first certificate view if no name set
  - "Edit Name" option accessible from page
  - Name displayed in header area

- [ ] [T030] [P1] [US1] Implement certificate preview modal/view
  - Opens when "View Certificate" clicked
  - Shows CertificatePreview component
  - Download button below preview
  - Close/dismiss option

- [ ] [T031] [P3] [US5] Add Course Completion Certificate section
  - Prominent display at top when unlocked
  - Locked state shows phases remaining
  - "Complete all phases to unlock" message

---

## Phase 8: Navigation Integration

> Dependencies: Phase 7

- [ ] [T032] [P2] Add certificate page link to main navigation
  - Add to header navigation menu
  - Icon: certificate/award icon from Lucide

- [ ] [T033] [P2] Add certificate prompt on phase completion
  - Show toast/notification when phase completed
  - Link to certificate page

---

## Phase 9: Polish & Error Handling

> Dependencies: All previous phases

- [ ] [T034] [P2] [US2] Add loading states to all async operations
  - PDF generation loading indicator
  - Dashboard loading skeleton

- [ ] [T035] [P2] [US2] Implement error handling for PDF generation
  - Error message display
  - Retry button
  - Console error logging

- [ ] [T036] [P3] Add empty state for new users
  - Encouraging message when no certificates earned
  - Link to start learning

- [ ] [T037] [P3] Add certificate count badge to navigation
  - Shows number of earned certificates
  - Updates dynamically

---

## Task Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P1 | 18 | Core certificate functionality |
| P2 | 15 | Name entry, dashboard, navigation |
| P3 | 4 | Polish and enhancements |
| **Total** | **37** | |

### Story Coverage

| Story | Tasks | Description |
|-------|-------|-------------|
| US1 | T003, T008, T011, T020, T021, T30 | View Phase Certificate |
| US2 | T015, T023, T024, T34, T35 | Download Certificate as PDF |
| US3 | T007, T016-T019, T29 | Enter Name for Certificate |
| US4 | T005, T006, T010, T025-T028 | View All Certificates Dashboard |
| US5 | T004, T009, T012, T022, T31 | Earn Course Completion Certificate |

### Dependency Graph

```
Phase 0 (Setup)
    │
    ▼
Phase 1 (Types) ──────────────────────────────┐
    │                                         │
    ▼                                         │
Phase 2 (Composable) ◄────────────────────────┤
    │                                         │
    ├─────────────┬───────────────┐           │
    ▼             ▼               ▼           │
Phase 3       Phase 4         Phase 6 ◄───────┘
(Name)        (Preview)       (Card)
    │             │               │
    │             ▼               │
    │         Phase 5             │
    │         (Download)          │
    │             │               │
    └─────────────┴───────────────┘
                  │
                  ▼
              Phase 7 (Page)
                  │
                  ▼
              Phase 8 (Nav)
                  │
                  ▼
              Phase 9 (Polish)
```

---

## Implementation Notes

1. **SSR Safety**: All localStorage access must be wrapped in client-only checks or use `onMounted`
2. **Constitution Compliance**: All components must include comprehensive JSDoc/comment documentation
3. **Dark Mode**: Use gray-800 backgrounds, gold/amber accents for certificates
4. **Cursor Pointer**: Apply `cursor-pointer` class to all interactive elements
5. **Existing Patterns**: Follow existing useCertificate and useProgress patterns
