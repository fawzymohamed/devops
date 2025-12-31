<script setup lang="ts">
import { totalDuration } from '~/data/roadmap'
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
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm text-gray-400">
      <span>🔴 Must Know = Required for job applications</span>
      <span>🟡 Should Know = Frequently requested in interviews</span>
      <span>🔵 Good to Know = Differentiates you from other candidates</span>
    </div>

    <!-- Roadmap Content -->
    <RoadmapTimeline />

    <!-- Stats Footer -->
    <StatsFooter />
  </div>
</template>
