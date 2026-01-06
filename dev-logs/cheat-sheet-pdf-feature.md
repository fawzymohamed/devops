# Cheat Sheet PDF Export Feature

**Date:** 2026-01-06
**Feature:** Topic-level cheat sheets with multi-page PDF export
**Status:** Completed

---

## Feature Overview

### Purpose
Add manually-authored cheat sheets to the LMS at the **topic level** (e.g., "SDLC Models Quick Reference"). Each cheat sheet is a markdown file that appears as a special lesson at the end of each topic section, exportable as a multi-page PDF for offline reference.

### Key Features
- **Manual Content**: Cheat sheets are hand-crafted markdown files, not auto-generated
- **Topic-Level Scope**: One cheat sheet per topic section (not per lesson)
- **PDF Export**: Multi-page A4 document with proper margins and page breaks
- **Light Mode PDF**: Optimized for printing with white background and dark text
- **Special Navigation**: Appears at the end of topic lessons, excluded from progress tracking

---

## Technical Implementation

### 1. Content Schema Extension

**File:** `content.config.ts`

Added two optional fields to the lesson schema:

```typescript
isCheatSheet: z.boolean().optional().default(false),
cheatSheetTopic: z.string().optional(),
```

### 2. PDF Generation Composable

**File:** `app/composables/useCheatSheetPdf.ts`

Core functionality for client-side PDF generation using html2canvas + jsPDF:

```typescript
export function useCheatSheetPdf() {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  // PDF Configuration
  const MARGINS = { top: 15, right: 15, bottom: 15, left: 15 }
  const A4 = { width: 210, height: 297 }
  const CONTENT_AREA = {
    width: A4.width - MARGINS.left - MARGINS.right,
    height: A4.height - MARGINS.top - MARGINS.bottom
  }

  async function generatePDF(title: string, elementId?: string): Promise<Blob | null>
  async function downloadCheatSheet(title: string, slug: string): Promise<void>

  return { isGenerating, error, generatePDF, downloadCheatSheet }
}
```

#### Iframe Isolation Technique

The key challenge was that **html2canvas doesn't support `oklch()` colors** used by Tailwind CSS v4. The solution uses an isolated iframe to render content with plain hex colors:

