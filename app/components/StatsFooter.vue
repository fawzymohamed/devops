<script setup lang="ts">
import { roadmapData } from '~/data/roadmap'

const stats = computed(() => {
  const totalTopics = roadmapData.reduce((acc, p) => acc + p.topics.length, 0)
  const totalSkills = roadmapData.reduce(
    (acc, p) => acc + p.topics.reduce((a, t) => a + t.subtopics.length, 0),
    0
  )

  return [
    { value: '10', label: 'Phases', color: '#22c55e' },
    { value: totalTopics.toString(), label: 'Topics', color: '#0ea5e9' },
    { value: totalSkills.toString(), label: 'Skills', color: '#8b5cf6' },
    { value: '8-12', label: 'Months', color: '#f59e0b' },
    { value: '3', label: 'Certifications', color: '#ef4444' }
  ]
})
</script>

<template>
  <div class="mt-10">
    <div
      class="rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center"
      style="background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(239,68,68,0.1))"
    >
      <div
        v-for="stat in stats"
        :key="stat.label"
      >
        <div
          class="text-3xl sm:text-4xl font-bold"
          :style="{ color: stat.color }"
        >
          {{ stat.value }}
        </div>
        <div class="text-gray-400 text-sm">
          {{ stat.label }}
        </div>
      </div>
    </div>

    <div class="mt-8 text-center text-gray-500 text-sm space-y-1">
      <p>🔴 <strong class="text-gray-300">Must Know</strong> = Required for job applications</p>
      <p>🟡 <strong class="text-gray-300">Should Know</strong> = Frequently requested in interviews</p>
      <p>🔵 <strong class="text-gray-300">Good to Know</strong> = Differentiates you from other candidates</p>
      <p class="mt-4 text-gray-400">
        💡 With your Full Stack + Network Security background, phases 1 (Foundations) and parts of phase 2 (Networking) can be accelerated significantly.
      </p>
    </div>
  </div>
</template>
