/**
 * DevOps LMS Type Definitions
 * ===========================
 * Central type definitions for the Learning Management System.
 * These types are used across components, composables, and pages.
 *
 * Structure:
 * - Priority & Roadmap Types: Phase, Topic, Subtopic definitions
 * - Quiz Types: Question types and quiz state management
 * - Progress Types: User progress tracking structures
 * - Certificate Types: Certificate generation data
 */

// =============================================================================
// PRIORITY & ROADMAP TYPES
// =============================================================================

/**
 * Priority Level
 * --------------
 * Defines the importance level of a topic in the roadmap.
 * Used for visual styling and learning path recommendations.
 */
export type Priority = 'essential' | 'important' | 'recommended'

/**
 * Difficulty Level
 * ----------------
 * Defines the skill level required for a lesson.
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Subtopic Interface
 * ------------------
 * Represents an individual lesson within a topic.
 * Extended from the original string-based subtopics.
 */
export interface Subtopic {
  /** Unique identifier for the subtopic */
  id: string
  /** Display name of the subtopic */
  name: string
  /** URL-friendly slug */
  slug: string
  /** Estimated reading/completion time in minutes */
  estimatedMinutes: number
  /** Path to the markdown content file */
  contentPath: string
  /** Whether this subtopic has a quiz */
  hasQuiz: boolean
  /** Display order within the topic */
  order: number
}

/**
 * Topic Interface
 * ---------------
 * Represents a collection of related subtopics within a phase.
 */
export interface Topic {
  /** Unique identifier for the topic */
  id: string
  /** Display name of the topic */
  name: string
  /** URL-friendly slug */
  slug: string
  /** Brief description of the topic */
  description: string
  /** Priority level for the topic */
  priority: Priority
  /** Icon name (Lucide icon) */
  icon: string
  /** Total estimated time for all subtopics in minutes */
  estimatedMinutes: number
  /** Array of subtopics within this topic */
  subtopics: Subtopic[] | string[]
}

/**
 * Phase Interface
 * ---------------
 * Represents a major section of the DevOps roadmap.
 */
export interface Phase {
  /** Unique identifier for the phase */
  id: string
  /** Display name of the phase */
  name: string
  /** URL-friendly slug */
  slug: string
  /** Brief description of the phase */
  description: string
  /** Icon name (Lucide icon) */
  icon: string
  /** Total estimated time for all topics in minutes */
  estimatedMinutes: number
  /** Array of topics within this phase */
  topics: Topic[]
}

// =============================================================================
// QUIZ TYPES
// =============================================================================

/**
 * Quiz Question Type
 * ------------------
 * Defines the type of quiz question.
 * - single: One correct answer from multiple options
 * - multiple: Multiple correct answers (select all that apply)
 * - true-false: Binary true/false question
 */
export type QuizQuestionType = 'single' | 'multiple' | 'true-false'

/**
 * Quiz Question Interface
 * -----------------------
 * Represents a single quiz question with its options and correct answer.
 */
export interface QuizQuestion {
  /** The question text */
  question: string
  /** Type of question (single, multiple, true-false) */
  type: QuizQuestionType
  /** Array of answer options (not used for true-false) */
  options?: string[]
  /** Correct answer for single choice or true-false questions */
  correctAnswer?: string | boolean
  /** Correct answers for multiple choice questions */
  correctAnswers?: string[]
  /** Explanation shown after answering */
  explanation: string
}

/**
 * Quiz Interface
 * --------------
 * Represents a complete quiz with passing criteria and questions.
 */
export interface Quiz {
  /** Minimum percentage score required to pass (0-100) */
  passingScore: number
  /** Array of quiz questions */
  questions: QuizQuestion[]
}

/**
 * Quiz Answer Interface
 * ---------------------
 * Represents a user's answer to a quiz question.
 */
export interface QuizAnswer {
  /** Index of the question being answered */
  questionIndex: number
  /** The user's selected answer(s) */
  selected: string | string[] | boolean
}

/**
 * Quiz State Interface
 * --------------------
 * Represents the current state of a quiz attempt.
 */
export interface QuizState {
  /** Current question index (0-based) */
  currentIndex: number
  /** Array of user's answers */
  answers: QuizAnswer[]
  /** Whether the quiz has been completed */
  isComplete: boolean
  /** Final score percentage (0-100) */
  score: number
  /** Whether the user passed the quiz */
  passed: boolean
}

// =============================================================================
// PROGRESS TYPES
// =============================================================================

/**
 * Subtopic Progress Interface
 * ---------------------------
 * Tracks completion status for a single subtopic/lesson.
 */
