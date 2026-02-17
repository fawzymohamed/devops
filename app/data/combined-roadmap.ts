/**
 * The AI-Age DevOps Architect — Roadmap Data
 * ============================================
 * Structured roadmap data for The AI-Age DevOps Architect track.
 *
 * Philosophy:
 * - Architecture & Design phases (1-6): Deep focus on system thinking,
 *   design principles, and architectural decision-making
 * - Application Development (7): Architecture-level understanding of
 *   frontend/backend — enough to guide AI agents effectively
 * - DevOps & Security (8-13): Deep hands-on skills — the career goal
 * - AI-Augmented Engineering (14): Meta-skills for orchestrating AI agents
 * - System Design Practice & Career (15): Case studies and job preparation
 *
 * This roadmap combines content from both the DevOps and Full Stack
 * roadmaps, restructured around the principle that in the AI age,
 * architects need deep design thinking + deep DevOps/Security skills,
 * while implementation-level frontend/backend knowledge can be
 * handled by AI with proper human guidance.
 */

import type { Phase } from './roadmap'

export const combinedPhases: Phase[] = [
  // =========================================================================
  // ARCHITECTURE & DESIGN (Phases 1-6)
  // =========================================================================

  // Phase 1: SDLC & Requirements Engineering
  {
    phase: 1,
    title: 'Phase 1: SDLC & Requirements Engineering',
    slug: 'phase-1-sdlc-and-requirements',
    duration: '1-2 weeks',
    color: '#6366f1',
    icon: '🔄',
    description: 'Master the fundamentals of how software is planned, specified, and delivered',
    topics: [
      {
        name: 'SDLC Models',
        slug: 'sdlc-models',
        subtopics: [
          'Waterfall Model',
          'Agile Methodology',
          'Scrum Framework',
          'Kanban',
          'DevOps as SDLC Evolution'
        ],
        priority: 'essential'
      },
      {
        name: 'SDLC Phases',
        slug: 'sdlc-phases',
        subtopics: [
          'Requirements Gathering',
          'Design & Architecture',
          'Development/Coding',
          'Testing & QA',
          'Deployment',
          'Maintenance & Operations'
        ],
        priority: 'essential'
      },
      {
        name: 'Requirements Engineering',
        slug: 'requirements-engineering',
        subtopics: [
          'Functional vs Non-Functional Requirements',
          'User Stories & Acceptance Criteria',
          'Elicitation Techniques (Interviews, Workshops, Observation)',
          'Prioritization Frameworks (MoSCoW, RICE, Kano)',
          'Edge Case & Exception Flow Identification',
          'Requirements Traceability'
        ],
        priority: 'essential'
      },
      {
        name: 'Problem Decomposition',
        slug: 'problem-decomposition',
        subtopics: [
          'Breaking Systems into Independent Modules',
          'Identifying Service Boundaries & Integration Points',
          'Vertical Slices & Walking Skeletons',
          'Scoping MVPs & Minimum Lovable Products',
          'Work Breakdown Structures'
        ],
        priority: 'essential'
      },
      {
        name: 'Architecture Decision Records',
        slug: 'architecture-decision-records',
        subtopics: [
          'What are ADRs & Why They Matter',
          'ADR Templates & Formats (Nygard, MADR)',
          'Documenting Context, Decision & Consequences',
          'Reversible vs Irreversible Decisions (One-Way vs Two-Way Doors)',
          'ADR Lifecycle Management'
        ],
        priority: 'important'
      },
      {
        name: 'Project Management Basics',
        slug: 'project-management-basics',
        subtopics: [
          'Sprint Planning & Backlog Management',
          'Velocity & Estimation',
          'Retrospectives',
          'Development Workflows (Feature Branching, PRs, Code Reviews)',
          'Release Management'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 2: System Design Foundations
  {
    phase: 2,
    title: 'Phase 2: System Design Foundations',
    slug: 'phase-2-system-design-foundations',
    duration: '2-3 weeks',
    color: '#22c55e',
    icon: '📐',
    description: 'Build the mental models that govern all architectural decisions',
    topics: [
      {
        name: 'Estimation & Capacity Planning',
        slug: 'estimation-and-capacity-planning',
        subtopics: [
          'Back-of-Envelope Calculations (QPS, Storage, Bandwidth)',
          'Latency Numbers Every Architect Must Know',
          'Powers of Two & Common Capacity Estimates',
          'Traffic Estimation & Growth Projections',
          'Cost Estimation for Cloud Resources'
        ],
        priority: 'essential'
      },
      {
        name: 'Quality Attributes (ISO 25010)',
        slug: 'quality-attributes',
        subtopics: [
          'Scalability (Horizontal vs Vertical)',
          'Reliability & Fault Tolerance',
          'Availability (SLAs, SLOs, SLIs, Nines of Availability)',
          'Performance Efficiency (Latency, Throughput, Response Time)',
          'Maintainability (Modularity, Reusability)',
          'Security as a Quality Attribute',
          'Portability & Compatibility'
        ],
        priority: 'essential'
      },
      {
        name: 'Architecture Trade-offs',
        slug: 'architecture-trade-offs',
        subtopics: [
          'Latency vs Throughput',
          'Consistency vs Availability',
          'Read vs Write Optimization',
          'Simplicity vs Flexibility',
          'Cost vs Performance',
          'Build vs Buy vs Open-Source Decisions',
          'Technical Debt Assessment & Management'
        ],
        priority: 'essential'
      },
      {
        name: 'Networking for Architects',
        slug: 'networking-for-architects',
        subtopics: [
          'DNS Resolution & Architecture',
          'TCP/IP & UDP Fundamentals',
          'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)',
          'TLS/SSL & Certificate Management',
          'IP Addressing, Subnets & CIDR',
          'Load Balancers & Reverse Proxies',
          'VPNs & Network Security Basics'
        ],
        priority: 'essential'
      },
      {
        name: 'CAP Theorem & Consistency Models',
        slug: 'cap-theorem-and-consistency',
        subtopics: [
          'CAP Theorem Deep Dive with Real-World Examples',
          'PACELC Theorem',
          'Strong Consistency',
          'Eventual Consistency',
          'Causal Consistency',
          'Linearizability & Sequential Consistency'
        ],
        priority: 'essential'
      },
      {
        name: 'The System Design Framework',
        slug: 'system-design-framework',
        subtopics: [
          'RESHADED Method (Requirements, Estimation, Storage, High-Level, APIs, Detailed, Evaluation, Distinctive)',
          'Requirement Clarification Techniques',
          'High-Level Design Sketching',
          'Deep Dive Component Selection',
          'Trade-off Evaluation & Justification'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 3: Design Principles & Domain-Driven Design
  {
    phase: 3,
    title: 'Phase 3: Design Principles & Domain-Driven Design',
    slug: 'phase-3-design-principles-and-ddd',
    duration: '2-3 weeks',
    color: '#f59e0b',
    icon: '🏛️',
    description: 'Master long-lived software design fundamentals that never age',
    topics: [
      {
        name: 'SOLID Principles',
        slug: 'solid-principles',
        subtopics: [
          'Single Responsibility Principle',
          'Open-Closed Principle',
          'Liskov Substitution Principle',
          'Interface Segregation Principle',
          'Dependency Inversion Principle',
          'Applying SOLID in Real-World Systems'
        ],
        priority: 'essential'
      },
      {
        name: 'Design Principles',
        slug: 'design-principles',
        subtopics: [
          'DRY (Don\'t Repeat Yourself)',
          'KISS (Keep It Simple, Stupid)',
          'YAGNI (You Aren\'t Gonna Need It)',
          'Composition Over Inheritance',
          'Coupling & Cohesion Analysis',
          'Separation of Concerns'
        ],
        priority: 'essential'
      },
      {
        name: 'Design Patterns',
        slug: 'design-patterns',
        subtopics: [
          'Creational: Factory, Builder, Singleton',
          'Structural: Adapter, Facade, Proxy, Decorator',
          'Behavioral: Observer (Pub/Sub), Strategy, Command',
          'Dependency Injection & Inversion of Control',
          'Module & Revealing Module Pattern',
          'When to Apply vs When to Avoid Patterns'
        ],
        priority: 'essential'
      },
      {
        name: 'Clean Architecture',
        slug: 'clean-architecture',
        subtopics: [
          'Hexagonal Architecture (Ports & Adapters)',
          'Onion Architecture',
          'Layered (N-Tier) Architecture',
          'Vertical Slice Architecture',
          'Comparing Styles: When to Use Each',
          'Clean Code Principles & Refactoring Patterns'
        ],
        priority: 'essential'
      },
      {
        name: 'Strategic Domain-Driven Design',
        slug: 'strategic-ddd',
        subtopics: [
          'Ubiquitous Language',
          'Bounded Contexts',
          'Context Mapping (Shared Kernel, Anti-Corruption Layer, Customer-Supplier)',
          'Subdomains: Core, Supporting & Generic',
          'Domain Events Across Bounded Contexts',
          'Aligning Service Boundaries with Bounded Contexts'
        ],
        priority: 'essential'
      },
      {
        name: 'Tactical Domain-Driven Design',
        slug: 'tactical-ddd',
        subtopics: [
          'Entities & Value Objects',
          'Aggregates & Aggregate Root',
          'Repositories & Factories',
          'Domain Services vs Application Services',
          'Domain Events',
          'Specification Pattern'
        ],
        priority: 'important'
      },
      {
        name: 'Architecture Documentation',
        slug: 'architecture-documentation',
        subtopics: [
          'C4 Model (Context, Container, Component, Code Diagrams)',
          'Sequence Diagrams & Data Flow Diagrams',
          'Deployment Diagrams',
          'Arc42 Documentation Template',
          'Living Documentation Practices'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 4: Data Architecture
  {
    phase: 4,
    title: 'Phase 4: Data Architecture',
    slug: 'phase-4-data-architecture',
    duration: '2-3 weeks',
    color: '#0ea5e9',
    icon: '🗄️',
    description: 'Database decisions shape system performance for years — own them',
    topics: [
      {
        name: 'Database Paradigms & Selection',
        slug: 'database-paradigms-and-selection',
        subtopics: [
          'Relational Databases (PostgreSQL, MySQL)',
          'Document Databases (MongoDB, DynamoDB)',
          'Key-Value Stores (Redis, Memcached)',
          'Wide-Column Stores (Cassandra, HBase)',
          'Graph Databases (Neo4j, Amazon Neptune)',
          'Time-Series Databases (InfluxDB, TimescaleDB)',
          'Vector Databases (Pinecone, Weaviate, pgvector)',
          'Polyglot Persistence Strategy'
        ],
        priority: 'essential'
      },
      {
        name: 'Data Modeling & Schema Design',
        slug: 'data-modeling-and-schema-design',
        subtopics: [
          'Entity-Relationship (ER) Modeling',
          'Normalization (1NF through BCNF)',
          'Denormalization Trade-offs',
          'Schema Evolution & Migrations',
          'NoSQL Modeling Patterns (Document, Key-Value, Wide-Column)',
          'Star Schema & Snowflake Schema (Analytical)'
        ],
        priority: 'essential'
      },
      {
        name: 'Indexing & Storage Engines',
        slug: 'indexing-and-storage-engines',
        subtopics: [
          'B-Tree Indexes (How They Work, When to Use)',
          'LSM-Tree Indexes (Write-Optimized, Compaction)',
          'Hash Indexes',
          'Composite & Covering Indexes',
          'Full-Text Search Indexes',
          'Index Design Strategies & Anti-Patterns'
        ],
        priority: 'essential'
      },
      {
        name: 'Replication & Partitioning',
        slug: 'replication-and-partitioning',
        subtopics: [
          'Single-Leader (Master-Slave) Replication',
          'Multi-Leader Replication',
          'Leaderless Replication (Dynamo-Style)',
          'Consistent Hashing (Virtual Nodes, Ring Topology)',
          'Range-Based vs Hash-Based Partitioning',
          'Rebalancing Strategies & Hot Spots'
        ],
        priority: 'essential'
      },
      {
        name: 'Transactions & Consistency',
        slug: 'transactions-and-consistency',
        subtopics: [
          'ACID Properties',
          'Isolation Levels (Read Uncommitted to Serializable)',
          'Distributed Transactions (Two-Phase Commit)',
          'Saga Pattern (Choreography vs Orchestration)',
          'Outbox Pattern',
          'Optimistic vs Pessimistic Concurrency',
          'Idempotency in Distributed Systems'
        ],
        priority: 'essential'
      },
      {
        name: 'Caching Architecture',
        slug: 'caching-architecture',
        subtopics: [
          'Cache-Aside (Lazy Loading)',
          'Read-Through & Write-Through Caching',
          'Write-Back (Write-Behind) Caching',
          'Cache Eviction Policies (LRU, LFU, TTL)',
          'Cache Stampede & Thundering Herd Problem',
          'Multi-Level Caching (In-Process, Distributed, CDN)',
          'Distributed Caching (Redis Cluster, Memcached)'
        ],
        priority: 'important'
      },
      {
        name: 'Data Pipelines',
        slug: 'data-pipelines',
        subtopics: [
          'Batch Processing (MapReduce, Spark)',
          'Stream Processing (Kafka Streams, Flink)',
          'ETL vs ELT Patterns',
          'Lambda & Kappa Architecture',
          'Change Data Capture (CDC)',
          'Data Mesh Principles (Domain Ownership, Data as Product)'
        ],
        priority: 'recommended'
      }
    ]
  },

  // Phase 5: Distributed Systems & Architecture Patterns
  {
    phase: 5,
    title: 'Phase 5: Distributed Systems & Architecture Patterns',
    slug: 'phase-5-distributed-systems',
    duration: '3-4 weeks',
    color: '#8b5cf6',
    icon: '🌐',
    description: 'The core of system architecture — what AI cannot reason about',
    topics: [
      {
        name: 'Distributed Systems Fundamentals',
        slug: 'distributed-systems-fundamentals',
        subtopics: [
          'Consensus Algorithms (Raft, Paxos)',
          'Leader Election',
          'Distributed Clocks (Lamport Timestamps, Vector Clocks)',
          'Split-Brain Problem',
          'Failure Detection (Heartbeats, Phi Accrual)',
          'Byzantine Fault Tolerance Basics'
        ],
        priority: 'essential'
      },
      {
        name: 'Architecture Styles',
        slug: 'architecture-styles',
        subtopics: [
          'Monolithic Architecture & Modular Monolith',
          'Microservices Architecture',
          'Event-Driven Architecture',
          'Serverless Architecture (FaaS, BaaS)',
          'Microfrontends',
          'When to Use Each Style (Decision Framework)'
        ],
        priority: 'essential'
      },
      {
        name: 'Microservices Patterns',
        slug: 'microservices-patterns',
        subtopics: [
          'Service Decomposition Strategies',
          'API Gateway Pattern',
          'Backend for Frontend (BFF) Pattern',
          'Service Discovery (Client-Side vs Server-Side)',
          'Service Mesh (Istio, Linkerd, Sidecar vs Ambient)',
          'Database-per-Service & Data Ownership',
          'Strangler Fig Pattern for Migration'
        ],
        priority: 'essential'
      },
      {
        name: 'Event-Driven & CQRS',
        slug: 'event-driven-and-cqrs',
        subtopics: [
          'Event Sourcing (Event Store, Replaying, Snapshots)',
          'CQRS (Command Query Responsibility Segregation)',
          'Domain Events vs Integration Events',
          'Exactly-Once vs At-Least-Once vs At-Most-Once Delivery',
          'Dead Letter Queues',
          'Idempotent Event Handlers'
        ],
        priority: 'essential'
      },
      {
        name: 'Message Brokers & Streaming',
        slug: 'message-brokers-and-streaming',
        subtopics: [
          'Message Queues vs Event Streams',
          'Apache Kafka (Topics, Partitions, Consumer Groups)',
          'RabbitMQ (Exchanges, Queues, Routing Keys)',
          'AWS SQS/SNS, Azure Service Bus',
          'Pub/Sub & Competing Consumers Patterns',
          'Backpressure Handling & Message Ordering'
        ],
        priority: 'important'
      },
      {
        name: 'Scalability Patterns',
        slug: 'scalability-patterns',
        subtopics: [
          'Load Balancing (L4 vs L7, Round-Robin, Least Connections, Consistent Hashing)',
          'Horizontal vs Vertical Scaling',
          'Connection Pooling',
          'Async Processing with Work Queues',
          'Auto-Scaling Policies',
          'CDN Architecture (Push vs Pull, Edge Locations, Origin Shielding)'
        ],
        priority: 'important'
      },
      {
        name: 'Resilience Patterns',
        slug: 'resilience-patterns',
        subtopics: [
          'Circuit Breaker Pattern',
          'Bulkhead Pattern (Resource Isolation)',
          'Retry with Exponential Backoff & Jitter',
          'Timeout Pattern',
          'Fallback Pattern',
          'Graceful Degradation',
          'Health Endpoint Monitoring'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 6: API Design & Communication
  {
    phase: 6,
    title: 'Phase 6: API Design & Communication',
    slug: 'phase-6-api-design',
    duration: '1-2 weeks',
    color: '#ec4899',
    icon: '🔌',
    description: 'Design the contracts that enable teams and AI agents to collaborate on systems',
    topics: [
      {
        name: 'REST Architecture',
        slug: 'rest-architecture',
        subtopics: [
          'Resource Modeling & URI Design',
          'HTTP Methods & Status Codes',
          'HATEOAS & Richardson Maturity Model',
          'Pagination Patterns (Offset, Cursor, Keyset)',
          'Filtering, Sorting & Field Selection',
          'REST Best Practices & Common Anti-Patterns'
        ],
        priority: 'essential'
      },
      {
        name: 'GraphQL',
        slug: 'graphql',
        subtopics: [
          'Schema-First Design',
          'Queries, Mutations & Subscriptions',
          'N+1 Problem & DataLoader',
          'Schema Federation',
          'When to Use GraphQL vs REST'
        ],
        priority: 'important'
      },
      {
        name: 'gRPC & Protocol Buffers',
        slug: 'grpc-and-protocol-buffers',
        subtopics: [
          'Protocol Buffers Schema Definition',
          'Unary, Server Streaming, Client Streaming & Bidirectional RPCs',
          'gRPC vs REST vs GraphQL Trade-offs',
          'Service Definitions & Code Generation',
          'When to Use gRPC (Internal Microservice Communication)'
        ],
        priority: 'important'
      },
      {
        name: 'API Design Best Practices',
        slug: 'api-design-best-practices',
        subtopics: [
          'API Versioning Strategies (URI, Header, Query Param)',
          'Rate Limiting & Throttling',
          'OpenAPI/Swagger Specification',
          'API-First Development & Contract Testing',
          'Error Response Standards (RFC 7807 Problem Details)',
          'API Gateway Patterns'
        ],
        priority: 'essential'
      },
      {
        name: 'Communication Patterns',
        slug: 'communication-patterns',
        subtopics: [
          'Synchronous Request-Response (HTTP, RPC)',
          'Asynchronous Messaging (Queues, Pub/Sub)',
          'WebSockets (Full-Duplex, Real-Time)',
          'Server-Sent Events (SSE)',
          'Webhooks (Event Notification Callbacks)',
          'Long Polling'
        ],
        priority: 'essential'
      },
      {
        name: 'API Security',
        slug: 'api-security',
        subtopics: [
          'OAuth 2.0 Flows (Authorization Code, PKCE, Client Credentials)',
          'JWT (Structure, Signing, Validation, Refresh Tokens)',
          'API Keys & Scopes',
          'CORS Configuration',
          'Rate Limiting as Security',
          'Input Validation & Output Encoding'
        ],
        priority: 'essential'
      }
    ]
  },

  // =========================================================================
  // APPLICATION DEVELOPMENT — ARCHITECTURE LEVEL (Phase 7)
  // =========================================================================

  // Phase 7: Application Development (Architecture Level)
  {
    phase: 7,
    title: 'Phase 7: Application Development (Architecture Level)',
    slug: 'phase-7-application-architecture',
    duration: '2-3 weeks',
    color: '#14b8a6',
    icon: '💻',
    description: 'Understand frontend and backend architecture to guide AI agents effectively',
    topics: [
      {
        name: 'Frontend Architecture',
        slug: 'frontend-architecture',
        subtopics: [
          'Component Architecture & Design Systems',
          'State Management Patterns (Local, Global, Server State)',
          'Rendering Strategies (SSR, SSG, CSR, ISR, Streaming)',
          'Micro-Frontends Architecture',
          'Performance Patterns (Code Splitting, Lazy Loading, Bundle Optimization)',
          'Core Web Vitals (LCP, INP, CLS)'
        ],
        priority: 'essential'
      },
      {
        name: 'Frontend Frameworks (Conceptual)',
        slug: 'frontend-frameworks-conceptual',
        subtopics: [
          'Vue.js/Nuxt.js: Composition API, Reactivity System, File-Based Routing',
          'React/Next.js: Hooks, Server Components, App Router',
          'Framework Selection Criteria & Trade-offs',
          'Hydration, Islands Architecture & Partial Hydration',
          'SEO Architecture (Meta Tags, Structured Data, Sitemaps)'
        ],
        priority: 'essential'
      },
      {
        name: 'Backend Architecture',
        slug: 'backend-architecture',
        subtopics: [
          'Layered API Design (Controller, Service, Repository)',
          'Middleware Pipeline Architecture',
          'Authentication Patterns (JWT, OAuth, Session, RBAC, ABAC)',
          'Error Handling Strategies (Centralized Error Handler, Custom Error Classes)',
          'Logging Architecture (Structured Logging, Request ID Tracking)',
          'Background Job Processing'
        ],
        priority: 'essential'
      },
      {
        name: 'Database Integration Patterns',
        slug: 'database-integration-patterns',
        subtopics: [
          'ORM vs Query Builder vs Raw SQL Trade-offs',
          'N+1 Problem & Solutions',
          'Connection Pooling & Lifecycle Management',
          'Migration Strategies & Schema Versioning',
          'Repository Pattern Implementation'
        ],
        priority: 'important'
      },
      {
        name: 'Testing Strategy',
        slug: 'testing-strategy',
        subtopics: [
          'Test Pyramid (Unit, Integration, E2E)',
          'TDD with AI Agents',
          'Contract Testing for API Boundaries',
          'Property-Based Testing for Edge Cases',
          'Testing AI-Generated Code Patterns',
          'Security Testing (SAST, DAST) in CI/CD'
        ],
        priority: 'essential'
      },
      {
        name: 'Code Review & Quality Assessment',
        slug: 'code-review-and-quality',
        subtopics: [
          'Reading Code Critically (Logic Errors, Race Conditions, Edge Cases)',
          'Security Review (OWASP, Injection, XSS/CSRF)',
          'Performance Review (Complexity, N+1 Queries, Memory Leaks)',
          'Architectural Fitness Review',
          'AI-Specific Review (Hallucinated APIs, Outdated Libraries, Subtle Bugs)',
          'Automated Linting & Static Analysis'
        ],
        priority: 'essential'
      }
    ]
  },

  // =========================================================================
  // DEVOPS & SECURITY — DEEP SKILLS (Phases 8-13)
  // =========================================================================

  // Phase 8: Cloud Platforms (AWS Deep)
  {
    phase: 8,
    title: 'Phase 8: Cloud Platforms (AWS Deep)',
    slug: 'phase-8-cloud-platforms',
    duration: '2-3 weeks',
    color: '#f97316',
    icon: '☁️',
    description: 'Master cloud infrastructure — AWS is dominant in the Saudi market',
    topics: [
      {
        name: 'Cloud Concepts & Well-Architected',
        slug: 'cloud-concepts-and-well-architected',
        subtopics: [
          'IaaS vs PaaS vs SaaS',
          'Public vs Private vs Hybrid Cloud',
          'Regions & Availability Zones',
          'AWS Well-Architected Framework (6 Pillars)',
          'Shared Responsibility Model',
          'Twelve-Factor App Methodology'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Identity & Access (IAM)',
        slug: 'aws-iam',
        subtopics: [
          'Users, Groups & Policies',
          'Roles & Cross-Account Access',
          'Multi-Factor Authentication (MFA)',
          'Identity Federation',
          'Permission Boundaries & Service Control Policies',
          'IAM Best Practices & Least Privilege'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Compute (EC2)',
        slug: 'aws-ec2',
        subtopics: [
          'Instance Types & Sizing',
          'AMIs & Launch Templates',
          'Key Pairs & SSH Access',
          'Security Groups',
          'Auto Scaling Groups',
          'Spot vs Reserved vs On-Demand Instances'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Networking (VPC)',
        slug: 'aws-vpc',
        subtopics: [
          'VPC Basics & Design',
          'Subnets (Public vs Private)',
          'Internet Gateway & NAT Gateway',
          'Route Tables & Network ACLs',
          'VPC Peering & Endpoints',
          'Transit Gateway'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Storage & Databases',
        slug: 'aws-storage-and-databases',
        subtopics: [
          'S3 (Storage Classes, Lifecycle, Versioning, Bucket Policies)',
          'EBS (Volume Types, Snapshots)',
          'EFS (Elastic File System)',
          'RDS (Multi-AZ, Read Replicas, Aurora)',
          'DynamoDB Basics',
          'ElastiCache Overview'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Serverless & Additional Services',
        slug: 'aws-serverless-and-services',
        subtopics: [
          'Lambda (Serverless Functions)',
          'API Gateway',
          'Route 53 (DNS) & CloudFront (CDN)',
          'Elastic Load Balancer (ALB/NLB)',
          'SNS, SQS & Step Functions',
          'CloudWatch, CloudTrail & Secrets Manager'
        ],
        priority: 'important'
      },
      {
        name: 'AWS CLI & SDK',
        slug: 'aws-cli-sdk',
        subtopics: [
          'AWS CLI Installation & Configuration',
          'Common CLI Commands',
          'AWS SDK (Python boto3)',
          'Infrastructure Queries & Automation Scripts'
        ],
        priority: 'important'
      },
      {
        name: 'Cloud Design Patterns & FinOps',
        slug: 'cloud-design-patterns-and-finops',
        subtopics: [
          'Throttling & Queue-Based Load Leveling',
          'Competing Consumers Pattern',
          'Strangler Fig Pattern for Cloud Migration',
          'Right-Sizing & Cost Optimization',
          'Cost Allocation & Tagging Strategies',
          'FinOps for GenAI (Managing LLM API Costs)'
        ],
        priority: 'important'
      },
      {
        name: 'Azure Basics',
        slug: 'azure-basics',
        subtopics: [
          'Azure Resource Manager',
          'Virtual Machines & Azure VNet',
          'Azure Storage & Azure Active Directory',
          'Azure DevOps Services'
        ],
        priority: 'recommended'
      }
    ]
  },

  // Phase 9: Containerization & Orchestration
  {
    phase: 9,
    title: 'Phase 9: Containerization & Orchestration',
    slug: 'phase-9-containers-and-kubernetes',
    duration: '3-4 weeks',
    color: '#3b82f6',
    icon: '🐳',
    description: 'Package, deploy, and manage containers at scale in production',
    topics: [
      {
        name: 'Container Concepts',
        slug: 'container-concepts',
        subtopics: [
          'What are Containers?',
          'Containers vs Virtual Machines',
          'Container Runtime & Image Layers',
          'Container Registries',
          'Microservices Architecture & Containers',
          '12-Factor App Principles'
        ],
        priority: 'essential'
      },
      {
        name: 'Docker Fundamentals',
        slug: 'docker-fundamentals',
        subtopics: [
          'Docker Architecture & CLI Basics',
          'Running Containers (Ports, Volumes, Env Vars)',
          'Container Lifecycle & Logs',
          'Exec into Containers'
        ],
        priority: 'essential'
      },
      {
        name: 'Docker Images',
        slug: 'docker-images',
        subtopics: [
          'Dockerfile Syntax (FROM, COPY, RUN, CMD, ENTRYPOINT)',
          'Multi-Stage Builds',
          'Image Optimization & Tagging',
          '.dockerignore',
          'Pushing to Registry'
        ],
        priority: 'essential'
      },
      {
        name: 'Docker Compose & Networking',
        slug: 'docker-compose-and-networking',
        subtopics: [
          'Compose File Structure & Services',
          'Networks & Volumes in Compose',
          'Environment Files & Health Checks',
          'Bridge, Host & Custom Networks',
          'Container DNS & Network Inspection'
        ],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Concepts',
        slug: 'kubernetes-concepts',
        subtopics: [
          'Why Kubernetes?',
          'K8s Architecture (Control Plane & Worker Nodes)',
          'Declarative vs Imperative',
          'kubectl CLI',
          'Desired State & Reconciliation'
        ],
        priority: 'essential'
      },
      {
        name: 'Core Workloads',
        slug: 'core-workloads',
        subtopics: [
          'Pods & Pod Lifecycle',
          'ReplicaSets & Deployments',
          'StatefulSets & DaemonSets',
          'Jobs & CronJobs',
          'Init Containers & Sidecar Containers'
        ],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Networking',
        slug: 'kubernetes-networking',
        subtopics: [
          'Services (ClusterIP, NodePort, LoadBalancer)',
          'Ingress Controllers & Ingress Resources',
          'Network Policies',
          'DNS in Kubernetes',
          'Service Mesh Concepts'
        ],
        priority: 'essential'
      },
      {
        name: 'Configuration & Storage',
        slug: 'configuration-and-storage',
        subtopics: [
          'ConfigMaps & Secrets',
          'Persistent Volumes (PV) & Persistent Volume Claims (PVC)',
          'Storage Classes',
          'Volume Types'
        ],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Security & Scaling',
        slug: 'kubernetes-security-and-scaling',
        subtopics: [
          'RBAC (Role-Based Access Control)',
          'Service Accounts & Security Contexts',
          'Pod Security Standards',
          'Horizontal Pod Autoscaler (HPA)',
          'Vertical Pod Autoscaler & Cluster Autoscaler',
          'Resource Quotas & Limit Ranges'
        ],
        priority: 'important'
      },
      {
        name: 'Helm & Managed Kubernetes',
        slug: 'helm-and-managed-kubernetes',
        subtopics: [
          'Helm Charts, Values Files & Repositories',
          'Creating Custom Charts & Dependencies',
          'Amazon EKS (Node Groups, Add-ons, eksctl)',
          'Azure AKS & Google GKE Overview'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 10: Infrastructure as Code
  {
    phase: 10,
    title: 'Phase 10: Infrastructure as Code',
    slug: 'phase-10-infrastructure-as-code',
    duration: '2-3 weeks',
    color: '#ef4444',
    icon: '📝',
    description: 'Define and manage infrastructure through code — repeatable and version-controlled',
    topics: [
      {
        name: 'IaC Concepts',
        slug: 'iac-concepts',
        subtopics: [
          'What is Infrastructure as Code?',
          'Benefits of IaC',
          'Declarative vs Imperative IaC',
          'Immutable Infrastructure',
          'Idempotency',
          'State Management & Drift Detection'
        ],
        priority: 'essential'
      },
      {
        name: 'Terraform Fundamentals',
        slug: 'terraform-fundamentals',
        subtopics: [
          'Terraform Architecture & HCL Syntax',
          'Providers & Resources',
          'Data Sources',
          'Variables & Outputs',
          'Terraform CLI (init, plan, apply, destroy)'
        ],
        priority: 'essential'
      },
      {
        name: 'Terraform State',
        slug: 'terraform-state',
        subtopics: [
          'Local State',
          'Remote State (S3 Backend)',
          'State Locking (DynamoDB)',
          'State Commands & Import',
          'State Migration'
        ],
        priority: 'essential'
      },
      {
        name: 'Terraform Advanced',
        slug: 'terraform-advanced',
        subtopics: [
          'Modules & Module Registry',
          'Workspaces',
          'Count & For Each',
          'Dynamic Blocks & Conditional Expressions',
          'Local Values & Built-in Functions',
          'Provisioners'
        ],
        priority: 'important'
      },
      {
        name: 'Terraform Best Practices',
        slug: 'terraform-best-practices',
        subtopics: [
          'Project Structure & Naming Conventions',
          'Version Constraints',
          'Sensitive Data Handling',
          'Testing Terraform (Terratest)',
          'CI/CD Integration'
        ],
        priority: 'important'
      },
      {
        name: 'Ansible',
        slug: 'ansible',
        subtopics: [
          'Ansible Architecture & Inventory Files',
          'Ad-hoc Commands & Playbooks',
          'Tasks, Handlers & Templates (Jinja2)',
          'Roles & Ansible Galaxy',
          'Variables, Facts & Vault',
          'Ansible vs Terraform (When to Use Each)'
        ],
        priority: 'important'
      },
      {
        name: 'Platform Engineering',
        slug: 'platform-engineering',
        subtopics: [
          'Internal Developer Platforms (IDPs)',
          'Self-Service Infrastructure',
          'GitOps Principles',
          'Configuration Management & Desired State',
          'Combining IaC Tools'
        ],
        priority: 'recommended'
      }
    ]
  },

  // Phase 11: CI/CD & GitOps
  {
    phase: 11,
    title: 'Phase 11: CI/CD & GitOps',
    slug: 'phase-11-cicd-and-gitops',
    duration: '2-3 weeks',
    color: '#84cc16',
    icon: '⚙️',
    description: 'Automate building, testing, and deploying applications reliably',
    topics: [
      {
        name: 'CI/CD Concepts',
        slug: 'cicd-concepts',
        subtopics: [
          'Continuous Integration (CI)',
          'Continuous Delivery vs Continuous Deployment',
          'Pipeline Stages & Build Automation',
          'Deployment Strategies (Blue-Green, Canary, Rolling)',
          'Feature Flags & Progressive Delivery'
        ],
        priority: 'essential'
      },
      {
        name: 'Jenkins',
        slug: 'jenkins',
        subtopics: [
          'Jenkins Architecture & Installation',
          'Pipeline as Code (Jenkinsfile)',
          'Declarative vs Scripted Pipelines',
          'Pipeline Stages, Steps & Agents',
          'Plugins & Credentials Management',
          'Shared Libraries & Multibranch Pipelines'
        ],
        priority: 'essential'
      },
      {
        name: 'GitHub Actions',
        slug: 'github-actions',
        subtopics: [
          'Workflow Files, Events & Triggers',
          'Jobs, Steps & Actions Marketplace',
          'Environment Variables & Secrets',
          'Matrix Builds & Reusable Workflows',
          'Self-Hosted Runners & Caching'
        ],
        priority: 'essential'
      },
      {
        name: 'GitLab CI/CD',
        slug: 'gitlab-cicd',
        subtopics: [
          '.gitlab-ci.yml Structure',
          'Stages, Jobs & Variables',
          'Artifacts & Caching',
          'Runners & Environments',
          'Review Apps & Auto DevOps'
        ],
        priority: 'important'
      },
      {
        name: 'GitOps & ArgoCD',
        slug: 'gitops-argocd',
        subtopics: [
          'GitOps Principles & Benefits',
          'ArgoCD Installation & Application CRD',
          'Sync Strategies & Rollback',
          'App of Apps Pattern',
          'Multi-Cluster Management'
        ],
        priority: 'important'
      },
      {
        name: 'Artifact Management',
        slug: 'artifact-management',
        subtopics: [
          'Artifact Repositories (Nexus, JFrog)',
          'Container Registries (ECR, ACR, Docker Hub)',
          'Versioning & Artifact Promotion',
          'Image Scanning in CI Pipelines'
        ],
        priority: 'recommended'
      }
    ]
  },

  // Phase 12: Monitoring & Reliability
  {
    phase: 12,
    title: 'Phase 12: Monitoring & Reliability',
    slug: 'phase-12-monitoring-and-reliability',
    duration: '2-3 weeks',
    color: '#a855f7',
    icon: '📊',
    description: 'Monitor, observe, and ensure reliability of systems in production',
    topics: [
      {
        name: 'Observability Concepts',
        slug: 'observability-concepts',
        subtopics: [
          'Three Pillars: Metrics, Logs, Traces',
          'Monitoring vs Observability',
          'SLIs, SLOs & SLAs',
          'Error Budgets',
          'Mean Time to Recovery (MTTR)',
          'Alerting Strategies & On-Call Practices'
        ],
        priority: 'essential'
      },
      {
        name: 'Prometheus',
        slug: 'prometheus',
        subtopics: [
          'Prometheus Architecture',
          'Metrics Types (Counter, Gauge, Histogram, Summary)',
          'PromQL Basics & Advanced Queries',
          'Exporters & Service Discovery',
          'Recording Rules & Alerting Rules',
          'AlertManager & Prometheus Operator'
        ],
        priority: 'essential'
      },
      {
        name: 'Grafana',
        slug: 'grafana',
        subtopics: [
          'Data Sources & Dashboard Creation',
          'Panels & Visualizations',
          'Variables & Templates',
          'Alerting in Grafana',
          'Dashboard as Code',
          'Grafana Loki Integration'
        ],
        priority: 'essential'
      },
      {
        name: 'Log Management',
        slug: 'log-management',
        subtopics: [
          'Centralized Logging Architecture',
          'ELK Stack Overview (Elasticsearch, Logstash, Kibana)',
          'Grafana Loki & Fluentd',
          'Log Aggregation Patterns',
          'Structured Logging Best Practices',
          'Log Retention & Cost Management'
        ],
        priority: 'important'
      },
      {
        name: 'Distributed Tracing',
        slug: 'distributed-tracing',
        subtopics: [
          'OpenTelemetry (The Industry Standard)',
          'Jaeger Basics & Trace Visualization',
          'Trace Context Propagation',
          'Span Analysis & Correlation',
          'Instrumenting Applications'
        ],
        priority: 'important'
      },
      {
        name: 'AWS CloudWatch',
        slug: 'aws-cloudwatch',
        subtopics: [
          'CloudWatch Metrics & Alarms',
          'CloudWatch Logs & Log Insights',
          'CloudWatch Dashboards',
          'Container Insights'
        ],
        priority: 'important'
      },
      {
        name: 'Reliability Engineering',
        slug: 'reliability-engineering',
        subtopics: [
          'Chaos Engineering Principles (Chaos Monkey, Litmus)',
          'Disaster Recovery (RPO & RTO)',
          'Backup Strategies',
          'Feature Flags for Safe Rollouts',
          'Incident Response Planning',
          'Post-Incident Reviews (Blameless Postmortems)'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 13: Security — DevSecOps & Application Security
  {
    phase: 13,
    title: 'Phase 13: Security — DevSecOps & Application Security',
    slug: 'phase-13-security',
    duration: '3-4 weeks',
    color: '#dc2626',
    icon: '🔐',
    description: 'Integrate security throughout the entire development and operations lifecycle',
    topics: [
      {
        name: 'DevSecOps Fundamentals',
        slug: 'devsecops-fundamentals',
        subtopics: [
          'Shift-Left Security',
          'Security as Code',
          'Threat Modeling (STRIDE, DREAD, PASTA)',
          'OWASP Top 10 (Web & API)',
          'Defense in Depth',
          'Zero Trust Architecture Principles',
          'Compliance as Code'
        ],
        priority: 'essential'
      },
      {
        name: 'SAST (Static Application Security Testing)',
        slug: 'sast',
        subtopics: [
          'What is SAST?',
          'SonarQube & Semgrep',
          'CodeQL & Checkmarx',
          'IDE Security Plugins & Pre-commit Hooks',
          'Pipeline Integration',
          'Reviewing AI-Generated Code for Security Flaws'
        ],
        priority: 'essential'
      },
      {
        name: 'DAST (Dynamic Application Security Testing)',
        slug: 'dast',
        subtopics: [
          'What is DAST?',
          'OWASP ZAP & Burp Suite',
          'API Security Testing',
          'Testing in CI/CD Pipelines',
          'Nikto & Automated Scanning'
        ],
        priority: 'essential'
      },
      {
        name: 'Container & Kubernetes Security',
        slug: 'container-and-kubernetes-security',
        subtopics: [
          'Image Scanning (Trivy, Clair)',
          'Base Image Security & Distroless Images',
          'Dockerfile Best Practices & Container Hardening',
          'Runtime Security (Falco)',
          'Pod Security Standards & Admission Controllers',
          'OPA/Gatekeeper & Kyverno Policies',
          'Kubernetes CIS Benchmarks'
        ],
        priority: 'essential'
      },
      {
        name: 'Secrets Management',
        slug: 'secrets-management',
        subtopics: [
          'HashiCorp Vault (Architecture, Secret Engines, Dynamic Secrets)',
          'AWS Secrets Manager',
          'Azure Key Vault',
          'External Secrets Operator & Sealed Secrets',
          'Secret Rotation & Lifecycle Management'
        ],
        priority: 'essential'
      },
      {
        name: 'Application Security',
        slug: 'application-security',
        subtopics: [
          'XSS Prevention (Sanitization, CSP)',
          'CSRF Protection (Tokens, SameSite Cookies)',
          'SQL Injection Prevention (Parameterized Queries)',
          'Broken Access Control',
          'Security Headers (HSTS, X-Frame-Options, CSP)',
          'Input Validation & Output Encoding',
          'Authentication Security Best Practices'
        ],
        priority: 'essential'
      },
      {
        name: 'Infrastructure Security',
        slug: 'infrastructure-security',
        subtopics: [
          'IaC Security Scanning (tfsec, Checkov)',
          'Cloud Security Posture Management (CSPM)',
          'AWS Security Hub',
          'Terraform Sentinel',
          'CIS Benchmarks & Compliance Scanning'
        ],
        priority: 'important'
      },
      {
        name: 'Supply Chain Security',
        slug: 'supply-chain-security',
        subtopics: [
          'Software Composition Analysis (SCA)',
          'Snyk & Dependabot',
          'SBOM (Software Bill of Materials)',
          'Image Signing & Artifact Verification',
          'License Compliance',
          'Supply Chain Attack Vectors'
        ],
        priority: 'important'
      },
      {
        name: 'Security Monitoring & Compliance',
        slug: 'security-monitoring-and-compliance',
        subtopics: [
          'SIEM (Security Information & Event Management)',
          'Intrusion Detection & Incident Response',
          'Security Dashboards & Vulnerability Management',
          'SOC 2 & ISO 27001',
          'PCI DSS & GDPR Considerations',
          'Audit Trails & Policy Enforcement'
        ],
        priority: 'important'
      }
    ]
  },

  // =========================================================================
  // AI SKILLS & CAREER (Phases 14-15)
  // =========================================================================

  // Phase 14: AI-Augmented Engineering
  {
    phase: 14,
    title: 'Phase 14: AI-Augmented Engineering',
    slug: 'phase-14-ai-augmented-engineering',
    duration: '2-3 weeks',
    color: '#06b6d4',
    icon: '🤖',
    description: 'Master the meta-skills that make everything else 10x more effective',
    topics: [
      {
        name: 'Context Engineering',
        slug: 'context-engineering',
        subtopics: [
          'What is Context Engineering & Why It Matters',
          'Managing User Metadata, Task Instructions & Data Schemas',
          'Memory Management (Short-Term, Long-Term, Episodic)',
          'Context Window Optimization & Token Budget Management',
          'Retrieval-Augmented Context (Pulling Relevant Docs/Code)',
          'Isolating vs Persisting Context Across Agent Steps'
        ],
        priority: 'essential'
      },
      {
        name: 'Spec-Driven Development',
        slug: 'spec-driven-development',
        subtopics: [
          'Writing PRDs & SRS for AI Consumption',
          'Defining Input/Output Formats & Data Types',
          'Documenting Business Rules, Edge Cases & Constraints',
          'Specifying Integration & Performance Requirements',
          'Maintaining Specs as Living Documents',
          'Anti-Patterns (Vague Specs, Over-Engineering, Write-and-Forget)'
        ],
        priority: 'essential'
      },
      {
        name: 'Agentic Engineering',
        slug: 'agentic-engineering',
        subtopics: [
          'Plan-Act-Review-Repeat Workflow Cycles',
          'Task Decomposition for AI Agents',
          'Agent Configuration Files (CLAUDE.md, .cursorrules)',
          'Multi-Agent Orchestration (Sequential, Parallel, Swarm)',
          'Strategic Checkpointing & Version Control with Agents',
          'Knowing When to Intervene vs Let the Agent Iterate'
        ],
        priority: 'essential'
      },
      {
        name: 'AI Tool Ecosystem',
        slug: 'ai-tool-ecosystem',
        subtopics: [
          'Claude Code, Cursor, GitHub Copilot & Windsurf',
          'Model Context Protocol (MCP) for Tool Integration',
          'Chat vs Agent vs Inline Completion Modes',
          'Understanding Model Capabilities & Limitations',
          'RAG Patterns & Vector Databases Overview',
          'AI Orchestration Frameworks (LangChain, crewAI)'
        ],
        priority: 'essential'
      },
      {
        name: 'AI Code Review & Evaluation',
        slug: 'ai-code-review-and-evaluation',
        subtopics: [
          'Hallucination Detection & Fact Verification',
          'Automated Testing of AI-Generated Code',
          'AI-on-AI Reviews (Using One Model to Review Another)',
          'Quality Gates for AI Contributions',
          'Security Review of AI-Generated Code',
          'Regression Testing for AI Behavior Changes'
        ],
        priority: 'essential'
      },
      {
        name: 'AI System Design',
        slug: 'ai-system-design',
        subtopics: [
          'RAG Architecture (Indexing, Retrieval, Generation)',
          'Vector Databases & Embedding Pipelines',
          'LLM Serving Architecture (Model Routing, Fallback)',
          'Guardrails & Safety Layers for AI Outputs',
          'AI-Specific Observability (Token Usage, Latency, Quality)',
          'Cost Optimization for AI Workloads'
        ],
        priority: 'important'
      }
    ]
  },

  // Phase 15: System Design Practice & Career
  {
    phase: 15,
    title: 'Phase 15: System Design Practice & Career',
    slug: 'phase-15-system-design-and-career',
    duration: 'Ongoing',
    color: '#f43f5e',
    icon: '🎓',
    description: 'Put it all together — practice system design and prepare for your dream role',
    topics: [
      {
        name: 'Classic System Design Problems',
        slug: 'classic-system-design-problems',
        subtopics: [
          'URL Shortener (TinyURL)',
          'Rate Limiter',
          'Key-Value Store',
          'Notification System (Push, Email, SMS)',
          'Chat System (WhatsApp/Messenger)',
          'News Feed / Timeline',
          'Web Crawler',
          'Unique ID Generator'
        ],
        priority: 'essential'
      },
      {
        name: 'Product Design Problems',
        slug: 'product-design-problems',
        subtopics: [
          'Video Streaming (YouTube/Netflix)',
          'Ride-Hailing (Uber)',
          'E-Commerce Platform',
          'Payment System & Digital Wallet',
          'Collaborative Document Editing (Google Docs)',
          'Search Autocomplete / Typeahead'
        ],
        priority: 'essential'
      },
      {
        name: 'Infrastructure Design Problems',
        slug: 'infrastructure-design-problems',
        subtopics: [
          'Distributed Message Queue',
          'Distributed Cache',
          'Distributed File Storage (S3-like Object Storage)',
          'Metrics Monitoring & Alerting System',
          'Content Delivery Network',
          'Distributed Task Scheduler'
        ],
        priority: 'important'
      },
      {
        name: 'Architecture Evaluation & Governance',
        slug: 'architecture-evaluation',
        subtopics: [
          'ATAM (Architecture Tradeoff Analysis Method)',
          'Fitness Functions for Architecture',
          'Technical Debt Management',
          'Migration Strategies (Strangler Fig, Parallel Run)',
          'Conway\'s Law & Team Topologies'
        ],
        priority: 'important'
      },
      {
        name: 'Priority Certifications',
        slug: 'priority-certifications',
        subtopics: [
          'AWS Solutions Architect Associate (SAA-C03)',
          'Certified Kubernetes Administrator (CKA)',
          'HashiCorp Terraform Associate',
          'AWS DevOps Professional (Optional)',
          'Azure Administrator AZ-104 (Optional)'
        ],
        priority: 'essential'
      },
      {
        name: 'Portfolio & Interview Preparation',
        slug: 'portfolio-and-interview-preparation',
        subtopics: [
          'End-to-End CI/CD Pipeline Project',
          'Kubernetes Deployment Project',
          'Infrastructure as Code Project',
          'System Design Interview Practice',
          'STAR Method for Behavioral Questions',
          'GitHub Portfolio & LinkedIn Optimization'
        ],
        priority: 'essential'
      },
      {
        name: 'Technical Leadership',
        slug: 'technical-leadership',
        subtopics: [
          'Architecture Decision Governance',
          'Mentoring & Technical Communication',
          'Leading Through AI-Driven Change',
          'Cross-Functional Team Collaboration',
          'Ethical AI & Responsible Technology'
        ],
        priority: 'recommended'
      }
    ]
  }
]
