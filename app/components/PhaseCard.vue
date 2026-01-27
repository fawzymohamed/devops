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
 * @prop projectedDate - Optional projected completion date for this phase (formatted string)
 */
const props = defineProps<{
  phase: Phase
  isActive: boolean
  roadmapId?: string
  projectedDate?: string
}>()

/**
 * Component Events
 * ----------------
 * @event select - Emitted when the card is clicked to select this phase
 */
const emit = defineEmits<{
  select: []
}>()

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

const { getPhaseCompletionPercentage } = useProgress()

/**
 * Phase completion percentage (0-100)
 * Used to display progress ring on the card
 */
const phaseCompletion = computed(() => {
  return getPhaseCompletionPercentage(props.roadmapId ?? 'devops', props.phase.slug)
})

/**
 * Check if phase is 100% complete
 */
const isPhaseComplete = computed(() => phaseCompletion.value === 100)
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
      Contains the phase icon, phase number/title, and progress ring.
      Icon is displayed at 3xl size for visual prominence.
    -->
    <div class="flex items-center justify-between gap-3 mb-2">
      <!-- Left side: Icon and title -->
      <div class="flex items-center gap-3">
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

      <!-- Right side: Progress ring (only shown when progress > 0) -->
      <ProgressRing
        v-if="phaseCompletion > 0"
        :value="phaseCompletion"
        :size="40"
        :stroke-width="3"
        :color="phase.color"
        show-label
        class="flex-shrink-0"
      />
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
      Footer: Duration Badge and Completion Status
      ---------------------------------------------
      Shows projected date (when schedule exists) or duration badge.
      Displays completion badge when phase is complete.
    -->
    <div class="flex items-center gap-2">
      <!-- Projected Date badge (when schedule exists) -->
      <UBadge
        v-if="projectedDate"
        :style="{ backgroundColor: phase.color }"
        class="text-white"
        size="sm"
      >
        <UIcon
          name="i-lucide-calendar"
          class="w-3 h-3 mr-1"
        />
        {{ projectedDate }}
      </UBadge>

      <!-- Duration badge (fallback when no schedule) -->
      <UBadge
        v-else
        :style="{ backgroundColor: phase.color }"
        class="text-white"
        size="sm"
      >
        ⏱️ {{ phase.duration }}
      </UBadge>

      <!-- Completion badge (shown when phase is 100% complete) -->
      <UBadge
        v-if="isPhaseComplete"
        color="success"
        variant="subtle"
        size="sm"
      >
        <UIcon
          name="i-lucide-check"
          class="w-3 h-3 mr-1"
        />
        Complete
      </UBadge>
    </div>
  </div>
</template>
