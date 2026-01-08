<!--
  IllustrationTeamComposition Component
  ======================================
  A reusable SVG component for rendering team roles in a container.
  Features hand-drawn aesthetic with role cards and responsibilities.

  Use Cases:
  - Scrum Team
  - DevOps Team Structure
  - Any team/role diagram

  Structure:
  ┌──────────────────────────────────────────────────────────────┐
  │                        Team Title                            │
  │                        (subtitle)                            │
  │  ┌─────────┐    ┌─────────┐    ┌─────────┐                  │
  │  │  👤     │    │  👥     │    │  🎯     │                  │
  │  │ Role 1  │    │ Role 2  │    │ Role 3  │                  │
  │  │ ─────── │    │ ─────── │    │ ─────── │                  │
  │  │ • Resp1 │    │ • Resp1 │    │ • Resp1 │                  │
  │  │ • Resp2 │    │ • Resp2 │    │ • Resp2 │                  │
  │  └─────────┘    └─────────┘    └─────────┘                  │
  │                                                              │
  │  * Footnote text                                            │
  └──────────────────────────────────────────────────────────────┘

  Props:
  - title: Main title text
  - subtitle: Optional subtitle
  - roles: Array of role objects
  - footnote: Optional footnote text
-->

<template>
  <div :class="['illustration-team-composition', sizeClass]">
    <svg
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      class="w-full h-auto"
      role="img"
      :aria-label="`Team composition: ${title}`"
    >
      <!-- Main Container -->
      <rect
        x="15"
        y="15"
        :width="viewBox.width - 30"
        :height="viewBox.height - 30"
        :rx="SPACING.borderRadius + 4"
        :fill="COLORS.gray.main"
        :fill-opacity="OPACITY.boxFill * 0.3"
        :stroke="COLORS.gray.main"
        :stroke-width="STROKES.containerStrokeWidth"
        :stroke-dasharray="STROKES.containerDash"
        :transform="`rotate(${getHandDrawnRotation(0)}, ${viewBox.width / 2}, ${viewBox.height / 2})`"
      />

      <!-- Title Section -->
      <g :transform="`translate(${viewBox.width / 2}, 50)`">
        <!-- Main title -->
        <text
          x="0"
          y="0"
          :fill="COLORS.gray.text"
          :font-size="TYPOGRAPHY.titleSize + 2"
          :font-family="TYPOGRAPHY.fontFamily"
          font-weight="700"
          text-anchor="middle"
        >{{ title }}</text>

        <!-- Subtitle -->
        <text
          v-if="subtitle"
          x="0"
          y="20"
          :fill="COLORS.gray.light"
          :font-size="TYPOGRAPHY.sublabelSize"
          :font-family="TYPOGRAPHY.fontFamily"
          text-anchor="middle"
          opacity="0.8"
        >{{ subtitle }}</text>
      </g>

      <!-- Role Cards -->
      <g
        v-for="(role, index) in roles"
        :key="index"
      >
        <g :transform="getRoleTransform(index)">
          <!-- Role card background -->
          <rect
            x="0"
            y="0"
            :width="SPACING.largeBoxWidth"
            :height="roleCardHeight"
            :rx="SPACING.borderRadius"
            :fill="getColor(role.color).main"
            :fill-opacity="OPACITY.boxFill"
            :stroke="getColor(role.color).main"
            :stroke-width="STROKES.boxStrokeWidth"
            :stroke-dasharray="STROKES.boxDash"
            :transform="`rotate(${getHandDrawnRotation(index + 1)}, ${SPACING.largeBoxWidth / 2}, ${roleCardHeight / 2})`"
          />

          <!-- Role icon - using foreignObject for better emoji rendering -->
          <circle
            :cx="SPACING.largeBoxWidth / 2"
            cy="30"
            r="20"
            :fill="getColor(role.color).main"
            :fill-opacity="OPACITY.iconCircleFill"
          />
          <foreignObject
            :x="SPACING.largeBoxWidth / 2 - 14"
            y="16"
            width="28"
            height="28"
          >
            <span class="flex items-center justify-center w-full h-full text-lg">{{ role.icon }}</span>
          </foreignObject>

          <!-- Role name -->
          <text
            :x="SPACING.largeBoxWidth / 2"
            y="65"
            :fill="getColor(role.color).text"
            :font-size="TYPOGRAPHY.titleSize"
            :font-family="TYPOGRAPHY.fontFamily"
            font-weight="700"
            text-anchor="middle"
          >{{ role.name }}</text>

          <!-- Owns label -->
          <text
            :x="SPACING.largeBoxWidth / 2"
            y="82"
            :fill="getColor(role.color).light"
            :font-size="TYPOGRAPHY.smallSize"
            :font-family="TYPOGRAPHY.fontFamily"
            text-anchor="middle"
            opacity="0.8"
          >Owns: {{ role.owns }}</text>

          <!-- Divider line -->
          <line
            x1="15"
            y1="95"
            :x2="SPACING.largeBoxWidth - 15"
            y2="95"
            :stroke="getColor(role.color).light"
            :stroke-width="1"
            :stroke-dasharray="STROKES.boxDash"
            opacity="0.5"
          />

          <!-- Responsibilities -->
          <g
            v-for="(resp, respIndex) in role.responsibilities"
            :key="respIndex"
          >
            <text
              x="15"
              :y="115 + respIndex * 18"
              :fill="getColor(role.color).text"
              :font-size="TYPOGRAPHY.smallSize"
              :font-family="TYPOGRAPHY.fontFamily"
            >
              <tspan :fill="getColor(role.color).light">•</tspan>
              {{ ' ' + resp }}
            </text>
          </g>
        </g>
      </g>

      <!-- Footnote -->
      <text
        v-if="footnote"
        :x="viewBox.width / 2"
        :y="viewBox.height - 25"
        :fill="COLORS.gray.light"
        :font-size="TYPOGRAPHY.smallSize"
        :font-family="TYPOGRAPHY.fontFamily"
        text-anchor="middle"
        font-style="italic"
      >{{ footnote }}</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * IllustrationTeamComposition
 * ---------------------------
 * Renders a team structure with role cards showing
 * responsibilities and ownership.
 */

