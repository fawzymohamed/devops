# Implementation Plan: Phase Certificate Generation

**Branch**: `001-certificate-generation` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-certificate-generation/spec.md`

## Summary

Implement a certificate system that awards learners with downloadable PDF certificates upon completing each of the 10 roadmap phases, plus a special "DevOps Master Certificate" for full course completion. The feature builds upon the existing `useCertificate` composable and `useProgress` composable, adding phase-level certificate support, a certificates dashboard page, and learner name personalization stored in localStorage.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Vue 3.x, Nuxt 4.x, Nuxt UI v4, html2canvas, jsPDF
**Storage**: localStorage (key: `devops-lms-progress` for progress, new key for learner profile)
**Testing**: Manual testing with browser DevTools, visual verification of PDF output
**Target Platform**: Web browsers (Vercel static output)
**Project Type**: Web application (Nuxt 4 full-stack, Vercel static output)
**Performance Goals**: Certificate download within 5 seconds, dashboard load within 2 seconds
**Constraints**: SSR-safe (no server-side localStorage access), static generation compatible
**Scale/Scope**: 10 phase certificates + 1 course completion certificate, single-user local storage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Content-First Architecture | ✅ PASS | Feature extends content delivery by rewarding lesson completion |
| II. Type Safety | ✅ PASS | Will extend `CertificateData` interface in `app/data/types.ts`, use TypeScript strict mode |
| III. Component Reusability | ✅ PASS | Certificate components will be data-driven, reused for phase and course certificates |
| IV. Comprehensive Documentation | ✅ PASS | Will follow established comment patterns (file headers, section dividers, JSDoc) |
| V. Static-First Deployment | ✅ PASS | Client-side PDF generation with html2canvas/jsPDF, localStorage for data, no server APIs |
| VI. Dark Mode Design | ✅ PASS | Certificate design will use dark mode palette (gray-800 background) |
| VII. User Experience Standards | ✅ PASS | `cursor-pointer` on buttons, progress indicators, consistent typography |
| VIII. Content Generation Tooling | N/A | Not creating lesson content, only certificate UI/functionality |

**Gate Result**: ✅ All applicable principles satisfied. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-certificate-generation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (N/A - no API endpoints)
```

### Source Code (repository root)

```text
app/
├── components/
│   └── certificate/
│       ├── CertificatePreview.vue      # Visual certificate design (reusable)
│       ├── CertificateCard.vue         # Dashboard card for each phase
│       ├── CertificateDownloadButton.vue # Download button with loading state
│       └── NameInputModal.vue          # Name entry/edit modal
├── composables/
│   └── useCertificate.ts               # Extend existing (add phase support)
├── data/
│   └── types.ts                        # Extend CertificateData, add PhaseCertificateData
└── pages/
    └── certificate.vue                 # Certificates dashboard page
```

**Structure Decision**: Follows existing Nuxt 4 project structure with components organized by feature (`certificate/`). No backend changes needed - all client-side with localStorage.

## Complexity Tracking

> No Constitution violations requiring justification.

| Item | Notes |
|------|-------|
| Phase-level certificates | Natural extension of existing `CertificateData` pattern |
| Name storage | Simple localStorage addition alongside existing progress data |
