/**
 * Roadmap Data Module
 * ===================
 * This file contains all the data for the DevOps to DevSecOps learning roadmap.
 * It defines the type system, configuration, and the complete roadmap structure.
 *
 * Data Structure:
 * - Phases: Major learning milestones (10 total)
 * - Topics: Subject areas within each phase
 * - Subtopics: Specific skills or concepts to learn
 *
 * Priority System:
 * - Essential (Red): Must-know skills required for job applications
 * - Important (Yellow): Should-know skills frequently requested in interviews
 * - Recommended (Blue): Good-to-know skills that differentiate candidates
 *
 * Duration Tracking:
 * - Each phase has a duration in weeks (e.g., "2 weeks")
 * - Total duration is automatically calculated from all phase durations
 * - Phases with "Ongoing" duration are excluded from the total
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Priority Type
 * -------------
 * Defines the three levels of importance for topics:
 * - essential: Critical skills that are non-negotiable for job applications
 * - important: Skills that are commonly tested in interviews
 * - recommended: Nice-to-have skills that set candidates apart
 */
export type Priority = 'essential' | 'important' | 'recommended'

/**
 * Topic Interface
 * ---------------
 * Represents a learning topic within a phase.
 *
 * @property name - The display name of the topic (e.g., "Linux Fundamentals")
 * @property slug - URL-friendly identifier (e.g., "linux-fundamentals")
 * @property subtopics - Array of specific skills or concepts under this topic
 * @property priority - The importance level (essential, important, recommended)
 */
export interface Topic {
  name: string
  slug?: string
  subtopics: string[]
  priority: Priority
}

/**
 * Phase Interface
 * ---------------
 * Represents a major learning phase in the roadmap.
 *
 * @property phase - The phase number (1-10)
 * @property title - Full title including phase number (e.g., "Phase 1: Foundations")
 * @property slug - URL-friendly identifier matching content directory (e.g., "phase-1-sdlc")
 * @property duration - Time estimate (e.g., "2 weeks" or "Ongoing")
 * @property color - Hex color code for visual theming (e.g., "#22c55e")
 * @property icon - Emoji icon representing the phase (e.g., "🏗️")
 * @property description - Brief description of what the phase covers
 * @property topics - Array of Topic objects containing the learning content
 */
