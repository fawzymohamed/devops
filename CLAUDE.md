# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-roadmap LMS with three learning paths.

- **Framework**: Nuxt 4 with @nuxt/content
- **UI Library**: Nuxt UI v4
- **Styling**: Tailwind CSS (dark mode only)
- **Deployment**: Vercel
<<<<<<< HEAD
- **Data**:
  - The AI-Age DevOps Architect (15 phases, 106 topics, 605 subtopics)
  - Full Stack Interview Mastery (13 phases, 79 topics, 450+ subtopics)
  - DevOps (10 phases, 69 topics, 527 subtopics)
=======
- **Data**: DevOps (10 phases, 69 topics, 527 subtopics) + Full Stack (13 phases, 79 topics, 450+ subtopics)
>>>>>>> a5d4c75ce7df3b8766445261191bee2ed704942f

## Tech Stack

- Nuxt 4.x
- Vue 3 Composition API (use `<script setup lang="ts">`)
- TypeScript (strict mode)
- @nuxt/content for markdown lessons
- Nuxt UI v4 components
- Tailwind CSS
- html2canvas + jsPDF for certificates
- Icons from Lucide via `@iconify-json/lucide`

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run generate  # Generate Vercel static output (optional)
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript checks
```

**Dev Server URL**: `http://localhost:5000/`

## Architecture

### Directory Structure

```
app/
|-- components/          # Vue components (organized by feature)
|   |-- RoadmapCard.vue       # Landing page roadmap selection card
|   |-- RoadmapSwitcher.vue   # Header roadmap switcher
|   |-- TopicCard.vue         # Expandable topic with subtopics
|   |-- PhaseCard.vue         # Phase navigation cards
|   |-- StatsFooter.vue       # Summary statistics
|   |-- RoadmapTimeline.vue   # Timeline view mode
|   |-- RoadmapGrid.vue       # Grid view mode
|   |-- content/              # MDC components for markdown
|   |   |-- IllustrationLinearFlow.vue
|   |   |-- IllustrationChecklist.vue
|   |   |-- IllustrationTeamComposition.vue
|   |   `-- IllustrationComparisonMap.vue
|   `-- progress/             # Progress tracking components
|       |-- Ring.vue          # Circular progress indicator (SVG)
|       |-- Bar.vue           # Linear progress bar
|       |-- PhaseProgress.vue     # Phase-level progress card
|       `-- OverallProgress.vue   # Hero stats component
|-- composables/          # Reusable composition functions
|   |-- useRoadmap.ts         # Roadmap registry + context
|   |-- useProgress.ts        # Track lesson completion & progress
|   |-- useQuiz.ts            # Quiz state management
|   |-- useCertificate.ts     # Certificate generation
|   |-- useCheatSheetPdf.ts   # Cheat sheet PDF export
|   `-- useIllustrationDesign.ts  # SVG illustration design system
|-- data/
|   |-- roadmap.ts            # DevOps roadmap data
|   |-- fullstack-roadmap.ts  # Full Stack roadmap data
|   |-- combined-roadmap.ts   # AI-Age DevOps Architect roadmap data
|   |-- roadmaps.ts           # Roadmap registry
|   `-- types.ts              # Shared TypeScript interfaces
|-- layouts/              # Page layouts
|-- pages/                # Route pages
|   |-- index.vue              # Roadmap selection + DevOps overview
|   |-- progress.vue           # Progress dashboard page
|   |-- certificate.vue        # Certificate page (roadmap-aware)
|   |-- [phase]/[topic]/[subtopic].vue  # DevOps lesson pages
|   |-- fullstack/
|   |   |-- index.vue           # Full Stack roadmap page
|   |   `-- [phase]/[topic]/[subtopic].vue  # Full Stack lesson pages
|   `-- architect/
|       |-- index.vue           # AI-Age DevOps Architect roadmap page
|       `-- [phase]/[topic]/[subtopic].vue  # Architect lesson pages
`-- app.vue               # Root layout

content/                  # Markdown lesson files
|-- 1.phase-1-sdlc/           # DevOps content at root (backward compatible)
|-- ...
|-- fullstack/                # Full Stack content (prefixed routes)
|   `-- 1.phase-1-web-fundamentals/
`-- architect/                # AI-Age DevOps Architect content
    `-- 1.phase-1-sdlc-and-requirements/
```

### Data Layer

- `app/data/roadmap.ts` - DevOps phases/topics
- `app/data/fullstack-roadmap.ts` - Full Stack phases/topics
- `app/data/combined-roadmap.ts` - AI-Age DevOps Architect phases/topics
- `app/data/roadmaps.ts` - Roadmap registry with computed stats (order: architect, fullstack, devops)
- `app/data/types.ts` - Shared interfaces (`Roadmap`, `Phase`, `Topic`, `Priority`, `MultiRoadmapProgress`)
- Priority system: `essential` (red), `important` (amber), `recommended` (blue)

