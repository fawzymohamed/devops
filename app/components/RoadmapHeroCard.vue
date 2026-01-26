<!--
  RoadmapHeroCard.vue
  ===================
  Enhanced roadmap selection card for the landing page.

  Features:
  - Large animated icon with hover effects
  - Stats preview (phases, topics, duration)
  - Progress ring showing user progress
  - Hover glow effect with scale animation
  - Sliding arrow on hover
  - "Start Your Journey" CTA

  Props:
  - roadmap: Roadmap object with title, stats, etc.
  - progress: User's progress percentage (0-100)

  Layout:
  ┌────────────────────────────────────┐
  │  [Icon]                            │
  │                                    │
  │  Title                             │
  │  Description                       │
  │                                    │
  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
  │  │Stat│ │Stat│ │Stat│ │Time│      │
  │  └────┘ └────┘ └────┘ └────┘      │
  │                                    │
  │  [Progress Ring]    [CTA Button →] │
  └────────────────────────────────────┘
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
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})

/**
 * Get icon for roadmap
 * --------------------
 * Returns appropriate emoji/icon for each roadmap type
 */
const roadmapIcon = computed(() => {
  if (props.roadmap.slug === 'devops') {
    return '🔧'
  }
  return '💻'
})

/**
 * Get accent color class based on roadmap
 */
const accentColor = computed(() => {
  if (props.roadmap.slug === 'devops') {
    return 'emerald'
  }
  return 'cyan'
})

/**
 * Get route path for roadmap
 */
const routePath = computed(() => `/${props.roadmap.slug}`)

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
 * CTA text based on progress
 */
const ctaText = computed(() => {
  if (props.progress === 0) return 'Start Your Journey'
  if (props.progress === 100) return 'Review Roadmap'
  return 'Continue Learning'
})
</script>

<template>
  <NuxtLink
    :to="routePath"
    class="group block"
  >
    <div
      class="relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300 cursor-pointer card-glow glass-strong hover:scale-[1.02]"
      :class="[
        accentColor === 'emerald' ? 'hover:ring-emerald-500/50' : 'hover:ring-cyan-500/50',
        'ring-1 ring-white/10'
      ]"
    >
      <!--
        Gradient Accent Line
        ====================
        Top border gradient indicator
      -->
      <div
        class="absolute top-0 left-6 right-6 h-1 rounded-full"
        :class="[
          accentColor === 'emerald'
            ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500'
            : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500'
        ]"
      />

      <!--
        Icon Container
        ==============
        Large animated icon
      -->
      <div class="flex justify-center mb-6">
        <div
          class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce-subtle"
          :class="[
            accentColor === 'emerald'
              ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30'
              : 'bg-cyan-500/20 ring-1 ring-cyan-500/30'
          ]"
        >
          {{ roadmapIcon }}
        </div>
      </div>

      <!--
        Title & Description
        ===================
      -->
      <div class="text-center mb-6">
        <h3 class="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {{ roadmap.title }}
        </h3>
        <p class="text-gray-400 text-sm md:text-base">
          {{ roadmap.description }}
        </p>
      </div>

      <!--
        Stats Grid
        ==========
        Phase, Topics, Skills, Duration counts
      -->
      <div class="grid grid-cols-4 gap-2 md:gap-4 mb-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center"
        >
          <div
            class="text-lg md:text-xl font-bold"
            :class="accentColor === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'"
          >
            {{ stat.value }}
          </div>
          <div class="text-xs text-gray-500 flex items-center justify-center gap-1">
            <UIcon
              :name="stat.icon"
              class="w-3 h-3"
            />
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!--
        Progress & CTA
        ==============
        Progress ring and call-to-action button
      -->
      <div class="flex items-center justify-between">
        <!--
          Progress Ring (if has progress)
        -->
        <div
          v-if="progress > 0"
          class="flex items-center gap-2"
        >
          <ProgressRing
            :value="progress"
            :size="48"
            :stroke-width="4"
          />
          <span class="text-sm text-gray-400">
            {{ Math.round(progress) }}% complete
          </span>
        </div>
        <div v-else />

        <!--
          CTA Button
        -->
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group-hover:gap-3"
          :class="[
            accentColor === 'emerald'
              ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30'
              : 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30'
          ]"
        >
          <span class="text-sm font-medium">{{ ctaText }}</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
