# DevOps Roadmap to Full LMS Course Website

## Overview
Convert the existing single-page DevOps roadmap (10 phases, 69 topics, 527 subtopics) into a comprehensive Learning Management System with:
- **@nuxt/content** for markdown-based lessons
- **Separate pages** for each topic AND subtopic
- **Progress tracking** with localStorage
- **Quizzes** per lesson
- **Certificates** upon completion
- **Estimated time** per lesson

---

## Phase 1: Foundation Setup

### 1.1 Install Dependencies
```bash
npm install @nuxt/content html2canvas jspdf
```

### 1.2 Update `nuxt.config.ts`
- Add `@nuxt/content` to modules
- Configure syntax highlighting for code blocks (bash, typescript, python, yaml, dockerfile)
- Enable table of contents generation

### 1.3 Create Type Definitions
**New file: `app/data/types.ts`**
- Extended `Subtopic` interface with: `id`, `slug`, `estimatedMinutes`, `contentPath`, `hasQuiz`, `order`
- Extended `Topic` interface with: `id`, `slug`, `description`, `estimatedMinutes`
- Extended `Phase` interface with: `id`, `slug`, `estimatedMinutes`
- `QuizQuestion` interface with: `question`, `type`, `options`, `correctAnswer`, `explanation`
- `Quiz` interface with: `passingScore`, `questions`
- Progress tracking types: `SubtopicProgress`, `TopicProgress`, `PhaseProgress`, `UserProgress`
- `CertificateData` interface

### 1.4 Extend Roadmap Data
**Modify: `app/data/roadmap.ts`**
- Add `slugify()` utility function
- Add `id` and `slug` to each phase, topic, and subtopic
- Convert subtopics from `string[]` to `Subtopic[]`
- Generate content paths for each subtopic

---

## Phase 2: Content Structure

### 2.1 Create Content Directory
```
content/
├── 1.phase-1-sdlc/
│   ├── _index.md                    # Phase intro
│   ├── 1.sdlc-models/
│   │   ├── _index.md                # Topic overview
│   │   ├── 1.waterfall-model.md
│   │   ├── 2.agile-methodology.md
│   │   └── ... (5 subtopics)
│   └── ... (4 topics)
├── 2.phase-2-foundations/
│   └── ... (8 topics, ~77 subtopics)
└── ... (phases 3-10)
```

### 2.2 Content File Template
Each subtopic markdown file includes frontmatter:
```yaml
---
title: "File System Hierarchy"
description: "Understanding Linux directory structure"
estimatedMinutes: 15
difficulty: beginner
learningObjectives:
  - "Understand each major directory"
  - "Navigate the filesystem"
quiz:
  passingScore: 70
  questions:
    - question: "Which directory contains config files?"
      type: single
      options: ["/bin", "/etc", "/var", "/home"]
      correctAnswer: "/etc"
---
```

### 2.3 Content Generation Script
**New file: `scripts/generate-content.ts`**
- Iterate through `roadmapData`
- Generate stub markdown files with frontmatter
- Preserve existing content on regeneration

---

## Phase 3: Routing & Pages

### 3.1 URL Structure
```
/                                              # Dashboard with progress
/progress                                      # Detailed progress page
/certificate                                   # Certificate page

/phase-1-sdlc/                                # Phase overview
/phase-1-sdlc/sdlc-models/                    # Topic overview
/phase-1-sdlc/sdlc-models/waterfall-model     # Subtopic lesson
```

### 3.2 New Pages
| File | Purpose |
|------|---------|
| `pages/[phase]/index.vue` | Phase overview with topic list |
| `pages/[phase]/[topic]/index.vue` | Topic overview with subtopic list |
| `pages/[phase]/[topic]/[subtopic].vue` | Subtopic lesson page |
| `pages/progress.vue` | Progress dashboard |
| `pages/certificate.vue` | Certificate generation |

### 3.3 Layouts
**New file: `layouts/lesson.vue`**
- Sidebar navigation with phase/topic/subtopic tree
- Breadcrumb navigation
- Previous/Next lesson navigation
- Mobile-responsive drawer for sidebar

---

## Phase 4: Components

