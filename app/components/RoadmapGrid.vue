<script setup lang="ts">
import { roadmapData } from '~/data/roadmap'
import type { Priority } from '~/data/roadmap'

const getPriorityStyle = (priority: Priority) => {
  const styles: Record<Priority, { bg: string; text: string }> = {
    essential: { bg: '#dc2626', text: '#fff' },
    important: { bg: '#f59e0b', text: '#000' },
    recommended: { bg: '#3b82f6', text: '#fff' }
  }
  return styles[priority]
}
</script>

<template>
  <div class="space-y-6">
    <UCard
      v-for="phase in roadmapData"
      :key="phase.phase"
      :ui="{
        background: 'bg-gray-900/30',
        ring: 'ring-0',
        body: { padding: 'p-6' }
      }"
      class="border-l-4"
      :style="{ borderLeftColor: phase.color }"
    >
      <!-- Phase Header -->
      <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">{{ phase.icon }}</span>
        <div>
          <h3
            class="text-lg font-semibold"
            :style="{ color: phase.color }"
          >
            {{ phase.title }}
          </h3>
          <span class="text-sm text-gray-400">
            {{ phase.duration }} | {{ phase.topics.length }} topics | {{ phase.topics.reduce((a, t) => a + t.subtopics.length, 0) }} skills
          </span>
        </div>
      </div>

      <!-- Topics Tags -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="topic in phase.topics"
          :key="topic.name"
          class="px-3 py-1 rounded-full text-sm font-medium"
          :style="{ backgroundColor: getPriorityStyle(topic.priority).bg, color: getPriorityStyle(topic.priority).text }"
        >
          {{ topic.name }}
        </span>
      </div>
    </UCard>
  </div>
</template>
