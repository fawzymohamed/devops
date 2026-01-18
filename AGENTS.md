# Repository Guidelines

## Project Overview
Multi-roadmap LMS covering DevOps and Full Stack Interview Mastery. Built with Nuxt 4, Nuxt UI v4, Tailwind CSS (dark mode only), and @nuxt/content. Static generation targets GitHub Pages (`baseURL: /devops/`).

## Project Structure & Module Organization
- `app/` is the Nuxt app. Key areas: `app/pages/`, `app/components/`, `app/composables/`, `app/plugins/`, `app/assets/`.
- `app/data/` holds roadmap data: `roadmap.ts` (DevOps), `fullstack-roadmap.ts` (Full Stack), and `roadmaps.ts` (registry + stats).
- `content/` stores lesson markdown; DevOps content is at root, Full Stack content is under `content/fullstack/`.
- `public/` is static, while `.nuxt/` and `.data/` are generated.
- `specs/` and `workflows/` capture product and process docs.

## Build, Test, and Development Commands
- `pnpm dev`: start dev server at `http://localhost:3000/devops/`.
- `pnpm build`: production build.
- `pnpm generate`: static site generation (GitHub Pages).
- `pnpm preview`: preview production output.
- `pnpm lint`: run ESLint.
- `pnpm typecheck`: run Nuxt/Vue TypeScript checks.

## Data & Content Conventions
- Roadmap registry defines priorities: `essential`, `important`, `recommended` with labels “Must/Should/Good to Know.”
- Content naming: `phase-X-name/topic-name/subtopic-name.md` (example: `content/1.phase-1-sdlc/1.sdlc-models/waterfall-model.md`).
- Route prefixes: DevOps uses root routes, Full Stack is under `/fullstack`.

## Coding Style & Naming Conventions
- Use `<script setup lang="ts">` and TypeScript strict mode.
- Apply `cursor-pointer` to interactive elements.
- Components: `PascalCase.vue`; composables: `useCamelCase.ts`.
- Indentation: 2 spaces, LF, UTF-8 (`.editorconfig`). Run `pnpm lint` before pushing.

## Documentation & Comments
- Every file should start with a descriptive header comment (purpose, features, structure, data flow).
- Use section dividers and JSDoc-style comments for exported functions, types, computed values, and non-trivial logic.

## Testing Guidelines
- No dedicated automated test suite yet.
- Use `pnpm lint` and `pnpm typecheck` as quality gates; document new test commands if added.

## Commit & Pull Request Guidelines
- Use short, imperative commit summaries (e.g., “Add DOM Manipulation lessons”).
- Optional prefixes like `new feature:` are acceptable.
- PRs should explain intent, link relevant specs/issues, and include screenshots for UI changes.
