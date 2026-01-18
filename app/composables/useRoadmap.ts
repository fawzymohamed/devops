/**
 * useRoadmap Composable
 * =====================
 * Provides roadmap context and utilities across the application.
 */

import type { Roadmap } from '~/data/types'
import { allRoadmaps, getRoadmapById, getRoadmapBySlug } from '~/data/roadmaps'

/**
 * useRoadmap
 * ----------
 * Provides roadmap lookup, routing, and content path utilities.
 */
export function useRoadmap() {
  // =============================================================================
  // STATE
  // =============================================================================

  const currentRoadmap = useState<Roadmap | null>('current-roadmap', () => null)

  function setCurrentRoadmap(roadmap: Roadmap): void {
    currentRoadmap.value = roadmap
  }

  function setCurrentRoadmapBySlug(slug: string): boolean {
    const roadmap = getRoadmapBySlug(slug)
    if (!roadmap) return false
    setCurrentRoadmap(roadmap)
    return true
  }

  function getRoadmapFromRoute(): Roadmap | undefined {
    const route = useRoute()
    const queryRoadmap = typeof route.query.roadmap === 'string' ? route.query.roadmap : null
    if (queryRoadmap) {
      return getRoadmapById(queryRoadmap) ?? getRoadmapBySlug(queryRoadmap)
    }
    if (route.path.startsWith('/fullstack')) {
      return getRoadmapBySlug('fullstack')
    }
    return getRoadmapBySlug('devops')
  }

  // =============================================================================
  // CONTENT PATH HELPERS
  // =============================================================================

  /**
   * Build a fully-qualified content path including the roadmap root.
   */
  function buildContentPath(roadmapSlug: string, ...segments: string[]): string {
    const root = getContentPath(roadmapSlug)
    const suffix = segments.filter(Boolean).join('/')
    if (!root) return `/${suffix}`
    return `${root}/${suffix}`
  }

  /**
   * Get the content directory path for a topic.
   */
  function getContentTopicPath(roadmapSlug: string, phaseSlug: string, topicSlug: string): string {
    return buildContentPath(roadmapSlug, phaseSlug, topicSlug)
  }

  /**
   * Get the content file path for a lesson.
   */
  function getContentLessonPath(
    roadmapSlug: string,
    phaseSlug: string,
    topicSlug: string,
    subtopicSlug: string
  ): string {
    return buildContentPath(roadmapSlug, phaseSlug, topicSlug, subtopicSlug)
  }

  // =============================================================================
  // ROUTING HELPERS
  // =============================================================================

  function getContentPath(roadmapSlug: string): string {
    const roadmap = getRoadmapBySlug(roadmapSlug)
    if (!roadmap) return ''
    return roadmap.contentPath ? `/${roadmap.contentPath}` : ''
  }

  function getRoutePath(roadmapSlug: string, ...segments: string[]): string {
    const roadmap = getRoadmapBySlug(roadmapSlug)
    if (!roadmap) return ''
    const prefix = roadmap.routePrefix ? `/${roadmap.routePrefix}` : ''
    const suffix = segments.length ? `/${segments.join('/')}` : ''
    return `${prefix}${suffix}` || '/'
  }

  function getLessonPath(
    roadmapSlug: string,
    phase: string,
    topic: string,
    subtopic: string
  ): string {
    return getRoutePath(roadmapSlug, phase, topic, subtopic)
  }

  return {
    currentRoadmap: readonly(currentRoadmap),
    allRoadmaps,
    setCurrentRoadmap,
    setCurrentRoadmapBySlug,
    getRoadmapBySlug,
    getRoadmapById,
    getRoadmapFromRoute,
    getContentPath,
    getContentTopicPath,
    getContentLessonPath,
    getRoutePath,
    getLessonPath
  }
}
