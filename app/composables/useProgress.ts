/**
 * useProgress Composable
 * ======================
 * Manages user progress tracking throughout the LMS.
 * Persists data to localStorage for offline support.
 *
 * Features:
 * - Track lesson completion status
 * - Record quiz scores
 * - Calculate completion percentages (overall, per-phase, per-topic)
 * - Time tracking (accumulated from estimatedMinutes)
 * - Certificate eligibility checking
 * - Resume learning from last accessed lesson
 * - Export/import progress data
 * - SSR-safe with client-side storage
 *
 * Usage:
 * ```typescript
 * const {
 *   progress,
 *   markComplete,
 *   isComplete,
 *   getCompletedCount,
 *   getPhaseCompletionPercentage,
 *   canGenerateCertificate,
 *   getResumeLearningData
 * } = useProgress()
 * ```
 */

import type { UserProgress, SubtopicProgress } from '~/data/types'
import { roadmapData } from '~/data/roadmap'

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

/**
 * Convert a name to URL-friendly slug
 * @param name - Name to convert (e.g., "Waterfall Model")
 * @returns Slug (e.g., "waterfall-model")
 */
function toSlug(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*/g, '') // Remove parenthetical content like "(cd, ls, pwd)"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// =============================================================================
// ROADMAP DATA HELPERS
// =============================================================================

/**
 * Get total lesson count from roadmap data
 * Excludes cheat sheets from the count
 * @returns Total number of lessons across all phases
 */
export function getTotalLessonCount(): number {
  return roadmapData.reduce((acc, phase) => {
    return acc + phase.topics.reduce((topicAcc, topic) => {
      return topicAcc + topic.subtopics.length
    }, 0)
  }, 0)
}

/**
 * Get total subtopic count for a specific phase
 * @param phaseSlug - Phase slug (e.g., "phase-1-sdlc")
 * @returns Number of subtopics in the phase
 */
export function getPhaseSubtopicCount(phaseSlug: string): number {
  const phase = roadmapData.find(p => p.slug === phaseSlug)
  if (!phase) return 0
  return phase.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0)
}

/**
 * Get total subtopic count for a specific topic
 * @param phaseSlug - Phase slug
 * @param topicSlug - Topic slug
 * @returns Number of subtopics in the topic
 */
