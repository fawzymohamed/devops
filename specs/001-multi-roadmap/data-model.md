# Data Model: Multi-Roadmap Support

**Feature**: 001-multi-roadmap
**Date**: 2026-01-13
**Status**: Complete

## Entity Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ROADMAP REGISTRY                               │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│  │   DevOps     │      │  Full Stack  │      │  Future...   │          │
│  │   Roadmap    │      │   Roadmap    │      │   Roadmap    │          │
│  └──────┬───────┘      └──────┬───────┘      └──────────────┘          │
│         │                     │                                         │
└─────────┼─────────────────────┼─────────────────────────────────────────┘
          │                     │
          ▼                     ▼
    ┌─────────────────────────────────────────────┐
    │                   PHASE                      │
    │  (10 for DevOps, 13 for Full Stack)         │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
    ┌─────────────────────────────────────────────┐
    │                   TOPIC                      │
    │  (69 for DevOps, 79 for Full Stack)         │
    └──────────────────────┬──────────────────────┘
                           │
                           ▼
    ┌─────────────────────────────────────────────┐
    │              SUBTOPIC/LESSON                 │
    │  (527 for DevOps, 450+ for Full Stack)      │
    └─────────────────────────────────────────────┘
```

## New Entity: Roadmap

### Definition

```typescript
/**
 * Roadmap Interface
 * -----------------
 * Top-level entity representing a complete learning path.
 * Contains metadata and references to phase data.
 */
export interface Roadmap {
  /** Unique identifier (e.g., 'devops', 'fullstack') */
  id: string

  /** URL-friendly slug (e.g., 'devops', 'fullstack') */
  slug: string

  /** Display title (e.g., 'DevOps Roadmap') */
  title: string

  /** Short description for landing page */
  description: string

  /** Full description for roadmap home page */
  fullDescription: string

  /** Emoji icon for visual identification */
  icon: string

  /** Certificate title when completed */
  certificateTitle: string

  /** Content directory path (empty for root, or 'fullstack') */
  contentPath: string

  /** URL prefix for routes (empty for root, or 'fullstack') */
  routePrefix: string

  /** Priority labels for this roadmap */
  priorityLabels: {
    essential: string
    important: string
    recommended: string
  }

  /** Phase data array */
  phases: Phase[]

  /** Computed statistics */
  stats: {
    phaseCount: number
    topicCount: number
    subtopicCount: number
    totalWeeks: number
  }
}
```

### Validation Rules

| Field | Rule |
|-------|------|
| id | Required, unique, lowercase alphanumeric + hyphens |
| slug | Required, unique, URL-safe characters only |
| title | Required, max 100 characters |
| contentPath | Optional, valid directory name or empty string |
| routePrefix | Optional, valid URL path segment or empty string |
| phases | Required, non-empty array |

### Instances

#### DevOps Roadmap

```typescript
const devopsRoadmap: Roadmap = {
  id: 'devops',
  slug: 'devops',
  title: 'DevOps Roadmap',
  description: 'Master DevOps from SDLC to DevSecOps certification',
  fullDescription: 'Comprehensive path to becoming a DevOps engineer...',
  icon: '🚀',
  certificateTitle: 'DevOps Master Certificate',
  contentPath: '',  // Root level content
  routePrefix: '',  // Root level routes
  priorityLabels: {
    essential: 'Must Know',
    important: 'Should Know',
    recommended: 'Good to Know'
  },
  phases: roadmapData,  // Existing data from roadmap.ts
  stats: {
    phaseCount: 10,
    topicCount: 69,
    subtopicCount: 527,
    totalWeeks: 24
  }
}
```

#### Full Stack Interview Roadmap

```typescript
const fullstackRoadmap: Roadmap = {
  id: 'fullstack',
  slug: 'fullstack',
  title: 'Full Stack Developer Interview Mastery',
  description: 'Master JavaScript, TypeScript, Vue, React, Node.js & more',
  fullDescription: 'Comprehensive roadmap for full stack developer interviews...',
  icon: '💻',
  certificateTitle: 'Full Stack Interview Mastery Certificate',
  contentPath: 'fullstack',
  routePrefix: 'fullstack',
  priorityLabels: {
    essential: 'Must Know',
    important: 'Should Know',
    recommended: 'Good to Know'
  },
  phases: fullstackData,  // New data from fullstack-roadmap.ts
  stats: {
    phaseCount: 13,
    topicCount: 79,
    subtopicCount: 450,
    totalWeeks: 32
  }
}
```

---

## Modified Entity: UserProgress → MultiRoadmapProgress

### Previous Structure (v1)

```typescript
interface UserProgress {
  startedAt: string
  phases: Record<string, PhaseProgress>
  lastAccessed?: string
  totalTimeSpent?: number
  userName?: string
}
```

### New Structure (v2)

```typescript
/**
 * Multi-Roadmap Progress Interface
 * ---------------------------------
 * Root interface for tracking progress across all roadmaps.
 * Stored in localStorage under 'devops-lms-progress' key.
 */
