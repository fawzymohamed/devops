# Feature Specification: Phase Certificate Generation

**Feature Branch**: `001-certificate-generation`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "Phase 5: Certificate generation at the end of every roadmap phase"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Phase Certificate After Completion (Priority: P1)

A learner who has completed all lessons in a roadmap phase wants to view and download a certificate recognizing their achievement for that specific phase.

**Why this priority**: This is the core value proposition—rewarding learners with tangible proof of completion encourages continued engagement and provides shareable achievements.

**Independent Test**: Can be fully tested by completing all lessons in a single phase and verifying the certificate is generated with correct information.

**Acceptance Scenarios**:

1. **Given** a learner has completed all lessons (100%) in Phase 1: SDLC, **When** they navigate to the certificate section, **Then** they see a Phase 1 certificate available for download.

2. **Given** a learner has completed 80% of Phase 2 lessons, **When** they view the certificate section, **Then** the Phase 2 certificate shows as locked with progress indicator (80% complete).

3. **Given** a learner views an unlocked phase certificate, **When** they click "View Certificate," **Then** they see a preview of the certificate with their name, phase name, completion date, and unique certificate ID.

---

### User Story 2 - Download Certificate as PDF (Priority: P1)

A learner wants to download their phase certificate as a PDF file to share on social media, include in a portfolio, or print.

**Why this priority**: Downloads provide permanent proof of achievement independent of the platform, critical for the certificate's practical value.

**Independent Test**: Can be tested by downloading a generated certificate and verifying the PDF contains all required information.

**Acceptance Scenarios**:

1. **Given** a learner is viewing their Phase 1 certificate preview, **When** they click "Download PDF," **Then** a PDF file downloads with filename format `DevOps-Phase1-Certificate-{ID}.pdf`.

2. **Given** a learner downloads a certificate, **When** they open the PDF, **Then** it displays in A4 landscape format with clear, readable text and the DevOps LMS branding.

3. **Given** the download process starts, **When** PDF generation is in progress, **Then** the learner sees a loading indicator and the button is disabled to prevent duplicate downloads.

---

### User Story 3 - Enter Name for Certificate (Priority: P2)

A learner wants to enter their name to be displayed on certificates, which persists across all their phase certificates.

**Why this priority**: Personalization is essential for certificate value, but the core certificate functionality must work first.

**Independent Test**: Can be tested by entering a name, generating a certificate, and verifying the name appears correctly.

**Acceptance Scenarios**:

1. **Given** a learner has not yet entered their name, **When** they try to generate their first certificate, **Then** they are prompted to enter their full name before proceeding.

2. **Given** a learner has previously entered their name, **When** they view any certificate, **Then** it automatically displays their saved name.

3. **Given** a learner wants to update their name, **When** they access the settings or certificate section, **Then** they can edit and save a new name that applies to future certificate downloads.

---

### User Story 4 - View All Certificates Dashboard (Priority: P2)

A learner wants to see an overview of all 10 phase certificates showing which ones they've earned and their progress toward uncompleted phases.

**Why this priority**: Provides motivation through visualizing the complete journey and achievement collection.

**Independent Test**: Can be tested by completing varying numbers of phase lessons and verifying the dashboard accurately reflects progress.

**Acceptance Scenarios**:

1. **Given** a learner navigates to the certificate page, **When** the page loads, **Then** they see a grid/list of all 10 phases with visual distinction between earned (unlocked) and pending (locked) certificates.

2. **Given** a learner has earned 3 certificates, **When** they view the dashboard, **Then** earned certificates show a "View" button while locked ones show a progress bar with percentage.

3. **Given** a learner clicks on a locked phase, **When** they view its details, **Then** they see how many lessons remain and a link to resume learning that phase.

---

### User Story 5 - Earn Course Completion Certificate (Priority: P3)

A learner who completes all 10 phases wants to receive a special "Grand Certificate" recognizing full course completion.

**Why this priority**: This represents the ultimate achievement and adds aspirational value, but phase certificates provide incremental value first.

