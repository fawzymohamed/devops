<!--
  QuizContainer.vue - Main Quiz Wrapper Component
  ================================================
  Manages the complete quiz experience including question navigation,
  answer submission, scoring, and results display.

  Features:
  - Progress indicator showing current question
  - Question navigation (previous/next)
  - Answer tracking and validation
  - Score calculation and pass/fail determination
  - Results review with explanations
  - Retry functionality

  Props:
  - quiz: Quiz object from lesson frontmatter

  Events:
  - complete: Emitted when quiz is finished (score, passed)

  Layout Structure:
  ┌─────────────────────────────────────────────────────────────┐
  │  Header: Quiz Title + Question X of Y                       │
  │  [████████████░░░░░░░░░░░░░░░░░░░░] Progress                │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Question Content (QuizQuestion component)                  │
  │  OR                                                         │
  │  Results Display (QuizResults component)                    │
  │                                                             │
  ├─────────────────────────────────────────────────────────────┤
  │  [← Previous]                              [Next →/Finish]  │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import type { Quiz } from '~/data/types'

// =============================================================================
// PROPS & EMITS
// =============================================================================

/**
 * Component Props
 * ---------------
 * @prop quiz - The quiz configuration from lesson frontmatter
 */
const props = defineProps<{
  quiz: Quiz
}>()

/**
 * Component Events
 * ----------------
 * @event complete - Emitted when quiz is finished with score and pass status
 */
const emit = defineEmits<{
  (e: 'complete', score: number, passed: boolean): void
}>()

// =============================================================================
// QUIZ STATE MANAGEMENT
// =============================================================================

/**
 * Use the quiz composable for state management
 * Provides question navigation, answer tracking, and scoring
 */
const {
  currentQuestion,
  currentIndex,
  totalQuestions,
  isLastQuestion,
  isFirstQuestion,
  isComplete,
  score,
  passed,
  answers,
  submitAnswer,
  nextQuestion,
  previousQuestion,
  getAnswerForQuestion,
  getDetailedResults,
  finishQuiz,
  reset
} = useQuiz(props.quiz)

// =============================================================================
// LOCAL STATE
// =============================================================================

/**
 * Track the selected answer for the current question
 * Supports string (single), string[] (multiple), or boolean (true-false)
 */
const selectedAnswer = ref<string | string[] | boolean | null>(null)

/**
 * Watch for question changes and restore previous answer if exists
 */
watch(currentIndex, (newIndex) => {
  const previous = getAnswerForQuestion(newIndex)
  selectedAnswer.value = previous?.selected ?? null
}, { immediate: true })

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Progress percentage for the progress bar
 */
const progressPercent = computed(() => {
  return ((currentIndex.value + 1) / totalQuestions.value) * 100
})

/**
 * Whether the next/finish button should be disabled
 */
const isNextDisabled = computed(() => {
  return selectedAnswer.value === null
})

// =============================================================================
// METHODS
// =============================================================================

/**
 * Handle Next/Finish Button Click
 * --------------------------------
 * Submit current answer and either advance or finish the quiz
 */
function handleNext() {
  if (selectedAnswer.value !== null) {
    submitAnswer(selectedAnswer.value)
  }

  if (isLastQuestion.value) {
    finishQuiz()
    emit('complete', score.value, passed.value)
  } else {
    nextQuestion()
  }
}

/**
 * Handle Previous Button Click
 * ----------------------------
 * Go back to the previous question
 */
function handlePrevious() {
  previousQuestion()
}

/**
 * Handle Retry Button Click
 * -------------------------
 * Reset the quiz to start fresh
 */
function handleRetry() {
  reset()
  selectedAnswer.value = null
}

/**
 * Get Answer Status for Results Review
 * -------------------------------------
 * @param index - Question index
 * @returns 'correct' | 'incorrect' | 'unanswered'
 */
function getAnswerStatus(index: number): 'correct' | 'incorrect' | 'unanswered' {
  const results = getDetailedResults()
  const result = results[index]

  if (!result?.answer) return 'unanswered'
  return result.isCorrect ? 'correct' : 'incorrect'
}

