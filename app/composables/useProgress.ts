/**
 * useProgress Composable
 * ======================
 * Manages user progress tracking throughout the LMS.
 * Persists data to localStorage for offline support.
 *
 * Features:
 * - Track lesson completion status
 * - Record quiz scores
 * - Calculate completion percentages
 * - Export/import progress data
 * - SSR-safe with client-side storage
 *
 * Usage:
 * ```typescript
 * const { progress, markComplete, isComplete, getCompletedCount } = useProgress()
 * ```
 */

import type { UserProgress, SubtopicProgress } from '~/data/types'

// =============================================================================
// CONSTANTS
// =============================================================================

/** localStorage key for progress data */
const STORAGE_KEY = 'devops-lms-progress'

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a path or subtopic ID represents a cheat sheet
 * Cheat sheets are named "cheat-sheet" and should be excluded from completion tracking
 * @param pathOrId - Path or subtopic ID to check
 * @returns Boolean indicating if this is a cheat sheet
 */
export function isCheatSheet(pathOrId: string): boolean {
  return pathOrId === 'cheat-sheet' || pathOrId.endsWith('/cheat-sheet')
}

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useProgress() {
  // ---------------------------------------------------------------------------
  // State - Uses useState for SSR-safe cross-component reactivity
  // ---------------------------------------------------------------------------

  const progress = useState<UserProgress>('user-progress', () => {
    return loadFromStorage() ?? createDefaultProgress()
  })

  // ---------------------------------------------------------------------------
  // Storage Functions
  // ---------------------------------------------------------------------------

  /**
   * Load progress from localStorage
   * @returns UserProgress or null if not found/invalid
   */
  function loadFromStorage(): UserProgress | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e)
      return null
    }
  }

  /**
   * Create default progress structure for new users
   * @returns Empty UserProgress object
   */
  function createDefaultProgress(): UserProgress {
    return {
      startedAt: new Date().toISOString(),
      phases: {}
    }
  }

  /**
   * Save current progress to localStorage
   */
  function saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e)
    }
  }

  // ---------------------------------------------------------------------------
  // Structure Helpers
  // ---------------------------------------------------------------------------

  /**
   * Ensure nested progress structure exists for a given path
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   */
  function ensureStructure(phaseId: string, topicId: string): void {
    if (!progress.value.phases[phaseId]) {
      progress.value.phases[phaseId] = { topics: {} }
    }
    if (!progress.value.phases[phaseId].topics[topicId]) {
      progress.value.phases[phaseId].topics[topicId] = { subtopics: {} }
    }
  }

  // ---------------------------------------------------------------------------
  // Progress Actions
  // ---------------------------------------------------------------------------

  /**
   * Mark a subtopic/lesson as complete
   * Cheat sheets are automatically excluded from progress tracking
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @param subtopicId - Subtopic identifier
   */
  function markComplete(phaseId: string, topicId: string, subtopicId: string): void {
    // Cheat sheets should not be tracked in progress
    if (isCheatSheet(subtopicId)) {
      return
    }

    ensureStructure(phaseId, topicId)

    const existing = progress.value.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    progress.value.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      quizScore: existing?.quizScore ?? null,
      quizCompletedAt: existing?.quizCompletedAt ?? null
    }

    // Update last accessed path
    progress.value.lastAccessed = `${phaseId}/${topicId}/${subtopicId}`

    saveToStorage()
  }

  /**
   * Mark a subtopic/lesson as incomplete
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @param subtopicId - Subtopic identifier
   */
  function markIncomplete(phaseId: string, topicId: string, subtopicId: string): void {
    ensureStructure(phaseId, topicId)

    const existing = progress.value.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    if (existing) {
      existing.completed = false
      existing.completedAt = null
      saveToStorage()
    }
  }

  /**
   * Record a quiz score for a subtopic
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @param subtopicId - Subtopic identifier
   * @param score - Quiz score (0-100)
   */
  function recordQuizScore(
    phaseId: string,
    topicId: string,
    subtopicId: string,
    score: number
  ): void {
    ensureStructure(phaseId, topicId)

    const subtopic = progress.value.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    if (subtopic) {
      // Only update if new score is higher or no previous score
      if (subtopic.quizScore === null || score > subtopic.quizScore) {
        subtopic.quizScore = score
        subtopic.quizCompletedAt = new Date().toISOString()
      }
    } else {
      progress.value.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId] = {
        completed: false,
        completedAt: null,
        quizScore: score,
        quizCompletedAt: new Date().toISOString()
      }
    }

    saveToStorage()
  }

  // ---------------------------------------------------------------------------
  // Progress Queries
  // ---------------------------------------------------------------------------

  /**
   * Check if a specific item is complete
   * @param phaseId - Phase identifier
   * @param topicId - Optional topic identifier
   * @param subtopicId - Optional subtopic identifier
   * @returns Boolean indicating completion status
   */
  function isComplete(phaseId: string, topicId?: string, subtopicId?: string): boolean {
    if (!topicId) {
      // Check if entire phase is complete (would need roadmap data)
      return false
    }

    if (!subtopicId) {
      // Check if entire topic is complete (would need roadmap data)
      return false
    }

    // Check specific subtopic
    return !!progress.value.phases[phaseId]?.topics[topicId]?.subtopics[subtopicId]?.completed
  }

  /**
   * Get progress data for a specific subtopic
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @param subtopicId - Subtopic identifier
   * @returns SubtopicProgress or undefined
   */
  function getSubtopicProgress(
    phaseId: string,
    topicId: string,
    subtopicId: string
  ): SubtopicProgress | undefined {
    return progress.value.phases[phaseId]?.topics[topicId]?.subtopics[subtopicId]
  }

  /**
   * Get total count of completed subtopics
   * @returns Number of completed subtopics
   */
  function getCompletedCount(): number {
    let count = 0

    for (const phase of Object.values(progress.value.phases)) {
      for (const topic of Object.values(phase.topics)) {
        for (const subtopic of Object.values(topic.subtopics)) {
          if (subtopic.completed) count++
        }
      }
    }

    return count
  }

  /**
   * Get completion percentage
   * @param totalLessons - Total number of lessons in the course
   * @returns Percentage (0-100)
   */
  function getCompletionPercentage(totalLessons: number): number {
    if (totalLessons === 0) return 0
    return Math.round((getCompletedCount() / totalLessons) * 100)
  }

  /**
   * Get average quiz score across all completed quizzes
   * @returns Average score (0-100) or 0 if no quizzes completed
   */
  function getAverageQuizScore(): number {
    let totalScore = 0
    let quizCount = 0

    for (const phase of Object.values(progress.value.phases)) {
      for (const topic of Object.values(phase.topics)) {
        for (const subtopic of Object.values(topic.subtopics)) {
          if (subtopic.quizScore !== null) {
            totalScore += subtopic.quizScore
            quizCount++
          }
        }
      }
    }

    return quizCount > 0 ? Math.round(totalScore / quizCount) : 0
  }

  // ---------------------------------------------------------------------------
  // Data Management
  // ---------------------------------------------------------------------------

  /**
   * Export progress data as JSON string
   * @returns JSON string of progress data
   */
  function exportProgress(): string {
    return JSON.stringify(progress.value, null, 2)
  }

  /**
   * Import progress data from JSON string
   * @param data - JSON string of progress data
   * @returns Boolean indicating success
   */
  function importProgress(data: string): boolean {
    try {
      const parsed = JSON.parse(data) as UserProgress
      progress.value = parsed
      saveToStorage()
      return true
    } catch {
      return false
    }
  }

  /**
   * Reset all progress data
   */
  function resetProgress(): void {
    progress.value = createDefaultProgress()
    saveToStorage()
  }

  // ---------------------------------------------------------------------------
  // Lifecycle - Load from storage on client mount
  // ---------------------------------------------------------------------------

  onMounted(() => {
    const stored = loadFromStorage()
    if (stored) {
      progress.value = stored
    }
  })

  // ---------------------------------------------------------------------------
  // Return Public API
  // ---------------------------------------------------------------------------

  return {
    // State (readonly to prevent external mutation)
    progress: readonly(progress),

    // Actions
    markComplete,
    markIncomplete,
    recordQuizScore,

    // Queries
    isComplete,
    getSubtopicProgress,
    getCompletedCount,
    getCompletionPercentage,
    getAverageQuizScore,

    // Data management
    exportProgress,
    importProgress,
    resetProgress
  }
}