### 4.1 Lesson Components
| Component | Purpose |
|-----------|---------|
| `components/lesson/LessonContent.vue` | Renders markdown content |
| `components/lesson/LessonSidebar.vue` | Navigation tree with progress |
| `components/lesson/LessonBreadcrumb.vue` | Breadcrumb trail |
| `components/lesson/LessonHeader.vue` | Title, duration, progress badge |
| `components/lesson/LessonNavigation.vue` | Prev/Next buttons |
| `components/lesson/MarkCompleteButton.vue` | Mark lesson complete CTA |

### 4.2 Quiz Components
| Component | Purpose |
|-----------|---------|
| `components/quiz/QuizContainer.vue` | Main quiz wrapper |
| `components/quiz/QuizQuestion.vue` | Single/multiple/true-false questions |
| `components/quiz/QuizResults.vue` | Score display with pass/fail |
| `components/quiz/QuizProgress.vue` | Question progress indicator |

### 4.3 Progress Components
| Component | Purpose |
|-----------|---------|
| `components/progress/ProgressBar.vue` | Reusable progress bar |
| `components/progress/ProgressRing.vue` | Circular progress indicator |
| `components/progress/PhaseProgress.vue` | Phase-level progress card |
| `components/progress/OverallProgress.vue` | Overall course progress |

### 4.4 Certificate Components
| Component | Purpose |
|-----------|---------|
| `components/certificate/CertificatePreview.vue` | Certificate design |
| `components/certificate/CertificateGenerator.vue` | PDF generation |

---

## Phase 5: Composables

### 5.1 Progress Tracking
**New file: `composables/useProgress.ts`**
- Initialize from localStorage
- Auto-save on changes
- `markComplete(phaseId, topicId, subtopicId)`
- `recordQuizScore(phaseId, topicId, subtopicId, score)`
- `recalculateProgress()`
- `exportProgress()` / `importProgress()`

### 5.2 Quiz Management
**New file: `composables/useQuiz.ts`**
- Track current question
- Validate answers
- Calculate score
- Handle quiz completion

### 5.3 Certificate Generation
**New file: `composables/useCertificate.ts`**
- Generate unique certificate ID
- Calculate total hours
- Generate PDF with html2canvas + jsPDF

---

## Phase 6: Update Existing Components

### 6.1 Modify `pages/index.vue`
- Add overall progress bar at top
- Show "X/527 completed" stats
- Add certificate CTA when 100% complete

### 6.2 Modify `components/PhaseCard.vue`
- Add ProgressRing showing phase completion %
- Link to phase page

### 6.3 Modify `components/TopicCard.vue`
- Add completion checkmarks for subtopics
- Link topics to topic pages
- Link subtopics to lesson pages

### 6.4 Modify `components/StatsFooter.vue`
- Add completion percentage
- Add "Resume Learning" button

---

## Critical Files

| File | Action |
|------|--------|
| `nuxt.config.ts` | Add @nuxt/content module |
| `app/data/roadmap.ts` | Extend with slugs and IDs |
| `app/data/types.ts` | New - type definitions |
| `app/pages/index.vue` | Add progress display |
| `app/components/TopicCard.vue` | Add links and checkmarks |
| `app/components/PhaseCard.vue` | Add progress ring |
| `composables/useProgress.ts` | New - progress tracking |
| `layouts/lesson.vue` | New - lesson layout |
| `content/` | New - 527+ markdown files |

---

## Implementation Order

1. **Foundation**: Install deps, update config, create types
2. **Data Extension**: Add slugs/IDs to roadmap.ts
3. **Content Scaffold**: Generate stub markdown files
4. **Progress Composable**: localStorage-based tracking
5. **Lesson Layout**: Sidebar + breadcrumb + navigation
6. **Lesson Pages**: Phase/topic/subtopic pages
7. **Progress UI**: Update existing components with progress
8. **Quiz System**: Question components + scoring
9. **Certificate**: Generation and PDF export
10. **Content Population**: Write actual lesson content (ongoing)

---

## Notes

- All buttons must have `cursor-pointer` class
- Follow existing documentation/comment standards
- Dark mode only (already configured)
- Static generation for GitHub Pages compatibility
- Progress persists in localStorage (no backend required)