/**
 * Format Answer for Display
 * -------------------------
 * @param answer - The answer value
 * @returns Formatted string for display
 */
function formatAnswer(answer: string | readonly string[] | boolean | undefined): string {
  if (answer === undefined || answer === null) return 'Not answered'
  if (typeof answer === 'boolean') return answer ? 'True' : 'False'
  if (Array.isArray(answer)) return answer.join(', ')
  return String(answer)
}
</script>

<template>
  <UCard class="bg-gray-900/50 ring-1 ring-gray-700">
    <!--
      Quiz Header
      ===========
      Shows quiz title and progress indicator
    -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-help-circle"
            class="w-5 h-5 text-primary-500"
          />
          <h3 class="font-semibold text-gray-100">
            Knowledge Check
          </h3>
        </div>

        <UBadge
          v-if="!isComplete"
          variant="subtle"
          color="neutral"
        >
          Question {{ currentIndex + 1 }} of {{ totalQuestions }}
        </UBadge>

        <UBadge
          v-else
          :color="passed ? 'success' : 'error'"
          variant="subtle"
        >
          {{ passed ? 'Passed' : 'Not Passed' }}
        </UBadge>
      </div>

      <!-- Progress Bar -->
      <UProgress
        v-if="!isComplete"
        :value="progressPercent"
        color="primary"
        size="sm"
        class="mt-3"
      />
    </template>

    <!--
      Quiz Content
      ============
      Shows either the current question or the results
    -->
    <div class="min-h-[300px]">
      <!--
        Active Quiz: Question Display
        -----------------------------
        Shows the current question with answer options
      -->
      <div
        v-if="!isComplete && currentQuestion"
        class="space-y-6"
      >
        <!-- Question Text -->
        <h4 class="text-lg font-medium text-gray-100">
          {{ currentQuestion.question }}
        </h4>

        <!-- Single Choice Options -->
        <div
          v-if="currentQuestion.type === 'single'"
          class="space-y-3"
        >
          <div
            v-for="option in currentQuestion.options"
            :key="option"
            class="flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all"
            :class="[
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-gray-700 hover:border-gray-600'
            ]"
            @click="selectedAnswer = option"
          >
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              :class="selectedAnswer === option ? 'border-primary-500' : 'border-gray-600'"
            >
              <div
                v-if="selectedAnswer === option"
                class="w-2.5 h-2.5 rounded-full bg-primary-500"
              />
            </div>
            <span class="text-gray-200">{{ option }}</span>
          </div>
        </div>

        <!-- Multiple Choice Options -->
        <div
          v-else-if="currentQuestion.type === 'multiple'"
          class="space-y-3"
        >
          <p class="text-sm text-gray-400">
            Select all that apply
          </p>
          <div
            v-for="option in currentQuestion.options"
            :key="option"
            class="flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all"
            :class="[
              (selectedAnswer as string[] || []).includes(option)
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-gray-700 hover:border-gray-600'
            ]"
            @click="() => {
              const current = (selectedAnswer as string[]) || []
              const index = current.indexOf(option)
              if (index > -1) {
                selectedAnswer = current.filter(o => o !== option)
              }
              else {
                selectedAnswer = [...current, option]
              }
            }"
          >
            <div
              class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
              :class="(selectedAnswer as string[] || []).includes(option)
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-600'"
            >
              <UIcon
                v-if="(selectedAnswer as string[] || []).includes(option)"
                name="i-lucide-check"
                class="w-3 h-3 text-white"
              />
            </div>
            <span class="text-gray-200">{{ option }}</span>
          </div>
        </div>

        <!-- True/False Options -->
        <div
          v-else-if="currentQuestion.type === 'true-false'"
          class="flex gap-4"
        >
          <UButton
            :variant="selectedAnswer === true ? 'solid' : 'outline'"
            :color="selectedAnswer === true ? 'success' : 'neutral'"
            size="lg"
            class="flex-1 cursor-pointer"
            @click="selectedAnswer = true"
          >
            <UIcon
              name="i-lucide-check"
              class="w-5 h-5 mr-2"
            />
            True
          </UButton>
          <UButton
            :variant="selectedAnswer === false ? 'solid' : 'outline'"
            :color="selectedAnswer === false ? 'error' : 'neutral'"
            size="lg"
            class="flex-1 cursor-pointer"
            @click="selectedAnswer = false"
          >
            <UIcon
              name="i-lucide-x"
              class="w-5 h-5 mr-2"
            />
            False
          </UButton>
        </div>
      </div>

      <!--
        Quiz Results
        ============
        Shows score and question review after completion
      -->
      <div
        v-else-if="isComplete"
        class="space-y-6"
      >
        <!-- Score Display -->
        <div class="text-center py-6">
          <div
            class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
            :class="passed ? 'bg-green-500/20' : 'bg-red-500/20'"
          >
            <span
              class="text-3xl font-bold"
              :class="passed ? 'text-green-500' : 'text-red-500'"
            >
              {{ score }}%
            </span>
          </div>

          <h3 class="text-xl font-semibold mb-2">
            {{ passed ? 'Congratulations!' : 'Keep Learning!' }}
          </h3>

          <p class="text-gray-400">
            {{ passed
              ? 'You passed the quiz!'
              : `You need ${quiz.passingScore}% to pass. Review the material and try again!`
            }}
          </p>
        </div>

        <!-- Question Review -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-300">
            Review Your Answers
          </h4>

          <div
            v-for="(question, index) in quiz.questions"
            :key="index"
            class="p-4 rounded-lg border"
            :class="[
              getAnswerStatus(index) === 'correct'
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-red-500/50 bg-red-500/5'
            ]"
          >
            <div class="flex items-start gap-3">
              <UIcon
                :name="getAnswerStatus(index) === 'correct'
                  ? 'i-lucide-check-circle'
                  : 'i-lucide-x-circle'"
                class="w-5 h-5 flex-shrink-0 mt-0.5"
                :class="getAnswerStatus(index) === 'correct'
                  ? 'text-green-500'
                  : 'text-red-500'"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-200 mb-2">
                  {{ question.question }}
                </p>

                <p class="text-sm text-gray-400">
                  Your answer:
                  <span
                    :class="getAnswerStatus(index) === 'correct'
                      ? 'text-green-400'
                      : 'text-red-400'"
                  >
                    {{ formatAnswer(answers[index]?.selected) }}
                  </span>
                </p>

                <p
                  v-if="getAnswerStatus(index) !== 'correct'"
                  class="text-sm text-gray-400"
                >
                  Correct answer:
                  <span class="text-green-400">
                    {{ question.type === 'multiple'
                      ? question.correctAnswers?.join(', ')
                      : question.type === 'true-false'
                        ? (question.correctAnswer ? 'True' : 'False')
                        : question.correctAnswer
                    }}
                  </span>
                </p>

                <p class="text-sm text-gray-500 mt-2 italic">
                  {{ question.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
      Quiz Footer
      ===========
      Navigation buttons
    -->
    <template #footer>
      <div class="flex justify-between">
        <!-- Previous Button (during quiz) -->
        <UButton
          v-if="!isComplete"
          variant="outline"
          :disabled="isFirstQuestion"
          class="cursor-pointer"
          @click="handlePrevious"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="w-4 h-4 mr-2"
          />
          Previous
        </UButton>
        <div v-else />

        <!-- Next/Finish Button (during quiz) -->
        <UButton
          v-if="!isComplete"
          color="primary"
          :disabled="isNextDisabled"
          class="cursor-pointer"
          @click="handleNext"
        >
          {{ isLastQuestion ? 'Finish Quiz' : 'Next' }}
          <UIcon
            name="i-lucide-arrow-right"
            class="w-4 h-4 ml-2"
          />
        </UButton>

        <!-- Retry Button (after completion) -->
        <UButton
          v-else
          color="primary"
          class="cursor-pointer"
          @click="handleRetry"
        >
          <UIcon
            name="i-lucide-refresh-cw"
            class="w-4 h-4 mr-2"
          />
          Try Again
        </UButton>
      </div>
    </template>
  </UCard>
</template>
