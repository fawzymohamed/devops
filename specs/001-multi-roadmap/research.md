# Research: Multi-Roadmap Support

**Feature**: 001-multi-roadmap
**Date**: 2026-01-13
**Status**: Complete

## Research Topics

### 1. Nuxt 4 File-Based Routing for Nested Roadmaps

**Decision**: Use nested directory structure with catch-all routes for new roadmaps while preserving existing DevOps routes.

**Rationale**:
- Nuxt 4 uses file-based routing where directory structure maps to URL paths
- Existing DevOps routes (`/[phase]/[topic]/[subtopic]`) work at root level
- New roadmaps should use prefixed paths (`/fullstack/[phase]/[topic]/[subtopic]`)
- This maintains backward compatibility with existing URLs and bookmarks

**Implementation Pattern**:
```
app/pages/
├── index.vue                          # Landing page (roadmap selection)
├── [phase]/[topic]/[subtopic].vue     # DevOps lessons (unchanged)
└── fullstack/
    ├── index.vue                      # Full Stack roadmap home
    └── [phase]/[topic]/[subtopic].vue # Full Stack lessons
```

**Alternatives Considered**:
- **Route middleware approach**: Would require rewriting all existing URLs - rejected for backward compatibility
- **Single catch-all with roadmap param**: `[roadmap]/[phase]/[topic]/[subtopic]` - rejected as it breaks existing DevOps URLs

---

### 2. localStorage Structure for Multi-Roadmap Progress

**Decision**: Restructure localStorage to use roadmap ID as top-level key, with automatic migration of existing data.

**Rationale**:
- Current structure: `{ startedAt, phases: { ... }, totalTimeSpent, ... }`
- New structure: `{ roadmaps: { devops: { startedAt, phases: { ... } }, fullstack: { ... } } }`
- Migration runs once on first visit, detecting old format and transforming
- Preserves all existing progress data transparently

**Implementation Pattern**:
```typescript
interface MultiRoadmapProgress {
  version: 2  // Schema version for future migrations
  roadmaps: Record<string, UserProgress>
  globalSettings?: {
    userName?: string
    theme?: string
  }
}

// Migration logic in useProgress.ts
function migrateIfNeeded(stored: any): MultiRoadmapProgress {
  if (!stored.version) {
    // Old format - migrate to new
    return {
      version: 2,
      roadmaps: {
        devops: stored  // Move all existing data under 'devops'
      }
    }
  }
  return stored
}
```

**Alternatives Considered**:
- **Separate localStorage keys per roadmap**: `devops-lms-progress`, `fullstack-lms-progress` - rejected as it complicates export/import and global settings
- **No migration (fresh start)**: rejected per spec requirement to preserve existing progress

---

### 3. Roadmap Context Provider Pattern

**Decision**: Create `useRoadmap()` composable that provides current roadmap context via Vue's provide/inject.

**Rationale**:
- Components need to know which roadmap they're displaying
- Prop drilling through many levels is verbose and error-prone
- Vue's provide/inject is perfect for this "ambient" context
- Works well with Nuxt's useState for SSR-safe state

**Implementation Pattern**:
```typescript
// useRoadmap.ts
export function useRoadmap() {
  const currentRoadmap = useState<Roadmap | null>('current-roadmap', () => null)

  function setRoadmap(roadmap: Roadmap) {
    currentRoadmap.value = roadmap
  }

  function getRoadmapBySlug(slug: string): Roadmap | undefined {
    return allRoadmaps.find(r => r.slug === slug)
  }

  return {
    currentRoadmap: readonly(currentRoadmap),
    setRoadmap,
    getRoadmapBySlug,
    allRoadmaps
  }
}
```

**Alternatives Considered**:
- **Pinia store**: Overkill for simple context; adds dependency
- **Props only**: Would require passing roadmap through many component layers
- **Route-based detection**: Roadmap determined from URL in each component - duplicates logic

---

### 4. Priority System Mapping Between Roadmaps

**Decision**: Use internal canonical values (`essential`, `important`, `recommended`) with per-roadmap display labels.

**Rationale**:
- DevOps uses: essential/important/recommended
- Full Stack uses: Must Know/Should Know/Good to Know
- Both map to same colors: red/amber/blue
- Internal code uses canonical values; display layer translates

