<!--
  Certificate Preview Component
  =============================
  Visual certificate design component that displays phase-level or course-level certificates.
  This component is designed to be captured and converted to PDF.

  Props:
  - certificateData: Certificate data object (PhaseCertificateData | CourseCertificateData)
  - type: Certificate type ('phase' | 'course')

  Structure:
  ┌──────────────────────────────────────────────────┐
  │  Certificate Header (Logo/Icon + Title)          │
  │  ┌────────────────────────────────────────────┐  │
  │  │  Certificate Body                          │  │
  │  │  - Learner Name (prominent)                │  │
  │  │  - Completion Statement                    │  │
  │  │  │  - Phase variant: Phase name + number   │  │
  │  │  │  - Course variant: "DevOps Master"      │  │
  │  │  - Statistics Grid                         │  │
  │  │    - Lessons completed                     │  │
  │  │    - Hours spent                           │  │
  │  │    - Quiz score                            │  │
  │  │  - Completion Date                         │  │
  │  └────────────────────────────────────────────┘  │
  │  Certificate Footer (ID + Signature Area)        │
  └──────────────────────────────────────────────────┘

  Design:
  - A4 landscape aspect ratio (297:210 = 1.414:1)
  - Dark mode palette (gray-800 background)
  - Gold/amber accent for prestige
  - Red Hat Text font for UI consistency
  - Exposed ref for PDF capture

  Data Flow:
  1. Parent passes certificateData prop
  2. Component renders certificate design
  3. Parent captures component via ref for PDF generation
-->

<script setup lang="ts">
import type { PhaseCertificateData, CourseCertificateData } from '~/data/types'

// =============================================================================
// PROPS & TYPES
// =============================================================================

interface Props {
  /** Certificate data object */
  certificateData: PhaseCertificateData | CourseCertificateData
  /** Type of certificate to display */
  type: 'phase' | 'course'
}

const props = defineProps<Props>()

// =============================================================================
// COMPOSABLES
// =============================================================================

const { formatCertificateDate } = useCertificate()

// =============================================================================
// COMPUTED
// =============================================================================

/**
 * Whether this is a phase certificate
 */
const isPhase = computed(() => props.type === 'phase')

/**
 * Whether this is a course certificate
 */
const isCourse = computed(() => props.type === 'course')

/**
 * Certificate title text
 */
const certificateTitle = computed(() => {
  if (isPhase.value && 'phaseName' in props.certificateData) {
    return `Phase ${props.certificateData.phaseNumber}: ${props.certificateData.phaseName}`
  }
  return 'DevOps Master Certificate'
})

/**
 * Completion statement text
 */
const completionStatement = computed(() => {
  if (isPhase.value) {
    return 'has successfully completed'
  }
  return 'has successfully completed the full'
})

/**
 * Formatted completion date
 */
const formattedDate = computed(() => {
  return formatCertificateDate(props.certificateData.completionDate)
})

/**
 * Statistics to display
 */
const statistics = computed(() => {
  if (isPhase.value && 'totalLessons' in props.certificateData) {
    const data = props.certificateData as PhaseCertificateData
    return [
      {
        label: 'Lessons Completed',
        value: `${data.lessonsCompleted} / ${data.totalLessons}`
      },
      {
        label: 'Hours Invested',
        value: `${data.hoursSpent}`
      },
      {
        label: 'Average Quiz Score',
        value: `${data.averageQuizScore}%`
      }
    ]
  } else if (isCourse.value && 'totalLessonsCompleted' in props.certificateData) {
    const data = props.certificateData as CourseCertificateData
    return [
      {
        label: 'Total Lessons',
        value: `${data.totalLessonsCompleted}`
      },
      {
        label: 'Total Hours',
        value: `${data.totalHoursSpent}`
      },
      {
        label: 'Overall Quiz Score',
        value: `${data.overallQuizScore}%`
      }
    ]
  }
  return []
})

/**
 * Course-specific: Phase completion indicators
 */
const phaseCompletionDates = computed(() => {
  if (isCourse.value && 'phaseCompletionDates' in props.certificateData) {
    return (props.certificateData as CourseCertificateData).phaseCompletionDates
  }
  return []
})
</script>

