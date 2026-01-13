<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: 1.2.0 → 1.2.1 (PATCH - Clarification added)

Modified Principles: None

Added Sections:
  - Development Server Configuration (under Technology Standards)

Removed Sections: None

Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ No changes needed
  - .specify/templates/spec-template.md: ✅ No changes needed
  - .specify/templates/tasks-template.md: ✅ No changes needed

Follow-up TODOs: None
================================================================================
-->

# DevOps LMS Constitution

## Core Principles

### I. Content-First Architecture

All features and components MUST prioritize lesson content delivery. The @nuxt/content
module is the authoritative source for course material.

**Non-negotiables:**
- Lessons are markdown files in `content/` directory with defined schema
- MDC components in `app/components/content/` for rich markdown rendering
- Frontmatter validation through `content.config.ts` schema
- Content paths follow pattern: `{phase}/{topic}/{subtopic}.md`

**Rationale:** The LMS exists to deliver 527+ lessons across 10 phases. Every architectural
decision must serve content accessibility and readability.

### II. Type Safety

TypeScript strict mode is MANDATORY. All shared interfaces MUST be exported from
`app/data/types.ts`.

**Non-negotiables:**
- `<script setup lang="ts">` for all Vue components
- Explicit type annotations on function parameters and return values
- No `any` types except with documented justification
- Types for roadmap data structures: `Phase`, `Topic`, `Priority`, `Subtopic`

**Rationale:** Type safety prevents runtime errors in a content-heavy system where
data flows through multiple transformation layers (markdown → Vue → browser).

### III. Component Reusability

UI components MUST be reusable and data-driven. Single-use components require justification.

**Non-negotiables:**
- Nuxt UI v4 components as foundation (`UCard`, `UBadge`, `UButton`, etc.)
- Props-based configuration over hardcoded values
- MDC illustration components auto-calculate dimensions from data
- Progress components accept standardized props (`value`, `size`, `color`)

**Rationale:** With 69 topics and 527 subtopics, component reuse is essential for
maintainability and visual consistency.

### IV. Comprehensive Documentation

All code files MUST include rich, descriptive comments following established patterns.

**Non-negotiables:**
- File-level header comment with Purpose, Features, Structure (ASCII diagram for Vue)
- Section dividers using `// =============================================================================`
- JSDoc for all exported functions with `@param`, `@returns`
- HTML comments in Vue templates explaining major sections
- Inline comments for complex logic, non-obvious behavior, workarounds

**Rationale:** The project documentation in CLAUDE.md establishes this standard.
Future maintainers need context for a system with 40+ components and composables.

### V. Static-First Deployment

All code MUST be compatible with static site generation (SSG) for GitHub Pages.

**Non-negotiables:**
- SSR-safe patterns: localStorage access only in client-side code
- `baseURL: '/devops/'` configuration for GitHub Pages
- No server-side APIs or middleware (static generation only)
- `npm run generate` MUST succeed without errors

**Rationale:** GitHub Pages deployment is a project requirement. Server-dependent
features would break the entire deployment pipeline.

### VI. Dark Mode Design

The application uses dark mode exclusively. No light mode support is required.

**Non-negotiables:**
- All colors use Tailwind dark mode palette
- No color mode toggle or preference detection
- SVG illustrations use dark-mode-native colors from design system
- Contrast ratios must meet WCAG AA standards in dark mode

**Rationale:** Simplifies design decisions and ensures consistent visual experience
across all 527+ lesson pages.

### VII. User Experience Standards

Interactive elements MUST follow consistent UX patterns.

**Non-negotiables:**
- `cursor-pointer` class on all buttons, clickable cards, and interactive elements
- Font system: Red Hat Text for UI, Fuzzy Bubbles for lesson content
- Progress indicators visible at phase, topic, and subtopic levels
- Resume Learning functionality from last accessed lesson

**Rationale:** Learner experience is paramount. Inconsistent interactions create
cognitive load that detracts from content consumption.

### VIII. Content Generation Tooling

All lesson and cheat sheet content MUST be generated using designated tools to ensure
consistency, quality, and adherence to project standards.

