# Phase 4: Progress Tracking System - Implementation Plan

## Overview

Complete the progress tracking system with visual components, UI integrations, and a dedicated progress page.

**Scope:**
- Enhance `useProgress` composable with phase/topic completion, time tracking, certificate eligibility
- Create 4 progress components (ProgressBar, ProgressRing, PhaseProgress, OverallProgress)
- Create `/progress` page with detailed stats
- Integrate progress display into PhaseCard, TopicCard, StatsFooter, and main page
- Wire quiz score recording to QuizContainer

---

## Part 1: useProgress Composable Enhancements

**File:** `app/composables/useProgress.ts`

### 1.1 Add Roadmap Import
```typescript
import { roadmapData } from '~/data/roadmap'
```

### 1.2 New Functions to Add

| Function | Purpose |
|----------|---------|
| `getTotalLessonCount()` | Total lessons from roadmap (excluding cheat sheets) |
| `getPhaseSubtopicCount(phaseSlug)` | Lesson count for a phase |
| `getTopicSubtopicCount(phaseSlug, topicSlug)` | Lesson count for a topic |
| `getCompletedCountForPhase(phaseId)` | Completed count in phase |
| `getCompletedCountForTopic(phaseId, topicId)` | Completed count in topic |
| `getPhaseCompletionPercentage(phaseId)` | Phase completion % (0-100) |
| `getTopicCompletionPercentage(phaseId, topicId)` | Topic completion % (0-100) |
| `canGenerateCertificate()` | Check if 100% complete |
| `getCertificateProgress()` | Progress toward certificate (0-100) |
| `getResumeLearningData()` | Parse lastAccessed for resume button |
| `getTotalTimeSpentHours()` | Convert totalTimeSpent minutes to hours |

### 1.3 Fix `isComplete()` Function

Current behavior: Returns `false` for phase/topic level checks.

Fix: Calculate actual completion by counting completed subtopics vs total.

```typescript
function isComplete(phaseId: string, topicId?: string, subtopicId?: string): boolean {
  if (subtopicId) {
    return !!progress.value.phases[phaseId]?.topics[topicId!]?.subtopics[subtopicId]?.completed
  }
  if (topicId) {
    const total = getTopicSubtopicCount(phaseId, topicId)
    return total > 0 && getCompletedCountForTopic(phaseId, topicId) >= total
  }
  const total = getPhaseSubtopicCount(phaseId)
  return total > 0 && getCompletedCountForPhase(phaseId) >= total
}
```

### 1.4 Update `markComplete()` for Time Tracking

Add optional `estimatedMinutes` parameter:
```typescript
function markComplete(phaseId, topicId, subtopicId, estimatedMinutes?: number)
```

Accumulate time only when marking complete for first time:
```typescript
if (!existing?.completed && estimatedMinutes) {
  progress.value.totalTimeSpent = (progress.value.totalTimeSpent ?? 0) + estimatedMinutes
}
```

---

## Part 2: Progress Components

### 2.1 ProgressBar.vue
**File:** `app/components/progress/ProgressBar.vue`

Wrapper around Nuxt UI `UProgress` with consistent styling.

```typescript
interface Props {
  value: number        // 0-100
  max?: number         // default: 100
  showLabel?: boolean  // show percentage text
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
}
```

### 2.2 ProgressRing.vue
**File:** `app/components/progress/ProgressRing.vue`

SVG circular progress indicator.

```typescript
interface Props {
  value: number         // 0-100
  size?: number         // pixels (default: 48)
  strokeWidth?: number  // default: 4
  showLabel?: boolean   // show % in center
  color?: string        // hex color
}
```

SVG structure:
- Background circle (gray)
- Progress circle (colored, animated stroke-dashoffset)
- Center text (optional)

### 2.3 PhaseProgress.vue
**File:** `app/components/progress/PhaseProgress.vue`

Phase-level progress card for the progress page.

```typescript
interface Props {
  phase: Phase
}
```

Shows:
- Phase icon and name
- ProgressRing with phase completion %
- Topic list with individual progress bars

