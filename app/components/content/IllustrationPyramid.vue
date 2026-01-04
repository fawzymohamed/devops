<!--
  IllustrationPyramid Component
  =============================
  A reusable SVG component for rendering pyramid diagrams.
  Features hand-drawn aesthetic with layered sections.

  Use Cases:
  - Testing Pyramid
  - Priority hierarchies
  - Layered architectures
  - Any bottom-up structure where size indicates quantity/importance

  Structure:
         /\
        /  \     Top layer (few/small)
       /____\
      /      \   Middle layer (some/medium)
     /________\
    /          \ Bottom layer (many/large)
   /______________\

  Props:
  - layers: Array of layer objects (top to bottom)
  - title: Optional title above pyramid
  - footnote: Optional note at bottom
-->

<template>
  <div :class="['illustration-pyramid', sizeClass]">
    <svg
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      class="w-full h-auto"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- Title (if provided) - centered over pyramid area -->
      <text
        v-if="title"
        :x="60 + pyramidWidth / 2"
        y="25"
        :fill="COLORS.gray.text"
        :font-size="TYPOGRAPHY.titleSize"
        :font-family="TYPOGRAPHY.fontFamily"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
      >{{ title }}</text>

      <!-- Pyramid Layers (rendered bottom to top for proper z-index) -->
      <!-- Center pyramid accounting for icon space on left (60px offset) -->
      <g :transform="`translate(${60 + pyramidWidth / 2}, ${titleOffset + 20})`">
        <g
          v-for="(layer, index) in reversedLayers"
          :key="index"
        >
          <!-- Layer trapezoid/triangle -->
          <path
            :d="getLayerPath(layers.length - 1 - index)"
            :fill="getColor(layer.color).main"
            :fill-opacity="OPACITY.boxFill + 0.1"
            :stroke="getColor(layer.color).main"
            :stroke-width="STROKES.boxStrokeWidth"
            :stroke-dasharray="STROKES.boxDash"
            :transform="`rotate(${getHandDrawnRotation(index)}, 0, ${getLayerCenterY(layers.length - 1 - index)})`"
          />

          <!-- Layer icon (if provided) -->
          <text
            v-if="layer.icon"
            :x="-pyramidWidth / 2 - 35"
            :y="getLayerCenterY(layers.length - 1 - index)"
            :font-size="TYPOGRAPHY.iconSize"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ layer.icon }}</text>

          <!-- Layer label -->
          <text
            x="0"
            :y="getLayerCenterY(layers.length - 1 - index) - 6"
            :fill="getColor(layer.color).text"
            :font-size="TYPOGRAPHY.labelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            font-weight="600"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ layer.label }}</text>

          <!-- Layer description (if provided) -->
          <text
            v-if="layer.description"
            :x="getLayerRightX(layers.length - 1 - index) + 15"
            :y="getLayerCenterY(layers.length - 1 - index)"
            :fill="COLORS.gray.text"
            :font-size="TYPOGRAPHY.sublabelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            dominant-baseline="middle"
          >{{ layer.description }}</text>
        </g>
      </g>

      <!-- Footnote (if provided) - centered under pyramid -->
      <g
        v-if="footnote"
        :transform="`translate(${60 + pyramidWidth / 2}, ${viewBox.height - 20})`"
      >
        <!-- Icon and text centered together -->
        <text
          x="0"
          y="2"
          :fill="COLORS.amber.text"
          :font-size="TYPOGRAPHY.smallSize"
          :font-family="TYPOGRAPHY.fontFamily"
          font-style="italic"
          text-anchor="middle"
          dominant-baseline="middle"
        >💡 {{ footnote }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * IllustrationPyramid
 * -------------------
 * Renders a pyramid diagram with hand-drawn styling.
 * Layers are specified from top (smallest) to bottom (largest).
 */

import {
  COLORS,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

interface PyramidLayer {
  label: string
  description?: string
  icon?: string
  color: string
}

/** Available size options for the illustration */
type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

/** Map size prop to Tailwind max-width classes */
const SIZE_CLASSES: Record<IllustrationSize, string> = {
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  'full': 'max-w-full'
}

// =============================================================================
// PROPS
// =============================================================================

const props = withDefaults(defineProps<{
  /** Layers from top (smallest) to bottom (largest) */
  layers: PyramidLayer[]
  /** Optional title above pyramid */
  title?: string
  /** Optional footnote below pyramid */
  footnote?: string
  /** Size of the illustration (controls max-width) */
  size?: IllustrationSize
}>(), {
  title: '',
  footnote: '',
  size: 'xl'
})

// =============================================================================
// CONSTANTS
// =============================================================================

/** Base width of the bottom layer */
const pyramidWidth = 200

/** Height of each layer */
const layerHeight = 50

/** How much the pyramid narrows per layer (from bottom) */
const narrowingFactor = 0.6

// =============================================================================
// COMPUTED VALUES
// =============================================================================

/** Get the max-width class based on size prop */
const sizeClass = computed(() => SIZE_CLASSES[props.size])

/** Offset for title */
const titleOffset = computed(() => props.title ? 40 : 0)

/** Reversed layers for rendering (bottom to top) */
const reversedLayers = computed(() => [...props.layers].reverse())

/** Calculate viewBox dimensions */
const viewBox = computed(() => {
  const pyramidHeight = props.layers.length * layerHeight
  // Extra space: icons on left (~60) + pyramid (200) + descriptions on right (~180)
  const width = 60 + pyramidWidth + 180
  const height = pyramidHeight + titleOffset.value + (props.footnote ? 60 : 40)
  return { width, height }
})

/** Aria label for accessibility */
const ariaLabel = computed(() => {
  const layerNames = props.layers.map(l => l.label).join(', ')
  return props.title
    ? `${props.title}: ${layerNames}`
    : `Pyramid diagram: ${layerNames}`
})

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the width of a layer at a given index (0 = top, last = bottom)
 */
function getLayerWidth(index: number): number {
  const bottomIndex = props.layers.length - 1
  const levelFromBottom = bottomIndex - index
  // Bottom layer is full width, each layer up is narrower
  return pyramidWidth * Math.pow(narrowingFactor, levelFromBottom)
}

/**
 * Get the Y position of a layer's top edge
 */
function getLayerTopY(index: number): number {
  return index * layerHeight
}

/**
 * Get the Y position of a layer's center
 */
function getLayerCenterY(index: number): number {
  return getLayerTopY(index) + layerHeight / 2
}

/**
 * Get the right X position of a layer (for description placement)
 */
function getLayerRightX(index: number): number {
  return getLayerWidth(index) / 2
}

/**
 * Generate SVG path for a pyramid layer
 * Creates a trapezoid shape (or triangle for top layer)
 */
function getLayerPath(index: number): string {
  const topY = getLayerTopY(index)
  const bottomY = topY + layerHeight
  const topWidth = index === 0 ? 0 : getLayerWidth(index - 1)
  const bottomWidth = getLayerWidth(index)

  // Half widths (centered at x=0)
  const topHalf = topWidth / 2
  const bottomHalf = bottomWidth / 2

  if (index === 0) {
    // Top layer is a triangle
    return `M 0 ${topY} L ${bottomHalf} ${bottomY} L -${bottomHalf} ${bottomY} Z`
  }

  // Other layers are trapezoids
  return `M -${topHalf} ${topY} L ${topHalf} ${topY} L ${bottomHalf} ${bottomY} L -${bottomHalf} ${bottomY} Z`
}
</script>

<style scoped>
.illustration-pyramid {
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>
