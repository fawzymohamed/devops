# Feature Specification: Date-Based Schedule System

**Feature Branch**: `1-schedule-dates`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Replace static duration labels with a real date-based scheduling system that shows projected completion dates based on a configurable study schedule."

## Clarifications

### Session 2026-01-27

- Q: Should schedules be shared globally or separate per roadmap? → A: Separate schedule per roadmap (independent start dates and pace)
- Q: Where should users access the schedule configuration UI? → A: Dedicated settings page (e.g., /settings or /progress page)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Study Schedule (Priority: P1)

A user wants to set up their personal study schedule so the system can calculate when they will complete the roadmap. The user navigates to a dedicated settings page (such as /settings or /progress), enters their start date and how many days per week they can study, and saves their preferences.

**Why this priority**: This is the foundation of the entire feature. Without a configured schedule, no projected dates can be calculated. This enables all other functionality.

**Independent Test**: Can be fully tested by navigating to the dedicated settings page, entering a start date (e.g., Jan 27, 2026) and study days per week (e.g., 6 days), saving, and verifying the schedule is persisted across page reloads.

**Acceptance Scenarios**:

1. **Given** a user has no schedule configured, **When** they open schedule settings and enter a start date of "Jan 27, 2026" and select 6 days per week, **Then** the schedule is saved and persisted to local storage.
2. **Given** a user has an existing schedule, **When** they open schedule settings, **Then** their previously saved start date and study days are pre-populated.
3. **Given** a user is configuring a schedule, **When** they select 0 study days per week, **Then** the system prevents saving with an appropriate validation message.

---

### User Story 2 - View Projected Roadmap Completion Date (Priority: P1)

A user with a configured schedule wants to see when they will finish the entire roadmap. They view the roadmap overview page and see a projected completion date calculated based on their schedule and the total number of topics.

**Why this priority**: This is the primary value of the feature - knowing when the full roadmap will be completed motivates users to maintain their study pace.

**Independent Test**: Can be fully tested by configuring a schedule (start: Jan 27, 2026, 6 days/week), viewing the roadmap with 79 topics, and verifying the projected completion date shows approximately 14 weeks later (79 topics / 6 days per week = ~13.2 weeks).

**Acceptance Scenarios**:

1. **Given** a user has a schedule starting Jan 27, 2026 with 6 study days per week, **When** they view a roadmap with 79 topics, **Then** they see a projected completion date of approximately April 27, 2026.
2. **Given** a user has no schedule configured, **When** they view the roadmap, **Then** they see the original static duration labels (e.g., "1-2 weeks") instead of projected dates.
3. **Given** a user changes their schedule from 6 days/week to 3 days/week, **When** they view the roadmap, **Then** the projected completion date adjusts accordingly (doubles the time).

---

### User Story 3 - View Projected Phase Completion Dates (Priority: P2)

A user wants to see when they will complete each individual phase within the roadmap. When viewing the roadmap, each phase displays its projected completion date based on the number of topics in that phase and the user's schedule.

**Why this priority**: Phase-level dates help users set intermediate milestones and track progress through logical sections of the roadmap.

**Independent Test**: Can be fully tested by configuring a schedule and verifying each phase shows a projected completion date that is sequentially ordered and accounts for that phase's topic count.

**Acceptance Scenarios**:

1. **Given** a user has a schedule configured, **When** they view a phase with 5 topics, **Then** they see a projected completion date calculated as (topics in phase / study days per week) weeks from the phase start date.
2. **Given** a user has a schedule configured and Phase 1 has 8 topics and Phase 2 has 6 topics, **When** they view the roadmap with 5 study days/week, **Then** Phase 1 shows completion at ~1.6 weeks and Phase 2 shows completion at ~2.8 weeks from start.
3. **Given** a user has no schedule configured, **When** they view phases, **Then** each phase displays its original static duration label.

---

### User Story 4 - Schedule Replaces Duration Labels (Priority: P2)

When a user has a configured schedule, the static duration labels (e.g., "1-2 weeks") are hidden and replaced with projected completion dates throughout the interface.

**Why this priority**: Prevents confusion from showing both estimates and concrete dates simultaneously.

**Independent Test**: Can be fully tested by configuring a schedule and verifying that duration labels are replaced by dates, then removing the schedule and verifying duration labels return.

**Acceptance Scenarios**:

1. **Given** a user has a schedule configured, **When** they view any location that previously showed "1-2 weeks", **Then** they see a projected completion date instead.
2. **Given** a user removes their schedule, **When** they view the roadmap and phases, **Then** the original static duration labels are displayed.

---

### Edge Cases

- What happens when a user sets study days to 7 days/week (every day)? System should accept and calculate accordingly.
- What happens when a user sets a start date in the past? System should accept and calculate from that date (useful for users who started earlier).
- What happens when a user sets a start date far in the future? System should accept and calculate from that date.
- How does the system handle a roadmap with 0 topics? Display no completion date or "Already complete" message.
- What happens when localStorage is cleared? Schedule is lost, system reverts to showing duration labels (graceful degradation).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to set a start date for their study schedule.
- **FR-002**: System MUST allow users to set the number of study days per week (1-7).
- **FR-003**: System MUST validate that study days per week is between 1 and 7 inclusive.
- **FR-004**: System MUST persist the schedule configuration to local storage, with each roadmap having its own independent schedule.
- **FR-005**: System MUST calculate projected completion dates using the formula: topics count / study days per week = weeks to complete.
- **FR-006**: System MUST use 1 topic = 1 study day as the pace baseline.
- **FR-007**: System MUST display projected completion date for the entire roadmap when a schedule exists.
- **FR-008**: System MUST display projected completion dates for each phase when a schedule exists.
- **FR-009**: System MUST hide static duration labels when a schedule exists.
- **FR-010**: System MUST show static duration labels when no schedule exists (default behavior).
- **FR-011**: System MUST allow users to remove their schedule and revert to duration labels.
- **FR-012**: System MUST recalculate projected dates when the schedule is modified.
- **FR-013**: System MUST be backwards compatible with existing progress data (no changes to progress storage structure).
- **FR-014**: System MUST provide schedule configuration on a dedicated settings page (e.g., /settings or /progress).

### Key Entities

- **StudySchedule**: Represents a user's study configuration with start date and study days per week. Each roadmap has its own independent schedule.
- **ProjectedDate**: A calculated completion date for a roadmap or phase, derived from topic count and schedule.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can configure their study schedule in under 30 seconds.
- **SC-002**: Projected completion dates are displayed within 1 second of page load when a schedule exists.
- **SC-003**: Users can understand their projected completion timeline for the entire roadmap at a glance.
- **SC-004**: Users can see phase-level milestones to track intermediate progress.
- **SC-005**: 100% of existing users without schedules continue to see duration labels (no breaking changes).
- **SC-006**: Schedule configuration persists across browser sessions.

## Assumptions

- The schedule is stored in the browser's localStorage (consistent with existing progress tracking approach).
- Each roadmap has its own independent schedule (separate start dates and study pace per roadmap).
- Projected dates are simple calendar calculations without accounting for holidays or specific dates to skip.
- The calculation is always "topics remaining" based, not accounting for already-completed topics in MVP.
- Date display format follows the user's locale or a consistent format like "Apr 27, 2026".

## Out of Scope

- Tracking missed study days or rescheduling based on actual progress.
- Notifications or reminders for study sessions.
- Calendar integrations.
- Accounting for completed topics when calculating remaining time (MVP shows total roadmap duration from start date).
- Multiple schedule presets or templates.
