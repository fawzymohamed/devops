---
description: Create a new Vue component following Nuxt 4 + Nuxt UI v4 conventions
allowed-tools: Read, Write, Glob
---

Create a new Vue 3 component for the LMS project.

**Arguments**: $ARGUMENTS

Format: "category/ComponentName" (e.g., "lesson/LessonHeader", "quiz/QuizQuestion")

## Requirements

1. Use `<script setup lang="ts">` syntax
2. Use Nuxt UI v4 components where applicable
3. Follow dark mode color palette
4. Add `cursor-pointer` class to custom clickable elements
5. Include TypeScript types for props and emits
6. Follow existing component patterns

## Component Template

```vue
<script setup lang="ts">
/**
 * ComponentName - Brief description of what this component does
 */

interface Props {
  // Required props
  title: string
  // Optional props with defaults
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'update', value: string): void
}>()

// Composables
const { someValue } = useSomeComposable()

// Reactive state
const isLoading = ref(false)

// Computed
const displayTitle = computed(() => props.title.toUpperCase())

// Methods
function handleClick() {
  emit('click')
}
</script>

<template>
  <div class="...">
    <!-- Use Nuxt UI components -->
    <UCard>
      <template #header>
        <h3>{{ displayTitle }}</h3>
      </template>
      
      <slot />
      
      <template #footer>
        <UButton @click="handleClick" class="cursor-pointer">
          Action
        </UButton>
      </template>
    </UCard>
  </div>
</template>
```

## Steps

1. Parse the category and component name from arguments
2. Check if component already exists at `app/components/{category}/{ComponentName}.vue`
3. Look at existing components in the category for patterns
4. Generate the component following conventions
5. Report the file created

## Category-Specific Guidelines

### lesson/
Components for lesson display and navigation:
- `LessonHeader` - Title, meta info, badges
- `LessonContent` - Markdown rendering
- `LessonSidebar` - Navigation tree
- `LessonBreadcrumb` - Breadcrumb trail
- `LessonNavigation` - Prev/Next buttons
- `MarkCompleteButton` - Completion CTA

### quiz/
Components for the quiz system:
- `QuizContainer` - Main quiz wrapper
- `QuizQuestion` - Individual question
- `QuizResults` - Score and feedback
- `QuizProgress` - Question X of Y

### progress/
Components for progress visualization:
- `ProgressBar` - Linear progress
- `ProgressRing` - Circular progress
- `PhaseProgress` - Phase-level card
- `OverallProgress` - Total course progress

### certificate/
Components for certificate generation:
- `CertificatePreview` - Visual certificate
- `CertificateGenerator` - PDF generation
- `CertificateDownload` - Download button

## Nuxt UI Components to Use

| Need | Use |
|------|-----|
| Buttons | `UButton` |
| Cards | `UCard` |
| Progress | `UProgress` |
| Badges | `UBadge` |
| Checkboxes | `UCheckbox` |
| Radio buttons | `URadioGroup` |
| Modals | `UModal` |
| Tooltips | `UTooltip` |
| Loading | `USkeleton` |
| Icons | `UIcon` with `i-heroicons-*` |
