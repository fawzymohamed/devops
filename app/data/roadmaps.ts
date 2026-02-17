/**
 * Roadmaps Registry
 * =================
 * Central registry for all available roadmaps.
 */

import { devopsPhases, totalWeeks as devopsTotalWeeks } from './roadmap'
import { fullstackPhases } from './fullstack-roadmap'
import { combinedPhases } from './combined-roadmap'
import type { Roadmap } from './types'

function countTopics(phases: Roadmap['phases']): number {
  return phases.reduce((total, phase) => total + phase.topics.length, 0)
}

function countSubtopics(phases: Roadmap['phases']): number {
  return phases.reduce(
    (total, phase) => total + phase.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0),
    0
  )
}

function sumWeeks(phases: Roadmap['phases']): number {
  return phases.reduce((total, phase) => {
    const match = phase.duration.match(/(\d+)/)
    if (!match) {
      return total
    }
    return total + parseInt(match[1]!, 10)
  }, 0)
}

export const devopsRoadmap: Roadmap = {
  id: 'devops',
  slug: 'devops',
  title: 'DevOps Roadmap',
  description: 'Master DevOps from SDLC to DevSecOps certification',
  fullDescription: 'Comprehensive path to becoming a DevOps engineer.',
  icon: 'DevOps',
  certificateTitle: 'DevOps Master Certificate',
  contentPath: '',
  routePrefix: 'devops',
  priorityLabels: {
    essential: 'Must Know',
    important: 'Should Know',
    recommended: 'Good to Know'
  },
  phases: devopsPhases,
  stats: {
    phaseCount: devopsPhases.length,
    topicCount: countTopics(devopsPhases),
    subtopicCount: countSubtopics(devopsPhases),
    totalWeeks: devopsTotalWeeks
  }
}

export const fullstackRoadmap: Roadmap = {
  id: 'fullstack',
  slug: 'fullstack',
  title: 'Full Stack Developer Interview Mastery',
  description: 'Master JavaScript, TypeScript, Vue, React, Node.js, and more',
  fullDescription: 'Comprehensive roadmap for full stack developer interviews.',
  icon: 'FullStack',
  certificateTitle: 'Full Stack Interview Mastery Certificate',
  contentPath: 'fullstack',
  routePrefix: 'fullstack',
  priorityLabels: {
    essential: 'Must Know',
    important: 'Should Know',
    recommended: 'Good to Know'
  },
  phases: fullstackPhases,
  stats: {
    phaseCount: fullstackPhases.length,
    topicCount: countTopics(fullstackPhases),
    subtopicCount: countSubtopics(fullstackPhases),
    totalWeeks: sumWeeks(fullstackPhases)
  }
}

export const combinedRoadmap: Roadmap = {
  id: 'architect',
  slug: 'architect',
  title: 'The AI-Age DevOps Architect',
  description: 'System architecture, AI-augmented engineering, and deep DevOps/Security skills',
  fullDescription: 'A combined roadmap for the AI age — deep architectural thinking, DevOps mastery, and the meta-skills to orchestrate AI agents effectively.',
  icon: 'Architect',
  certificateTitle: 'The AI-Age DevOps Architect Certificate',
  contentPath: 'architect',
  routePrefix: 'architect',
  priorityLabels: {
    essential: 'Must Know',
    important: 'Should Know',
    recommended: 'Good to Know'
  },
  phases: combinedPhases,
  stats: {
    phaseCount: combinedPhases.length,
    topicCount: countTopics(combinedPhases),
    subtopicCount: countSubtopics(combinedPhases),
    totalWeeks: sumWeeks(combinedPhases)
  }
}

export const allRoadmaps: Roadmap[] = [combinedRoadmap, fullstackRoadmap, devopsRoadmap]

export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return allRoadmaps.find(roadmap => roadmap.slug === slug)
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return allRoadmaps.find(roadmap => roadmap.id === id)
}
