# Research: Date-Based Schedule System

**Feature Branch**: `1-schedule-dates`
**Date**: 2026-01-27

## Research Areas

### 1. Date Calculation Approach

**Decision**: Simple week-based calculation without calendar complexity

**Rationale**:
- MVP approach: 1 topic = 1 study day
- Calculate weeks: `totalTopics / studyDaysPerWeek`
- Add weeks to start date for projected completion
- No need for complex date libraries; native JavaScript Date sufficient

**Alternatives Considered**:
- **date-fns library**: Rejected - overkill for simple week addition
- **Luxon**: Rejected - unnecessary dependency
- **Native Date API**: Selected - sufficient for adding weeks to dates

**Implementation Notes**:
```typescript
function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + Math.ceil(weeks * 7))
  return result
}
```

### 2. Storage Location

**Decision**: Store schedule in existing localStorage structure alongside progress

**Rationale**:
- Consistent with existing `useProgress` pattern
- Uses same `devops-lms-progress` localStorage key
- Each roadmap has its own schedule (per spec clarification)
- No migration needed - additive change to existing structure

**Storage Structure Extension**:
```typescript
interface RoadmapProgress {
  // ... existing fields
  schedule?: {
    startDate: string  // ISO date string (YYYY-MM-DD)
    studyDaysPerWeek: number  // 1-7
  }
}
```

**Alternatives Considered**:
- **Separate localStorage key**: Rejected - fragments user data
- **Global schedule for all roadmaps**: Rejected - user chose per-roadmap

### 3. Date Display Format

**Decision**: Use locale-aware date formatting with fallback

**Rationale**:
- `Intl.DateTimeFormat` provides localized dates
- Fallback to ISO date if locale fails
- Consistent with user expectations

**Implementation**:
```typescript
function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
// Example output: "Apr 27, 2026" (en-US) or "27 Apr 2026" (en-GB)
```

### 4. UI Entry Point

**Decision**: Add schedule configuration to the Progress page (/progress)

**Rationale**:
- Per spec clarification: dedicated settings page
- Progress page already exists with roadmap-specific views
- Natural location for schedule settings alongside data management
- No new page needed

**UI Location**:
- Add "Study Schedule" section above "Data Management" in progress.vue
- Show when a roadmap is selected
- Collapsible/expandable similar to phase breakdown

### 5. Conditional Display Logic

**Decision**: Check schedule existence to toggle between duration labels and dates

**Rationale**:
- Simple boolean check: `hasSchedule(roadmapId)`
- PhaseCard receives either duration string or projected date
- Clean separation of concerns

**Component Updates**:
- PhaseCard: Accept `projectedDate?: Date` prop, display instead of duration when provided
- RoadmapTimeline: Similar conditional logic
- Progress overview: Show overall completion date when schedule exists

### 6. Edge Cases Handling

**Decision**: Document specific behaviors for edge cases

| Edge Case | Behavior |
|-----------|----------|
| 7 days/week | Accept and calculate (no weekly boundary issues) |
| Past start date | Accept - useful for users who started earlier |
| Future start date | Accept - planning ahead |
| 0 topics | Display "No completion date" or hide |
| localStorage cleared | Gracefully revert to duration labels |
| Invalid date input | Prevent save, show validation error |

### 7. Reactivity Approach

**Decision**: Use Vue composable with reactive state

**Rationale**:
- `useSchedule()` composable returns reactive refs
- Components auto-update when schedule changes
- SSR-safe with `onMounted` initialization pattern (same as useProgress)

## Dependencies

No new npm dependencies required. Native JavaScript Date and Intl APIs are sufficient.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Date calculation accuracy | Use ceiling for partial weeks, always round up |
| Timezone issues | Store ISO date strings, use local timezone for display |
| SSR hydration mismatch | Initialize from localStorage in onMounted only |
| User confusion | Clear UI labels ("Projected completion: Apr 27, 2026") |

## Open Questions Resolved

All questions from spec clarification have been resolved:
1. **Schedule scope**: Per-roadmap (separate schedules)
2. **UI entry point**: Progress page with dedicated section
