<!--
  [subtopic].vue - Dynamic Lesson Page
  ====================================
  Displays lesson content from markdown files using @nuxt/content.
  Accessed via routes like /phase-1-sdlc/sdlc-models/waterfall-model

  Features:
  - Breadcrumb navigation back to roadmap
  - Lesson header with metadata (time, difficulty)
  - Learning objectives card
  - Markdown content rendering with prose styling
  - Table of contents sidebar (desktop)
  - Mark Complete button with progress tracking
  - Previous/Next lesson navigation

  Route Parameters:
  - phase: Phase slug (e.g., "phase-1-sdlc")
  - topic: Topic slug (e.g., "sdlc-models")
  - subtopic: Subtopic slug (e.g., "waterfall-model")

  Layout Structure:
  ┌─────────────────────────────────────────────────────────────┐
  │  Breadcrumb: Home > Phase > Topic > Lesson                  │
  ├─────────────────────────────────────────────────────────────┤
  │  Lesson Header: Title, Time, Difficulty                     │
  ├─────────────────────────────────────────────────────────────┤
  │  Learning Objectives Card                                   │
  ├──────────────────────────────────┬──────────────────────────┤
  │  Main Content (prose)            │  Table of Contents       │
  │                                  │  (sticky sidebar)        │
  ├──────────────────────────────────┴──────────────────────────┤
  │  Mark Complete Button                                       │
  ├─────────────────────────────────────────────────────────────┤
  │  Prev/Next Navigation                                       │
  └─────────────────────────────────────────────────────────────┘
-->

<script setup lang="ts">
import type { LessonFrontmatter } from '~/data/types'

/**
 * Content Error Types
 * -------------------
 * Nuxt Content v3 with ssr:false can fail in two distinct ways:
 *
 * 1. CLIENT CACHE ERROR: localStorage has corrupted base64 SQLite data
 *    - Symptom: atob() fails when decoding cached data
 *    - Fix: Clear localStorage and reload
 *
 * 2. SERVER CONTENT ERROR: sql_dump.txt returns empty (204 No Content)
 *    - Symptom: atob() fails on empty/invalid server response
 *    - Fix: Restart the dev server (server-side issue)
 *
 * Both produce similar atob errors, but require different fixes.
 * We detect which by checking if Content-related localStorage entries exist.
 *
 * @see https://github.com/nuxt/content/issues/3341
 */

/**
 * Check if localStorage has Content cache entries
 * -----------------------------------------------
 * If cache entries exist and we have an atob error, it's likely cache corruption.
 * If NO cache entries exist and we have an atob error, it's a server issue.
 */
function hasContentCacheEntries(): boolean {
  if (typeof window === 'undefined') return false

  const contentPatterns = [
    /^__nuxt_content/i,
    /^nuxt[-_]content/i,
    /^content:/i,
    /^_content/i,
    /^sql\.js/i,
    /sqlite/i,
    /^db[-_]cache/i
  ]

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && contentPatterns.some(pattern => pattern.test(key))) {
      return true
    }
  }
  return false
}

/**
 * Detect if error is related to content loading/decoding
 * ------------------------------------------------------
 * These errors occur when atob() fails on SQLite data (cached or from server)
 */
function isContentDecodingError(error: Error | null): boolean {
  if (!error) return false
  const message = error.message || ''
  return message.includes('atob') || message.includes('base64') || message.includes('not correctly encoded')
}

/**
 * Error Type Classification
 * -------------------------
 * Returns the type of content error for appropriate UI handling
 */
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

/**
 * Handle cache error reload
 * -------------------------
 * Clears localStorage cache and reloads the page.
 * Only effective for actual cache corruption issues.
 */
function handleCacheErrorReload(): void {
  if (typeof window === 'undefined') return

  // Clear all potential Content cache entries
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (/nuxt|content|sql|_content|db/i.test(key))) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))

  window.location.reload()
}

