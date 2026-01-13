<!--
  Full Stack Roadmap Index Page
  =============================
  Displays the Full Stack roadmap timeline and progress summary.
-->

<script setup lang="ts">
import { fullstackPhases } from '~/data/fullstack-roadmap'
import { fullstackRoadmap } from '~/data/roadmaps'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Full Stack Roadmap',
  description: 'Full Stack Developer Interview Mastery roadmap'
})

const { setCurrentRoadmapBySlug } = useRoadmap()

onMounted(() => {
  setCurrentRoadmapBySlug('fullstack')
})
</script>

<template>
  <div class="py-8">
    <div class="text-center mb-10">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">
        {{ fullstackRoadmap.title }}
      </h1>
      <p class="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
        {{ fullstackRoadmap.fullDescription }}
      </p>
    </div>

    <section class="mb-8">
      <ProgressOverallProgress :roadmap-id="fullstackRoadmap.id" />
    </section>

    <RoadmapTimeline
      :phases="fullstackPhases"
      :roadmap-id="fullstackRoadmap.id"
    />
  </div>
</template>
