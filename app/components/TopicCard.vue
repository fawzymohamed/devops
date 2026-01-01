<!--
  TopicCard.vue - Expandable Topic Card Component
  ================================================
  Displays a single learning topic with its priority badge and expandable
  subtopics list. Used within the RoadmapTimeline component.

  Features:
  - Click-to-expand accordion behavior (controlled by parent)
  - Priority badge with color-coded importance level
  - Smooth expand/collapse animations
  - Responsive grid layout for subtopics
  - Dynamic theming based on parent phase color

  Props:
  - topic: The topic data object (name, subtopics, priority)
  - phaseColor: Hex color from parent phase for consistent theming
  - isOpen: Boolean controlling expanded/collapsed state

  Events:
  - toggle: Emitted when card is clicked to toggle open state

  Visual Structure:
  ┌─────────────────────────────────────────────────────────┐
  │  [Topic Name]  [Priority Badge]              [▼ Icon]  │
  ├─────────────────────────────────────────────────────────┤
  │  (Expanded Content - shown when isOpen=true)           │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
  │  │ Subtopic │ │ Subtopic │ │ Subtopic │               │
  │  └──────────┘ └──────────┘ └──────────┘               │
  └─────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Type and Config Imports
 * -----------------------
 * - Topic: TypeScript interface for topic data structure
 * - priorityConfig: Maps priority levels to display labels
 */
import type { Topic } from '~/data/roadmap'
import { priorityConfig } from '~/data/roadmap'

/**
 * Component Props
 * ---------------
 * @prop topic - The topic object containing name, subtopics array, and priority
 * @prop phaseColor - Hex color string from parent phase (e.g., "#22c55e")
 * @prop isOpen - Whether the card is currently expanded (controlled by parent)
 */
const props = defineProps<{
  topic: Topic
  phaseColor: string
  isOpen: boolean
}>()

/**
 * Component Events
 * ----------------
 * @event toggle - Emitted when the card is clicked, parent handles state change
 */
const emit = defineEmits<{
  toggle: []
}>()

/**
 * Priority Label Computed
 * -----------------------
 * Returns the human-readable label for the topic's priority.
 * Maps: essential -> "Must Know", important -> "Should Know", recommended -> "Good to Know"
 */
const priorityLabel = computed(() => {
  return priorityConfig[props.topic.priority].label
})

/**
 * Priority Background Color Computed
 * ----------------------------------
 * Returns the appropriate background color for the priority badge.
 * Color scheme:
 * - Essential: Red (#dc2626) - Critical/urgent importance
 * - Important: Amber (#f59e0b) - High importance
 * - Recommended: Blue (#3b82f6) - Nice to have
 */
const priorityBgColor = computed(() => {
  const colors: Record<string, string> = {
    essential: '#dc2626',
    important: '#f59e0b',
    recommended: '#3b82f6'
  }
  return colors[props.topic.priority]
})

/**
 * Priority Text Color Computed
 * ----------------------------
 * Returns the appropriate text color for the priority badge.
 * Uses black text on amber (important) for better contrast,
 * white text on red/blue for essential/recommended.
 */
const priorityTextColor = computed(() => {
  return props.topic.priority === 'important' ? '#000' : '#fff'
})
</script>

<template>
  <!--
    Main Card Container
    ===================
    Clickable card that toggles the expanded state.
    Has hover effect and cursor pointer for interactivity.
  -->
  <UCard
    class="cursor-pointer transition-all duration-300 hover:bg-gray-800/50 bg-gray-900/50 ring-1 ring-gray-700"
    :ui="{ body: 'p-4' }"
    @click="emit('toggle')"
  >
    <!--
      Card Header
      -----------
      Contains topic name, priority badge, and expand/collapse chevron icon.
      Layout adjusts on smaller screens with flex-wrap.
    -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Topic name with phase-colored text -->
        <span
          class="text-lg font-semibold"
          :style="{ color: phaseColor }"
        >
          {{ topic.name }}
        </span>

        <!-- Priority badge with dynamic colors -->
        <span
          class="px-2 py-0.5 rounded-full text-xs font-semibold"
          :style="{ backgroundColor: priorityBgColor, color: priorityTextColor }"
        >
          {{ priorityLabel }}
        </span>
      </div>

      <!-- Chevron icon that rotates 180° when expanded -->
      <UIcon
        name="i-lucide-chevron-down"
        class="w-5 h-5 transition-transform duration-300 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <!--
      Expandable Content Section
      ==========================
      Animated container for subtopics grid.
      Uses Vue's Transition component for smooth enter/leave animations.
      - Enter: Fades in and expands from 0 to full height
      - Leave: Fades out and collapses to 0 height
    -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <!--
        Subtopics Grid
        --------------
        Responsive grid showing all skills/subtopics for this topic.
        - Mobile: 1 column
        - Tablet (sm): 2 columns
        - Desktop (lg): 3 columns
        Each subtopic has a left border colored by the phase.
      -->
      <div
        v-if="isOpen"
        class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-hidden"
      >
        <div
          v-for="(subtopic, idx) in topic.subtopics"
          :key="idx"
          class="bg-gray-800/60 px-3 py-2 rounded-lg text-sm border-l-3"
          :style="{ borderLeftColor: phaseColor }"
        >
          {{ subtopic }}
        </div>
      </div>
    </Transition>
  </UCard>
</template>
