# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Converting a single-page DevOps roadmap into a **full Learning Management System (LMS)**.

- **Framework**: Nuxt 4 with @nuxt/content
- **UI Library**: Nuxt UI v4
- **Styling**: Tailwind CSS (dark mode only)
- **Deployment**: GitHub Pages (static generation)
- **Data**: 10 phases, 69 topics, 527 subtopics

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
npm run generate  # Generate static site for GitHub Pages
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript checks
```

## Architecture

### Directory Structure

```
app/
├── components/       # Vue components (organized by feature)
│   ├── TopicCard.vue        # Expandable topic with subtopics
│   ├── PhaseCard.vue        # Phase navigation cards
│   ├── StatsFooter.vue      # Summary statistics
│   ├── RoadmapTimeline.vue  # Timeline view mode
│   ├── RoadmapGrid.vue      # Grid view mode
│   └── content/             # MDC components for markdown
│       ├── IllustrationLinearFlow.vue
│       ├── IllustrationChecklist.vue
│       ├── IllustrationTeamComposition.vue
│       └── IllustrationComparisonMap.vue
├── composables/      # Reusable composition functions
│   ├── useProgress.ts       # Track lesson completion
│   ├── useQuiz.ts           # Quiz state management
│   ├── useCertificate.ts    # Certificate generation
│   ├── useCheatSheetPdf.ts  # Cheat sheet PDF export
│   └── useIllustrationDesign.ts  # SVG illustration design system
├── data/
│   ├── roadmap.ts    # Roadmap data with TypeScript types
│   └── types.ts      # Shared TypeScript interfaces
├── layouts/          # Page layouts
├── pages/            # Route pages
│   └── index.vue     # Main roadmap page
└── app.vue           # Root layout

content/              # Markdown lesson files (527+ files)
├── 1.phase-1-sdlc/
│   ├── 1.sdlc-models/
│   │   ├── waterfall-model.md
│   │   └── agile-methodology.md
│   └── 2.devops-culture/
│       └── devops-principles.md
└── ...

scripts/              # Build/generation scripts
```

### Data Layer

- `app/data/roadmap.ts` - Contains all roadmap phases, topics, and subtopics with TypeScript interfaces (`Phase`, `Topic`, `Priority`)
- `app/data/types.ts` - Shared TypeScript interfaces exported for use across the project
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
- Appears last in topic navigation (via `99.` prefix)

## Deployment

Configured for GitHub Pages with:
- `baseURL: '/devops/'` in nuxt.config.ts
- GitHub Actions workflow in `.github/workflows/deploy.yml`
- Static site generation (`npm run generate`)

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
- [x] Phase 1: Foundation Setup (Nuxt 4, Nuxt UI v4, Tailwind)
- [x] Roadmap data structure (10 phases, 69 topics, 527 subtopics)
- [x] Basic UI components (TopicCard, PhaseCard, StatsFooter, Timeline, Grid)
- [x] Phase 2: Content Structure (@nuxt/content setup)
  - Created `content.config.ts` with lesson schema
  - Content directory structure: `content/1.phase-X/1.topic-name/lesson-name.md`
- [x] Phase 3: Lesson pages and routing
  - Dynamic route: `app/pages/[phase]/[topic]/[subtopic].vue`
  - Lesson page with breadcrumbs, metadata, learning objectives, content, TOC sidebar
  - Mark Complete button with progress tracking
  - Previous/Next navigation using `queryCollectionItemSurroundings`
- [x] Quiz system (QuizContainer component)
- [x] SVG Illustration System (4 MDC components + design system composable)
- [x] Cheat Sheet System (topic-level quick reference sheets with PDF export)
  - CheatSheetLayout and CheatSheetPdfButton components
  - useCheatSheetPdf composable
  - Schema extension for `isCheatSheet` frontmatter
  - Navigation integration in TopicCard
- [ ] Phase 4: Progress tracking (useProgress composable) - partially implemented
- [ ] Phase 5: Certificate generation (useCertificate composable)
- [ ] Phase 6: Navigation and search
- [ ] Phase 7: Final polish and deployment

### Lesson Content Progress

**Total: 21/527 lessons created**

#### Phase 1: Software Development Lifecycle (SDLC)
<details>
<summary>SDLC Models (5/5) ✓</summary>

- [x] Waterfall Model
- [x] Agile Methodology
- [x] Scrum Framework
- [x] Kanban Method
- [x] DevOps as SDLC Evolution

</details>

<details>
<summary>SDLC Phases (6/6) ✓</summary>

- [x] Requirements Gathering
- [x] Design & Architecture
- [x] Development/Coding
- [x] Testing & QA
- [x] Deployment
- [x] Maintenance & Operations

</details>

<details>
<summary>Development Workflows (5/5) ✓</summary>

- [x] Feature Branching
- [x] Code Reviews
- [x] Pull Requests
- [x] Release Management
- [x] Hotfix Procedures

</details>

<details>
<summary>Project Management Basics (5/5) ✓</summary>

- [x] User Stories
- [x] Sprint Planning
- [x] Backlog Management
- [x] Velocity & Estimation
- [x] Retrospectives

</details>

#### Phase 2: Linux & Networking Foundations
<details>
<summary>Linux Fundamentals (0/8)</summary>

- [ ] Linux Basics
- [ ] File System Navigation
- [ ] File Permissions
- [ ] Process Management
- [ ] Package Management
- [ ] Shell Scripting Basics
- [ ] Text Processing (grep, sed, awk)
- [ ] System Monitoring

</details>

<details>
<summary>Networking Basics (0/6)</summary>

- [ ] OSI Model
- [ ] TCP/IP Fundamentals
- [ ] DNS & Domain Management
- [ ] HTTP/HTTPS Protocols
- [ ] Firewalls & Security Groups
- [ ] Load Balancing Concepts

</details>

<details>
<summary>Version Control (0/5)</summary>

- [ ] Git Fundamentals
- [ ] Branching Strategies
- [ ] Merge vs Rebase
- [ ] Git Hooks
- [ ] Git Best Practices

</details>

<!-- Remaining phases collapsed for brevity -->
<!-- Phase 3-10 lesson tracking will be added as we progress -->
