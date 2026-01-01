---
description: Test a feature implementation with automated and manual checks
allowed-tools: Read, Glob, Bash
---

Test the feature: $ARGUMENTS

If no feature specified, test the most recently modified files.

## Process

1. **Identify feature files** - Find all files related to the feature
2. **Run automated checks** - TypeScript, lint, and build verification
3. **Generate test checklist** - Manual testing steps specific to the feature
4. **Provide dev server instructions** - How to manually verify the feature

## Automated Checks

Run these commands to verify code quality:

```bash
# TypeScript check
npm run typecheck 2>&1 | head -30

# Lint check
npm run lint 2>&1 | head -30

# Build check (catches SSR issues)
npm run build 2>&1 | tail -20
```

## Feature-Specific Testing

### For Lesson Pages
```bash
# Verify content file exists
ls -la content/[phase]/[topic]/[subtopic].md

# Check frontmatter validity
head -50 content/[phase]/[topic]/[subtopic].md
```

**Manual checks:**
- [ ] Navigate to lesson URL in browser
- [ ] Verify content renders correctly
- [ ] Check learning objectives display
- [ ] Test quiz functionality
- [ ] Verify "Mark Complete" button works
- [ ] Test previous/next navigation
- [ ] Check mobile responsiveness

### For Components
```bash
# Find component usage
grep -r "ComponentName" --include="*.vue" app/
```

**Manual checks:**
- [ ] Component renders without errors
- [ ] Props work correctly
- [ ] Events emit properly
- [ ] Responsive on mobile
- [ ] Follows accessibility guidelines
- [ ] Has loading/error states

### For Composables
```bash
# Find composable usage
grep -r "useComposableName" --include="*.vue" --include="*.ts" app/
```

**Manual checks:**
- [ ] State updates correctly
- [ ] Persists to localStorage (if applicable)
- [ ] Works after page refresh
- [ ] No SSR hydration errors

### For Pages
**Manual checks:**
- [ ] Route works correctly
- [ ] Loading skeleton displays
- [ ] Error state handles gracefully
- [ ] SEO meta tags present
- [ ] Breadcrumbs work
- [ ] Mobile responsive

## Output Format

```markdown
## Feature Test: [feature-name]

**Files tested**: X files
**Automated checks**: ✓ Passed / ✗ Failed

### Automated Results

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript | ✓/✗ | [errors if any] |
| Lint | ✓/✗ | [warnings if any] |
| Build | ✓/✗ | [errors if any] |

### Manual Testing Checklist

**Dev server command:**
```bash
npm run dev
```

**Test URL:** `http://localhost:3000/[path-to-feature]`

**Checklist:**
- [ ] [Feature-specific check 1]
- [ ] [Feature-specific check 2]
- [ ] [Feature-specific check 3]
- [ ] Mobile responsive (use browser devtools)
- [ ] No console errors

### Issues Found
1. **[Issue]** - [Description and suggested fix]

### Verdict
✓ Ready for commit
⚠ Needs minor fixes (list above)
✗ Needs major fixes (list above)
```

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Open browser to test
# Windows
start http://localhost:3000

# Mac
open http://localhost:3000

# Linux
xdg-open http://localhost:3000
```
