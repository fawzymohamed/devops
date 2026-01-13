<!--
  CertificateDownloadButton Component
  ====================================
  Download button for generating and downloading certificate PDFs.
  Integrates with useCertificate composable for PDF generation.

  Features:
  - Loading state during PDF generation
  - Error display with retry capability
  - Disabled state handling
  - Event emission for lifecycle tracking

  Structure:
  ┌─────────────────────────────────────┐
  │  [Download Icon] Download PDF       │  (Normal state)
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │  [Spinner] Generating...            │  (Loading state)
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │  Error: Failed to generate PDF      │  (Error state)
  │  [Try Again]                        │
  └─────────────────────────────────────┘

  Usage:
  <CertificateDownloadButton
    :certificate-ref="certificateElement"
    :filename="'DevOps-Phase1-Certificate-ABC123.pdf'"
    :disabled="false"
    @download:start="handleDownloadStart"
    @download:complete="handleDownloadComplete"
    @download:error="handleDownloadError"
  />
-->

<script setup lang="ts">
/**
 * Component Props
 * ---------------
 * @prop {HTMLElement | null} certificateRef - Reference to certificate DOM element to capture
 * @prop {string} filename - Filename for the downloaded PDF
 * @prop {boolean} disabled - Whether the button is disabled
 */
const props = withDefaults(
  defineProps<{
    certificateRef: HTMLElement | null
    filename: string
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

/**
 * Component Emits
 * ---------------
 * @emits download:start - Emitted when download process begins
 * @emits download:complete - Emitted when download completes successfully
 * @emits download:error - Emitted when download fails (payload: error message)
 */
const emit = defineEmits<{
  'download:start': []
  'download:complete': []
  'download:error': [error: string]
}>()

// =============================================================================
// COMPOSABLES
// =============================================================================

const { generatePDF, downloadPDF } = useCertificate()

// =============================================================================
// STATE
// =============================================================================

/** Loading state during PDF generation */
const isGenerating = ref(false)

/** Error message if generation fails */
const errorMessage = ref('')

// =============================================================================
// ACTIONS
// =============================================================================

/**
 * Handle download button click
 * Generates PDF from certificate element and triggers download
 */
async function handleDownload() {
  // Validate certificate ref
  if (!props.certificateRef) {
    errorMessage.value = 'Certificate element not found'
    emit('download:error', errorMessage.value)
    return
  }

  // Reset error state
  errorMessage.value = ''
  isGenerating.value = true
  emit('download:start')

  try {
    // Generate PDF from certificate element
    const pdfBlob = await generatePDF(props.certificateRef)

    if (!pdfBlob) {
      throw new Error('Failed to generate PDF')
    }

    // Trigger download
    downloadPDF(pdfBlob, props.filename)

    // Success
    emit('download:complete')
  } catch (error) {
    // Handle error
    const message = error instanceof Error ? error.message : 'Failed to generate PDF'
    errorMessage.value = message
    emit('download:error', message)
    console.error('Certificate download error:', error)
  } finally {
    isGenerating.value = false
  }
}

/**
 * Retry download after error
 * Clears error state and retries download
 */
function handleRetry() {
  errorMessage.value = ''
  handleDownload()
}
</script>

<template>
  <div class="space-y-3">
    <!--
      Download Button
      ===============
      Primary action button with loading state
    -->
    <UButton
      v-if="!errorMessage"
      :label="isGenerating ? 'Generating PDF...' : 'Download PDF'"
      :icon="isGenerating ? 'i-lucide-loader-2' : 'i-lucide-download'"
      :loading="isGenerating"
      :disabled="disabled || isGenerating"
      color="primary"
      size="lg"
      block
      class="cursor-pointer"
      @click="handleDownload"
    />

    <!--
      Error State
      ===========
      Display error message and retry button
    -->
    <div
      v-else
      class="space-y-2"
    >
      <!-- Error message -->
      <div class="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
        <div class="flex items-start gap-2">
          <UIcon
            name="i-lucide-alert-circle"
            class="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0"
          />
          <div class="flex-1">
            <p class="text-sm font-medium text-red-400">
              Download Failed
            </p>
            <p class="text-sm text-red-300/80 mt-1">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Retry button -->
      <UButton
        label="Try Again"
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="outline"
        size="lg"
        block
        class="cursor-pointer"
        @click="handleRetry"
      />
    </div>

    <!--
      Help Text
      =========
      Display helpful information about the PDF
    -->
    <p
      v-if="!errorMessage && !isGenerating"
      class="text-xs text-gray-500 text-center"
    >
      PDF will be downloaded as {{ filename }}
    </p>
  </div>
</template>