import {
  COLORS,
  SPACING,
  STROKES,
  OPACITY,
  TYPOGRAPHY,
  getColor,
  calculateTeamViewBox,
  getHandDrawnRotation
} from '~/composables/useIllustrationDesign'

// =============================================================================
// TYPES
// =============================================================================

interface Role {
  name: string
  owns: string
  icon: string
  color: string
  responsibilities: string[]
}

/** Available size options for the illustration */
type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

/** Map size prop to Tailwind max-width classes */
const SIZE_CLASSES: Record<IllustrationSize, string> = {
  'sm': 'max-w-sm', // 384px
  'md': 'max-w-md', // 448px
  'lg': 'max-w-lg', // 512px
  'xl': 'max-w-xl', // 576px
  '2xl': 'max-w-2xl', // 672px - default for team compositions
  '3xl': 'max-w-3xl', // 768px
  'full': 'max-w-full'
}

// =============================================================================
// PROPS
// =============================================================================

const props = withDefaults(defineProps<{
  /** Team title */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Array of roles */
  roles: Role[]
  /** Optional footnote */
  footnote?: string
  /** Size of the illustration (controls max-width) */
  size?: IllustrationSize
}>(), {
  subtitle: '',
  footnote: '',
  size: 'full'
})

// =============================================================================
// COMPUTED VALUES
// =============================================================================

/** Get the max-width class based on size prop */
const sizeClass = computed(() => SIZE_CLASSES[props.size])

/** Calculate viewBox dimensions */
const viewBox = computed(() => {
  return calculateTeamViewBox(props.roles.length)
})

/** Calculate role card height based on max responsibilities */
const roleCardHeight = computed(() => {
  const maxResponsibilities = Math.max(...props.roles.map(r => r.responsibilities.length))
  return 110 + maxResponsibilities * 18 + 15
})

/** Starting X position for role cards */
const rolesStartX = computed(() => {
  const totalRolesWidth = props.roles.length * SPACING.largeBoxWidth + (props.roles.length - 1) * 20
  return (viewBox.value.width - totalRolesWidth) / 2
})

// =============================================================================
// POSITION CALCULATIONS
// =============================================================================

/** Get transform for each role card */
function getRoleTransform(index: number): string {
  const x = rolesStartX.value + index * (SPACING.largeBoxWidth + 20)
  const y = 85
  return `translate(${x}, ${y})`
}
</script>

<style scoped>
.illustration-team-composition {
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>
