---
description: Generate a cheat sheet markdown file for a topic by analyzing existing lessons
allowed-tools: Read, Write, Glob, Bash
---

Generate a cheat sheet for a topic in the DevOps LMS.

**Arguments**: $ARGUMENTS

Format: `phase-slug/topic-slug` (e.g., "phase-1-sdlc/sdlc-models")

## Steps

1. **Parse Arguments**
   - Extract phase and topic from the provided path
   - Validate that the topic directory exists

2. **Read Existing Lessons**
   - Find all lesson files in `content/{phase}/{topic}/`
   - Read each lesson to understand the content
   - Extract key concepts, terminology, and patterns

3. **Analyze Content**
   - Identify the topic type (concept, tool, workflow)
   - Determine what template to use:
     - **Concept comparison** for methodology topics (SDLC, DevOps culture)
     - **Command reference** for tool topics (Git, Docker, Kubernetes)
     - **Process reference** for workflow topics (CI/CD, deployments)

4. **Generate Cheat Sheet**
   - Create `content/{phase}/{topic}/99.cheat-sheet.md`
   - Use the appropriate template from the `cheat-sheets` skill
   - Synthesize key information from lessons into tables
   - Keep content scannable and reference-oriented

5. **Validate Output**
   - Ensure `isCheatSheet: true` in frontmatter
   - Verify `cheatSheetTopic` is set
   - Check content is appropriately dense (not too long)

## Frontmatter Template

```yaml
---
title: "{Topic Name} - Quick Reference"
description: "Key concepts, commands, and quick tips for {topic}"
estimatedMinutes: 5
difficulty: {average of topic lessons}
learningObjectives:
  - "Quick reference for {topic} concepts"
isCheatSheet: true
cheatSheetTopic: "{Topic Name}"
---
```

## Content Structure

Based on topic type, use one of these structures:

### For Concept Topics
```markdown
## Key Terminology
| Term | Definition |

## Quick Comparison
| Aspect | Option A | Option B |

## Decision Guide
**Choose X when:**
```

### For Tool Topics
```markdown
## Essential Commands
| Command | Purpose | Example |

## Common Patterns
### Pattern Name
```bash
code
```

## Troubleshooting
| Error | Solution |
```

### For Workflow Topics
```markdown
## Process Overview
[Illustration if appropriate]

## Step-by-Step
### Step 1
- Actions

## Best Practices
- [ ] Practice 1
```

## Quality Checklist

- [ ] Frontmatter includes `isCheatSheet: true`
- [ ] Content is scannable (tables, bullets)
- [ ] No paragraphs longer than 2 sentences
- [ ] Synthesizes content (not just copied)
- [ ] No quiz section
- [ ] 1-3 pages when printed

## Example Output Path

Input: `phase-1-sdlc/sdlc-models`
Output: `content/1.phase-1-sdlc/1.sdlc-models/99.cheat-sheet.md`

Note: Adjust path prefixes based on actual directory structure.
