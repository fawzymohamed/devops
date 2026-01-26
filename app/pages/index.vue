<!--
  index.vue - Creative Landing Page
  ==================================
  Immersive landing page with animated elements for roadmap selection.

  Features:
  - Animated gradient background with floating shapes
  - Dynamic hero section with gradient text
  - Animated stats counter
  - Enhanced roadmap selection cards
  - Features showcase section

  Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  [Animated Background - Gradient + Floating Elements]        │
  ├─────────────────────────────────────────────────────────────┤
  │  HERO SECTION                                                │
  │  "Master Your Tech Career"                                   │
  │  Choose your path. Track your progress.                      │
  │  [Combined Stats: 23 Phases | 148 Topics | 977 Skills]       │
  ├─────────────────────────────────────────────────────────────┤
  │  ROADMAP CARDS                                               │
  │  ┌──────────────────┐   ┌──────────────────┐                │
  │  │  DevOps          │   │  Full Stack      │                │
  │  │  [Stats + CTA]   │   │  [Stats + CTA]   │                │
  │  └──────────────────┘   └──────────────────┘                │
  ├─────────────────────────────────────────────────────────────┤
  │  FEATURES SHOWCASE                                           │
  │  Progress | Quizzes | Certificates | Cheat Sheets           │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import { allRoadmaps } from '~/data/roadmaps'

/**
 * Page Meta
 * ---------
 * SEO and layout configuration
 */
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Master Your Tech Career | Learning Roadmaps',
  description: 'Comprehensive learning paths for DevOps and Full Stack development. Track your progress, take quizzes, and earn certificates.'
})

/**
 * Progress Tracking
 * -----------------
 * Get user's progress for each roadmap
 */
const { getCertificateProgress } = useProgress()

/**
 * Computed: Total Stats
 * ---------------------
 * Aggregate stats from all roadmaps
 */
const totalStats = computed(() => ({
  phases: allRoadmaps.reduce((sum, r) => sum + r.stats.phaseCount, 0),
  topics: allRoadmaps.reduce((sum, r) => sum + r.stats.topicCount, 0),
  skills: allRoadmaps.reduce((sum, r) => sum + r.stats.subtopicCount, 0),
  weeks: allRoadmaps.reduce((sum, r) => sum + r.stats.totalWeeks, 0)
}))

/**
 * Get progress for a specific roadmap
 */
function getRoadmapProgress(roadmapId: string): number {
  return getCertificateProgress(roadmapId)
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!--
      Animated Background
      ===================
      Floating shapes and gradient overlay
    -->
    <AnimatedBackground variant="default" />

    <!--
      Main Content
      ============
      All content positioned above the background
    -->
    <div class="relative z-10">
      <!--
        Hero Section
        ============
        Main headline with animated text and stats
      -->
      <section class="pt-16 pb-12 md:pt-24 md:pb-16 px-4">
        <div class="max-w-5xl mx-auto text-center">
          <!--
            Animated Badge
            ==============
            Small intro badge above headline
          -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-slide-up">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span class="text-sm text-gray-300">Free Learning Platform</span>
          </div>

          <!--
            Main Headline
            =============
            Gradient animated text
          -->
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up stagger-1"
            style="opacity: 0;"
          >
            <span class="text-white">Master Your</span>
            <br class="sm:hidden">
            <span class="gradient-text animate-text-glow"> Tech Career</span>
          </h1>

          <!--
            Subheadline
            ===========
          -->
          <p
            class="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up stagger-2"
            style="opacity: 0;"
          >
            Choose your path. Track your progress.
            <span class="text-gray-300">Begin your journey.</span>
          </p>

          <!--
            Stats Counter Row
            =================
            Animated counters for total stats
          -->
          <div
            class="flex flex-wrap justify-center gap-6 md:gap-12 animate-slide-up stagger-3"
            style="opacity: 0;"
          >
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-emerald-400">
                <AnimatedCounter :value="totalStats.phases" />
              </div>
              <div class="text-sm text-gray-500">
                Phases
              </div>
            </div>
            <div class="hidden sm:block w-px h-12 bg-gray-700" />
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-cyan-400">
                <AnimatedCounter :value="totalStats.topics" />
              </div>
              <div class="text-sm text-gray-500">
                Topics
              </div>
            </div>
            <div class="hidden sm:block w-px h-12 bg-gray-700" />
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-violet-400">
                <AnimatedCounter
                  :value="totalStats.skills"
                  suffix="+"
                />
              </div>
              <div class="text-sm text-gray-500">
                Skills
              </div>
            </div>
            <div class="hidden sm:block w-px h-12 bg-gray-700" />
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-amber-400">
                <AnimatedCounter :value="totalStats.weeks" />
              </div>
              <div class="text-sm text-gray-500">
                Weeks
              </div>
            </div>
          </div>
        </div>
      </section>

      <!--
        Roadmap Selection
        =================
        Enhanced roadmap cards
      -->
      <section class="py-12 px-4">
        <div class="max-w-5xl mx-auto">
          <!--
            Section Header
          -->
          <div class="text-center mb-10">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">
              Choose Your <span class="gradient-text-emerald">Learning Path</span>
            </h2>
            <p class="text-gray-400">
              Start with one roadmap or explore both at your own pace.
            </p>
          </div>

          <!--
            Roadmap Cards Grid
          -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <RoadmapHeroCard
              v-for="roadmap in allRoadmaps"
              :key="roadmap.id"
              :roadmap="roadmap"
              :progress="getRoadmapProgress(roadmap.id)"
            />
          </div>
        </div>
      </section>

      <!--
        Features Showcase
        =================
        Platform features grid
      -->
      <section class="px-4">
        <div class="max-w-6xl mx-auto">
          <FeatureShowcase />
        </div>
      </section>

      <!--
        Footer CTA
        ==========
        Final call to action
      -->
      <section class="py-16 px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="glass-strong rounded-2xl p-8 md:p-12">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p class="text-gray-400 mb-8">
              Join thousands of developers mastering their skills with structured roadmaps and hands-on learning.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/devops">
                <UButton
                  size="xl"
                  color="primary"
                  class="cursor-pointer w-full sm:w-auto"
                >
                  <UIcon
                    name="i-lucide-git-branch"
                    class="w-5 h-5 mr-2"
                  />
                  Start DevOps Path
                </UButton>
              </NuxtLink>
              <NuxtLink to="/fullstack">
                <UButton
                  size="xl"
                  variant="outline"
                  color="neutral"
                  class="cursor-pointer w-full sm:w-auto"
                >
                  <UIcon
                    name="i-lucide-layers"
                    class="w-5 h-5 mr-2"
                  />
                  Start Full Stack Path
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
