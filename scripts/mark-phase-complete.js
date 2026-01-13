/**
 * Mark Phase As Complete - Browser Console Script
 * ================================================
 * Copy and paste this entire function into your browser console to mark Phase 1 as complete.
 *
 * Usage:
 * 1. Open DevTools (F12 or Cmd+Option+I)
 * 2. Go to Console tab
 * 3. Copy the markPhaseAsComplete function below
 * 4. Paste it in the console and press Enter
 * 5. Run: markPhaseAsComplete(1, 30)
 * 6. Refresh the page to see updates
 */

function markPhaseAsComplete(phaseId = 1, estimatedMinutes = 30) {
  try {
    // Phase 1 structure: 4 topics, 21 subtopics total
    const phase1Structure = {
      1: {
        // SDLC Models (5 subtopics)
        1: 5
      },
      2: {
        // SDLC Phases (6 subtopics)
        1: 6
      },
      3: {
        // Development Workflows (5 subtopics)
        1: 5
      },
      4: {
        // Project Management Basics (5 subtopics)
        1: 5
      }
    }

    const progressKey = 'devops-lms-progress'
    const existingData = localStorage.getItem(progressKey)
    const progressData = existingData
      ? JSON.parse(existingData)
      : {
          startedAt: Date.now(),
          totalTimeSpent: 0,
          lastAccessed: new Date().toISOString(),
          phases: {}
        }

    // Initialize phase if needed
    if (!progressData.phases[phaseId]) {
      progressData.phases[phaseId] = { topics: {} }
    }

    let totalMarked = 0

    // Mark all subtopics as complete
    for (const [topicId, subtopicCount] of Object.entries(phase1Structure)) {
      if (!progressData.phases[phaseId].topics[topicId]) {
        progressData.phases[phaseId].topics[topicId] = { subtopics: {} }
      }

      for (let i = 1; i <= subtopicCount; i++) {
        progressData.phases[phaseId].topics[topicId].subtopics[i] = {
          completed: true,
          completedAt: Date.now(),
          estimatedMinutes: estimatedMinutes,
          bestQuizScore: 100
        }
        totalMarked++
      }
    }

    // Update metadata
    progressData.lastAccessed = new Date().toISOString()
    progressData.totalTimeSpent += totalMarked * estimatedMinutes

    // Save to localStorage
    localStorage.setItem(progressKey, JSON.stringify(progressData))

    console.log(
      `✅ Marked ${totalMarked} lessons in Phase ${phaseId} as complete`
    )
    console.log(`   Total time tracked: ${(totalMarked * estimatedMinutes) / 60} hours`)
    console.log('   🔄 Refresh the page to see your progress update')

    return true
  } catch (error) {
    console.error('❌ Error marking phase as complete:', error)
    return false
  }
}

// Run it immediately
markPhaseAsComplete(1, 30)
