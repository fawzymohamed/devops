<!--
  OverallProgress.vue - Overall Course Progress Hero Component
  =============================================================
  A prominent hero component displaying overall course progress,
  statistics, and quick actions like Resume Learning.

  Features:
  - Large progress display (bar or ring based on compact mode)
  - Key statistics: completed lessons, time spent, quiz score
  - Resume Learning button with last accessed lesson
  - Certificate status indicator
  - Compact mode for smaller displays

  Props:
  - compact: Use smaller layout for sidebars/cards (default: false)

  Usage:
  ```vue
  <OverallProgress />              (Full hero mode)
  <OverallProgress compact />      (Compact sidebar mode)
  ```

  Visual Structure (Full Mode):
  ┌────────────────────────────────────────────────────────┐
  │                Your Learning Progress                   │
  │                                                         │
  │         ╭─────────╮                                    │
  │        ╱           ╲                                   │
  │       │    45%      │     21 of 527 lessons            │
  │        ╲           ╱      12.5 hours spent             │
  │         ╰─────────╯       82% avg quiz score           │
  │                                                         │
  │  [Resume Learning →]        [Certificate: 45% ready]   │
  └────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Props Interface
 * ---------------
 */
interface Props {
  /** Use compact layout for smaller displays */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

// =============================================================================
// COMPOSABLES
// =============================================================================

const {
  getCompletedCount,
  getTotalLessonCount,
  getCertificateProgress,
  canGenerateCertificate,
  getAverageQuizScore,
  getTotalTimeSpentHours,
  getResumeLearningData
} = useProgress()

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Total lessons from roadmap
 */
const totalLessons = computed(() => getTotalLessonCount())

/**
 * Number of completed lessons
 */
const completedLessons = computed(() => getCompletedCount())

/**
 * Overall completion percentage
 */
const completionPercentage = computed(() => getCertificateProgress())

/**
 * Average quiz score across all completed quizzes
 */
const avgQuizScore = computed(() => getAverageQuizScore())

/**
 * Total time spent in hours
 */
const timeSpent = computed(() => getTotalTimeSpentHours())

/**
 * Resume learning data (last accessed lesson)
 */
const resumeData = computed(() => getResumeLearningData())

/**
 * Certificate eligibility status
 */
const certificateReady = computed(() => canGenerateCertificate())

/**
 * Progress ring size based on compact mode
 */
const ringSize = computed(() => props.compact ? 80 : 120)

/**
 * Color based on completion percentage
 */
const progressColor = computed(() => {
  if (completionPercentage.value >= 100) return '#22c55e' // green-500
  if (completionPercentage.value >= 50) return '#3b82f6' // blue-500
  return '#6366f1' // indigo-500
})
</script>

<template>
  <!--
    Overall Progress Container
    ==========================
    Layout adapts based on compact prop
  -->
  <div
    :class="[
      'rounded-2xl p-6',
      'bg-gradient-to-br from-gray-800/50 to-gray-900/50',
      'border border-gray-700/50'
    ]"
  >
    <!--
      Full Mode Layout
      ================
      Two-column layout with ring on left, stats on right
    -->
    <template v-if="!compact">
      <!-- Header -->
      <h2 class="text-xl font-bold text-white mb-6 text-center">
        Your Learning Progress
      </h2>

      <!-- Content grid -->
      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Progress Ring -->
        <div class="flex-shrink-0">
          <ProgressRing
            :value="completionPercentage"
            :size="ringSize"
            :stroke-width="8"
            :color="progressColor"
            show-label
          />
        </div>

        <!-- Stats and Actions -->
        <div class="flex-1 space-y-4">
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Lessons Completed -->
            <div class="text-center md:text-left">
              <div class="text-2xl font-bold text-white">
                {{ completedLessons }}<span class="text-gray-400 text-lg">/{{ totalLessons }}</span>
              </div>
              <div class="text-sm text-gray-400">
                Lessons Completed
              </div>
            </div>

            <!-- Time Spent -->
            <div class="text-center md:text-left">
              <div class="text-2xl font-bold text-white">
                {{ timeSpent }}<span class="text-gray-400 text-lg"> hrs</span>
              </div>
              <div class="text-sm text-gray-400">
                Time Spent
              </div>
            </div>

            <!-- Average Quiz Score -->
            <div class="text-center md:text-left">
              <div class="text-2xl font-bold text-white">
                {{ avgQuizScore }}<span class="text-gray-400 text-lg">%</span>
              </div>
              <div class="text-sm text-gray-400">
                Avg Quiz Score
              </div>
            </div>

            <!-- Certificate Status -->
            <div class="text-center md:text-left">
              <div
                :class="[
                  'text-2xl font-bold',
                  certificateReady ? 'text-green-500' : 'text-gray-400'
                ]"
              >
                {{ certificateReady ? 'Ready!' : `${completionPercentage}%` }}
              </div>
              <div class="text-sm text-gray-400">
                Certificate
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3 pt-2">
            <!-- Resume Learning -->
            <NuxtLink
              v-if="resumeData"
              :to="resumeData.path"
            >
              <UButton
                color="primary"
                size="lg"
                class="cursor-pointer"
              >
                <UIcon
                  name="i-lucide-play-circle"
                  class="w-5 h-5 mr-2"
                />
                Resume Learning
              </UButton>
            </NuxtLink>

            <!-- Certificate Button (when ready) -->
            <NuxtLink
              v-if="certificateReady"
              to="/certificate"
            >
              <UButton
                color="success"
                variant="outline"
                size="lg"
                class="cursor-pointer"
              >
                <UIcon
                  name="i-lucide-award"
                  class="w-5 h-5 mr-2"
                />
                Get Certificate
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!--
      Compact Mode Layout
      ===================
      Vertical stack for sidebar/card usage
    -->
    <template v-else>
      <!-- Compact header with ring -->
      <div class="flex items-center gap-4 mb-4">
        <ProgressRing
          :value="completionPercentage"
          :size="ringSize"
          :stroke-width="6"
          :color="progressColor"
          show-label
        />
        <div>
          <div class="text-lg font-bold text-white">
            {{ completedLessons }}/{{ totalLessons }}
          </div>
          <div class="text-sm text-gray-400">
            lessons complete
          </div>
        </div>
      </div>

      <!-- Compact stats row -->
      <div class="flex justify-between text-sm mb-4">
        <span class="text-gray-400">
          <UIcon
            name="i-lucide-clock"
            class="w-4 h-4 inline mr-1"
          />
          {{ timeSpent }} hrs
        </span>
        <span class="text-gray-400">
          <UIcon
            name="i-lucide-trophy"
            class="w-4 h-4 inline mr-1"
          />
          {{ avgQuizScore }}% avg
        </span>
      </div>

      <!-- Compact resume button -->
      <NuxtLink
        v-if="resumeData"
        :to="resumeData.path"
        class="block"
      >
        <UButton
          color="primary"
          block
          class="cursor-pointer"
        >
          <UIcon
            name="i-lucide-play-circle"
            class="w-4 h-4 mr-2"
          />
          Resume Learning
        </UButton>
      </NuxtLink>
    </template>
  </div>
</template>
