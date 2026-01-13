/**
 * useProgress Composable
 * ======================
 * Manages user progress tracking throughout the LMS.
 * Persists data to localStorage for offline support.
 */

import type {
  MultiRoadmapProgress,
  RoadmapProgress,
  SubtopicProgress,
  UserProgress
} from '~/data/types'
import { getRoadmapById } from '~/data/roadmaps'

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
    .replace(/\s*\([^)]*\)\s*/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createDefaultRoadmapProgress(): RoadmapProgress {
  return {
    startedAt: new Date().toISOString(),
    phases: {}
  }
}

function createDefaultMultiProgress(): MultiRoadmapProgress {
  return {
    version: 2,
    roadmaps: {},
    globalSettings: {}
  }
}

function isMultiRoadmapProgress(value: unknown): value is MultiRoadmapProgress {
  if (!value || typeof value !== 'object') return false
  const candidate = value as MultiRoadmapProgress
  return candidate.version === 2 && typeof candidate.roadmaps === 'object'
}

function isLegacyProgress(value: unknown): value is UserProgress {
  if (!value || typeof value !== 'object') return false
  const candidate = value as UserProgress
  return typeof candidate.startedAt === 'string' && typeof candidate.phases === 'object'
}

function migrateProgressData(stored: unknown): MultiRoadmapProgress {
  if (isMultiRoadmapProgress(stored)) {
    return stored
  }

  if (isLegacyProgress(stored)) {
    return {
      version: 2,
      roadmaps: {
        devops: {
          startedAt: stored.startedAt,
          phases: stored.phases,
          lastAccessed: stored.lastAccessed,
          totalTimeSpent: stored.totalTimeSpent
        }
      },
      globalSettings: {
        userName: stored.userName
      }
    }
  }

  return createDefaultMultiProgress()
}

function getRoadmapPhases(roadmapId: string) {
  return getRoadmapById(roadmapId)?.phases ?? []
}

