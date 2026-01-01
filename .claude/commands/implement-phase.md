---
description: Implement a specific phase from the LMS Implementation Plan
allowed-tools: Read, Write, Bash, Glob
---

Implement Phase $ARGUMENTS from the LMS Implementation Plan.

## Process

1. **Read the plan**: Open `LMS_IMPLEMENTATION_PLAN.md` and find the specified phase
2. **Enter Plan Mode**: Analyze what needs to be done before coding
3. **Create a checklist**: Write implementation steps to `plan.md`
4. **Implement systematically**: Work through each item
5. **Verify**: Run typecheck and test after each major change
6. **Update status**: Check off completed items in CLAUDE.md

## Phase Reference

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| 1 | Foundation Setup | deps, nuxt.config, types.ts |
| 2 | Content Structure | content/ directories, markdown templates, generation script |
| 3 | Routing & Pages | URL structure, [phase]/[topic]/[subtopic].vue pages |
| 4 | Components | lesson/, quiz/, progress/, certificate/ components |
| 5 | Composables | useProgress, useQuiz, useCertificate |
| 6 | Update Existing | index.vue, PhaseCard, TopicCard with progress |

## Quality Gates

After implementing each phase:

```bash
# Must pass
npm run typecheck
npm run lint
npm run dev  # Start without errors

# Manual verification
# - New features work as expected
# - Mobile responsive
# - No console errors
```

## Output

When complete, provide:
1. Summary of files created/modified
2. Any issues encountered and resolutions
3. Next steps for the following phase
4. Updated status for CLAUDE.md

## Example Output

```
## Phase 3 Complete: Routing & Pages

### Files Created
- app/pages/[phase]/index.vue
- app/pages/[phase]/[topic]/index.vue
- app/pages/[phase]/[topic]/[subtopic].vue
- app/pages/progress.vue
- app/pages/certificate.vue
- app/layouts/lesson.vue

### Files Modified
- app/pages/index.vue (added navigation links)

### Verification
- TypeScript: ✓ No errors
- Lint: ✓ Passed
- Dev server: ✓ Running
- Routes tested: ✓ All working

### Next Steps
- Phase 4: Create lesson/, quiz/, progress/ components
- Consider: Add loading states to pages

### CLAUDE.md Update
- [x] Phase 3: Routing & Pages
```
