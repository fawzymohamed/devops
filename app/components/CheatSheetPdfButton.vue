<!--
  CheatSheetPdfButton.vue - PDF Download Button Component
  =======================================================
  A button to download cheat sheets as PDF files.
  Shows loading state during generation and error handling.

  Props:
  - isGenerating: Whether PDF generation is in progress
  - error: Error message if generation failed

  Events:
  - download: Emitted when the download button is clicked

  Visual Structure:
  ┌───────────────────────────────┐
  │  📥 Download PDF              │  (normal state)
  └───────────────────────────────┘
  ┌───────────────────────────────┐
  │  ⏳ Generating...             │  (loading state)
  └───────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Component Props
 * ---------------
 */
defineProps<{
  isGenerating: boolean
  error: string | null
}>()

/**
 * Component Events
 * ----------------
 */
const emit = defineEmits<{
  download: []
}>()
</script>

<template>
  <div class="flex flex-col items-end gap-2">
    <!-- Download Button -->
    <UButton
      size="lg"
      color="primary"
      variant="soft"
      class="cursor-pointer"
      :loading="isGenerating"
      :disabled="isGenerating"
      loading-icon="i-lucide-loader-2"
      @click="emit('download')"
    >
      <UIcon
        v-if="!isGenerating"
        name="i-lucide-download"
        class="w-5 h-5 mr-2"
      />
      {{ isGenerating ? 'Generating...' : 'Download PDF' }}
    </UButton>

    <!-- Error Message -->
    <p
      v-if="error"
      class="text-sm text-red-400 flex items-center gap-1"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="w-4 h-4"
      />
      {{ error }}
    </p>
  </div>
</template>
