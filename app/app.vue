<!--
  App.vue - Root Application Component
  =====================================
  This is the root layout component that wraps the entire application.
  It provides the global structure including header, main content area, and footer.

  Features:
  - SEO configuration with meta tags and Open Graph support
  - Responsive header with navigation branding
  - Full-height main content area
  - Footer with copyright information

  Layout Structure:
  ┌─────────────────────────────────┐
  │           UHeader               │
  │  [Logo + Title]                 │
  ├─────────────────────────────────┤
  │                                 │
  │           UMain                 │
  │      (NuxtPage content)         │
  │                                 │
  ├─────────────────────────────────┤
  │           UFooter               │
  │  [Copyright]                    │
  └─────────────────────────────────┘
-->

<script setup lang="ts">
// =============================================================================
// COMPOSABLES
// =============================================================================

const { getPhaseCertificateStatuses } = useCertificate()

// =============================================================================
// STATE
// =============================================================================

/**
 * Count of earned certificates (unlocked phases)
 * Computed reactively from certificate statuses
 */
const earnedCertificatesCount = computed(() => {
  const statuses = getPhaseCertificateStatuses()
  return statuses.filter(s => s.status === 'unlocked').length
})

// =============================================================================
// HEAD CONFIGURATION
// =============================================================================

/**
 * Head Configuration
 * ------------------
 * Sets up essential HTML head elements:
 * - Viewport meta for responsive design
 * - Favicon link
 * - HTML language attribute
 * - Dark mode class on root element
 */
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
    class: 'dark'
  }
})

/**
 * SEO Meta Configuration
 * ----------------------
 * Defines metadata for search engines and social media sharing.
 * Includes Open Graph tags for rich previews on social platforms.
 */
const title = 'DevOps to DevSecOps Learning Roadmap'
const description
  = 'A comprehensive learning roadmap for transitioning from DevOps to DevSecOps, personalized for Fawzy Mohamed with Saudi Arabia market focus.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <!-- UApp: Nuxt UI root wrapper providing theme and styling context -->
  <UApp>
    <!-- Header: Fixed navigation bar at the top of the page -->
    <UHeader>
      <!-- Left slot: Application branding with logo and title -->
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <span class="text-2xl">🚀</span>
          <!-- Title hidden on mobile (sm:inline) for cleaner mobile header -->
          <span class="font-semibold text-lg hidden sm:inline">DevOps Roadmap</span>
        </NuxtLink>
      </template>

      <!-- Right slot: Navigation links -->
      <template #right>
        <nav class="flex items-center gap-4">
          <!-- Progress page link -->
          <NuxtLink
            to="/progress"
            class="flex items-center gap-1.5 text-sm text-gray-300 hover:text-gray-100 transition-colors cursor-pointer"
          >
            <UIcon
              name="i-lucide-bar-chart-2"
              class="h-4 w-4"
            />
            <span class="hidden sm:inline">Progress</span>
          </NuxtLink>

          <!-- Certificate page link with earned count badge -->
          <NuxtLink
            to="/certificate"
            class="flex items-center gap-1.5 text-sm text-gray-300 hover:text-gray-100 transition-colors cursor-pointer relative"
          >
            <UIcon
              name="i-lucide-award"
              class="h-4 w-4"
            />
            <span class="hidden sm:inline">Certificates</span>
            <!-- Badge showing earned certificate count -->
            <UBadge
              v-if="earnedCertificatesCount > 0"
              :label="earnedCertificatesCount.toString()"
              color="success"
              variant="solid"
              size="xs"
              class="absolute -top-1 -right-2 sm:relative sm:top-0 sm:right-0"
            />
          </NuxtLink>
        </nav>
      </template>
    </UHeader>

    <!-- Main: Primary content area with minimum full viewport height -->
    <UMain class="min-h-screen">
      <!-- UContainer: Constrains content width and adds horizontal padding -->
      <UContainer>
        <!-- NuxtPage: Renders the current route's page component -->
        <NuxtPage />
      </UContainer>
    </UMain>

    <!-- Footer: Site-wide footer with copyright information -->
    <UFooter>
      <!-- Left slot: Copyright and attribution text -->
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • DevOps Learning Roadmap ©
          {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