/**
 * Computed: Error type for template
 * ---------------------------------
 * Classifies the error for appropriate UI display
 */
const contentErrorType = computed(() => getContentErrorType(error.value ?? null))

/**
 * Handle simple page reload
 * -------------------------
 * Reloads the page without clearing cache (for server errors)
 */
function handleSimpleReload(): void {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

/**
 * Lesson Content Type
 * -------------------
 * Extends frontmatter with Nuxt Content fields
 */
interface LessonDocument extends LessonFrontmatter {
  path: string
  id: string
  /** Flag indicating if this is a cheat sheet */
  isCheatSheet?: boolean
  /** Topic name for cheat sheets */
  cheatSheetTopic?: string
  body: {
    toc?: {
      links: Array<{
        id: string
        text: string
        depth: number
        children?: Array<{
          id: string
          text: string
          depth: number
        }>
      }>
    }
  }
}

/**
 * Surround Item Type
 * ------------------
 * Type for prev/next navigation items
 */
interface SurroundItem {
  path: string
  title: string
}

/**
 * Route Parameters
 * ----------------
 * Extract phase, topic, and subtopic from the URL
 */
const route = useRoute()
const { phase, topic, subtopic } = route.params as {
  phase: string
  topic: string
  subtopic: string
}

const { getContentLessonPath, getRoadmapFromRoute, getRoutePath } = useRoadmap()

const currentRoadmap = computed(() => getRoadmapFromRoute())
const roadmapId = computed(() => currentRoadmap.value?.id ?? 'devops')

/**
 * Content Path
 * ------------
 * Build the path to query the markdown file using content collection paths.
 */
const contentPath = computed(() => {
  if (!currentRoadmap.value) return ''
  return getContentLessonPath(currentRoadmap.value.slug, phase, topic, subtopic)
})

const breadcrumbHome = computed(() => {
  if (!currentRoadmap.value) {
    return { label: 'Home', icon: 'i-lucide-home', to: '/' }
  }
  return {
    label: currentRoadmap.value.title,
    icon: 'i-lucide-home',
    to: getRoutePath(currentRoadmap.value.slug) || '/'
  }
})

/**
 * Fetch Lesson Content
 * --------------------
 * Query the markdown file using @nuxt/content v3
 */
const { data: lesson, error } = await useAsyncData(
  `lesson-${contentPath.value}`,
  async () => {
    const result = await queryCollection('content').path(contentPath.value).first()
    return result as LessonDocument | null
  }
)

/**
 * Fetch Prev/Next Navigation (Excluding Cheat Sheets)
 * ----------------------------------------------------
 * Get surrounding lessons using the standard API, then filter out cheat sheets
 * in the computed properties.
 */
const { data: surround } = await useAsyncData(
  `surround-${contentPath.value}`,
  async () => {
    const result = await queryCollectionItemSurroundings('content', contentPath.value, {
      fields: ['path', 'title', 'isCheatSheet']
    })
    // Result is [prev, next] array
    return result as unknown as [SurroundItem & { isCheatSheet?: boolean } | null, SurroundItem & { isCheatSheet?: boolean } | null] | null
  }
)

/**
 * Convert Content Path to Route Path
 * -----------------------------------
 * DevOps content is at root (e.g., /phase-1-sdlc/topic/lesson)
 * but routes use /devops prefix (e.g., /devops/phase-1-sdlc/topic/lesson)
 */
function contentPathToRoutePath(contentPath: string): string {
  // DevOps content paths don't have a prefix, but routes need /devops
  return `/devops${contentPath}`
}

/**
 * Computed: Previous and Next lessons (filtered)
 * -----------------------------------------------
 * Extract prev/next from surround array, skipping cheat sheets.
 * Transforms content paths to route paths for navigation.
 *
 * LIMITATION: If a cheat sheet is the immediate prev/next, we show nothing
 * instead of finding the next non-cheat-sheet. This is a known limitation.
 * Cheat sheets are typically at the end of a topic (99.cheat-sheet.md),
 * so this mainly affects navigation at topic boundaries.
 */
const prevLesson = computed((): SurroundItem | null => {
  const prev = surround.value?.[0]
  if (!prev) return null

  // Skip if it's a cheat sheet or belongs to a different roadmap
  if (prev.isCheatSheet === true) return null
  if (prev.path.startsWith('/fullstack/') || prev.path.startsWith('/architect/')) return null

  // Transform content path to route path
  return {
    ...prev,
    path: contentPathToRoutePath(prev.path)
  }
})

const nextLesson = computed((): SurroundItem | null => {
  const next = surround.value?.[1]
  if (!next) return null

  // Skip if it's a cheat sheet or belongs to a different roadmap
  if (next.isCheatSheet === true) return null
  if (next.path.startsWith('/fullstack/') || next.path.startsWith('/architect/')) return null

  // Transform content path to route path
  return {
    ...next,
    path: contentPathToRoutePath(next.path)
  }
})

/**
 * Progress Tracking
 * -----------------
 * Use the progress composable for completion tracking
 */
const { markComplete, isComplete, recordQuizScore } = useProgress()

/**
 * Computed: Is Lesson Completed
 * -----------------------------
 * Check if this lesson is marked as complete
 */
const lessonCompleted = computed(() => {
  return isComplete(roadmapId.value, phase, topic, subtopic)
})

/**
 * Computed: Is Cheat Sheet
 * ------------------------
 * Check if this content is a cheat sheet (uses different layout)
 */
const isCheatSheet = computed(() => {
  return lesson.value?.isCheatSheet === true
})

/**
 * Handle Mark Complete
 * --------------------
 * Mark the current lesson as complete with time tracking
 * Shows notification when phase is completed
 */
function handleMarkComplete() {
  // Get phase completion status before marking complete
  const wasPhaseComplete = isComplete(roadmapId.value, phase)

  // Mark the lesson as complete
  markComplete(roadmapId.value, phase, topic, subtopic, lesson.value?.estimatedMinutes)

  // Check if phase just became complete
  const isPhaseCompleteNow = isComplete(roadmapId.value, phase)

  // Show phase completion notification if phase was just completed
  if (!wasPhaseComplete && isPhaseCompleteNow) {
    // Get toast instance
    const toast = useToast()

    // Show congratulations toast with link to certificates
    toast.add({
      title: 'Phase Complete! 🎉',
      description: 'Congratulations! You\'ve completed this phase. View your certificate now!',
      icon: 'i-lucide-award',
      color: 'success',
      actions: [
        {
          label: 'View Certificate',
          onClick: () => {
            navigateTo(`/certificate?roadmap=${roadmapId.value}`)
          }
        }
      ]
    })
  }
}

/**
 * Badge Color Type
 * ----------------
 * Valid colors for UBadge component
 */
type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

/**
 * Difficulty Badge Color
 * ----------------------
 * Map difficulty level to badge color
 */
const difficultyColor = computed((): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error'
  }
  return colors[lesson.value?.difficulty ?? ''] || 'neutral'
})

