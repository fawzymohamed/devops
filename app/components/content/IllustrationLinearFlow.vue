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

  Props:
  - steps: Array of step objects with label, sublabel, icon, color
  - direction: 'horizontal' | 'vertical'
  - showFeedbackLoop: Boolean to show return arrow
  - feedbackLabel: Label for feedback arrow
-->

<template>
  <div class="illustration-linear-flow">
    <svg
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      :width="viewBox.width"
      :height="viewBox.height"
      class="w-full h-auto max-w-full"
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
            v-if="direction === 'horizontal'"
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
            v-if="direction === 'horizontal'"
            :points="getArrowheadPoints(index)"
            :fill="getColor(steps[index + 1]?.color ?? 'gray').light"
          />

          <!-- Vertical arrows -->
          <line
            v-if="direction === 'vertical'"
            :x1="startX + SPACING.boxWidth / 2"
            :y1="getVerticalArrowStartY(index)"
            :x2="startX + SPACING.boxWidth / 2"
            :y2="getVerticalArrowEndY(index)"
            :stroke="getColor(steps[index + 1]?.color ?? 'gray').light"
            :stroke-width="STROKES.arrowStrokeWidth"
            :stroke-dasharray="STROKES.arrowDash"
          />
          <polygon
            v-if="direction === 'vertical'"
            :points="getVerticalArrowheadPoints(index)"
            :fill="getColor(steps[index + 1]?.color ?? 'gray').light"
          />
        </g>
      </g>

      <!-- Feedback Loop (if enabled) -->
      <g v-if="showFeedbackLoop && direction === 'horizontal'">
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

// =============================================================================
// PROPS
// =============================================================================

const props = withDefaults(defineProps<{
  /** Array of steps to render */
  steps: Step[]
  /** Flow direction */
  direction?: 'horizontal' | 'vertical'
  /** Show feedback loop arrow */
  showFeedbackLoop?: boolean
  /** Label for feedback loop */
  feedbackLabel?: string
}>(), {
  direction: 'horizontal',
  showFeedbackLoop: false,
  feedbackLabel: ''
})

// =============================================================================
// COMPUTED VALUES
// =============================================================================

/** Calculate viewBox dimensions based on steps */
const viewBox = computed(() => {
  return calculateLinearFlowViewBox(props.steps.length, props.direction, props.showFeedbackLoop)
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

// =============================================================================
// POSITION CALCULATIONS - HORIZONTAL
// =============================================================================

/** Get transform for step box positioning */
function getStepTransform(index: number): string {
  if (props.direction === 'horizontal') {
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
}
</style>