**Non-negotiables:**
- **Lesson Content**: MUST use the `lesson-creator` agent (`.claude/agents/lesson-creator.md`)
  - Agent handles topic classification (STABLE vs RESEARCH)
  - Agent enforces frontmatter schema, quiz guidelines, and illustration rules
  - Agent produces standardized creation reports
- **Cheat Sheets**: MUST use the `/generate-cheat-sheet` command (`.claude/commands/generate-cheat-sheet.md`)
  - Command analyzes existing lessons to synthesize reference content
  - Command enforces no-illustrations rule for cheat sheets
  - Command ensures proper frontmatter (`isCheatSheet: true`, `cheatSheetTopic`)
- **Prohibited**: Direct file creation for lessons without using designated tools
- **Exception**: Minor edits to existing content may be done directly

**Rationale:** With 527+ lessons across 10 phases, manual content creation leads to
inconsistent quality, missing frontmatter fields, incorrect quiz formats, and
illustration rule violations. The designated tools encode all content standards
and produce consistent, high-quality output.

## Technology Standards

**Framework & Core:**
- Nuxt 4.x with Vue 3 Composition API
- @nuxt/content for markdown lessons
- Nuxt UI v4 component library
- TypeScript strict mode

**Styling:**
- Tailwind CSS (dark mode only)
- @nuxt/fonts for Red Hat Text and Fuzzy Bubbles

**Client Features:**
- localStorage for progress persistence (key: `devops-lms-progress`)
- html2canvas + jsPDF for certificate and cheat sheet PDF export
- Icons from Lucide via `@iconify-json/lucide`

**Build & Deploy:**
- Static generation: `npm run generate`
- GitHub Pages with `baseURL: '/devops/'`
- GitHub Actions workflow in `.github/workflows/deploy.yml`

**Development Server Configuration:**
- Dev server URL: `http://localhost:5000/devops/`
- Port 5000 is the ONLY valid development port
- Do NOT attempt to run the dev server on any other ports

## Tooling Reference

This section documents all available Claude tools organized by type and purpose.

### Commands Reference

