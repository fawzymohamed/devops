# Composable Contracts: Multi-Roadmap Support

**Feature**: 001-multi-roadmap
**Date**: 2026-01-13

## useRoadmap() Composable

### Purpose
Provides roadmap context and utilities for accessing roadmap data across the application.

### Interface

```typescript
interface UseRoadmapReturn {
  // State (readonly)
  currentRoadmap: Readonly<Ref<Roadmap | null>>
  allRoadmaps: Readonly<Roadmap[]>

  // Actions
  setCurrentRoadmap(roadmap: Roadmap): void
  setCurrentRoadmapBySlug(slug: string): boolean

  // Queries
  getRoadmapBySlug(slug: string): Roadmap | undefined
  getRoadmapById(id: string): Roadmap | undefined
  getRoadmapFromRoute(): Roadmap | undefined

  // Utilities
  getContentPath(roadmapSlug: string): string
  getRoutePath(roadmapSlug: string, ...segments: string[]): string
  getLessonPath(roadmapSlug: string, phase: string, topic: string, subtopic: string): string
}

function useRoadmap(): UseRoadmapReturn
```

### Usage Examples

```typescript
// In a page component
const { currentRoadmap, setCurrentRoadmapBySlug, getRoadmapFromRoute } = useRoadmap()

// Set roadmap from route on mount
onMounted(() => {
  const roadmap = getRoadmapFromRoute()
  if (roadmap) {
    setCurrentRoadmapBySlug(roadmap.slug)
  }
})

// Access current roadmap
const phases = computed(() => currentRoadmap.value?.phases ?? [])
```

---

## useProgress() Composable (Modified)

### Purpose
Manages user progress tracking with multi-roadmap support.

### Interface Changes

```typescript
interface UseProgressReturn {
  // State (readonly)
  progress: Readonly<Ref<MultiRoadmapProgress>>

  // Actions - now require roadmapId parameter
  markComplete(roadmapId: string, phaseId: string, topicId: string, subtopicId: string, estimatedMinutes?: number): void
  markIncomplete(roadmapId: string, phaseId: string, topicId: string, subtopicId: string): void
  recordQuizScore(roadmapId: string, phaseId: string, topicId: string, subtopicId: string, score: number): void

  // Queries - now require roadmapId parameter
  isComplete(roadmapId: string, phaseId: string, topicId?: string, subtopicId?: string): boolean
  getSubtopicProgress(roadmapId: string, phaseId: string, topicId: string, subtopicId: string): SubtopicProgress | undefined

  // Aggregated counts - per roadmap
  getCompletedCount(roadmapId: string): number
  getCompletedCountForPhase(roadmapId: string, phaseId: string): number
  getCompletedCountForTopic(roadmapId: string, phaseId: string, topicId: string): number

  // Percentages - per roadmap
  getCompletionPercentage(roadmapId: string): number
  getPhaseCompletionPercentage(roadmapId: string, phaseId: string): number
  getTopicCompletionPercentage(roadmapId: string, phaseId: string, topicId: string): number
  getAverageQuizScore(roadmapId: string): number

  // Roadmap data helpers - now require roadmapId
  getTotalLessonCount(roadmapId: string): number
  getPhaseSubtopicCount(roadmapId: string, phaseId: string): number
  getTopicSubtopicCount(roadmapId: string, phaseId: string, topicId: string): number

  // Time tracking - per roadmap
  getTotalTimeSpentHours(roadmapId: string): number
  getTotalTimeSpentMinutes(roadmapId: string): number

  // Certificate eligibility - per roadmap
  canGenerateCertificate(roadmapId: string): boolean
  getCertificateProgress(roadmapId: string): number

  // Resume learning - per roadmap
  getResumeLearningData(roadmapId: string): ResumeLearningData | null

  // Global settings
  setUserName(name: string): boolean
  getUserName(): string | undefined
  hasUserName(): boolean

  // Data management - includes all roadmaps
  exportProgress(): string
  importProgress(data: string): boolean
  resetProgress(): void
  resetRoadmapProgress(roadmapId: string): void
}
```

### Migration Behavior

```typescript
// Called automatically on composable initialization
function initializeProgress(): MultiRoadmapProgress {
  const stored = loadFromStorage()

  if (!stored) {
    return createDefaultMultiProgress()
  }

  // Migrate if needed (v1 → v2)
  if (!stored.version || stored.version < 2) {
    const migrated = migrateToV2(stored)
    saveToStorage(migrated)
    return migrated
  }

  return stored
}
```

---

## useCertificate() Composable (Modified)

### Purpose
Generates certificates with roadmap-specific branding.

### Interface Changes

```typescript
interface UseCertificateReturn {
  // State
  isGenerating: Ref<boolean>
  error: Ref<string | null>

  // Actions - now require roadmapId
  generateCourseCertificate(roadmapId: string): Promise<CourseCertificateData | null>
  generatePhaseCertificate(roadmapId: string, phaseSlug: string): Promise<PhaseCertificateData | null>
  downloadCertificate(roadmapId: string, type: 'course' | 'phase', phaseSlug?: string): Promise<void>

  // Queries - per roadmap
  canGenerateCourseCertificate(roadmapId: string): boolean
  canGeneratePhaseCertificate(roadmapId: string, phaseSlug: string): boolean
  getPhaseCertificateStatuses(roadmapId: string): PhaseCertificateStatus[]
}
```

### Certificate ID Format

```typescript
// Course certificate
`${ROADMAP_ID}-MASTER-${timestamp}-${randomHex}`
// Example: DEVOPS-MASTER-20260113-a1b2c3
// Example: FULLSTACK-MASTER-20260113-d4e5f6

// Phase certificate
`${ROADMAP_ID}-P${phaseNumber}-${timestamp}-${randomHex}`
// Example: DEVOPS-P1-20260113-a1b2c3
// Example: FULLSTACK-P5-20260113-d4e5f6
```

---

## Component Props Contracts

### RoadmapCard.vue

```typescript
interface RoadmapCardProps {
  /** Roadmap data object */
  roadmap: Roadmap
  /** Completion percentage (0-100) */
  progress?: number
  /** Whether to show progress indicator */
  showProgress?: boolean
}

interface RoadmapCardEmits {
  (e: 'select', roadmap: Roadmap): void
}
```

### PhaseCard.vue (Modified)

```typescript
interface PhaseCardProps {
  phase: Phase
  /** NEW: Roadmap context for progress queries */
  roadmapId?: string
  // ... existing props
}
```

### TopicCard.vue (Modified)

```typescript
interface TopicCardProps {
  topic: Topic
  phaseSlug: string
  /** NEW: Roadmap context for progress queries */
  roadmapId?: string
  // ... existing props
}
```

### OverallProgress.vue (Modified)

```typescript
interface OverallProgressProps {
  /** NEW: Roadmap to display progress for */
  roadmapId: string
  // ... existing props
}
```
