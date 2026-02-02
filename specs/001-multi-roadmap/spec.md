# Feature Specification: Multi-Roadmap Support

**Feature Branch**: `001-multi-roadmap`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Add a new roadmap to the website. The roadmap is 'Full Stack Developer Interview Mastery' located at 'dev-plans/fullstack-interview-roadmap.md'. Edit the UI to support both roadmaps (DevOps and Full Stack Interview). No lesson content will be generated - only prepare the website structure. The new roadmap will follow the same design patterns for progress monitoring, cheat sheets, quizzes, and certifications."

---

## Clarifications

### Session 2026-01-13

- Q: How should existing user progress data be handled when they first visit the updated multi-roadmap site? → A: Auto-migrate existing progress to the new "devops" roadmap key on first visit
- Q: Should users be able to navigate the Full Stack roadmap structure even without lesson content? → A: Show full structure with "Coming Soon" badges; users can browse but not complete lessons
- Q: How should URLs be structured to support multiple roadmaps? → A: Keep DevOps URLs unchanged (e.g., `/devops/phase-2.../`); only new roadmaps get a prefix (e.g., `/devops/fullstack/phase-1.../`)

---

## Overview

Transform the current single-roadmap DevOps LMS into a multi-roadmap platform that supports both the existing DevOps roadmap (10 phases, 69 topics, 527 subtopics) and a new Full Stack Developer Interview Mastery roadmap (13 phases, 79 topics, 450+ skills).

### Roadmap Comparison

| Aspect                | DevOps Roadmap                   | Full Stack Interview Roadmap       |
|-----------------------|----------------------------------|-------------------------------------|
| Phases                | 10                               | 13                                  |
| Topics                | 69                               | 79                                  |
| Subtopics/Skills      | 527                              | 450+                                |
| Priority System       | essential/important/recommended  | Must Know/Should Know/Good to Know  |
| Content Status        | Partially created (41/527)       | No content yet                      |

---

## User Scenarios & Testing

### User Story 1 - Roadmap Selection Landing Page (Priority: P1)

A visitor arrives at the website and sees a landing page that presents both available roadmaps (DevOps and Full Stack Interview). They can view a summary of each roadmap and select which one to explore.

**Why this priority**: This is the entry point to the entire multi-roadmap experience. Without a clear roadmap selection interface, users cannot access either roadmap, making this the foundation of the feature.

**Independent Test**: Can be fully tested by navigating to the homepage and verifying both roadmap options are displayed with their key information (name, phase count, topic count, description). Delivers immediate value by allowing users to choose their learning path.

**Acceptance Scenarios**:

1. **Given** a user visits the homepage, **When** the page loads, **Then** they see both roadmaps displayed as selectable options with summary information (title, description, phase count, topic count)
2. **Given** a user is on the homepage, **When** they click on a roadmap card, **Then** they are navigated to that specific roadmap's main page
3. **Given** a user is on the homepage, **When** they view the roadmap cards, **Then** each card shows a visual indicator of their progress (if any) on that roadmap

---

### User Story 2 - Roadmap-Specific Navigation (Priority: P1)

A user who has selected a roadmap can navigate through that roadmap's phases, topics, and lessons using the existing navigation patterns. The navigation clearly indicates which roadmap they are viewing.

**Why this priority**: Navigation is essential for users to access and explore roadmap content. Without proper navigation, users cannot find or access lessons.

**Independent Test**: Can be tested by selecting a roadmap from the landing page and verifying the navigation shows roadmap-specific phases and topics. The breadcrumb and header should indicate the current roadmap.

**Acceptance Scenarios**:

1. **Given** a user has selected the DevOps roadmap, **When** they view the roadmap page, **Then** they see only DevOps phases and topics
2. **Given** a user has selected the Full Stack Interview roadmap, **When** they view the roadmap page, **Then** they see only Full Stack Interview phases and topics
3. **Given** a user is viewing a lesson within a roadmap, **When** they look at the breadcrumb navigation, **Then** it shows the roadmap name as the root level (e.g., "DevOps > Phase 1 > SDLC Models > Waterfall")
4. **Given** a user is within a roadmap, **When** they want to switch roadmaps, **Then** there is a clear way to return to the landing page or switch to another roadmap

---

### User Story 3 - Isolated Progress Tracking (Priority: P1)

A user's progress is tracked separately for each roadmap. Completing lessons in the DevOps roadmap does not affect progress in the Full Stack Interview roadmap and vice versa.

**Why this priority**: Progress tracking is core to the LMS experience. Users need to see their progress per roadmap to understand where they are in each learning journey.