### 2.4 OverallProgress.vue
**File:** `app/components/progress/OverallProgress.vue`

Hero component for overall course progress.

```typescript
interface Props {
  compact?: boolean  // smaller version for main page
}
```

Shows:
- Large progress bar/ring
- Completed/Total lessons
- Time spent
- Average quiz score
- Certificate status
- Resume Learning button

---

## Part 3: Progress Page

**File:** `app/pages/progress.vue`

### Page Structure

```
+----------------------------------------------------------+
|  Breadcrumb: Home > Progress                              |
+----------------------------------------------------------+
|  OverallProgress Component                                |
|  - Large progress display                                 |
|  - Stats: X/527 lessons, Y hours, Z% avg quiz            |
|  - Resume Learning button                                 |
|  - Certificate status indicator                           |
+----------------------------------------------------------+
|  Phase-by-Phase Breakdown                                 |
|  +------------------------------------------------------+ |
|  | Phase 1: SDLC                    [Ring: 80%]         | |
|  | - SDLC Models      5/5  [========]                   | |
|  | - SDLC Phases      6/6  [========]                   | |
|  | - Dev Workflows    3/5  [======  ]                   | |
|  +------------------------------------------------------+ |
|  | Phase 2: Foundations             [Ring: 0%]          | |
|  | ...                                                  | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
|  Data Management                                          |
|  [Export]  [Import]  [Reset (with confirmation)]         |
+----------------------------------------------------------+
```

---

## Part 4: UI Integrations

### 4.1 PhaseCard.vue
**File:** `app/components/PhaseCard.vue`

Changes:
1. Import `useProgress`
2. Add `ProgressRing` in top-right corner (only when progress > 0)
3. Add completion badge when 100%

```vue
<ProgressRing
  v-if="phaseCompletion > 0"
  :value="phaseCompletion"
  :size="40"
  :color="phase.color"
  show-label
  class="absolute top-2 right-2"
/>
```

### 4.2 TopicCard.vue
**File:** `app/components/TopicCard.vue`

Changes:
1. Import `useProgress`
2. Add completion checkmark icon before completed subtopics
3. Add completion count badge in header

```vue
<!-- In subtopic list -->
<UIcon
  v-if="isSubtopicComplete(subtopic)"
  name="i-lucide-check-circle"
  class="w-4 h-4 text-green-500 mr-2"
/>

<!-- In header -->
<UBadge v-if="completedCount > 0" color="success" size="xs">
  {{ completedCount }}/{{ topic.subtopics.length }}
</UBadge>
```

### 4.3 StatsFooter.vue
**File:** `app/components/StatsFooter.vue`

Changes:
1. Import `useProgress`
2. Add progress section above existing stats

```vue
<div class="mb-6">
  <div class="flex items-center justify-between mb-2">
    <span class="text-gray-400">Your Progress</span>
    <span class="text-lg font-bold text-green-500">{{ completionPercentage }}%</span>
  </div>
  <UProgress :model-value="completionPercentage" color="success" />
  <div class="flex justify-between mt-2 text-sm text-gray-500">
    <span>{{ completedCount }} of {{ totalLessons }} lessons</span>
    <NuxtLink v-if="resumeData" :to="resumeData.path" class="text-primary-500 cursor-pointer">
      Resume Learning &rarr;
    </NuxtLink>
  </div>
</div>
```

### 4.4 Main Page (index.vue)
**File:** `app/pages/index.vue`

Changes:
1. Import `useProgress`
2. Add progress indicator after hero section (only when progress exists)
3. Add link to /progress page

---

## Part 5: Wire Quiz Score Recording

**File:** `app/pages/[phase]/[topic]/[subtopic].vue`

### Changes:

1. Import `recordQuizScore` from useProgress
2. Update quiz complete handler:

```typescript
const { markComplete, isComplete, recordQuizScore } = useProgress()

// In template:
@complete="(score, passed) => {
  recordQuizScore(phase, topic, subtopic, score)
  if (passed && !lessonCompleted) {
    handleMarkComplete()
  }
}"
```

