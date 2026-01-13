/**
 * Mark Phase Complete Script
 * ===========================
 * This script marks all lessons in a phase as completed in localStorage.
 *
 * Usage:
 * 1. Run this in browser console or as part of a Nuxt plugin
 * 2. Call: markPhaseAsComplete(1) to mark Phase 1 as complete
 * 3. Reload the page to see updates
 */

interface ProgressData {
  startedAt: number
  totalTimeSpent: number
  lastAccessed: string
  phases: {
    [phaseId: string]: {
      topics: {
        [topicId: string]: {
          subtopics: {
            [subtopicId: string]: {
              completed: boolean
              completedAt: number
              estimatedMinutes: number
              bestQuizScore?: number
            }
          }
        }
      }
    }
  }
}

/**
 * Phase 1 Structure for SDLC
 * Phase 1 has 4 topics with 21 total subtopics
 */
const PHASE_1_DATA = {
  1: {
    topics: {
      1: {
        // SDLC Models (5 subtopics)
        subtopics: {
          1: 'Waterfall Model',
          2: 'Agile Methodology',
          3: 'Scrum Framework',
          4: 'Kanban',
          5: 'DevOps as SDLC Evolution'
        }
      },
      2: {
        // SDLC Phases (6 subtopics)
        subtopics: {
          1: 'Requirements Gathering',
          2: 'Design & Architecture',
          3: 'Development/Coding',
          4: 'Testing & QA',
          5: 'Deployment',
          6: 'Maintenance & Operations'
        }
      },
      3: {
        // Development Workflows (5 subtopics)
        subtopics: {
          1: 'Feature Branching',
          2: 'Code Reviews',
          3: 'Pull Requests',
          4: 'Release Management',
          5: 'Hotfix Procedures'
        }
      },
      4: {
        // Project Management Basics (5 subtopics)
        subtopics: {
          1: 'User Stories',
          2: 'Sprint Planning',
          3: 'Backlog Management',
          4: 'Velocity & Estimation',
          5: 'Retrospectives'
        }
      }
    }
  }
}

/**
 * Mark Phase As Complete
 * ----------------------
 * Marks all subtopics in a phase as completed.
 *
 * @param phaseId - The phase number to mark as complete
 * @param estimatedMinutes - Minutes to add per lesson (default: 30)
 */
export function markPhaseAsComplete(phaseId: number = 1, estimatedMinutes: number = 30) {
  try {
    // Get existing progress or create new
    const progressKey = 'devops-lms-progress'
    const existingData = localStorage.getItem(progressKey)
    const progressData: ProgressData = existingData
      ? JSON.parse(existingData)
      : {
          startedAt: Date.now(),
          totalTimeSpent: 0,
          lastAccessed: new Date().toISOString(),
          phases: {}
        }

    // Get phase data
    const phaseTopics = PHASE_1_DATA[phaseId as keyof typeof PHASE_1_DATA]?.topics
    if (!phaseTopics) {
      console.error(`Phase ${phaseId} data not found`)
      return false
    }

    // Initialize phase if it doesn't exist
    if (!progressData.phases[phaseId]) {
      progressData.phases[phaseId] = { topics: {} }
    }

    let totalLessonsMarked = 0

    // Mark all subtopics as completed
    for (const [topicId, topicData] of Object.entries(phaseTopics)) {
      if (!progressData.phases[phaseId].topics[topicId]) {
        progressData.phases[phaseId].topics[topicId] = { subtopics: {} }
      }

      for (const subtopicId of Object.keys(topicData.subtopics)) {
        const subtopic = progressData.phases[phaseId].topics[topicId].subtopics[subtopicId]

        if (!subtopic) {
          progressData.phases[phaseId].topics[topicId].subtopics[subtopicId] = {
            completed: true,
            completedAt: Date.now(),
            estimatedMinutes: estimatedMinutes,
            bestQuizScore: 100
          }
          totalLessonsMarked++
        } else if (!subtopic.completed) {
          // Mark incomplete lessons as complete
          subtopic.completed = true
          subtopic.completedAt = Date.now()
          if (!subtopic.estimatedMinutes) {
            subtopic.estimatedMinutes = estimatedMinutes
          }
          totalLessonsMarked++
        }
      }
    }

    // Update last accessed and total time
    progressData.lastAccessed = new Date().toISOString()
    progressData.totalTimeSpent += totalLessonsMarked * estimatedMinutes

    // Save to localStorage
    localStorage.setItem(progressKey, JSON.stringify(progressData))

    console.log(`✓ Marked ${totalLessonsMarked} lessons in Phase ${phaseId} as complete`)
    console.log(`  Total time tracked: ${totalLessonsMarked * estimatedMinutes} minutes`)
    console.log('  Reload the page to see updates')

    return true
  } catch (error) {
    console.error('Error marking phase as complete:', error)
    return false
  }
}

/**
 * Reset Phase Progress
 * --------------------
 * Removes all completion data for a phase.
 */
export function resetPhaseProgress(phaseId: number = 1) {
  try {
    const progressKey = 'devops-lms-progress'
    const existingData = localStorage.getItem(progressKey)

    if (existingData) {
      const progressData: ProgressData = JSON.parse(existingData)
      if (progressData.phases[phaseId]) {
        const { [phaseId]: _removed, ...remainingPhases } = progressData.phases
        progressData.phases = remainingPhases
        localStorage.setItem(progressKey, JSON.stringify(progressData))
        console.log(`✓ Reset Phase ${phaseId} progress`)
        return true
      }
    }

    console.log(`Phase ${phaseId} has no progress to reset`)
    return false
  } catch (error) {
    console.error('Error resetting phase progress:', error)
    return false
  }
}