**Independent Test**: Can be tested by completing all 527 lessons and verifying the course completion certificate becomes available with aggregate statistics.

**Acceptance Scenarios**:

1. **Given** a learner has completed all 10 phases (527 lessons), **When** they view the certificate page, **Then** a special "DevOps Master Certificate" appears prominently at the top.

2. **Given** a learner views the course completion certificate, **When** they examine the details, **Then** it shows total lessons completed, total hours spent, overall average quiz score, and completion date.

3. **Given** a learner has completed 9 of 10 phases, **When** they view the certificate dashboard, **Then** the course completion certificate shows as locked with "Complete Phase X to unlock" message.

---

### Edge Cases

- What happens when a learner completes a phase but has not entered their name? The system prompts for name entry before certificate can be viewed/downloaded.
- What happens if a learner's progress data is corrupted or reset? Certificates that were previously unlocked become locked again (no permanent record stored; certificates are generated on-demand).
- What happens if a learner completes lessons out of order across phases? Each phase certificate unlocks independently; order doesn't matter.
- What happens if the PDF generation fails? An error message is displayed with retry option.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST track completion status for each of the 10 roadmap phases independently.
- **FR-002**: System MUST unlock a phase certificate when 100% of that phase's lessons are completed.
- **FR-003**: System MUST allow learners to enter and save their full name for certificate personalization.
- **FR-004**: System MUST persist the learner's name in local storage across sessions.
- **FR-005**: System MUST display a certificate preview showing learner name, phase name, completion date, lessons completed, hours spent, and unique certificate ID.
- **FR-006**: System MUST generate a downloadable PDF certificate in A4 landscape format.
- **FR-007**: System MUST generate a unique certificate ID for each certificate download.
- **FR-008**: System MUST display a dashboard showing all 10 phases with their certificate status (earned/locked).
- **FR-009**: System MUST show progress toward locked certificates (percentage complete).
- **FR-010**: System MUST unlock a "Course Completion Certificate" when all 527 lessons across all phases are completed.
- **FR-011**: System MUST prevent certificate generation/download while PDF generation is in progress.
- **FR-012**: System MUST display appropriate error messages if certificate generation fails with retry capability.

### Key Entities

- **Phase Certificate**: Represents a completion certificate for one of the 10 roadmap phases. Contains: certificate ID, learner name, phase name, phase number, completion date, lessons completed, hours spent, quiz score average.

- **Course Completion Certificate**: Special certificate for completing all 10 phases. Contains: certificate ID, learner name, completion date, total lessons (527), total hours, overall quiz score average.

- **Learner Profile**: Minimal profile data stored locally. Contains: full name, certificates earned (derived from progress data).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can view and download a phase certificate within 5 seconds of clicking "Download PDF."
- **SC-002**: 100% of certificate downloads produce valid, openable PDF files.
- **SC-003**: Learners can see their certificate collection (earned and progress) within 2 seconds of page load.
- **SC-004**: Certificate name entry and saving completes within 1 second.
- **SC-005**: Phase certificate accuracy: displays correct phase name, lesson count, and completion date with 100% accuracy.
- **SC-006**: Dashboard accurately reflects current progress state with no stale data.
- **SC-007**: Error recovery: learners can retry failed certificate generation and succeed on subsequent attempts.

## Assumptions

- Learner name is stored in localStorage alongside progress data (no user account required).
- Certificates are generated on-demand; no permanent certificate storage is needed.
- Certificate ID uniqueness is achieved through timestamp + random string combination (existing pattern).
- Phase hours and lessons completed are calculated from existing progress tracking data.
- The existing certificate composable will be extended to support phase-level certificates.
- Certificate visual design follows the existing dark mode aesthetic of the LMS.
- PDF generation uses the existing html2canvas + jsPDF approach.

## Out of Scope

- Email delivery of certificates
- Social media sharing integration (direct posting)
- Certificate verification system (QR codes, verification URLs)
- User accounts or server-side certificate storage
- Certificate templates customization by learners
- Printing directly from the browser (users print the downloaded PDF)