**Independent Test**: Can be tested by completing lessons in one roadmap and verifying the progress percentage only updates for that roadmap while the other roadmap's progress remains unchanged.

**Acceptance Scenarios**:

1. **Given** a user has completed lessons in the DevOps roadmap, **When** they view the Full Stack Interview roadmap, **Then** the Full Stack roadmap shows 0% progress (unless they've also completed lessons there)
2. **Given** a user views their progress dashboard, **When** the dashboard loads, **Then** they see separate progress statistics for each roadmap
3. **Given** a user has made progress in both roadmaps, **When** they export their progress data, **Then** the export includes progress for both roadmaps as separate sections

---

### User Story 4 - Roadmap-Specific Certificates (Priority: P2)

A user who completes 100% of a roadmap can generate a certificate specific to that roadmap. Each roadmap has its own certificate design and completion criteria.

**Why this priority**: Certificates are the reward for completing a roadmap. While important, users need the basic navigation and progress tracking first before they can earn certificates.

**Independent Test**: Can be tested by completing all lessons in a roadmap (or simulating completion) and generating a certificate that displays the correct roadmap name and completion details.

**Acceptance Scenarios**:

1. **Given** a user has completed 100% of the DevOps roadmap, **When** they generate a certificate, **Then** the certificate displays "DevOps Roadmap Completion" with appropriate branding
2. **Given** a user has completed 100% of the Full Stack Interview roadmap, **When** they generate a certificate, **Then** the certificate displays "Full Stack Developer Interview Mastery Completion" with appropriate branding
3. **Given** a user has completed one roadmap but not another, **When** they view the incomplete roadmap's certificate page, **Then** they see their current progress and what remains to complete

---

### User Story 5 - Roadmap-Specific Progress Dashboard (Priority: P2)

A user can view a comprehensive progress dashboard that shows their progress across all roadmaps, with the ability to drill down into each roadmap's detailed progress.

**Why this priority**: The progress dashboard provides a holistic view of learning progress. It builds upon the basic progress tracking functionality.

**Independent Test**: Can be tested by navigating to the progress dashboard and verifying it displays summary cards for each roadmap with drill-down capabilities.

**Acceptance Scenarios**:

1. **Given** a user visits the progress dashboard, **When** the page loads, **Then** they see a summary card for each roadmap showing completion percentage, time spent, and last accessed date
2. **Given** a user clicks on a roadmap's progress card, **When** the detail view opens, **Then** they see phase-by-phase progress breakdown for that specific roadmap
3. **Given** a user has started both roadmaps, **When** they view the dashboard, **Then** a "Resume Learning" button appears for each roadmap showing their last accessed lesson

---

### User Story 6 - Data Layer for Full Stack Roadmap (Priority: P1)

The system has a structured data layer for the Full Stack Interview roadmap that follows the same TypeScript interfaces as the DevOps roadmap, enabling consistent rendering and functionality.

**Why this priority**: Without the data layer, no UI components can render the new roadmap content. This is a foundational technical requirement.

**Independent Test**: Can be tested by importing the Full Stack roadmap data and verifying it conforms to the same TypeScript interfaces (Phase, Topic, Priority) as the DevOps roadmap.

**Acceptance Scenarios**:

1. **Given** the Full Stack roadmap data exists, **When** it is imported into the application, **Then** TypeScript compilation succeeds with no type errors
2. **Given** the Full Stack roadmap data is loaded, **When** a component iterates over phases and topics, **Then** the same rendering logic works for both roadmaps
3. **Given** the priority system differs between roadmaps, **When** priorities are displayed, **Then** each roadmap uses its own priority naming (essential vs Must Know) but maps to consistent visual styling (red/amber/blue)

---

### Edge Cases

- What happens when an existing user with DevOps progress visits the new multi-roadmap site?
  - Existing progress is automatically migrated to the "devops" roadmap key on first visit; no manual action required
- What happens when a user has progress in only one roadmap?
  - The other roadmap shows 0% progress and prompts the user to start
- How does the system handle a user trying to access a lesson URL from a roadmap they haven't selected?
  - The system displays the lesson within the correct roadmap context, updating navigation accordingly
- What happens if a roadmap has no content yet (all lessons are placeholder)?
  - The full roadmap structure (phases, topics, subtopics) is visible and navigable
  - Lessons without content display a "Coming Soon" badge
  - Users cannot mark "Coming Soon" lessons as complete
  - The roadmap appears on the landing page regardless of content availability
- How does the system handle URL structure for multiple roadmaps?
  - DevOps roadmap URLs remain unchanged: `/devops/phase-2-foundations/topic/subtopic`
  - New roadmaps use a prefix: `/devops/fullstack/phase-1-web-fundamentals/topic/subtopic`
  - Landing page (roadmap selection) is at the base URL: `/devops/`
  - No redirects needed for existing DevOps URLs

---

## Requirements

### Functional Requirements

**Landing Page & Navigation**

- **FR-001**: System MUST display a landing page showing all available roadmaps when users visit the root URL
- **FR-002**: System MUST provide navigation to switch between roadmaps from any page within the application
- **FR-003**: System MUST preserve existing DevOps URLs unchanged; new roadmaps use a prefix (e.g., `/devops/fullstack/...`) to support direct linking
- **FR-004**: System MUST display breadcrumb navigation that includes the current roadmap as the root level

**Data Layer**

- **FR-005**: System MUST maintain separate data files for each roadmap following the same TypeScript interfaces (Phase, Topic, Subtopic)
- **FR-006**: System MUST support the priority system mapping between roadmaps (essential/important/recommended maps to Must Know/Should Know/Good to Know)
- **FR-007**: System MUST provide a content directory structure that separates roadmap content (e.g., `content/devops/` and `content/fullstack/`)

**Progress Tracking**

- **FR-008**: System MUST store progress data separately for each roadmap in localStorage
- **FR-009**: System MUST calculate completion percentages independently for each roadmap
- **FR-010**: System MUST track time spent separately for each roadmap
- **FR-011**: System MUST support "Resume Learning" functionality that works per-roadmap
- **FR-012**: System MUST support export/import of progress data that includes all roadmaps
- **FR-012a**: System MUST auto-migrate existing DevOps progress data to the new multi-roadmap storage structure on first visit (transparent to user)

**Certificates**

- **FR-013**: System MUST generate roadmap-specific certificates with appropriate titles and branding
- **FR-014**: System MUST track certificate eligibility independently per roadmap (100% completion)

**UI Components**

- **FR-015**: System MUST render the existing UI components (TopicCard, PhaseCard, StatsFooter, etc.) with roadmap-specific data
- **FR-015a**: System MUST display "Coming Soon" badge on lessons without content and prevent completion marking for those lessons
- **FR-016**: System MUST display the same visual design language across all roadmaps (dark mode, Tailwind styling)
- **FR-017**: System MUST support the existing view modes (timeline, grid) for all roadmaps

---

### Key Entities

- **Roadmap**: Top-level entity representing a learning path (DevOps, Full Stack Interview). Contains metadata (title, description, slug) and references to phases.
- **Phase**: A major section within a roadmap. Contains topics and has a sequential order within its parent roadmap.
- **Topic**: A subject area within a phase. Contains subtopics/lessons.
- **Subtopic/Lesson**: Individual learning units with content, quizzes, and progress tracking.
- **Progress**: User's completion state, stored per roadmap with phase/topic/subtopic granularity.
- **Certificate**: Generated document tied to a specific roadmap upon 100% completion.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can select from multiple roadmaps within 3 clicks from any page in the application
- **SC-002**: Progress tracking displays accurate completion percentages for each roadmap independently
- **SC-003**: Certificate generation produces distinct certificates for each roadmap with correct titles
- **SC-004**: All existing DevOps roadmap functionality continues to work without regression
- **SC-005**: The Full Stack Interview roadmap data structure loads without TypeScript errors
- **SC-006**: URL structure supports direct linking to any roadmap, phase, topic, or lesson
- **SC-007**: Time spent tracking accumulates correctly per roadmap
- **SC-008**: Export/import of progress data preserves progress for all roadmaps

---

## Assumptions

1. **No lesson content creation**: This specification only covers the UI and data structure changes. Actual lesson markdown files for the Full Stack Interview roadmap will be created separately.
2. **Consistent design language**: The Full Stack roadmap will use the same visual design (dark mode, Tailwind CSS, Nuxt UI components) as the existing DevOps roadmap.
3. **Same feature set**: All existing features (quizzes, cheat sheets, progress tracking, certificates) will be available for the new roadmap once content is created.
4. **localStorage for progress**: Progress will continue to be stored in localStorage, with the storage structure updated to support multiple roadmaps.
5. **Static generation**: The site can use Vercel static output generation.
6. **Priority mapping**: The different priority naming conventions (essential vs Must Know) will map to the same visual styling (red for highest priority, amber for medium, blue for lowest).

---

## Out of Scope

- Creating lesson content for the Full Stack Interview roadmap
- Implementing user authentication or server-side progress storage
- Adding new features not present in the current DevOps roadmap
- Creating mobile apps or alternative deployment targets
- Implementing search functionality (planned for Phase 6)
