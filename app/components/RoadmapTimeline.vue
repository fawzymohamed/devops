<!--
  RoadmapTimeline.vue - Main Roadmap Navigation Component
  =======================================================
  This is the primary interactive component for navigating the learning roadmap.
  It displays a horizontal scrollable list of phase cards and a detailed view
  of the currently selected phase.

  Features:
  - Horizontal scrollable phase navigation with custom scrollbar styling
  - Active phase highlighting with dynamic color theming
  - Accordion-style topic cards (only one topic open at a time)
  - Automatic topic collapse when switching phases
  - Responsive layout for mobile and desktop

  Component Structure:
  ┌─────────────────────────────────────────────────────────┐
  │  Phase Navigation (Horizontal Scroll)                   │
  │  [Phase 1] [Phase 2] [Phase 3] ... [Phase 10]          │
  ├─────────────────────────────────────────────────────────┤
  │  Active Phase Detail Card                               │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │  [Icon] Phase Title                             │   │
  │  │         Description                             │   │
  │  │  [Duration] [Topics Count] [Skills Count]       │   │
  │  │                                                 │   │
  │  │  Topics to Master:                              │   │
  │  │  ┌─────────────────────────────────────────┐   │   │
  │  │  │  TopicCard (expandable)                 │   │   │
  │  │  └─────────────────────────────────────────┘   │   │
  │  │  ┌─────────────────────────────────────────┐   │   │
  │  │  │  TopicCard (expandable)                 │   │   │
  │  │  └─────────────────────────────────────────┘   │   │
  │  └─────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────┘

  State Management:
  - activePhase: Index of currently selected phase (0-9)
  - openTopicIndex: Index of currently expanded topic (null if none)
-->

<script setup lang="ts">
/**
 * Data Import
 * -----------
 * Imports the complete roadmap data array containing all phases,
 * topics, and subtopics for the learning journey.
 */
import type { Phase } from '~/data/roadmap'
import { devopsPhases } from '~/data/roadmap'

const props = withDefaults(defineProps<{
  phases?: Phase[]
  roadmapId?: string
}>(), {
  phases: () => devopsPhases,
  roadmapId: 'devops'
})

/**
 * Reactive State
 * --------------
 * activePhase: Tracks which phase is currently selected (0-indexed)
 * openTopicIndex: Tracks which topic card is expanded (null = all collapsed)
 */
const activePhase = ref(0)
const openTopicIndex = ref<number | null>(null)

/**
 * Active Data Computed Property
 * -----------------------------
 * Returns the full phase object for the currently selected phase.
 * This includes all topics, duration, color, and other phase metadata.
 */
const activeData = computed(() => props.phases[activePhase.value]!)

/**
 * Active Phase Slug
 * -----------------
 * URL-friendly slug for the currently active phase.
 * Uses the explicit slug property from the phase data.
 */
const activePhaseSlug = computed(() => activeData.value.slug)

/**
 * Toggle Topic Function
 * ---------------------
 * Implements accordion behavior for topic cards.
 * - If clicking the already-open topic, close it (set to null)
 * - If clicking a different topic, open it (close any other)
 *
 * @param index - The index of the topic card being toggled
 */
function toggleTopic(index: number) {
  openTopicIndex.value = openTopicIndex.value === index ? null : index
}

/**
 * Phase Change Watcher
 * --------------------
 * Automatically collapses any open topic when the user switches
 * to a different phase. This provides a clean slate for each phase.
 */
watch(activePhase, () => {
  openTopicIndex.value = null
})
</script>

<template>
  <div>
    <!--
      Phase Navigation Bar
      ====================
      Horizontal scrollable container showing all phase cards.
      Users can click any phase to view its details below.
      Custom scrollbar styling for a cleaner appearance.
    -->
    <div class="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <PhaseCard
        v-for="(phase, idx) in props.phases"
        :key="idx"
        :phase="phase"
        :is-active="activePhase === idx"
        :roadmap-id="props.roadmapId"
        @select="activePhase = idx"
      />
    </div>

    <!--
      Active Phase Detail Card
      ========================
      Displays comprehensive information about the selected phase.
      Uses dynamic coloring based on the phase's assigned color.
    -->
    <UCard
      class="bg-gray-900/30 ring-1"
      :ui="{ body: 'p-6 sm:p-8' }"
      :style="{ '--tw-ring-color': `${activeData.color}40` }"
    >
      <!--
        Phase Header
        ------------
        Shows the phase icon, title, and description.
        Responsive layout: stacked on mobile, side-by-side on larger screens.
      -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <!-- Large emoji icon representing the phase -->
        <span class="text-5xl">{{ activeData.icon }}</span>
        <div>
          <!-- Phase title with dynamic color from phase data -->
          <h2
            class="text-2xl sm:text-3xl font-bold"
            :style="{ color: activeData.color }"
          >
            {{ activeData.title }}
          </h2>
          <!-- Brief description of what the phase covers -->
          <p class="text-gray-400 mt-1">
            {{ activeData.description }}
          </p>
        </div>
      </div>

      <!--
        Phase Statistics Badges
        -----------------------
        Quick overview showing duration, topic count, and total skills.
        Skills count is dynamically calculated from all subtopics.
      -->
      <div class="flex flex-wrap gap-3 mb-6">
        <!-- Duration badge with phase-colored background -->
        <UBadge
          size="lg"
          :style="{ backgroundColor: activeData.color }"
          class="text-white"
        >
          ⏱️ Duration: {{ activeData.duration }}
        </UBadge>
        <!-- Topic count badge -->
        <UBadge
          size="lg"
          color="neutral"
          variant="subtle"
        >
          📚 {{ activeData.topics.length }} Topics
        </UBadge>
        <!-- Skills count badge (sum of all subtopics) -->
        <UBadge
          size="lg"
          color="neutral"
          variant="subtle"
        >
          🎯 {{ activeData.topics.reduce((acc, t) => acc + t.subtopics.length, 0) }} Skills
        </UBadge>
      </div>

      <!--
        Topics List Section
        -------------------
        Displays all topics for the current phase as expandable cards.
        Implements accordion behavior (only one topic open at a time).
      -->
      <h3 class="text-lg font-medium text-gray-200 mb-4">
        Topics to Master (click to expand):
      </h3>

      <!-- Topic cards container with vertical spacing -->
      <div class="space-y-3">
        <TopicCard
          v-for="(topic, idx) in activeData.topics"
          :key="idx"
          :topic="topic"
          :phase-color="activeData.color"
          :phase-slug="activePhaseSlug"
          :is-open="openTopicIndex === idx"
          :roadmap-id="props.roadmapId"
          @toggle="toggleTopic(idx)"
        />
      </div>
    </UCard>
  </div>
</template>

<!--
  Scoped Styles
  =============
  Custom scrollbar styling for the horizontal phase navigation.
  Uses WebKit-specific pseudo-elements for Chrome/Safari/Edge.
-->
<style scoped>
/* Thin scrollbar height */
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

/* Transparent track (background) */
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

/* Gray rounded thumb (draggable part) */
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

/* Lighter gray on hover for better interactivity feedback */
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
