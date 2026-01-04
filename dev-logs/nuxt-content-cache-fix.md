# Nuxt Content v3 Cache Corruption Fix

**Date:** 2026-01-04
**Issue:** "Failed to execute 'atob'" error on lesson pages
**Status:** Resolved

---

## Problem Description

### Symptoms
- Lesson pages fail to load with a cryptic error
- Browser console shows: `Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded`
- Error occurs randomly, especially after Hot Module Replacement (HMR) during development
- Restarting the dev server temporarily fixes the issue

### Root Cause
Nuxt Content v3 uses SQLite (via sql.js) to store and query content. During development:

1. The SQLite database is serialized and cached in the browser's localStorage
2. The cache uses base64 encoding for the binary SQLite data
3. During HMR, the cache can become corrupted or out of sync
4. When the app tries to decode the corrupted base64 data, `atob()` fails

### Reference
- GitHub Issue: https://github.com/nuxt/content/issues/3341

---

## Solution Architecture

### 1. Proactive Cache Clearing (Plugin)

Created a client-side Nuxt plugin that clears Content cache on every app initialization during development.

**File:** `app/plugins/content-cache-fix.client.ts`

```typescript
export default defineNuxtPlugin({
  name: 'content-cache-fix',
  enforce: 'pre', // Run before other plugins
  setup() {
    // Only run in development mode
    if (import.meta.env.PROD) return
    if (typeof window === 'undefined') return

    try {
      clearContentCache()
    } catch (error) {
      console.warn('[Content Cache Fix] Failed to clear cache:', error)
    }
  }
})

function clearContentCache(): void {
  const keysToRemove: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && isContentCacheKey(key)) {
      keysToRemove.push(key)
    }
  }

  if (keysToRemove.length > 0) {
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.info(`[Content Cache Fix] Cleared ${keysToRemove.length} cache entries`)
  }
}

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
```

### 2. NPM Scripts for Manual Reset

Added convenience scripts to `package.json` for when automatic fix isn't enough:

```json
{
  "scripts": {
    "dev:clean": "nuxi cleanup && nuxt dev",
    "dev:reset": "rimraf .data/content .nuxt && nuxi cleanup && nuxt dev"
  }
}
```

| Script | Purpose |
|--------|---------|
| `pnpm dev:clean` | Quick cleanup - clears Nuxt cache and restarts |
| `pnpm dev:reset` | Full reset - deletes SQLite DB, all caches, and restarts |

### 3. User-Friendly Error UI

Modified `app/pages/[phase]/[topic]/[subtopic].vue` to show a helpful message when cache errors occur:

```vue
<UCard v-if="isContentCacheError(error)" class="border-amber-500/50 bg-amber-500/10">
  <div class="flex items-start gap-4">
    <UIcon name="i-lucide-database" class="w-6 h-6 text-amber-500" />
    <div>
      <h3 class="font-medium text-amber-400">Content cache needs refresh</h3>
      <p class="text-sm text-gray-400 mt-1">
        The content cache was corrupted during development. Click reload to fix.
      </p>
      <p class="text-xs text-gray-500 mt-2">
        If reloading doesn't help, run: <code class="text-green-400">pnpm dev:reset</code>
      </p>
      <div class="flex gap-2 mt-3">
        <UButton @click="handleCacheErrorReload">Reload Page</UButton>
        <UButton variant="soft" to="/">Back to Roadmap</UButton>
      </div>
    </div>
  </div>
</UCard>
```

---

## Files Changed

| File | Change |
|------|--------|
| `app/plugins/content-cache-fix.client.ts` | New - Proactive cache clearing plugin |
| `package.json` | Added `dev:clean`, `dev:reset` scripts and `rimraf` dependency |
| `app/pages/[phase]/[topic]/[subtopic].vue` | Simplified error handling UI |

---

## How It Works

### Normal Flow (After Fix)
```
1. User opens the app
2. Plugin runs (client-side, dev mode only)
3. All Content-related localStorage entries are cleared
4. Nuxt Content fetches fresh data from server
5. Page loads successfully
```

### Error Recovery Flow
```
1. Cache corruption occurs during HMR
2. Page fails to load with atob error
3. User sees friendly error message
4. User clicks "Reload Page"
5. Page reloads, plugin clears cache
6. Fresh data loads successfully
```

### Manual Recovery (Last Resort)
```bash
# If automatic fix doesn't work
pnpm dev:reset

# This will:
# 1. Delete .data/content/contents.sqlite
# 2. Delete .nuxt build cache
# 3. Run nuxi cleanup
# 4. Start fresh dev server
```

---

## Testing

Tested with Playwright on 2026-01-04:

1. Navigated to home page - Loaded successfully
2. Navigated to Scrum Framework lesson - Loaded successfully
3. All illustrations rendered correctly:
   - Team Composition (IllustrationTeamComposition)
   - Sprint Flow (IllustrationLinearFlow - horizontal, 5 items)
   - Timeboxing Benefits (IllustrationChecklist)
   - Definition of Done (IllustrationChecklist)
   - Scrum vs DevOps (IllustrationComparisonMap)

---

## Prevention Tips

1. **Avoid rapid file saves** during development - can trigger multiple HMR cycles
2. **Use `pnpm dev:clean`** if you notice strange behavior
3. **Clear browser localStorage** if issues persist
4. **Don't kill the dev server abruptly** - let it shut down gracefully

---

## Related Issues

- This is a known issue with Nuxt Content v3's client-side caching mechanism
- The issue is more common on Windows due to file locking behavior
- Future versions of Nuxt Content may address this at the framework level

---

## Dependencies Added

```json
{
  "devDependencies": {
    "rimraf": "^6.0.0"
  }
}
```

`rimraf` provides cross-platform `rm -rf` functionality for the cleanup scripts.
