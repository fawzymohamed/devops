<!--
  progress.vue - Progress Dashboard Page
  ======================================
  Multi-roadmap progress dashboard with card selection and detailed drill-down.

  Pattern:
  - No roadmap selected: Show two roadmap cards to choose from
  - Roadmap selected (?roadmap=id): Show detailed progress for that roadmap

  Layout (No Selection):
  ┌─────────────────────────────────────────────────────────────┐
  │  Choose a Roadmap                                           │
  │  Select a roadmap to view your progress.                    │
  ├─────────────────────────────────────────────────────────────┤
  │  ┌──────────────────┐   ┌──────────────────┐               │
  │  │  DevOps          │   │  Full Stack      │               │
  │  │  [Progress Ring] │   │  [Progress Ring] │               │
  │  └──────────────────┘   └──────────────────┘               │
  └─────────────────────────────────────────────────────────────┘

  Layout (Roadmap Selected):
  ┌─────────────────────────────────────────────────────────────┐
  │  DevOps Roadmap Progress                    [Back]          │
  ├─────────────────────────────────────────────────────────────┤
  │  Overview Card (Progress Ring, Lessons, Time)               │
  ├─────────────────────────────────────────────────────────────┤
  │  Phase Breakdown (Expandable phases)                        │
  ├─────────────────────────────────────────────────────────────┤
  │  Data Management (Export/Import/Reset)                      │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import { allRoadmaps } from '~/data/roadmaps'
import type { Roadmap } from '~/data/types'

// =============================================================================
// PAGE META
// =============================================================================

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Progress | Learning Paths',
  description: 'Track your learning progress across all roadmaps'
})

// =============================================================================
// COMPOSABLES
// =============================================================================

const route = useRoute()
const { getRoadmapById, getRoutePath } = useRoadmap()

const {
  exportProgress,
  importProgress,
  resetProgress,
  getCompletedCount,
  getTotalLessonCount,
  getCompletionPercentage,
  getTotalTimeSpentHours,
  getResumeLearningData
} = useProgress()

// =============================================================================
// STATE
// =============================================================================

const expandedPhases = ref<Record<string, boolean>>({})
const fileInputRef = ref<HTMLInputElement | null>(null)
const showResetConfirm = ref(false)

// =============================================================================
// COMPUTED - Roadmap Selection
// =============================================================================

/**
 * Get roadmap ID from query param
 */
const selectedRoadmapId = computed(() => {
  const value = route.query.roadmap
  return typeof value === 'string' ? value : ''
})

/**
 * Get the selected roadmap object
 */
const selectedRoadmap = computed(() => {
  if (!selectedRoadmapId.value) return null
  return getRoadmapById(selectedRoadmapId.value) ?? null
})

/**
 * Whether a roadmap is selected
 */
const hasSelectedRoadmap = computed(() => !!selectedRoadmap.value)

/**
 * Roadmap cards for selection view
 */
const roadmapCards = computed(() => {
  return allRoadmaps.map(roadmap => ({
    roadmap,
    progress: getCompletionPercentage(roadmap.id)
  }))
})

/**
 * Handle roadmap card click
 */
function handleSelectRoadmap(roadmap: Roadmap) {
  navigateTo(`/progress?roadmap=${roadmap.id}`)
}

// =============================================================================
// COMPUTED - Selected Roadmap Progress
// =============================================================================

const roadmapId = computed(() => selectedRoadmap.value?.id ?? '')

const completedLessons = computed(() => {
  if (!roadmapId.value) return 0
  return getCompletedCount(roadmapId.value)
})

const totalLessons = computed(() => {
  if (!roadmapId.value) return 0
  return getTotalLessonCount(roadmapId.value)
})

const completionPercentage = computed(() => {
  if (!roadmapId.value) return 0
  return getCompletionPercentage(roadmapId.value)
})

const timeSpentHours = computed(() => {
  if (!roadmapId.value) return 0
  return getTotalTimeSpentHours(roadmapId.value)
})

const hasProgress = computed(() => completedLessons.value > 0)

/**
 * Resume learning path
 */
const resumePath = computed(() => {
  if (!roadmapId.value) return null
  const resumeData = getResumeLearningData(roadmapId.value)
  if (!resumeData) return null
  return getRoutePath(roadmapId.value, resumeData.phaseId, resumeData.topicId, resumeData.subtopicId)
})