3. Pass `estimatedMinutes` to markComplete:
```typescript
function handleMarkComplete() {
  markComplete(phase, topic, subtopic, lesson.value?.estimatedMinutes)
}
```

---

## Implementation Order

| Step | Task | Files |
|------|------|-------|
| 1 | Enhance useProgress composable | `app/composables/useProgress.ts` |
| 2 | Create ProgressBar component | `app/components/progress/ProgressBar.vue` |
| 3 | Create ProgressRing component | `app/components/progress/ProgressRing.vue` |
| 4 | Create PhaseProgress component | `app/components/progress/PhaseProgress.vue` |
| 5 | Create OverallProgress component | `app/components/progress/OverallProgress.vue` |
| 6 | Create progress page | `app/pages/progress.vue` |
| 7 | Update PhaseCard with progress | `app/components/PhaseCard.vue` |
| 8 | Update TopicCard with checkmarks | `app/components/TopicCard.vue` |
| 9 | Update StatsFooter with progress | `app/components/StatsFooter.vue` |
| 10 | Update index page with progress | `app/pages/index.vue` |
| 11 | Wire quiz score recording | `app/pages/[phase]/[topic]/[subtopic].vue` |

---

## Critical Files

| File | Action |
|------|--------|
| `app/composables/useProgress.ts` | MODIFY - add phase/topic helpers, time tracking, certificate check |
| `app/components/progress/ProgressBar.vue` | CREATE - reusable progress bar |
| `app/components/progress/ProgressRing.vue` | CREATE - circular SVG indicator |
| `app/components/progress/PhaseProgress.vue` | CREATE - phase breakdown card |
| `app/components/progress/OverallProgress.vue` | CREATE - hero progress display |
| `app/pages/progress.vue` | CREATE - dedicated progress page |
| `app/components/PhaseCard.vue` | MODIFY - add ProgressRing |
| `app/components/TopicCard.vue` | MODIFY - add checkmarks, count badge |
| `app/components/StatsFooter.vue` | MODIFY - add progress bar, resume link |
| `app/pages/index.vue` | MODIFY - add progress indicator |
| `app/pages/[phase]/[topic]/[subtopic].vue` | MODIFY - wire recordQuizScore |

---

## Storage & Persistence

Progress data is stored in the browser's **localStorage**.

| Property | Value |
|----------|-------|
| **Storage Key** | `devops-lms-progress` |
| **Location** | Browser localStorage (on disk) |
| **Limit** | ~5-10MB per domain (progress data is typically a few KB) |

### Persistence Behavior

| Scenario | Data Lost? |
|----------|------------|
| Hard refresh (Ctrl+F5) | No |
| Close browser | No |
| Restart computer | No |
| Clear cache only | No |
| **Clear browsing data** (cookies/site data) | **Yes** |
| **Clear site data** in DevTools | **Yes** |
| Incognito/Private mode (on window close) | **Yes** |
| Different browser | Yes (separate storage) |
| User calls `resetProgress()` | **Yes** |

### Why It Survives Hard Refresh

localStorage is stored **on disk** by the browser, not in memory. A hard refresh (Ctrl+F5) only clears cached assets (JS, CSS, images) — it doesn't touch localStorage.

### When Data Is Lost

Data persists indefinitely until:
1. User clears browser data (cookies/site data)
2. User clears site data via DevTools → Application → Storage
3. User is in Incognito/Private mode and closes the window
4. User explicitly calls `resetProgress()` in the app
5. User switches to a different browser (each browser has its own localStorage)

### View in DevTools

To inspect stored progress data:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Local Storage** in sidebar
4. Click on your domain (e.g., `localhost:3000`)
5. Find key: `devops-lms-progress`

---

## Notes

- All buttons must have `cursor-pointer` class
- Follow existing documentation patterns (rich comments, section dividers)
- Dark mode only (Tailwind CSS)
- SSR-safe: all localStorage access in client-side code only
- Cheat sheets are automatically excluded from progress tracking
