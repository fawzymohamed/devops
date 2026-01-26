<!--
  AnimatedBackground.vue
  ======================
  Reusable animated background component with gradient and floating shapes.

  Features:
  - Animated gradient background (emerald → cyan → violet)
  - Floating geometric shapes with blur effects
  - Particle-like dots moving slowly
  - Configurable colors and intensity

  Usage:
  <AnimatedBackground />
  <AnimatedBackground variant="subtle" />
-->

<script setup lang="ts">
/**
 * Props
 * -----
 * Configure the background appearance
 */
interface Props {
  /** Intensity variant: 'default' | 'subtle' | 'intense' */
  variant?: 'default' | 'subtle' | 'intense'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

/**
 * Floating shapes configuration
 * -----------------------------
 * Each shape has position, size, color, and animation timing
 */
const shapes = [
  { id: 1, type: 'circle', size: 300, x: 10, y: 20, color: 'emerald', delay: 0 },
  { id: 2, type: 'circle', size: 200, x: 80, y: 60, color: 'cyan', delay: 2 },
  { id: 3, type: 'hexagon', size: 150, x: 70, y: 10, color: 'violet', delay: 1 },
  { id: 4, type: 'circle', size: 100, x: 20, y: 70, color: 'cyan', delay: 3 },
  { id: 5, type: 'hexagon', size: 180, x: 90, y: 80, color: 'emerald', delay: 1.5 },
  { id: 6, type: 'circle', size: 120, x: 50, y: 30, color: 'violet', delay: 2.5 }
]

/**
 * Particle dots configuration
 * ---------------------------
 * Small floating dots scattered across the background
 */
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 4
}))

/**
 * Get opacity based on variant
 */
const getOpacity = computed(() => {
  switch (props.variant) {
    case 'subtle': return 0.3
    case 'intense': return 0.6
    default: return 0.4
  }
})

/**
 * Get color class for shape
 */
function getColorClass(color: string): string {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500',
    violet: 'bg-violet-500'
  }
  return colors[color] || 'bg-emerald-500'
}
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!--
      Animated Gradient Overlay
      =========================
      Shifting gradient background
    -->
    <div
      class="absolute inset-0 animated-gradient-bg"
      :style="{ opacity: getOpacity }"
    />

    <!--
      Floating Shapes
      ===============
      Large blurred geometric shapes
    -->
    <div
      v-for="shape in shapes"
      :key="shape.id"
      class="absolute rounded-full blur-3xl"
      :class="[
        getColorClass(shape.color),
        shape.id % 2 === 0 ? 'animate-float' : 'animate-float-reverse'
      ]"
      :style="{
        width: `${shape.size}px`,
        height: `${shape.size}px`,
        left: `${shape.x}%`,
        top: `${shape.y}%`,
        opacity: variant === 'subtle' ? 0.1 : 0.15,
        animationDelay: `${shape.delay}s`,
        transform: 'translate(-50%, -50%)'
      }"
    />

    <!--
      Particle Dots
      =============
      Small floating dots for depth
    -->
    <div
      v-for="particle in particles"
      :key="`particle-${particle.id}`"
      class="absolute rounded-full bg-white animate-float"
      :style="{
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        opacity: variant === 'subtle' ? 0.1 : 0.2,
        animationDelay: `${particle.delay}s`,
        animationDuration: `${particle.duration}s`
      }"
    />

    <!--
      Noise Texture Overlay
      =====================
      Subtle noise for texture (optional)
    -->
    <div
      class="absolute inset-0 opacity-[0.02]"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E');"
    />
  </div>
</template>
