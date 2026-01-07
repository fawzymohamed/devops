<!--
  PhaseProgress.vue - Phase-Level Progress Card Component
  ========================================================
  Displays detailed progress information for a single learning phase,
  including a progress ring and per-topic breakdown.

  Features:
  - Phase icon and title display
  - Circular progress indicator showing phase completion
  - Expandable topic list with individual progress bars
  - Completion badge when 100% complete
  - Click to expand/collapse topic details

  Props:
  - phase: Phase object from roadmap data
  - expanded: Whether topic list is expanded (default: false)

  Events:
  - toggle: Emitted when user clicks to expand/collapse

  Usage:
  ```vue
  <PhaseProgress :phase="phase" :expanded="isExpanded" @toggle="handleToggle" />
  ```

  Visual Structure:
  ┌──────────────────────────────────────────────────────┐
  │  [Icon]  Phase 1: SDLC                    [Ring: 80%]│
  ├──────────────────────────────────────────────────────┤
  │  Topic: SDLC Models           5/5  [████████████]    │
  │  Topic: SDLC Phases           4/6  [████████░░░░]    │
  │  Topic: Dev Workflows         2/5  [████░░░░░░░░]    │
  └──────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import type { Phase } from '~/data/roadmap'

/**
 * Props Interface
 * ---------------
 */
interface Props {
  /** Phase data from roadmap */
  phase: Phase
  /** Whether the topic list is expanded */
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false
})

/**
 * Events
 * ------
 */
const emit = defineEmits<{
  toggle: []
}>()

// =============================================================================
// COMPOSABLES
// =============================================================================

const {
  getPhaseCompletionPercentage,
  getTopicCompletionPercentage,
  getCompletedCountForTopic,
  getTopicSubtopicCount
} = useProgress()

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Phase completion percentage
 * Used for the progress ring display
 */
const phaseCompletion = computed(() => {
  return getPhaseCompletionPercentage(props.phase.slug)
})

/**
 * Check if phase is 100% complete
 */
const isComplete = computed(() => phaseCompletion.value === 100)

/**
 * Convert topic name to slug
 * Used for topics without explicit slug property
 */
function toSlug(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*/g, '') // Remove parenthetical content like "(cd, ls, pwd)"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Get topic slug, falling back to generated slug from name
 */
function getTopicSlug(topic: Phase['topics'][0]): string {
  return topic.slug || toSlug(topic.name)
}

/**
 * Get completion stats for a topic
 */
function getTopicStats(topic: Phase['topics'][0]) {
  const topicSlug = getTopicSlug(topic)
  const completed = getCompletedCountForTopic(props.phase.slug, topicSlug)
  const total = getTopicSubtopicCount(props.phase.slug, topicSlug)
  const percentage = getTopicCompletionPercentage(props.phase.slug, topicSlug)
  return { completed, total, percentage }
}
</script>

<template>
  <!--
    Phase Progress Card
    ===================
    Collapsible card showing phase progress with topic breakdown
  -->
  <UCard
    class="cursor-pointer hover:bg-gray-800/50 transition-colors"
    :ui="{
      body: 'p-4'
    }"
    @click="emit('toggle')"
  >
    <!--
      Phase Header
      ============
      Icon, title, and progress ring
    -->
    <div class="flex items-center justify-between">
      <!-- Phase info: icon + title -->
      <div class="flex items-center gap-3">
        <!-- Phase icon -->
        <span class="text-2xl">{{ phase.icon }}</span>

        <!-- Phase title and completion status -->
        <div>
          <h3 class="font-semibold text-white">
            {{ phase.title }}
          </h3>
          <p class="text-sm text-gray-400">
            {{ phase.duration }}
          </p>
        </div>
      </div>

      <!-- Progress ring and expand icon -->
      <div class="flex items-center gap-3">
        <!-- Completion badge -->
        <UBadge
          v-if="isComplete"
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

        <!-- Progress ring -->
        <ProgressRing
          :value="phaseCompletion"
          :size="48"
          :stroke-width="4"
          :color="phase.color"
          show-label
        />

        <!-- Expand/collapse icon -->
        <UIcon
          :name="expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="w-5 h-5 text-gray-400 transition-transform"
        />
      </div>
    </div>

    <!--
      Topic Breakdown (Expandable)
      ============================
      Individual progress bars for each topic in the phase
    -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="expanded"
        class="mt-4 pt-4 border-t border-gray-700 space-y-3 overflow-hidden"
        @click.stop
      >
        <!-- Topic progress row -->
        <div
          v-for="topic in phase.topics"
          :key="topic.name"
          class="flex items-center gap-4"
        >
          <!-- Topic name -->
          <span
            class="text-sm text-gray-300 w-40 truncate"
            :title="topic.name"
          >
            {{ topic.name }}
          </span>

          <!-- Progress bar -->
          <div class="flex-1">
            <ProgressBar
              :value="getTopicStats(topic).percentage"
              size="sm"
              :color="getTopicStats(topic).percentage === 100 ? 'success' : 'primary'"
            />
          </div>

          <!-- Completion count -->
          <span class="text-xs text-gray-500 min-w-[4rem] text-right">
            {{ getTopicStats(topic).completed }}/{{ getTopicStats(topic).total }}
          </span>
        </div>
      </div>
    </Transition>
  </UCard>
</template>
