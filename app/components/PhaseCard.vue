<!--
  PhaseCard.vue - Phase Navigation Card Component
  ================================================
  A clickable card component used in the horizontal phase navigation bar.
  Each card represents one learning phase and displays its key information.

  Features:
  - Active state highlighting with dynamic phase color
  - Gradient background effect when selected
  - Hover effects for better interactivity
  - Displays phase number, title, description, and duration
  - Minimum width ensures consistent card sizes in horizontal scroll

  Props:
  - phase: The complete phase data object
  - isActive: Boolean indicating if this phase is currently selected

  Events:
  - select: Emitted when the card is clicked

  Visual Structure:
  ┌────────────────────────────────┐
  │  [Icon]  Phase N               │
  │          Phase Title           │
  │                                │
  │  Description text...           │
  │                                │
  │  [Duration Badge]              │
  └────────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Type Import
 * -----------
 * Imports the Phase interface for TypeScript type safety.
 */
import type { Phase } from '~/data/roadmap'

/**
 * Component Props
 * ---------------
 * @prop phase - The phase data object containing all phase information
 * @prop isActive - Whether this phase is currently selected/active
 */
const props = defineProps<{
  phase: Phase
  isActive: boolean
}>()

/**
 * Component Events
 * ----------------
 * @event select - Emitted when the card is clicked to select this phase
 */
const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <!--
    Phase Card Container
    ====================
    Clickable card with dynamic styling based on active state.

    Styling Logic:
    - Active: Gradient background using phase color, colored border
    - Inactive: Subtle white background, transparent border with hover effect

    The min-width ensures cards maintain consistent size in horizontal scroll.
  -->
  <div
    class="cursor-pointer rounded-2xl p-5 min-w-[280px] transition-all duration-300 border-2"
    :class="[
      isActive ? 'border-current' : 'border-transparent hover:border-gray-600'
    ]"
    :style="{
      background: isActive
        ? `linear-gradient(135deg, ${phase.color}40, ${phase.color}20)`
        : 'rgba(255,255,255,0.05)',
      borderColor: isActive ? phase.color : undefined
    }"
    @click="emit('select')"
  >
    <!--
      Card Header
      -----------
      Contains the phase icon and phase number/title.
      Icon is displayed at 3xl size for visual prominence.
    -->
    <div class="flex items-center gap-3 mb-2">
      <!-- Large emoji icon representing the phase theme -->
      <span class="text-3xl">{{ phase.icon }}</span>
      <div>
        <!-- Phase number label with phase-colored text -->
        <div
          class="text-xs font-semibold uppercase tracking-wider"
          :style="{ color: phase.color }"
        >
          Phase {{ phase.phase }}
        </div>
        <!--
          Phase title (without "Phase N:" prefix)
          Uses string replacement to show only the descriptive part
        -->
        <div class="text-base font-semibold text-gray-100">
          {{ phase.title.replace(`Phase ${phase.phase}: `, '') }}
        </div>
      </div>
    </div>

    <!--
      Phase Description
      -----------------
      Brief description of what the phase covers.
      Limited to 2 lines with ellipsis overflow (line-clamp-2).
    -->
    <div class="text-sm text-gray-400 mb-2 line-clamp-2">
      {{ phase.description }}
    </div>

    <!--
      Duration Badge
      --------------
      Shows the estimated time to complete this phase.
      Badge uses the phase's color for consistent theming.
    -->
    <UBadge
      :style="{ backgroundColor: phase.color }"
      class="text-white"
      size="sm"
    >
      ⏱️ {{ phase.duration }}
    </UBadge>
  </div>
</template>
