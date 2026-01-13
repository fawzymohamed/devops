<!--
  RoadmapSwitcher.vue - Header Roadmap Selector
  =============================================
  Simple dropdown for switching between roadmaps.
-->

<script setup lang="ts">
const { allRoadmaps, getRoadmapFromRoute, setCurrentRoadmapBySlug, getRoutePath } = useRoadmap()
const route = useRoute()

const selected = ref('devops')

function syncFromRoute() {
  const roadmap = getRoadmapFromRoute()
  if (roadmap) {
    selected.value = roadmap.slug
    setCurrentRoadmapBySlug(roadmap.slug)
  }
}

onMounted(() => {
  syncFromRoute()
})

watch(() => route.path, () => {
  syncFromRoute()
})

function handleChange() {
  setCurrentRoadmapBySlug(selected.value)
  navigateTo(getRoutePath(selected.value))
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-gray-400 hidden sm:inline">Roadmap</span>
    <select
      v-model="selected"
      class="bg-gray-900 text-gray-100 text-sm rounded-md border border-gray-700 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      @change="handleChange"
    >
      <option
        v-for="roadmap in allRoadmaps"
        :key="roadmap.id"
        :value="roadmap.slug"
      >
        {{ roadmap.title }}
      </option>
    </select>
  </div>
</template>
