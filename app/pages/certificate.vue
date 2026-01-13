<!--
  Certificate Dashboard Page
  ===========================
  Main certificate dashboard displaying all phase certificates and course completion certificate.
  Route: /certificate

  Features:
  - Grid layout for 10 phase certificate cards
  - Overall progress summary section
  - Certificate preview modal
  - Name entry/edit modal
  - Course completion certificate section
  - Responsive design (1 col mobile, 2 col tablet, 3 col desktop)

  Structure:
  ┌─────────────────────────────────────────────────────────┐
  │  Certificates                              [Edit Name]   │
  │  Welcome, John Doe                                       │
  ├─────────────────────────────────────────────────────────┤
  │  Overall Progress: 157/527 lessons (30%)                │
  │  Phases Completed: 3/10                                 │
  │  [Progress Ring]                                        │
  ├─────────────────────────────────────────────────────────┤
  │  Course Completion Certificate (if unlocked)            │
  ├─────────────────────────────────────────────────────────┤
  │  Phase Certificates                                     │
  │  ┌──────┐ ┌──────┐ ┌──────┐                           │
  │  │ P1   │ │ P2   │ │ P3   │                           │
  │  └──────┘ └──────┘ └──────┘                           │
  │  (Grid continues for all 10 phases)                    │
  └─────────────────────────────────────────────────────────┘

  Usage:
  Navigate to /certificate in the app
-->

<script setup lang="ts">
import type { PhaseCertificateData, CourseCertificateData } from '~/data/types'
import NameInputModal from '~/components/certificate/NameInputModal.vue'
import CertificateCard from '~/components/certificate/CertificateCard.vue'
import CertificateDownloadButton from '~/components/certificate/CertificateDownloadButton.vue'

// =============================================================================
// META & SEO
// =============================================================================

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Certificates - DevOps Learning Management System',
  description: 'View and download your earned DevOps course certificates'
})

// =============================================================================
// COMPOSABLES
// =============================================================================

const {
  getPhaseCertificateStatuses,
  buildPhaseCertificateData,
  buildCourseCertificateData,
  canUnlockCourseCertificate
} = useCertificate()

const {
  getCompletedCount,
  getTotalLessonCount,
  getUserName,
  hasUserName,
  setUserName
} = useProgress()

// =============================================================================
// STATE
// =============================================================================

/** All phase certificate statuses */
const certificateStatuses = ref(getPhaseCertificateStatuses())

/** Currently viewing certificate data */
const viewingCertificate = ref<PhaseCertificateData | CourseCertificateData | null>(null)

/** Certificate type being viewed */
const viewingCertificateType = ref<'phase' | 'course'>('phase')

/** Certificate preview modal open state */
const isCertificateModalOpen = ref(false)

/** Name input modal open state */
const isNameModalOpen = ref(false)

/** Certificate preview element ref for PDF generation */
const certificatePreviewRef = ref<HTMLElement | null>(null)

/** Loading state for page data */
const isLoading = ref(true)

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * User's display name
 */
const displayName = computed(() => getUserName() || 'Learner')

/**
 * Overall lesson completion count
 */
const completedLessons = computed(() => getCompletedCount())

/**
 * Total lesson count
 */
const totalLessons = computed(() => getTotalLessonCount())

/**
 * Overall completion percentage
 */
const overallPercentage = computed(() => {
  const total = totalLessons.value
  if (total === 0) return 0
  return Math.round((completedLessons.value / total) * 100)
})

/**
 * Number of phases completed
 */
const phasesCompleted = computed(() => {
  return certificateStatuses.value.filter(s => s.status === 'unlocked').length
})

/**
 * Check if course certificate is unlocked
 */
const isCourseCertificateUnlocked = computed(() => canUnlockCourseCertificate())

/**
 * PDF filename for current viewing certificate
 */
const pdfFilename = computed(() => {
  if (!viewingCertificate.value) return ''

  if (viewingCertificateType.value === 'course') {
    return `DevOps-Master-Certificate-${viewingCertificate.value.certificateId}.pdf`
  } else if ('phaseNumber' in viewingCertificate.value) {
    return `DevOps-Phase${viewingCertificate.value.phaseNumber}-Certificate-${viewingCertificate.value.certificateId}.pdf`
  }

  return 'DevOps-Certificate.pdf'
})

// =============================================================================
// LIFECYCLE
// =============================================================================

/**
 * Check for user name on mount
 * Prompt name entry if not set and user has any unlocked certificates
 */
onMounted(() => {
  // Simulate loading for smoother UX (data is actually instant from localStorage)
  setTimeout(() => {
    // Refresh certificate statuses
    certificateStatuses.value = getPhaseCertificateStatuses()

    // Mark loading complete
    isLoading.value = false

    // Prompt for name if not set and user has unlocked certificates
    if (!hasUserName() && phasesCompleted.value > 0) {
      // Small delay for better UX
      setTimeout(() => {
        isNameModalOpen.value = true
      }, 500)
    }
  }, 300)
})