function countSubtopics(subtopics: string[]): number {
  return subtopics.filter(subtopic => !isCheatSheet(toSlug(subtopic))).length
}

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useProgress() {
  const progress = useState<MultiRoadmapProgress>('user-progress', () => {
    return loadFromStorage() ?? createDefaultMultiProgress()
  })

  // ---------------------------------------------------------------------------
  // Storage Functions
  // ---------------------------------------------------------------------------

  function loadFromStorage(): MultiRoadmapProgress | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      const parsed = JSON.parse(stored) as unknown
      const migrated = migrateProgressData(parsed)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e)
      return null
    }
  }

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

  function ensureRoadmapProgress(roadmapId: string): RoadmapProgress {
    if (!progress.value.roadmaps[roadmapId]) {
      progress.value.roadmaps[roadmapId] = createDefaultRoadmapProgress()
    }
    return progress.value.roadmaps[roadmapId]!
  }

  function ensureStructure(roadmapId: string, phaseId: string, topicId: string): void {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    if (!roadmapProgress.phases[phaseId]) {
      roadmapProgress.phases[phaseId] = { topics: {} }
    }
    if (!roadmapProgress.phases[phaseId].topics[topicId]) {
      roadmapProgress.phases[phaseId].topics[topicId] = { subtopics: {} }
    }
  }

  // ---------------------------------------------------------------------------
  // Roadmap Data Helpers
  // ---------------------------------------------------------------------------

  function getTotalLessonCount(roadmapId: string): number {
    return getRoadmapPhases(roadmapId).reduce((acc, phase) => {
      return acc + phase.topics.reduce((topicAcc, topic) => {
        return topicAcc + countSubtopics(topic.subtopics)
      }, 0)
    }, 0)
  }

  function getPhaseSubtopicCount(roadmapId: string, phaseSlug: string): number {
    const phase = getRoadmapPhases(roadmapId).find(p => p.slug === phaseSlug)
    if (!phase) return 0
    return phase.topics.reduce((acc, topic) => acc + countSubtopics(topic.subtopics), 0)
  }

  function getTopicSubtopicCount(roadmapId: string, phaseSlug: string, topicSlug: string): number {
    const phase = getRoadmapPhases(roadmapId).find(p => p.slug === phaseSlug)
    if (!phase) return 0
    const topic = phase.topics.find(t => t.slug === topicSlug || toSlug(t.name) === topicSlug)
    return topic ? countSubtopics(topic.subtopics) : 0
  }

  // ---------------------------------------------------------------------------
  // Progress Actions
  // ---------------------------------------------------------------------------

  function markComplete(
    roadmapId: string,
    phaseId: string,
    topicId: string,
    subtopicId: string,
    estimatedMinutes?: number
  ): void {
    if (isCheatSheet(subtopicId)) {
      return
    }

    ensureStructure(roadmapId, phaseId, topicId)

    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    const existing = roadmapProgress.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    if (!existing?.completed && estimatedMinutes && estimatedMinutes > 0) {
      roadmapProgress.totalTimeSpent = (roadmapProgress.totalTimeSpent ?? 0) + estimatedMinutes
    }

    roadmapProgress.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      quizScore: existing?.quizScore ?? null,
      quizCompletedAt: existing?.quizCompletedAt ?? null
    }

    roadmapProgress.lastAccessed = `${phaseId}/${topicId}/${subtopicId}`

    saveToStorage()
  }

  function markIncomplete(
    roadmapId: string,
    phaseId: string,
    topicId: string,
    subtopicId: string
  ): void {
    ensureStructure(roadmapId, phaseId, topicId)

    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    const existing = roadmapProgress.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    if (existing) {
      existing.completed = false
      existing.completedAt = null
      saveToStorage()
    }
  }

  function recordQuizScore(
    roadmapId: string,
    phaseId: string,
    topicId: string,
    subtopicId: string,
    score: number
  ): void {
    ensureStructure(roadmapId, phaseId, topicId)

    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    const subtopic = roadmapProgress.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId]

    if (subtopic) {
      if (subtopic.quizScore === null || score > subtopic.quizScore) {
        subtopic.quizScore = score
        subtopic.quizCompletedAt = new Date().toISOString()
      }
    } else {
      roadmapProgress.phases[phaseId]!.topics[topicId]!.subtopics[subtopicId] = {
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

  function isComplete(
    roadmapId: string,
    phaseId: string,
    topicId?: string,
    subtopicId?: string
  ): boolean {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)

    if (subtopicId && topicId) {
      return !!roadmapProgress.phases[phaseId]?.topics[topicId]?.subtopics[subtopicId]?.completed
    }

    if (topicId) {
      const total = getTopicSubtopicCount(roadmapId, phaseId, topicId)
      if (total === 0) return false
      const completed = getCompletedCountForTopic(roadmapId, phaseId, topicId)
      return completed >= total
    }

    const total = getPhaseSubtopicCount(roadmapId, phaseId)
    if (total === 0) return false
    const completed = getCompletedCountForPhase(roadmapId, phaseId)
    return completed >= total
  }

  function getSubtopicProgress(
    roadmapId: string,
    phaseId: string,
    topicId: string,
    subtopicId: string
  ): SubtopicProgress | undefined {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    return roadmapProgress.phases[phaseId]?.topics[topicId]?.subtopics[subtopicId]
  }

  function getCompletedCount(roadmapId: string): number {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    let count = 0

    for (const phase of Object.values(roadmapProgress.phases)) {
      for (const topic of Object.values(phase.topics)) {
        for (const subtopic of Object.values(topic.subtopics)) {
          if (subtopic.completed) count++
        }
      }
    }

    return count
  }

  function getCompletionPercentage(roadmapId: string): number {
    const totalLessons = getTotalLessonCount(roadmapId)
    if (totalLessons === 0) return 0
    return Math.round((getCompletedCount(roadmapId) / totalLessons) * 100)
  }

  function getAverageQuizScore(roadmapId: string): number {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    let totalScore = 0
    let quizCount = 0

    for (const phase of Object.values(roadmapProgress.phases)) {
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

  function getCompletedCountForPhase(roadmapId: string, phaseId: string): number {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    const phaseProgress = roadmapProgress.phases[phaseId]
    if (!phaseProgress) return 0

    let count = 0
    for (const topic of Object.values(phaseProgress.topics)) {
      for (const subtopic of Object.values(topic.subtopics)) {
        if (subtopic.completed) count++
      }
    }
    return count
  }

  function getCompletedCountForTopic(
    roadmapId: string,
    phaseId: string,
    topicId: string
  ): number {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    const topicProgress = roadmapProgress.phases[phaseId]?.topics[topicId]
    if (!topicProgress) return 0

    let count = 0
    for (const subtopic of Object.values(topicProgress.subtopics)) {
      if (subtopic.completed) count++
    }
    return count
  }

  function getPhaseCompletionPercentage(roadmapId: string, phaseId: string): number {
    const total = getPhaseSubtopicCount(roadmapId, phaseId)
    if (total === 0) return 0
    return Math.round((getCompletedCountForPhase(roadmapId, phaseId) / total) * 100)
  }

  function getTopicCompletionPercentage(
    roadmapId: string,
    phaseId: string,
    topicId: string
  ): number {
    const total = getTopicSubtopicCount(roadmapId, phaseId, topicId)
    if (total === 0) return 0
    return Math.round((getCompletedCountForTopic(roadmapId, phaseId, topicId) / total) * 100)
  }

  // ---------------------------------------------------------------------------
  // Time Tracking
  // ---------------------------------------------------------------------------

  function getTotalTimeSpentHours(roadmapId: string): number {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    const minutes = roadmapProgress.totalTimeSpent ?? 0
    return Math.round((minutes / 60) * 10) / 10
  }

  function getTotalTimeSpentMinutes(roadmapId: string): number {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    return roadmapProgress.totalTimeSpent ?? 0
  }

  // ---------------------------------------------------------------------------
  // Certificate Eligibility
  // ---------------------------------------------------------------------------

  function canGenerateCertificate(roadmapId: string): boolean {
    const total = getTotalLessonCount(roadmapId)
    const completed = getCompletedCount(roadmapId)
    return total > 0 && completed >= total
  }

  function getCertificateProgress(roadmapId: string): number {
    const total = getTotalLessonCount(roadmapId)
    if (total === 0) return 0
    return Math.round((getCompletedCount(roadmapId) / total) * 100)
  }

  // ---------------------------------------------------------------------------
  // Resume Learning
  // ---------------------------------------------------------------------------

  function getResumeLearningData(roadmapId: string): {
    path: string
    phaseId: string
    topicId: string
    subtopicId: string
  } | null {
    const roadmapProgress = ensureRoadmapProgress(roadmapId)
    if (!roadmapProgress.lastAccessed) return null

    const parts = roadmapProgress.lastAccessed.split('/')
    if (parts.length !== 3) return null

    const [phaseId, topicId, subtopicId] = parts
    if (!phaseId || !topicId || !subtopicId) return null

    return {
      path: `/${roadmapProgress.lastAccessed}`,
      phaseId,
      topicId,
      subtopicId
    }
  }

  // ---------------------------------------------------------------------------
  // Name Management
  // ---------------------------------------------------------------------------

  function setUserName(name: string): boolean {
    const trimmed = name.trim()
    if (!trimmed) return false

    progress.value.globalSettings = {
      ...(progress.value.globalSettings ?? {}),
      userName: trimmed
    }
    saveToStorage()
    return true
  }

  function getUserName(): string | undefined {
    return progress.value.globalSettings?.userName
  }

  function hasUserName(): boolean {
    const name = progress.value.globalSettings?.userName
    return !!name && name.trim().length > 0
  }

  // ---------------------------------------------------------------------------
  // Data Management
  // ---------------------------------------------------------------------------

  function exportProgress(): string {
    return JSON.stringify(progress.value, null, 2)
  }

  function importProgress(data: string): boolean {
    try {
      const parsed = JSON.parse(data) as unknown
      const migrated = migrateProgressData(parsed)
      progress.value = migrated
      saveToStorage()
      return true
    } catch {
      return false
    }
  }

  function resetProgress(): void {
    progress.value = createDefaultMultiProgress()
    saveToStorage()
  }

  function resetRoadmapProgress(roadmapId: string): void {
    progress.value.roadmaps[roadmapId] = createDefaultRoadmapProgress()
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
    progress: readonly(progress),

    markComplete,
    markIncomplete,
    recordQuizScore,

    isComplete,
    getSubtopicProgress,

    getCompletedCount,
    getCompletedCountForPhase,
    getCompletedCountForTopic,

    getCompletionPercentage,
    getPhaseCompletionPercentage,
    getTopicCompletionPercentage,
    getAverageQuizScore,

    getTotalLessonCount,
    getPhaseSubtopicCount,
    getTopicSubtopicCount,

    getTotalTimeSpentHours,
    getTotalTimeSpentMinutes,

    canGenerateCertificate,
    getCertificateProgress,

    getResumeLearningData,

    setUserName,
    getUserName,
    hasUserName,

    exportProgress,
    importProgress,
    resetProgress,
    resetRoadmapProgress
  }
}
