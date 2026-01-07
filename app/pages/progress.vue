<!--
  progress.vue - Detailed Progress Dashboard Page
  ================================================
  A dedicated page showing detailed learning progress across all phases,
  with statistics, phase-by-phase breakdown, and data management tools.

  Features:
  - Overall progress hero section with key stats
  - Phase-by-phase expandable progress cards
  - Data management: export, import, reset
  - Breadcrumb navigation
  - Responsive layout

  Route: /progress

  Visual Structure:
  ┌────────────────────────────────────────────────────────┐
  │  Home > Progress                                        │
  ├────────────────────────────────────────────────────────┤
  │                                                         │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │        Overall Progress (OverallProgress)        │   │
  │  └─────────────────────────────────────────────────┘   │
  │                                                         │
  │  Phase-by-Phase Progress                               │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │  Phase 1: SDLC                        [80%]     │   │
  │  └─────────────────────────────────────────────────┘   │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │  Phase 2: Foundations                 [0%]      │   │
  │  └─────────────────────────────────────────────────┘   │
  │  ...                                                   │
  │                                                         │
  │  Data Management                                        │
  │  [Export]  [Import]  [Reset]                           │
  │                                                         │
  └────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import { roadmapData } from '~/data/roadmap'

// =============================================================================
// PAGE META
// =============================================================================

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Progress | DevOps Learning Path',
  description: 'Track your learning progress across all DevOps topics'
})

// =============================================================================
// COMPOSABLES
// =============================================================================

const {
  exportProgress,
  importProgress,
  resetProgress,
  getCompletedCount
} = useProgress()

// =============================================================================
// STATE
// =============================================================================

/**
 * Track which phase cards are expanded
 * Key: phase slug, Value: expanded state
 */
const expandedPhases = ref<Record<string, boolean>>({})

/**
 * File input reference for import functionality
 */
const fileInputRef = ref<HTMLInputElement | null>(null)

/**
 * Show reset confirmation modal
 */
const showResetConfirm = ref(false)

// =============================================================================
// METHODS
// =============================================================================

/**
 * Toggle a phase card's expanded state
 */
function togglePhase(phaseSlug: string) {
  expandedPhases.value[phaseSlug] = !expandedPhases.value[phaseSlug]
}

/**
 * Export progress as JSON file download
 */
function handleExport() {
  const data = exportProgress()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `devops-progress-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Trigger file input for import
 */
function triggerImport() {
  fileInputRef.value?.click()
}

/**
 * Handle file selection for import
 */
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

  // Reset input so same file can be selected again
  input.value = ''
}

/**
 * Confirm and reset all progress
 */
function handleReset() {
  showResetConfirm.value = false
  resetProgress()
}

// =============================================================================
// COMPUTED
// =============================================================================

/**
 * Check if user has any progress to show export/reset buttons
 */
const hasProgress = computed(() => getCompletedCount() > 0)
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Main Content Container -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!--
        Breadcrumb Navigation
        =====================
      -->
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

      <!--
        Page Title
        ==========
      -->
      <h1 class="text-3xl font-bold text-white mb-8">
        Learning Progress
      </h1>

      <!--
        Overall Progress Section
        ========================
      -->
      <section class="mb-10">
        <ProgressOverallProgress />
      </section>

      <!--
        Phase-by-Phase Progress
        =======================
      -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-white mb-4">
          Phase-by-Phase Progress
        </h2>

        <div class="space-y-3">
          <ProgressPhaseProgress
            v-for="phase in roadmapData"
            :key="phase.slug"
            :phase="phase"
            :expanded="expandedPhases[phase.slug] ?? false"
            @toggle="togglePhase(phase.slug)"
          />
        </div>
      </section>

      <!--
        Data Management Section
        =======================
      -->
      <section class="border-t border-gray-700 pt-8">
        <h2 class="text-xl font-semibold text-white mb-4">
          Data Management
        </h2>

        <p class="text-gray-400 text-sm mb-4">
          Your progress is stored locally in your browser. Use these tools to backup,
          restore, or reset your progress data.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3">
          <!-- Export Button -->
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

          <!-- Import Button -->
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

          <!-- Hidden file input for import -->
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
          >

          <!-- Reset Button -->
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

        <!-- Reset Confirmation Modal -->
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
                This will permanently delete all your learning progress, including:
              </p>
              <ul class="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Completed lesson tracking</li>
                <li>Quiz scores</li>
                <li>Time spent data</li>
              </ul>
              <p class="text-gray-300 mt-3">
                This action cannot be undone. Are you sure?
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

      <!--
        Back to Roadmap Link
        ====================
      -->
      <div class="mt-10 text-center">
        <NuxtLink to="/">
          <UButton
            color="primary"
            variant="ghost"
            class="cursor-pointer"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="w-4 h-4 mr-2"
            />
            Back to Roadmap
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
