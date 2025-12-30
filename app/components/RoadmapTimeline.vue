<script setup lang="ts">
import { roadmapData } from '~/data/roadmap'

const activePhase = ref(0)

const activeData = computed(() => roadmapData[activePhase.value])
</script>

<template>
  <div>
    <!-- Phase Navigation - Horizontal Scroll -->
    <div class="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <PhaseCard
        v-for="(phase, idx) in roadmapData"
        :key="idx"
        :phase="phase"
        :is-active="activePhase === idx"
        @select="activePhase = idx"
      />
    </div>

    <!-- Active Phase Detail -->
    <UCard
      :ui="{
        background: 'bg-gray-900/30',
        ring: 'ring-1',
        body: { padding: 'p-6 sm:p-8' }
      }"
      :style="{ '--tw-ring-color': `${activeData.color}40` }"
    >
      <!-- Phase Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <span class="text-5xl">{{ activeData.icon }}</span>
        <div>
          <h2
            class="text-2xl sm:text-3xl font-bold"
            :style="{ color: activeData.color }"
          >
            {{ activeData.title }}
          </h2>
          <p class="text-gray-400 mt-1">
            {{ activeData.description }}
          </p>
        </div>
      </div>

      <!-- Phase Stats -->
      <div class="flex flex-wrap gap-3 mb-6">
        <UBadge
          size="lg"
          :style="{ backgroundColor: activeData.color }"
          class="text-white"
        >
          ⏱️ Duration: {{ activeData.duration }}
        </UBadge>
        <UBadge
          size="lg"
          color="neutral"
          variant="subtle"
        >
          📚 {{ activeData.topics.length }} Topics
        </UBadge>
        <UBadge
          size="lg"
          color="neutral"
          variant="subtle"
        >
          🎯 {{ activeData.topics.reduce((acc, t) => acc + t.subtopics.length, 0) }} Skills
        </UBadge>
      </div>

      <!-- Topics List -->
      <h3 class="text-lg font-medium text-gray-200 mb-4">
        Topics to Master (click to expand):
      </h3>

      <div class="space-y-3">
        <TopicCard
          v-for="(topic, idx) in activeData.topics"
          :key="idx"
          :topic="topic"
          :phase-color="activeData.color"
        />
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