<template>
  <div
    id="certificate-preview"
    class="relative flex flex-col items-center justify-center bg-gray-800 p-12"
    :class="{
      'border-4 border-amber-500': isCourse,
      'border-2 border-gray-700': isPhase
    }"
    style="aspect-ratio: 297/210; width: 100%; max-width: 1188px;"
  >
    <!-- =================================================================== -->
    <!-- Header Section -->
    <!-- =================================================================== -->
    <div class="mb-6 text-center">
      <!-- Phase Badge (phase variant only) -->
      <div
        v-if="isPhase && 'phaseNumber' in certificateData"
        class="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2"
      >
        <span class="text-2xl font-bold text-white">Phase {{ certificateData.phaseNumber }}</span>
      </div>

      <!-- Certificate Title -->
      <h1
        class="mb-2 font-sans text-4xl font-bold tracking-tight"
        :class="{
          'text-amber-400': isCourse,
          'text-indigo-400': isPhase
        }"
      >
        Certificate of Completion
      </h1>

      <!-- Subtitle -->
      <div class="text-lg text-gray-400">
        DevOps Learning Management System
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- Body Section -->
    <!-- =================================================================== -->
    <div class="w-full max-w-3xl space-y-8 text-center">
      <!-- Learner Name (Prominent) -->
      <div>
        <p class="mb-2 text-sm uppercase tracking-wider text-gray-500">
          This certifies that
        </p>
        <h2 class="font-content text-5xl font-bold text-white">
          {{ certificateData.userName }}
        </h2>
      </div>

      <!-- Completion Statement -->
      <div class="space-y-2">
        <p class="text-xl text-gray-300">
          {{ completionStatement }}
        </p>
        <h3
          class="font-sans text-3xl font-bold"
          :class="{
            'text-amber-400': isCourse,
            'text-indigo-300': isPhase
          }"
        >
          {{ certificateTitle }}
        </h3>
      </div>

      <!-- Statistics Grid -->
      <div class="grid grid-cols-3 gap-6 border-t border-b border-gray-700 py-6">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="space-y-1"
        >
          <div class="text-sm uppercase tracking-wider text-gray-500">
            {{ stat.label }}
          </div>
          <div
            class="text-2xl font-bold"
            :class="{
              'text-amber-400': isCourse,
              'text-indigo-400': isPhase
            }"
          >
            {{ stat.value }}
          </div>
        </div>
      </div>

      <!-- Course Completion: Phase Indicators -->
      <div
        v-if="isCourse && phaseCompletionDates.length === 10"
        class="rounded-lg bg-gray-900 p-6"
      >
        <div class="mb-4 text-sm uppercase tracking-wider text-gray-500">
          All 10 Phases Completed
        </div>
        <div class="flex items-center justify-center gap-2">
          <div
            v-for="(date, index) in phaseCompletionDates"
            :key="index"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white"
            :title="`Phase ${index + 1}: ${formatCertificateDate(date)}`"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Completion Date -->
      <div class="space-y-1">
        <div class="text-sm uppercase tracking-wider text-gray-500">
          Date of Completion
        </div>
        <div class="text-xl font-semibold text-gray-300">
          {{ formattedDate }}
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- Footer Section -->
    <!-- =================================================================== -->
    <div class="mt-8 w-full max-w-3xl border-t border-gray-700 pt-6 text-center">
      <!-- Certificate ID -->
      <div class="space-y-1">
        <div class="text-xs uppercase tracking-wider text-gray-600">
          Certificate ID
        </div>
        <div class="font-mono text-sm text-gray-400">
          {{ certificateData.certificateId }}
        </div>
      </div>

      <!-- Signature Area (decorative) -->
      <div class="mt-6 flex items-center justify-center gap-12">
        <div class="flex-1 space-y-2">
          <div class="mx-auto h-px w-48 bg-gray-700" />
          <div class="text-xs uppercase tracking-wider text-gray-600">
            DevOps LMS Platform
          </div>
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- Decorative Corner Elements -->
    <!-- =================================================================== -->
    <!-- Top-left corner -->
    <div
      class="absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2"
      :class="{
        'border-amber-500': isCourse,
        'border-gray-600': isPhase
      }"
    />
    <!-- Top-right corner -->
    <div
      class="absolute right-4 top-4 h-16 w-16 border-r-2 border-t-2"
      :class="{
        'border-amber-500': isCourse,
        'border-gray-600': isPhase
      }"
    />
    <!-- Bottom-left corner -->
    <div
      class="absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2"
      :class="{
        'border-amber-500': isCourse,
        'border-gray-600': isPhase
      }"
    />
    <!-- Bottom-right corner -->
    <div
      class="absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2"
      :class="{
        'border-amber-500': isCourse,
        'border-gray-600': isPhase
      }"
    />
  </div>
</template>