Commands are invoked via `/command-name` and execute specific workflows.

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/generate-lesson` | Generate lesson markdown with frontmatter | Creating new lesson files (simple cases) |
| `/generate-cheat-sheet` | Synthesize cheat sheet from topic lessons | After completing all lessons in a topic |
| `/create-component` | Create Vue component with conventions | Building new UI components |
| `/design-page` | Design page with UI/UX patterns | Creating new route pages |
| `/implement-phase` | Execute implementation plan phase | Working through LMS_IMPLEMENTATION_PLAN.md |
| `/project-status` | Check implementation progress | Reviewing project state and next steps |
| `/review` | Code quality review with checklist | Before committing significant changes |
| `/test-feature` | Test feature with automated/manual checks | After implementing a feature |

**Command Usage Patterns:**

```
/generate-cheat-sheet phase-1-sdlc/sdlc-models
/create-component lesson/LessonHeader
/implement-phase 4
/review app/components/progress/
/test-feature progress-tracking
```

### Skills Reference

Skills provide domain expertise and are auto-activated based on context.

| Skill | Domain | Activation Triggers |
|-------|--------|---------------------|
| `nuxt-ui` | Nuxt UI v4 components | Creating UI, buttons, cards, forms, modals |
| `nuxt-content` | @nuxt/content module | Markdown files, frontmatter, queryContent |
| `vue-composables` | Vue 3 composables | Creating composables, localStorage, useState |
| `quiz-system` | Quiz implementation | Quiz components, question types, scoring |
| `cheat-sheets` | Cheat sheet authoring | Creating/editing cheat sheet content |
| `svg-illustrations` | Hand-drawn SVG diagrams | Creating illustrations, MDC components |
| `ui-ux-design` | UI/UX patterns | Designing pages, layouts, navigation |

**When to Consult Skills:**

- **nuxt-ui**: Reference component APIs (`UCard`, `UButton`, variants, props)
- **nuxt-content**: Learn `queryContent()` patterns, navigation, rendering
- **vue-composables**: Follow SSR-safe patterns, localStorage handling
- **quiz-system**: Understand question types, scoring logic, guidelines
- **cheat-sheets**: Follow templates, no-illustration rules, PDF considerations
- **svg-illustrations**: Choose correct component, understand props/colors
- **ui-ux-design**: Apply design system colors, spacing, accessibility

### Agents Reference

Agents are autonomous tools for complex multi-step tasks.

| Agent | Location | Purpose |
|-------|----------|---------|
| `lesson-creator` | `.claude/agents/lesson-creator.md` | Generate complete lessons with research |

**lesson-creator Agent Details:**

Invocation: Use Task tool with `subagent_type: "lesson-creator"`

**Capabilities:**
- Classifies topic as STABLE or RESEARCH
- Performs web research for current information when needed
- Generates complete lesson with frontmatter, content, illustrations, quiz
- Enforces quiz alignment (questions only test lesson content)
- Produces standardized creation report

**Input Format:**
```
Generate lesson: phase-2-foundations/linux-fundamentals/file-system-hierarchy
```

### Tool Selection Decision Tree

```
What do you need to do?
│
├── Create lesson content?
│   ├── Full lesson with research → lesson-creator agent (REQUIRED)
│   └── Simple lesson from template → /generate-lesson command
│
├── Create cheat sheet?
│   └── /generate-cheat-sheet command (REQUIRED)
│
├── Create Vue component?
│   └── /create-component command
│
├── Design a new page?
│   └── /design-page command
│
├── Check project progress?
│   └── /project-status command
│
├── Review code quality?
│   └── /review command
│
├── Test a feature?
│   └── /test-feature command
│
├── Need component API reference?
│   └── Consult nuxt-ui skill
│
├── Working with markdown/content?
│   └── Consult nuxt-content skill
│
├── Creating composables?
│   └── Consult vue-composables skill
│
├── Working with quizzes?
│   └── Consult quiz-system skill
│
├── Creating illustrations?
│   └── Consult svg-illustrations skill
│
└── Designing UI/layouts?
    └── Consult ui-ux-design skill
```

## Development Workflow

**File Naming Conventions:**
- Components: `PascalCase.vue` (e.g., `LessonSidebar.vue`)
- Composables: `useCamelCase.ts` (e.g., `useProgress.ts`)
- Content: `{phase}/{topic}/{subtopic}.md` with numeric prefixes for ordering

**Code Organization:**
- `app/components/` - Vue components by feature
- `app/composables/` - Reusable composition functions
- `app/data/` - Roadmap data and TypeScript types
- `content/` - Markdown lesson files (527+)
- `scripts/` - Build and generation scripts

**Content Creation Process:**
1. For new lessons: Invoke `lesson-creator` agent with topic path
2. For cheat sheets: Run `/generate-cheat-sheet` command after topic lessons complete
3. For illustrations: Consult `svg-illustrations` skill when needed
4. Agent/command handles classification, research, formatting, and validation

**Quality Gates:**
- `npm run lint` - ESLint checks
- `npm run typecheck` - TypeScript validation
- `npm run build` - Production build verification

## Governance

This Constitution supersedes all other development practices for the DevOps LMS project.

**Amendment Process:**
1. Amendments require documentation in this file
2. Version number must be updated following semantic versioning
3. Sync Impact Report must be prepended as HTML comment
4. Dependent templates must be reviewed for consistency

**Compliance:**
- All PRs/reviews MUST verify adherence to Constitution principles
- Violations require documented justification in Complexity Tracking
- Use CLAUDE.md for runtime development guidance
- Content generation MUST use designated tools (Principle VIII)

**Versioning Policy:**
- MAJOR: Principle removal, redefinition, or backward-incompatible governance change
- MINOR: New principle added, section materially expanded
- PATCH: Clarifications, wording improvements, non-semantic refinements

**Version**: 1.2.1 | **Ratified**: 2026-01-12 | **Last Amended**: 2026-01-13
