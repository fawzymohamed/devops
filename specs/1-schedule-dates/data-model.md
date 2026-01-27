# Data Model: Date-Based Schedule System

**Feature Branch**: `1-schedule-dates`
**Date**: 2026-01-27

## Entity Definitions

### StudySchedule

Represents a user's study configuration for a specific roadmap.

```typescript
/**
 * Study Schedule Interface
 * ------------------------
 * Configuration for projected completion date calculation.
 * Stored within RoadmapProgress in localStorage.
 */
interface StudySchedule {
  /** Start date in ISO format (YYYY-MM-DD) */
  startDate: string

  /** Number of days per week dedicated to studying (1-7) */
  studyDaysPerWeek: number
}
```

**Validation Rules**:
- `startDate`: Valid ISO date string, any date (past, present, future allowed)
- `studyDaysPerWeek`: Integer between 1 and 7 inclusive

**Relationships**:
- Belongs to: `RoadmapProgress` (one schedule per roadmap)

### Extended RoadmapProgress

The existing `RoadmapProgress` interface is extended to include the optional schedule.

```typescript
/**
 * Extended Roadmap Progress Interface
 * ------------------------------------
 * Adds optional study schedule to existing progress tracking.
 */
interface RoadmapProgress {
  /** ISO timestamp when user started this roadmap */
  startedAt: string

  /** Map of phase ID to progress data */
  phases: Record<string, PhaseProgress>

  /** Optional: Last accessed lesson path */
  lastAccessed?: string

  /** Optional: Total time spent in minutes */
  totalTimeSpent?: number

  /** NEW: Optional study schedule for projected dates */
  schedule?: StudySchedule
}
```

**Migration**: None required - additive field, existing data remains valid.

### ProjectedDates (Computed)

Calculated values, not stored. Generated on-demand from schedule + roadmap data.

```typescript
/**
 * Projected Dates Interface
 * -------------------------
 * Calculated completion dates for roadmap and phases.
 */
interface ProjectedDates {
  /** Overall roadmap completion date */
  roadmapCompletion: Date

  /** Completion date for each phase, keyed by phase slug */
  phaseCompletions: Record<string, Date>
}
```

**Calculation Formula**:
```
weeksToComplete = topicCount / studyDaysPerWeek
completionDate = startDate + (weeksToComplete * 7 days)
```

## Storage Schema

### localStorage Key

Uses existing key: `devops-lms-progress`

### Full Schema (v2 Extended)

```typescript
interface MultiRoadmapProgress {
  version: 2
  roadmaps: Record<string, RoadmapProgress>  // Now includes optional schedule
  globalSettings?: GlobalSettings
}
```

### Example Stored Data

```json
{
  "version": 2,
  "roadmaps": {
    "fullstack": {
      "startedAt": "2026-01-15T10:00:00.000Z",
      "phases": {
        "phase-1-core-web-fundamentals": {
          "topics": {}
        }
      },
      "lastAccessed": "phase-1-core-web-fundamentals/html5-essentials/semantic-html",
      "schedule": {
        "startDate": "2026-01-27",
        "studyDaysPerWeek": 6
      }
    },
    "devops": {
      "startedAt": "2026-01-20T08:00:00.000Z",
      "phases": {},
      "schedule": {
        "startDate": "2026-02-01",
        "studyDaysPerWeek": 5
      }
    }
  },
  "globalSettings": {
    "userName": "John Doe"
  }
}
```

## State Transitions

### Schedule Lifecycle

```
[No Schedule] ---(configure)---> [Has Schedule] ---(modify)---> [Has Schedule]
                                      |
                                      +---(remove)---> [No Schedule]
```

### UI State Transitions

```
[Duration Labels] <---(no schedule)--- [Check Schedule] ---(has schedule)---> [Projected Dates]
```

## Composable API

### useSchedule() - New Composable

```typescript
interface UseScheduleReturn {
  // Schedule Management
  hasSchedule: (roadmapId: string) => boolean
  getSchedule: (roadmapId: string) => StudySchedule | null
  setSchedule: (roadmapId: string, schedule: StudySchedule) => void
  removeSchedule: (roadmapId: string) => void

  // Date Calculations
  getProjectedRoadmapCompletion: (roadmapId: string) => Date | null
  getProjectedPhaseCompletion: (roadmapId: string, phaseSlug: string) => Date | null

  // Formatting
  formatProjectedDate: (date: Date) => string
}
```

## Data Flow

```
User Input (Progress Page)
         │
         ▼
┌─────────────────────┐
│  Schedule Settings  │ ◄─── startDate, studyDaysPerWeek
│    Component        │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   useSchedule()     │ ◄─── setSchedule(), getSchedule()
│    Composable       │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   localStorage      │ ◄─── devops-lms-progress key
│                     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  PhaseCard /        │ ◄─── getProjectedPhaseCompletion()
│  Timeline           │
└─────────────────────┘
         │
         ▼
Display: "Completes: Apr 27, 2026" (instead of "1-2 weeks")
```
