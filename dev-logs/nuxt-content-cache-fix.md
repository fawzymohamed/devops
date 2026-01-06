# Nuxt Content v3 Error Handling Fix

**Date:** 2026-01-04 (Updated: 2026-01-06)
**Issue:** Content loading failures on lesson pages in development
**Status:** Resolved

---

## Problem Description

### Symptoms
- Lesson pages fail to load with cryptic errors
- Error messages may include: `Failed to execute 'atob'` or `not correctly encoded`
- Errors occur during development, especially after Hot Module Replacement (HMR)

### Root Causes (Two Distinct Issues)

Nuxt Content v3 with `ssr: false` loads content via a SQLite database served to the client. This can fail in two different ways:

#### 1. Client Cache Corruption
- **Cause:** localStorage contains corrupted base64-encoded SQLite data from a previous session
- **Trigger:** Usually after HMR or abrupt dev server shutdown
- **Fix:** Clear localStorage and reload

#### 2. Server Content Unavailability
- **Cause:** The dev server fails to serve `sql_dump.txt` (returns 204 No Content)
- **Trigger:** Partial `.nuxt` directory deletion, HMR state corruption, server in bad state
- **Fix:** Restart the dev server with `pnpm dev:reset`

Both issues produce similar `atob` errors, but require different fixes!

### Reference
- GitHub Issue: https://github.com/nuxt/content/issues/3341

---

## Solution Architecture

### 1. Smart Error Detection

The lesson page (`app/pages/[phase]/[topic]/[subtopic].vue`) now distinguishes between error types:

```typescript
type ContentErrorType = 'cache' | 'server' | 'other'

function getContentErrorType(error: Error | null): ContentErrorType {
  if (!error) return 'other'

  // Check if it's a content decoding error (atob/base64)
  if (isContentDecodingError(error)) {
    // If cache entries exist, it's likely cache corruption
    // If NO cache entries, it's a server issue (sql_dump.txt not served)
    return hasContentCacheEntries() ? 'cache' : 'server'
  }

  return 'other'
}
```

**Detection Logic:**
| Condition | Error Type | Recommended Fix |
|-----------|------------|-----------------|
| atob error + cache entries exist | `cache` | Reload page |
| atob error + no cache entries | `server` | Restart dev server |
| Other errors | `other` | Check error message |

### 2. Context-Aware Error UI

Different error messages guide users to the correct fix:

**Cache Error (amber):**
> "Content cache needs refresh"
> "The browser cache was corrupted during development. Click reload to fix."

**Server Error (orange):**
> "Content not available"
> "The dev server isn't serving content properly. This usually happens after HMR issues or partial builds."
> "Fix: Stop the dev server and run: `pnpm dev:reset`"

### 3. Proactive Cache Clearing (Plugin)

The client-side plugin clears Content cache on app initialization during development.

**File:** `app/plugins/content-cache-fix.client.ts`

```typescript
export default defineNuxtPlugin({
  name: 'content-cache-fix',
  enforce: 'pre',
  setup() {
    if (import.meta.env.PROD) return
    if (typeof window === 'undefined') return

    try {
      clearContentCache()
    } catch (error) {
      console.warn('[Content Cache Fix] Failed to clear cache:', error)
    }
  }
})
```

### 4. NPM Scripts for Manual Reset

**File:** `package.json`

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

---

## Files Changed

| File | Change |
|------|--------|
| `app/pages/[phase]/[topic]/[subtopic].vue` | Smart error detection and context-aware UI |
| `app/plugins/content-cache-fix.client.ts` | Proactive cache clearing plugin |
| `package.json` | Added `dev:clean`, `dev:reset` scripts and `rimraf` dependency |

---

## How It Works

### Normal Flow
```
1. User opens the app
2. Plugin clears any stale Content cache (dev mode only)
3. Client fetches sql_dump.txt from server
4. SQLite database loads in browser via sql.js
5. Content queries work normally
```

### Cache Error Recovery Flow
```
1. User visits lesson page
2. Error occurs decoding corrupted localStorage cache
3. Error detection finds cache entries exist → cache error
4. User sees "Content cache needs refresh" message
5. User clicks "Reload Page"
6. localStorage cleared, page reloads
7. Fresh data loads successfully
```

### Server Error Recovery Flow
```
1. User visits lesson page
2. sql_dump.txt returns 204 No Content
3. Error occurs trying to decode empty response
4. Error detection finds NO cache entries → server error
5. User sees "Content not available" message
6. User stops dev server and runs: pnpm dev:reset
7. Fresh server starts with rebuilt content
```

---

## Troubleshooting Guide

### "Content cache needs refresh" (amber)
1. Click "Reload Page" button
2. If persists, open DevTools → Application → Local Storage → Clear
3. If still persists, run `pnpm dev:reset`

### "Content not available" (orange)
1. Stop the dev server (Ctrl+C)
2. Run `pnpm dev:reset`
3. Wait for server to fully start
4. Refresh the page

### Generic errors (red)
1. Check the error message for clues
2. Check browser console for more details
3. Try `pnpm dev:reset` as a last resort

---

## Prevention Tips

1. **Avoid rapid file saves** during development - can trigger multiple HMR cycles
2. **Let the dev server shut down gracefully** - don't kill the terminal abruptly
3. **Use `pnpm dev:clean`** if you notice strange behavior before it escalates
4. **Don't delete `.nuxt` while server is running** - causes server state corruption

---

## Dependencies

```json
{
  "devDependencies": {
    "rimraf": "^6.0.0"
  }
}
```

`rimraf` provides cross-platform `rm -rf` functionality for the cleanup scripts.

---

## Technical Notes

- This is a known limitation of Nuxt Content v3's client-side SQLite approach
- The issue is more common on Windows due to file locking behavior
- Production builds are not affected (static generation)
- Future versions of Nuxt Content may address this at the framework level