/**
 * Format Phase Name
 * -----------------
 * Convert slug to readable name (e.g., "phase-1-sdlc" -> "Phase 1: SDLC")
 */
function formatPhaseName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/Phase (\d+)/, 'Phase $1:')
    .replace(/Sdlc/g, 'SDLC')
}

/**
 * Format Topic Name
 * -----------------
 * Convert slug to readable name (e.g., "sdlc-models" -> "SDLC Models")
 */
function formatTopicName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/Sdlc/g, 'SDLC')
}

/**
 * SEO Meta
 * --------
 * Set page title and description
 */
useSeoMeta({
  title: () => lesson.value?.title ?? 'Lesson',
  description: () => lesson.value?.description ?? ''
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!--
        Error State
        ===========
        Show error message if lesson fails to load.
        Different UI for cache errors vs server errors vs other errors.
      -->
      <template v-if="error">
        <!--
          Cache Corruption Error
          ======================
          localStorage has corrupted Content cache data.
          Fix: Clear cache and reload.
        -->
        <UCard
          v-if="contentErrorType === 'cache'"
          class="border-amber-500/50 bg-amber-500/10"
        >
          <div class="flex items-start gap-4">
            <UIcon
              name="i-lucide-database"
              class="w-6 h-6 text-amber-500 flex-shrink-0"
            />
            <div>
              <h3 class="font-medium text-amber-400">
                Content cache needs refresh
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                The browser cache was corrupted during development. Click reload to fix.
              </p>
              <p class="text-xs text-gray-500 mt-2">
                If reloading doesn't help, run: <code class="text-green-400">pnpm dev:reset</code>
              </p>
              <div class="flex gap-2 mt-3">
                <UButton
                  size="sm"
                  color="primary"
                  class="cursor-pointer"
                  @click="handleCacheErrorReload"
                >
                  <UIcon
                    name="i-lucide-refresh-cw"
                    class="w-4 h-4 mr-1"
                  />
                  Reload Page
                </UButton>
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  class="cursor-pointer"
                  :to="breadcrumbHome.to"
                >
                  Back to Roadmap
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!--
          Server Content Error
          ====================
          The dev server isn't providing sql_dump.txt properly.
          Fix: Restart the dev server.
        -->
        <UCard
          v-else-if="contentErrorType === 'server'"
          class="border-orange-500/50 bg-orange-500/10"
        >
          <div class="flex items-start gap-4">
            <UIcon
              name="i-lucide-server-off"
              class="w-6 h-6 text-orange-500 flex-shrink-0"
            />
            <div>
              <h3 class="font-medium text-orange-400">
                Content not available
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                The dev server isn't serving content properly. This usually happens after HMR issues or partial builds.
              </p>
              <p class="text-xs text-gray-500 mt-2">
                Fix: Stop the dev server and run: <code class="text-green-400">pnpm dev:reset</code>
              </p>
              <div class="flex gap-2 mt-3">
                <UButton
                  size="sm"
                  color="primary"
                  class="cursor-pointer"
                  @click="handleSimpleReload"
                >
                  <UIcon
                    name="i-lucide-refresh-cw"
                    class="w-4 h-4 mr-1"
                  />
                  Try Again
                </UButton>
                <UButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  class="cursor-pointer"
                  :to="breadcrumbHome.to"
                >
                  Back to Roadmap
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!--
          Other Errors
          ============
          Generic error handling for non-content-related issues.
        -->
        <UCard
          v-else
          class="border-red-500/50 bg-red-500/10"
        >
          <div class="flex items-start gap-4">
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-6 h-6 text-red-500 flex-shrink-0"
            />
            <div>
              <h3 class="font-medium text-red-400">
                Failed to load lesson
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                {{ error.message }}
              </p>
              <UButton
                size="sm"
                variant="soft"
                color="error"
                class="mt-3 cursor-pointer"
                :to="breadcrumbHome.to"
              >
                Back to Roadmap
              </UButton>
            </div>
          </div>
        </UCard>
      </template>

      <!--
        Not Found State
        ===============
        Show message if lesson doesn't exist
      -->
      <template v-else-if="!lesson">
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <UIcon
              name="i-lucide-file-question"
              class="w-8 h-8 text-gray-500"
            />
          </div>
          <h3 class="text-lg font-medium mb-2">
            Lesson Not Found
          </h3>
          <p class="text-gray-400 mb-6 max-w-sm">
            The lesson you're looking for doesn't exist or hasn't been created yet.
          </p>
          <UButton
            :to="breadcrumbHome.to"
            class="cursor-pointer"
          >
            Back to Roadmap
          </UButton>
        </div>
      </template>

      <!--
        Lesson Content
        ==============
        Main lesson display when content loads successfully
      -->
      <template v-else>
        <!--
          Cheat Sheet Layout
          ==================
          Uses dedicated layout for cheat sheet content
        -->
        <CheatSheetLayout
          v-if="isCheatSheet"
          :lesson="lesson"
          :phase="phase"
          :topic="topic"
          :subtopic="subtopic"
        />

        <!--
          Regular Lesson Layout
          =====================
          Standard lesson display with objectives, content, quiz
        -->
        <template v-else>
          <!--
            Breadcrumb Navigation
            =====================
            Shows path: Home > Phase > Topic > Lesson
            Uses Nuxt UI v4 items-based API
          -->
          <nav
            class="mb-6"
            aria-label="Breadcrumb"
          >
            <UBreadcrumb
              :items="[
                breadcrumbHome,
                { label: formatPhaseName(phase) },
                { label: formatTopicName(topic) },
                { label: lesson.title }
              ]"
            />
          </nav>

          <!--
          Lesson Header
          =============
          Title, estimated time, and difficulty badge
        -->
          <header class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-50 mb-4">
              {{ lesson.title }}
            </h1>

            <!-- Meta Info Badges -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Estimated Time -->
              <div class="flex items-center gap-1.5 text-sm text-gray-400">
                <UIcon
                  name="i-lucide-clock"
                  class="w-4 h-4"
                />
                <span>{{ lesson.estimatedMinutes }} min read</span>
              </div>

              <!-- Difficulty Badge -->
              <UBadge
                :color="difficultyColor"
                variant="subtle"
                size="sm"
              >
                <UIcon
                  name="i-lucide-signal"
                  class="w-3 h-3 mr-1"
                />
                {{ lesson.difficulty }}
              </UBadge>

              <!-- Completed Badge -->
              <UBadge
                v-if="lessonCompleted"
                color="success"
                variant="subtle"
                size="sm"
              >
                <UIcon
                  name="i-lucide-check-circle"
                  class="w-3 h-3 mr-1"
                />
                Completed
              </UBadge>
            </div>
          </header>

          <!--
          Learning Objectives Card
          ========================
          Display the lesson's learning objectives
        -->
          <UCard
            v-if="lesson.learningObjectives?.length"
            class="mb-8 bg-gray-900/50 ring-1 ring-gray-700"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-target"
                  class="w-5 h-5 text-green-500"
                />
                <h2 class="text-lg font-semibold">
                  Learning Objectives
                </h2>
              </div>
            </template>

            <ul class="space-y-3">
              <li
                v-for="(objective, idx) in lesson.learningObjectives"
                :key="idx"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 text-green-500 mt-1 flex-shrink-0"
                />
                <span class="text-gray-300">{{ objective }}</span>
              </li>
            </ul>
          </UCard>

          <!--
          Main Content Grid
          =================
          Content on left, TOC sidebar on right (desktop)
        -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!--
            Article Content
            ---------------
            Rendered markdown with prose styling
          -->
            <article class="lg:col-span-3">
              <div class="prose prose-invert prose-lg max-w-none">
                <ContentRenderer :value="lesson" />
              </div>
            </article>

            <!--
            Table of Contents Sidebar
            -------------------------
            Sticky sidebar showing heading links (desktop only)
          -->
            <aside class="hidden lg:block">
              <div class="sticky top-24">
                <UCard class="bg-gray-900/50 ring-1 ring-gray-700">
                  <template #header>
                    <h3 class="font-semibold text-sm text-gray-300">
                      On This Page
                    </h3>
                  </template>

                  <nav
                    v-if="lesson.body?.toc?.links?.length"
                    aria-label="Table of contents"
                  >
                    <ul class="space-y-2 text-sm">
                      <li
                        v-for="link in lesson.body.toc.links"
                        :key="link.id"
                      >
                        <a
                          :href="`#${link.id}`"
                          class="text-gray-400 hover:text-white transition-colors block py-1"
                        >
                          {{ link.text }}
                        </a>

                        <!-- Nested headings -->
                        <ul
                          v-if="link.children?.length"
                          class="ml-4 mt-1 space-y-1"
                        >
                          <li
                            v-for="child in link.children"
                            :key="child.id"
                          >
                            <a
                              :href="`#${child.id}`"
                              class="text-gray-500 hover:text-gray-300 transition-colors block py-1 text-xs"
                            >
                              {{ child.text }}
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>

                  <p
                    v-else
                    class="text-sm text-gray-500"
                  >
                    No headings found
                  </p>
                </UCard>
              </div>
            </aside>
          </div>

          <!--
          Quiz Section
          ============
          Knowledge check quiz from lesson frontmatter
        -->
          <section
            v-if="lesson.quiz?.questions?.length"
            class="mt-12"
          >
            <h2 class="text-2xl font-bold text-gray-50 mb-6 flex items-center gap-3">
              <UIcon
                name="i-lucide-brain"
                class="w-7 h-7 text-primary-500"
              />
              Test Your Knowledge
            </h2>
            <QuizContainer
              :quiz="lesson.quiz"
              @complete="(score, passed) => {
                // Always record the quiz score (keeps best score)
                recordQuizScore(roadmapId, phase, topic, subtopic, score)
                // Auto-complete lesson if quiz passed
                if (passed && !lessonCompleted) {
                  handleMarkComplete()
                }
              }"
            />
          </section>

          <!--
          Mark Complete Section
          =====================
          Button to mark lesson as complete
        -->
          <div class="mt-12 flex justify-center">
            <UButton
              v-if="!lessonCompleted"
              size="lg"
              color="primary"
              class="cursor-pointer"
              @click="handleMarkComplete"
            >
              <UIcon
                name="i-lucide-check-circle"
                class="w-5 h-5 mr-2"
              />
              Mark as Complete
            </UButton>

            <UButton
              v-else
              size="lg"
              color="success"
              variant="soft"
              class="cursor-pointer"
              disabled
            >
              <UIcon
                name="i-lucide-check-circle"
                class="w-5 h-5 mr-2"
              />
              Lesson Completed
            </UButton>
          </div>

          <!--
          Prev/Next Navigation
          ====================
          Links to surrounding lessons
        -->
          <nav
            class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
            aria-label="Lesson navigation"
          >
            <!-- Previous Lesson -->
            <NuxtLink
              v-if="prevLesson"
              :to="prevLesson.path"
              class="group"
            >
              <UCard
                class="h-full cursor-pointer ring-1 ring-gray-700 hover:ring-gray-600 hover:bg-gray-800/50 transition-all"
              >
                <div class="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <UIcon
                    name="i-lucide-arrow-left"
                    class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  />
                  Previous Lesson
                </div>
                <div class="font-semibold text-gray-200 group-hover:text-white transition-colors">
                  {{ prevLesson.title }}
                </div>
              </UCard>
            </NuxtLink>
            <div v-else />

            <!-- Next Lesson -->
            <NuxtLink
              v-if="nextLesson"
              :to="nextLesson.path"
              class="group"
            >
              <UCard
                class="h-full cursor-pointer ring-1 ring-gray-700 hover:ring-gray-600 hover:bg-gray-800/50 transition-all text-right"
              >
                <div class="flex items-center justify-end gap-2 text-gray-400 text-sm mb-1">
                  Next Lesson
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <div class="font-semibold text-gray-200 group-hover:text-white transition-colors">
                  {{ nextLesson.title }}
                </div>
              </UCard>
            </NuxtLink>
            <div v-else />
          </nav>
        </template>
      </template>
    </div>
  </div>
</template>
