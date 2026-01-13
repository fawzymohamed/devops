# Route Contracts: Multi-Roadmap Support

**Feature**: 001-multi-roadmap
**Date**: 2026-01-13

## Route Structure

### Landing Page

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `pages/index.vue` | Roadmap selection landing page |

### DevOps Roadmap (Unchanged URLs)

| Route | Component | Description |
|-------|-----------|-------------|
| `/phase-1-sdlc` | Redirect to `/` | Phase overview → Landing |
| `/[phase]/[topic]/[subtopic]` | `pages/[phase]/[topic]/[subtopic].vue` | Lesson page |

### Full Stack Roadmap (Prefixed URLs)

| Route | Component | Description |
|-------|-----------|-------------|
| `/fullstack` | `pages/fullstack/index.vue` | Full Stack roadmap home |
| `/fullstack/[phase]/[topic]/[subtopic]` | `pages/fullstack/[phase]/[topic]/[subtopic].vue` | Lesson page |

### Global Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/progress` | `pages/progress.vue` | Multi-roadmap progress dashboard |
| `/certificate` | `pages/certificate.vue` | Certificate page (with roadmap param) |

---

## Route Parameters

### DevOps Lesson Route

```typescript
// pages/[phase]/[topic]/[subtopic].vue
interface DevOpsLessonParams {
  phase: string   // e.g., 'phase-1-sdlc'
  topic: string   // e.g., 'sdlc-models'
  subtopic: string // e.g., 'waterfall-model'
}

// Implicit roadmap: 'devops'
```

### Full Stack Lesson Route

```typescript
// pages/fullstack/[phase]/[topic]/[subtopic].vue
interface FullstackLessonParams {
  phase: string   // e.g., 'phase-1-web-fundamentals'
  topic: string   // e.g., 'html5-essentials'
  subtopic: string // e.g., 'semantic-html'
}

// Implicit roadmap: 'fullstack'
```

### Certificate Route Query

```typescript
// pages/certificate.vue
interface CertificateQuery {
  roadmap?: string // 'devops' | 'fullstack'
  type?: 'course' | 'phase'
  phase?: string   // Phase slug (for phase certificates)
}

// Examples:
// /certificate?roadmap=devops&type=course
// /certificate?roadmap=fullstack&type=phase&phase=phase-1-web-fundamentals
```

### Progress Route Query

```typescript
// pages/progress.vue
interface ProgressQuery {
  roadmap?: string // Filter to specific roadmap
}

// Examples:
// /progress                    # Show all roadmaps
// /progress?roadmap=devops     # Show only DevOps progress
```

---

## Navigation Patterns

### From Landing Page

```typescript
// Navigate to DevOps roadmap home (current index.vue behavior)
navigateTo('/')
// → Shows roadmap selection, click DevOps card
// → Scrolls to DevOps phases section or dedicated page

// Navigate to Full Stack roadmap
navigateTo('/fullstack')
```

### From Any Page to Landing

```typescript
// Click "Home" or logo
navigateTo('/')
```

### Roadmap Switcher

```typescript
// Switch between roadmaps from header
function switchRoadmap(targetSlug: string) {
  if (targetSlug === 'devops') {
    navigateTo('/')  // DevOps at root
  } else {
    navigateTo(`/${targetSlug}`)  // Other roadmaps with prefix
  }
}
```

### Resume Learning

```typescript
// Get resume path for specific roadmap
const resumeData = getResumeLearningData(roadmapId)
if (resumeData) {
  const roadmap = getRoadmapById(roadmapId)
  if (roadmap.routePrefix) {
    navigateTo(`/${roadmap.routePrefix}/${resumeData.path}`)
  } else {
    navigateTo(resumeData.path)
  }
}
```

---

## Content Query Patterns

### DevOps Content

```typescript
// Query DevOps lesson
const { data } = await useAsyncData('lesson', () =>
  queryCollection('content')
    .where('_path', '=', `/${phase}/${topic}/${subtopic}`)
    .first()
)
```

### Full Stack Content

```typescript
// Query Full Stack lesson
const { data } = await useAsyncData('lesson', () =>
  queryCollection('content')
    .where('_path', '=', `/fullstack/${phase}/${topic}/${subtopic}`)
    .first()
)
```

### Generic (Roadmap-Aware)

```typescript
// Query any roadmap's lesson
function getContentPath(roadmapSlug: string, phase: string, topic: string, subtopic: string): string {
  const roadmap = getRoadmapBySlug(roadmapSlug)
  if (roadmap?.contentPath) {
    return `/${roadmap.contentPath}/${phase}/${topic}/${subtopic}`
  }
  return `/${phase}/${topic}/${subtopic}`
}

const contentPath = getContentPath(roadmapSlug, phase, topic, subtopic)
const { data } = await useAsyncData('lesson', () =>
  queryCollection('content')
    .where('_path', '=', contentPath)
    .first()
)
```

---

## Breadcrumb Patterns

### DevOps Breadcrumb

```typescript
// /phase-1-sdlc/sdlc-models/waterfall-model
const breadcrumbs = [
  { label: 'DevOps', to: '/' },
  { label: 'Phase 1: SDLC', to: undefined },  // No dedicated phase page
  { label: 'SDLC Models', to: undefined },     // No dedicated topic page
  { label: 'Waterfall Model' }                 // Current page (no link)
]
```

### Full Stack Breadcrumb

```typescript
// /fullstack/phase-1-web-fundamentals/html5-essentials/semantic-html
const breadcrumbs = [
  { label: 'Full Stack', to: '/fullstack' },
  { label: 'Phase 1: Web Fundamentals', to: undefined },
  { label: 'HTML5 Essentials', to: undefined },
  { label: 'Semantic HTML' }
]
```

---

## Error Handling

### 404 Behavior

```typescript
// If lesson not found, show custom 404 with roadmap context
if (!lesson.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Lesson not found in ${roadmap.title}`,
    fatal: true
  })
}
```

### Invalid Roadmap

```typescript
// If roadmap slug doesn't match known roadmaps
const roadmap = getRoadmapBySlug(route.params.roadmap)
if (!roadmap) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Roadmap not found',
    fatal: true
  })
}
```
