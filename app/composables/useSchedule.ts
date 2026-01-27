/**
 * useSchedule Composable
 * =======================
 * Manages study schedule configuration and projected completion date calculations.
 *
 * Features:
 * ---------
 * - Per-roadmap schedule management (create, read, update, delete)
 * - Projected completion date calculations for roadmaps and phases
 * - Date formatting for display
 * - localStorage persistence (integrated with useProgress)
 * - SSR-safe initialization
 *
 * Data Structure:
 * ---------------
 * Schedules are stored within RoadmapProgress in localStorage:
 * {
 *   roadmaps: {
 *     [roadmapId]: {
 *       ...existing fields,
 *       schedule?: {
 *         startDate: "2026-01-27",
 *         studyDaysPerWeek: 6
 *       }
 *     }
 *   }
 * }
 *
 * Usage:
 * ------
 * ```typescript
 * const {
 *   hasSchedule,
 *   getSchedule,
 *   setSchedule,
 *   removeSchedule,
 *   getProjectedRoadmapCompletion,
 *   getProjectedPhaseCompletion,
 *   formatProjectedDate
 * } = useSchedule()
 *
 * // Check if schedule exists
 * if (hasSchedule('fullstack')) {
 *   // Get completion date
 *   const date = getProjectedRoadmapCompletion('fullstack')
 *   const formatted = formatProjectedDate(date)
 * }
 * ```
 */

import type { StudySchedule, MultiRoadmapProgress } from '~/data/types'
import { getRoadmapById } from '~/data/roadmaps'

// =============================================================================
// CONSTANTS
// =============================================================================

