# Plan: Create First Lesson - Waterfall Model (Notion Guide Approach)

## Overview
Create the first lesson "Waterfall Model" (Phase 1 > SDLC Models) following the project's established workflow from the Notion guide.

## Workflow Steps

### Step 1: Create Content Directory Structure
```
content/
  1.phase-1-sdlc/
    1.sdlc-models/
```

### Step 2: Create Content Configuration (if not exists)
**File:** `content.config.ts`

Nuxt Content v3 requires a collection schema definition:
```typescript
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        estimatedMinutes: z.number(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        learningObjectives: z.array(z.string()),
        prerequisites: z.array(z.string()).optional(),
        quiz: z.object({
          passingScore: z.number(),
          questions: z.array(z.object({
            question: z.string(),
            type: z.enum(['single', 'multiple', 'true-false']),
            options: z.array(z.string()).optional(),
            correctAnswer: z.union([z.string(), z.boolean()]).optional(),
            correctAnswers: z.array(z.string()).optional(),
            explanation: z.string()
          }))
        }).optional()
      })
    })
  }
})
```

### Step 3: Add Slugs to Roadmap Data
**File:** `app/data/roadmap.ts`

**IMPORTANT:** URL slugs must match content directory names exactly. Phase titles like "Phase 1: Software Development Lifecycle (SDLC)" generate long slugs that won't match `phase-1-sdlc`.

Add `slug` property to interfaces:
```typescript
export interface Phase {
  phase: number
  title: string
  slug: string  // e.g., "phase-1-sdlc"
  // ...
}

export interface Topic {
  name: string
  slug?: string  // e.g., "sdlc-models"
  // ...
}
```

Add slugs to phase and topic data:
```typescript
{
  phase: 1,
  title: 'Phase 1: Software Development Lifecycle (SDLC)',
  slug: 'phase-1-sdlc',  // Must match content directory name
  // ...
  topics: [
    {
      name: 'SDLC Models',
      slug: 'sdlc-models',  // Must match content directory name
      // ...
    }
  ]
}
```

### Step 4: Generate Lesson with lesson-creator Agent
Use the `lesson-creator` agent to generate `waterfall-model.md`:
- Agent classifies "Waterfall Model" as stable topic (no research needed)
- Generates frontmatter, content, and quiz automatically
- Output: `content/1.phase-1-sdlc/1.sdlc-models/waterfall-model.md`

### Step 5: Create Lesson Page Component
**File:** `app/pages/[phase]/[topic]/[subtopic].vue`

Features:
- Breadcrumb navigation
- Lesson header with metadata (title, time, difficulty)
- Learning objectives card
- Content rendering with `ContentRenderer`
- Table of contents sidebar
- Mark Complete button (uses `useProgress`)
- Previous/Next navigation
- Loading and error states

**Nuxt Content v3 API Notes:**
- Use `queryCollection('content')` instead of `queryContent()`
- Use `queryCollectionItemSurroundings()` for prev/next navigation
- Returns array `[prev, next]`, not object `{ prev, next }`

### Step 6: Create Quiz Component (if not exists)
**File:** `app/components/quiz/QuizContainer.vue`

Features:
- Supports single choice, multiple choice, true/false questions
- Progress indicator and navigation
- Score calculation and pass/fail determination
- Results review with explanations
- Retry functionality

### Step 7: Make Subtopics Clickable
**Modify:** `app/components/TopicCard.vue`
- Accept `phaseSlug` prop
- Use explicit `topic.slug` or generate from name as fallback
- Wrap subtopics in `NuxtLink`
- Generate paths like `/phase-1-sdlc/sdlc-models/waterfall-model`
- Add hover styles and `@click.stop` on container

**Modify:** `app/components/RoadmapTimeline.vue`
- Use `activeData.slug` directly (not generated from title)
- Pass `phase-slug` prop to TopicCard

### Step 8: Test Implementation
- Run `npm run typecheck`
- Run `npm run lint` (with `--fix` if needed)
- Run `npm run dev`
- Navigate to `/phase-1-sdlc/sdlc-models/waterfall-model`
- Verify content renders correctly
- Test Mark Complete button

### Step 9: Update CLAUDE.md Status
Update implementation status to reflect progress.

## Files to Create
1. `content.config.ts` - Collection schema for Nuxt Content v3
2. `content/1.phase-1-sdlc/1.sdlc-models/waterfall-model.md` (via lesson-creator)
3. `app/pages/[phase]/[topic]/[subtopic].vue`
4. `app/components/quiz/QuizContainer.vue`

## Files to Modify
1. `app/data/roadmap.ts` - Add slug properties to Phase/Topic interfaces and data
2. `app/components/TopicCard.vue` - Make subtopics clickable, use slugs
3. `app/components/RoadmapTimeline.vue` - Pass phase slug from data
4. `CLAUDE.md` - Update status

## URL Pattern
```
/phase-1-sdlc/sdlc-models/waterfall-model
```
(No `/lessons/` prefix - direct nested routing)

## Critical Learnings

### 1. Content Schema Required
Nuxt Content v3 requires `content.config.ts` with collection schema. Without it, content queries fail.

### 2. Slug Matching is Critical
Content directory names must exactly match URL slugs:
- Content: `content/1.phase-1-sdlc/1.sdlc-models/`
- URL: `/phase-1-sdlc/sdlc-models/waterfall-model`
- Slug in data: `phase-1-sdlc`, `sdlc-models`

Do NOT rely on generating slugs from titles - they will mismatch.

### 3. Nuxt Content v3 API Differences
- `queryCollection('content')` replaces `queryContent()`
- `queryCollectionItemSurroundings()` returns `[prev, next]` array
- Use `as unknown as Type` for type assertions when needed

### 4. Click Event Propagation
Use `@click.stop` on subtopics container to prevent topic card toggle when clicking links.

## Critical Files Reference
- `app/data/types.ts` - LessonFrontmatter interface
- `app/data/roadmap.ts` - Phase and Topic interfaces with slugs
- `app/composables/useProgress.ts` - Progress tracking
- `app/composables/useQuiz.ts` - Quiz state management
- `content.config.ts` - Content collection schema
- `.claude/skills/nuxt-content/SKILL.md` - Content patterns
