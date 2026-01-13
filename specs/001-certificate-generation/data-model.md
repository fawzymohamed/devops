# Data Model: Phase Certificate Generation

**Date**: 2026-01-12
**Feature Branch**: `001-certificate-generation`

## Entity Definitions

### 1. PhaseCertificateData (NEW)

Represents certificate data for a single phase completion.

**Location**: `app/data/types.ts`

```typescript
/**
 * Phase Certificate Data Interface
 * ---------------------------------
 * Contains information for a phase-level completion certificate.
 * Extends base certificate concept with phase-specific fields.
 */
export interface PhaseCertificateData {
  /** Unique certificate identifier (format: DEVOPS-P{num}-{timestamp}-{random}) */
  certificateId: string
  /** Learner's full name */
  userName: string
  /** Phase completion date (ISO string) */
  completionDate: string
  /** Phase number (1-10) */
  phaseNumber: number
  /** Phase display name (e.g., "Software Development Lifecycle") */
  phaseName: string
  /** Phase slug for navigation (e.g., "phase-1-sdlc") */
  phaseSlug: string
  /** Number of lessons completed in this phase */
  lessonsCompleted: number
  /** Total lessons in this phase */
  totalLessons: number
  /** Average quiz score for this phase (0-100) */
  averageQuizScore: number
  /** Hours spent on this phase */
  hoursSpent: number
}
```

**Validation Rules**:
- `phaseNumber`: Must be 1-10
- `userName`: Non-empty string, trimmed
- `lessonsCompleted`: Must equal `totalLessons` (100% completion required)
- `averageQuizScore`: 0-100, rounded to nearest integer

### 2. CourseCertificateData (NEW)

Represents certificate data for full course completion.

**Location**: `app/data/types.ts`

```typescript
/**
 * Course Completion Certificate Data Interface
 * --------------------------------------------
 * Contains information for the "DevOps Master Certificate".
 * Awarded when all 10 phases are completed.
 */
export interface CourseCertificateData {
  /** Unique certificate identifier (format: DEVOPS-MASTER-{timestamp}-{random}) */
  certificateId: string
  /** Learner's full name */
  userName: string
  /** Course completion date (ISO string) */
  completionDate: string
  /** Total lessons completed (should be 527) */
  totalLessonsCompleted: number
  /** Total hours spent on entire course */
  totalHoursSpent: number
  /** Overall average quiz score (0-100) */
  overallQuizScore: number
  /** Array of phase completion dates (10 entries) */
  phaseCompletionDates: string[]
}
```

**Validation Rules**:
- `totalLessonsCompleted`: Must equal 527 (all lessons)
- `phaseCompletionDates`: Must have 10 entries, all valid ISO dates

### 3. UserProgress (EXTEND)

Extend existing interface to include learner name.

**Location**: `app/data/types.ts` (modify existing)

```typescript
/**
 * User Progress Interface (EXTENDED)
 * -----------------------------------
 * Root interface for tracking all user progress.
 * CHANGE: Added userName field for certificate personalization.
 */
export interface UserProgress {
  /** ISO timestamp when user started the course */
  startedAt: string
  /** Map of phase ID to progress data */
  phases: Record<string, PhaseProgress>
  /** Optional: Last accessed lesson path */
  lastAccessed?: string
  /** Optional: Total time spent in minutes */
  totalTimeSpent?: number
  /** NEW: Learner's full name for certificates */
  userName?: string
}
```

**Migration**: No migration needed - new optional field with backward compatibility.

### 4. CertificateStatus (NEW)

Enum-like type for certificate state in dashboard.

**Location**: `app/data/types.ts`

```typescript
/**
 * Certificate Status Type
 * -----------------------
 * Represents the current state of a certificate in the dashboard.
 */
export type CertificateStatus = 'locked' | 'unlocked' | 'downloaded'

/**
 * Phase Certificate Status Interface
 * -----------------------------------
 * Tracks certificate status for dashboard display.
 */
export interface PhaseCertificateStatus {
  /** Phase number (1-10) */
  phaseNumber: number
  /** Phase display name */
  phaseName: string
  /** Phase slug */
  phaseSlug: string
  /** Current certificate status */
  status: CertificateStatus
  /** Completion percentage (0-100) */
  completionPercentage: number
  /** Lessons completed */
  lessonsCompleted: number
  /** Total lessons in phase */
  totalLessons: number
  /** Completion date if unlocked (ISO string) */
  completedAt?: string
}
```

