<script setup lang="ts">
import { totalDuration, priorityConfig } from '~/data/roadmap'

type ViewMode = 'timeline' | 'grid'
const viewMode = ref<ViewMode>('timeline')
</script>

<template>
  <div class="py-8">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 via-sky-500 via-violet-500 to-red-500 bg-clip-text text-transparent">
        DevOps → DevSecOps Learning Roadmap
      </h1>
      <p class="text-gray-400 text-base sm:text-lg mb-4">
        Personalized for Fawzy Mohamed | Saudi Arabia Market Focus
      </p>
      <div class="inline-flex flex-wrap justify-center gap-4 sm:gap-6 bg-gray-800/50 px-4 sm:px-6 py-3 rounded-xl">
        <div>
          <span class="text-gray-400">Total Duration: </span>
          <span class="font-semibold text-green-500">{{ totalDuration }}</span>
        </div>
        <div>
          <span class="text-gray-400">Phases: </span>
          <span class="font-semibold">10</span>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
      <div
        v-for="(config, key) in priorityConfig"
        :key="key"
        class="flex items-center gap-2"
      >
        <div
          class="w-4 h-4 rounded"
          :class="{
            'bg-red-600': key === 'essential',
            'bg-amber-500': key === 'important',
            'bg-blue-500': key === 'recommended'
          }"
        />
        <span class="text-sm text-gray-400">{{ config.label }}</span>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-center mb-8">
      <UButtonGroup>
        <UButton
          :color="viewMode === 'timeline' ? 'primary' : 'neutral'"
          :variant="viewMode === 'timeline' ? 'solid' : 'ghost'"
          class="cursor-pointer"
          @click="viewMode = 'timeline'"
        >
          <UIcon
            name="i-lucide-list"
            class="w-4 h-4 mr-2"
          />
          Timeline View
        </UButton>
        <UButton
          :color="viewMode === 'grid' ? 'primary' : 'neutral'"
          :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
          class="cursor-pointer"
          @click="viewMode = 'grid'"
        >
          <UIcon
            name="i-lucide-layout-grid"
            class="w-4 h-4 mr-2"
          />
          Grid View
        </UButton>
      </UButtonGroup>
    </div>

    <!-- View Content -->
    <RoadmapTimeline v-if="viewMode === 'timeline'" />
    <RoadmapGrid v-else />

    <!-- Stats Footer -->
    <StatsFooter />
  </div>
</template>
