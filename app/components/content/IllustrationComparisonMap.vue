<!--
  IllustrationComparisonMap Component
  ====================================
  A reusable SVG component for side-by-side concept mapping with connectors.
  Features hand-drawn aesthetic with connection lines and icons.

  Use Cases:
  - Scrum ↔ DevOps mapping
  - Traditional vs Modern approaches
  - Any concept comparison

  Structure:
  ┌─────────────────────────────────────────────────────────────────┐
  │   Left Title                          Right Title               │
  │                                                                 │
  │   ┌─────────┐        🔗        ┌─────────┐                     │
  │   │ Left 1  │ ──────────────── │ Right 1 │                     │
  │   └─────────┘                  └─────────┘                     │
  │                                                                 │
  │   ┌─────────┐        🔗        ┌─────────┐                     │
  │   │ Left 2  │ ──────────────── │ Right 2 │                     │
  │   └─────────┘                  └─────────┘                     │
  │                                                                 │
  │                    * Footnote                                   │
  └─────────────────────────────────────────────────────────────────┘

  Props:
  - leftTitle: Title for left column
  - rightTitle: Title for right column
  - leftColor: Color for left items
  - rightColor: Color for right items
  - connections: Array of connection objects
  - footnote: Optional footnote text
-->

<template>
  <div :class="['illustration-comparison-map', sizeClass]">
    <svg
      :viewBox="`0 0 ${dynamicViewBoxWidth} ${viewBoxHeight}`"
      class="w-full h-auto"
      role="img"
      :aria-label="`Comparison: ${leftTitle} and ${rightTitle}`"
    >
      <!-- Header Section -->
      <g transform="translate(0, 30)">
        <!-- Left title -->
        <text
          :x="leftColumnX + itemWidth / 2"
          y="0"
          :fill="leftColorValues.text"
          :font-size="TYPOGRAPHY.titleSize"
          :font-family="TYPOGRAPHY.fontFamily"
          font-weight="700"
          text-anchor="middle"
        >{{ leftTitle }}</text>

        <!-- Right title -->
        <text
          :x="rightColumnX + itemWidth / 2"
          y="0"
          :fill="rightColorValues.text"
          :font-size="TYPOGRAPHY.titleSize"
          :font-family="TYPOGRAPHY.fontFamily"
          font-weight="700"
          text-anchor="middle"
        >{{ rightTitle }}</text>
      </g>

      <!-- Connection Rows -->
      <g
        v-for="(connection, index) in connections"
        :key="index"
      >
        <g :transform="`translate(0, ${rowStartY + index * rowHeight})`">
          <!-- Left item box -->
          <rect
            :x="leftColumnX"
            y="0"
            :width="itemWidth"
            :height="itemHeight"
            :rx="SPACING.borderRadius"
            :fill="leftColorValues.main"
            :fill-opacity="OPACITY.boxFill"
            :stroke="leftColorValues.main"
            :stroke-width="STROKES.boxStrokeWidth"
            :stroke-dasharray="STROKES.boxDash"
            :transform="`rotate(${getHandDrawnRotation(index * 2)}, ${leftColumnX + itemWidth / 2}, ${itemHeight / 2})`"
          />

          <!-- Left item text -->
          <text
            :x="leftColumnX + itemWidth / 2"
            :y="itemHeight / 2 + 4"
            :fill="leftColorValues.text"
            :font-size="TYPOGRAPHY.labelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            font-weight="500"
            text-anchor="middle"
          >{{ connection.left }}</text>

          <!-- Connection line -->
          <line
            :x1="leftColumnX + itemWidth + 5"
            :y1="itemHeight / 2"
            :x2="rightColumnX - 5"
            :y2="itemHeight / 2"
            :stroke="COLORS.gray.light"
            :stroke-width="STROKES.arrowStrokeWidth"
            :stroke-dasharray="STROKES.arrowDash"
          />

          <!-- Connection icon - using foreignObject for better emoji rendering -->
          <circle
            :cx="centerX"
            :cy="itemHeight / 2"
            r="14"
            :fill="COLORS.gray.main"
            :fill-opacity="OPACITY.iconCircleFill"
          />
          <foreignObject
            :x="centerX - 12"
            :y="itemHeight / 2 - 12"
            width="24"
            height="24"
          >
            <span class="flex items-center justify-center w-full h-full text-sm">{{ connection.icon }}</span>
          </foreignObject>

          <!-- Right item box -->
          <rect
            :x="rightColumnX"
            y="0"
            :width="itemWidth"
            :height="itemHeight"
            :rx="SPACING.borderRadius"
            :fill="rightColorValues.main"
            :fill-opacity="OPACITY.boxFill"
            :stroke="rightColorValues.main"
            :stroke-width="STROKES.boxStrokeWidth"
            :stroke-dasharray="STROKES.boxDash"
            :transform="`rotate(${getHandDrawnRotation(index * 2 + 1)}, ${rightColumnX + itemWidth / 2}, ${itemHeight / 2})`"
          />

          <!-- Right item text -->
          <text
            :x="rightColumnX + itemWidth / 2"
            :y="itemHeight / 2 + 4"
            :fill="rightColorValues.text"
            :font-size="TYPOGRAPHY.labelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            font-weight="500"
            text-anchor="middle"
          >{{ connection.right }}</text>
        </g>
      </g>

      <!-- Footnote -->
      <text
        v-if="footnote"
        :x="dynamicViewBoxWidth / 2"
        :y="viewBoxHeight - 15"
        :fill="COLORS.gray.light"
        :font-size="TYPOGRAPHY.smallSize"
        :font-family="TYPOGRAPHY.fontFamily"
        text-anchor="middle"
        font-style="italic"
      >{{ footnote }}</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * IllustrationComparisonMap
 * -------------------------
 * Renders a side-by-side comparison with connecting lines
 * between related concepts.
 */