// =============================================================================
// ACTIONS
// =============================================================================

/**
 * Handle viewing a phase certificate
 * @param phaseSlug - Phase slug to view certificate for
 */
function handleViewPhaseCertificate(phaseSlug: string) {
  // Build certificate data
  const certData = buildPhaseCertificateData(phaseSlug)

  if (!certData) {
    // Check if name is missing
    if (!hasUserName()) {
      isNameModalOpen.value = true
      return
    }

    console.error('Failed to build phase certificate data')
    return
  }

  // Show certificate preview
  viewingCertificate.value = certData
  viewingCertificateType.value = 'phase'
  isCertificateModalOpen.value = true
}

/**
 * Handle viewing the course completion certificate
 */
function handleViewCourseCertificate() {
  // Build certificate data
  const certData = buildCourseCertificateData()

  if (!certData) {
    // Check if name is missing
    if (!hasUserName()) {
      isNameModalOpen.value = true
      return
    }

    console.error('Failed to build course certificate data')
    return
  }

  // Show certificate preview
  viewingCertificate.value = certData
  viewingCertificateType.value = 'course'
  isCertificateModalOpen.value = true
}

/**
 * Handle name save from modal
 * @param name - User's entered name
 */
function handleNameSave(name: string) {
  const success = setUserName(name)

  if (success) {
    // Refresh certificate statuses to reflect name change
    certificateStatuses.value = getPhaseCertificateStatuses()
  }
}

/**
 * Open name edit modal
 */
