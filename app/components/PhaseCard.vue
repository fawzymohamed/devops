<script setup lang="ts">
import type { Phase } from '~/data/roadmap'

const props = defineProps<{
  phase: Phase
  isActive: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    class="cursor-pointer rounded-2xl p-5 min-w-[280px] transition-all duration-300 border-2"
    :class="[
      isActive ? 'border-current' : 'border-transparent hover:border-gray-600'
    ]"
    :style="{
      background: isActive
        ? `linear-gradient(135deg, ${phase.color}40, ${phase.color}20)`
        : 'rgba(255,255,255,0.05)',
      borderColor: isActive ? phase.color : undefined
    }"
    @click="emit('select')"
  >
    <div class="flex items-center gap-3 mb-2">
      <span class="text-3xl">{{ phase.icon }}</span>
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-wider"
          :style="{ color: phase.color }"
        >
          Phase {{ phase.phase }}
        </div>
        <div class="text-base font-semibold text-gray-100">
          {{ phase.title.replace(`Phase ${phase.phase}: `, '') }}
        </div>
      </div>
    </div>
    <div class="text-sm text-gray-400 mb-2 line-clamp-2">
      {{ phase.description }}
    </div>
    <UBadge
      :style="{ backgroundColor: phase.color }"
      class="text-white"
      size="sm"
    >
      ⏱️ {{ phase.duration }}
    </UBadge>
  </div>
</template>
