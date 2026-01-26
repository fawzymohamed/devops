<!--
  AnimatedCounter.vue
  ===================
  Animated number counter that counts up when entering viewport.

  Features:
  - Intersection Observer for viewport detection
  - Smooth counting animation with easing
  - Configurable duration and format
  - Optional suffix (e.g., "+", "%")

  Usage:
  <AnimatedCounter :value="527" suffix="+" />
  <AnimatedCounter :value="100" suffix="%" :duration="1500" />
-->

<script setup lang="ts">
/**
 * Props
 * -----
 */
interface Props {
  /** Target value to count to */
  value: number
  /** Animation duration in ms */
  duration?: number
  /** Suffix to append (e.g., "+", "%") */
  suffix?: string
  /** Prefix to prepend (e.g., "$") */
  prefix?: string
  /** Start counting immediately (skip viewport check) */
  immediate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  suffix: '',
  prefix: '',
  immediate: false
})

/**
 * Reactive state
 */
const displayValue = ref(0)
const hasAnimated = ref(false)
const counterRef = ref<HTMLElement | null>(null)

/**
 * Easing function
 * ---------------
 * Ease out quad for smooth deceleration
 */
function easeOutQuad(t: number): number {
  return t * (2 - t)
}

/**
 * Animate the counter
 * -------------------
 * Counts from 0 to target value with easing
 */
function animateCounter() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  const startTime = performance.now()
  const startValue = 0
  const endValue = props.value

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const easedProgress = easeOutQuad(progress)

    displayValue.value = Math.round(startValue + (endValue - startValue) * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

/**
 * Intersection Observer
 * ---------------------
 * Trigger animation when element enters viewport
 */
onMounted(() => {
  if (props.immediate) {
    animateCounter()
    return
  }

  if (!counterRef.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated.value) {
          animateCounter()
        }
      })
    },
    { threshold: 0.2 }
  )

  observer.observe(counterRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
})

/**
 * Watch for value changes
 * -----------------------
 * Re-animate if value changes after initial animation
 */
watch(() => props.value, (newValue, oldValue) => {
  if (hasAnimated.value && newValue !== oldValue) {
    // Animate from current display value to new value
    const startTime = performance.now()
    const startValue = displayValue.value
    const endValue = newValue

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (props.duration / 2), 1)
      const easedProgress = easeOutQuad(progress)

      displayValue.value = Math.round(startValue + (endValue - startValue) * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }
})
</script>

<template>
  <span ref="counterRef">
    {{ prefix }}{{ displayValue.toLocaleString() }}{{ suffix }}
  </span>
</template>
