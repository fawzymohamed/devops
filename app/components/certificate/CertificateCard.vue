<!--
  CertificateCard Component
  =========================
  Dashboard card for displaying individual phase certificate status.
  Shows locked/unlocked states with appropriate UI indicators.

  Features:
  - Visual distinction for locked vs unlocked states
  - Progress tracking for locked phases
  - View certificate button for unlocked phases
  - Resume learning link for locked phases
  - Hover states for interactivity

  Structure:
  ┌─────────────────────────────────────────┐
  │  Phase 1: SDLC               [Badge]    │  (Unlocked)
  │  ✓ Completed on Jan 1, 2025             │
  │  [View Certificate Button]              │
  └─────────────────────────────────────────┘

  ┌─────────────────────────────────────────┐
  │  Phase 2: Foundations        [Badge]    │  (Locked)
  │  Progress: 12/21 (57%)                  │
  │  [Progress Bar]                         │
  │  [Resume Learning Link]                 │
  └─────────────────────────────────────────┘

  Usage:
  <CertificateCard
    :status="phaseStatus"
    @view-certificate="handleViewCertificate"
  />
-->

<script setup lang="ts">
import type { PhaseCertificateStatus } from '~/data/types'

/**
 * Component Props
 * ---------------
 * @prop {PhaseCertificateStatus} status - Phase certificate status data
 */
const props = defineProps<{
  status: PhaseCertificateStatus
  roadmapId?: string
}>()

/**
 * Component Emits
 * ---------------
 * @emits view-certificate - Emitted when "View Certificate" button is clicked
 */
const emit = defineEmits<{
  'view-certificate': []
}>()

// =============================================================================
// COMPOSABLES
// =============================================================================

const { getResumeLearningData } = useProgress()
const { getRoutePath } = useRoadmap()

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Check if certificate is unlocked
 * Unlocked when phase is 100% complete
 */
const isUnlocked = computed(() => props.status.status === 'unlocked')

/**
 * Get status badge color based on completion
 */
const statusColor = computed(() => {
  return isUnlocked.value ? 'success' : 'neutral'
})

/**
 * Get status badge label
 */
const statusLabel = computed(() => {
  return isUnlocked.value ? 'Unlocked' : 'Locked'
})

/**
 * Format completion date for display
 */
const formattedDate = computed(() => {
  if (!props.status.completedAt) return ''

  const date = new Date(props.status.completedAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

/**
 * Get resume learning path for locked phases
 * Returns path to first incomplete lesson
 */
const resumeLearningPath = computed(() => {
  const resumeData = getResumeLearningData(props.roadmapId ?? 'devops')
  if (!resumeData) return null

  // Check if resume path is in current phase
  if (resumeData.phaseId === props.status.phaseSlug) {
    return getRoutePath(
      props.roadmapId ?? 'devops',
      resumeData.phaseId,
      resumeData.topicId,
      resumeData.subtopicId
    )
  }

  // Default: navigate to phase page
  return getRoutePath(props.roadmapId ?? 'devops', props.status.phaseSlug)
})
</script>

<template>
  <!--
    Certificate Card
    ================
    Card container with hover effects and interactive elements
  -->
  <UCard
    class="hover:ring-gray-600/50 transition-all duration-200 p-5 sm:p-6 ring-1 ring-gray-700/50 bg-gray-800"
  >
    <!--
      Card Header
      ===========
      Phase number, name, and status badge
    -->
    <div class="space-y-4">
      <!-- Phase info and badge -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <!-- Phase number badge -->
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 mb-2">
            <UIcon
              name="i-lucide-layers"
              class="h-3.5 w-3.5 text-indigo-400"
            />
            <span class="text-xs font-medium text-indigo-300">Phase {{ status.phaseNumber }}</span>
          </div>

          <!-- Phase name -->
          <h3 class="text-lg font-semibold text-gray-100 truncate">
            {{ status.phaseName }}
          </h3>
        </div>

        <!-- Status badge -->
        <UBadge
          :label="statusLabel"
          :color="statusColor"
          variant="subtle"
          size="sm"
        />
      </div>

      <!--
        Unlocked State
        ==============
        Show completion date and view button
      -->
      <div
        v-if="isUnlocked"
        class="space-y-3"
      >
        <!-- Completion indicator -->
        <div class="flex items-center gap-2 text-sm text-green-400">
          <UIcon
            name="i-lucide-check-circle-2"
            class="h-4 w-4"
          />
          <span>Completed on {{ formattedDate }}</span>
        </div>

        <!-- Lessons completed -->
        <div class="text-sm text-gray-400">
          {{ status.lessonsCompleted }} lessons completed
        </div>

        <!-- View certificate button -->
        <UButton
          label="View Certificate"
          icon="i-lucide-award"
          color="primary"
          variant="solid"
          block
          class="cursor-pointer"
          @click="emit('view-certificate')"
        />
      </div>

      <!--
        Locked State
        ============
        Show progress bar and resume learning link
      -->
      <div
        v-else
        class="space-y-3"
      >
        <!-- Progress text -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-400">Progress</span>
          <span class="font-medium text-gray-300">
            {{ status.lessonsCompleted }}/{{ status.totalLessons }} ({{ status.completionPercentage }}%)
          </span>
        </div>

        <!-- Progress bar -->
        <UProgress
          :value="status.completionPercentage"
          :max="100"
          color="primary"
          size="md"
        />

        <!-- Resume learning link -->
        <NuxtLink
          v-if="resumeLearningPath"
          :to="resumeLearningPath"
          class="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <UIcon
            name="i-lucide-play-circle"
            class="h-4 w-4"
          />
          <span>Resume Learning</span>
        </NuxtLink>

        <!-- Fallback if no resume path -->
        <div
          v-else
          class="text-sm text-gray-500 italic"
        >
          Start learning to unlock certificate
        </div>
      </div>
    </div>
  </UCard>
</template>
