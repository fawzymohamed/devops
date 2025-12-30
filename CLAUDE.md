# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A DevOps to DevSecOps learning roadmap web application built with Nuxt 4 and Nuxt UI v4. Designed for GitHub Pages deployment.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run generate  # Generate static site for GitHub Pages
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript checks
```

## Architecture

### Directory Structure
```
app/
├── components/       # Vue components
│   ├── TopicCard.vue        # Expandable topic with subtopics
│   ├── PhaseCard.vue        # Phase navigation cards
│   ├── StatsFooter.vue      # Summary statistics
│   ├── RoadmapTimeline.vue  # Timeline view mode
│   └── RoadmapGrid.vue      # Grid view mode
├── data/
│   └── roadmap.ts    # Roadmap data with TypeScript types
├── pages/
│   └── index.vue     # Main page
└── app.vue           # Root layout
```

### Data Layer
- `app/data/roadmap.ts` - Contains all roadmap phases, topics, and subtopics with TypeScript interfaces (`Phase`, `Topic`, `Priority`)
- Priority system: `essential` (red), `important` (amber), `recommended` (blue)

### UI Components
- Built with Nuxt UI v4 components: `UCard`, `UBadge`, `UButton`, `UButtonGroup`, `UHeader`, `UFooter`
- Icons from Lucide via `@iconify-json/lucide`
- Dark mode default with color mode toggle

## Deployment

Configured for GitHub Pages with:
- `baseURL: '/devops/'` in nuxt.config.ts
- GitHub Actions workflow in `.github/workflows/deploy.yml`
- Static site generation (`npm run generate`)

## Code Conventions

- Apply `cursor-pointer` class to all interactive elements (buttons, cards)
- Use Tailwind CSS for styling with responsive breakpoints (`sm:`, `md:`, `lg:`)
- TypeScript for type safety
