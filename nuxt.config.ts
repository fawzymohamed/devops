/**
 * Nuxt Configuration File
 * =======================
 * This file contains the main configuration for the Nuxt 4 application.
 * It configures modules, styling, deployment settings, and code quality tools.
 *
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  /**
   * Nuxt Modules
   * ------------
   * - @nuxt/eslint: Provides ESLint integration for code quality
   * - @nuxt/ui: Nuxt UI v4 component library with Tailwind CSS
   * - @nuxt/content: Markdown-based content management for lessons
   */
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content'
  ],

  /**
   * Nuxt Content Configuration
   * --------------------------
   * Configures the @nuxt/content module for lesson markdown files.
   * - build.markdown.highlight: Syntax highlighting for code blocks using Shiki
   * - build.markdown.toc: Table of contents generation settings
   */
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: ['bash', 'typescript', 'javascript', 'python', 'yaml', 'dockerfile', 'json', 'sql', 'powershell', 'shell']
        },
        toc: {
          depth: 3,
          searchDepth: 3
        }
      }
    }
  },

  /**
   * GitHub Pages Deployment Configuration
   * -------------------------------------
   * - ssr: false - Disables server-side rendering for static site generation
   * - baseURL: '/devops/' - Sets the base path for GitHub Pages (repo name)
   * - nitro preset: 'github-pages' - Optimizes build output for GitHub Pages
   *
   * Note: The baseURL must match your GitHub repository name for proper routing.
   * The site will be accessible at: https://<username>.github.io/devops/
   */
  ssr: false,

  /**
   * Nuxt DevTools
   * -------------
   * Enables the Nuxt DevTools for debugging and development insights.
   * Provides component inspection, state management, and performance metrics.
   */
  devtools: {
    enabled: true
  },
  app: {
    baseURL: '/devops/'
  },

  /**
   * Global CSS
   * ----------
   * Imports the main CSS file containing custom styles and Tailwind directives.
   */
  css: ['~/assets/css/main.css'],

  /**
   * Color Mode Configuration
   * ------------------------
   * Forces dark mode as the only theme for this application.
   * This ensures consistent appearance across all user preferences.
   */
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classPrefix: '',
    classSuffix: ''
  },

  /**
   * Route Rules
   * -----------
   * Configures pre-rendering for specific routes.
   * The home page is pre-rendered at build time for optimal performance.
   */
  routeRules: {
    '/': { prerender: true }
  },

  /**
   * Compatibility Date
   * ------------------
   * Locks Nuxt behavior to a specific date to ensure consistent builds.
   * This prevents breaking changes from affecting the application.
   */
  compatibilityDate: '2025-01-15',
  nitro: {
    preset: 'github-pages'
  },

  /**
   * ESLint Configuration
   * --------------------
   * Configures code style rules for consistent formatting:
   * - commaDangle: 'never' - No trailing commas
   * - braceStyle: '1tbs' - One True Brace Style (opening brace on same line)
   */
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
