<!--
  StatsFooter.vue - Summary Statistics Footer Component
  ======================================================
  Displays a summary of the roadmap statistics at the bottom of the page.
  All values are dynamically calculated from the roadmap data.

  Features:
  - Dynamic statistics that update automatically when data changes
  - Responsive grid layout (2 cols mobile, 3 cols tablet, 5 cols desktop)
  - Color-coded statistics for visual distinction
  - Gradient background for visual appeal
  - Priority level legend reminder

  Displayed Statistics:
  1. Phases - Total number of learning phases
  2. Topics - Sum of all topics across all phases
  3. Skills - Sum of all subtopics (individual skills) across all topics
  4. Duration - Total time estimate from roadmap data
  5. Certifications - Count of certifications in the final phase

  Visual Structure:
  ┌─────────────────────────────────────────────────────────────┐
  │  [Phases]  [Topics]  [Skills]  [Duration]  [Certifications] │
  │     10        69        527      24 weeks        5          │
  └─────────────────────────────────────────────────────────────┘
  │                                                             │
  │  🔴 Must Know = Required for job applications               │
  │  🟡 Should Know = Frequently requested in interviews        │
  │  🔵 Good to Know = Differentiates you from candidates       │
  │                                                             │
  │  💡 Personalization note about accelerated learning         │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Data Imports
 * ------------
 * - roadmapData: Complete array of phases for calculating statistics
 * - totalDuration: Pre-calculated duration string (e.g., "24 weeks")
 */
import { roadmapData, totalDuration } from '~/data/roadmap'

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

const {
  getCompletedCount,
  getTotalLessonCount,
  getCertificateProgress,
  getResumeLearningData
} = useProgress()

/**
 * Number of completed lessons
 */
const completedLessons = computed(() => getCompletedCount())

/**
 * Total number of lessons from roadmap
 */
const totalLessons = computed(() => getTotalLessonCount())

/**
 * Overall completion percentage
 */
const completionPercentage = computed(() => getCertificateProgress())

/**
 * Resume learning data (last accessed lesson)
 */
const resumeData = computed(() => getResumeLearningData())

/**
 * Whether user has any progress
 */
const hasProgress = computed(() => completedLessons.value > 0)

/**
 * Statistics Computed Property
 * ----------------------------
 * Calculates all summary statistics from the roadmap data.
 * Returns an array of stat objects with value, label, and color.
 *
 * Calculations:
 * - totalPhases: Simple count of phases in the array
 * - totalTopics: Sum of topics.length for each phase
 * - totalSkills: Nested sum of all subtopics across all topics
 * - totalCerts: Count of certification subtopics from Phase 10
 *
 * Color scheme matches the gradient theme (green -> red)
 */
const stats = computed(() => {
  // Count total number of phases
  const totalPhases = roadmapData.length

  // Sum all topics across all phases
  const totalTopics = roadmapData.reduce((acc, p) => acc + p.topics.length, 0)

  // Sum all subtopics (skills) across all topics in all phases
  const totalSkills = roadmapData.reduce(
    (acc, p) => acc + p.topics.reduce((a, t) => a + t.subtopics.length, 0),
    0
  )

  // Find the certifications phase and count certification items
  // Looks for the phase with "Certifications" in the title
  // Then finds the topic with "Certification" in the name
  const certPhase = roadmapData.find(p => p.title.includes('Certifications'))
  const certTopic = certPhase?.topics.find(t => t.name.includes('Certification'))
  const totalCerts = certTopic?.subtopics.length || 0

  // Return array of stat objects for template rendering
  return [
    { value: totalPhases.toString(), label: 'Phases', color: '#22c55e' }, // Green
    { value: totalTopics.toString(), label: 'Topics', color: '#0ea5e9' }, // Sky blue
    { value: totalSkills.toString(), label: 'Skills', color: '#8b5cf6' }, // Purple
    { value: totalDuration, label: 'Duration', color: '#f59e0b' }, // Amber
    { value: totalCerts.toString(), label: 'Certifications', color: '#ef4444' } // Red
  ]
})
</script>

<template>
  <div class="mt-10">
    <!--
      Your Progress Section
      =====================
      Shows user's learning progress with bar and resume button.
      Only displayed when user has started learning.
    -->
    <div
      v-if="hasProgress"
      class="mb-6 rounded-2xl p-6 bg-gray-800/50 border border-gray-700/50"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Progress info -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 font-medium">Your Progress</span>
            <span class="text-lg font-bold text-green-500">{{ completionPercentage }}%</span>
          </div>
          <UProgress
            :model-value="completionPercentage"
            color="success"
            class="h-2"
          />
          <div class="flex justify-between mt-2 text-sm text-gray-500">
            <span>{{ completedLessons }} of {{ totalLessons }} lessons completed</span>
            <NuxtLink
              to="/progress"
              class="text-primary-500 hover:text-primary-400 cursor-pointer"
            >
              View Details &rarr;
            </NuxtLink>
          </div>
        </div>

        <!-- Resume learning button -->
        <NuxtLink
          v-if="resumeData"
          :to="resumeData.path"
        >
          <UButton
            color="primary"
            size="lg"
            class="cursor-pointer whitespace-nowrap"
          >
            <UIcon
              name="i-lucide-play-circle"
              class="w-5 h-5 mr-2"
            />
            Resume Learning
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!--
      Statistics Grid
      ===============
      Displays all calculated statistics in a responsive grid.
      Background uses a green-to-red gradient matching the stat colors.

      Grid Breakpoints:
      - Mobile (<640px): 2 columns
      - Tablet (640px-1024px): 3 columns
      - Desktop (>1024px): 5 columns (all stats in one row)
    -->
    <div
      class="rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center"
      style="background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(239,68,68,0.1))"
    >
      <!-- Iterate through each stat and display value/label -->
      <div
        v-for="stat in stats"
        :key="stat.label"
      >
        <!-- Large colored number -->
        <div
          class="text-3xl sm:text-4xl font-bold"
          :style="{ color: stat.color }"
        >
          {{ stat.value }}
        </div>
        <!-- Gray label below the number -->
        <div class="text-gray-400 text-sm">
          {{ stat.label }}
        </div>
      </div>
    </div>

    <!--
      Legend and Notes Section
      ========================
      Reminds users of the priority color coding system
      and provides a personalized note about learning acceleration.
    -->
    <div class="mt-8 text-center text-gray-500 text-sm space-y-1">
      <!-- Priority level explanations -->
      <p>🔴 <strong class="text-gray-300">Must Know</strong> = Required for job applications</p>
      <p>🟡 <strong class="text-gray-300">Should Know</strong> = Frequently requested in interviews</p>
      <p>🔵 <strong class="text-gray-300">Good to Know</strong> = Differentiates you from other candidates</p>

      <!-- Personalized acceleration note -->
      <p class="mt-4 text-gray-400">
        💡 With your Full Stack + Network Security background, phases 1 (Foundations) and parts of phase 2 (Networking) can be accelerated significantly.
      </p>
    </div>
  </div>
</template>
