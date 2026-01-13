# Research: Phase Certificate Generation

**Date**: 2026-01-12
**Feature Branch**: `001-certificate-generation`

## Research Tasks

### 1. Existing Certificate Infrastructure Analysis

**Task**: Analyze current `useCertificate` composable for extension points

**Findings**:
- **Location**: `app/composables/useCertificate.ts`
- **Current Capabilities**:
  - `generateCertificateId()`: Generates unique ID format `DEVOPS-{timestamp}-{random}`
  - `calculateTotalHours(completedLessons)`: Calculates hours from lesson count
  - `generatePDF(data)`: Renders DOM element to PDF using html2canvas + jsPDF
  - `downloadCertificate(data)`: Triggers browser download
  - `buildCertificateData()`: Builds course-level certificate data
- **Extension Points**:
  - Add `buildPhaseCertificateData()` for phase-level certificates
  - Modify `downloadCertificate()` to support phase-specific filenames
  - PDF generation can be reused as-is (just needs different preview element)

**Decision**: Extend existing composable rather than creating new one
**Rationale**: Maintains single source of truth for certificate logic, reuses proven PDF generation
**Alternatives Considered**:
- New `usePhaseCertificate` composable - rejected due to code duplication
- Separate composable per certificate type - rejected due to unnecessary complexity

### 2. Existing Progress Tracking Analysis

**Task**: Analyze `useProgress` composable for phase completion detection

**Findings**:
- **Location**: `app/composables/useProgress.ts`
- **Relevant Functions**:
  - `getPhaseCompletionPercentage(phaseId)`: Returns 0-100 percentage
  - `isComplete(phaseId)`: Returns true when phase is 100% complete
  - `getCompletedCountForPhase(phaseId)`: Returns lesson count
  - `canGenerateCertificate()`: Returns true when all 527 lessons complete
  - `getAverageQuizScore()`: Returns overall quiz average
- **Phase Data**: Available via `roadmapData` import with `phase.slug` identifiers

**Decision**: Use existing `useProgress` functions, no modifications needed
**Rationale**: All required data points already exposed
**Alternatives Considered**: None - existing API is sufficient

### 3. Learner Name Storage Pattern

**Task**: Research best pattern for storing learner name alongside progress

**Findings**:
- Current progress key: `devops-lms-progress`
- Progress structure: `{ startedAt, phases, lastAccessed, totalTimeSpent }`
- Options considered:
  1. Add `userName` to existing progress structure
  2. Separate localStorage key for learner profile
  3. Embed in progress as `profile: { name }`

**Decision**: Add `userName` field directly to `UserProgress` interface
**Rationale**:
- Single localStorage read/write operation
- Name is tightly coupled to progress (certificate requires both)
- Follows existing pattern of extending progress structure
**Alternatives Considered**:
- Separate key (`devops-lms-profile`) - rejected due to extra storage operations
- Cookie storage - rejected due to size limits and not needed for persistence

### 4. Certificate Visual Design Research

**Task**: Establish certificate design approach consistent with LMS aesthetic

**Findings**:
- **Existing Design System**:
  - Dark mode: gray-800 (#1f2937) background
  - Font: Red Hat Text for UI, Fuzzy Bubbles for content
  - Accent colors: Primary (indigo), success (green), warning (amber)
- **PDF Constraints**:
  - A4 landscape (297mm × 210mm)
  - html2canvas scale: 2x for quality
  - Dark background persists in PDF

**Decision**: Design certificate with dark background, gold/amber accent for prestige feel
**Rationale**: Consistent with LMS dark mode while providing celebratory achievement aesthetic
**Alternatives Considered**:
- Light certificate background - rejected for inconsistency with LMS theme
- Colorful gradient - rejected for printability concerns

### 5. Phase Certificate vs Course Certificate Differentiation

**Task**: Determine how to distinguish phase certificates from course completion

**Findings**:
- 10 phase certificates (one per phase)
- 1 course completion certificate (all phases)
- Course certificate should feel more prestigious

**Decision**:
- Phase certificates: Standard design with phase number/name prominent
- Course certificate: "DevOps Master Certificate" with gold border, larger layout, aggregate stats
**Rationale**: Visual hierarchy communicates achievement level
**Alternatives Considered**:
- Same design for both - rejected as it diminishes course completion achievement
- Different colors per phase - rejected as too complex, reduces cohesion

### 6. Certificate ID Format for Phase Certificates

**Task**: Determine certificate ID format to distinguish phase vs course certificates

**Findings**:
- Current format: `DEVOPS-{timestamp}-{random}`
- Need to identify certificate type from ID

**Decision**:
- Phase certificates: `DEVOPS-P{phaseNum}-{timestamp}-{random}` (e.g., `DEVOPS-P3-M1ABC-XYZ123`)
- Course certificate: `DEVOPS-MASTER-{timestamp}-{random}`
**Rationale**: Self-documenting IDs, easy to parse certificate type
**Alternatives Considered**:
- UUID format - rejected as less human-readable
- Sequential numbers - rejected as not unique across browsers/users

## Summary of Decisions

| Topic | Decision | Impact |
|-------|----------|--------|
| Composable architecture | Extend existing `useCertificate` | Low - minimal changes |
| Progress tracking | Use existing `useProgress` API | None - already complete |
| Name storage | Add `userName` to `UserProgress` | Low - one field addition |
| Visual design | Dark mode with gold accent | Medium - new component design |
| Certificate types | Distinct designs for phase vs course | Medium - two preview variants |
| ID format | Prefix-based identification | Low - format change only |

## No Unresolved Items

All technical decisions documented. Ready for Phase 1: Design & Contracts.