## Entity Relationships

```
┌─────────────────────┐
│    UserProgress     │
│  (localStorage)     │
├─────────────────────┤
│ userName?           │──────────────────────────────────────┐
│ phases              │                                      │
│ totalTimeSpent?     │                                      │
└─────────────────────┘                                      │
         │                                                   │
         │ derives                                           │
         ▼                                                   │
┌─────────────────────┐      generates      ┌───────────────▼───────────┐
│ PhaseCertificate    │◄────────────────────│    useCertificate         │
│      Status         │                     │    composable             │
├─────────────────────┤                     ├───────────────────────────┤
│ phaseNumber         │                     │ buildPhaseCertificateData │
│ status              │                     │ buildCourseCertificateData│
│ completionPercentage│                     │ downloadCertificate       │
└─────────────────────┘                     └───────────────────────────┘
         │                                            │
         │ when status=unlocked                       │
         ▼                                            ▼
┌─────────────────────┐                     ┌───────────────────────────┐
│ PhaseCertificateData│                     │  CourseCertificateData    │
├─────────────────────┤                     ├───────────────────────────┤
│ certificateId       │                     │ certificateId             │
│ userName            │                     │ userName                  │
│ phaseNumber         │                     │ totalLessonsCompleted     │
│ phaseName           │                     │ overallQuizScore          │
│ lessonsCompleted    │                     │ phaseCompletionDates[]    │
└─────────────────────┘                     └───────────────────────────┘
```

## State Transitions

### Certificate Status State Machine

```
                    ┌──────────────────┐
                    │     locked       │
                    │  (default state) │
                    └────────┬─────────┘
                             │
                             │ phase 100% complete
                             ▼
                    ┌──────────────────┐
                    │    unlocked      │
                    │  (viewable)      │
                    └────────┬─────────┘
                             │
                             │ user downloads PDF
                             ▼
                    ┌──────────────────┐
                    │   downloaded     │
                    │  (badge shown)   │
                    └──────────────────┘
```

**Note**: `downloaded` status is derived from presence in localStorage tracking (optional enhancement), not required for MVP.

## localStorage Schema

### Key: `devops-lms-progress`

```typescript
{
  startedAt: "2026-01-01T00:00:00.000Z",
  userName: "Jane Doe",                    // NEW FIELD
  totalTimeSpent: 1234,                    // minutes
  lastAccessed: "phase-1-sdlc/sdlc-models/waterfall-model",
  phases: {
    "phase-1-sdlc": {
      topics: {
        "sdlc-models": {
          subtopics: {
            "waterfall-model": {
              completed: true,
              completedAt: "2026-01-02T10:30:00.000Z",
              quizScore: 85,
              quizCompletedAt: "2026-01-02T10:35:00.000Z"
            }
          }
        }
      }
    }
  }
}
```

## Data Derivation Functions

These functions derive certificate data from progress state:

| Function | Input | Output | Notes |
|----------|-------|--------|-------|
| `getPhaseCertificateStatuses()` | UserProgress | PhaseCertificateStatus[] | Maps all 10 phases |
| `canUnlockPhaseCertificate(phaseSlug)` | UserProgress, phaseSlug | boolean | Checks 100% |
| `canUnlockCourseCertificate()` | UserProgress | boolean | Checks all phases 100% |
| `getPhaseQuizAverage(phaseSlug)` | UserProgress, phaseSlug | number | Phase-specific quiz avg |
| `getPhaseHoursSpent(phaseSlug)` | UserProgress, phaseSlug | number | Derived from totalTimeSpent |

## No API Contracts Required

This feature is entirely client-side with no backend API. All data flows through:
1. localStorage (read/write progress + name)
2. DOM rendering (certificate preview)
3. Browser APIs (html2canvas, jsPDF, download)
