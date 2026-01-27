# Quickstart: Date-Based Schedule System

**Feature Branch**: `1-schedule-dates`
**Date**: 2026-01-27

## Overview

This feature adds a study schedule system that replaces static duration labels (e.g., "1-2 weeks") with projected completion dates based on user-configured study pace.

## Key Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `app/data/types.ts` | MODIFY | Add `StudySchedule` interface |
| `app/composables/useSchedule.ts` | CREATE | Schedule management composable |
| `app/composables/useProgress.ts` | MODIFY | Integrate schedule storage |
| `app/components/progress/ScheduleSettings.vue` | CREATE | Schedule configuration UI |
| `app/components/PhaseCard.vue` | MODIFY | Show dates vs duration |
| `app/pages/progress.vue` | MODIFY | Add schedule settings section |

## Implementation Order

### Step 1: Types (5 min)

Add `StudySchedule` interface to `app/data/types.ts`:

```typescript
interface StudySchedule {
  startDate: string        // ISO date (YYYY-MM-DD)
  studyDaysPerWeek: number // 1-7
}
```

### Step 2: Composable (30 min)

Create `app/composables/useSchedule.ts`:

```typescript
export function useSchedule() {
  const { progress, saveToStorage } = useProgress()

  function hasSchedule(roadmapId: string): boolean {
    return !!progress.value.roadmaps[roadmapId]?.schedule
  }

  function setSchedule(roadmapId: string, schedule: StudySchedule): void {
    // Ensure roadmap exists, set schedule, save
  }

  function getProjectedRoadmapCompletion(roadmapId: string): Date | null {
    // Calculate: startDate + (totalTopics / studyDaysPerWeek) weeks
  }

  // ... other functions
}
```

### Step 3: Settings Component (45 min)

Create `app/components/progress/ScheduleSettings.vue`:

- Date input for start date
- Number input (1-7) for study days per week
- Save/Remove buttons
- Validation feedback

### Step 4: PhaseCard Update (20 min)

Modify `app/components/PhaseCard.vue`:

- Accept optional `projectedDate` prop
- Show date if provided, otherwise show duration
- Update badge styling for dates

### Step 5: Progress Page Integration (20 min)

Modify `app/pages/progress.vue`:

- Import and use `useSchedule`
- Add ScheduleSettings component
- Pass projected dates to phase cards

## Testing Checklist

- [ ] Set schedule with valid date and days (1-7)
- [ ] Schedule persists after page reload
- [ ] Duration labels hidden when schedule exists
- [ ] Projected dates display correctly
- [ ] Remove schedule reverts to duration labels
- [ ] Validation prevents 0 or 8+ days
- [ ] Past and future start dates accepted

## Quick Reference

### Date Calculation

```typescript
const weeksToComplete = topicCount / studyDaysPerWeek
const completionDate = new Date(startDate)
completionDate.setDate(completionDate.getDate() + Math.ceil(weeksToComplete * 7))
```

### Date Formatting

```typescript
date.toLocaleDateString(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})
// Output: "Apr 27, 2026"
```

### Storage Access

```typescript
// Read
const schedule = progress.value.roadmaps[roadmapId]?.schedule

// Write
progress.value.roadmaps[roadmapId].schedule = { startDate, studyDaysPerWeek }
saveToStorage()
```

## Common Pitfalls

1. **SSR Hydration**: Always check `typeof window !== 'undefined'` before localStorage access
2. **Date Parsing**: Use `new Date(startDate + 'T00:00:00')` to avoid timezone shifts
3. **Reactivity**: Use `computed()` for derived values from schedule
4. **Validation**: Clamp `studyDaysPerWeek` to 1-7 range before saving
