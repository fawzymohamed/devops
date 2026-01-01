---
description: Show current implementation status and suggest next steps
allowed-tools: Read, Glob, Bash
---

Check the current implementation status of the DevOps LMS project.

## Process

1. **Read CLAUDE.md** - Check the implementation status checkboxes
2. **Scan directories** - Verify what files actually exist
3. **Count content files** - How many lesson markdown files exist
4. **Check for errors** - Run typecheck and lint
5. **Suggest next steps** - What should be worked on next

## Commands to Run

```bash
# Count components by category
find app/components -name "*.vue" 2>/dev/null | wc -l
find app/components/lesson -name "*.vue" 2>/dev/null | wc -l
find app/components/quiz -name "*.vue" 2>/dev/null | wc -l
find app/components/progress -name "*.vue" 2>/dev/null | wc -l

# Count pages
find app/pages -name "*.vue" 2>/dev/null | wc -l

# Count composables
find app/composables -name "*.ts" 2>/dev/null | wc -l

# Count content files
find content -name "*.md" 2>/dev/null | wc -l

# Check for TypeScript errors
npm run typecheck 2>&1 | tail -10

# Check for lint errors
npm run lint 2>&1 | tail -10
```

## Status Report Format

```markdown
## LMS Implementation Status

**Last checked**: [timestamp]

### Phase Completion
- [x] Phase 1: Foundation Setup
- [~] Phase 2: Content Structure (in progress)
- [ ] Phase 3: Routing & Pages
- [ ] Phase 4: Components
- [ ] Phase 5: Composables
- [ ] Phase 6: Update Existing Components

### File Counts

| Category | Count | Target |
|----------|-------|--------|
| Lesson content | X | 527 |
| Components | X | ~20 |
| Pages | X | ~7 |
| Composables | X | 3 |

### Component Breakdown
- lesson/: X components
- quiz/: X components
- progress/: X components
- certificate/: X components

### Code Health
- **TypeScript**: ✓ No errors / ✗ X errors
- **Lint**: ✓ Passed / ✗ X warnings

### Recent Activity
- Last modified files...

### Recommended Next Steps
1. [Most important action]
2. [Second priority]
3. [Third priority]

### Blockers/Issues
- [Any blocking issues]
```

## Recommendations Logic

- If Phase 1 incomplete → "Complete foundation setup first"
- If no content files → "Start generating lesson content"
- If pages missing → "Create routing pages"
- If components missing → "Build UI components"
- If TypeScript errors → "Fix TypeScript errors before continuing"
