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
   * Add weeks to a date
   * @param date - The starting date
   * @param weeks - Number of weeks to add (can be fractional)
   * @returns New Date object with added weeks
   */
  function addWeeks(date: Date, weeks: number): Date {
    const result = new Date(date)
    const daysToAdd = Math.ceil(weeks * 7)
    result.setDate(result.getDate() + daysToAdd)
    return result
  }

  /**
   * Calculate completion date based on topic count and study pace
   * Uses the formula: topics / study days per week = weeks to complete
   * Pace baseline: 1 topic = 1 study day
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

      // Calculate weeks to complete: topicCount / studyDaysPerWeek
      const weeksToComplete = topicCount / studyDaysPerWeek

      // Add weeks to start date
      return addWeeks(start, weeksToComplete)
    } catch {
      return null
    }
  }

  // ===========================================================================
  // PROJECTED DATE CALCULATIONS
  // ===========================================================================

  /**
   * Get projected completion date for entire roadmap
   * Uses dynamic calculation based on remaining topics and today's date.
   * This automatically adjusts if the user falls behind or gets ahead of schedule.
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

    // Get completed count from progress
    const completedCount = progressComposable.getCompletedCount(roadmapId)
    const totalTopics = roadmap.stats.topicCount
    const remainingTopics = totalTopics - completedCount

    // If all topics are completed, return null (will show "Already complete")
    if (remainingTopics <= 0) return null

    // Calculate from TODAY, not the original start date
    // This makes dates shift automatically based on actual progress
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]! // YYYY-MM-DD (safe: ISO always has 'T')

    return calculateCompletion(todayString, remainingTopics, schedule.studyDaysPerWeek)
  }

  /**
   * Get projected completion date for a specific phase
   * Uses dynamic calculation based on remaining topics in all phases up to and including this one.
   * Automatically adjusts based on actual progress.
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

    // Calculate total topics and completed topics up to and including target phase
    let totalTopicsUpToPhase = 0
    let completedTopicsUpToPhase = 0
    let foundTargetPhase = false

    for (const phase of roadmap.phases) {
      const phaseTopicCount = phase.topics.length
      const phaseCompletedCount = progressComposable.getCompletedCountForPhase(roadmapId, phase.slug)

      totalTopicsUpToPhase += phaseTopicCount
      completedTopicsUpToPhase += phaseCompletedCount

      if (phase.slug === phaseSlug) {
        foundTargetPhase = true
        break
      }
    }

    if (!foundTargetPhase || totalTopicsUpToPhase === 0) return null

    // Calculate remaining topics for this phase
    const remainingTopics = totalTopicsUpToPhase - completedTopicsUpToPhase

    // If phase is already complete, return null (will show as completed)
    if (remainingTopics <= 0) return null

    // Calculate from TODAY, not the original start date
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]! // YYYY-MM-DD (safe: ISO always has 'T')

    return calculateCompletion(todayString, remainingTopics, schedule.studyDaysPerWeek)
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
    formatProjectedDate
  }
}
