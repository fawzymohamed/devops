<!--
  Index.vue - Main Landing Page
  =============================
  This is the primary page of the DevOps to DevSecOps Learning Roadmap application.
  It serves as the entry point and displays the complete roadmap interface.

  Page Structure:
  1. Header Section - Title, subtitle, and quick stats (duration, phases)
  2. Priority Legend - Color-coded guide explaining topic importance levels
  3. Roadmap Timeline - Interactive phase navigation and topic details
  4. Stats Footer - Summary statistics and additional information

  Data Flow:
  - Imports roadmap data and computed duration from ~/data/roadmap.ts
  - All statistics are dynamically calculated from the roadmap data
-->

<script setup lang="ts">
/**
 * Data Imports
 * ------------
 * - devopsPhases: Array of all learning phases with topics and subtopics
 * - totalDuration: Dynamically calculated total duration string (e.g., "24 weeks")
 */
import { devopsPhases, totalDuration } from '~/data/roadmap'

/**
 * Computed Properties
 * -------------------
 * totalPhases: Dynamically counts the number of phases in the roadmap.
 * This ensures the UI always reflects the current data structure.
 */
const totalPhases = computed(() => devopsPhases.length)

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

const {
  getCompletedCount,
  getTotalLessonCount,
  getCertificateProgress,
  getResumeLearningData,
  getTotalTimeSpentHours
} = useProgress()
const { getRoutePath } = useRoadmap()
const roadmapId = 'devops'

/**
 * Number of completed lessons
 */
const completedLessons = computed(() => getCompletedCount(roadmapId))

/**
 * Total number of lessons from roadmap
 */
const totalLessons = computed(() => getTotalLessonCount(roadmapId))

/**
 * Overall completion percentage
 */
const completionPercentage = computed(() => getCertificateProgress(roadmapId))

/**
 * Resume learning data (last accessed lesson)
 */
const resumeData = computed(() => getResumeLearningData(roadmapId))
const resumePath = computed(() => {
  if (!resumeData.value) return null
  return getRoutePath(
    roadmapId,
    resumeData.value.phaseId,
    resumeData.value.topicId,
    resumeData.value.subtopicId
  )
})

/**
 * Total time spent learning in hours
 */
const timeSpentHours = computed(() => getTotalTimeSpentHours(roadmapId))

/**
 * Whether user has any progress
 */
const hasProgress = computed(() => completedLessons.value > 0)
</script>

<template>
  <div class="py-8">
    <!--
    Header Section
    ==============
    Contains the main title with gradient text effect,
    personalization subtitle, and key metrics (duration & phase count).
    -->
    <div class="text-center mb-10">
      <!-- Main title with multi-color gradient (green -> sky -> violet -> red) -->
      <h1 class="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 via-sky-500 via-violet-500 to-red-500 bg-clip-text text-transparent">
        DevOps to DevSecOps Learning Roadmap
      </h1>

      <!-- Personalization subtitle indicating target audience and market -->
      <p class="text-gray-400 text-base sm:text-lg mb-4">
        Personalized for Fawzy Mohamed | Saudi Arabia Market Focus
      </p>

      <!-- Quick stats bar showing total duration and phase count -->
      <div class="inline-flex flex-wrap justify-center gap-4 sm:gap-6 bg-gray-800/50 px-4 sm:px-6 py-3 rounded-xl">
        <div>
          <span class="text-gray-400">Total Duration: </span>
          <span class="font-semibold text-green-500">{{ totalDuration }}</span>
        </div>
        <div>
          <span class="text-gray-400">Phases: </span>
          <span class="font-semibold">{{ totalPhases }}</span>
        </div>
      </div>

      <!--
      Progress Indicator Card
      =======================
      Enhanced progress display showing learning progress, time spent,
      and quick actions. Only displayed when user has started learning.
      -->
      <div
        v-if="hasProgress"
        class="mt-6 max-w-2xl mx-auto"
      >
        <div
          class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/40 via-emerald-800/30 to-teal-900/40 border border-emerald-500/30 p-5 sm:p-6 backdrop-blur-sm"
        >
          <!-- Decorative glow effect -->
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl" />

          <div class="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
            <!-- Progress Ring -->
            <div class="flex-shrink-0">
              <ProgressRing
                :value="completionPercentage"
                :size="80"
                :stroke-width="6"
                color="#10b981"
                track-color="rgba(255,255,255,0.1)"
                show-label
              />
            </div>

            <!-- Stats Grid -->
            <div class="flex-1 grid grid-cols-2 gap-4 text-center sm:text-left">
              <!-- Lessons Completed -->
              <div>
                <div class="text-2xl font-bold text-white">
                  {{ completedLessons }}<span class="text-gray-400 text-lg">/{{ totalLessons }}</span>
                </div>
                <div class="text-sm text-gray-400">
                  Lessons Completed
                </div>
              </div>

              <!-- Time Spent -->
              <div>
                <div class="text-2xl font-bold text-white">
                  {{ timeSpentHours }}<span class="text-gray-400 text-lg"> hrs</span>
                </div>
                <div class="text-sm text-gray-400">
                  Time Invested
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Resume Learning Button -->
              <NuxtLink
                v-if="resumePath"
                :to="resumePath"
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

              <!-- View Progress Link -->
              <NuxtLink to="/progress?roadmap=devops">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="lg"
                  class="cursor-pointer whitespace-nowrap"
                >
                  View Details
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
    Priority Legend
    ===============
    Color-coded guide explaining the three priority levels:
    - Red (Must Know): Essential skills required for job applications
    - Yellow (Should Know): Commonly requested in technical interviews
    - Blue (Good to Know): Skills that differentiate candidates
    -->
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm text-gray-400">
      <span><span class="text-red-400 font-semibold">Red</span> Must Know = Required for job applications</span>
      <span><span class="text-yellow-400 font-semibold">Yellow</span> Should Know = Frequently requested in interviews</span>
      <span><span class="text-sky-400 font-semibold">Blue</span> Good to Know = Differentiates you from other candidates</span>
    </div>

    <!--
    Roadmap Timeline Component
    ==========================
    Main interactive component displaying:
    - Horizontal scrollable phase navigation cards
    - Detailed view of selected phase with expandable topics
    - Accordion-style topic cards showing subtopics/skills
    -->
    <RoadmapTimeline />

    <!--
    Stats Footer Component
    ======================
    Displays summary statistics:
    - Total phases, topics, and skills counts
    - Overall duration
    - Number of certifications
    - Priority level legend reminder
    -->
    <StatsFooter />
  </div>
</template>