```typescript
async function createProcessedClone(sourceElement: HTMLElement): Promise<HTMLElement> {
  // Create invisible iframe for isolation
  const iframe = document.createElement('iframe')
  iframe.style.position = 'absolute'
  iframe.style.left = '-9999px'
  document.body.appendChild(iframe)

  // Add light-mode CSS with hex colors only (no oklch)
  const style = iframeDoc.createElement('style')
  style.textContent = `
    body {
      background-color: #ffffff;
      color: #1f2937;
      font-family: 'Segoe UI', 'Arial', sans-serif;
    }
    th { background-color: #3b82f6; color: #ffffff; }
    code { background-color: #f3f4f6; color: #059669; }
    /* ... more light mode styles */
  `

  // Clone content into iframe
  const clone = sourceElement.cloneNode(true) as HTMLElement
  iframeDoc.body.appendChild(clone)

  return clone
}
```

#### Multi-Page Slicing

PDF pages are created by slicing the rendered canvas into page-sized chunks:

```typescript
const pxPerMm = (canvas.width / imgWidth)
const pageHeightPx = CONTENT_AREA.height * pxPerMm
const totalPages = Math.ceil(canvas.height / pageHeightPx)

for (let page = 0; page < totalPages; page++) {
  if (page > 0) pdf.addPage()

  // Calculate slice region
  const srcY = page * pageHeightPx
  const srcHeight = Math.min(pageHeightPx, canvas.height - srcY)

  // Create page canvas and draw slice
  const pageCanvas = document.createElement('canvas')
  pageCanvas.width = canvas.width
  pageCanvas.height = srcHeight

  const ctx = pageCanvas.getContext('2d')
  ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, 0, canvas.width, srcHeight)

  // Add to PDF
  pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', MARGINS.left, MARGINS.top, imgWidth, pageImgHeight)
}
```

### 3. Vue Components

#### CheatSheetLayout.vue

**File:** `app/components/CheatSheetLayout.vue`

Layout component for displaying cheat sheet content with PDF download:

```vue
<template>
  <div class="space-y-6">
    <!-- Header with title, description, and PDF button -->
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
        <p class="text-gray-400">{{ description }}</p>
      </div>
      <CheatSheetPdfButton
        :is-generating="isGenerating"
        :error="pdfError"
        @download="handleDownload"
      />
    </div>

    <!-- Content with PDF-exportable ID -->
    <div
      id="cheat-sheet-content"
      class="cheat-sheet-content cheat-sheet-prose"
    >
      <slot />
    </div>
  </div>
</template>
```

#### CheatSheetPdfButton.vue

**File:** `app/components/CheatSheetPdfButton.vue`

Download button with loading state using Nuxt UI's built-in loading:

```vue
<template>
  <div class="flex flex-col items-end gap-2">
    <UButton
      size="lg"
      color="primary"
      variant="soft"
      class="cursor-pointer"
      :loading="isGenerating"
      :disabled="isGenerating"
      loading-icon="i-lucide-loader-2"
      @click="emit('download')"
    >
      <UIcon
        v-if="!isGenerating"
        name="i-lucide-download"
        class="w-5 h-5 mr-2"
      />
      {{ isGenerating ? 'Generating...' : 'Download PDF' }}
    </UButton>

    <p v-if="error" class="text-sm text-red-400 flex items-center gap-1">
      <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
      {{ error }}
    </p>
  </div>
</template>
```

### 4. Page Integration

**File:** `app/pages/[phase]/[topic]/[subtopic].vue`

The lesson page detects cheat sheets and renders the appropriate layout:

```typescript
const isCheatSheet = computed(() => lesson.value?.isCheatSheet === true)
```

```vue
<template>
  <!-- Cheat Sheet Layout -->
  <CheatSheetLayout
    v-if="isCheatSheet"
    :title="lesson.title"
    :description="lesson.description"
    :slug="topicSlug"
  >
    <ContentRenderer :value="lesson" />
  </CheatSheetLayout>

  <!-- Regular Lesson Layout -->
  <template v-else>
    <!-- ... regular lesson content ... -->
  </template>
</template>
```

### 5. CSS Styles

**File:** `app/assets/css/main.css`

Added cheat sheet-specific styles with hex colors for PDF compatibility:

```css
.cheat-sheet-content {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  background-color: #111827 !important;
  color: #d1d5db !important;
}

.cheat-sheet-prose h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f3f4f6;
  border-bottom: 1px solid #374151;
}

.cheat-sheet-prose th {
  background-color: #1f2937;
  color: #e5e7eb;
}

.cheat-sheet-prose code:not(pre code) {
  background-color: #1f2937;
  color: #34d399;
}

@media print {
  .cheat-sheet-content {
    max-width: 100% !important;
    box-shadow: none !important;
  }
  .cheat-sheet-prose h2,
  .cheat-sheet-prose table,
  .cheat-sheet-prose pre {
    break-inside: avoid;
  }
}
```

---

## Content Structure

### File Naming Convention

Cheat sheets use `99.cheat-sheet.md` filename to ensure they appear last in navigation:

```
content/
├── 1.phase-1-sdlc/
│   ├── 1.sdlc-models/
│   │   ├── 1.waterfall-model.md
│   │   ├── 2.agile-methodology.md
│   │   ├── 3.scrum-framework.md
│   │   ├── 4.kanban-method.md
│   │   ├── 5.devops-as-sdlc-evolution.md
│   │   └── 99.cheat-sheet.md          # ← Cheat sheet
```

### Frontmatter Template

```yaml
---
title: "SDLC Models - Quick Reference"
description: "Key concepts, comparisons, and decision guides"
estimatedMinutes: 5
difficulty: beginner
learningObjectives:
  - "Quick reference for SDLC model concepts"
isCheatSheet: true
cheatSheetTopic: "SDLC Models"
---

## Key Terminology
| Term | Definition |
|------|------------|
| Waterfall | Sequential linear approach... |

## Quick Comparison Chart
| Model | Best For | Team Size | Flexibility |
|-------|----------|-----------|-------------|
| Waterfall | Fixed requirements | Any | Low |

## Decision Guide
**Choose Waterfall when:**
- Requirements are well-defined and stable
```

---

## Files Changed

### New Files

| File | Purpose |
|------|---------|
| `app/composables/useCheatSheetPdf.ts` | PDF generation with iframe isolation |
| `app/components/CheatSheetLayout.vue` | Cheat sheet display layout |
| `app/components/CheatSheetPdfButton.vue` | Download button with loading state |
| `content/1.phase-1-sdlc/1.sdlc-models/99.cheat-sheet.md` | Example cheat sheet |
| `.claude/skills/cheat-sheets/SKILL.md` | Claude Code skill for authoring |
| `.claude/commands/generate-cheat-sheet.md` | Slash command for generation |

### Modified Files

| File | Changes |
|------|---------|
| `content.config.ts` | Added `isCheatSheet`, `cheatSheetTopic` fields |
| `app/data/types.ts` | Added `CheatSheetFrontmatter` interface |
| `app/pages/[phase]/[topic]/[subtopic].vue` | Conditional rendering for cheat sheets |
| `app/assets/css/main.css` | Cheat sheet styles and print media queries |

---

## Technical Challenges & Solutions

### 1. oklch Color Parsing Error

**Problem:** html2canvas throws `Attempting to parse an unsupported color function "oklch"` because Tailwind CSS v4 uses oklch() for colors.

**Failed Approaches:**
- `onclone` callback to convert colors (parsing happens before callback)
- Force all color properties to hex in clone (stylesheets still use oklch)
- Preprocessed clone with manual color replacement (inherited styles still oklch)

**Solution:** Iframe isolation - render content in an isolated iframe with its own CSS that doesn't inherit parent stylesheets. The iframe CSS uses only hex color values.

### 2. Double Loading Icons

**Problem:** Two spinning icons appeared when clicking download button.

**Cause:** UButton had `:loading="isGenerating"` (shows built-in spinner) AND a custom loader icon in the template.

**Solution:** Remove custom loader template, use only UButton's built-in loading with `loading-icon="i-lucide-loader-2"`.

### 3. Text Cut Between Pages

**Problem:** Content was overlapping or cut at page boundaries.

**Old Approach:** Overlay single tall image with negative offset per page.

**Solution:** Slice canvas into separate page-sized chunks, each rendered as its own image in the PDF.

---

## Usage

### Viewing a Cheat Sheet
Navigate to: `/devops/{phase}/{topic}/cheat-sheet`

Example: `/devops/phase-1-sdlc/sdlc-models/cheat-sheet`

### Downloading as PDF
1. Open the cheat sheet page
2. Click "Download PDF" button
3. PDF generates in browser (shows loading state)
4. File downloads as `{topic-slug}-cheat-sheet.pdf`

### Creating New Cheat Sheets
1. Create `99.cheat-sheet.md` in topic folder
2. Add frontmatter with `isCheatSheet: true`
3. Write content using tables, code blocks, and lists
4. Test PDF export

---

## PDF Output Specifications

| Property | Value |
|----------|-------|
| Format | A4 Portrait |
| Margins | 15mm all sides |
| Background | White (#ffffff) |
| Text Color | Dark gray (#1f2937) |
| Accent Color | Blue (#3b82f6) |
| Code Background | Light gray (#f3f4f6) |
| Resolution | 2x scale for crisp text |
| Filename | `{topic-slug}-cheat-sheet.pdf` |

---

## Dependencies

Uses existing dependencies already installed:
- `html2canvas` - Renders DOM to canvas
- `jspdf` - Creates PDF from canvas images

---

## Related Documentation

- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [jsPDF Documentation](https://rawgit.com/MrRio/jsPDF/master/docs/)
- Tailwind CSS v4 oklch colors: https://tailwindcss.com/docs/colors