export interface MultiRoadmapProgress {
  /** Schema version for migration support */
  version: 2

  /** Progress data per roadmap, keyed by roadmap ID */
  roadmaps: Record<string, RoadmapProgress>

  /** Global settings shared across roadmaps */
  globalSettings?: GlobalSettings
}

/**
 * Roadmap Progress Interface
 * --------------------------
 * Progress data for a single roadmap.
 * Mirrors the previous UserProgress structure.
 */
export interface RoadmapProgress {
  /** ISO timestamp when user started this roadmap */
  startedAt: string

  /** Map of phase ID to progress data */
  phases: Record<string, PhaseProgress>

  /** Last accessed lesson path within this roadmap */
  lastAccessed?: string

  /** Total time spent on this roadmap in minutes */
  totalTimeSpent?: number
}

/**
 * Global Settings Interface
 * -------------------------
 * Settings that apply across all roadmaps.
 */
export interface GlobalSettings {
  /** User's name for certificates */
  userName?: string

  /** Preferred theme (reserved for future use) */
  theme?: 'dark'
}
```

### State Transitions

```
┌─────────────────┐         ┌─────────────────┐
│   First Visit   │────────▶│  No Progress    │
│   (new user)    │         │  (empty state)  │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼ Start lesson
┌─────────────────┐         ┌─────────────────┐
│   Returning     │────────▶│  Has Progress   │
│   (with data)   │         │  (partial)      │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼ Complete all
                            ┌─────────────────┐
                            │   Completed     │
                            │  (100%)         │
                            └─────────────────┘
```

### Migration Logic

```typescript
/**
 * Migrate from v1 (single roadmap) to v2 (multi-roadmap) format
 */
function migrateProgressData(stored: unknown): MultiRoadmapProgress {
  // Check if already v2
  if (isMultiRoadmapProgress(stored)) {
    return stored
  }

  // Check if v1 (legacy single-roadmap)
  if (isLegacyProgress(stored)) {
    const legacy = stored as LegacyUserProgress
    return {
      version: 2,
      roadmaps: {
        devops: {
          startedAt: legacy.startedAt,
          phases: legacy.phases,
          lastAccessed: legacy.lastAccessed,
          totalTimeSpent: legacy.totalTimeSpent
        }
      },
      globalSettings: {
        userName: legacy.userName
      }
    }
  }

  // Unknown format - return empty state
  return createDefaultMultiProgress()
}
```

---

## Existing Entities (Unchanged)

### Phase

```typescript
export interface Phase {
  phase: number
  title: string
  slug: string
  duration: string
  color: string
  icon: string
  description: string
  topics: Topic[]
}
```

### Topic

```typescript
export interface Topic {
  name: string
  slug?: string
  subtopics: string[]
  priority: Priority
}
```

### Priority

```typescript
export type Priority = 'essential' | 'important' | 'recommended'

export const priorityConfig = {
  essential: { color: 'red', label: 'Must Know' },
  important: { color: 'amber', label: 'Should Know' },
  recommended: { color: 'blue', label: 'Good to Know' }
} as const
```

---

## Entity Relationships

```
Roadmap (1) ─────────────────────────▶ (*) Phase
    │                                      │
    │ id: 'devops' | 'fullstack'          │
    │ contentPath: '' | 'fullstack'        │
    │                                      │
    ▼                                      ▼
MultiRoadmapProgress.roadmaps[id]    Topic (*)
    │                                      │
    │ phases: Record<slug, PhaseProgress>  │
    │                                      │
    ▼                                      ▼
RoadmapProgress.phases[slug]         Subtopic (*)
    │                                      │
    │ topics: Record<slug, TopicProgress>  │
    │                                      │
    ▼                                      ▼
TopicProgress.subtopics[slug]        Lesson Content
    │                                (in content/ dir)
    │
    ▼
SubtopicProgress
    - completed: boolean
    - completedAt: string | null
    - quizScore: number | null
```

---

## Data Files Structure

```
app/data/
├── types.ts              # TypeScript interfaces (add Roadmap, MultiRoadmapProgress)
├── roadmap.ts            # KEEP: DevOps phase/topic data (rename export)
├── fullstack-roadmap.ts  # NEW: Full Stack phase/topic data
└── roadmaps.ts           # NEW: Roadmap registry
```

### roadmaps.ts

```typescript
import { devopsPhases } from './roadmap'
import { fullstackPhases } from './fullstack-roadmap'
import type { Roadmap } from './types'

export const devopsRoadmap: Roadmap = {
  id: 'devops',
  slug: 'devops',
  // ... configuration
  phases: devopsPhases
}

export const fullstackRoadmap: Roadmap = {
  id: 'fullstack',
  slug: 'fullstack',
  // ... configuration
  phases: fullstackPhases
}

export const allRoadmaps: Roadmap[] = [devopsRoadmap, fullstackRoadmap]

export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return allRoadmaps.find(r => r.slug === slug)
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return allRoadmaps.find(r => r.id === id)
}
```