export function getTopicSubtopicCount(phaseSlug: string, topicSlug: string): number {
  const phase = roadmapData.find(p => p.slug === phaseSlug)
  if (!phase) return 0
  const topic = phase.topics.find(t => t.slug === topicSlug || toSlug(t.name) === topicSlug)
  return topic?.subtopics.length ?? 0
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
   * Mark a subtopic/lesson as complete with optional time tracking
   * Cheat sheets are automatically excluded from progress tracking
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @param subtopicId - Subtopic identifier
   * @param estimatedMinutes - Optional: estimated time for the lesson (from frontmatter)
   */
  function markComplete(
    phaseId: string,
    topicId: string,
    subtopicId: string,
    estimatedMinutes?: number
  ): void {
    // Cheat sheets should not be tracked in progress
    if (isCheatSheet(subtopicId)) {
      return
    }

    ensureStructure(phaseId, topicId)

    const existing = progress.value.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    // Only add time if marking complete for the first time
    if (!existing?.completed && estimatedMinutes && estimatedMinutes > 0) {
      progress.value.totalTimeSpent = (progress.value.totalTimeSpent ?? 0) + estimatedMinutes
    }

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
   * Now properly calculates phase/topic completion based on roadmap data
   * @param phaseId - Phase identifier (slug)
   * @param topicId - Optional topic identifier (slug)
   * @param subtopicId - Optional subtopic identifier (slug)
   * @returns Boolean indicating completion status
   */
  function isComplete(phaseId: string, topicId?: string, subtopicId?: string): boolean {
    // Check specific subtopic
    if (subtopicId && topicId) {
      return !!progress.value.phases[phaseId]?.topics[topicId]?.subtopics[subtopicId]?.completed
    }

    // Check if entire topic is complete
    if (topicId) {
      const total = getTopicSubtopicCount(phaseId, topicId)
      if (total === 0) return false
      const completed = getCompletedCountForTopic(phaseId, topicId)
      return completed >= total
    }

    // Check if entire phase is complete
    const total = getPhaseSubtopicCount(phaseId)
    if (total === 0) return false
    const completed = getCompletedCountForPhase(phaseId)
    return completed >= total
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
  // Phase/Topic Progress Helpers
  // ---------------------------------------------------------------------------

  /**
   * Get completed count for a specific phase
   * @param phaseId - Phase identifier (slug)
   * @returns Number of completed subtopics in the phase
   */
  function getCompletedCountForPhase(phaseId: string): number {
    const phaseProgress = progress.value.phases[phaseId]
    if (!phaseProgress) return 0

    let count = 0
    for (const topic of Object.values(phaseProgress.topics)) {
      for (const subtopic of Object.values(topic.subtopics)) {
        if (subtopic.completed) count++
      }
    }
    return count
  }

  /**
   * Get completed count for a specific topic
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @returns Number of completed subtopics in the topic
   */
  function getCompletedCountForTopic(phaseId: string, topicId: string): number {
    const topicProgress = progress.value.phases[phaseId]?.topics[topicId]
    if (!topicProgress) return 0

    let count = 0
    for (const subtopic of Object.values(topicProgress.subtopics)) {
      if (subtopic.completed) count++
    }
    return count
  }

  /**
   * Get completion percentage for a phase
   * @param phaseId - Phase identifier (slug)
   * @returns Percentage (0-100)
   */
  function getPhaseCompletionPercentage(phaseId: string): number {
    const total = getPhaseSubtopicCount(phaseId)
    if (total === 0) return 0
    return Math.round((getCompletedCountForPhase(phaseId) / total) * 100)
  }

  /**
   * Get completion percentage for a topic
   * @param phaseId - Phase identifier
   * @param topicId - Topic identifier
   * @returns Percentage (0-100)
   */
  function getTopicCompletionPercentage(phaseId: string, topicId: string): number {
    const total = getTopicSubtopicCount(phaseId, topicId)
    if (total === 0) return 0
    return Math.round((getCompletedCountForTopic(phaseId, topicId) / total) * 100)
  }

  // ---------------------------------------------------------------------------
  // Time Tracking
  // ---------------------------------------------------------------------------

  /**
   * Get total time spent in hours
   * Converts accumulated minutes to hours (rounded to 1 decimal)
   * @returns Hours spent learning
   */
  function getTotalTimeSpentHours(): number {
    const minutes = progress.value.totalTimeSpent ?? 0
    return Math.round((minutes / 60) * 10) / 10
  }

  /**
   * Get total time spent in minutes
   * @returns Minutes spent learning
   */
  function getTotalTimeSpentMinutes(): number {
    return progress.value.totalTimeSpent ?? 0
  }

  // ---------------------------------------------------------------------------
  // Certificate Eligibility
  // ---------------------------------------------------------------------------

  /**
   * Check if user can generate a certificate
   * Requires 100% completion of all lessons
   * @returns Boolean indicating certificate eligibility
   */
  function canGenerateCertificate(): boolean {
    const total = getTotalLessonCount()
    const completed = getCompletedCount()
    return total > 0 && completed >= total
  }

  /**
   * Get certificate readiness percentage
   * Shows progress toward certificate eligibility
   * @returns Percentage (0-100)
   */
  function getCertificateProgress(): number {
    const total = getTotalLessonCount()
    if (total === 0) return 0
    return Math.round((getCompletedCount() / total) * 100)
  }

  // ---------------------------------------------------------------------------
  // Resume Learning
  // ---------------------------------------------------------------------------

  /**
   * Get resume learning data from lastAccessed
   * Parses the stored path into component parts for navigation
   * @returns Object with path info or null if no last accessed
   */
  function getResumeLearningData(): {
    path: string
    phaseId: string
    topicId: string
    subtopicId: string
  } | null {
    if (!progress.value.lastAccessed) return null

    const parts = progress.value.lastAccessed.split('/')
    if (parts.length !== 3) return null

    const [phaseId, topicId, subtopicId] = parts
    if (!phaseId || !topicId || !subtopicId) return null

    return {
      path: `/${progress.value.lastAccessed}`,
      phaseId,
      topicId,
      subtopicId
    }
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

    // Queries - Subtopic level
    isComplete,
    getSubtopicProgress,

    // Queries - Aggregated counts
    getCompletedCount,
    getCompletedCountForPhase,
    getCompletedCountForTopic,

    // Queries - Percentages
    getCompletionPercentage,
    getPhaseCompletionPercentage,
    getTopicCompletionPercentage,
    getAverageQuizScore,

    // Roadmap data helpers
    getTotalLessonCount,
    getPhaseSubtopicCount,
    getTopicSubtopicCount,

    // Time tracking
    getTotalTimeSpentHours,
    getTotalTimeSpentMinutes,

    // Certificate eligibility
    canGenerateCertificate,
    getCertificateProgress,

    // Resume learning
    getResumeLearningData,

    // Data management
    exportProgress,
    importProgress,
    resetProgress
  }
}
