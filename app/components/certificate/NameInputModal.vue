<!--
  NameInputModal Component
  ========================
  Modal component for entering/editing the learner's name for certificates.
  Used when user first tries to view a certificate or wants to edit their name.

  Features:
  - Input validation (non-empty, trimmed)
  - Save button with loading state
  - Cancel button to dismiss
  - SSR-safe localStorage interaction

  Structure:
  ┌─────────────────────────────────────────┐
  │          Name Input Modal               │
  ├─────────────────────────────────────────┤
  │  Please enter your name                 │
  │  ┌─────────────────────────────────┐   │
  │  │ [Input Field]                   │   │
  │  └─────────────────────────────────┘   │
  │  [Cancel]              [Save]           │
  └─────────────────────────────────────────┘

  Usage:
  <NameInputModal
    v-model:open="isOpen"
    :initial-name="existingName"
    @save="handleNameSave"
  />
-->

<script setup lang="ts">
/**
 * Component Props
 * ---------------
 * @prop {boolean} open - Modal visibility state
 * @prop {string} initialName - Pre-populated name value (for editing)
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    initialName?: string
  }>(),
  {
    initialName: ''
  }
)

/**
 * Component Emits
 * ---------------
 * @emits update:open - Emit when modal open state changes
 * @emits save - Emit when user saves their name (payload: string)
 */
const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [name: string]
}>()

// =============================================================================
// STATE
// =============================================================================

/** Name input value (two-way bound) */
const nameInput = ref(props.initialName)

/** Validation error message */
const errorMessage = ref('')

/** Loading state during save operation */
const isLoading = ref(false)

// =============================================================================
// WATCH PROPS
// =============================================================================

/**
 * Watch for initialName changes to update input
 * Useful when modal is reopened with existing name
 */
watch(
  () => props.initialName,
  (newValue) => {
    nameInput.value = newValue
    errorMessage.value = ''
  }
)

/**
 * Watch for modal open state to reset validation
 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      nameInput.value = props.initialName
      errorMessage.value = ''
    }
  }
)

// =============================================================================
// ACTIONS
// =============================================================================

/**
 * Validate and save the name
 * Emits save event with trimmed name if valid
 */
function handleSave() {
  const trimmed = nameInput.value.trim()

  // Validate non-empty
  if (!trimmed) {
    errorMessage.value = 'Please enter your name'
    return
  }

  // Clear error and emit save event
  errorMessage.value = ''
  isLoading.value = true

  // Simulate async operation (localStorage is sync but provides better UX)
  setTimeout(() => {
    emit('save', trimmed)
    isLoading.value = false
    handleClose()
  }, 200)
}

/**
 * Close the modal
 * Emits update:open event to close
 */
function handleClose() {
  emit('update:open', false)
  errorMessage.value = ''
}

/**
 * Handle Enter key press in input
 * Triggers save action for better UX
 */
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !isLoading.value) {
    handleSave()
  }
}
</script>

<template>
  <!--
    Modal Container
    ===============
    Uses Nuxt UI UModal component for consistent modal behavior
  -->
  <UModal
    :model-value="open"
    @update:model-value="emit('update:open', $event)"
  >
    <!--
      Modal Content
      =============
      Card layout with header, body, and footer sections
    -->
    <UCard>
      <!-- Modal Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-100">
            {{ initialName ? 'Edit Your Name' : 'Enter Your Name' }}
          </h3>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            class="cursor-pointer"
            :disabled="isLoading"
            @click="handleClose"
          />
        </div>
      </template>

      <!--
        Modal Body
        ==========
        Name input field with validation error display
      -->
      <div class="space-y-4">
        <!-- Instruction text -->
        <p class="text-sm text-gray-400">
          Your name will appear on all certificates you earn.
        </p>

        <!-- Name input field -->
        <div>
          <UInput
            v-model="nameInput"
            placeholder="e.g., Jane Doe"
            size="lg"
            :disabled="isLoading"
            class="w-full"
            @keypress="handleKeyPress"
          />

          <!-- Validation error message -->
          <p
            v-if="errorMessage"
            class="mt-2 text-sm text-red-400"
          >
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!--
        Modal Footer
        ============
        Action buttons (Cancel and Save)
      -->
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <!-- Cancel button -->
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            :disabled="isLoading"
            @click="handleClose"
          />

          <!-- Save button -->
          <UButton
            label="Save"
            color="primary"
            class="cursor-pointer"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleSave"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