/**
 * Roadmap home path
 */
const roadmapHomePath = computed(() => {
  if (!roadmapId.value) return '/'
  return getRoutePath(roadmapId.value)
})

// =============================================================================
// METHODS
// =============================================================================

function togglePhase(phaseSlug: string) {
  const key = `${roadmapId.value}:${phaseSlug}`
  expandedPhases.value[key] = !expandedPhases.value[key]
}

function isPhaseExpanded(phaseSlug: string): boolean {
  const key = `${roadmapId.value}:${phaseSlug}`
  return expandedPhases.value[key] ?? false
}

function handleExport() {
  const data = exportProgress()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const suffix = new Date().toISOString().split('T')[0]
  a.download = `${roadmapId.value}-progress-${suffix}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function triggerImport() {
  fileInputRef.value?.click()
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const success = importProgress(text)
    if (success) {
      alert('Progress imported successfully!')
    } else {
      alert('Failed to import progress. Invalid file format.')
    }
  } catch {
    alert('Failed to read file.')
  }

  input.value = ''
}

function handleReset() {
  showResetConfirm.value = false
  resetProgress()
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <!--
        Roadmap Selection View
        ======================
        Show when no roadmap is selected
      -->
      <div
        v-if="!hasSelectedRoadmap"
        class="py-10"
      >
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-100 mb-3">
            Choose a Roadmap
          </h1>
          <p class="text-gray-400 text-base">
            Select a roadmap to view your learning progress.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <RoadmapCard
            v-for="item in roadmapCards"
            :key="item.roadmap.id"
            :roadmap="item.roadmap"
            :progress="item.progress"
            @select="handleSelectRoadmap"
          />
        </div>
      </div>

      <!--
        Detailed Progress View
        ======================
        Show when a roadmap is selected
      -->
      <div v-else>
        <!--
          Page Header
          ===========
        -->
        <div class="mb-8">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-100 mb-2">
                {{ selectedRoadmap?.title }} Progress
              </h1>
              <p class="text-gray-400">
                Track your learning journey and see how far you've come.
              </p>
            </div>

            <UButton
              label="Back to Overview"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="outline"
              class="cursor-pointer"
              to="/progress"
            />
          </div>
        </div>

        <!--
          Progress Overview Card
          ======================
          Main stats summary
        -->
        <UCard class="mb-8 p-6 ring-1 ring-gray-700/50 bg-gray-800">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Progress Ring -->
            <div class="flex-shrink-0">
              <ProgressRing
                :value="completionPercentage"
                :size="120"
                :stroke-width="8"
                color="#10b981"
                track-color="rgba(255,255,255,0.1)"
                show-label
              />
            </div>

            <!-- Stats Grid -->
            <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center md:text-left">
                <div class="text-sm text-gray-400 mb-1">
                  Lessons Completed
                </div>
                <div class="text-2xl font-bold text-gray-100">
                  {{ completedLessons }}<span class="text-gray-500">/{{ totalLessons }}</span>
                </div>
              </div>

              <div class="text-center md:text-left">
                <div class="text-sm text-gray-400 mb-1">
                  Time Invested
                </div>
                <div class="text-2xl font-bold text-gray-100">
                  {{ timeSpentHours }} <span class="text-gray-500">hrs</span>
                </div>
              </div>

              <div class="text-center md:text-left">
                <div class="text-sm text-gray-400 mb-1">
                  Phases
                </div>
                <div class="text-2xl font-bold text-gray-100">
                  {{ selectedRoadmap?.stats.phaseCount }}
                </div>
              </div>

              <div class="text-center md:text-left">
                <div class="text-sm text-gray-400 mb-1">
                  Skills
                </div>
                <div class="text-2xl font-bold text-gray-100">
                  {{ selectedRoadmap?.stats.subtopicCount }}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3">
              <NuxtLink
                v-if="resumePath"
                :to="resumePath"
              >
                <UButton
                  color="primary"
                  size="lg"
                  class="cursor-pointer w-full"
                >
                  <UIcon
                    name="i-lucide-play-circle"
                    class="w-5 h-5 mr-2"
                  />
                  Resume Learning
                </UButton>
              </NuxtLink>

              <NuxtLink
                v-else
                :to="roadmapHomePath"
              >
                <UButton
                  color="primary"
                  size="lg"
                  class="cursor-pointer w-full"
                >
                  <UIcon
                    name="i-lucide-rocket"
                    class="w-5 h-5 mr-2"
                  />
                  Start Learning
                </UButton>
              </NuxtLink>

              <NuxtLink :to="`/certificate?roadmap=${roadmapId}`">
                <UButton
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="cursor-pointer w-full"
                >
                  <UIcon
                    name="i-lucide-award"
                    class="w-5 h-5 mr-2"
                  />
                  View Certificates
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </UCard>

        <!--
          Empty State
          ===========
          Show when no progress yet
        -->
        <UCard
          v-if="!hasProgress"
          class="mb-8 text-center p-12 ring-1 ring-gray-700/50 bg-gray-800"
        >
          <div class="space-y-4">
            <div class="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
              <UIcon
                name="i-lucide-book-open"
                class="h-10 w-10 text-emerald-400"
              />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-100 mb-2">
                Start Your Learning Journey
              </h3>
              <p class="text-gray-400 max-w-md mx-auto">
                Complete lessons to track your progress. Your learning journey begins with a single step!
              </p>
            </div>
            <NuxtLink :to="roadmapHomePath">
              <UButton
                label="Start Learning"
                icon="i-lucide-rocket"
                color="primary"
                size="lg"
                class="cursor-pointer"
              />
            </NuxtLink>
          </div>
        </UCard>

        <!--
          Phase Breakdown
          ===============
          Expandable phase progress cards
        -->
        <section
          v-if="hasProgress && selectedRoadmap"
          class="mb-10"
        >
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            Phase Breakdown
          </h2>

          <div class="space-y-3">
            <ProgressPhaseProgress
              v-for="phase in selectedRoadmap.phases"
              :key="phase.slug"
              :phase="phase"
              :expanded="isPhaseExpanded(phase.slug)"
              :roadmap-id="roadmapId"
              @toggle="togglePhase(phase.slug)"
            />
          </div>
        </section>

        <!--
          Data Management
          ===============
          Export, import, reset options
        -->
        <section class="border-t border-gray-700 pt-8">
          <h2 class="text-xl font-semibold text-white mb-4">
            Data Management
          </h2>

          <p class="text-gray-400 text-sm mb-4">
            Progress is stored locally in your browser. Use these tools to backup,
            restore, or reset your data.
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              :disabled="!hasProgress"
              color="neutral"
              variant="outline"
              class="cursor-pointer"
              @click="handleExport"
            >
              <UIcon
                name="i-lucide-download"
                class="w-4 h-4 mr-2"
              />
              Export Progress
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              class="cursor-pointer"
              @click="triggerImport"
            >
              <UIcon
                name="i-lucide-upload"
                class="w-4 h-4 mr-2"
              />
              Import Progress
            </UButton>

            <input
              ref="fileInputRef"
              type="file"
              accept=".json"
              class="hidden"
              @change="handleImport"
            >

            <UButton
              :disabled="!hasProgress"
              color="error"
              variant="outline"
              class="cursor-pointer"
              @click="showResetConfirm = true"
            >
              <UIcon
                name="i-lucide-trash-2"
                class="w-4 h-4 mr-2"
              />
              Reset Progress
            </UButton>
          </div>

          <!--
            Reset Confirmation Modal
          -->
          <UModal v-model:open="showResetConfirm">
            <template #content>
              <UCard>
                <template #header>
                  <div class="flex items-center gap-3">
                    <UIcon
                      name="i-lucide-alert-triangle"
                      class="w-6 h-6 text-red-500"
                    />
                    <h3 class="text-lg font-semibold text-white">
                      Reset Progress?
                    </h3>
                  </div>
                </template>

                <p class="text-gray-300">
                  This will permanently delete all your learning progress for
                  <strong>{{ selectedRoadmap?.title }}</strong>.
                </p>

                <template #footer>
                  <div class="flex justify-end gap-3">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      class="cursor-pointer"
                      @click="showResetConfirm = false"
                    >
                      Cancel
                    </UButton>
                    <UButton
                      color="error"
                      class="cursor-pointer"
                      @click="handleReset"
                    >
                      Reset Progress
                    </UButton>
                  </div>
                </template>
              </UCard>
            </template>
          </UModal>
        </section>
      </div>
    </div>
  </div>
</template>