export interface Phase {
  phase: number
  title: string
  slug: string
  duration: string
  color: string
  icon: string
  description: string
  topics: Topic[]
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Priority Configuration
 * ----------------------
 * Maps priority levels to their display properties.
 * Used by UI components to render consistent colors and labels.
 *
 * Color Scheme:
 * - Essential: Red (#dc2626) - Urgent/Critical
 * - Important: Amber (#f59e0b) - Warning/Attention
 * - Recommended: Blue (#3b82f6) - Informational
 */
export const priorityConfig = {
  essential: { color: 'red', label: 'Must Know' },
  important: { color: 'amber', label: 'Should Know' },
  recommended: { color: 'blue', label: 'Good to Know' }
} as const

// =============================================================================
// ROADMAP DATA
// =============================================================================

/**
 * Roadmap Data Array
 * ------------------
 * Contains all 10 phases of the DevOps to DevSecOps learning journey.
 *
 * Phase Overview:
 * 1. SDLC (1 week) - Software Development Lifecycle fundamentals
 * 2. Foundations (4 weeks) - Linux, scripting, networking, Git, programming
 * 3. Cloud Platforms (2 weeks) - AWS services and cloud concepts
 * 4. Containerization (2 weeks) - Docker and container fundamentals
 * 5. Kubernetes (2 weeks) - Container orchestration and management
 * 6. IaC (2 weeks) - Terraform and Ansible
 * 7. CI/CD (2 weeks) - Jenkins, GitHub Actions, GitOps
 * 8. Monitoring (1 week) - Prometheus, Grafana, observability
 * 9. DevSecOps (8 weeks) - Security integration throughout SDLC
 * 10. Certifications (Ongoing) - Professional certifications and job prep
 *
 * Total Duration: Automatically calculated (currently 24 weeks)
 */
export const roadmapData: Phase[] = [
  {
    phase: 1,
    title: 'Phase 1: Software Development Lifecycle (SDLC)',
    slug: 'phase-1-sdlc',
    duration: '1 week',
    color: '#6366f1',
    icon: '🔄',
    description: 'Understand how software is planned, built, tested, and delivered',
    topics: [
      {
        name: 'SDLC Models',
        slug: 'sdlc-models',
        subtopics: ['Waterfall Model', 'Agile Methodology', 'Scrum Framework', 'Kanban', 'DevOps as SDLC Evolution'],
        priority: 'essential'
      },
      {
        name: 'SDLC Phases',
        slug: 'sdlc-phases',
        subtopics: ['Requirements Gathering', 'Design & Architecture', 'Development/Coding', 'Testing & QA', 'Deployment', 'Maintenance & Operations'],
        priority: 'essential'
      },
      {
        name: 'Development Workflows',
        slug: 'development-workflows',
        subtopics: ['Feature Branching', 'Code Reviews', 'Pull Requests', 'Release Management', 'Hotfix Procedures'],
        priority: 'important'
      },
      {
        name: 'Project Management Basics',
        slug: 'project-management-basics',
        subtopics: ['User Stories', 'Sprint Planning', 'Backlog Management', 'Velocity & Estimation', 'Retrospectives'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 2,
    title: 'Phase 2: Foundations',
    slug: 'phase-2-foundations',
    duration: '4 weeks',
    color: '#22c55e',
    icon: '🏗️',
    description: 'Build the essential foundation everything else depends on',
    topics: [
      {
        name: 'Linux Fundamentals',
        slug: 'linux-fundamentals',
        subtopics: ['File System Hierarchy', 'Navigation Commands (cd, ls, pwd)', 'File Operations (cp, mv, rm, mkdir)', 'File Permissions (chmod, chown)', 'Users & Groups', 'Process Management (ps, top, kill)', 'Package Managers (apt, yum, dnf)', 'System Services (systemd, systemctl)', 'Cron Jobs & Scheduling', 'Log Files & Journalctl'],
        priority: 'essential'
      },
      {
        name: 'Bash Scripting',
        slug: 'bash-scripting',
        subtopics: ['Variables & Data Types', 'Conditionals (if/else)', 'Loops (for, while)', 'Functions', 'Input/Output Redirection', 'Pipes & Filters', 'Text Processing (grep, sed, awk)', 'Script Arguments', 'Exit Codes', 'Error Handling'],
        priority: 'essential'
      },
      {
        name: 'Networking Fundamentals',
        slug: 'networking-fundamentals',
        subtopics: ['OSI Model (7 Layers)', 'TCP/IP Model', 'IP Addressing & Subnetting', 'DNS (Domain Name System)', 'DHCP', 'HTTP/HTTPS Protocols', 'SSL/TLS Basics', 'Firewalls & Ports', 'Load Balancers', 'VPNs', 'Network Troubleshooting (ping, traceroute, netstat, ss, curl)'],
        priority: 'essential'
      },
      {
        name: 'Git Version Control',
        slug: 'git-version-control',
        subtopics: ['Git Basics (init, clone, add, commit)', 'Branching & Merging', 'Remote Repositories', 'Git Flow Workflow', 'Rebasing vs Merging', 'Cherry Picking', 'Stashing Changes', 'Resolving Conflicts', 'Git Hooks', 'Tags & Releases'],
        priority: 'essential'
      },
      {
        name: 'Python for Automation',
        slug: 'python-for-automation',
        subtopics: ['Python Syntax & Basics', 'Data Types & Structures', 'Control Flow', 'Functions & Modules', 'File Operations', 'Error Handling (try/except)', 'Working with APIs (requests)', 'JSON/YAML Parsing', 'Regular Expressions', 'Virtual Environments (venv, pip)'],
        priority: 'essential'
      },
      {
        name: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals',
        subtopics: ['Variables (let, const, var)', 'Data Types & Operators', 'Functions & Arrow Functions', 'Arrays & Objects', 'OOP: Classes & Constructors', 'OOP: Inheritance & Prototypes', 'OOP: Encapsulation & Modules', 'Async/Await & Promises', 'Fetch API', 'ES6+ Features', 'Node.js Basics', 'npm Package Manager'],
        priority: 'essential'
      },
      {
        name: 'TypeScript Essentials',
        slug: 'typescript-essentials',
        subtopics: ['Type Annotations', 'Interfaces & Types', 'Generics', 'Enums', 'Union & Intersection Types', 'Type Guards', 'tsconfig.json', 'Compiling TypeScript', 'TypeScript with Node.js'],
        priority: 'important'
      },
      {
        name: 'YAML & JSON',
        slug: 'yaml-and-json',
        subtopics: ['YAML Syntax', 'JSON Syntax', 'Data Structures', 'Nested Objects', 'Arrays/Lists', 'Configuration Files', 'Validation'],
        priority: 'important'
      }
    ]
  },
  {
    phase: 3,
    title: 'Phase 3: Cloud Platforms (AWS Focus)',
    slug: 'phase-3-cloud',
    duration: '2 weeks',
    color: '#f59e0b',
    icon: '☁️',
    description: 'Master cloud infrastructure - AWS is dominant in Saudi market',
    topics: [
      {
        name: 'Cloud Concepts',
        slug: 'cloud-concepts',
        subtopics: ['IaaS vs PaaS vs SaaS', 'Public vs Private vs Hybrid Cloud', 'Regions & Availability Zones', 'High Availability', 'Scalability (Vertical vs Horizontal)', 'Elasticity', 'Fault Tolerance', 'Disaster Recovery', 'Cloud Pricing Models', 'Shared Responsibility Model'],
        priority: 'essential'
      },
      {
        name: 'AWS Identity & Access (IAM)',
        slug: 'aws-iam',
        subtopics: ['Users & Groups', 'Policies & Permissions', 'Roles', 'Multi-Factor Authentication (MFA)', 'Access Keys', 'Identity Federation', 'AWS Organizations', 'Service Control Policies', 'Permission Boundaries', 'IAM Best Practices'],
        priority: 'essential'
      },
      {
        name: 'AWS Compute (EC2)',
        slug: 'aws-ec2',
        subtopics: ['Instance Types & Sizing', 'Amazon Machine Images (AMIs)', 'Key Pairs & SSH Access', 'Security Groups', 'Elastic IPs', 'Instance Storage vs EBS', 'Auto Scaling Groups', 'Launch Templates', 'Spot Instances', 'Reserved Instances'],
        priority: 'essential'
      },
      {
        name: 'AWS Networking (VPC)',
        slug: 'aws-vpc',
        subtopics: ['VPC Basics', 'Subnets (Public vs Private)', 'Internet Gateway', 'NAT Gateway', 'Route Tables', 'Network ACLs', 'VPC Peering', 'VPC Endpoints', 'Transit Gateway', 'AWS Direct Connect Basics'],
        priority: 'essential'
      },
      {
        name: 'AWS Storage',
        slug: 'aws-storage',
        subtopics: ['S3 (Simple Storage Service)', 'S3 Storage Classes', 'S3 Lifecycle Policies', 'S3 Versioning', 'EBS (Elastic Block Store)', 'EBS Volume Types', 'EFS (Elastic File System)', 'S3 Bucket Policies', 'Cross-Region Replication'],
        priority: 'essential'
      },
      {
        name: 'AWS Databases',
        slug: 'aws-databases',
        subtopics: ['RDS (Relational Database Service)', 'RDS Multi-AZ', 'Read Replicas', 'Aurora Basics', 'DynamoDB Basics', 'ElastiCache Overview', 'Database Backup & Recovery'],
        priority: 'important'
      },
      {
        name: 'AWS Additional Services',
        slug: 'aws-additional-services',
        subtopics: ['Route 53 (DNS)', 'CloudFront (CDN)', 'Elastic Load Balancer (ALB/NLB)', 'Lambda (Serverless)', 'CloudWatch (Monitoring)', 'CloudTrail (Auditing)', 'SNS & SQS (Messaging)', 'Secrets Manager', 'Systems Manager'],
        priority: 'important'
      },
      {
        name: 'AWS CLI & SDK',
        slug: 'aws-cli-sdk',
        subtopics: ['AWS CLI Installation', 'CLI Configuration', 'Common CLI Commands', 'AWS SDK (Python boto3)', 'Infrastructure Queries', 'Automation Scripts'],
        priority: 'important'
      },
      {
        name: 'Azure Basics (Secondary)',
        slug: 'azure-basics',
        subtopics: ['Azure Resource Manager', 'Virtual Machines', 'Azure VNet', 'Azure Storage', 'Azure Active Directory', 'Azure DevOps Services'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 4,
    title: 'Phase 4: Containerization',
    slug: 'phase-4-containers',
    duration: '2 weeks',
    color: '#0ea5e9',
    icon: '🐳',
    description: 'Package and run applications consistently anywhere',
    topics: [
      {
        name: 'Container Concepts',
        slug: 'container-concepts',
        subtopics: ['What are Containers?', 'Containers vs Virtual Machines', 'Container Runtime', 'Container Images', 'Image Layers', 'Container Registries', 'Microservices Architecture', '12-Factor App Principles'],
        priority: 'essential'
      },
      {
        name: 'Docker Fundamentals',
        slug: 'docker-fundamentals',
        subtopics: ['Docker Installation', 'Docker Architecture', 'Docker CLI Basics', 'Running Containers', 'Container Lifecycle', 'Port Mapping', 'Volume Mounts', 'Environment Variables', 'Container Logs', 'Exec into Containers'],
        priority: 'essential'
      },
      {
        name: 'Docker Images',
        slug: 'docker-images',
        subtopics: ['Dockerfile Syntax', 'Base Images', 'COPY vs ADD', 'RUN Instructions', 'CMD vs ENTRYPOINT', 'Multi-stage Builds', 'Image Optimization', 'Image Tagging', 'Pushing to Registry', '.dockerignore'],
        priority: 'essential'
      },
      {
        name: 'Docker Compose',
        slug: 'docker-compose',
        subtopics: ['Compose File Structure', 'Services Definition', 'Networks in Compose', 'Volumes in Compose', 'Environment Files', 'Depends On', 'Health Checks', 'Scaling Services', 'Override Files'],
        priority: 'essential'
      },
      {
        name: 'Container Registries',
        slug: 'container-registries',
        subtopics: ['Docker Hub', 'Amazon ECR', 'Azure Container Registry', 'Private Registries', 'Image Scanning Basics', 'Registry Authentication'],
        priority: 'important'
      },
      {
        name: 'Docker Networking',
        slug: 'docker-networking',
        subtopics: ['Bridge Network', 'Host Network', 'None Network', 'Custom Networks', 'Container DNS', 'Network Inspection'],
        priority: 'important'
      }
    ]
  },
  {
    phase: 5,
    title: 'Phase 5: Container Orchestration (Kubernetes)',
    slug: 'phase-5-kubernetes',
    duration: '2 weeks',
    color: '#8b5cf6',
    icon: '☸️',
    description: 'Manage containers at scale in production environments',
    topics: [
      {
        name: 'Kubernetes Concepts',
        slug: 'kubernetes-concepts',
        subtopics: ['Why Kubernetes?', 'K8s Architecture', 'Control Plane Components', 'Worker Node Components', 'Declarative vs Imperative', 'Desired State', 'kubectl CLI'],
        priority: 'essential'
      },
      {
        name: 'Core Workloads',
        slug: 'core-workloads',
        subtopics: ['Pods', 'ReplicaSets', 'Deployments', 'StatefulSets', 'DaemonSets', 'Jobs & CronJobs', 'Pod Lifecycle', 'Init Containers', 'Sidecar Containers'],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Networking',
        slug: 'kubernetes-networking',
        subtopics: ['Services (ClusterIP, NodePort, LoadBalancer)', 'Ingress Controllers', 'Ingress Resources', 'Network Policies', 'DNS in Kubernetes', 'Service Mesh Concepts'],
        priority: 'essential'
      },
      {
        name: 'Configuration & Storage',
        slug: 'configuration-and-storage',
        subtopics: ['ConfigMaps', 'Secrets', 'Persistent Volumes (PV)', 'Persistent Volume Claims (PVC)', 'Storage Classes', 'Volume Types'],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Security',
        slug: 'kubernetes-security',
        subtopics: ['RBAC (Role-Based Access Control)', 'Service Accounts', 'Security Contexts', 'Pod Security Standards', 'Network Policies', 'Secrets Management'],
        priority: 'important'
      },
      {
        name: 'Helm Package Manager',
        slug: 'helm-package-manager',
        subtopics: ['What is Helm?', 'Helm Charts', 'Chart Structure', 'Values Files', 'Helm Repositories', 'Installing Charts', 'Upgrading & Rollback', 'Creating Custom Charts', 'Chart Dependencies'],
        priority: 'important'
      },
      {
        name: 'Managed Kubernetes',
        slug: 'managed-kubernetes',
        subtopics: ['Amazon EKS', 'Azure AKS', 'Google GKE', 'EKS Node Groups', 'EKS Add-ons', 'eksctl CLI'],
        priority: 'important'
      },
      {
        name: 'Advanced Concepts',
        slug: 'advanced-concepts',
        subtopics: ['Horizontal Pod Autoscaler (HPA)', 'Vertical Pod Autoscaler', 'Cluster Autoscaler', 'Resource Quotas', 'Limit Ranges', 'Pod Disruption Budgets', 'Taints & Tolerations', 'Node Affinity'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 6,
    title: 'Phase 6: Infrastructure as Code (IaC)',
    slug: 'phase-6-iac',
    duration: '2 weeks',
    color: '#ec4899',
    icon: '📝',
    description: 'Define and manage infrastructure through code',
    topics: [
      {
        name: 'IaC Concepts',
        slug: 'iac-concepts',
        subtopics: ['What is Infrastructure as Code?', 'Benefits of IaC', 'Declarative vs Imperative IaC', 'Immutable Infrastructure', 'Idempotency', 'State Management', 'Drift Detection'],
        priority: 'essential'
      },
      {
        name: 'Terraform Fundamentals',
        slug: 'terraform-fundamentals',
        subtopics: ['Terraform Architecture', 'HCL Syntax', 'Providers', 'Resources', 'Data Sources', 'Variables', 'Outputs', 'Terraform CLI Commands', 'terraform init/plan/apply/destroy'],
        priority: 'essential'
      },
      {
        name: 'Terraform State',
        slug: 'terraform-state',
        subtopics: ['Local State', 'Remote State (S3 Backend)', 'State Locking (DynamoDB)', 'State Commands', 'Import Existing Resources', 'State Migration'],
        priority: 'essential'
      },
      {
        name: 'Terraform Advanced',
        slug: 'terraform-advanced',
        subtopics: ['Modules', 'Module Registry', 'Workspaces', 'Count & For Each', 'Dynamic Blocks', 'Conditional Expressions', 'Local Values', 'Built-in Functions', 'Provisioners'],
        priority: 'important'
      },
      {
        name: 'Terraform Best Practices',
        slug: 'terraform-best-practices',
        subtopics: ['Project Structure', 'Naming Conventions', 'Version Constraints', 'Sensitive Data Handling', 'Code Organization', 'Testing Terraform', 'CI/CD Integration'],
        priority: 'important'
      },
      {
        name: 'Ansible Basics',
        slug: 'ansible-basics',
        subtopics: ['Ansible Architecture', 'Inventory Files', 'Ad-hoc Commands', 'Playbooks', 'Tasks & Handlers', 'Variables & Facts', 'Templates (Jinja2)', 'Roles', 'Ansible Galaxy', 'Ansible Vault'],
        priority: 'important'
      },
      {
        name: 'Configuration Management',
        slug: 'configuration-management',
        subtopics: ['Ansible vs Terraform', 'When to Use Each', 'Combining IaC Tools', 'Configuration Drift', 'Desired State Configuration'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 7,
    title: 'Phase 7: CI/CD Pipelines',
    slug: 'phase-7-cicd',
    duration: '2 weeks',
    color: '#14b8a6',
    icon: '🔄',
    description: 'Automate building, testing, and deploying applications',
    topics: [
      {
        name: 'CI/CD Concepts',
        slug: 'cicd-concepts',
        subtopics: ['Continuous Integration (CI)', 'Continuous Delivery vs Deployment', 'Pipeline Stages', 'Build Automation', 'Automated Testing', 'Deployment Strategies', 'Blue-Green Deployments', 'Canary Releases', 'Rolling Updates', 'Feature Flags'],
        priority: 'essential'
      },
      {
        name: 'Jenkins',
        slug: 'jenkins',
        subtopics: ['Jenkins Installation', 'Jenkins Architecture', 'Freestyle Projects', 'Pipeline as Code (Jenkinsfile)', 'Declarative vs Scripted Pipelines', 'Pipeline Stages & Steps', 'Jenkins Agents', 'Jenkins Plugins', 'Credentials Management', 'Shared Libraries', 'Multibranch Pipelines'],
        priority: 'essential'
      },
      {
        name: 'GitHub Actions',
        slug: 'github-actions',
        subtopics: ['Workflow Files', 'Events & Triggers', 'Jobs & Steps', 'Actions Marketplace', 'Environment Variables', 'Secrets', 'Matrix Builds', 'Reusable Workflows', 'Self-hosted Runners', 'Caching'],
        priority: 'essential'
      },
      {
        name: 'GitLab CI/CD',
        slug: 'gitlab-cicd',
        subtopics: ['.gitlab-ci.yml Structure', 'Stages & Jobs', 'Variables', 'Artifacts', 'Caching', 'Runners', 'Environments', 'Review Apps', 'Auto DevOps'],
        priority: 'important'
      },
      {
        name: 'GitOps & ArgoCD',
        slug: 'gitops-argocd',
        subtopics: ['GitOps Principles', 'ArgoCD Installation', 'Application CRD', 'Sync Strategies', 'Rollback', 'App of Apps Pattern', 'Multi-cluster Management'],
        priority: 'important'
      },
      {
        name: 'Artifact Management',
        slug: 'artifact-management',
        subtopics: ['Artifact Repositories', 'Nexus Repository', 'JFrog Artifactory', 'Container Registries', 'Versioning Artifacts', 'Artifact Promotion'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 8,
    title: 'Phase 8: Monitoring & Observability',
    slug: 'phase-8-monitoring',
    duration: '1 week',
    color: '#f97316',
    icon: '📊',
    description: 'Monitor, log, and trace application and infrastructure health',
    topics: [
      {
        name: 'Observability Concepts',
        slug: 'observability-concepts',
        subtopics: ['Three Pillars: Metrics, Logs, Traces', 'Monitoring vs Observability', 'SLIs, SLOs, SLAs', 'Error Budgets', 'Mean Time to Recovery (MTTR)', 'Alerting Strategies', 'On-Call Practices'],
        priority: 'essential'
      },
      {
        name: 'Prometheus',
        slug: 'prometheus',
        subtopics: ['Prometheus Architecture', 'Metrics Types (Counter, Gauge, Histogram)', 'PromQL Basics', 'Exporters', 'Service Discovery', 'Recording Rules', 'Alerting Rules', 'AlertManager', 'Prometheus Operator'],
        priority: 'essential'
      },
      {
        name: 'Grafana',
        slug: 'grafana',
        subtopics: ['Grafana Installation', 'Data Sources', 'Dashboard Creation', 'Panels & Visualizations', 'Variables & Templates', 'Alerting in Grafana', 'Dashboard as Code', 'Grafana Loki Integration'],
        priority: 'essential'
      },
      {
        name: 'Log Management',
        slug: 'log-management',
        subtopics: ['Centralized Logging', 'ELK Stack Overview', 'Elasticsearch Basics', 'Logstash/Fluentd', 'Kibana Dashboards', 'Grafana Loki', 'Log Aggregation Patterns', 'Log Retention'],
        priority: 'important'
      },
      {
        name: 'Distributed Tracing',
        slug: 'distributed-tracing',
        subtopics: ['Tracing Concepts', 'OpenTelemetry', 'Jaeger Basics', 'Trace Context Propagation', 'Span Analysis'],
        priority: 'recommended'
      },
      {
        name: 'AWS CloudWatch',
        slug: 'aws-cloudwatch',
        subtopics: ['CloudWatch Metrics', 'CloudWatch Logs', 'CloudWatch Alarms', 'CloudWatch Dashboards', 'Log Insights', 'Container Insights'],
        priority: 'important'
      }
    ]
  },
  {
    phase: 9,
    title: 'Phase 9: DevSecOps - Security Integration',
    slug: 'phase-9-devsecops',
    duration: '8 weeks',
    color: '#ef4444',
    icon: '🔐',
    description: 'Integrate security throughout the entire DevOps lifecycle',
    topics: [
      {
        name: 'DevSecOps Fundamentals',
        slug: 'devsecops-fundamentals',
        subtopics: ['Shift Left Security', 'Security as Code', 'Security in SDLC', 'Threat Modeling', 'OWASP Top 10', 'Defense in Depth', 'Zero Trust Architecture', 'Compliance as Code'],
        priority: 'essential'
      },
      {
        name: 'SAST (Static Application Security Testing)',
        slug: 'sast',
        subtopics: ['What is SAST?', 'SonarQube', 'Semgrep', 'Checkmarx', 'CodeQL', 'IDE Security Plugins', 'Pre-commit Hooks', 'Pipeline Integration'],
        priority: 'essential'
      },
      {
        name: 'DAST (Dynamic Application Security Testing)',
        slug: 'dast',
        subtopics: ['What is DAST?', 'OWASP ZAP', 'Burp Suite', 'Nikto', 'Testing in CI/CD', 'API Security Testing'],
        priority: 'essential'
      },
      {
        name: 'Container Security',
        slug: 'container-security',
        subtopics: ['Image Scanning (Trivy, Clair)', 'Base Image Security', 'Dockerfile Best Practices', 'Runtime Security (Falco)', 'Container Hardening', 'Distroless Images', 'Image Signing', 'Admission Controllers'],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Security',
        slug: 'kubernetes-security',
        subtopics: ['Pod Security Standards', 'OPA/Gatekeeper', 'Kyverno Policies', 'Network Policies', 'Secrets Encryption', 'Audit Logging', 'Service Mesh Security', 'Kubernetes CIS Benchmarks'],
        priority: 'essential'
      },
      {
        name: 'Secrets Management',
        slug: 'secrets-management',
        subtopics: ['HashiCorp Vault', 'Vault Architecture', 'Secret Engines', 'Dynamic Secrets', 'AWS Secrets Manager', 'Azure Key Vault', 'External Secrets Operator', 'Sealed Secrets'],
        priority: 'essential'
      },
      {
        name: 'Infrastructure Security',
        slug: 'infrastructure-security',
        subtopics: ['IaC Security Scanning (tfsec, Checkov)', 'Cloud Security Posture (CSPM)', 'AWS Security Hub', 'Terraform Sentinel', 'Compliance Scanning', 'CIS Benchmarks'],
        priority: 'important'
      },
      {
        name: 'Dependency & Supply Chain Security',
        slug: 'dependency-supply-chain-security',
        subtopics: ['SCA (Software Composition Analysis)', 'Snyk', 'Dependabot', 'SBOM (Software Bill of Materials)', 'Dependency Scanning', 'License Compliance', 'Supply Chain Attacks'],
        priority: 'important'
      },
      {
        name: 'Security Monitoring & Response',
        slug: 'security-monitoring-response',
        subtopics: ['Security Information & Event Management (SIEM)', 'Intrusion Detection', 'Incident Response', 'Security Dashboards', 'Compliance Reporting', 'Vulnerability Management'],
        priority: 'important'
      },
      {
        name: 'Compliance & Governance',
        slug: 'compliance-governance',
        subtopics: ['SOC 2', 'ISO 27001', 'PCI DSS Basics', 'GDPR Considerations', 'Saudi NDMO Compliance', 'Audit Trails', 'Policy Enforcement'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 10,
    title: 'Phase 10: Certifications & Job Preparation',
    slug: 'phase-10-certifications',
    duration: 'Ongoing',
    color: '#84cc16',
    icon: '🎓',
    description: 'Validate your skills and prepare for the Saudi job market',
    topics: [
      {
        name: 'Priority Certifications',
        slug: 'priority-certifications',
        subtopics: ['AWS Solutions Architect Associate (SAA-C03)', 'Certified Kubernetes Administrator (CKA)', 'HashiCorp Terraform Associate', 'AWS DevOps Professional (Optional)', 'Azure Administrator AZ-104 (Optional)'],
        priority: 'essential'
      },
      {
        name: 'Hands-on Projects Portfolio',
        slug: 'hands-on-projects-portfolio',
        subtopics: ['End-to-End CI/CD Pipeline Project', 'Kubernetes Deployment Project', 'Infrastructure as Code Project', 'Security Scanning Pipeline', 'Monitoring Stack Deployment', 'GitHub Portfolio Preparation'],
        priority: 'essential'
      },
      {
        name: 'Saudi Market Preparation',
        slug: 'saudi-market-preparation',
        subtopics: ['CV Optimization for ATS', 'LinkedIn Profile Update', 'DevSecOps-focused CV Version', 'Saudi Aramco Compliance Knowledge', 'Vision 2030 Alignment', 'Networking in Saudi Tech Community'],
        priority: 'important'
      }
    ]
  }
]

// =============================================================================
// COMPUTED EXPORTS
// =============================================================================

/**
 * Total Weeks Calculation
 * -----------------------
 * Dynamically calculates the total duration by summing all phase durations.
 *
 * How it works:
 * 1. Iterates through all phases in roadmapData
 * 2. Uses regex to extract numeric week values (matches "X week" or "X weeks")
 * 3. Sums up all valid week durations
 * 4. Ignores non-week durations like "Ongoing"
 *
 * This ensures the total automatically updates when phase durations change.
 */
export const totalWeeks = roadmapData.reduce((total, phase) => {
  // Regex pattern: matches "1 week", "2 weeks", "10 weeks", etc.
  const match = phase.duration.match(/^(\d+)\s*weeks?$/i)
  if (match) {
    return total + parseInt(match[1]!, 10)
  }
  // Skip non-week durations (e.g., "Ongoing")
  return total
}, 0)

/**
 * Total Duration String
 * ---------------------
 * Formatted string for display in the UI (e.g., "24 weeks").
 * Used in the header and stats footer components.
 */
export const totalDuration = `${totalWeeks} weeks`
