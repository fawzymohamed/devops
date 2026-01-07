<!--
  ProgressBar.vue - Reusable Progress Bar Component
  ==================================================
  A wrapper around Nuxt UI's UProgress component with consistent styling
  and additional features like percentage labels.

  Features:
  - Configurable size variants (sm, md, lg)
  - Color variants (primary, success, warning, error)
  - Optional percentage label display
  - Animated fill on mount
  - Consistent dark mode styling

  Props:
  - value: Current progress value (0-100)
  - max: Maximum value (default: 100)
  - showLabel: Whether to show percentage text
  - size: Size variant (sm, md, lg)
  - color: Color variant (primary, success, warning, error)

  Usage:
  ```vue
  <ProgressBar :value="75" show-label color="success" />
  ```

  Visual Structure:
  ┌────────────────────────────────────────────┐
  │  [████████████████████░░░░░░░░]  75%       │
  └────────────────────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Props Interface
 * ---------------
 * Defines all configurable options for the progress bar
 */
interface Props {
  /** Current progress value (0-100) */
  value: number
  /** Maximum value (default: 100) */
  max?: number
  /** Show percentage label next to bar */
  showLabel?: boolean
  /** Size variant affects bar height */
  size?: 'sm' | 'md' | 'lg'
  /** Color variant for the progress fill */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  showLabel: false,
  size: 'md',
  color: 'primary'
})

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Calculate percentage for display
 * Ensures value is clamped between 0 and 100
 */
const percentage = computed(() => {
  const pct = Math.round((props.value / props.max) * 100)
  return Math.min(100, Math.max(0, pct))
})

/**
 * Size classes for the progress bar height
 * Maps size prop to specific Tailwind height classes
 */
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-1.5'
    case 'lg':
      return 'h-4'
    default:
      return 'h-2.5'
  }
})

/**
 * Nuxt UI color mapping
 * Maps our color props to Nuxt UI color values
 */
const uiColor = computed(() => {
  switch (props.color) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    case 'neutral':
      return 'neutral'
    default:
      return 'primary'
  }
})
</script>

<template>
  <!--
    Progress Bar Container
    ======================
    Wraps the progress bar and optional label in a flex container
  -->
  <div class="flex items-center gap-3">
    <!--
      Nuxt UI Progress Component
      ==========================
      Uses Nuxt UI's UProgress with our styling configuration
    -->
    <UProgress
      :model-value="percentage"
      :color="uiColor"
      :class="['flex-1', sizeClasses]"
    />

    <!--
      Percentage Label
      ================
      Optional label showing current percentage
      Only displayed when showLabel prop is true
    -->
    <span
      v-if="showLabel"
      class="text-sm font-medium text-gray-400 min-w-[3rem] text-right"
    >
      {{ percentage }}%
    </span>
  </div>
</template>