import {
  COLORS,
  SPACING,
  STROKES,
  OPACITY,
  TYPOGRAPHY,
  getColor,
  getHandDrawnRotation
} from '~/composables/useIllustrationDesign'

// =============================================================================
// TYPES
// =============================================================================

interface Connection {
  left: string
  right: string
  icon: string
}

/** Available size options for the illustration */
type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

/** Map size prop to Tailwind max-width classes */
const SIZE_CLASSES: Record<IllustrationSize, string> = {
  'sm': 'max-w-sm', // 384px
  'md': 'max-w-md', // 448px
  'lg': 'max-w-lg', // 512px
  'xl': 'max-w-xl', // 576px
  '2xl': 'max-w-2xl', // 672px - default for comparison maps
  '3xl': 'max-w-3xl', // 768px
  'full': 'max-w-full'
}

// =============================================================================
// PROPS
// =============================================================================

const props = withDefaults(defineProps<{
  /** Title for left column */
  leftTitle: string
  /** Title for right column */
  rightTitle: string
  /** Color for left items */
  leftColor?: string
  /** Color for right items */
  rightColor?: string
  /** Array of connections */
  connections: Connection[]
  /** Optional footnote */
  footnote?: string
  /** Size of the illustration (controls max-width) */
  size?: IllustrationSize
}>(), {
  leftColor: 'violet',
  rightColor: 'cyan',
  footnote: '',
  size: 'full'
})

// =============================================================================
// COMPUTED VALUES
// =============================================================================

/** Get the max-width class based on size prop */
const sizeClass = computed(() => SIZE_CLASSES[props.size])

/** Get color values */
const leftColorValues = computed(() => getColor(props.leftColor))
const rightColorValues = computed(() => getColor(props.rightColor))

/** Calculate viewBox height based on connection count */
const viewBoxHeight = computed(() => {
  return 80 + props.connections.length * 50 + 40
})

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

/** Item box dimensions */
const itemHeight = 40

/** Row layout */
const rowHeight = 50
const rowStartY = 55

/**
 * Calculate item width based on longest text in connections.
 * Uses character count × approx pixels per char for Fuzzy Bubbles font at 12px.
 */
const itemWidth = computed(() => {
  // Find the longest text from all left and right items
  const allTexts = props.connections.flatMap(c => [c.left, c.right])
  const maxLength = Math.max(...allTexts.map(t => t.length))

  // Fuzzy Bubbles at 12px is roughly 7-8px per character
  // Add padding for the box (20px each side)
  const estimatedWidth = maxLength * 7.8 + 40

  // Clamp between min 150px and max 320px
  return Math.max(150, Math.min(320, estimatedWidth))
})

/**
 * Calculate viewBox width dynamically based on item width.
 * Total width = left margin + itemWidth + gap + connector area + gap + itemWidth + right margin
 */
const dynamicViewBoxWidth = computed(() => {
  // 40px margin on each side, 100px center area for icon and lines
  return 40 + itemWidth.value + 100 + itemWidth.value + 40
})

/** Column positions */
const leftColumnX = 40
const rightColumnX = computed(() => dynamicViewBoxWidth.value - itemWidth.value - 40)
const centerX = computed(() => dynamicViewBoxWidth.value / 2)
</script>

<style scoped>
.illustration-comparison-map {
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>
