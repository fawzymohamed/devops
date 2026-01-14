# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-roadmap LMS with a DevOps roadmap and a Full Stack Interview Mastery roadmap.

- **Framework**: Nuxt 4 with @nuxt/content
- **UI Library**: Nuxt UI v4
- **Styling**: Tailwind CSS (dark mode only)
- **Deployment**: GitHub Pages (static generation)
- **Data**: DevOps (10 phases, 69 topics, 527 subtopics) + Full Stack (13 phases, 79 topics, 450+ subtopics)

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

**Dev Server URL**: `http://localhost:3000/devops/` (Nuxt default)

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
|   |-- roadmaps.ts           # Roadmap registry
|   `-- types.ts              # Shared TypeScript interfaces
|-- layouts/              # Page layouts
|-- pages/                # Route pages
|   |-- index.vue              # Roadmap selection + DevOps overview
|   |-- progress.vue           # Progress dashboard page
|   |-- certificate.vue        # Certificate page (roadmap-aware)
|   |-- [phase]/[topic]/[subtopic].vue  # DevOps lesson pages
|   `-- fullstack/
|       |-- index.vue           # Full Stack roadmap page
|       `-- [phase]/[topic]/[subtopic].vue  # Full Stack lesson pages
`-- app.vue               # Root layout

content/                  # Markdown lesson files
|-- 1.phase-1-sdlc/           # DevOps content at root (backward compatible)
|-- ...
`-- fullstack/                # Full Stack content (prefixed routes)
    `-- 1.phase-1-web-fundamentals/