### UI Components

- Built with Nuxt UI v4 components: `UCard`, `UBadge`, `UButton`, `UButtonGroup`, `UHeader`, `UFooter`
- Dark mode default (no color mode toggle)

### Font Configuration

Dual font system using `@nuxt/fonts` (auto-loads from Google Fonts):

| Area | Font | CSS Variable |
|------|------|--------------|
| UI (navigation, headers, quizzes, buttons) | Red Hat Text | `--font-sans` |
| Lesson content (markdown prose) | Fuzzy Bubbles | `--font-content` |
| SVG Illustrations | Fuzzy Bubbles | `TYPOGRAPHY.fontFamily` |

**To change fonts:**
1. Open `app/assets/css/main.css`
2. Update font names in `@theme static` block
3. For SVG illustrations, also update `app/composables/useIllustrationDesign.ts`

### SVG Illustration System

Hand-drawn style SVG illustrations for lessons using reusable MDC components:

| Component | Use Case |
|-----------|----------|
| `IllustrationLinearFlow` | Sequential processes (CI/CD, SDLC, Scrum flow) |
| `IllustrationChecklist` | Definition of Done, prerequisites, best practices |
| `IllustrationTeamComposition` | Team roles with responsibilities |
| `IllustrationComparisonMap` | Side-by-side concept mapping |
| `IllustrationPyramid` | Testing pyramid, priority hierarchies, layered architectures |

**MDC Usage in Markdown:**
```md
::illustration-linear-flow
---
steps:
  - label: Plan
    icon: 📋
    color: violet
  - label: Build
    icon: 🔨
    color: blue
---
::
```

**IllustrationLinearFlow Auto-Direction:**

The component automatically determines layout based on step count:

| Steps | Layout | Behavior |
|-------|--------|----------|
| ≤5 | Horizontal | Side-by-side flow, full width |
| 6-10 | Vertical | Stacked flow, 280px width |
| >10 | Vertical + Scroll | 600px max-height with scrolling |

Override with `direction: horizontal` or `direction: vertical` if needed.

**Colors:** `violet`, `blue`, `emerald`, `amber`, `rose`, `cyan`, `gray`

**Sizes:** Control max-width with the `size` prop:
| Size | Max Width | Best For |
|------|-----------|----------|
| `sm` | 384px | Vertical flows, simple diagrams |
| `md` | 448px | Compact horizontal flows |
| `lg` | 512px | Medium checklists |
| `xl` | 576px | Standard illustrations |
| `2xl` | 672px | Checklists with longer text |
| `3xl` | 768px | Wide comparisons |
| `full` | 100% | Full-width illustrations (default for most) |

**Default Sizes:**
| Component | Default |
|-----------|---------|
| `IllustrationLinearFlow` | Auto-sized based on step count |
| `IllustrationChecklist` | `2xl` |
| `IllustrationTeamComposition` | `full` |
| `IllustrationComparisonMap` | `full` |
| `IllustrationPyramid` | `xl` |

**Important:** Components must be in `app/components/content/` for MDC to work.

### Cheat Sheet System

Quick reference sheets at the end of each topic section with PDF export capability.

**Components:**
| Component | Purpose |
|-----------|---------|
| `CheatSheetLayout.vue` | Reference-style content display |
| `CheatSheetPdfButton.vue` | PDF download button with loading state |

**Composable:** `useCheatSheetPdf.ts`
- `downloadCheatSheet(title, slug)` - Generate and download PDF
- `isGenerating` - Loading state
- `error` - Error message

**Content Structure:**
- **File naming**: `99.cheat-sheet.md` (in topic folder)
- **URL pattern**: `/{phase}/{topic}/cheat-sheet`
- **Required frontmatter**:
  ```yaml
  isCheatSheet: true
  cheatSheetTopic: "Topic Name"
  ```

**Features:**
- Distinct layout from regular lessons (reference-style)
- PDF export via html2canvas + jsPDF
- Excluded from progress tracking
- No quiz section
- No prev/next navigation (standalone reference pages, accessible from topic page only)
- **No illustrations** (use tables/lists instead of MDC illustration components)
- Appears last in topic navigation (via `99.` prefix)

### Lesson File Rendering & Navigation

How lesson markdown files get rendered with prev/next navigation arrows.

