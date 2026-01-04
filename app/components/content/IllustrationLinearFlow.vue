<!--
  IllustrationLinearFlow Component
  =================================
  A reusable SVG component for rendering linear step-by-step flows.
  Features hand-drawn aesthetic with dashed strokes and slight rotations.

  Use Cases:
  - Scrum Framework Flow
  - CI/CD Pipeline
  - SDLC Phases
  - Any sequential process

  Structure:
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │  Step 1 │ ──► │  Step 2 │ ──► │  Step 3 │
  └─────────┘     └─────────┘     └─────────┘
        ◄─────────── Feedback Loop ───────────┘

  Auto-Direction Logic:
  - If >5 steps → vertical layout (stacked)
  - If ≤5 steps → horizontal layout (side-by-side)
  - Can be overridden with explicit direction prop

  Props:
  - steps: Array of step objects with label, sublabel, icon, color
  - direction: 'horizontal' | 'vertical' (auto-determined if not set)
  - showFeedbackLoop: Boolean to show return arrow
  - feedbackLabel: Label for feedback arrow
-->

<template>
  <div :class="['illustration-linear-flow', sizeClass, containerScrollClass]" :style="containerStyle">
    <svg
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      :class="svgClasses"
      :style="svgStyle"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- Background pattern for hand-drawn feel -->
      <defs>
        <filter
          id="roughness"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="1"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0.5"
          />
        </filter>
      </defs>

      <!-- Steps -->
      <g
        v-for="(step, index) in steps"
        :key="index"
      >
        <!-- Step Box -->
        <g :transform="getStepTransform(index)">
          <!-- Box background -->
          <rect
            :x="0"
            :y="0"
            :width="SPACING.boxWidth"
            :height="SPACING.boxHeight"
            :rx="SPACING.borderRadius"
            :fill="getColor(step.color).main"
            :fill-opacity="OPACITY.boxFill"
            :stroke="getColor(step.color).main"
            :stroke-width="STROKES.boxStrokeWidth"
            :stroke-dasharray="STROKES.boxDash"
            :transform="`rotate(${getHandDrawnRotation(index)}, ${SPACING.boxWidth / 2}, ${SPACING.boxHeight / 2})`"
          />

          <!-- Icon circle (if icon provided) -->
          <g v-if="step.icon">
            <circle
              :cx="SPACING.boxWidth / 2"
              :cy="18"
              :r="SPACING.iconRadius / 2"
              :fill="getColor(step.color).main"
              :fill-opacity="OPACITY.iconCircleFill"
            />
            <text
              :x="SPACING.boxWidth / 2"
              :y="22"
              :font-size="TYPOGRAPHY.iconSize - 4"
              text-anchor="middle"
              dominant-baseline="middle"
            >{{ step.icon }}</text>
          </g>

          <!-- Label -->
          <text
            :x="SPACING.boxWidth / 2"
            :y="step.icon ? 45 : 30"
            :fill="getColor(step.color).text"
            :font-size="TYPOGRAPHY.labelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            font-weight="600"
            text-anchor="middle"
          >{{ step.label }}</text>

          <!-- Sublabel (if provided) -->
          <text
            v-if="step.sublabel"
            :x="SPACING.boxWidth / 2"
            :y="step.icon ? 60 : 48"
            :fill="getColor(step.color).light"
            :font-size="TYPOGRAPHY.sublabelSize"
            :font-family="TYPOGRAPHY.fontFamily"
            text-anchor="middle"
            opacity="0.8"
          >{{ step.sublabel }}</text>
        </g>

        <!-- Arrow to next step (if not last) -->
        <g v-if="index < steps.length - 1">
          <line
            v-if="effectiveDirection === 'horizontal'"
            :x1="getArrowStartX(index)"
            :y1="startY + SPACING.boxHeight / 2"
            :x2="getArrowEndX(index)"
            :y2="startY + SPACING.boxHeight / 2"
            :stroke="getColor(steps[index + 1]?.color ?? 'gray').light"
            :stroke-width="STROKES.arrowStrokeWidth"
            :stroke-dasharray="STROKES.arrowDash"
          />
          <!-- Arrowhead -->
          <polygon
            v-if="effectiveDirection === 'horizontal'"
            :points="getArrowheadPoints(index)"
            :fill="getColor(steps[index + 1]?.color ?? 'gray').light"
          />

          <!-- Vertical arrows -->
          <line
            v-if="effectiveDirection === 'vertical'"
            :x1="startX + SPACING.boxWidth / 2"
            :y1="getVerticalArrowStartY(index)"
            :x2="startX + SPACING.boxWidth / 2"
            :y2="getVerticalArrowEndY(index)"
            :stroke="getColor(steps[index + 1]?.color ?? 'gray').light"
            :stroke-width="STROKES.arrowStrokeWidth"
            :stroke-dasharray="STROKES.arrowDash"
          />
          <polygon
            v-if="effectiveDirection === 'vertical'"
            :points="getVerticalArrowheadPoints(index)"
            :fill="getColor(steps[index + 1]?.color ?? 'gray').light"
          />
        </g>
      </g>

      <!-- Feedback Loop (if enabled) -->
      <g v-if="showFeedbackLoop && effectiveDirection === 'horizontal'">
        <!-- Curved feedback arrow -->
        <path
          :d="feedbackPath"
          fill="none"
          :stroke="COLORS.gray.light"
          :stroke-width="STROKES.arrowStrokeWidth"
          :stroke-dasharray="STROKES.arrowDash"
        />
        <!-- Feedback arrowhead -->
        <polygon
          :points="feedbackArrowheadPoints"
          :fill="COLORS.gray.light"
        />
        <!-- Feedback label -->
        <text
          v-if="feedbackLabel"
          :x="viewBox.width / 2"
          :y="viewBox.height - 15"
          :fill="COLORS.gray.text"
          :font-size="TYPOGRAPHY.smallSize"
          :font-family="TYPOGRAPHY.fontFamily"
          text-anchor="middle"
          font-style="italic"
        >{{ feedbackLabel }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * IllustrationLinearFlow
 * ----------------------
 * Renders a horizontal or vertical flow of steps with connecting arrows.
 * Uses the shared design system for consistent styling.
 */

import {
  COLORS,
  SPACING,
  STROKES,
  OPACITY,
  TYPOGRAPHY,
  getColor,
  calculateLinearFlowViewBox,
  getHandDrawnRotation
} from '~/composables/useIllustrationDesign'

// =============================================================================
// TYPES
// =============================================================================

interface Step {
  label: string
  sublabel?: string
  icon?: string
  color: string
}

/** Available size options for the illustration */
type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

/** Map size prop to Tailwind max-width classes */
const SIZE_CLASSES: Record<IllustrationSize, string> = {
  'sm': 'max-w-sm', // 384px - vertical flows
  'md': 'max-w-md', // 448px - small horizontal flows
  'lg': 'max-w-lg', // 512px
  'xl': 'max-w-xl', // 576px
  '2xl': 'max-w-2xl', // 672px - standard horizontal flows
  '3xl': 'max-w-3xl', // 768px - large illustrations
  'full': 'max-w-full'
}

// =============================================================================
// PROPS
// =============================================================================

const props = withDefaults(defineProps<{
  /** Array of steps to render */
  steps: Step[]
  /** Flow direction - auto-determined based on step count if not specified (>5 steps = vertical) */
  direction?: 'horizontal' | 'vertical'
  /** Show feedback loop arrow */
  showFeedbackLoop?: boolean
  /** Label for feedback loop */
  feedbackLabel?: string
  /** Size of the illustration (controls max-width). Defaults to 'full' for horizontal, 'sm' for vertical */
  size?: IllustrationSize
}>(), {
  direction: undefined,
  showFeedbackLoop: false,
  feedbackLabel: ''
})

// =============================================================================
// COMPUTED VALUES
// =============================================================================

/**
 * Get the effective direction based on step count
 * - If direction prop is explicitly set, use that
 * - Otherwise: >5 steps = vertical, ≤5 steps = horizontal
 */
const effectiveDirection = computed((): 'horizontal' | 'vertical' => {
  if (props.direction) return props.direction
  return props.steps.length > 5 ? 'vertical' : 'horizontal'
})

/** Get the effective size - uses prop if provided, otherwise defaults based on direction */
const effectiveSize = computed((): IllustrationSize => {
  if (props.size) return props.size
  // Default: full width for horizontal, small for vertical
  return effectiveDirection.value === 'horizontal' ? 'full' : 'sm'
})

/** Get the max-width class based on effective size */
const sizeClass = computed(() => SIZE_CLASSES[effectiveSize.value])

/** Add scroll class for vertical layouts with >10 items */
const containerScrollClass = computed(() => {
  if (effectiveDirection.value === 'vertical' && props.steps.length > 10) {
    return 'overflow-y-auto'
  }
  return ''
})

/** Container style - add max-height for scrollable vertical layouts */
const containerStyle = computed(() => {
  if (effectiveDirection.value === 'vertical' && props.steps.length > 10) {
    // Max height roughly equivalent to 10 items (~1200px)
    return { maxHeight: '600px' }
  }
  return {}
})

/** Calculate viewBox dimensions based on steps */
const viewBox = computed(() => {
  return calculateLinearFlowViewBox(props.steps.length, effectiveDirection.value, props.showFeedbackLoop)
})

/** Starting X position (centered with padding) */
const startX = computed(() => 30)

/** Starting Y position */
const startY = computed(() => 30)

/** ARIA label for accessibility */
const ariaLabel = computed(() => {
  const stepLabels = props.steps.map(s => s.label).join(', then ')
  return `Flow diagram: ${stepLabels}`
})

/** SVG classes - horizontal stretches to fill, vertical uses intrinsic size */
const svgClasses = computed(() => {
  return effectiveDirection.value === 'horizontal'
    ? 'w-full h-auto'
    : 'h-auto'
})

/** SVG inline style - constrain vertical layout width */
const svgStyle = computed(() => {
  if (effectiveDirection.value === 'vertical') {
    // Scale up viewBox width by 1.4x for better readability
    const scaledWidth = Math.round(viewBox.value.width * 1.4)
    return { width: `${scaledWidth}px`, maxWidth: '100%' }
  }
  return {}
})

// =============================================================================
// POSITION CALCULATIONS - HORIZONTAL
// =============================================================================

/** Get transform for step box positioning */
function getStepTransform(index: number): string {
  if (effectiveDirection.value === 'horizontal') {
    const x = startX.value + index * (SPACING.boxWidth + SPACING.arrowLength)
    return `translate(${x}, ${startY.value})`
  } else {
    const y = startY.value + index * (SPACING.boxHeight + 50)
    return `translate(${startX.value}, ${y})`
  }
}

/** Arrow start X position (right edge of current box) */
function getArrowStartX(index: number): number {
  return startX.value + (index + 1) * SPACING.boxWidth + index * SPACING.arrowLength + 5
}

/** Arrow end X position (left edge of next box) */
function getArrowEndX(index: number): number {
  return startX.value + (index + 1) * (SPACING.boxWidth + SPACING.arrowLength) - 5
}

/** Arrowhead polygon points */
function getArrowheadPoints(index: number): string {
  const tipX = getArrowEndX(index)
  const y = startY.value + SPACING.boxHeight / 2
  return `${tipX},${y} ${tipX - 8},${y - 5} ${tipX - 8},${y + 5}`
}

// =============================================================================
// POSITION CALCULATIONS - VERTICAL
// =============================================================================

/** Vertical arrow start Y */
function getVerticalArrowStartY(index: number): number {
  return startY.value + (index + 1) * SPACING.boxHeight + index * 50 + 5
}

/** Vertical arrow end Y */
function getVerticalArrowEndY(index: number): number {
  return startY.value + (index + 1) * (SPACING.boxHeight + 50) - 5
}

/** Vertical arrowhead points */
function getVerticalArrowheadPoints(index: number): string {
  const tipY = getVerticalArrowEndY(index)
  const x = startX.value + SPACING.boxWidth / 2
  return `${x},${tipY} ${x - 5},${tipY - 8} ${x + 5},${tipY - 8}`
}

// =============================================================================
// FEEDBACK LOOP
// =============================================================================

/** SVG path for feedback loop curve */
const feedbackPath = computed(() => {
  const lastStepX = startX.value + (props.steps.length - 1) * (SPACING.boxWidth + SPACING.arrowLength) + SPACING.boxWidth / 2
  const firstStepX = startX.value + SPACING.boxWidth / 2
  const boxBottom = startY.value + SPACING.boxHeight
  const curveY = viewBox.value.height - 35

  return `M ${lastStepX} ${boxBottom + 5}
          Q ${lastStepX} ${curveY}, ${viewBox.value.width / 2} ${curveY}
          Q ${firstStepX} ${curveY}, ${firstStepX} ${boxBottom + 5}`
})

/** Feedback arrow head points */
const feedbackArrowheadPoints = computed(() => {
  const x = startX.value + SPACING.boxWidth / 2
  const y = startY.value + SPACING.boxHeight + 5
  return `${x},${y} ${x - 5},${y + 8} ${x + 5},${y + 8}`
})
</script>

<style scoped>
.illustration-linear-flow {
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* Scrollbar styling for vertical layouts with many items */
.illustration-linear-flow.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 transparent;
}

.illustration-linear-flow.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.illustration-linear-flow.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.illustration-linear-flow.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #6b7280;
  border-radius: 3px;
}
</style>
