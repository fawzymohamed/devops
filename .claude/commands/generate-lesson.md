---
description: Generate a new lesson markdown file with proper frontmatter and content
allowed-tools: Read, Write, Bash
---

Generate a lesson markdown file for the DevOps LMS.

**Arguments**: $ARGUMENTS

Format options:
- Full path: "phase-1-sdlc/sdlc-models/waterfall-model"
- Topic only: "phase-1-sdlc/sdlc-models" (generates all subtopics)
- Phase only: "phase-1-sdlc" (generates all topics and subtopics)

## Steps

1. Parse the arguments to determine scope (phase/topic/subtopic)
2. Read `app/data/roadmap.ts` to get the subtopic details
3. Create directory structure if needed:
   ```
   content/
   └── 1.{phase-slug}/
       └── 1.{topic-slug}/
           └── 1.{subtopic-slug}.md
   ```
4. Generate markdown file with frontmatter
5. Add educational content (500-800 words)
6. Report what was created

## Frontmatter Template

```yaml
---
title: "Subtopic Title"
description: "One-line description for SEO and previews"
estimatedMinutes: 15
difficulty: beginner | intermediate | advanced
learningObjectives:
  - "First measurable learning objective"
  - "Second measurable learning objective"
  - "Third measurable learning objective"
quiz:
  passingScore: 70
  questions:
    - question: "Question text here?"
      type: single
      options: ["Option A", "Option B", "Option C", "Option D"]
      correctAnswer: "Option A"
      explanation: "Why Option A is correct"
    - question: "True or false question here"
      type: true-false
      correctAnswer: true
      explanation: "Explanation of the answer"
    - question: "Select all that apply question"
      type: multiple
      options: ["Option A", "Option B", "Option C", "Option D"]
      correctAnswers: ["Option A", "Option C"]
      explanation: "Why A and C are correct"
---
```

## Content Structure

```markdown
# {Title}

Brief introduction (1-2 paragraphs) explaining what this topic is and why it matters.

## Core Concept 1

Detailed explanation with examples.

### Sub-section (if needed)

More detail.

## Core Concept 2

Another main section.

## Practical Example

Code block or real-world example:

```bash
# Example command
ls -la
```

## Key Takeaways

- Bullet point summary
- Important things to remember
- Connection to DevOps practices
```

## Quality Checklist

- [ ] Title matches roadmap.ts
- [ ] 3-5 learning objectives (measurable verbs)
- [ ] 3-5 quiz questions (mix of types)
- [ ] **CRITICAL: Quiz questions ONLY test concepts explicitly covered in the lesson content**
- [ ] Difficulty matches topic complexity
- [ ] Estimated time is realistic (100-150 words/min reading)
- [ ] Code examples are accurate
- [ ] Content connects to DevOps context

Skip files that already exist unless explicitly asked to overwrite.
