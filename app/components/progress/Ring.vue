<!--
  ProgressRing.vue - Circular Progress Indicator Component
  =========================================================
  A circular SVG-based progress indicator perfect for compact displays
  like phase cards and statistics.

  Features:
  - SVG-based circular progress ring
  - Configurable size and stroke width
  - Optional center label showing percentage
  - Smooth animated fill transition
  - Customizable colors
  - Dark mode optimized

  Props:
  - value: Current progress percentage (0-100)
  - size: Ring diameter in pixels (default: 48)
  - strokeWidth: Thickness of the ring (default: 4)
  - showLabel: Show percentage in center (default: true)
  - color: Ring color (hex code or Tailwind color)

  Usage:
  ```vue
  <ProgressRing :value="75" :size="64" color="#22c55e" />
  ```

  Visual Structure:
       ╭───────╮
      ╱  ████   ╲
     │  ██75%██  │
      ╲  ████   ╱
       ╰───────╯
-->

<script setup lang="ts">
/**
 * Props Interface
 * ---------------
 * All configuration options for the progress ring
 */
interface Props {
  /** Progress percentage (0-100) */
  value: number
  /** Ring diameter in pixels */
  size?: number
  /** Stroke thickness in pixels */
  strokeWidth?: number
  /** Show percentage text in center */
  showLabel?: boolean
  /** Ring color (hex code) */
  color?: string
  /** Track (background) color */
  trackColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 48,
  strokeWidth: 4,
  showLabel: true,
  color: '#22c55e', // Green-500
  trackColor: '#374151' // Gray-700
})

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Center point of the SVG circle
 * Half of the total size for centered positioning
 */
const center = computed(() => props.size / 2)

/**
 * Circle radius
 * Calculated from center minus half the stroke width
 * This ensures the stroke stays within the SVG bounds
 */
const radius = computed(() => center.value - props.strokeWidth / 2)

/**
 * Circle circumference
 * Used to calculate the dash offset for progress
 * Formula: 2 * PI * radius
 */
const circumference = computed(() => 2 * Math.PI * radius.value)

/**
 * Stroke dash offset
 * Controls how much of the circle is filled
 * Formula: circumference * (1 - progress/100)
 */
const dashOffset = computed(() => {
  const progress = Math.min(100, Math.max(0, props.value))
  return circumference.value * (1 - progress / 100)
})

/**
 * Clamped percentage for display
 * Ensures value stays between 0-100
 */
const percentage = computed(() => {
  return Math.min(100, Math.max(0, Math.round(props.value)))
})

/**
 * Font size for label based on ring size
 * Scales appropriately with the ring diameter
 */
const fontSize = computed(() => {
  if (props.size <= 32) return 8
  if (props.size <= 48) return 10
  if (props.size <= 64) return 12
  return 14
})
</script>

<template>
  <!--
    Progress Ring Container
    =======================
    Relative positioning for centering the label
  -->
  <div class="relative inline-flex items-center justify-center">
    <!--
      SVG Circle Ring
      ===============
      Two overlapping circles:
      1. Background track (gray)
      2. Progress arc (colored, animated)
    -->
    <svg
      :width="size"
      :height="size"
      class="transform -rotate-90"
    >
      <!--
        Background Track Circle
        =======================
        Full circle in gray providing the "track" appearance
      -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        class="opacity-30"
      />

      <!--
        Progress Circle
        ===============
        Animated stroke-dashoffset creates the fill effect
        Starts from top (due to -90deg rotation on parent SVG)
      -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="transition-all duration-500 ease-out"
      />
    </svg>

    <!--
      Center Label
      ============
      Shows percentage in the center of the ring
      Only displayed when showLabel is true
    -->
    <span
      v-if="showLabel"
      class="absolute font-bold text-white"
      :style="{ fontSize: `${fontSize}px` }"
    >
      {{ percentage }}%
    </span>
  </div>
</template>