**Implementation Pattern**:
```typescript
// In types.ts
export type Priority = 'essential' | 'important' | 'recommended'

// In each roadmap data file
export const priorityLabels = {
  essential: 'Must Know',    // Full Stack
  important: 'Should Know',
  recommended: 'Good to Know'
}

// Or use existing priorityConfig with per-roadmap labels
```

**Alternatives Considered**:
- **Different internal values per roadmap**: Complicates shared component logic
- **String labels only**: Loses type safety; makes color mapping harder

---

### 5. Content Directory Structure

**Decision**: Use top-level directory prefix for new roadmaps; keep DevOps content at root for URL compatibility.

**Rationale**:
- Current: `content/1.phase-1-sdlc/...`
- New Full Stack: `content/fullstack/1.phase-1-web-fundamentals/...`
- Nuxt Content paths map directly to URLs
- Keeping DevOps at root preserves existing URLs

**Implementation Pattern**:
```
content/
├── 1.phase-1-sdlc/           # DevOps (root = no URL prefix)
├── 2.phase-2-foundations/
└── fullstack/                 # Full Stack (prefix in URL)
    ├── 1.phase-1-web-fundamentals/
    └── 2.phase-2-advanced-js/
```

**Alternatives Considered**:
- **Move DevOps to `content/devops/`**: Breaks all existing URLs
- **Flat structure with metadata**: Requires complex content queries

---

### 6. Landing Page Design Pattern

**Decision**: Grid of roadmap cards with progress indicators, using existing component patterns.

**Rationale**:
- Consistent with existing PhaseCard/TopicCard design language
- Shows per-roadmap progress at a glance
- Click navigates to roadmap's main page
- Uses existing Nuxt UI components (UCard)

**Implementation Pattern**:
```vue
<!-- RoadmapCard.vue -->
<template>
  <UCard
    class="cursor-pointer hover:ring-2"
    @click="navigateTo(roadmap.slug)"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ roadmap.icon }}</span>
        <h2>{{ roadmap.title }}</h2>
      </div>
    </template>

    <p>{{ roadmap.description }}</p>
    <div class="flex gap-4 mt-4">
      <span>{{ roadmap.phaseCount }} Phases</span>
      <span>{{ roadmap.topicCount }} Topics</span>
    </div>

    <template #footer>
      <ProgressRing :value="progressPercentage" size="sm" />
      <span>{{ progressPercentage }}% Complete</span>
    </template>
  </UCard>
</template>
```

**Alternatives Considered**:
- **Tab-based selection**: Less visual; harder to show progress
- **Dropdown menu**: Hides options; not discoverable

---

### 7. Certificate Generation for Multiple Roadmaps

**Decision**: Extend `useCertificate` composable to accept roadmap parameter; generate roadmap-specific certificate titles.

**Rationale**:
- Certificates must show correct roadmap name
- Certificate ID format should include roadmap identifier
- Same generation logic, parameterized by roadmap

**Implementation Pattern**:
```typescript
// useCertificate.ts
function generateCertificate(roadmapSlug: string): CourseCertificateData {
  const roadmap = getRoadmapBySlug(roadmapSlug)

  return {
    certificateId: `${roadmap.slug.toUpperCase()}-MASTER-${timestamp}-${random}`,
    courseName: roadmap.certificateTitle,  // e.g., "DevOps Master" or "Full Stack Interview Mastery"
    // ... rest of certificate data
  }
}
```

**Alternatives Considered**:
- **Separate certificate composables per roadmap**: Code duplication
- **Hard-coded certificate types**: Not scalable for future roadmaps

---

## Summary

All research items are resolved. Key architectural decisions:

1. **Routing**: Preserve DevOps URLs at root, new roadmaps get prefixes
2. **Storage**: Single localStorage key with roadmap namespacing + migration
3. **Context**: `useRoadmap()` composable provides ambient context
4. **Priorities**: Canonical internal values with per-roadmap display labels
5. **Content**: Prefix-based directory structure
6. **Landing**: Grid of roadmap cards with progress
7. **Certificates**: Parameterized generation with roadmap context

No NEEDS CLARIFICATION items remain. Ready for Phase 1 design.
