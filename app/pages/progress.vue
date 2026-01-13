<!--
  progress.vue - Detailed Progress Dashboard Page
  ================================================
  Multi-roadmap progress dashboard with overview and drill-down views.
-->

<script setup lang="ts">
import { allRoadmaps } from '~/data/roadmaps'

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
const { getRoutePath } = useRoadmap()

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
// COMPUTED
// =============================================================================

const roadmapFilter = computed(() => {
  const value = route.query.roadmap
  return typeof value === 'string' ? value : null
})

const filteredRoadmaps = computed(() => {
  if (!roadmapFilter.value) return allRoadmaps
  return allRoadmaps.filter(roadmap => roadmap.id === roadmapFilter.value || roadmap.slug === roadmapFilter.value)
})

const hasProgress = computed(() => {
  return allRoadmaps.some(roadmap => getCompletedCount(roadmap.id) > 0)
})

function getResumePath(roadmapId: string): string | undefined {
  const resumeData = getResumeLearningData(roadmapId)
  if (!resumeData) return undefined
  return getRoutePath(roadmapId, resumeData.phaseId, resumeData.topicId, resumeData.subtopicId)
}

// =============================================================================
// METHODS
// =============================================================================

function togglePhase(roadmapId: string, phaseSlug: string) {
  const key = `${roadmapId}:${phaseSlug}`
  expandedPhases.value[key] = !expandedPhases.value[key]
}

function handleExport() {
  const data = exportProgress()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const suffix = new Date().toISOString().split('T')[0]
  const prefix = roadmapFilter.value ? roadmapFilter.value : 'roadmaps'
  a.download = `${prefix}-progress-${suffix}.json`
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
  <div class="min-h-screen bg-gray-900">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <nav class="mb-6">
        <ul class="flex items-center text-sm text-gray-400">
          <li>
            <NuxtLink
              to="/"
              class="hover:text-white transition-colors"
            >
              Home
            </NuxtLink>
          </li>
          <li class="mx-2">
            /
          </li>
          <li class="text-white">
            Progress
          </li>
        </ul>
      </nav>

      <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">
            Learning Progress
          </h1>
          <p class="text-gray-400">
            Track completion, time invested, and resume where you left off.
          </p>
        </div>
        <UButton
          v-if="roadmapFilter"
          color="neutral"
          variant="outline"
          class="cursor-pointer"
          to="/progress"
        >
          Clear Filter
        </UButton>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold text-white mb-4">
          Roadmap Overview
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <UCard
            v-for="roadmap in filteredRoadmaps"
            :key="roadmap.id"
            class="bg-gray-800 ring-1 ring-gray-700/50"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-lg font-semibold text-gray-100">
                  {{ roadmap.title }}
                </div>
                <div class="text-sm text-gray-400">
                  {{ roadmap.description }}
                </div>
              </div>
              <ProgressRing
                :value="getCompletionPercentage(roadmap.id)"
                :size="56"
                :stroke-width="5"
                color="#10b981"
                show-label
              />
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <div class="text-xs text-gray-500">
                  Lessons
                </div>
                <div class="font-semibold text-gray-100">
                  {{ getCompletedCount(roadmap.id) }}/{{ getTotalLessonCount(roadmap.id) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">
                  Time Spent
                </div>
                <div class="font-semibold text-gray-100">
                  {{ getTotalTimeSpentHours(roadmap.id) }} hrs
                </div>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <NuxtLink
                :to="`/progress?roadmap=${roadmap.id}`"
                class="text-sm text-emerald-400 hover:text-emerald-300"
              >
                View Details
              </NuxtLink>
              <NuxtLink
                v-if="getResumePath(roadmap.id)"
                :to="getResumePath(roadmap.id)"
              >
                <UButton
                  size="sm"
                  color="primary"
                  class="cursor-pointer"
                >
                  Resume Learning
                </UButton>
              </NuxtLink>
            </div>
          </UCard>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold text-white mb-4">
          Phase Breakdown
        </h2>

        <div
          v-for="roadmap in filteredRoadmaps"
          :key="roadmap.id"
          class="mb-8"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-200">
              {{ roadmap.title }}
            </h3>
            <span class="text-sm text-gray-500">
              {{ roadmap.stats.phaseCount }} phases
            </span>
          </div>

          <div class="space-y-3">
            <ProgressPhaseProgress
              v-for="phase in roadmap.phases"
              :key="phase.slug"
              :phase="phase"
              :expanded="expandedPhases[`${roadmap.id}:${phase.slug}`] ?? false"
              :roadmap-id="roadmap.id"
              @toggle="togglePhase(roadmap.id, phase.slug)"
            />
          </div>
        </div>
      </section>

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
                This will permanently delete all your learning progress across roadmaps.
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
                    Reset All Progress
                  </UButton>
                </div>
              </template>
            </UCard>
          </template>
        </UModal>
      </section>
    </div>
  </div>
</template>