```

### Data Layer

- `app/data/roadmap.ts` - DevOps phases/topics
- `app/data/fullstack-roadmap.ts` - Full Stack phases/topics
- `app/data/roadmaps.ts` - Roadmap registry with computed stats
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
- **No illustrations** (use tables/lists instead of MDC illustration components)
- Appears last in topic navigation (via `99.` prefix)

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
- [x] Multi-roadmap data layer (DevOps + Full Stack + registry)
- [x] Roadmap-aware routing (DevOps root + /fullstack prefix)
- [x] Roadmap context (useRoadmap) and per-roadmap progress tracking
- [x] Multi-roadmap UI (landing selection, switcher, progress dashboard)
- [x] Roadmap-specific certificates
- [ ] Phase 9 polish: remaining manual verification tasks (URLs, migration, walkthrough)

### Lesson Content Progress

**DevOps Roadmap: 41/527 lessons created**
**Full Stack Roadmap: 19/450+ lessons created**

## DevOps Roadmap Progress

#### Phase 1: Software Development Lifecycle (SDLC) ✓
21/21 lessons complete (4 topics)

#### Phase 2: Foundations
<details>
<summary>Linux Fundamentals (10/10) ✓</summary>

- [x] File System Hierarchy
- [x] Navigation Commands (cd, ls, pwd)
- [x] File Operations (cp, mv, rm, mkdir)
- [x] File Permissions (chmod, chown)
- [x] Users & Groups
- [x] Process Management (ps, top, kill)
- [x] Package Managers (apt, yum, dnf)
- [x] System Services (systemd, systemctl)
- [x] Cron Jobs & Scheduling
- [x] Log Files & Journalctl

</details>

<details>
<summary>Bash Scripting (0/10)</summary>

- [ ] Variables & Data Types
- [ ] Conditionals (if/else)
- [ ] Loops (for, while)
- [ ] Functions
- [ ] Input/Output Redirection
- [ ] Pipes & Filters
- [ ] Text Processing (grep, sed, awk)
- [ ] Script Arguments
- [ ] Exit Codes
- [ ] Error Handling

</details>

<details>
<summary>Networking Fundamentals (0/11)</summary>

- [ ] OSI Model (7 Layers)
- [ ] TCP/IP Model
- [ ] IP Addressing & Subnetting
- [ ] DNS (Domain Name System)
- [ ] DHCP
- [ ] HTTP/HTTPS Protocols
- [ ] SSL/TLS Basics
- [ ] Firewalls & Ports
- [ ] Load Balancers
- [ ] VPNs
- [ ] Network Troubleshooting (ping, traceroute, netstat, ss, curl)

</details>

<details>
<summary>Git Version Control (10/10) ✓</summary>

- [x] Git Basics (init, clone, add, commit)
- [x] Branching & Merging
- [x] Remote Repositories
- [x] Git Flow Workflow
- [x] Rebasing vs Merging
- [x] Cherry Picking
- [x] Stashing Changes
- [x] Resolving Conflicts
- [x] Git Hooks
- [x] Tags & Releases

</details>

<details>
<summary>Python for Automation (0/10)</summary>

- [ ] Python Syntax & Basics
- [ ] Data Types & Structures
- [ ] Control Flow
- [ ] Functions & Modules
- [ ] File Operations
- [ ] Error Handling (try/except)
- [ ] Working with APIs (requests)
- [ ] JSON/YAML Parsing
- [ ] Regular Expressions
- [ ] Virtual Environments (venv, pip)

</details>

<details>
<summary>JavaScript Fundamentals (0/12)</summary>

- [ ] Variables (let, const, var)
- [ ] Data Types & Operators
- [ ] Functions & Arrow Functions
- [ ] Arrays & Objects
- [ ] OOP: Classes & Constructors
- [ ] OOP: Inheritance & Prototypes
- [ ] OOP: Encapsulation & Modules
- [ ] Async/Await & Promises
- [ ] Fetch API
- [ ] ES6+ Features
- [ ] Node.js Basics
- [ ] npm Package Manager

</details>

<details>
<summary>TypeScript Essentials (0/9)</summary>

- [ ] Type Annotations
- [ ] Interfaces & Types
- [ ] Generics
- [ ] Enums
- [ ] Union & Intersection Types
- [ ] Type Guards
- [ ] tsconfig.json
- [ ] Compiling TypeScript
- [ ] TypeScript with Node.js

</details>

<details>
<summary>YAML & JSON (0/7)</summary>

- [ ] YAML Syntax
- [ ] JSON Syntax
- [ ] Data Structures
- [ ] Nested Objects
- [ ] Arrays/Lists
- [ ] Configuration Files
- [ ] Validation

</details>

<!-- Remaining phases collapsed for brevity -->
<!-- Phase 3-10 lesson tracking will be added as we progress -->

## Full Stack Roadmap Progress

#### Phase 1: Core Web Fundamentals
<details>
<summary>HTML5 Essentials (6/6) ✓</summary>

- [x] Semantic HTML5 elements
- [x] Forms and input types
- [x] HTML5 APIs (localStorage, sessionStorage)
- [x] Accessibility (ARIA, semantic structure)
- [x] SEO basics (meta tags, structured data)
- [x] HTML best practices

</details>

<details>
<summary>CSS3 Mastery (7/7) ✓</summary>

- [x] Flexbox (justify-content, align-items, flex-wrap, gap)
- [x] CSS Grid (grid-template, fr units, auto-fit/auto-fill)
- [x] Responsive Design (media queries, mobile-first approach)
- [x] CSS Variables (custom properties, theming)
- [x] Animations & Transitions (keyframes, easing, transform)
- [x] Pseudo-classes & Pseudo-elements (:hover, :focus, ::before, ::after)
- [x] CSS Architecture (BEM, SMACSS concepts)

</details>

<details>
<summary>JavaScript Fundamentals (6/6) ✓</summary>

- [x] Variables & Scope (let, const, var, hoisting)
- [x] Data Types (primitives, objects, type coercion)
- [x] Functions (declarations, expressions, arrow functions)
- [x] Arrays & Objects (methods, destructuring, spread operator)
- [x] Control Flow (conditionals, loops, ternary operator)
- [x] ES6+ Features (template literals, default parameters, rest operator)

</details>

<details>
<summary>DOM Manipulation (0/6)</summary>

- [ ] Selecting elements (querySelector, getElementById)
- [ ] Modifying DOM (createElement, appendChild, remove)
- [ ] Event handling (addEventListener, event delegation)
- [ ] Event bubbling & capturing
- [ ] DOM traversal (parentNode, children, siblings)
- [ ] Performance considerations

</details>

<!-- Remaining phases will be tracked as lessons are created -->
