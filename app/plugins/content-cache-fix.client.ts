/**
 * Content Cache Fix Plugin (Client-Side)
 * =======================================
 * This plugin prevents the "Failed to execute 'atob'" error caused by
 * corrupted Nuxt Content v3 localStorage cache during HMR.
 *
 * The Problem:
 * - Nuxt Content v3 caches SQLite database dumps in localStorage
 * - During Hot Module Replacement (HMR), this cache can become corrupted
 * - Corrupted base64 data causes atob() to fail when decoding
 * - See: https://github.com/nuxt/content/issues/3341
 *
 * The Solution:
 * - Clear Content-related localStorage entries on app initialization
 * - Only runs in development mode to avoid affecting production
 * - Runs early to prevent the error before Content module loads cache
 *
 * @see https://github.com/nuxt/content/issues/3341
 */

export default defineNuxtPlugin({
  name: 'content-cache-fix',
  enforce: 'pre', // Run before other plugins
  setup() {
    // Only run in development mode
    if (import.meta.env.PROD) return

    // Only run on client
    if (typeof window === 'undefined') return

    try {
      clearContentCache()
    } catch (error) {
      console.warn('[Content Cache Fix] Failed to clear cache:', error)
    }
  }
})

/**
 * Clear Nuxt Content localStorage cache entries
 * ---------------------------------------------
 * Removes all localStorage entries that appear to be Nuxt Content cache.
 * This includes entries with common Content-related prefixes and patterns.
 */
function clearContentCache(): void {
  const keysToRemove: string[] = []

  // Scan localStorage for Content-related keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && isContentCacheKey(key)) {
      keysToRemove.push(key)
    }
  }

  // Remove identified cache entries
  if (keysToRemove.length > 0) {
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.info(`[Content Cache Fix] Cleared ${keysToRemove.length} cache entries`)
  }
}

/**
 * Check if a localStorage key is a Nuxt Content cache entry
 * ---------------------------------------------------------
 * Identifies keys that match known Nuxt Content caching patterns.
 *
 * Known patterns:
 * - __nuxt_content* - Content module cache
 * - nuxt-content* - Alternative cache prefix
 * - content:* - Content data cache
 * - _content* - Internal content cache
 * - sql.js* - SQLite.js related cache
 */
function isContentCacheKey(key: string): boolean {
  const contentPatterns = [
    /^__nuxt_content/i,
    /^nuxt[-_]content/i,
    /^content:/i,
    /^_content/i,
    /^sql\.js/i,
    /sqlite/i,
    /^db[-_]cache/i
  ]

  return contentPatterns.some(pattern => pattern.test(key))
}