/** localStorage key for progress data */
const STORAGE_KEY = 'devops-lms-progress'

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useSchedule() {
  // Access progress state directly (writable) instead of through useProgress (readonly)
  const progress = useState<MultiRoadmapProgress>('user-progress', () => {
    return {
      version: 2,
      roadmaps: {},
      globalSettings: {}
    }
  })

  // Get progress composable for completion counts
  const progressComposable = useProgress()

  // ===========================================================================
  // STORAGE HELPER
  // ===========================================================================

  /**
   * Save progress to localStorage
   * This mirrors the internal saveToStorage from useProgress
   */
  function saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
    } catch (e) {
      console.warn('Failed to save schedule to localStorage', e)
    }
  }

  // ===========================================================================
  // SCHEDULE MANAGEMENT
  // ===========================================================================

  /**
   * Check if a roadmap has a schedule configured
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   * @returns True if the roadmap has a schedule, false otherwise
   */
  function hasSchedule(roadmapId: string): boolean {
    const roadmapProgress = progress.value.roadmaps[roadmapId]
    return !!roadmapProgress?.schedule
  }

  /**
   * Get the schedule for a roadmap
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   * @returns The schedule object or null if not configured
   */
  function getSchedule(roadmapId: string): StudySchedule | null {
    const roadmapProgress = progress.value.roadmaps[roadmapId]
    return roadmapProgress?.schedule ?? null
  }

  /**
   * Set or update the schedule for a roadmap
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   * @param schedule - The schedule configuration with startDate and studyDaysPerWeek
   */
  function setSchedule(roadmapId: string, schedule: StudySchedule): void {
    // Ensure roadmap progress exists
    if (!progress.value.roadmaps[roadmapId]) {
      progress.value.roadmaps[roadmapId] = {
        startedAt: new Date().toISOString(),
        phases: {}
      }
    }

    // Set the schedule
    progress.value.roadmaps[roadmapId].schedule = schedule

    // Persist to localStorage
    saveToStorage()
  }

  /**
   * Remove the schedule for a roadmap
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   */
  function removeSchedule(roadmapId: string): void {
    const roadmapProgress = progress.value.roadmaps[roadmapId]
    if (roadmapProgress?.schedule) {
      delete roadmapProgress.schedule
      saveToStorage()
    }
  }

  // ===========================================================================
  // DATE CALCULATION HELPERS
  // ===========================================================================

  /**
   * Calculate calendar days from topic position
   * Accounts for study days per week (skip days on non-study days)
   *
   * For N topics at D study days/week:
   * - full_weeks = floor((N-1) / D) - how many complete weeks of studying
   * - remaining = (N-1) % D - remaining study days after full weeks
   * - calendar_days = full_weeks * 7 + remaining
   *
   * Example: 4 topics, 6 days/week
   * - Topic 1 = day 0 (start date)
   * - Topic 4 = floor(3/6)*7 + 3%6 = 0 + 3 = day 3
   *
   * @param topicPosition - 1-indexed position of the topic
   * @param studyDaysPerWeek - Number of study days per week (1-7)
   * @returns Number of calendar days from start date
   */
  function calculateCalendarDays(topicPosition: number, studyDaysPerWeek: number): number {
    if (topicPosition <= 1) return 0

    const studyDaysNeeded = topicPosition - 1 // Days of studying after topic 1
    const fullWeeks = Math.floor(studyDaysNeeded / studyDaysPerWeek)
    const remainingStudyDays = studyDaysNeeded % studyDaysPerWeek

    return fullWeeks * 7 + remainingStudyDays
  }

  /**
   * Calculate completion date based on topic count and study pace
   * Uses position-based formula accounting for study days per week
   *
   * @param startDate - ISO date string (YYYY-MM-DD)
   * @param topicCount - Total number of topics to complete
   * @param studyDaysPerWeek - Number of days per week dedicated to studying (1-7)
   * @returns Projected completion date or null if invalid input
   */
  function calculateCompletion(startDate: string, topicCount: number, studyDaysPerWeek: number): Date | null {
    if (!startDate || topicCount <= 0 || studyDaysPerWeek < 1 || studyDaysPerWeek > 7) {
      return null
    }

    try {
      // Parse start date (add T00:00:00 to prevent timezone shifts)
      const start = new Date(startDate + 'T00:00:00')

      // Calculate calendar days for the last topic position
      const daysToAdd = calculateCalendarDays(topicCount, studyDaysPerWeek)

      // Add days to start date
      const result = new Date(start)
      result.setDate(result.getDate() + daysToAdd)
      return result
    } catch {
      return null
    }
  }

  // ===========================================================================
  // PROJECTED DATE CALCULATIONS
  // ===========================================================================

  /**
   * Get the effective base date for calculations
   * Uses the later of startDate or today (can't schedule in the past)
   */
  function getEffectiveBaseDate(startDate: string): string {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]!
    const start = new Date(startDate + 'T00:00:00')
    const todayDate = new Date(todayString + 'T00:00:00')

    return start >= todayDate ? startDate : todayString
  }

  /**
   * Get projected completion date for entire roadmap
   * Dynamically calculates based on remaining uncompleted topics.
   * Completing topics out of order shifts remaining dates earlier.
   *
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   * @returns Projected completion date or null if no schedule configured
   */
  function getProjectedRoadmapCompletion(roadmapId: string): Date | null {
    const schedule = getSchedule(roadmapId)
    if (!schedule) return null

    // Get roadmap data
    const roadmap = getRoadmapById(roadmapId)
    if (!roadmap) return null

    // Count remaining uncompleted topics
    let remainingTopics = 0
    for (const phase of roadmap.phases) {
      for (const topic of phase.topics) {
        const topicSlug = topic.slug || toSlug(topic.name)
        const completed = progressComposable.getCompletedCountForTopic(roadmapId, phase.slug, topicSlug)
        if (completed < topic.subtopics.length) {
          remainingTopics++
        }
      }
    }

    // If all topics are completed, return null
    if (remainingTopics <= 0) return null

    // Calculate from effective base date (max of startDate, today)
    const baseDate = getEffectiveBaseDate(schedule.startDate)
    return calculateCompletion(baseDate, remainingTopics, schedule.studyDaysPerWeek)
  }

  /**
   * Get projected completion date for a specific phase
   * Dynamically calculates based on remaining uncompleted topics up to this phase.
   * Completing topics out of order shifts remaining dates earlier.
   *
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   * @param phaseSlug - The phase slug (e.g., 'phase-1-sdlc')
   * @returns Projected completion date for this phase or null if no schedule
   */
  function getProjectedPhaseCompletion(roadmapId: string, phaseSlug: string): Date | null {
    const schedule = getSchedule(roadmapId)
    if (!schedule) return null

    // Get roadmap data
    const roadmap = getRoadmapById(roadmapId)
    if (!roadmap) return null

    // Count remaining uncompleted topics up to and including target phase
    let remainingTopicsUpToPhase = 0
    let foundTargetPhase = false
    let phaseIsComplete = true

    for (const phase of roadmap.phases) {
      for (const topic of phase.topics) {
        const topicSlug = topic.slug || toSlug(topic.name)
        const completed = progressComposable.getCompletedCountForTopic(roadmapId, phase.slug, topicSlug)
        if (completed < topic.subtopics.length) {
          remainingTopicsUpToPhase++
          if (phase.slug === phaseSlug) {
            phaseIsComplete = false
          }
        }
      }

      if (phase.slug === phaseSlug) {
        foundTargetPhase = true
        break
      }
    }

    if (!foundTargetPhase) return null

    // If phase is already complete, return null
    if (phaseIsComplete) return null

    // If no remaining topics, return null
    if (remainingTopicsUpToPhase <= 0) return null

    // Calculate from effective base date (max of startDate, today)
    const baseDate = getEffectiveBaseDate(schedule.startDate)
    return calculateCompletion(baseDate, remainingTopicsUpToPhase, schedule.studyDaysPerWeek)
  }

  // ===========================================================================
  // PER-TOPIC PROJECTED DATE CALCULATION
  // ===========================================================================

  /**
   * Get projected completion date for a specific topic
   * Dynamically calculates based on position among remaining uncompleted topics.
   * Completing topics out of order shifts remaining dates earlier.
   *
   * @param roadmapId - The roadmap identifier (e.g., 'devops', 'fullstack')
   * @param phaseSlug - The phase slug (e.g., 'phase-1-sdlc')
   * @param topicSlug - The topic slug (e.g., 'sdlc-models')
   * @returns Projected completion date for this topic or null if no schedule/already complete
   */
  function getProjectedTopicCompletion(roadmapId: string, phaseSlug: string, topicSlug: string): Date | null {
    const schedule = getSchedule(roadmapId)
    if (!schedule) return null

    // Get roadmap data
    const roadmap = getRoadmapById(roadmapId)
    if (!roadmap) return null

    // Find the position of this topic among UNCOMPLETED topics only (1-indexed)
    let position = 0
    let foundTarget = false
    let targetIsComplete = false

    for (const phase of roadmap.phases) {
      for (const topic of phase.topics) {
        const currentTopicSlug = topic.slug || toSlug(topic.name)
        const topicCompleted = progressComposable.getCompletedCountForTopic(roadmapId, phase.slug, currentTopicSlug)
        const topicTotal = topic.subtopics.length
        const isComplete = topicCompleted >= topicTotal

        // Check if this is our target topic
        if (phase.slug === phaseSlug && currentTopicSlug === topicSlug) {
          foundTarget = true
          targetIsComplete = isComplete
          if (!isComplete) {
            position++ // Include this topic in the count
          }
          break
        }

        // Only count uncompleted topics before the target
        if (!isComplete) {
          position++
        }
      }
      if (foundTarget) break
    }

    // If topic not found or already complete, return null
    if (!foundTarget || targetIsComplete) return null

    // Calculate date from effective base date using position-based formula
    const baseDate = getEffectiveBaseDate(schedule.startDate)
    const start = new Date(baseDate + 'T00:00:00')
    const daysToAdd = calculateCalendarDays(position, schedule.studyDaysPerWeek)

    const result = new Date(start)
    result.setDate(result.getDate() + daysToAdd)
    return result
  }

  /**
   * Helper: Convert name to slug
   */
  function toSlug(name: string): string {
    return name
      .replace(/\s*\([^)]*\)\s*/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // ===========================================================================
  // FORMATTING
  // ===========================================================================

  /**
   * Format a date for display using locale-aware formatting
   * Falls back to ISO format if locale formatting fails
   *
   * @param date - The date to format
   * @returns Formatted date string (e.g., "Apr 27, 2026")
   */
  function formatProjectedDate(date: Date): string {
    try {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      // Fallback to ISO date format
      return date.toISOString().split('T')[0]!
    }
  }

  // ===========================================================================
  // SSR-SAFE INITIALIZATION
  // ===========================================================================

  /**
   * SSR-safe initialization
   * The progress state is already initialized by useProgress, which handles
   * SSR-safe loading from localStorage in onMounted. We don't need additional
   * initialization here since we're working with the same progress object.
   *
   * Note: All schedule operations check `typeof window === 'undefined'` in
   * saveToStorage() to ensure SSR safety.
   */

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  return {
    hasSchedule,
    getSchedule,
    setSchedule,
    removeSchedule,
    getProjectedRoadmapCompletion,
    getProjectedPhaseCompletion,
    getProjectedTopicCompletion,
    formatProjectedDate
  }
}