**File Naming Convention:**
```
content/
└── fullstack/
    └── 2.phase-2-advanced-javascript/
        └── asynchronous-javascript/
            ├── 01.callbacks-and-callback-hell.md
            ├── 02.promises.md
            ├── 03.async-await.md
            ├── 04.event-loop.md
            ├── 05.fetch-api-abortcontroller.md
            ├── 06.web-workers-basics.md
            └── 99.cheat-sheet.md
```

**Naming Rules:**
- Use numeric prefixes (`01.`, `02.`, etc.) to control lesson order
- Use kebab-case for file names after the prefix
- Cheat sheets use `99.` prefix to appear last alphabetically
- File names become URL slugs (e.g., `01.callbacks-and-callback-hell.md` → `/callbacks-and-callback-hell`)

**Page Rendering:**

Lesson pages are rendered by dynamic Vue routes:
- **DevOps**: `app/pages/[phase]/[topic]/[subtopic].vue`
- **Full Stack**: `app/pages/fullstack/[phase]/[topic]/[subtopic].vue`
- **Architect**: `app/pages/architect/[phase]/[topic]/[subtopic].vue`

**How It Works:**
1. **Route Matching**: Nuxt matches URLs like `/fullstack/phase-2-advanced-javascript/asynchronous-javascript/promises` to the dynamic page
2. **Content Query**: Page uses `queryCollection('content').path(contentPath).first()` to fetch the markdown file
3. **Rendering**: `<ContentRenderer>` component renders the markdown with MDC support
4. **Navigation**: `queryCollectionItemSurroundings()` fetches adjacent lessons for prev/next arrows

**Prev/Next Navigation:**

The navigation arrows use Nuxt Content's `queryCollectionItemSurroundings` API:

```typescript
// Fetch surrounding lessons
const { data: surround } = await useAsyncData(
  `surround-${contentPath.value}`,
  async () => {
    const result = await queryCollectionItemSurroundings('content', contentPath.value, {
      fields: ['path', 'title', 'isCheatSheet']
    })
    return result // Returns [prev, next] array
  }
)
```

**Cheat Sheet Filtering:**

Cheat sheets are **excluded** from prev/next navigation to maintain lesson flow:

```typescript
const prevLesson = computed(() => {
  const prev = surround.value?.[0]
  // Skip if it's a cheat sheet
  if (prev?.isCheatSheet === true) return null
  return prev
})
```

**Navigation Behavior:**
- ✅ Regular lessons: Navigate sequentially (01 → 02 → 03...)
- ✅ Cross-topic: After last lesson of Topic A → First lesson of Topic B
- ❌ Cheat sheets: Have no prev/next navigation (standalone reference pages)
- ✅ Regular lessons skip over cheat sheets in navigation
- ⚠️ Limitation: If cheat sheet is immediate prev/next of a lesson, arrow is hidden instead of finding next valid lesson

**URL Structure:**
```
/fullstack/{phase}/{topic}/{subtopic}
└─ Example: /fullstack/phase-2-advanced-javascript/asynchronous-javascript/promises
```

**File-to-URL Mapping:**
```
content/fullstack/2.phase-2-advanced-javascript/asynchronous-javascript/02.promises.md
         ↓
/fullstack/phase-2-advanced-javascript/asynchronous-javascript/promises
```

The numeric prefix (`02.`) is **removed** from the URL but controls sort order in queries.

**Key Files:**
- `app/pages/fullstack/[phase]/[topic]/[subtopic].vue` - Full Stack lesson page
- `app/pages/architect/[phase]/[topic]/[subtopic].vue` - Architect lesson page
- `app/pages/[phase]/[topic]/[subtopic].vue` - DevOps lesson page
- `app/composables/useRoadmap.ts` - Content path helper (`getContentLessonPath`)

### Progress Tracking System

Comprehensive progress tracking with localStorage persistence and visual indicators.

**Components:**
| Component | Purpose |
|-----------|---------|
| `progress/Ring.vue` | SVG circular progress indicator with customizable size/color |
| `progress/Bar.vue` | Linear progress bar (wraps Nuxt UI UProgress) |
| `progress/PhaseProgress.vue` | Expandable phase card showing topic-level progress |
| `progress/OverallProgress.vue` | Hero component with stats, progress ring, Resume Learning |

**Composable:** `useProgress.ts` (roadmap-aware)

