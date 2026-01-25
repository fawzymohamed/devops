# GEMINI.md

This file provides guidance to the Gemini AI agent when working with the code in this repository.

## Project Overview

This project is a multi-roadmap Learning Management System (LMS) built with Nuxt.js. It currently features two roadmaps: a DevOps roadmap and a Full Stack Interview Mastery roadmap.

- **Framework**: Nuxt 4 with @nuxt/content
- **UI Library**: Nuxt UI v4
- **Styling**: Tailwind CSS (dark mode only)
- **Deployment**: GitHub Pages (static generation)
- **Data**: The project includes extensive data for both the DevOps and Full Stack roadmaps, with hundreds of topics and subtopics.

## Tech Stack

- Nuxt 4.x
- Vue 3 Composition API (`<script setup lang="ts">`)
- TypeScript (strict mode)
- @nuxt/content for markdown-based lessons
- Nuxt UI v4 for UI components
- Tailwind CSS
- `html2canvas` and `jspdf` for certificate generation
- Icons from Lucide via `@iconify-json/lucide`

## Commands

Here are the essential commands for this project:

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the development server at `http://localhost:5000`.
- `pnpm build`: Build the application for production.
- `pnpm generate`: Generate the static site for GitHub Pages deployment.
- `pnpm preview`: Preview the production build locally.
- `pnpm lint`: Run ESLint to check for code style issues.
- `pnpm typecheck`: Run TypeScript to check for type errors.

## Architecture

### Directory Structure

The project follows a standard Nuxt.js directory structure:

- `app/`: Contains the core application code.
  - `components/`: Vue components, organized by feature.
  - `composables/`: Reusable Vue composables.
  - `data/`: Roadmap data and TypeScript types.
  - `layouts/`: Page layouts.
  - `pages/`: Application pages and routes.
- `content/`: Markdown files for the lesson content.
- `public/`: Static assets.
- `scripts/`: Node.js scripts for various tasks.

### Data Layer

The application's data is managed through a set of files in the `app/data` directory:

- `app/data/roadmap.ts`: Contains the data for the DevOps roadmap.
- `app/data/fullstack-roadmap.ts`: Contains the data for the Full Stack roadmap.
- `app/data/roadmaps.ts`: A registry of all available roadmaps.
- `app/data/types.ts`: Shared TypeScript interfaces.

### UI Components

The UI is built with Nuxt UI v4 components and is styled with Tailwind CSS. The application is configured to use dark mode exclusively.

### SVG Illustration System

The project includes a system for creating hand-drawn style SVG illustrations for lessons using reusable Markdown Components (MDC). These components are located in `app/components/content/`.

### Progress Tracking

A comprehensive progress tracking system is implemented using a Vue composable (`useProgress.ts`) and `localStorage` for persistence.

## Deployment

The application is configured for deployment to GitHub Pages. The `.github/workflows/deploy.yml` file defines the GitHub Actions workflow for building and deploying the site.

## Code Conventions

- **Component Naming**: `PascalCase.vue`
- **Composable Naming**: `useCamelCase.ts`
- **Styling**: Use Tailwind CSS classes.
- **Interactivity**: Apply the `cursor-pointer` class to all interactive elements.
- **Comments**: All code files should include descriptive comments, including a file-level header comment and JSDoc-style comments for functions.