function handleEditName() {
  isNameModalOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <!--
        Page Header
        ===========
        Title, breadcrumb, and name display with edit option
      -->
      <div class="mb-8">
        <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-100 mb-2">
              Certificates
            </h1>
            <p class="text-gray-400">
              View and download your earned certificates
            </p>
          </div>

          <!-- Edit name button -->
          <UButton
            v-if="hasUserName()"
            label="Edit Name"
            icon="i-lucide-edit-2"
            color="neutral"
            variant="outline"
            class="cursor-pointer"
            @click="handleEditName"
          />
        </div>

        <!-- Welcome message -->
        <div class="text-lg text-gray-300">
          Welcome, <span class="font-semibold text-indigo-400">{{ displayName }}</span>
        </div>
      </div>

      <!--
        Loading Skeleton
        ================
        Show skeleton while data loads
      -->
      <div
        v-if="isLoading"
        class="space-y-8"
      >
        <!-- Header skeleton -->
        <div class="space-y-4">
          <USkeleton class="h-8 w-48" />
          <USkeleton class="h-5 w-64" />
        </div>

        <!-- Progress summary skeleton -->
        <UCard
          class="p-6 ring-1 ring-gray-700/50 bg-gray-800"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="i in 3"
              :key="i"
            >
              <USkeleton class="h-4 w-24 mb-2" />
              <USkeleton class="h-8 w-32 mb-1" />
              <USkeleton class="h-4 w-28" />
            </div>
          </div>
        </UCard>

        <!-- Certificate cards skeleton -->
        <div>
          <USkeleton class="h-8 w-48 mb-6" />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard
              v-for="i in 6"
              :key="i"
              class="p-5 sm:p-6 ring-1 ring-gray-700/50 bg-gray-800"
            >
              <div class="space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <USkeleton class="h-4 w-16 mb-2" />
                    <USkeleton class="h-6 w-40" />
                  </div>
                  <USkeleton class="h-6 w-16" />
                </div>
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-2 w-full" />
                <USkeleton class="h-10 w-full" />
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <!--
        Main Content (Loaded)
        ======================
        Show actual content when loaded
      -->
      <div v-else>
        <!--
          Overall Progress Summary
          ========================
          Stats grid with completion metrics
        -->
        <UCard
          class="mb-8 p-6 ring-1 ring-gray-700/50 bg-gray-800"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Overall lessons stat -->
            <div>
              <div class="text-sm text-gray-400 mb-1">
                Overall Progress
              </div>
              <div class="text-2xl font-bold text-gray-100">
                {{ completedLessons }}/{{ totalLessons }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ overallPercentage }}% Complete
              </div>
            </div>

            <!-- Phases completed stat -->
            <div>
              <div class="text-sm text-gray-400 mb-1">
                Phases Completed
              </div>
              <div class="text-2xl font-bold text-gray-100">
                {{ phasesCompleted }}/10
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ 10 - phasesCompleted }} Remaining
              </div>
            </div>

            <!-- Progress visualization -->
            <div class="flex items-center justify-center md:justify-end">
              <div class="relative w-24 h-24">
                <!-- Progress ring (simplified visual - would use ProgressRing component in real implementation) -->
                <svg class="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    class="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="`${overallPercentage * 2.51} 251`"
                    class="text-indigo-500 transition-all duration-500"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg font-bold text-gray-100">{{ overallPercentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!--
        Course Completion Certificate Section
        ======================================
        Prominent display when unlocked, locked state otherwise
      -->
        <UCard
          v-if="isCourseCertificateUnlocked"
          class="mb-8 border-2 border-amber-500/30 p-6 ring-0 bg-gradient-to-br from-amber-900/20 to-amber-800/10"
        >
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <UIcon
                  name="i-lucide-trophy"
                  class="h-8 w-8 text-amber-400"
                />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-amber-400 mb-1">
                DevOps Master Certificate
              </h3>
              <p class="text-gray-300">
                Congratulations! You've completed the entire DevOps course.
              </p>
            </div>
            <div class="flex-shrink-0">
              <UButton
                label="View Certificate"
                icon="i-lucide-award"
                color="warning"
                size="lg"
                class="cursor-pointer"
                @click="handleViewCourseCertificate"
              />
            </div>
          </div>
        </UCard>

        <div
          v-else
          class="mb-8 text-center py-6 text-gray-500"
        >
          <UIcon
            name="i-lucide-lock"
            class="h-8 w-8 mx-auto mb-2 opacity-50"
          />
          <p>Complete all {{ 10 - phasesCompleted }} remaining phases to unlock the Master Certificate</p>
        </div>

        <!--
        Empty State (No Progress)
        ==========================
        Show encouraging message for new users with no progress
      -->
        <UCard
          v-if="completedLessons === 0"
          class="mb-8 text-center p-12 ring-1 ring-gray-700/50 bg-gray-800"
        >
          <div class="space-y-4">
            <div class="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center">
              <UIcon
                name="i-lucide-graduation-cap"
                class="h-10 w-10 text-indigo-400"
              />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-100 mb-2">
                Start Your DevOps Journey
              </h3>
              <p class="text-gray-400 max-w-md mx-auto">
                Complete lessons to earn certificates for each phase. Start learning now to unlock your first certificate!
              </p>
            </div>
            <UButton
              label="Start Learning"
              icon="i-lucide-rocket"
              color="primary"
              size="lg"
              class="cursor-pointer"
              to="/"
            />
          </div>
        </UCard>

        <!--
        Phase Certificates Grid
        ========================
        Grid of certificate cards for all 10 phases
      -->
        <div
          v-else
          class="mb-4"
        >
          <h2 class="text-2xl font-bold text-gray-100 mb-6">
            Phase Certificates
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CertificateCard
              v-for="status in certificateStatuses"
              :key="status.phaseSlug"
              :status="status"
              @view-certificate="handleViewPhaseCertificate(status.phaseSlug)"
            />
          </div>
        </div>
      </div>
      <!-- End of v-else for loaded content -->

      <!--
        Certificate Preview Modal
        =========================
        Modal displaying certificate preview with download button
      -->
      <UModal
        v-model:open="isCertificateModalOpen"
        title="Certificate Preview"
        class="max-w-4xl"
      >
        <template #body>
          <!-- Certificate preview content -->
          <div
            ref="certificatePreviewRef"
            class="bg-gray-900 rounded-lg p-8 text-center"
          >
            <div
              v-if="viewingCertificate"
              class="space-y-4"
            >
              <!-- Certificate preview display -->
              <div class="text-4xl font-bold text-amber-400 mb-4">
                <UIcon
                  name="i-lucide-award"
                  class="h-16 w-16 mx-auto mb-4"
                />
                {{
                  viewingCertificateType === 'course'
                    ? 'DevOps Master Certificate'
                    : `Phase ${'phaseNumber' in viewingCertificate ? viewingCertificate.phaseNumber : ''} Certificate`
                }}
              </div>
              <div class="text-xl text-gray-300">
                {{ viewingCertificate.userName }}
              </div>
              <div class="text-gray-400">
                Certificate ID: {{ viewingCertificate.certificateId }}
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              label="Close"
              color="neutral"
              variant="outline"
              class="cursor-pointer"
              @click="isCertificateModalOpen = false"
            />
            <CertificateDownloadButton
              :certificate-ref="certificatePreviewRef"
              :filename="pdfFilename"
              @download:complete="isCertificateModalOpen = false"
            />
          </div>
        </template>
      </UModal>

      <!--
        Name Input Modal
        ================
        Modal for entering/editing user name
      -->
      <NameInputModal
        v-model:open="isNameModalOpen"
        :initial-name="getUserName() || ''"
        @save="handleNameSave"
      />
    </div>
  </div>
</template>