Key functions:
```typescript
// Core tracking
markComplete(roadmapId, phaseId, topicId, subtopicId, estimatedMinutes?)
isComplete(roadmapId, phaseId, topicId?, subtopicId?)
recordQuizScore(roadmapId, phaseId, topicId, subtopicId, score)

// Counting
getCompletedCount(roadmapId)
getTotalLessonCount(roadmapId)
getCompletedCountForPhase(roadmapId, phaseId)
getCompletedCountForTopic(roadmapId, phaseId, topicId)

// Percentages
getCertificateProgress(roadmapId)  // Overall %
getPhaseCompletionPercentage(roadmapId, phaseId)
getTopicCompletionPercentage(roadmapId, phaseId, topicId)

// Time tracking
getTotalTimeSpentHours(roadmapId)
getTotalTimeSpentMinutes(roadmapId)

// Resume & Certificate
getResumeLearningData(roadmapId)  // Returns { path, phaseId, topicId, subtopicId }
canGenerateCertificate(roadmapId) // True when 100% complete

// Data management
exportProgress()
importProgress(jsonString)
resetProgress(roadmapId)
```

**Storage:**
- Key: `devops-lms-progress`
- Structure: `{ version: 2, roadmaps: { [roadmapId]: { startedAt, totalTimeSpent, lastAccessed, phases: { ... } } }, globalSettings }`

**UI Integration:**
- **Homepage**: Enhanced progress card with gradient, stats grid, Resume Learning button
- **PhaseCard**: Progress ring showing phase completion %
- **TopicCard**: Checkmarks on completed lessons, completion count badge (e.g., "3/5")
- **StatsFooter**: Progress bar with completion % and Resume Learning button
- **Progress Page** (`/progress`): Full dashboard with phase breakdown and data management

**Features:**
- SSR-safe with client-side localStorage
- Time tracking (accumulated from lesson `estimatedMinutes`)
- Quiz score recording (keeps best score)
- Resume Learning from last accessed lesson
- Export/import progress data as JSON
- Reset progress with confirmation

<<<<<<< HEAD
=======
## Deployment

Configured for **Vercel**:
- `nitro.preset: 'vercel'`
- `app.baseURL: '/'`

>>>>>>> a5d4c75ce7df3b8766445261191bee2ed704942f
## Code Conventions

- Apply `cursor-pointer` class to all interactive elements (buttons, cards)
- Use Composition API with `<script setup lang="ts">`
- Export types from `app/data/types.ts`
- Use Tailwind CSS for styling with responsive breakpoints (`sm:`, `md:`, `lg:`)
- TypeScript for type safety
- All colors use Tailwind's dark mode palette

## File Naming

- **Components**: `PascalCase.vue` (e.g., `LessonSidebar.vue`)
- **Composables**: `useCamelCase.ts` (e.g., `useProgress.ts`)
- **Content**: `phase-X-name/topic-name/subtopic-name.md` (e.g., `1.phase-1-sdlc/1.sdlc-models/waterfall-model.md`)

## Documentation & Comments

All code files must include rich, descriptive comments. Follow these guidelines:

### File-Level Comments
Every file should start with a comprehensive header comment explaining:
- **Purpose**: What the file/component does
- **Features**: Key functionality provided
- **Structure**: Visual ASCII diagram showing component structure (for Vue components)
- **Data Flow**: How data moves through the component
- **Props/Events**: For Vue components, document all props and emitted events

### Code Section Comments
Use section dividers and descriptive comments:
```typescript
// =============================================================================
// SECTION NAME
// =============================================================================

/**
 * Function/Variable Name
 * ----------------------
 * Description of what this does and why.
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 */
```

### Vue Template Comments
Use HTML comments to explain template sections:
```vue
<!--
  Section Name
  ============
  Description of what this section renders and any important details.
-->
```

### Inline Comments
Add inline comments for:
- Complex logic or calculations
- Non-obvious behavior
- Important configuration values
- Workarounds or edge cases

### Comment Style Examples
```typescript
// Single line for brief explanations
const value = computed(() => data.length) // Inline explanation

/**
 * Multi-line JSDoc style for functions and complex logic.
 * Include @param, @returns, @example as needed.
 */

// =============================================================================
// Use section dividers for major code sections
// =============================================================================
```

### What to Document
- **Always document**: Interfaces, types, exported functions, computed properties, watchers
- **Template sections**: Major layout areas, conditional rendering, loops
- **Configuration**: Nuxt config options, build settings, environment variables
- **Complex calculations**: Any reduce, map, or nested operations

## Current Implementation Status

### Infrastructure
- [x] Multi-roadmap data layer (DevOps + Full Stack + Architect + registry)
- [x] Roadmap-aware routing (DevOps root + /fullstack + /architect prefixes)
- [x] Roadmap context (useRoadmap) and per-roadmap progress tracking
- [x] Multi-roadmap UI (landing selection with 3-column grid, switcher, progress dashboard)
- [x] Roadmap-specific certificates
- [x] AI-Age DevOps Architect roadmap (data, routing, content directories)
- [ ] Architect roadmap: lesson content generation (605 subtopics pending)
- [ ] Phase 9 polish: remaining manual verification tasks (URLs, migration, walkthrough)
