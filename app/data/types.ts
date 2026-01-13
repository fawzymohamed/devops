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

/**
 * Roadmap Topic Interface
 * -----------------------
 * Lightweight topic shape used by roadmap data files.
 */
export interface RoadmapTopic {
  name: string
  slug?: string
  subtopics: string[]
  priority: Priority
}

/**
 * Roadmap Phase Interface
 * -----------------------
 * Lightweight phase shape used by roadmap data files.
 */
export interface RoadmapPhase {
  phase: number
  title: string
  slug: string
  duration: string
  color: string
  icon: string
  description: string
  topics: RoadmapTopic[]
}

/**
 * Roadmap Interface
 * -----------------
 * Represents a complete learning roadmap with metadata and phases.
 */
export interface Roadmap {
  /** Unique identifier (e.g., "devops", "fullstack") */
  id: string
  /** URL-friendly slug (e.g., "devops", "fullstack") */
  slug: string
  /** Display title for UI */
  title: string
  /** Short description for landing cards */
  description: string
  /** Full description for roadmap home pages */
  fullDescription: string
  /** Emoji icon for visual identification */
  icon: string
  /** Certificate title when completed */
  certificateTitle: string
  /** Content directory path (empty string for root) */
  contentPath: string
  /** URL prefix for routes (empty string for root) */
  routePrefix: string
  /** Per-roadmap priority labels */
  priorityLabels: {
    essential: string
    important: string
    recommended: string
  }
  /** Phase data array */
  phases: RoadmapPhase[]
  /** Computed statistics */
  stats: {
    phaseCount: number
    topicCount: number
    subtopicCount: number
    totalWeeks: number
  }
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
  /** Optional: Learner's full name for certificates */
  userName?: string
}

/**
 * Roadmap Progress Interface
 * --------------------------
 * Progress data for a single roadmap.
 */
export interface RoadmapProgress {
  /** ISO timestamp when user started this roadmap */
  startedAt: string
  /** Map of phase ID to progress data */
  phases: Record<string, PhaseProgress>
  /** Optional: Last accessed lesson path */
  lastAccessed?: string
  /** Optional: Total time spent in minutes */
  totalTimeSpent?: number
}

/**
 * Global Settings Interface
 * -------------------------
 * Settings shared across all roadmaps.
 */
export interface GlobalSettings {
  /** Learner's full name for certificates */
  userName?: string
  /** Preferred theme (reserved for future use) */
  theme?: 'dark'
}

/**
 * Multi-Roadmap Progress Interface
 * ---------------------------------
 * Root interface for tracking progress across all roadmaps.
 */
export interface MultiRoadmapProgress {
  /** Schema version for migration support */
  version: 2
  /** Progress data per roadmap, keyed by roadmap ID */
  roadmaps: Record<string, RoadmapProgress>
  /** Global settings shared across roadmaps */
  globalSettings?: GlobalSettings
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

/**
 * Phase Certificate Data Interface
 * ---------------------------------
 * Contains information for a phase-level completion certificate.
 * Extends the base certificate concept with phase-specific fields.
 */
export interface PhaseCertificateData {
  /** Unique certificate identifier (format: DEVOPS-P{num}-{timestamp}-{random}) */
  certificateId: string
  /** Learner's full name */
  userName: string
  /** Phase completion date (ISO string) */
  completionDate: string
  /** Phase number (1-10) */
  phaseNumber: number
  /** Phase display name (e.g., "Software Development Lifecycle") */
  phaseName: string
  /** Phase slug for navigation (e.g., "phase-1-sdlc") */
  phaseSlug: string
  /** Number of lessons completed in this phase */
  lessonsCompleted: number
  /** Total lessons in this phase */
  totalLessons: number
  /** Average quiz score for this phase (0-100) */
  averageQuizScore: number
  /** Hours spent on this phase */
  hoursSpent: number
}

/**
 * Course Completion Certificate Data Interface
 * --------------------------------------------
 * Contains information for the "DevOps Master Certificate".
 * Awarded when all 10 phases are completed.
 */
export interface CourseCertificateData {
  /** Unique certificate identifier (format: DEVOPS-MASTER-{timestamp}-{random}) */
  certificateId: string
  /** Learner's full name */
  userName: string
  /** Course completion date (ISO string) */
  completionDate: string
  /** Roadmap-specific certificate title */
  courseName?: string
  /** Total lessons completed (should be 527) */
  totalLessonsCompleted: number
  /** Total hours spent on entire course */
  totalHoursSpent: number
  /** Overall average quiz score (0-100) */
  overallQuizScore: number
  /** Array of phase completion dates (10 entries) */
  phaseCompletionDates: string[]
}

/**
 * Certificate Status Type
 * -----------------------
 * Represents the current state of a certificate in the dashboard.
 */
export type CertificateStatus = 'locked' | 'unlocked' | 'downloaded'

/**
 * Phase Certificate Status Interface
 * -----------------------------------
 * Tracks certificate status for dashboard display.
 */
export interface PhaseCertificateStatus {
  /** Phase number (1-10) */
  phaseNumber: number
  /** Phase display name */
  phaseName: string
  /** Phase slug */
  phaseSlug: string
  /** Current certificate status */
  status: CertificateStatus
  /** Completion percentage (0-100) */
  completionPercentage: number
  /** Lessons completed */
  lessonsCompleted: number
  /** Total lessons in phase */
  totalLessons: number
  /** Completion date if unlocked (ISO string) */
  completedAt?: string
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
