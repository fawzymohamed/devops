---
description: Review code quality and suggest improvements
allowed-tools: Read, Glob, Bash
---

Review the code in: $ARGUMENTS

If no path specified, review recent changes or the most critical files.

## Review Checklist

### Vue Components (*.vue)
- [ ] Uses `<script setup lang="ts">`
- [ ] Props have TypeScript types (defineProps<Props>())
- [ ] Emits are properly typed (defineEmits<{}>())
- [ ] Uses Nuxt UI components where applicable
- [ ] `cursor-pointer` on custom clickable elements
- [ ] Follows naming conventions (PascalCase)
- [ ] No inline styles (use Tailwind)
- [ ] Has loading state with USkeleton
- [ ] Has error handling
- [ ] Responsive design (mobile-first)

### Composables (*.ts)
- [ ] Returns `readonly()` for state
- [ ] Handles SSR (checks `typeof window`)
- [ ] Has proper TypeScript return types
- [ ] localStorage wrapped in try/catch
- [ ] Uses `useState` for cross-component state

### Content Files (*.md)
- [ ] Valid YAML frontmatter
- [ ] Required fields present:
  - title
  - description
  - estimatedMinutes
  - difficulty
  - learningObjectives
  - quiz
- [ ] Quiz has 3-5 questions
- [ ] Learning objectives use measurable verbs
- [ ] Content is appropriate length (500-1000 words)

### Pages (pages/*.vue)
- [ ] Uses useAsyncData for data fetching
- [ ] Has loading skeleton
- [ ] Has error boundary
- [ ] SEO meta tags (useHead)
- [ ] Breadcrumb navigation
- [ ] Responsive layout

### General
- [ ] No TypeScript errors
- [ ] No lint warnings
- [ ] Consistent with existing patterns
- [ ] Comments only where necessary
- [ ] No console.log statements
- [ ] Accessibility (aria labels, focus states)

## Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| **Critical** | Breaks functionality | Must fix before commit |
| **Warning** | Code smell | Should fix |
| **Info** | Style suggestion | Nice to have |

## Output Format

```markdown
## Code Review: [file/directory]

**Files reviewed**: X
**Issues found**: X

### Summary
Brief overview of code quality.

### Critical Issues
1. **[Issue]**
   - File: path/to/file.vue
   - Line: XX
   - Problem: [Description]
   - Fix: [Suggested fix]

### Warnings
1. **[Issue]**
   - File: path/to/file.vue
   - Suggestion: [Improvement]

### Suggestions
- [Optional improvement]

### Good Practices Found
- [Things done well]

### Verdict
✓ Ready to commit
⚠ Needs minor fixes
✗ Needs major fixes
```

## Auto-Checks

Run these commands as part of review:

```bash
# TypeScript
npm run typecheck 2>&1

# Lint
npm run lint 2>&1

# Check for console.log
grep -r "console.log" --include="*.vue" --include="*.ts" app/

# Check for TODO comments
grep -r "TODO\|FIXME" --include="*.vue" --include="*.ts" app/
```
