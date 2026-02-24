<!--
  AWS Cloud & Security Index Page
  ================================
  Main landing page for the AWS Cloud & Security Career Path roadmap.

  Features:
  - Hero banner with amber theme
  - Progress tracking integration
  - Priority legend (Exam Critical / Exam Relevant / Supplementary)
  - Interactive timeline with phases

  Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  HERO BANNER                                                 │
  │  [Icon] AWS Cloud & Security Career Path                    │
  │  [Stats: Phases | Topics | Skills | Duration]               │
  │  [Progress Ring] [Resume Learning]                          │
  ├─────────────────────────────────────────────────────────────┤
  │  PRIORITY LEGEND                                             │
  ├─────────────────────────────────────────────────────────────┤
  │  ROADMAP TIMELINE                                            │
  │  [Phase Cards] [Topic Details]                              │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import { awsPhases } from '~/data/aws-roadmap'
import { awsRoadmap } from '~/data/roadmaps'

/**
 * Page Meta
 * ---------
 */
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'AWS Cloud & Security Career Path | 5 AWS Certifications',
  description: 'Master AWS from Cloud Practitioner to Security & Networking Specialist. 5 phases, 34 topics, 244+ skills to master.'
})

/**
 * Roadmap Context
 * ---------------
 */
const { setCurrentRoadmapBySlug, getRoutePath } = useRoadmap()
const roadmapId = 'aws'

onMounted(() => {
  setCurrentRoadmapBySlug('aws')
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

const completedLessons = computed(() => getCompletedCount(roadmapId))
const totalLessons = computed(() => getTotalLessonCount(roadmapId))
const completionPercentage = computed(() => getCertificateProgress(roadmapId))
const timeSpentHours = computed(() => getTotalTimeSpentHours(roadmapId))

/**
 * Resume Learning
 * ---------------
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
        :roadmap="awsRoadmap"
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
          <span><span class="text-red-400 font-medium">Exam Critical</span> = Must know for certification</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-yellow-500" />
          <span><span class="text-yellow-400 font-medium">Exam Relevant</span> = Frequently tested</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-sky-500" />
          <span><span class="text-sky-400 font-medium">Supplementary</span> = Deepens understanding</span>
        </div>
      </div>

      <!--
        Roadmap Timeline
        ================
        Interactive phase navigation and topic details
      -->
      <RoadmapTimeline
        :phases="awsPhases"
        :roadmap-id="awsRoadmap.id"
      />
    </div>
  </div>
</template>
