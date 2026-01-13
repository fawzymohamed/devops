<!--
  RoadmapCard.vue - Roadmap Selection Card
  =======================================
  Displays a single roadmap option with stats and progress.
-->

<script setup lang="ts">
import type { Roadmap } from '~/data/types'

const props = withDefaults(defineProps<{
  roadmap: Roadmap
  progress?: number
  showProgress?: boolean
}>(), {
  progress: 0,
  showProgress: true
})

const emit = defineEmits<{
  select: [roadmap: Roadmap]
}>()

function handleSelect() {
  emit('select', props.roadmap)
}

const progressLabel = computed(() => `${props.progress}% Complete`)
</script>

<template>
  <UCard
    class="cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:ring-2 hover:ring-emerald-500/40 bg-gray-900/60"
    @click="handleSelect"
  >
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 font-semibold">
            {{ roadmap.icon }}
          </div>
          <div>
            <div class="text-lg font-semibold text-gray-100">
              {{ roadmap.title }}
            </div>
            <div class="text-sm text-gray-400">
              {{ roadmap.description }}
            </div>
          </div>
        </div>
        <ProgressRing
          v-if="showProgress"
          :value="progress"
          :size="48"
          :stroke-width="4"
          color="#10b981"
          show-label
        />
      </div>
    </template>

    <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
      <div>
        <div class="text-xs text-gray-500">
          Phases
        </div>
        <div class="text-base font-semibold text-gray-100">
          {{ roadmap.stats.phaseCount }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500">
          Topics
        </div>
        <div class="text-base font-semibold text-gray-100">
          {{ roadmap.stats.topicCount }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500">
          Skills
        </div>
        <div class="text-base font-semibold text-gray-100">
          {{ roadmap.stats.subtopicCount }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500">
          Timeline
        </div>
        <div class="text-base font-semibold text-gray-100">
          {{ roadmap.stats.totalWeeks }} weeks
        </div>
      </div>
    </div>

    <template
      v-if="showProgress"
      #footer
    >
      <div class="flex items-center justify-between text-sm text-gray-400">
        <span>{{ progressLabel }}</span>
        <span class="text-emerald-400">Explore</span>
      </div>
    </template>
  </UCard>
</template>
