/**
 * Full Stack Roadmap Data
 * =========================
 * Structured roadmap data for the Full Stack Developer Interview Mastery track.
 */

import type { Phase } from './roadmap'

export const fullstackPhases: Phase[] = [
  // Phase 1: Core Web Fundamentals
  {
    phase: 1,
    title: 'Phase 1: Core Web Fundamentals',
    slug: 'phase-1-core-web-fundamentals',
    duration: '1-2 weeks',
    color: '#6366f1',
    icon: 'FS1',
    description: 'Master the foundational trio: HTML5, CSS3, and JavaScript basics',
    topics: [
      {
        name: 'HTML5 Essentials',
        slug: 'html5-essentials',
        subtopics: [
          'Semantic HTML (header, nav, main, article, section, aside, footer)',
          'Forms & Validation (input types, required, pattern, novalidate)',
          'Accessibility (ARIA roles, labels, keyboard navigation)',
          'Meta Tags & SEO (viewport, description, Open Graph)',
          'Web APIs (Geolocation, Web Storage, History API)',
          'Canvas & SVG Basics'
        ],
        priority: 'essential'
      },
      {
        name: 'CSS3 Mastery',
        slug: 'css3-mastery',
        subtopics: [
          'Flexbox (justify-content, align-items, flex-wrap, gap)',
          'CSS Grid (grid-template, fr units, auto-fit/auto-fill)',
          'Responsive Design (media queries, mobile-first approach)',
          'CSS Variables (custom properties, theming)',
          'Animations & Transitions (keyframes, easing, transform)',
          'Pseudo-classes & Pseudo-elements (:hover, :focus, ::before, ::after)',
          'CSS Architecture (BEM, SMACSS concepts)'
        ],
        priority: 'essential'
      },
      {
        name: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals',
        subtopics: [
          'Variables & Scope (let, const, var, hoisting)',
          'Data Types (primitives, objects, type coercion)',
          'Functions (declarations, expressions, arrow functions)',
          'Arrays & Objects (methods, destructuring, spread operator)',
          'Control Flow (conditionals, loops, ternary operator)',
          'ES6+ Features (template literals, default parameters, rest operator)'
        ],
        priority: 'essential'
      },
      {
        name: 'DOM Manipulation',
        slug: 'dom-manipulation',
        subtopics: [
          'Selecting Elements (querySelector, getElementById)',
          'Modifying Content (innerHTML, textContent, classList)',
          'Event Handling (addEventListener, event delegation, bubbling)',
          'Creating Elements (createElement, appendChild, insertBefore)',
          'Traversing DOM (parentNode, children, siblings)',
          'Performance (DocumentFragment, requestAnimationFrame)'
        ],
        priority: 'essential'
      }
    ]
  },
  // Phase 2: Advanced JavaScript
  {
    phase: 2,
    title: 'Phase 2: Advanced JavaScript',
    slug: 'phase-2-advanced-javascript',
    duration: '2-3 weeks',
    color: '#22c55e',
    icon: 'FS2',
    description: 'Deep dive into JavaScript concepts every senior developer must know',
    topics: [
      {
        name: 'Closures & Scope',
        slug: 'closures-and-scope',
        subtopics: [
          'Lexical Scope & Scope Chain',
          'Closure Use Cases (private variables, factory functions)',
          'Memory Considerations & Garbage Collection',
          'Module Pattern & Revealing Module Pattern',
          'IIFE (Immediately Invoked Function Expression)'
        ],
        priority: 'essential'
      },
      {
        name: 'Asynchronous JavaScript',
        slug: 'asynchronous-javascript',
        subtopics: [
          'Callbacks & Callback Hell',
          'Promises (then, catch, finally, Promise.all, Promise.race, Promise.allSettled)',
          'Async/Await (error handling, parallel execution)',
          'Event Loop (call stack, task queue, microtask queue)',
          'Fetch API & AbortController',
          'Web Workers Basics'
        ],
        priority: 'essential'
      },
      {
        name: 'Object-Oriented JavaScript',
        slug: 'object-oriented-javascript',
        subtopics: [
          'Prototypes & Prototype Chain',
          'Classes (ES6 syntax, constructor, methods)',
          'Inheritance (extends, super)',
          'Static Methods & Properties',
          'Getters & Setters',
          'Private Fields (#privateField)'
        ],
        priority: 'important'
      },
      {
        name: 'Functional Programming',
        slug: 'functional-programming',
        subtopics: [
          'Pure Functions & Side Effects',
          'Higher-Order Functions (map, filter, reduce, flatMap)',
          'Immutability Patterns',
          'Composition & Currying',
          'Partial Application',
          'Memoization'
        ],
        priority: 'important'
      },
      {
        name: 'Error Handling & Debugging',
        slug: 'error-handling-and-debugging',
        subtopics: [
          'try/catch/finally',
          'Custom Error Classes',
          'Error Boundaries Concept',
          'Console Methods (log, warn, error, table, group, time)',
          'Chrome DevTools Debugging',
          'Source Maps'
        ],
        priority: 'essential'
      },
      {
        name: 'JavaScript Modules',
        slug: 'javascript-modules',
        subtopics: [
          'ES Modules (import/export)',
          'Default vs Named Exports',
          'Dynamic Imports (lazy loading)',
          'CommonJS vs ES Modules',
          'Module Bundlers (Vite, Webpack, Rollup)',
          'Tree-shaking & Dead Code Elimination'
        ],
        priority: 'essential'
      },
      {
        name: 'Design Patterns',
        slug: 'design-patterns',
        subtopics: [
          'Singleton Pattern',
          'Factory Pattern',
          'Observer Pattern (Pub/Sub)',
          'Module Pattern',
          'Decorator Pattern',
          'Strategy Pattern'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 3: TypeScript
  {
    phase: 3,
    title: 'Phase 3: TypeScript',
    slug: 'phase-3-typescript',
    duration: '2-3 weeks',
    color: '#f59e0b',
    icon: 'FS3',
    description: 'Add type safety to your JavaScript - essential for modern development',
    topics: [
      {
        name: 'TypeScript Fundamentals',
        slug: 'typescript-fundamentals',
        subtopics: [
          'Type Annotations (string, number, boolean, array)',
          'Type Inference',
          'Union & Intersection Types',
          'Literal Types',
          'Type Aliases vs Interfaces',
          'any, unknown, never, void'
        ],
        priority: 'essential'
      },
      {
        name: 'Advanced Types',
        slug: 'advanced-types',
        subtopics: [
          'Generics (functions, classes, constraints)',
          'Utility Types (Partial, Required, Pick, Omit, Record)',
          'Mapped Types',
          'Conditional Types',
          'Template Literal Types',
          'keyof & typeof Operators'
        ],
        priority: 'essential'
      },
      {
        name: 'TypeScript with Functions',
        slug: 'typescript-with-functions',
        subtopics: [
          'Function Type Expressions',
          'Call Signatures',
          'Overloads',
          'Generic Functions',
          'Rest Parameters & Spread',
          'this Parameter'
        ],
        priority: 'essential'
      },
      {
        name: 'TypeScript with Objects',
        slug: 'typescript-with-objects',
        subtopics: [
          'Object Types & Index Signatures',
          'Readonly & Optional Properties',
          'Extending Types',
          'Intersection Types for Mixins',
          'Type Guards (typeof, instanceof, in)',
          'Discriminated Unions'
        ],
        priority: 'essential'
      },
      {
        name: 'TypeScript with Classes',
        slug: 'typescript-with-classes',
        subtopics: [
          'Class Members (public, private, protected)',
          'Abstract Classes',
          'Implements vs Extends',
          'Static Members',
          'Parameter Properties',
          'Decorators (experimental)'
        ],
        priority: 'important'
      },
      {
        name: 'TypeScript Configuration',
        slug: 'typescript-configuration',
        subtopics: [
          'tsconfig.json Options',
          'Strict Mode & Its Benefits',
          'Module Resolution',
          'Declaration Files (.d.ts)',
          'Type Checking in JavaScript (JSDoc)',
          'Integration with Build Tools'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 4: Vue.js Ecosystem
  {
    phase: 4,
    title: 'Phase 4: Vue.js Ecosystem',
    slug: 'phase-4-vue-js-ecosystem',
    duration: '3-4 weeks',
    color: '#0ea5e9',
    icon: 'FS4',
    description: 'Master Vue.js 3, Composition API, and the Vue ecosystem',
    topics: [
      {
        name: 'Vue.js 3 Fundamentals',
        slug: 'vue-js-3-fundamentals',
        subtopics: [
          'Template Syntax (interpolation, directives)',
          'Reactivity System (ref, reactive, computed)',
          'Component Basics (props, emits, slots)',
          'Lifecycle Hooks (onMounted, onUpdated, onUnmounted)',
          'Conditional & List Rendering (v-if, v-show, v-for, key)',
          'Event Handling (v-on, modifiers)'
        ],
        priority: 'essential'
      },
      {
        name: 'Composition API Deep Dive',
        slug: 'composition-api-deep-dive',
        subtopics: [
          'setup() Function vs `<script setup>`',
          'Composables (reusable logic)',
          'watch & watchEffect',
          'provide/inject for Dependency Injection',
          'toRef & toRefs for Reactivity',
          'shallowRef & shallowReactive'
        ],
        priority: 'essential'
      },
      {
        name: 'Component Patterns',
        slug: 'component-patterns',
        subtopics: [
          'Props Validation & Default Values',
          'Custom Events (emit patterns)',
          'v-model on Components (multiple v-models)',
          'Slots (default, named, scoped slots)',
          'Dynamic Components & Async Components',
          'Teleport & Suspense'
        ],
        priority: 'essential'
      },
      {
        name: 'State Management (Pinia)',
        slug: 'state-management-pinia',
        subtopics: [
          'Pinia Basics (stores, state, getters, actions)',
          'Store Composition & Modules',
          'Pinia Plugins',
          'State Persistence (pinia-plugin-persistedstate)',
          'Vuex Legacy (migration knowledge)',
          'When to Use Global vs Local State'
        ],
        priority: 'important'
      },
      {
        name: 'Vue Router',
        slug: 'vue-router',
        subtopics: [
          'Route Configuration (path, name, component)',
          'Dynamic Routes & Route Params',
          'Navigation Guards (beforeEach, beforeEnter, beforeRouteLeave)',
          'Nested Routes & Layouts',
          'Programmatic Navigation',
          'Route Meta & Lazy Loading'
        ],
        priority: 'essential'
      },
      {
        name: 'Vuetify UI Framework',
        slug: 'vuetify-ui-framework',
        subtopics: [
          'Component Library (v-btn, v-card, v-dialog, v-form)',
          'Grid System & Layouts',
          'Theming & Customization',
          'Form Validation with Vee-Validate or Vuetify Rules',
          'Responsive Design with Vuetify',
          'Custom Components with Vuetify'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 5: Nuxt.js Mastery
  {
    phase: 5,
    title: 'Phase 5: Nuxt.js Mastery',
    slug: 'phase-5-nuxt-js-mastery',
    duration: '3-4 weeks',
    color: '#8b5cf6',
    icon: 'FS5',
    description: 'Master Nuxt 3/4 for production-grade Vue applications',
    topics: [
      {
        name: 'Nuxt 3/4 Fundamentals',
        slug: 'nuxt-3-4-fundamentals',
        subtopics: [
          'Project Structure (pages, components, composables, plugins)',
          'Auto-imports (components, composables, utilities)',
          'File-based Routing',
          'App Configuration (nuxt.config.ts)',
          'Runtime Config & Environment Variables',
          'Layers & Extends'
        ],
        priority: 'essential'
      },
      {
        name: 'Rendering Modes',
        slug: 'rendering-modes',
        subtopics: [
          'Server-Side Rendering (SSR)',
          'Static Site Generation (SSG)',
          'Hybrid Rendering (route rules)',
          'Client-Side Rendering (SPA mode)',
          'Incremental Static Regeneration (ISR)',
          'Edge-Side Rendering'
        ],
        priority: 'essential'
      },
      {
        name: 'Data Fetching',
        slug: 'data-fetching',
        subtopics: [
          'useFetch & useAsyncData',
          '$fetch for API Calls',
          'Error Handling in Data Fetching',
          'Caching & Refresh Strategies',
          'Payload & Hydration',
          'Optimistic Updates'
        ],
        priority: 'essential'
      },
      {
        name: 'Server Routes (API)',
        slug: 'server-routes-api',
        subtopics: [
          'Creating API Endpoints (server/api/)',
          'Event Handlers (getQuery, readBody, setResponseStatus)',
          'Middleware for Server Routes',
          'Database Integration Patterns',
          'Error Handling in API Routes',
          'API Route Caching'
        ],
        priority: 'essential'
      },
      {
        name: 'Nuxt Modules & Plugins',
        slug: 'nuxt-modules-and-plugins',
        subtopics: [
          'Using Nuxt Modules (@nuxt/image, @nuxtjs/i18n)',
          'Creating Custom Modules',
          'Plugins (client-only, server-only)',
          'Nuxt UI & Nuxt UI Pro',
          'Module Configuration',
          'Content Module (@nuxt/content)'
        ],
        priority: 'important'
      },
      {
        name: 'SEO & Performance',
        slug: 'seo-and-performance',
        subtopics: [
          'useSeoMeta & useHead',
          'Open Graph & Twitter Cards',
          'Structured Data (JSON-LD)',
          'Image Optimization (@nuxt/image)',
          'Code Splitting & Lazy Loading',
          'Lighthouse Optimization'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 6: React Fundamentals
  {
    phase: 6,
    title: 'Phase 6: React Fundamentals',
    slug: 'phase-6-react-fundamentals',
    duration: '3-4 weeks',
    color: '#ec4899',
    icon: 'FS6',
    description: 'Master React - the most popular frontend library',
    topics: [
      {
        name: 'React Core Concepts',
        slug: 'react-core-concepts',
        subtopics: [
          'JSX Syntax & Expressions',
          'Components (Function vs Class - focus on Function)',
          'Props & Children',
          'State with useState',
          'Conditional Rendering',
          'Lists & Keys'
        ],
        priority: 'essential'
      },
      {
        name: 'React Hooks',
        slug: 'react-hooks',
        subtopics: [
          'useState & useReducer',
          'useEffect (lifecycle, cleanup, dependencies)',
          'useContext for Global State',
          'useRef (DOM refs, mutable values)',
          'useMemo & useCallback (performance)',
          'Custom Hooks'
        ],
        priority: 'essential'
      },
      {
        name: 'Component Patterns',
        slug: 'component-patterns',
        subtopics: [
          'Composition vs Inheritance',
          'Render Props Pattern',
          'Higher-Order Components (HOC)',
          'Compound Components',
          'Controlled vs Uncontrolled Components',
          'Error Boundaries'
        ],
        priority: 'important'
      },
      {
        name: 'State Management',
        slug: 'state-management',
        subtopics: [
          'Context API (Provider, Consumer, useContext)',
          'Redux Toolkit Basics',
          'Zustand (lightweight alternative)',
          'React Query / TanStack Query',
          'When to Use What',
          'State Colocation'
        ],
        priority: 'important'
      },
      {
        name: 'React Router',
        slug: 'react-router',
        subtopics: [
          'Route Configuration (Routes, Route)',
          'Dynamic Routes & Parameters',
          'Navigation (Link, useNavigate)',
          'Nested Routes & Outlets',
          'Protected Routes',
          'Data Loading (loaders)'
        ],
        priority: 'essential'
      },
      {
        name: 'React Performance',
        slug: 'react-performance',
        subtopics: [
          'React.memo for Component Memoization',
          'useMemo & useCallback Usage',
          'Code Splitting with lazy() & Suspense',
          'Virtualization (react-window)',
          'Profiler & DevTools',
          'Avoiding Re-renders'
        ],
        priority: 'important'
      },
      {
        name: 'React Ecosystem',
        slug: 'react-ecosystem',
        subtopics: [
          'Styling (CSS Modules, Styled Components, Tailwind)',
          'Form Libraries (React Hook Form, Formik)',
          'UI Libraries (Material UI, Chakra UI, shadcn/ui)',
          'Animation (Framer Motion)',
          'Testing (React Testing Library)',
          'Storybook for Components'
        ],
        priority: 'recommended'
      }
    ]
  },
  // Phase 7: Next.js
  {
    phase: 7,
    title: 'Phase 7: Next.js',
    slug: 'phase-7-next-js',
    duration: '3-4 weeks',
    color: '#14b8a6',
    icon: 'FS7',
    description: 'Master Next.js - the React framework for production',
    topics: [
      {
        name: 'Next.js Fundamentals',
        slug: 'next-js-fundamentals',
        subtopics: [
          'Project Structure (app directory)',
          'File-based Routing',
          'Layouts & Templates',
          'Loading & Error States',
          'Route Groups & Parallel Routes',
          'Configuration (next.config.js)'
        ],
        priority: 'essential'
      },
      {
        name: 'Rendering Strategies',
        slug: 'rendering-strategies',
        subtopics: [
          'Server Components vs Client Components',
          'Static Rendering (default)',
          'Dynamic Rendering',
          'Streaming with Suspense',
          'Partial Prerendering (PPR)',
          'ISR (Incremental Static Regeneration)'
        ],
        priority: 'essential'
      },
      {
        name: 'Data Fetching',
        slug: 'data-fetching',
        subtopics: [
          'Fetching in Server Components',
          'Route Handlers (API Routes)',
          'Server Actions',
          'Caching & Revalidation',
          'Parallel & Sequential Fetching',
          'Error Handling Patterns'
        ],
        priority: 'essential'
      },
      {
        name: 'Server Actions',
        slug: 'server-actions',
        subtopics: [
          'Creating Server Actions',
          'Form Handling with Actions',
          'useFormState & useFormStatus',
          'Optimistic Updates',
          'Error Handling',
          'Revalidation after Mutations'
        ],
        priority: 'essential'
      },
      {
        name: 'Middleware & Edge',
        slug: 'middleware-and-edge',
        subtopics: [
          'Middleware Function',
          'Authentication with Middleware',
          'Redirects & Rewrites',
          'Edge Runtime',
          'Geolocation & A/B Testing',
          'Rate Limiting Patterns'
        ],
        priority: 'important'
      },
      {
        name: 'SEO & Optimization',
        slug: 'seo-and-optimization',
        subtopics: [
          'Metadata API (static & dynamic)',
          'Open Graph Images',
          'Sitemap & Robots.txt',
          'Image Optimization (next/image)',
          'Font Optimization (next/font)',
          'Bundle Analysis'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 8: Node.js & Backend
  {
    phase: 8,
    title: 'Phase 8: Node.js & Backend',
    slug: 'phase-8-node-js-and-backend',
    duration: '3-4 weeks',
    color: '#f97316',
    icon: 'FS8',
    description: 'Build robust backend services with Node.js and Express.js',
    topics: [
      {
        name: 'Node.js Core',
        slug: 'node-js-core',
        subtopics: [
          'Node.js Runtime & Event Loop',
          'File System (fs module, async operations)',
          'Path & URL Modules',
          'Streams & Buffers',
          'Process & Environment Variables',
          'Child Processes'
        ],
        priority: 'essential'
      },
      {
        name: 'Express.js Framework',
        slug: 'express-js-framework',
        subtopics: [
          'Routing (methods, parameters, query strings)',
          'Middleware (built-in, custom, error-handling)',
          'Request & Response Objects',
          'Static File Serving',
          'Express Router for Modular Routes',
          'Express with TypeScript'
        ],
        priority: 'essential'
      },
      {
        name: 'RESTful API Design',
        slug: 'restful-api-design',
        subtopics: [
          'REST Principles (resources, HTTP methods, status codes)',
          'API Versioning Strategies',
          'Request Validation (Joi, Zod, express-validator)',
          'Response Formatting (JSON standards)',
          'CORS Configuration',
          'API Documentation (Swagger/OpenAPI)'
        ],
        priority: 'essential'
      },
      {
        name: 'Authentication & Authorization',
        slug: 'authentication-and-authorization',
        subtopics: [
          'JWT (JSON Web Tokens) - creation, verification, refresh',
          'LDAP/Active Directory Integration',
          'Session-based Authentication',
          'OAuth 2.0 Basics',
          'Role-Based Access Control (RBAC)',
          'Password Hashing (bcrypt, argon2)'
        ],
        priority: 'essential'
      },
      {
        name: 'File Handling',
        slug: 'file-handling',
        subtopics: [
          'File Uploads (Multer)',
          'PDF Generation (pdf-lib)',
          'Image Processing (Sharp)',
          'File Storage Strategies (local, cloud)',
          'Streaming Large Files',
          'CSV/Excel Processing'
        ],
        priority: 'important'
      },
      {
        name: 'Error Handling & Logging',
        slug: 'error-handling-and-logging',
        subtopics: [
          'Centralized Error Handling',
          'Custom Error Classes',
          'Logging (Winston, Pino)',
          'Environment-based Logging',
          'Error Monitoring (Sentry concepts)',
          'Request ID Tracking'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 9: Databases
  {
    phase: 9,
    title: 'Phase 9: Databases',
    slug: 'phase-9-databases',
    duration: '3-4 weeks',
    color: '#ef4444',
    icon: 'FS9',
    description: 'Master SQL and NoSQL databases for full stack development',
    topics: [
      {
        name: 'SQL Fundamentals',
        slug: 'sql-fundamentals',
        subtopics: [
          'SELECT, INSERT, UPDATE, DELETE',
          'JOINs (INNER, LEFT, RIGHT, FULL, CROSS)',
          'Subqueries & CTEs (Common Table Expressions)',
          'Aggregate Functions (COUNT, SUM, AVG, GROUP BY, HAVING)',
          'Window Functions (ROW_NUMBER, RANK, LAG, LEAD)',
          'CASE Expressions'
        ],
        priority: 'essential'
      },
      {
        name: 'Database Design',
        slug: 'database-design',
        subtopics: [
          'Normalization (1NF, 2NF, 3NF, BCNF)',
          'Entity Relationship Diagrams (ERD)',
          'Primary & Foreign Keys',
          'Constraints (UNIQUE, CHECK, NOT NULL, DEFAULT)',
          'Denormalization for Performance',
          'Soft Deletes & Audit Columns'
        ],
        priority: 'essential'
      },
      {
        name: 'MySQL/PostgreSQL/MSSQL',
        slug: 'mysql-postgresql-mssql',
        subtopics: [
          'Connection & Query Execution (Node.js drivers)',
          'Transactions (BEGIN, COMMIT, ROLLBACK, Isolation Levels)',
          'Stored Procedures & Functions',
          'Views & Materialized Views',
          'Triggers',
          'Database-specific Features'
        ],
        priority: 'essential'
      },
      {
        name: 'MongoDB (NoSQL)',
        slug: 'mongodb-nosql',
        subtopics: [
          'Documents & Collections',
          'CRUD Operations',
          'Aggregation Pipeline',
          'Indexing Strategies',
          'Schema Design Patterns',
          'Mongoose ODM'
        ],
        priority: 'important'
      },
      {
        name: 'Query Optimization',
        slug: 'query-optimization',
        subtopics: [
          'EXPLAIN & Query Plans',
          'Index Types & Selection',
          'N+1 Problem & Solutions',
          'Connection Pooling',
          'Query Caching',
          'Database Profiling'
        ],
        priority: 'important'
      },
      {
        name: 'ORM/ODM & Query Builders',
        slug: 'orm-odm-and-query-builders',
        subtopics: [
          'Prisma (modern ORM)',
          'Sequelize (traditional ORM)',
          'Knex.js (query builder)',
          'Mongoose (MongoDB)',
          'Migrations & Seeding',
          'Raw Queries When Needed'
        ],
        priority: 'important'
      }
    ]
  },
  // Phase 10: DevOps & Deployment
  {
    phase: 10,
    title: 'Phase 10: DevOps & Deployment',
    slug: 'phase-10-devops-and-deployment',
    duration: '2-3 weeks',
    color: '#84cc16',
    icon: 'FS10',
    description: 'Deploy and maintain applications in production',
    topics: [
      {
        name: 'Git Advanced',
        slug: 'git-advanced',
        subtopics: [
          'Branching Strategies (GitFlow, Trunk-based, GitHub Flow)',
          'Merge vs Rebase',
          'Interactive Rebase & Squashing',
          'Cherry-pick & Stashing',
          'Git Hooks & Husky',
          'Conventional Commits'
        ],
        priority: 'essential'
      },
      {
        name: 'Linux Server Administration',
        slug: 'linux-server-administration',
        subtopics: [
          'File System Navigation & Permissions',
          'Process Management (ps, top, htop, kill)',
          'Package Management (apt, npm, yarn, pnpm)',
          'Service Management (systemd)',
          'SSH & Key-based Authentication',
          'Cron Jobs & Scheduling'
        ],
        priority: 'essential'
      },
      {
        name: 'SSL/TLS & Security',
        slug: 'ssl-tls-and-security',
        subtopics: [
          'Certificate Types & Issuance',
          'Let\'s Encrypt & Certbot',
          'HTTPS Configuration (Nginx, Apache)',
          'Certificate Renewal Automation',
          'Security Headers (CSP, HSTS, X-Frame-Options)',
          'OWASP Top 10 Awareness'
        ],
        priority: 'essential'
      },
      {
        name: 'Docker Basics',
        slug: 'docker-basics',
        subtopics: [
          'Containers vs VMs',
          'Dockerfile & Image Building',
          'Docker Compose for Multi-container Apps',
          'Volume Mounting',
          'Environment Variables',
          'Container Networking Basics'
        ],
        priority: 'important'
      },
      {
        name: 'CI/CD Pipelines',
        slug: 'ci-cd-pipelines',
        subtopics: [
          'GitHub Actions Workflows',
          'Build & Test Automation',
          'Deployment Pipelines',
          'Environment Variables & Secrets',
          'Rollback Strategies',
          'Branch Protection Rules'
        ],
        priority: 'important'
      },
      {
        name: 'Cloud Basics',
        slug: 'cloud-basics',
        subtopics: [
          'Cloud Providers Overview (AWS, GCP, Azure)',
          'VPS Hosting (DigitalOcean, Linode, Vultr)',
          'Platform-as-a-Service (Vercel, Netlify, Railway)',
          'DNS Configuration',
          'CDN Integration (Cloudflare)',
          'Object Storage (S3-compatible)'
        ],
        priority: 'important'
      },
      {
        name: 'Monitoring & Debugging',
        slug: 'monitoring-and-debugging',
        subtopics: [
          'Application Logging Best Practices',
          'Error Tracking (Sentry)',
          'Performance Monitoring (APM)',
          'Health Checks & Uptime Monitoring',
          'Log Aggregation',
          'Alerting Basics'
        ],
        priority: 'recommended'
      }
    ]
  },
  // Phase 11: Testing
  {
    phase: 11,
    title: 'Phase 11: Testing',
    slug: 'phase-11-testing',
    duration: '2-3 weeks',
    color: '#3b82f6',
    icon: 'FS11',
    description: 'Write reliable tests for your applications',
    topics: [
      {
        name: 'Testing Fundamentals',
        slug: 'testing-fundamentals',
        subtopics: [
          'Testing Pyramid (Unit, Integration, E2E)',
          'Test-Driven Development (TDD) Concepts',
          'Behavior-Driven Development (BDD)',
          'Code Coverage Metrics',
          'Testing Best Practices',
          'When NOT to Test'
        ],
        priority: 'essential'
      },
      {
        name: 'Unit Testing',
        slug: 'unit-testing',
        subtopics: [
          'Vitest / Jest Setup',
          'Test Structure (describe, it, expect)',
          'Matchers & Assertions',
          'Mocking (functions, modules, timers)',
          'Testing Async Code',
          'Snapshot Testing'
        ],
        priority: 'essential'
      },
      {
        name: 'Component Testing',
        slug: 'component-testing',
        subtopics: [
          'Vue Test Utils / React Testing Library',
          'Rendering Components',
          'Querying Elements',
          'User Event Simulation',
          'Testing Props & Events',
          'Testing Composables / Hooks'
        ],
        priority: 'important'
      },
      {
        name: 'Integration Testing',
        slug: 'integration-testing',
        subtopics: [
          'API Testing (Supertest)',
          'Database Testing Strategies',
          'Test Databases & Fixtures',
          'Testing Authentication Flows',
          'External Service Mocking',
          'Test Isolation'
        ],
        priority: 'important'
      },
      {
        name: 'End-to-End Testing',
        slug: 'end-to-end-testing',
        subtopics: [
          'Playwright / Cypress Basics',
          'Page Objects Pattern',
          'Testing User Flows',
          'Visual Regression Testing',
          'Cross-browser Testing',
          'CI Integration'
        ],
        priority: 'recommended'
      }
    ]
  },
  // Phase 12: Modern Web Patterns
  {
    phase: 12,
    title: 'Phase 12: Modern Web Patterns',
    slug: 'phase-12-modern-web-patterns',
    duration: '2-3 weeks',
    color: '#a855f7',
    icon: 'FS12',
    description: 'Advanced patterns and specializations for senior roles',
    topics: [
      {
        name: 'Bilingual Apps (EN/AR + RTL)',
        slug: 'bilingual-apps-en-ar-rtl',
        subtopics: [
          'i18n Implementation (@nuxtjs/i18n, next-intl, react-i18next)',
          'RTL Layout Considerations (CSS logical properties)',
          'Bidirectional Text Handling',
          'Date, Number & Currency Formatting (Intl API)',
          'Dynamic Direction Switching',
          'Font Loading for Multiple Scripts'
        ],
        priority: 'essential'
      },
      {
        name: 'Web Security (OWASP)',
        slug: 'web-security-owasp',
        subtopics: [
          'XSS Prevention (sanitization, CSP)',
          'CSRF Protection (tokens, SameSite cookies)',
          'SQL Injection Prevention (parameterized queries)',
          'Input Validation & Sanitization',
          'Secure Headers Implementation',
          'Authentication Security Best Practices'
        ],
        priority: 'essential'
      },
      {
        name: 'Performance Optimization',
        slug: 'performance-optimization',
        subtopics: [
          'Core Web Vitals (LCP, FID/INP, CLS)',
          'Lighthouse Optimization',
          'Bundle Size Analysis (webpack-bundle-analyzer)',
          'Image Optimization Strategies',
          'Caching Strategies (browser, CDN, service worker)',
          'Lazy Loading & Code Splitting'
        ],
        priority: 'important'
      },
      {
        name: 'Accessibility (a11y)',
        slug: 'accessibility-a11y',
        subtopics: [
          'WCAG Guidelines Overview',
          'Semantic HTML for Accessibility',
          'Keyboard Navigation',
          'Screen Reader Compatibility',
          'Color Contrast & Visual Design',
          'ARIA Attributes & Roles'
        ],
        priority: 'important'
      },
      {
        name: 'GraphQL Basics',
        slug: 'graphql-basics',
        subtopics: [
          'GraphQL vs REST',
          'Queries & Mutations',
          'Schema Definition',
          'Apollo Client Basics',
          'GraphQL in Vue/React',
          'When to Use GraphQL'
        ],
        priority: 'recommended'
      },
      {
        name: 'Real-time Applications',
        slug: 'real-time-applications',
        subtopics: [
          'WebSockets (Socket.io)',
          'Server-Sent Events (SSE)',
          'Real-time Data Synchronization',
          'Presence & Status Indicators',
          'Optimistic UI Updates',
          'Conflict Resolution'
        ],
        priority: 'recommended'
      },
      {
        name: 'Progressive Web Apps (PWA)',
        slug: 'progressive-web-apps-pwa',
        subtopics: [
          'Service Workers',
          'Web App Manifest',
          'Offline Support',
          'Push Notifications',
          'Install Prompts',
          'PWA in Vue/Nuxt/React/Next'
        ],
        priority: 'recommended'
      }
    ]
  },
  // Phase 13: Interview Preparation
  {
    phase: 13,
    title: 'Phase 13: Interview Preparation',
    slug: 'phase-13-interview-preparation',
    duration: '2-3 weeks',
    color: '#f43f5e',
    icon: 'FS13',
    description: 'Final preparation for technical interviews',
    topics: [
      {
        name: 'System Design Basics',
        slug: 'system-design-basics',
        subtopics: [
          'Component Architecture Design',
          'Database Selection Criteria',
          'Caching Layer Design',
          'API Design Considerations',
          'Scalability Concepts (horizontal vs vertical)',
          'Load Balancing Basics'
        ],
        priority: 'essential'
      },
      {
        name: 'Coding Challenges',
        slug: 'coding-challenges',
        subtopics: [
          'Array & String Manipulation',
          'Object & Data Transformation',
          'Async Problem Solving',
          'Algorithm Basics (sorting, searching)',
          'Time & Space Complexity (Big O)',
          'Common Patterns (two pointers, sliding window)'
        ],
        priority: 'essential'
      },
      {
        name: 'Behavioral Questions',
        slug: 'behavioral-questions',
        subtopics: [
          'STAR Method (Situation, Task, Action, Result)',
          'Project Discussion Preparation',
          'Conflict Resolution Examples',
          'Leadership & Initiative Stories',
          'Failure & Learning Examples',
          'Career Transition Story (your strength!)'
        ],
        priority: 'essential'
      },
      {
        name: 'Portfolio Presentation',
        slug: 'portfolio-presentation',
        subtopics: [
          'Project Demo Preparation',
          'Code Walkthrough Skills',
          'Architecture Explanation',
          'Challenge & Solution Stories',
          'Metrics & Impact Discussion',
          'GitHub Profile Optimization'
        ],
        priority: 'essential'
      },
      {
        name: 'Technical Questions Bank',
        slug: 'technical-questions-bank',
        subtopics: [
          'JavaScript Deep Dive Questions',
          'TypeScript Questions',
          'Vue.js/Nuxt.js Questions',
          'React/Next.js Questions',
          'Node.js/Express Questions',
          'Database & SQL Questions'
        ],
        priority: 'essential'
      },
      {
        name: 'Salary Negotiation',
        slug: 'salary-negotiation',
        subtopics: [
          'Market Rate Research (Saudi Arabia)',
          'Total Compensation Understanding',
          'Negotiation Strategies',
          'Counter-offer Handling',
          'Benefits Evaluation',
          'Knowing Your Worth (14+ years!)'
        ],
        priority: 'important'
      }
    ]
  }
]
