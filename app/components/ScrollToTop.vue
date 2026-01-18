<!--
  ScrollToTop.vue - Scroll to Top Button Component
  =================================================
  A floating action button that appears after scrolling down and smoothly
  scrolls the page back to the top when clicked.

  Features:
  - Appears only after scrolling 300px down the page
  - Fixed positioning in bottom-right corner
  - Smooth fade-in/out animation with slide effect
  - Accessible with ARIA labels and keyboard support
  - Responsive sizing and positioning for mobile/desktop
  - SSR-safe with client-side scroll detection

  Visual Structure:
  ┌────────────────────────────────┐
  │                                │
  │                                │
  │         Page Content           │
  │                                │
  │                      ┌───┐     │ <- Appears after 300px scroll
  │                      │ ↑ │     │
  │                      └───┘     │
  └────────────────────────────────┘

  UX Behavior:
  - Hidden by default (scroll < 300px)
  - Fades in with upward slide when threshold crossed
  - Scales up slightly on hover for feedback
  - Smooth scroll animation to top on click
  - High z-index (z-50) to stay above content
-->

<script setup lang="ts">
// =============================================================================
// STATE MANAGEMENT
// =============================================================================

/**
 * Visibility State
 * ----------------
 * Tracks whether the scroll-to-top button should be visible.
 * True when user has scrolled more than 300px down the page.
 */
const isVisible = ref(false)

/**
 * Scroll Threshold
 * ----------------
 * Minimum scroll distance (in pixels) before button appears.
 * 300px is roughly 1.5 viewport heights on desktop.
 */
const SCROLL_THRESHOLD = 300

// =============================================================================
// SCROLL HANDLING
// =============================================================================

/**
 * Check Scroll Position
 * ---------------------
 * Updates visibility state based on current scroll position.
 * Called on scroll events (throttled) and on mount.
 */
function checkScrollPosition() {
  // Only run on client-side (SSR safety)
  if (typeof window === 'undefined') return

  isVisible.value = window.scrollY > SCROLL_THRESHOLD
}

/**
 * Throttle Helper
 * ---------------
 * Limits function execution to once per interval for performance.
 * Prevents excessive state updates during rapid scrolling.
 *
 * @param func - Function to throttle
 * @param delay - Minimum time between executions (ms)
 * @returns Throttled function
 */
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * Throttled Scroll Handler
 * -------------------------
 * Throttled version of checkScrollPosition (runs max once per 100ms).
 * Improves performance by reducing unnecessary state updates.
 */
const handleScroll = throttle(checkScrollPosition, 100)

// =============================================================================
// SCROLL TO TOP ACTION
// =============================================================================

/**
 * Scroll to Top
 * -------------
 * Smoothly scrolls the page back to the top.
 * Uses native smooth scrolling (performant and accessible).
 */
function scrollToTop() {
  if (typeof window === 'undefined') return

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// =============================================================================
// LIFECYCLE HOOKS
// =============================================================================

/**
 * Component Mount
 * ---------------
 * Set up scroll listener and check initial position.
 * Only runs on client-side (SSR safety).
 */
onMounted(() => {
  // Check initial scroll position
  checkScrollPosition()

  // Add throttled scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })
})

/**
 * Component Unmount
 * -----------------
 * Clean up scroll listener to prevent memory leaks.
 */
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <!--
    Scroll to Top Button Container
    ===============================
    Fixed positioning button in bottom-right corner.
    Only rendered when visible to avoid unnecessary DOM updates.
  -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-2 scale-50"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-50"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group"
    >
      <!--
        Button Element
        ==============
        Extra large circular button with gradient background, glow effect, and animations.
        Features:
        - Gradient from emerald to primary color
        - Subtle pulse animation to draw attention
        - Glow effect on hover
        - Scale and bounce animation on hover
        - Larger size (w-16 h-16) for better visibility and touch targets
      -->
      <button
        class="cursor-pointer relative w-12 h-12 md:w-14 md:h-14 rounded-full
               bg-gradient-to-br from-emerald-500 to-primary-500
               shadow-2xl shadow-emerald-500/20
               hover:shadow-emerald-500/40 hover:scale-110
               transition-all duration-300 ease-out
               flex items-center justify-center
               animate-pulse hover:animate-none
               group-hover:rotate-12"
        aria-label="Scroll to top"
        @click="scrollToTop"
      >
        <!-- Glow effect ring -->
        <div
          class="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-primary-400
                 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"
        />

        <!-- Arrow icon with bounce animation on hover -->
        <UIcon
          name="i-lucide-arrow-up"
          class="w-5 h-5 md:w-6 md:h-6 text-white relative z-10
                 group-hover:-translate-y-1 transition-transform duration-300"
        />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/**
 * Custom Pulse Animation
 * ======================
 * Subtle pulse effect that draws attention without being distracting.
 * Pauses on hover to prevent motion sickness.
 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hover\:animate-none:hover {
  animation: none;
}
</style>
