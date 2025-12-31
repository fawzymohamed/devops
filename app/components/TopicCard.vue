<script setup lang="ts">
import type { Topic } from '~/data/roadmap'
import { priorityConfig } from '~/data/roadmap'

const props = defineProps<{
  topic: Topic
  phaseColor: string
}>()

const isOpen = ref(false)

const priorityLabel = computed(() => {
  return priorityConfig[props.topic.priority].label
})

const priorityBgColor = computed(() => {
  const colors: Record<string, string> = {
    essential: '#dc2626',
    important: '#f59e0b',
    recommended: '#3b82f6'
  }
  return colors[props.topic.priority]
})

const priorityTextColor = computed(() => {
  return props.topic.priority === 'important' ? '#000' : '#fff'
})
</script>

<template>
  <UCard
    class="cursor-pointer transition-all duration-300 hover:bg-gray-800/50"
    :ui="{
      background: 'bg-gray-900/50',
      ring: 'ring-1 ring-gray-700',
      body: { padding: 'p-4' }
    }"
    @click="isOpen = !isOpen"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 flex-wrap">
        <span
          class="text-lg font-semibold"
          :style="{ color: phaseColor }"
        >
          {{ topic.name }}
        </span>
        <span
          class="px-2 py-0.5 rounded-full text-xs font-semibold"
          :style="{ backgroundColor: priorityBgColor, color: priorityTextColor }"
        >
          {{ priorityLabel }}
        </span>
      </div>
      <UIcon
        name="i-lucide-chevron-down"
        class="w-5 h-5 transition-transform duration-300 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="isOpen"
        class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-hidden"
      >
        <div
          v-for="(subtopic, idx) in topic.subtopics"
          :key="idx"
          class="bg-gray-800/60 px-3 py-2 rounded-lg text-sm border-l-3"
          :style="{ borderLeftColor: phaseColor }"
        >
          {{ subtopic }}
        </div>
      </div>
    </Transition>
  </UCard>
</template>
