/**
 * useQuiz Composable
 * ==================
 * Manages quiz state and logic for lesson quizzes.
 * Handles question navigation, answer validation, and scoring.
 *
 * Features:
 * - Navigate through quiz questions
 * - Track user answers
 * - Calculate final score
 * - Support for single, multiple, and true-false questions
 *
 * Usage:
 * ```typescript
 * const quiz = useQuiz(quizData)
 * quiz.submitAnswer('Option A')
 * quiz.nextQuestion()
 * quiz.finishQuiz()
 * ```
 */

import type { Quiz, QuizQuestion, QuizAnswer } from '~/data/types'

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useQuiz(quiz: Ref<Quiz> | Quiz) {
  // ---------------------------------------------------------------------------
  // Normalize Input - Handle both ref and raw quiz data
  // ---------------------------------------------------------------------------

  const quizData = isRef(quiz) ? quiz : ref(quiz)

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  /** Current question index (0-based) */
  const currentIndex = ref(0)

  /** Array of user's answers */
  const answers = ref<QuizAnswer[]>([])

  /** Whether the quiz has been completed */
  const isComplete = ref(false)

  /** Final score percentage (0-100) */
  const score = ref(0)

  // ---------------------------------------------------------------------------
  // Computed Properties
  // ---------------------------------------------------------------------------

  /** Current question object */
  const currentQuestion = computed<QuizQuestion | undefined>(() =>
    quizData.value.questions[currentIndex.value]
  )

  /** Total number of questions */
  const totalQuestions = computed<number>(() =>
    quizData.value.questions.length
  )

  /** Whether current question is the last one */
  const isLastQuestion = computed<boolean>(() =>
    currentIndex.value === totalQuestions.value - 1
  )

  /** Whether current question is the first one */
  const isFirstQuestion = computed<boolean>(() =>
    currentIndex.value === 0
  )

  /** Whether the user passed the quiz */
  const passed = computed<boolean>(() =>
    score.value >= quizData.value.passingScore
  )

  /** Number of questions answered */
  const answeredCount = computed<number>(() =>
    answers.value.filter(a => a !== undefined).length
  )

  // ---------------------------------------------------------------------------
  // Answer Management
  // ---------------------------------------------------------------------------

  /**
   * Submit an answer for the current question
   * @param selected - The user's selected answer
   */
  function submitAnswer(selected: string | string[] | boolean): void {
    answers.value[currentIndex.value] = {
      questionIndex: currentIndex.value,
      selected
    }
  }

  /**
   * Get a previously submitted answer for a question
   * @param index - Question index
   * @returns QuizAnswer or undefined
   */
  function getAnswerForQuestion(index: number): QuizAnswer | undefined {
    return answers.value[index]
  }

  /**
   * Check if a specific question has been answered
   * @param index - Question index
   * @returns Boolean indicating if answered
   */
  function isQuestionAnswered(index: number): boolean {
    return answers.value[index] !== undefined
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Move to the next question
   */
  function nextQuestion(): void {
    if (!isLastQuestion.value) {
      currentIndex.value++
    }
  }

  /**
   * Move to the previous question
   */
  function previousQuestion(): void {
    if (!isFirstQuestion.value) {
      currentIndex.value--
    }
  }

  /**
   * Jump to a specific question
   * @param index - Target question index
   */
  function goToQuestion(index: number): void {
    if (index >= 0 && index < totalQuestions.value) {
      currentIndex.value = index
    }
  }

  // ---------------------------------------------------------------------------
  // Scoring
  // ---------------------------------------------------------------------------

  /**
   * Check if an answer is correct for a given question
   * @param answer - The user's answer
   * @param question - The quiz question
   * @returns Boolean indicating correctness
   */
  function isAnswerCorrect(answer: QuizAnswer, question: QuizQuestion): boolean {
    if (!answer) return false

    switch (question.type) {
      case 'single':
        return answer.selected === question.correctAnswer

      case 'multiple': {
        const selected = answer.selected as string[]
        const correct = question.correctAnswers!

        // All selected must match exactly (same items, same count)
        return (
          selected.length === correct.length
          && selected.every(s => correct.includes(s))
        )
      }

      case 'true-false':
        return answer.selected === question.correctAnswer

      default:
        return false
    }
  }

  /**
   * Calculate the final quiz score
   * @returns Score as percentage (0-100)
   */
  function calculateScore(): number {
    let correctCount = 0

    answers.value.forEach((answer, index) => {
      const question = quizData.value.questions[index]
      if (answer && question && isAnswerCorrect(answer, question)) {
        correctCount++
      }
    })

    return Math.round((correctCount / totalQuestions.value) * 100)
  }

  /**
   * Get detailed results for each question
   * @returns Array of result objects with correctness info
   */
  function getDetailedResults(): Array<{
    question: QuizQuestion
    answer: QuizAnswer | undefined
    isCorrect: boolean
  }> {
    return quizData.value.questions.map((question, index) => {
      const answer = answers.value[index]
      return {
        question,
        answer,
        isCorrect: answer ? isAnswerCorrect(answer, question) : false
      }
    })
  }

  // ---------------------------------------------------------------------------
  // Quiz Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Complete the quiz and calculate final score
   */
  function finishQuiz(): void {
    score.value = calculateScore()
    isComplete.value = true
  }

  /**
   * Reset the quiz to start fresh
   */
  function reset(): void {
    currentIndex.value = 0
    answers.value = []
    isComplete.value = false
    score.value = 0
  }

  // ---------------------------------------------------------------------------
  // Return Public API
  // ---------------------------------------------------------------------------

  return {
    // State (readonly to prevent external mutation)
    currentIndex: readonly(currentIndex),
    currentQuestion,
    totalQuestions,
    isLastQuestion,
    isFirstQuestion,
    answers: readonly(answers),
    answeredCount,
    isComplete: readonly(isComplete),
    score: readonly(score),
    passed,

    // Answer management
    submitAnswer,
    getAnswerForQuestion,
    isQuestionAnswered,

    // Navigation
    nextQuestion,
    previousQuestion,
    goToQuestion,

    // Scoring
    isAnswerCorrect,
    calculateScore,
    getDetailedResults,

    // Lifecycle
    finishQuiz,
    reset
  }
}
