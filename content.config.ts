/**
 * Nuxt Content Configuration
 * ==========================
 * Defines content collections and their schemas for the LMS.
 *
 * @see https://content.nuxt.com/docs/getting-started/configuration
 */

import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    /**
     * Lessons Collection
     * ------------------
     * All markdown lesson files with frontmatter validation.
     * Located in content/ directory with any nesting.
     */
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        estimatedMinutes: z.number(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        learningObjectives: z.array(z.string()),
        prerequisites: z.array(z.string()).optional(),
        quiz: z.object({
          passingScore: z.number(),
          questions: z.array(z.object({
            question: z.string(),
            type: z.enum(['single', 'multiple', 'true-false']),
            options: z.array(z.string()).optional(),
            correctAnswer: z.union([z.string(), z.boolean()]).optional(),
            correctAnswers: z.array(z.string()).optional(),
            explanation: z.string()
          }))
        }).optional(),
        // Cheat sheet specific fields
        isCheatSheet: z.boolean().optional().default(false),
        cheatSheetTopic: z.string().optional()
      })
    })
  }
})
