<!--
  CheatSheetLayout.vue - Cheat Sheet Display Component
  =====================================================
  Displays cheat sheet content with a clean, reference-style layout.
  Optimized for quick scanning and PDF export.

  Features:
  - Clean typography for quick reference
  - Print-friendly styling
  - PDF export button integration
  - Distinct visual style from regular lessons

  Props:
  - lesson: The cheat sheet content document
  - phase: Phase slug for breadcrumb navigation
  - topic: Topic slug for breadcrumb navigation

  Layout Structure:
  ┌─────────────────────────────────────────────────────────────┐
  │  Breadcrumb: Home > Phase > Topic > Cheat Sheet            │
  ├─────────────────────────────────────────────────────────────┤
  │  Header: Title, "Quick Reference" badge, PDF Download      │
  ├─────────────────────────────────────────────────────────────┤
  │  Cheat Sheet Content (id="cheat-sheet-content")            │
  │  - Compact tables                                          │
  │  - Code blocks                                             │
  │  - Decision guides                                         │
  ├─────────────────────────────────────────────────────────────┤
  │  Prev/Next Navigation                                      │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import type { LessonFrontmatter } from '~/data/types'

/**
 * Component Props
 * ---------------
 */
interface CheatSheetDocument extends LessonFrontmatter {
  path: string
  id: string
  isCheatSheet?: boolean
  cheatSheetTopic?: string
  body: {
    toc?: {
      links: Array<{
        id: string
        text: string
        depth: number
      }>
    }
  }
}

interface SurroundItem {
  path: string
  title: string
}

const props = defineProps<{
  lesson: CheatSheetDocument
  phase: string
  topic: string
  subtopic: string
  prevLesson: SurroundItem | null
  nextLesson: SurroundItem | null
}>()

/**
 * PDF Export Composable
 * ---------------------
 */
const { downloadCheatSheet, isGenerating, error } = useCheatSheetPdf()

/**
 * Handle PDF Download
 * -------------------
 * Generates and downloads the cheat sheet as a PDF
 */
async function handleDownloadPdf() {
  const title = props.lesson.cheatSheetTopic || props.lesson.title
  const slug = props.topic
  await downloadCheatSheet(title, slug)
}

/**
 * Format Phase Name
 * -----------------
 * Convert slug to readable name (e.g., "phase-1-sdlc" -> "Phase 1: SDLC")
 */
function formatPhaseName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/Phase (\d+)/, 'Phase $1:')
    .replace(/Sdlc/g, 'SDLC')
}

/**
 * Format Topic Name
 * -----------------
 * Convert slug to readable name (e.g., "sdlc-models" -> "SDLC Models")
 */
function formatTopicName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/Sdlc/g, 'SDLC')
}
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!--
        Breadcrumb Navigation
        =====================
        Shows path: Home > Phase > Topic > Cheat Sheet
      -->
      <nav
        class="mb-6"
        aria-label="Breadcrumb"
      >
        <UBreadcrumb
          :items="[
            { label: 'Roadmap', icon: 'i-lucide-home', to: '/' },
            { label: formatPhaseName(phase) },
            { label: formatTopicName(topic) },
            { label: 'Quick Reference' }
          ]"
        />
      </nav>

      <!--
        Cheat Sheet Header
        ==================
        Title, badge, and PDF download button
      -->
      <header class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-50 mb-4">
              {{ lesson.title }}
            </h1>

            <!-- Meta Info Badges -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Quick Reference Badge -->
              <UBadge
                color="info"
                variant="subtle"
                size="sm"
              >
                <UIcon
                  name="i-lucide-file-text"
                  class="w-3 h-3 mr-1"
                />
                Quick Reference
              </UBadge>

              <!-- Estimated Time -->
              <div class="flex items-center gap-1.5 text-sm text-gray-400">
                <UIcon
                  name="i-lucide-clock"
                  class="w-4 h-4"
                />
                <span>{{ lesson.estimatedMinutes }} min</span>
              </div>
            </div>
          </div>

          <!-- PDF Download Button -->
          <CheatSheetPdfButton
            :is-generating="isGenerating"
            :error="error"
            @download="handleDownloadPdf"
          />
        </div>

        <!-- Description -->
        <p
          v-if="lesson.description"
          class="mt-4 text-gray-400 text-lg"
        >
          {{ lesson.description }}
        </p>
      </header>

      <!--
        Cheat Sheet Content
        ===================
        Main content area with PDF-exportable container
      -->
      <div
        id="cheat-sheet-content"
        class="cheat-sheet-content bg-gray-900 rounded-xl p-6 sm:p-8 ring-1 ring-gray-700"
      >
        <div class="prose prose-invert prose-lg max-w-none cheat-sheet-prose">
          <ContentRenderer :value="lesson" />
        </div>
      </div>

      <!--
        Prev/Next Navigation
        ====================
        Links to surrounding lessons
      -->
      <nav
        class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
        aria-label="Lesson navigation"
      >
        <!-- Previous Lesson -->
        <NuxtLink
          v-if="prevLesson"
          :to="prevLesson.path"
          class="group"
        >
          <UCard
            class="h-full cursor-pointer ring-1 ring-gray-700 hover:ring-gray-600 hover:bg-gray-800/50 transition-all"
          >
            <div class="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <UIcon
                name="i-lucide-arrow-left"
                class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              />
              Previous
            </div>
            <div class="font-semibold text-gray-200 group-hover:text-white transition-colors">
              {{ prevLesson.title }}
            </div>
          </UCard>
        </NuxtLink>
        <div v-else />

        <!-- Next Lesson -->
        <NuxtLink
          v-if="nextLesson"
          :to="nextLesson.path"
          class="group"
        >
          <UCard
            class="h-full cursor-pointer ring-1 ring-gray-700 hover:ring-gray-600 hover:bg-gray-800/50 transition-all text-right"
          >
            <div class="flex items-center justify-end gap-2 text-gray-400 text-sm mb-1">
              Next
              <UIcon
                name="i-lucide-arrow-right"
                class="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </div>
            <div class="font-semibold text-gray-200 group-hover:text-white transition-colors">
              {{ nextLesson.title }}
            </div>
          </UCard>
        </NuxtLink>
        <div v-else />
      </nav>
    </div>
  </div>
</template>

<!--
  Styles are defined in app/assets/css/main.css under "CHEAT SHEET STYLES"
  to avoid Tailwind v4 @apply issues in scoped styles
-->
