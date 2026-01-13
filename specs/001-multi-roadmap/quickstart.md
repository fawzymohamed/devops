# Quickstart Guide: Multi-Roadmap Support

**Feature**: 001-multi-roadmap
**Date**: 2026-01-13

## Prerequisites

- Node.js 18+
- Git
- Project cloned and dependencies installed

```bash
cd D:\WebDev\devops
npm install
```

## Implementation Order

### Phase A: Data Layer (Foundation)

**Files to create/modify:**

1. `app/data/types.ts` - Add `Roadmap` and `MultiRoadmapProgress` interfaces
2. `app/data/fullstack-roadmap.ts` - Full Stack roadmap phase/topic data
3. `app/data/roadmaps.ts` - Roadmap registry with both roadmaps
4. `app/data/roadmap.ts` - Update exports (rename `roadmapData` → `devopsPhases`)

**Verify:**
```bash
npm run typecheck
```

### Phase B: Progress Composable (Core)

**Files to modify:**

1. `app/composables/useProgress.ts`
   - Update storage structure to `MultiRoadmapProgress`
   - Add migration logic for existing users
   - Update all functions to accept `roadmapId` parameter

**Verify:**
```bash
npm run dev
# Open browser console
# Check localStorage migration works
```

### Phase C: Roadmap Context (Utilities)

**Files to create:**

1. `app/composables/useRoadmap.ts` - Roadmap context provider

**Verify:**
```bash
npm run typecheck
```

### Phase D: Landing Page (UI)

**Files to create/modify:**

1. `app/components/RoadmapCard.vue` - New component
2. `app/pages/index.vue` - Roadmap selection UI

**Verify:**
```bash
npm run dev
# Navigate to http://localhost:5000/devops/
# Should see both roadmap cards
```

### Phase E: Full Stack Routes (Routing)

**Files to create:**

1. `app/pages/fullstack/index.vue` - Full Stack roadmap home
2. `app/pages/fullstack/[phase]/[topic]/[subtopic].vue` - Lesson pages

**Verify:**
```bash
npm run dev
# Navigate to http://localhost:5000/devops/fullstack
```

### Phase F: Component Updates (Integration)

**Files to modify:**

1. `app/components/PhaseCard.vue` - Add `roadmapId` prop
2. `app/components/TopicCard.vue` - Add `roadmapId` prop
3. `app/components/progress/OverallProgress.vue` - Per-roadmap progress
4. `app/pages/progress.vue` - Multi-roadmap dashboard

**Verify:**
```bash
npm run dev
# Check progress displays correctly per roadmap
```

### Phase G: Certificates (Final)

**Files to modify:**

1. `app/composables/useCertificate.ts` - Roadmap-specific certificates
2. `app/pages/certificate.vue` - Handle roadmap query param

**Verify:**
```bash
npm run dev
# Check certificate generation shows correct roadmap name
```

### Phase H: Navigation (Polish)

**Files to create/modify:**

1. `app/components/RoadmapSwitcher.vue` - New component
2. `app/layouts/default.vue` - Add roadmap switcher

**Verify:**
```bash
npm run dev
# Test switching between roadmaps from header
```

---

## Testing Checklist

### Data Layer
- [ ] TypeScript compilation passes
- [ ] Both roadmaps load without errors
- [ ] Priority config works for both roadmaps

### Progress Migration
- [ ] New users start with empty v2 structure
- [ ] Existing DevOps progress migrates to v2 automatically
- [ ] Migrated data appears under `roadmaps.devops`

### Landing Page
- [ ] Both roadmap cards displayed
- [ ] Progress indicators show correct percentages
- [ ] Click navigates to correct roadmap

### Routing
- [ ] DevOps URLs work without changes (backward compatible)
- [ ] Full Stack URLs work with `/fullstack` prefix
- [ ] 404 errors show appropriate messages

### Progress Tracking
- [ ] Completing DevOps lesson only affects DevOps progress
- [ ] Completing Full Stack lesson only affects Full Stack progress
- [ ] Export/import preserves both roadmaps' data

### Certificates
- [ ] DevOps certificate shows "DevOps Master Certificate"
- [ ] Full Stack certificate shows "Full Stack Interview Mastery Certificate"
- [ ] Certificate IDs include roadmap identifier

---

## Common Commands

```bash
# Development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Static generation (for deployment)
npm run generate
```

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Roadmap types | `app/data/types.ts` |
| DevOps data | `app/data/roadmap.ts` |
| Full Stack data | `app/data/fullstack-roadmap.ts` |
| Roadmap registry | `app/data/roadmaps.ts` |
| Progress composable | `app/composables/useProgress.ts` |
| Roadmap context | `app/composables/useRoadmap.ts` |
| Certificate logic | `app/composables/useCertificate.ts` |
| Landing page | `app/pages/index.vue` |
| Full Stack home | `app/pages/fullstack/index.vue` |
| Progress dashboard | `app/pages/progress.vue` |

---

## Troubleshooting

### Progress not migrating
- Clear localStorage: `localStorage.removeItem('devops-lms-progress')`
- Reload page
- Check browser console for migration errors

### Routes not working
- Verify file naming matches Nuxt conventions
- Check `routePrefix` in roadmap config
- Run `npm run build` to catch route issues

### TypeScript errors
- Ensure all interfaces updated in `types.ts`
- Check import paths use `~/` alias
- Run `npm run typecheck` for details