export interface SubtopicProgress {
  /** Whether the lesson content has been completed */
  completed: boolean
  /** ISO timestamp when the lesson was completed */
  completedAt: string | null
  /** Best quiz score achieved (0-100), null if not attempted */
  quizScore: number | null
  /** ISO timestamp when the quiz was completed */
  quizCompletedAt?: string | null
}

/**
 * Topic Progress Interface
 * ------------------------
 * Tracks progress for all subtopics within a topic.
 */
export interface TopicProgress {
  /** Map of subtopic ID to progress data */
  subtopics: Record<string, SubtopicProgress>
}

/**
 * Phase Progress Interface
 * ------------------------
 * Tracks progress for all topics within a phase.
 */
export interface PhaseProgress {
  /** Map of topic ID to progress data */
  topics: Record<string, TopicProgress>
}

/**
 * User Progress Interface
 * -----------------------
 * Root interface for tracking all user progress.
 * Stored in localStorage and used across the application.
 */
export interface UserProgress {
  /** ISO timestamp when user started the course */
  startedAt: string
  /** Map of phase ID to progress data */
  phases: Record<string, PhaseProgress>
  /** Optional: Last accessed lesson path */
  lastAccessed?: string
  /** Optional: Total time spent in minutes */
  totalTimeSpent?: number
}

// =============================================================================
// CERTIFICATE TYPES
// =============================================================================

/**
 * Certificate Data Interface
 * --------------------------
 * Contains all information needed to generate a completion certificate.
 */
export interface CertificateData {
  /** Unique certificate identifier */
  certificateId: string
  /** User's full name */
  userName: string
  /** Course completion date (ISO string) */
  completionDate: string
  /** Total number of lessons completed */
  lessonsCompleted: number
  /** Total number of lessons in the course */
  totalLessons: number
  /** Average quiz score percentage */
  averageQuizScore: number
  /** Total hours spent on the course */
  totalHours: number
}

// =============================================================================
// CONTENT TYPES (for @nuxt/content)
// =============================================================================

/**
 * Lesson Frontmatter Interface
 * ----------------------------
 * Represents the frontmatter structure for lesson markdown files.
 */
export interface LessonFrontmatter {
  /** Lesson title */
  title: string
  /** SEO description (max 160 chars) */
  description: string
  /** Estimated reading time in minutes */
  estimatedMinutes: number
  /** Difficulty level */
  difficulty: Difficulty
  /** Array of learning objectives */
  learningObjectives: string[]
  /** Optional prerequisites (slugs of other lessons) */
  prerequisites?: string[]
  /** Optional quiz configuration */
  quiz?: Quiz
}

/**
 * Lesson Content Interface
 * ------------------------
 * Represents the full lesson data returned by @nuxt/content.
 * Extends frontmatter with content metadata.
 */
export interface LessonContent extends LessonFrontmatter {
  /** Content path (e.g., /phase-1-sdlc/sdlc-models/waterfall-model) */
  _path: string
  /** Original file path */
  _file: string
  /** File extension */
  _extension: string
  /** Parsed body content */
  body: {
    /** Table of contents */
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

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

/**
 * Breadcrumb Item Interface
 * -------------------------
 * Represents a single item in the breadcrumb navigation.
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Navigation path (optional for current page) */
  to?: string
}

/**
 * Lesson Navigation Interface
 * ---------------------------
 * Represents previous/next lesson for navigation.
 */
export interface LessonNavigation {
  /** Previous lesson (null if first) */
  prev: {
    _path: string
    title: string
  } | null
  /** Next lesson (null if last) */
  next: {
    _path: string
    title: string
  } | null
}

// =============================================================================
// CHEAT SHEET TYPES
// =============================================================================

/**
 * Cheat Sheet Frontmatter Interface
 * ---------------------------------
 * Represents the frontmatter structure for cheat sheet markdown files.
 * Extends LessonFrontmatter with cheat sheet specific fields.
 */
export interface CheatSheetFrontmatter extends LessonFrontmatter {
  /** Flag indicating this is a cheat sheet */
  isCheatSheet: true
  /** The topic this cheat sheet belongs to */
  cheatSheetTopic?: string
}

/**
 * Cheat Sheet Content Interface
 * -----------------------------
 * Represents the full cheat sheet data returned by @nuxt/content.
 */
export interface CheatSheetContent extends CheatSheetFrontmatter {
  /** Content path (e.g., /phase-1-sdlc/sdlc-models/cheat-sheet) */
  _path: string
  /** Original file path */
  _file: string
  /** File extension */
  _extension: string
}
