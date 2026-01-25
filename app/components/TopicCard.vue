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

// TypeScript workaround: queryCollection is auto-imported but TS doesn't recognize it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const queryCollection: any

/**
 * Component Props
 * ---------------
 * @prop topic - The topic object containing name, subtopics array, and priority
 * @prop phaseColor - Hex color string from parent phase (e.g., "#22c55e")
 * @prop phaseSlug - URL slug for the phase (e.g., "phase-1-sdlc")
 * @prop isOpen - Whether the card is currently expanded (controlled by parent)
 */
const props = defineProps<{
  topic: Topic
  phaseColor: string
  phaseSlug: string
  isOpen: boolean
  roadmapId?: string
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
 * Generate Slug
 * -------------
 * Converts a name to a URL-friendly slug.
 * Used for subtopics that don't have explicit slugs.
 * Strips parenthetical content before generating the slug to match file names.
 * Example: "Waterfall Model" -> "waterfall-model"
 * Example: "Navigation Commands (cd, ls, pwd)" -> "navigation-commands"
 */
function toSlug(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*/g, '') // Remove parenthetical content like "(cd, ls, pwd)"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Topic Slug
 * ----------
 * URL-friendly slug for this topic.
 * Uses explicit slug if available, otherwise generates from name.
 */
const topicSlug = computed(() => props.topic.slug || toSlug(props.topic.name))

/**
 * Generate Subtopic URL
 * ---------------------
 * Creates the full URL path for a subtopic lesson.
 * Pattern: /phase-slug/topic-slug/subtopic-slug
 */
function getSubtopicUrl(subtopic: string, index: number): string {
  return getRoutePath(
    props.roadmapId ?? 'devops',
    props.phaseSlug,
    topicSlug.value,
    getSubtopicSlug(subtopic, index)
  )
}

const { getRoutePath, getContentTopicPath } = useRoadmap()

// =============================================================================
// CONTENT SLUG LOOKUP
// =============================================================================

/**
 * Available Subtopic Slugs
 * -------------------
 * Stores the ordered list of subtopic slugs for this topic.
 * Populated by querying @nuxt/content for existing lesson files.
 */
const availableSubtopicSlugs = ref<string[]>([])
const hasLoadedContent = ref(false)

/**
 * Fetch Available Content Slugs
 * -----------------------
 * Queries the content directory to find which lessons exist in order.
 */
async function fetchAvailableContent() {
  hasLoadedContent.value = false
  availableSubtopicSlugs.value = [] // Clear stale data
  try {
    const roadmapSlug = props.roadmapId ?? 'devops'
    const basePath = getContentTopicPath(roadmapSlug, props.phaseSlug, topicSlug.value)

    const lessons = await queryCollection('content')
      .where('path', 'LIKE', `${basePath}/%`)
      .where('extension', '=', 'md')
      .select('path')
      .order('stem', 'ASC')
      .all()

    const slugs: string[] = []
    for (const lesson of lessons) {
      const lessonPath = lesson.path
      if (lessonPath) {
        // Extract the subtopic slug from the path (last segment)
        const segments = lessonPath.split('/')
        const lastSegment = segments[segments.length - 1]
        if (lastSegment && lastSegment !== 'cheat-sheet') {
          const normalized = lastSegment.replace(/^\d+\./, '')
          slugs.push(normalized)
        }
      }
    }
    availableSubtopicSlugs.value = slugs
    hasLoadedContent.value = true
  } catch {
    // If content query fails, fall back to showing all lessons as available
    // This ensures the UI degrades gracefully
    availableSubtopicSlugs.value = []
    hasLoadedContent.value = false
  }
}

// Fetch content availability when component mounts
onMounted(() => {
  fetchAvailableContent()
})

// Re-fetch if roadmapId, phaseSlug, or topic changes
watch(
  () => [props.roadmapId, props.phaseSlug, props.topic.slug, props.topic.name],
  () => {
    fetchAvailableContent()
  }
)

/**
 * Get subtopic slug based on content order
 * ---------------------------------------
 * @param subtopic - The subtopic name (fallback slug source)
 * @param index - The subtopic index in the roadmap list
 * @returns Slug that matches the content file name
 */
function getSubtopicSlug(subtopic: string, index: number): string {
  const fallback = toSlug(subtopic)
  if (!hasLoadedContent.value) {
    return fallback
  }
  return availableSubtopicSlugs.value[index] ?? fallback
}

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

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

const {
  isComplete,
  getCompletedCountForTopic
} = useProgress()

/**
 * Check if a specific subtopic is complete
 * @param subtopic - Subtopic name
 * @returns Boolean indicating completion status
 */
function isSubtopicComplete(subtopic: string, index: number): boolean {
  const roadmapId = props.roadmapId ?? 'devops'
  const contentSlug = getSubtopicSlug(subtopic, index)
  if (isComplete(roadmapId, props.phaseSlug, topicSlug.value, contentSlug)) {
    return true
  }
  const legacySlug = toSlug(subtopic)
  return contentSlug !== legacySlug
    && isComplete(roadmapId, props.phaseSlug, topicSlug.value, legacySlug)
}

/**
 * Number of completed subtopics in this topic
 */
const completedCount = computed(() => {
  return getCompletedCountForTopic(props.roadmapId ?? 'devops', props.phaseSlug, topicSlug.value)
})

/**
 * Total number of subtopics in this topic
 */
const totalCount = computed(() => props.topic.subtopics.length)

/**
 * Whether the entire topic is complete
 */
const isTopicComplete = computed(() => {
  return completedCount.value > 0 && completedCount.value >= totalCount.value
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

        <!-- Completion count badge (only shown when progress exists) -->
        <UBadge
          v-if="completedCount > 0"
          :color="isTopicComplete ? 'success' : 'neutral'"
          variant="subtle"
          size="sm"
        >
          <UIcon
            v-if="isTopicComplete"
            name="i-lucide-check"
            class="w-3 h-3 mr-1"
          />
          {{ completedCount }}/{{ totalCount }}
        </UBadge>
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
        Each subtopic is a clickable link to its lesson page.
        Has a left border colored by the phase and hover effect.
      -->
      <div
        v-if="isOpen"
        class="mt-4 overflow-hidden"
        @click.stop
      >
        <!--
          Subtopics Grid
          --------------
          Responsive grid of lesson links
        -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <NuxtLink
            v-for="(subtopic, idx) in topic.subtopics"
            :key="idx"
            :to="getSubtopicUrl(subtopic, idx)"
            class="flex items-center gap-2 bg-gray-800/60 px-3 py-2 rounded-lg text-sm border-l-3 cursor-pointer transition-all hover:bg-gray-700/80 hover:translate-x-1"
            :style="{ borderLeftColor: phaseColor }"
          >
            <!-- Completion checkmark (shown when subtopic is complete) -->
            <UIcon
              v-if="isSubtopicComplete(subtopic, idx)"
              name="i-lucide-check-circle"
              class="w-4 h-4 text-green-500 flex-shrink-0"
            />
            <!-- Subtopic name with muted style if complete -->
            <span :class="{ 'text-gray-500': isSubtopicComplete(subtopic, idx) }">
              {{ subtopic }}
            </span>
          </NuxtLink>
        </div>

        <!--
          Cheat Sheet Link
          ----------------
          Quick reference sheet link at the bottom of the topic
        -->
        <NuxtLink
          :to="getRoutePath(props.roadmapId ?? 'devops', phaseSlug, topicSlug, 'cheat-sheet')"
          class="flex items-center gap-2 mt-4 pt-3 border-t border-gray-700/50 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <UIcon
            name="i-lucide-file-text"
            class="w-4 h-4"
          />
          <span>Quick Reference Sheet</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="w-3 h-3 ml-auto"
          />
        </NuxtLink>
      </div>
    </Transition>
  </UCard>
</template>
