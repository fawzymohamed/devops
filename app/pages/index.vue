<!--
  Index.vue - Main Landing Page
  =============================
  This is the primary page of the DevOps to DevSecOps Learning Roadmap application.
  It serves as the entry point and displays the complete roadmap interface.

  Page Structure:
  1. Header Section - Title, subtitle, and quick stats (duration, phases)
  2. Priority Legend - Color-coded guide explaining topic importance levels
  3. Roadmap Timeline - Interactive phase navigation and topic details
  4. Stats Footer - Summary statistics and additional information

  Data Flow:
  - Imports roadmap data and computed duration from ~/data/roadmap.ts
  - All statistics are dynamically calculated from the roadmap data
-->

<script setup lang="ts">
/**
 * Data Imports
 * ------------
 * - roadmapData: Array of all learning phases with topics and subtopics
 * - totalDuration: Dynamically calculated total duration string (e.g., "24 weeks")
 */
import { roadmapData, totalDuration } from '~/data/roadmap'

/**
 * Computed Properties
 * -------------------
 * totalPhases: Dynamically counts the number of phases in the roadmap.
 * This ensures the UI always reflects the current data structure.
 */
const totalPhases = computed(() => roadmapData.length)
</script>

<template>
  <div class="py-8">
    <!--
      Header Section
      ==============
      Contains the main title with gradient text effect,
      personalization subtitle, and key metrics (duration & phase count).
    -->
    <div class="text-center mb-10">
      <!-- Main title with multi-color gradient (green -> sky -> violet -> red) -->
      <h1 class="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 via-sky-500 via-violet-500 to-red-500 bg-clip-text text-transparent">
        DevOps → DevSecOps Learning Roadmap
      </h1>

      <!-- Personalization subtitle indicating target audience and market -->
      <p class="text-gray-400 text-base sm:text-lg mb-4">
        Personalized for Fawzy Mohamed | Saudi Arabia Market Focus
      </p>

      <!-- Quick stats bar showing total duration and phase count -->
      <div class="inline-flex flex-wrap justify-center gap-4 sm:gap-6 bg-gray-800/50 px-4 sm:px-6 py-3 rounded-xl">
        <div>
          <span class="text-gray-400">Total Duration: </span>
          <span class="font-semibold text-green-500">{{ totalDuration }}</span>
        </div>
        <div>
          <span class="text-gray-400">Phases: </span>
          <span class="font-semibold">{{ totalPhases }}</span>
        </div>
      </div>
    </div>

    <!--
      Priority Legend
      ===============
      Color-coded guide explaining the three priority levels:
      - Red (Must Know): Essential skills required for job applications
      - Yellow (Should Know): Commonly requested in technical interviews
      - Blue (Good to Know): Skills that differentiate candidates
    -->
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm text-gray-400">
      <span>🔴 Must Know = Required for job applications</span>
      <span>🟡 Should Know = Frequently requested in interviews</span>
      <span>🔵 Good to Know = Differentiates you from other candidates</span>
    </div>

    <!--
      Roadmap Timeline Component
      ==========================
      Main interactive component displaying:
      - Horizontal scrollable phase navigation cards
      - Detailed view of selected phase with expandable topics
      - Accordion-style topic cards showing subtopics/skills
    -->
    <RoadmapTimeline />

    <!--
      Stats Footer Component
      ======================
      Displays summary statistics:
      - Total phases, topics, and skills counts
      - Overall duration
      - Number of certifications
      - Priority level legend reminder
    -->
    <StatsFooter />
  </div>
</template>
