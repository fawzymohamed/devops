<!--
  ScheduleSettings.vue - Schedule Configuration Component
  ========================================================
  Allows users to configure their study schedule with start date and study days per week.

  Features:
  - Date input for schedule start date
  - Number input for study days per week (1-7 validation)
  - Save and Remove schedule functionality
  - Pre-population of existing schedule
  - Form validation

  Props:
  - roadmapId: The roadmap identifier for this schedule

  Layout:
  ┌─────────────────────────────────────────────┐
  │  Study Schedule                             │
  ├─────────────────────────────────────────────┤
  │  Start Date: [__________]                   │
  │  Study Days/Week: [_]                       │
  │  [Save Schedule] [Remove Schedule]          │
  └─────────────────────────────────────────────┘
-->

<script setup lang="ts">
/**
 * Component Props
 * ---------------
 * @prop roadmapId - The roadmap this schedule applies to
 */
const props = defineProps<{
  roadmapId: string
}>()

// =============================================================================
// COMPOSABLES
// =============================================================================

const { hasSchedule, getSchedule, setSchedule, removeSchedule } = useSchedule()
const toast = useToast()

// =============================================================================
// STATE
// =============================================================================

const startDate = ref('')
const studyDaysPerWeek = ref(6)
const showValidationError = ref(false)
const validationMessage = ref('')
const isEditing = ref(false)

// =============================================================================
// COMPUTED
// =============================================================================

/**
 * Check if schedule exists for this roadmap
 */
const scheduleExists = computed(() => hasSchedule(props.roadmapId))

/**
 * Check if fields should be disabled
 */
const fieldsDisabled = computed(() => scheduleExists.value && !isEditing.value)

// =============================================================================
// LIFECYCLE
// =============================================================================

/**
 * Initialize form with existing schedule if available
 */
onMounted(() => {
  const existingSchedule = getSchedule(props.roadmapId)
  if (existingSchedule) {
    startDate.value = existingSchedule.startDate
    studyDaysPerWeek.value = existingSchedule.studyDaysPerWeek
  }
})

// =============================================================================
// METHODS
// =============================================================================

/**
 * Validate form inputs
 * @returns True if form is valid, false otherwise
 */
function validateForm(): boolean {
  showValidationError.value = false
  validationMessage.value = ''

  // Validate start date
  if (!startDate.value) {
    validationMessage.value = 'Please select a start date'
    showValidationError.value = true
    return false
  }

  // Validate study days per week (1-7)
  if (!studyDaysPerWeek.value || studyDaysPerWeek.value < 1 || studyDaysPerWeek.value > 7) {
    validationMessage.value = 'Study days per week must be between 1 and 7'
    showValidationError.value = true
    return false
  }

  return true
}

/**
 * Enable edit mode
 */
function handleEdit() {
  isEditing.value = true
}

/**
 * Cancel editing and revert to saved values
 */
function handleCancel() {
  const existingSchedule = getSchedule(props.roadmapId)
  if (existingSchedule) {
    startDate.value = existingSchedule.startDate
    studyDaysPerWeek.value = existingSchedule.studyDaysPerWeek
  }
  isEditing.value = false
  showValidationError.value = false
}

/**
 * Save schedule
 * Validates form and persists schedule to localStorage
 */
function handleSave() {
  if (!validateForm()) return

  // Save schedule using composable
  setSchedule(props.roadmapId, {
    startDate: startDate.value,
    studyDaysPerWeek: studyDaysPerWeek.value
  })

  // Show success feedback
  showValidationError.value = false
  isEditing.value = false

  toast.add({
    title: 'Schedule saved',
    description: 'Your study schedule has been saved successfully.',
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

/**
 * Remove schedule
 * Clears schedule from localStorage and resets form
 */
function handleRemove() {
  removeSchedule(props.roadmapId)

  // Reset form to defaults
  startDate.value = ''
  studyDaysPerWeek.value = 6
  showValidationError.value = false
  isEditing.value = false

  toast.add({
    title: 'Schedule removed',
    description: 'Your study schedule has been removed.',
    color: 'neutral',
    icon: 'i-lucide-trash-2'
  })
}
</script>

<template>
  <UCard class="mb-8 ring-1 ring-gray-700/50 bg-gray-800">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-100">
        Study Schedule
      </h2>
      <p class="text-sm text-gray-400 mt-1">
        Configure your study pace to see projected completion dates
      </p>
    </template>

    <div class="space-y-4">
      <!-- Start Date Input -->
      <div>
        <label
          for="start-date"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Start Date
        </label>
        <UInput
          id="start-date"
          v-model="startDate"
          type="date"
          size="lg"
          placeholder="YYYY-MM-DD"
          class="w-full md:w-64"
          :disabled="fieldsDisabled"
        />
        <p class="text-xs text-gray-400 mt-1">
          When do you plan to start (or when did you start)?
        </p>
      </div>

      <!-- Study Days Per Week Input -->
      <div>
        <label
          for="study-days"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Study Days Per Week
        </label>
        <UInput
          id="study-days"
          v-model.number="studyDaysPerWeek"
          type="number"
          min="1"
          max="7"
          size="lg"
          placeholder="6"
          class="w-full md:w-32"
          :disabled="fieldsDisabled"
        />
        <p class="text-xs text-gray-400 mt-1">
          How many days per week will you study? (1-7)
        </p>
      </div>

      <!-- Validation Error -->
      <div
        v-if="showValidationError"
        class="text-sm text-red-400"
      >
        {{ validationMessage }}
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3">
        <!-- Edit Mode: Show Save and Cancel -->
        <template v-if="isEditing || !scheduleExists">
          <UButton
            color="primary"
            size="lg"
            class="cursor-pointer"
            @click="handleSave"
          >
            <UIcon
              name="i-lucide-save"
              class="w-4 h-4 mr-2"
            />
            Save Schedule
          </UButton>

          <UButton
            v-if="scheduleExists"
            color="neutral"
            variant="outline"
            size="lg"
            class="cursor-pointer"
            @click="handleCancel"
          >
            <UIcon
              name="i-lucide-x"
              class="w-4 h-4 mr-2"
            />
            Cancel
          </UButton>
        </template>

        <!-- View Mode: Show Edit and Remove -->
        <template v-else>
          <UButton
            color="primary"
            variant="outline"
            size="lg"
            class="cursor-pointer"
            @click="handleEdit"
          >
            <UIcon
              name="i-lucide-pencil"
              class="w-4 h-4 mr-2"
            />
            Edit Schedule
          </UButton>

          <UButton
            color="error"
            variant="outline"
            size="lg"
            class="cursor-pointer"
            @click="handleRemove"
          >
            <UIcon
              name="i-lucide-trash-2"
              class="w-4 h-4 mr-2"
            />
            Remove Schedule
          </UButton>
        </template>
      </div>
    </div>
  </UCard>
</template>
