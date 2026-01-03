# SVG Illustration System Plan

> Created: 2026-01-03
> Status: Implementation in Progress

## Overview

A hybrid system for creating consistent, high-quality SVG hand-drawn style illustrations for the DevOps LMS lessons.

## Problem Statement

Manual SVG creation leads to:
- Inconsistent spacing and positioning
- Overlapping elements
- Error-prone coordinate calculations
- No standardized design system

## Solution: Hybrid Approach

### Part 1: Reusable Vue Components (Library)

Pre-built, tested components for common diagram patterns:

```
app/components/content/            # MDC components (auto-registered for markdown)
├── IllustrationLinearFlow.vue     # A → B → C → D flows
├── IllustrationChecklist.vue      # Definition of Done style
├── IllustrationTeamComposition.vue # Roles in container
├── IllustrationComparisonMap.vue  # Side-by-side mapping
└── (future components as needed)
```

**Note:** Components must be in `components/content/` for MDC syntax to work.

**Design Principles:**
- Data-driven via props
- Auto-calculate viewBox and spacing
- Consistent hand-drawn style (dashed strokes, slight rotations)
- Dark mode native colors

### Part 2: Claude Skill (`svg-illustrations`)

For custom illustrations not covered by reusable components:
- Design system constants (colors, spacing)
- SVG best practices and templates
- Calculation formulas
- Integration guidelines

Location: `.claude/skills/svg-illustrations.md`

## Component Specifications

### 1. IllustrationLinearFlow

**Purpose:** Horizontal or vertical step-by-step flows

**Props:**
```typescript
interface LinearFlowProps {
  steps: Array<{
    label: string
    sublabel?: string
    icon?: string  // emoji
    color: string  // tailwind color name
  }>
  direction?: 'horizontal' | 'vertical'
  showFeedbackLoop?: boolean
  feedbackLabel?: string
}
```

**Use Cases:**
- Scrum Framework Flow
- CI/CD Pipeline
- SDLC Phases
- Any sequential process

### 2. IllustrationChecklist

**Purpose:** Checkbox-style lists with hand-drawn aesthetic

**Props:**
```typescript
interface ChecklistProps {
  title: string
  items: Array<string | { text: string; icon?: string }>
  note?: string
  color?: string  // default: emerald
}
```

**Use Cases:**
- Definition of Done
- Prerequisites
- Acceptance Criteria
- Best Practices lists

### 3. IllustrationTeamComposition

**Purpose:** Team roles in a container

**Props:**
```typescript
interface TeamCompositionProps {
  title: string
  subtitle?: string
  roles: Array<{
    name: string
    owns: string
    icon: string  // emoji
    color: string
    responsibilities: string[]
  }>
  footnote?: string
}
```

**Use Cases:**
- Scrum Team
- DevOps Team Structure
- Any team/role diagram

### 4. IllustrationComparisonMap

**Purpose:** Side-by-side concept mapping with connectors

**Props:**
```typescript
interface ComparisonMapProps {
  leftTitle: string
  rightTitle: string
  leftColor?: string  // default: violet
  rightColor?: string // default: cyan
  connections: Array<{
    left: string
    right: string
    icon: string  // emoji
  }>
  footnote?: string
}
```

**Use Cases:**
- Scrum ↔ DevOps mapping
- Traditional vs Modern approaches
- Any concept comparison

## Design System Constants

```typescript
const DESIGN_SYSTEM = {
  // Colors (Tailwind)
  colors: {
    primary: ['violet', 'blue', 'emerald', 'amber', 'rose', 'cyan'],
    neutral: ['gray'],
  },

  // Spacing
  spacing: {
    boxPadding: 20,
    itemGap: 35,
    arrowLength: 45,
    containerPadding: 30,
  },

  // Stroke styles
  strokes: {
    boxDash: '8,4',
    arrowDash: '4,3',
    containerDash: '10,5',
  },

  // Opacities
  opacity: {
    boxFill: 0.15,
    iconCircleFill: 0.3,
  },

  // Typography
  fonts: {
    family: "'Segoe UI', system-ui, sans-serif",
    titleSize: 14,
    labelSize: 12,
    sublabelSize: 10,
    smallSize: 9,
  },
}
```

## Updated Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     LESSON CREATION WORKFLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: /project-status                                        │
│          ↓                                                       │
│  Step 2: lesson-creator agent                                   │
│          ├── Generates MD content                               │
│          ├── Generates quiz                                     │
│          └── Identifies needed illustrations                    │
│              ↓                                                   │
│          ┌─────────────────────────────────────────┐            │
│          │ Does a reusable component exist?        │            │
│          └─────────────────────────────────────────┘            │
│                    │                    │                        │
│                   YES                   NO                       │
│                    ↓                    ↓                        │
│          Reference component     Trigger svg-illustrations      │
│          in lesson content       skill to create custom SVG     │
│                    │                    │                        │
│                    └────────┬───────────┘                        │
│                             ↓                                    │
│  Step 3: /test-feature                                          │
│          ↓                                                       │
│  Step 4: /review                                                │
│          ↓                                                       │
│  Step 5: commit                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Integration with Lessons

Components are used in lesson pages via dynamic imports based on lesson metadata or directly in custom lesson templates.

## Future Expansion

Additional components can be added as needed:
- `IllustrationTimeline` - Events on a timeline
- `IllustrationPillars` - Supporting pillars diagram
- `IllustrationCycle` - Circular/cyclic processes
- `IllustrationHierarchy` - Tree structures

## Files Created

1. `app/components/content/IllustrationLinearFlow.vue` ✅
2. `app/components/content/IllustrationChecklist.vue` ✅
3. `app/components/content/IllustrationTeamComposition.vue` ✅
4. `app/components/content/IllustrationComparisonMap.vue` ✅
5. `app/composables/useIllustrationDesign.ts` ✅
6. `.claude/skills/svg-illustrations.md` ✅
7. Updated `lesson-creator` agent ✅
