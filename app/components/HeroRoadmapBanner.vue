<!--
  HeroRoadmapBanner.vue
  =====================
  Hero banner for roadmap pages with gradient theme and animated elements.

  Features:
  - Roadmap-specific gradient theme
  - Large animated icon
  - Progress summary card with glassmorphism
  - Animated stats display
  - Resume learning button

  Props:
  - roadmap: Roadmap object
  - progress: User's progress percentage
  - completedLessons: Number of lessons completed
  - totalLessons: Total lessons in roadmap
  - timeSpentHours: Time spent learning
  - resumePath: Path to resume learning
-->

<script setup lang="ts">
import type { Roadmap } from '~/data/types'

/**
 * Props
 * -----
 */
interface Props {
  roadmap: Roadmap
  progress?: number
  completedLessons?: number
  totalLessons?: number
  timeSpentHours?: number
  resumePath?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  completedLessons: 0,
  totalLessons: 0,
  timeSpentHours: 0,
  resumePath: null
})

/**
 * Get icon for roadmap
 */
const roadmapIcon = computed(() => {
  if (props.roadmap.slug === 'devops') return '🔧'
  return '💻'
})

/**
 * Get gradient classes based on roadmap
 */
const gradientClasses = computed(() => {
  if (props.roadmap.slug === 'devops') {
    return 'from-emerald-900/50 via-emerald-800/30 to-teal-900/50'
  }
  return 'from-cyan-900/50 via-cyan-800/30 to-blue-900/50'
})

/**
 * Get accent color based on roadmap
 */
const accentColor = computed(() => {
  if (props.roadmap.slug === 'devops') return 'emerald'
  return 'cyan'
})

/**
 * Stats to display
 */
const stats = computed(() => [
  { label: 'Phases', value: props.roadmap.stats.phaseCount, icon: 'i-lucide-layers' },
  { label: 'Topics', value: props.roadmap.stats.topicCount, icon: 'i-lucide-book-open' },
  { label: 'Skills', value: props.roadmap.stats.subtopicCount, icon: 'i-lucide-target' },
  { label: 'Weeks', value: props.roadmap.stats.totalWeeks, icon: 'i-lucide-calendar' }
])

/**
 * Whether user has started this roadmap
 */
const hasProgress = computed(() => props.completedLessons > 0)
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl mb-8">
    <!--
      Gradient Background
      ===================
    -->
    <div
      class="absolute inset-0 bg-gradient-to-br"
      :class="gradientClasses"
    />

    <!--
      Floating Decorative Elements
      ============================
    -->
    <div
      class="absolute top-10 right-10 w-32 h-32 rounded-full blur-3xl animate-float"
      :class="accentColor === 'emerald' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'"
    />
    <div
      class="absolute bottom-10 left-10 w-24 h-24 rounded-full blur-2xl animate-float-delayed"
      :class="accentColor === 'emerald' ? 'bg-teal-500/15' : 'bg-blue-500/15'"
    />

    <!--
      Content
      =======
    -->
    <div class="relative p-6 md:p-10">
      <div class="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        <!--
          Large Animated Icon
          ===================
        -->
        <div
          class="w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-4xl md:text-6xl ring-1 transition-transform duration-300 hover:scale-110"
          :class="[
            accentColor === 'emerald' ? 'bg-emerald-500/20 ring-emerald-500/30' : 'bg-cyan-500/20 ring-cyan-500/30'
          ]"
        >
          {{ roadmapIcon }}
        </div>

        <!--
          Title and Description
          =====================
        -->
        <div class="flex-1 text-center lg:text-left">
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            {{ roadmap.title }}
          </h1>
          <p class="text-gray-300 text-base md:text-lg max-w-2xl">
            {{ roadmap.fullDescription || roadmap.description }}
          </p>
        </div>

        <!--
          Progress Ring (if has progress)
          ================================
        -->
        <div
          v-if="hasProgress"
          class="flex-shrink-0"
        >
          <ProgressRing
            :value="progress"
            :size="96"
            :stroke-width="6"
            show-label
          />
        </div>
      </div>

      <!--
        Stats Row
        =========
      -->
      <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center p-3 rounded-xl glass"
        >
          <div
            class="text-xl md:text-2xl font-bold"
            :class="accentColor === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'"
          >
            <AnimatedCounter :value="stat.value" />
          </div>
          <div class="text-sm text-gray-400 flex items-center justify-center gap-1">
            <UIcon
              :name="stat.icon"
              class="w-3 h-3"
            />
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!--
        Progress Details (if has progress)
        ===================================
      -->
      <div
        v-if="hasProgress"
        class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass-light"
      >
        <div class="flex items-center gap-6 text-sm">
          <div>
            <span class="text-gray-400">Lessons: </span>
            <span class="text-white font-semibold">{{ completedLessons }}/{{ totalLessons }}</span>
          </div>
          <div>
            <span class="text-gray-400">Time: </span>
            <span class="text-white font-semibold">{{ timeSpentHours }} hrs</span>
          </div>
        </div>

        <div class="flex gap-3">
          <NuxtLink
            v-if="resumePath"
            :to="resumePath"
          >
            <UButton
              color="primary"
              size="md"
              class="cursor-pointer"
            >
              <UIcon
                name="i-lucide-play-circle"
                class="w-4 h-4 mr-2"
              />
              Resume Learning
            </UButton>
          </NuxtLink>
          <NuxtLink :to="`/progress?roadmap=${roadmap.id}`">
            <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="cursor-pointer"
            >
              View Progress
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
