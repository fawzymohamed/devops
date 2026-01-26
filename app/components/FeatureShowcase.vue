<!--
  FeatureShowcase.vue
  ===================
  Feature grid showcasing the platform's capabilities.

  Features:
  - 4 feature cards in a responsive grid
  - Icon animations on hover
  - Staggered entrance animation
  - Glass morphism styling

  Features Shown:
  1. Progress Tracking
  2. Interactive Quizzes
  3. Certificates
  4. Cheat Sheets
-->

<script setup lang="ts">
/**
 * Feature definitions
 * -------------------
 * Each feature has icon, title, description, and accent color
 */
const features = [
  {
    id: 'progress',
    icon: 'i-lucide-bar-chart-3',
    title: 'Progress Tracking',
    description: 'Track your learning journey with detailed progress metrics and time spent.',
    color: 'emerald'
  },
  {
    id: 'quizzes',
    icon: 'i-lucide-brain',
    title: 'Interactive Quizzes',
    description: 'Test your knowledge with quizzes after each lesson to reinforce learning.',
    color: 'cyan'
  },
  {
    id: 'certificates',
    icon: 'i-lucide-award',
    title: 'Certificates',
    description: 'Earn certificates as you complete phases and showcase your achievements.',
    color: 'violet'
  },
  {
    id: 'cheatsheets',
    icon: 'i-lucide-file-text',
    title: 'Cheat Sheets',
    description: 'Quick reference guides with PDF export for offline access.',
    color: 'amber'
  }
]

/**
 * Get color classes for feature
 */
function getColorClasses(color: string): { bg: string, text: string, ring: string } {
  const colors: Record<string, { bg: string, text: string, ring: string }> = {
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      ring: 'ring-emerald-500/30'
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-400',
      ring: 'ring-cyan-500/30'
    },
    violet: {
      bg: 'bg-violet-500/20',
      text: 'text-violet-400',
      ring: 'ring-violet-500/30'
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      ring: 'ring-amber-500/30'
    }
  }
  return colors[color] ?? colors['emerald']!
}
</script>

<template>
  <section class="py-16">
    <!--
      Section Header
      ==============
    -->
    <div class="text-center mb-12">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">
        Everything You Need to <span class="gradient-text">Master Tech</span>
      </h2>
      <p class="text-gray-400 max-w-2xl mx-auto">
        Comprehensive learning tools designed to help you succeed in your tech career.
      </p>
    </div>

    <!--
      Features Grid
      =============
      4 cards in responsive grid with staggered animation
    -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(feature, index) in features"
        :key="feature.id"
        class="group relative p-6 rounded-xl glass transition-all duration-300 hover:scale-105 animate-slide-up cursor-default"
        :class="`stagger-${index + 1}`"
        :style="{ opacity: 0 }"
      >
        <!--
          Icon Container
          ==============
          Animated icon with color accent
        -->
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 ring-1 transition-transform duration-300 group-hover:scale-110"
          :class="[
            getColorClasses(feature.color).bg,
            getColorClasses(feature.color).ring
          ]"
        >
          <UIcon
            :name="feature.icon"
            class="w-6 h-6 transition-transform duration-300 group-hover:rotate-12"
            :class="getColorClasses(feature.color).text"
          />
        </div>

        <!--
          Title & Description
          ===================
        -->
        <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {{ feature.title }}
        </h3>
        <p class="text-sm text-gray-400">
          {{ feature.description }}
        </p>

        <!--
          Hover Gradient Accent
          =====================
          Subtle gradient on hover
        -->
        <div
          class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          :class="[
            feature.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/5 to-transparent'
            : feature.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/5 to-transparent'
              : feature.color === 'violet' ? 'bg-gradient-to-br from-violet-500/5 to-transparent'
                : 'bg-gradient-to-br from-amber-500/5 to-transparent'
          ]"
        />
      </div>
    </div>
  </section>
</template>
