<!--
  DevOps Index Page
  =================
  Main landing page for the DevOps roadmap with enhanced visual design.

  Features:
  - Hero banner with animated elements
  - Progress tracking integration
  - Priority legend
  - Interactive timeline with phases
  - Stats footer

  Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  HERO BANNER                                                 │
  │  [Icon] DevOps to DevSecOps Learning Roadmap                │
  │  [Stats: Phases | Topics | Skills | Duration]               │
  │  [Progress Ring] [Resume Learning]                          │
  ├─────────────────────────────────────────────────────────────┤
  │  PRIORITY LEGEND                                             │
  ├─────────────────────────────────────────────────────────────┤
  │  ROADMAP TIMELINE                                            │
  │  [Phase Cards] [Topic Details]                              │
  ├─────────────────────────────────────────────────────────────┤
  │  STATS FOOTER                                                │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import { devopsPhases } from '~/data/roadmap'
import { devopsRoadmap } from '~/data/roadmaps'

/**
 * Page Meta
 * ---------
 */
useSeoMeta({
  title: 'DevOps Roadmap | Master DevOps to DevSecOps',
  description: 'Comprehensive learning path for DevOps engineering. 10 phases, 69 topics, 527+ skills to master.'
})

/**
 * Roadmap Context
 * ---------------
 */
const { setCurrentRoadmapBySlug, getRoutePath } = useRoadmap()
const roadmapId = 'devops'

onMounted(() => {
  setCurrentRoadmapBySlug('devops')
})

/**
 * Progress Tracking
 * -----------------
 */
const {
  getCompletedCount,
  getTotalLessonCount,
  getCertificateProgress,
  getResumeLearningData,
  getTotalTimeSpentHours
} = useProgress()

/**
 * Computed progress values
 */
const completedLessons = computed(() => getCompletedCount(roadmapId))
const totalLessons = computed(() => getTotalLessonCount(roadmapId))
const completionPercentage = computed(() => getCertificateProgress(roadmapId))
const timeSpentHours = computed(() => getTotalTimeSpentHours(roadmapId))

/**
 * Resume learning path
 */
const resumeData = computed(() => getResumeLearningData(roadmapId))
const resumePath = computed(() => {
  if (!resumeData.value) return null
  return getRoutePath(
    roadmapId,
    resumeData.value.phaseId,
    resumeData.value.topicId,
    resumeData.value.subtopicId
  )
})
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!--
        Hero Banner
        ===========
        Roadmap header with animated elements and progress
      -->
      <HeroRoadmapBanner
        :roadmap="devopsRoadmap"
        :progress="completionPercentage"
        :completed-lessons="completedLessons"
        :total-lessons="totalLessons"
        :time-spent-hours="timeSpentHours"
        :resume-path="resumePath"
      />

      <!--
        Priority Legend
        ===============
        Color-coded guide for topic priority levels
      -->
      <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm text-gray-400">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-500" />
          <span><span class="text-red-400 font-medium">Must Know</span> = Required for job applications</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-yellow-500" />
          <span><span class="text-yellow-400 font-medium">Should Know</span> = Frequently requested</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-sky-500" />
          <span><span class="text-sky-400 font-medium">Good to Know</span> = Sets you apart</span>
        </div>
      </div>

      <!--
        Roadmap Timeline
        ================
        Interactive phase navigation and topic details
      -->
      <RoadmapTimeline
        :phases="devopsPhases"
        :roadmap-id="devopsRoadmap.id"
      />

      <!--
        Stats Footer
        ============
        Summary statistics and navigation
      -->
      <StatsFooter />
    </div>
  </div>
</template>
