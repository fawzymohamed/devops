# Quickstart: Phase Certificate Generation

**Feature Branch**: `001-certificate-generation`
**Date**: 2026-01-12

## Prerequisites

- Node.js 18+ installed
- Repository cloned and on `001-certificate-generation` branch
- Dependencies installed (`npm install`)

## Development Setup

```bash
# Start development server
npm run dev

# Access the app
open http://localhost:3000
```

## Testing the Feature

### 1. Test Certificate Dashboard (Empty State)

1. Navigate to `/certificate`
2. Verify all 10 phase cards show as "locked"
3. Verify progress bars display 0%
4. Verify "DevOps Master Certificate" shows as locked

### 2. Test Name Entry Flow

1. Click "View Certificate" on any unlocked certificate (requires completing a phase first)
2. Modal should prompt for name entry
3. Enter name and save
4. Verify name persists on page reload

### 3. Test Phase Certificate Unlock

1. Complete all lessons in Phase 1 (SDLC)
   - Navigate to each lesson in `/phase-1-sdlc/`
   - Click "Mark Complete" on each lesson
2. Return to `/certificate`
3. Verify Phase 1 card shows "Unlocked" status
4. Click "View Certificate"
5. Verify certificate preview shows correct:
   - Learner name
   - Phase name ("Software Development Lifecycle")
   - Completion date
   - Lessons completed count
   - Certificate ID

### 4. Test PDF Download

1. From certificate preview, click "Download PDF"
2. Verify loading indicator appears
3. Verify PDF downloads with filename `DevOps-Phase1-Certificate-{ID}.pdf`
4. Open PDF and verify:
   - A4 landscape format
   - All text readable
   - Dark mode design preserved

### 5. Test Course Completion Certificate

1. Complete all lessons in all 10 phases (or use dev tools to simulate)
2. Navigate to `/certificate`
3. Verify "DevOps Master Certificate" shows as unlocked
4. Verify aggregate stats display correctly

## Quick Verification Checklist

- [ ] `/certificate` page loads without errors
- [ ] All 10 phase cards render correctly
- [ ] Name input modal works
- [ ] Name persists in localStorage
- [ ] Unlocked certificates show "View" button
- [ ] Locked certificates show progress percentage
- [ ] PDF downloads successfully
- [ ] PDF contains correct information
- [ ] Course completion certificate unlocks at 100%

## Dev Tools Shortcuts

### Simulate Phase Completion (Browser Console)

```javascript
// Get current progress
const progress = JSON.parse(localStorage.getItem('devops-lms-progress'))

// Add a test name
progress.userName = 'Test User'

// Save back
localStorage.setItem('devops-lms-progress', JSON.stringify(progress))

// Reload to see changes
location.reload()
```

### Reset Progress

```javascript
localStorage.removeItem('devops-lms-progress')
location.reload()
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Certificate page 404 | Ensure `pages/certificate.vue` exists |
| PDF generation fails | Check browser console for html2canvas errors |
| Name not saving | Check localStorage permissions in browser |
| Progress not reflecting | Hard refresh (Ctrl+Shift+R) to clear cache |

## Files to Implement

| File | Purpose | Priority |
|------|---------|----------|
| `app/pages/certificate.vue` | Dashboard page | P1 |
| `app/components/certificate/CertificatePreview.vue` | Visual design | P1 |
| `app/components/certificate/CertificateCard.vue` | Dashboard card | P1 |
| `app/components/certificate/CertificateDownloadButton.vue` | Download button | P1 |
| `app/components/certificate/NameInputModal.vue` | Name entry | P2 |
| `app/data/types.ts` | Type extensions | P1 |
| `app/composables/useCertificate.ts` | Extend composable | P1 |
