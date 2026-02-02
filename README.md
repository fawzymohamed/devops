# DevOps Roadmap LMS

A multi‑roadmap learning platform built with Nuxt 4 + Nuxt UI. It ships a DevOps roadmap and a Full‑Stack Interview Mastery roadmap with lessons, quizzes, progress tracking, and certificates.

## Features

- Multi‑roadmap LMS (DevOps + Full Stack)
- Markdown‑driven lessons via `@nuxt/content`
- Progress tracking + resume learning
- Quizzes with scoring
- Certificates + cheat‑sheet PDF export
- Dark mode UI

## Tech Stack

- Nuxt 4, Vue 3, TypeScript
- `@nuxt/ui`, `@nuxt/content`
- Tailwind CSS
- html2canvas + jsPDF

## Setup

```bash
npm install
```

## Development

Start the dev server (configured on port **5000**):

```bash
npm run dev
```

Open: http://localhost:5000

## Build & Preview

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

This project is configured for **Vercel** deployment.

- `nitro.preset` is set to `vercel`
- `app.baseURL` is `/`

## Scripts

- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run generate` — Static generation
- `npm run preview` — Preview build
- `npm run lint` — ESLint
- `npm run typecheck` — Type checks
