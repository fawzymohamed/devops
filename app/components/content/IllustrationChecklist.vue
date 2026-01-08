<!--
  IllustrationChecklist Component
  ================================
  A reusable SVG component for rendering checkbox-style lists.
  Features hand-drawn aesthetic with checkmarks and optional icons.

  Use Cases:
  - Definition of Done
  - Prerequisites
  - Acceptance Criteria
  - Best Practices lists

  Structure:
  ┌─────────────────────────────────────────┐
  │  📋 Title                               │
  │  ───────────────────────────────────    │
  │  ☑ Item 1                               │
  │  ☑ Item 2                               │
  │  ☑ Item 3                               │
  │                                         │
  │  💡 Note text here                      │
  └─────────────────────────────────────────┘

  Props:
  - title: String for the checklist title
  - items: Array of strings or objects with text and optional icon
  - note: Optional note text at bottom
  - color: Tailwind color name (default: emerald)
-->

<template>
  <div :class="['illustration-checklist', sizeClass]">
    <svg
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      class="w-full h-auto"
      role="img"
      :aria-label="`Checklist: ${title}`"
    >
      <!-- Container Box -->
      <rect
        x="15"
        y="15"
        :width="viewBox.width - 30"
        :height="viewBox.height - 30"
        :rx="SPACING.borderRadius"
        :fill="colorValues.main"
        :fill-opacity="OPACITY.boxFill * 0.5"
        :stroke="colorValues.main"
        :stroke-width="STROKES.containerStrokeWidth"
        :stroke-dasharray="STROKES.containerDash"
        :transform="`rotate(${getHandDrawnRotation(0)}, ${viewBox.width / 2}, ${viewBox.height / 2})`"
      />

      <!-- Title Section -->
      <g transform="translate(35, 45)">
        <!-- Title icon -->
        <text
          x="0"
          y="0"
          :font-size="TYPOGRAPHY.iconSize"
          dominant-baseline="middle"
        >📋</text>

        <!-- Title text -->
        <text
          x="30"
          y="2"
          :fill="colorValues.text"
          :font-size="TYPOGRAPHY.titleSize"
          :font-family="TYPOGRAPHY.fontFamily"
          font-weight="700"
          dominant-baseline="middle"
        >{{ title }}</text>

        <!-- Underline -->
        <line
          x1="0"
          y1="20"
          :x2="viewBox.width - 80"
          y2="20"
          :stroke="colorValues.light"
          :stroke-width="1.5"
          :stroke-dasharray="STROKES.boxDash"
          opacity="0.5"
        />
      </g>

      <!-- Checklist Items -->
      <g
        v-for="(item, index) in normalizedItems"
        :key="index"
      >
        <g :transform="`translate(40, ${95 + index * SPACING.itemGap})`">
          <!-- Checkbox -->
          <rect
            x="0"
            y="-8"
            width="16"
            height="16"
            :rx="3"
            :fill="colorValues.main"
            :fill-opacity="OPACITY.iconCircleFill"
            :stroke="colorValues.main"
            :stroke-width="1.5"
            :transform="`rotate(${getHandDrawnRotation(index + 1)}, 8, 0)`"
          />

          <!-- Checkmark -->
          <path
            d="M 3 0 L 7 4 L 13 -4"
            fill="none"
            :stroke="colorValues.text"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Item icon (if provided) - using foreignObject for better emoji rendering -->
          <foreignObject
            v-if="item.icon"
            x="24"
            y="-10"
            width="24"
            height="24"
          >
            <span class="flex items-center justify-center w-full h-full text-sm">{{ item.icon }}</span>
          </foreignObject>

          <!-- Item text -->
          <text
            :x="item.icon ? 52 : 28"
            y="2"
            :fill="colorValues.text"
            :font-size="TYPOGRAPHY.labelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            dominant-baseline="middle"
          >{{ item.text }}</text>
        </g>
      </g>

      <!-- Note Section (if provided) -->
      <g
        v-if="note"
        :transform="`translate(35, ${noteY})`"
      >
        <!-- Note icon -->
        <text
          x="0"
          y="0"
          :font-size="TYPOGRAPHY.labelSize"
          dominant-baseline="middle"
        >💡</text>

        <!-- Note text -->
        <text
          x="22"
          y="2"
          :fill="COLORS.amber.text"
          :font-size="TYPOGRAPHY.smallSize"
          :font-family="TYPOGRAPHY.fontFamily"
          font-style="italic"
          dominant-baseline="middle"
        >{{ note }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * IllustrationChecklist
 * ---------------------
 * Renders a checklist with hand-drawn checkbox styling.
 * Items can be strings or objects with text and optional icon.
 */

import {
  COLORS,
  SPACING,
  STROKES,
  OPACITY,
  TYPOGRAPHY,
  getColor,
  calculateChecklistViewBox,
  getHandDrawnRotation
} from '~/composables/useIllustrationDesign'

// =============================================================================
// TYPES
// =============================================================================

interface ChecklistItem {
  text: string
  icon?: string
}

/** Available size options for the illustration */
type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

/** Map size prop to Tailwind max-width classes */
const SIZE_CLASSES: Record<IllustrationSize, string> = {
  'sm': 'max-w-sm', // 384px
  'md': 'max-w-md', // 448px
  'lg': 'max-w-lg', // 512px - default for checklists
  'xl': 'max-w-xl', // 576px
  '2xl': 'max-w-2xl', // 672px
  '3xl': 'max-w-3xl', // 768px
  'full': 'max-w-full'
}

// =============================================================================
// PROPS
// =============================================================================

const props = withDefaults(defineProps<{
  /** Checklist title */
  title: string
  /** Array of items (strings or objects) */
  items: (string | ChecklistItem)[]
  /** Optional note at bottom */
  note?: string
  /** Color theme */
  color?: string
  /** Size of the illustration (controls max-width) */
  size?: IllustrationSize
}>(), {
  color: 'emerald',
  note: '',
  size: '2xl'
})

// =============================================================================
// COMPUTED VALUES
// =============================================================================

/** Get the max-width class based on size prop */
const sizeClass = computed(() => SIZE_CLASSES[props.size])

/** Get color values for the theme */
const colorValues = computed(() => getColor(props.color))

/** Normalize items to consistent format */
const normalizedItems = computed((): ChecklistItem[] => {
  return props.items.map((item) => {
    if (typeof item === 'string') {
      return { text: item }
    }
    return item
  })
})

/** Calculate viewBox dimensions */
const viewBox = computed(() => {
  return calculateChecklistViewBox(props.items.length, !!props.note)
})

/** Y position for note */
const noteY = computed(() => {
  return 95 + props.items.length * SPACING.itemGap + 15
})
</script>

<style scoped>
.illustration-checklist {
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>
