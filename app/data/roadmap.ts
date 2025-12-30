export type Priority = 'essential' | 'important' | 'recommended'

export interface Topic {
  name: string
  subtopics: string[]
  priority: Priority
}

export interface Phase {
  phase: number
  title: string
  duration: string
  color: string
  icon: string
  description: string
  topics: Topic[]
}

export const priorityConfig = {
  essential: { color: 'red', label: 'Must Know' },
  important: { color: 'amber', label: 'Should Know' },
  recommended: { color: 'blue', label: 'Good to Know' }
} as const

export const roadmapData: Phase[] = [
  {
    phase: 0,
    title: 'Phase 0: Software Development Lifecycle (SDLC)',
    duration: '1-2 weeks',
    color: '#6366f1',
    icon: '🔄',
    description: 'Understand how software is planned, built, tested, and delivered',
    topics: [
      {
        name: 'SDLC Models',
        subtopics: ['Waterfall Model', 'Agile Methodology', 'Scrum Framework', 'Kanban', 'DevOps as SDLC Evolution'],
        priority: 'essential'
      },
      {
        name: 'SDLC Phases',
        subtopics: ['Requirements Gathering', 'Design & Architecture', 'Development/Coding', 'Testing & QA', 'Deployment', 'Maintenance & Operations'],
        priority: 'essential'
      },
      {
        name: 'Development Workflows',
        subtopics: ['Feature Branching', 'Code Reviews', 'Pull Requests', 'Release Management', 'Hotfix Procedures'],
        priority: 'important'
      },
      {
        name: 'Project Management Basics',
        subtopics: ['User Stories', 'Sprint Planning', 'Backlog Management', 'Velocity & Estimation', 'Retrospectives'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 1,
    title: 'Phase 1: Foundations',
    duration: '6-8 weeks',
    color: '#22c55e',
    icon: '🏗️',
    description: 'Build the essential foundation everything else depends on',
    topics: [
      {
        name: 'Linux Fundamentals',
        subtopics: ['File System Hierarchy', 'Navigation Commands (cd, ls, pwd)', 'File Operations (cp, mv, rm, mkdir)', 'File Permissions (chmod, chown)', 'Users & Groups', 'Process Management (ps, top, kill)', 'Package Managers (apt, yum, dnf)', 'System Services (systemd, systemctl)', 'Cron Jobs & Scheduling', 'Log Files & Journalctl'],
        priority: 'essential'
      },
      {
        name: 'Bash Scripting',
        subtopics: ['Variables & Data Types', 'Conditionals (if/else)', 'Loops (for, while)', 'Functions', 'Input/Output Redirection', 'Pipes & Filters', 'Text Processing (grep, sed, awk)', 'Script Arguments', 'Exit Codes', 'Error Handling'],
        priority: 'essential'
      },
      {
        name: 'Networking Fundamentals',
        subtopics: ['OSI Model (7 Layers)', 'TCP/IP Model', 'IP Addressing & Subnetting', 'DNS (Domain Name System)', 'DHCP', 'HTTP/HTTPS Protocols', 'SSL/TLS Basics', 'Firewalls & Ports', 'Load Balancers', 'VPNs', 'Network Troubleshooting (ping, traceroute, netstat, ss, curl)'],
        priority: 'essential'
      },
      {
        name: 'Git Version Control',
        subtopics: ['Git Basics (init, clone, add, commit)', 'Branching & Merging', 'Remote Repositories', 'Git Flow Workflow', 'Rebasing vs Merging', 'Cherry Picking', 'Stashing Changes', 'Resolving Conflicts', 'Git Hooks', 'Tags & Releases'],
        priority: 'essential'
      },
      {
        name: 'Python for Automation',
        subtopics: ['Python Syntax & Basics', 'Data Types & Structures', 'Control Flow', 'Functions & Modules', 'File Operations', 'Error Handling (try/except)', 'Working with APIs (requests)', 'JSON/YAML Parsing', 'Regular Expressions', 'Virtual Environments (venv, pip)'],
        priority: 'essential'
      },
      {
        name: 'YAML & JSON',
        subtopics: ['YAML Syntax', 'JSON Syntax', 'Data Structures', 'Nested Objects', 'Arrays/Lists', 'Configuration Files', 'Validation'],
        priority: 'important'
      }
    ]
  },
  {
    phase: 2,
    title: 'Phase 2: Cloud Platforms (AWS Focus)',
    duration: '6-8 weeks',
    color: '#f59e0b',
    icon: '☁️',
    description: 'Master cloud infrastructure - AWS is dominant in Saudi market',
    topics: [
      {
        name: 'Cloud Concepts',
        subtopics: ['IaaS vs PaaS vs SaaS', 'Public vs Private vs Hybrid Cloud', 'Regions & Availability Zones', 'High Availability', 'Scalability (Vertical vs Horizontal)', 'Elasticity', 'Fault Tolerance', 'Disaster Recovery', 'Cloud Pricing Models', 'Shared Responsibility Model'],
        priority: 'essential'
      },
      {
        name: 'AWS Identity & Access (IAM)',
        subtopics: ['Users & Groups', 'Policies & Permissions', 'Roles', 'Multi-Factor Authentication (MFA)', 'Access Keys', 'Identity Federation', 'AWS Organizations', 'Service Control Policies', 'Permission Boundaries', 'IAM Best Practices'],
        priority: 'essential'
      },
      {
        name: 'AWS Compute (EC2)',
        subtopics: ['Instance Types & Sizing', 'Amazon Machine Images (AMIs)', 'Key Pairs & SSH Access', 'Security Groups', 'Elastic IPs', 'Instance Storage vs EBS', 'Auto Scaling Groups', 'Launch Templates', 'Spot Instances', 'Reserved Instances'],
        priority: 'essential'
      },
      {
        name: 'AWS Networking (VPC)',
        subtopics: ['VPC Basics', 'Subnets (Public vs Private)', 'Internet Gateway', 'NAT Gateway', 'Route Tables', 'Network ACLs', 'VPC Peering', 'VPC Endpoints', 'Transit Gateway', 'AWS Direct Connect Basics'],
        priority: 'essential'
      },
      {
        name: 'AWS Storage',
        subtopics: ['S3 (Simple Storage Service)', 'S3 Storage Classes', 'S3 Lifecycle Policies', 'S3 Versioning', 'EBS (Elastic Block Store)', 'EBS Volume Types', 'EFS (Elastic File System)', 'S3 Bucket Policies', 'Cross-Region Replication'],
        priority: 'essential'
      },
      {
        name: 'AWS Databases',
        subtopics: ['RDS (Relational Database Service)', 'RDS Multi-AZ', 'Read Replicas', 'Aurora Basics', 'DynamoDB Basics', 'ElastiCache Overview', 'Database Backup & Recovery'],
        priority: 'important'
      },
      {
        name: 'AWS Additional Services',
        subtopics: ['Route 53 (DNS)', 'CloudFront (CDN)', 'Elastic Load Balancer (ALB/NLB)', 'Lambda (Serverless)', 'CloudWatch (Monitoring)', 'CloudTrail (Auditing)', 'SNS & SQS (Messaging)', 'Secrets Manager', 'Systems Manager'],
        priority: 'important'
      },
      {
        name: 'AWS CLI & SDK',
        subtopics: ['AWS CLI Installation', 'CLI Configuration', 'Common CLI Commands', 'AWS SDK (Python boto3)', 'Infrastructure Queries', 'Automation Scripts'],
        priority: 'important'
      },
      {
        name: 'Azure Basics (Secondary)',
        subtopics: ['Azure Resource Manager', 'Virtual Machines', 'Azure VNet', 'Azure Storage', 'Azure Active Directory', 'Azure DevOps Services'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 3,
    title: 'Phase 3: Containerization',
    duration: '4-6 weeks',
    color: '#0ea5e9',
    icon: '🐳',
    description: 'Package and run applications consistently anywhere',
    topics: [
      {
        name: 'Container Concepts',
        subtopics: ['What are Containers?', 'Containers vs Virtual Machines', 'Container Runtime', 'Container Images', 'Image Layers', 'Container Registries', 'Microservices Architecture', '12-Factor App Principles'],
        priority: 'essential'
      },
      {
        name: 'Docker Fundamentals',
        subtopics: ['Docker Installation', 'Docker Architecture', 'Docker CLI Basics', 'Running Containers', 'Container Lifecycle', 'Port Mapping', 'Volume Mounts', 'Environment Variables', 'Container Logs', 'Exec into Containers'],
        priority: 'essential'
      },
      {
        name: 'Docker Images',
        subtopics: ['Dockerfile Syntax', 'Base Images', 'COPY vs ADD', 'RUN Instructions', 'CMD vs ENTRYPOINT', 'Multi-stage Builds', 'Image Optimization', 'Image Tagging', 'Pushing to Registry', '.dockerignore'],
        priority: 'essential'
      },
      {
        name: 'Docker Compose',
        subtopics: ['Compose File Structure', 'Services Definition', 'Networks in Compose', 'Volumes in Compose', 'Environment Files', 'Depends On', 'Health Checks', 'Scaling Services', 'Override Files'],
        priority: 'essential'
      },
      {
        name: 'Container Registries',
        subtopics: ['Docker Hub', 'Amazon ECR', 'Azure Container Registry', 'Private Registries', 'Image Scanning Basics', 'Registry Authentication'],
        priority: 'important'
      },
      {
        name: 'Docker Networking',
        subtopics: ['Bridge Network', 'Host Network', 'None Network', 'Custom Networks', 'Container DNS', 'Network Inspection'],
        priority: 'important'
      }
    ]
  },
  {
    phase: 4,
    title: 'Phase 4: Container Orchestration (Kubernetes)',
    duration: '6-8 weeks',
    color: '#8b5cf6',
    icon: '☸️',
    description: 'Manage containers at scale in production environments',
    topics: [
      {
        name: 'Kubernetes Concepts',
        subtopics: ['Why Kubernetes?', 'K8s Architecture', 'Control Plane Components', 'Worker Node Components', 'Declarative vs Imperative', 'Desired State', 'kubectl CLI'],
        priority: 'essential'
      },
      {
        name: 'Core Workloads',
        subtopics: ['Pods', 'ReplicaSets', 'Deployments', 'StatefulSets', 'DaemonSets', 'Jobs & CronJobs', 'Pod Lifecycle', 'Init Containers', 'Sidecar Containers'],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Networking',
        subtopics: ['Services (ClusterIP, NodePort, LoadBalancer)', 'Ingress Controllers', 'Ingress Resources', 'Network Policies', 'DNS in Kubernetes', 'Service Mesh Concepts'],
        priority: 'essential'
      },
      {
        name: 'Configuration & Storage',
        subtopics: ['ConfigMaps', 'Secrets', 'Persistent Volumes (PV)', 'Persistent Volume Claims (PVC)', 'Storage Classes', 'Volume Types'],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Security',
        subtopics: ['RBAC (Role-Based Access Control)', 'Service Accounts', 'Security Contexts', 'Pod Security Standards', 'Network Policies', 'Secrets Management'],
        priority: 'important'
      },
      {
        name: 'Helm Package Manager',
        subtopics: ['What is Helm?', 'Helm Charts', 'Chart Structure', 'Values Files', 'Helm Repositories', 'Installing Charts', 'Upgrading & Rollback', 'Creating Custom Charts', 'Chart Dependencies'],
        priority: 'important'
      },
      {
        name: 'Managed Kubernetes',
        subtopics: ['Amazon EKS', 'Azure AKS', 'Google GKE', 'EKS Node Groups', 'EKS Add-ons', 'eksctl CLI'],
        priority: 'important'
      },
      {
        name: 'Advanced Concepts',
        subtopics: ['Horizontal Pod Autoscaler (HPA)', 'Vertical Pod Autoscaler', 'Cluster Autoscaler', 'Resource Quotas', 'Limit Ranges', 'Pod Disruption Budgets', 'Taints & Tolerations', 'Node Affinity'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 5,
    title: 'Phase 5: Infrastructure as Code (IaC)',
    duration: '4-6 weeks',
    color: '#ec4899',
    icon: '📝',
    description: 'Define and manage infrastructure through code',
    topics: [
      {
        name: 'IaC Concepts',
        subtopics: ['What is Infrastructure as Code?', 'Benefits of IaC', 'Declarative vs Imperative IaC', 'Immutable Infrastructure', 'Idempotency', 'State Management', 'Drift Detection'],
        priority: 'essential'
      },
      {
        name: 'Terraform Fundamentals',
        subtopics: ['Terraform Architecture', 'HCL Syntax', 'Providers', 'Resources', 'Data Sources', 'Variables', 'Outputs', 'Terraform CLI Commands', 'terraform init/plan/apply/destroy'],
        priority: 'essential'
      },
      {
        name: 'Terraform State',
        subtopics: ['Local State', 'Remote State (S3 Backend)', 'State Locking (DynamoDB)', 'State Commands', 'Import Existing Resources', 'State Migration'],
        priority: 'essential'
      },
      {
        name: 'Terraform Advanced',
        subtopics: ['Modules', 'Module Registry', 'Workspaces', 'Count & For Each', 'Dynamic Blocks', 'Conditional Expressions', 'Local Values', 'Built-in Functions', 'Provisioners'],
        priority: 'important'
      },
      {
        name: 'Terraform Best Practices',
        subtopics: ['Project Structure', 'Naming Conventions', 'Version Constraints', 'Sensitive Data Handling', 'Code Organization', 'Testing Terraform', 'CI/CD Integration'],
        priority: 'important'
      },
      {
        name: 'Ansible Basics',
        subtopics: ['Ansible Architecture', 'Inventory Files', 'Ad-hoc Commands', 'Playbooks', 'Tasks & Handlers', 'Variables & Facts', 'Templates (Jinja2)', 'Roles', 'Ansible Galaxy', 'Ansible Vault'],
        priority: 'important'
      },
      {
        name: 'Configuration Management',
        subtopics: ['Ansible vs Terraform', 'When to Use Each', 'Combining IaC Tools', 'Configuration Drift', 'Desired State Configuration'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 6,
    title: 'Phase 6: CI/CD Pipelines',
    duration: '4-6 weeks',
    color: '#14b8a6',
    icon: '🔄',
    description: 'Automate building, testing, and deploying applications',
    topics: [
      {
        name: 'CI/CD Concepts',
        subtopics: ['Continuous Integration (CI)', 'Continuous Delivery vs Deployment', 'Pipeline Stages', 'Build Automation', 'Automated Testing', 'Deployment Strategies', 'Blue-Green Deployments', 'Canary Releases', 'Rolling Updates', 'Feature Flags'],
        priority: 'essential'
      },
      {
        name: 'Jenkins',
        subtopics: ['Jenkins Installation', 'Jenkins Architecture', 'Freestyle Projects', 'Pipeline as Code (Jenkinsfile)', 'Declarative vs Scripted Pipelines', 'Pipeline Stages & Steps', 'Jenkins Agents', 'Jenkins Plugins', 'Credentials Management', 'Shared Libraries', 'Multibranch Pipelines'],
        priority: 'essential'
      },
      {
        name: 'GitHub Actions',
        subtopics: ['Workflow Files', 'Events & Triggers', 'Jobs & Steps', 'Actions Marketplace', 'Environment Variables', 'Secrets', 'Matrix Builds', 'Reusable Workflows', 'Self-hosted Runners', 'Caching'],
        priority: 'essential'
      },
      {
        name: 'GitLab CI/CD',
        subtopics: ['.gitlab-ci.yml Structure', 'Stages & Jobs', 'Variables', 'Artifacts', 'Caching', 'Runners', 'Environments', 'Review Apps', 'Auto DevOps'],
        priority: 'important'
      },
      {
        name: 'GitOps & ArgoCD',
        subtopics: ['GitOps Principles', 'ArgoCD Installation', 'Application CRD', 'Sync Strategies', 'Rollback', 'App of Apps Pattern', 'Multi-cluster Management'],
        priority: 'important'
      },
      {
        name: 'Artifact Management',
        subtopics: ['Artifact Repositories', 'Nexus Repository', 'JFrog Artifactory', 'Container Registries', 'Versioning Artifacts', 'Artifact Promotion'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 7,
    title: 'Phase 7: Monitoring & Observability',
    duration: '3-4 weeks',
    color: '#f97316',
    icon: '📊',
    description: 'Monitor, log, and trace application and infrastructure health',
    topics: [
      {
        name: 'Observability Concepts',
        subtopics: ['Three Pillars: Metrics, Logs, Traces', 'Monitoring vs Observability', 'SLIs, SLOs, SLAs', 'Error Budgets', 'Mean Time to Recovery (MTTR)', 'Alerting Strategies', 'On-Call Practices'],
        priority: 'essential'
      },
      {
        name: 'Prometheus',
        subtopics: ['Prometheus Architecture', 'Metrics Types (Counter, Gauge, Histogram)', 'PromQL Basics', 'Exporters', 'Service Discovery', 'Recording Rules', 'Alerting Rules', 'AlertManager', 'Prometheus Operator'],
        priority: 'essential'
      },
      {
        name: 'Grafana',
        subtopics: ['Grafana Installation', 'Data Sources', 'Dashboard Creation', 'Panels & Visualizations', 'Variables & Templates', 'Alerting in Grafana', 'Dashboard as Code', 'Grafana Loki Integration'],
        priority: 'essential'
      },
      {
        name: 'Log Management',
        subtopics: ['Centralized Logging', 'ELK Stack Overview', 'Elasticsearch Basics', 'Logstash/Fluentd', 'Kibana Dashboards', 'Grafana Loki', 'Log Aggregation Patterns', 'Log Retention'],
        priority: 'important'
      },
      {
        name: 'Distributed Tracing',
        subtopics: ['Tracing Concepts', 'OpenTelemetry', 'Jaeger Basics', 'Trace Context Propagation', 'Span Analysis'],
        priority: 'recommended'
      },
      {
        name: 'AWS CloudWatch',
        subtopics: ['CloudWatch Metrics', 'CloudWatch Logs', 'CloudWatch Alarms', 'CloudWatch Dashboards', 'Log Insights', 'Container Insights'],
        priority: 'important'
      }
    ]
  },
  {
    phase: 8,
    title: 'Phase 8: DevSecOps - Security Integration',
    duration: '6-8 weeks',
    color: '#ef4444',
    icon: '🔐',
    description: 'Integrate security throughout the entire DevOps lifecycle',
    topics: [
      {
        name: 'DevSecOps Fundamentals',
        subtopics: ['Shift Left Security', 'Security as Code', 'Security in SDLC', 'Threat Modeling', 'OWASP Top 10', 'Defense in Depth', 'Zero Trust Architecture', 'Compliance as Code'],
        priority: 'essential'
      },
      {
        name: 'SAST (Static Application Security Testing)',
        subtopics: ['What is SAST?', 'SonarQube', 'Semgrep', 'Checkmarx', 'CodeQL', 'IDE Security Plugins', 'Pre-commit Hooks', 'Pipeline Integration'],
        priority: 'essential'
      },
      {
        name: 'DAST (Dynamic Application Security Testing)',
        subtopics: ['What is DAST?', 'OWASP ZAP', 'Burp Suite', 'Nikto', 'Testing in CI/CD', 'API Security Testing'],
        priority: 'essential'
      },
      {
        name: 'Container Security',
        subtopics: ['Image Scanning (Trivy, Clair)', 'Base Image Security', 'Dockerfile Best Practices', 'Runtime Security (Falco)', 'Container Hardening', 'Distroless Images', 'Image Signing', 'Admission Controllers'],
        priority: 'essential'
      },
      {
        name: 'Kubernetes Security',
        subtopics: ['Pod Security Standards', 'OPA/Gatekeeper', 'Kyverno Policies', 'Network Policies', 'Secrets Encryption', 'Audit Logging', 'Service Mesh Security', 'Kubernetes CIS Benchmarks'],
        priority: 'essential'
      },
      {
        name: 'Secrets Management',
        subtopics: ['HashiCorp Vault', 'Vault Architecture', 'Secret Engines', 'Dynamic Secrets', 'AWS Secrets Manager', 'Azure Key Vault', 'External Secrets Operator', 'Sealed Secrets'],
        priority: 'essential'
      },
      {
        name: 'Infrastructure Security',
        subtopics: ['IaC Security Scanning (tfsec, Checkov)', 'Cloud Security Posture (CSPM)', 'AWS Security Hub', 'Terraform Sentinel', 'Compliance Scanning', 'CIS Benchmarks'],
        priority: 'important'
      },
      {
        name: 'Dependency & Supply Chain Security',
        subtopics: ['SCA (Software Composition Analysis)', 'Snyk', 'Dependabot', 'SBOM (Software Bill of Materials)', 'Dependency Scanning', 'License Compliance', 'Supply Chain Attacks'],
        priority: 'important'
      },
      {
        name: 'Security Monitoring & Response',
        subtopics: ['Security Information & Event Management (SIEM)', 'Intrusion Detection', 'Incident Response', 'Security Dashboards', 'Compliance Reporting', 'Vulnerability Management'],
        priority: 'important'
      },
      {
        name: 'Compliance & Governance',
        subtopics: ['SOC 2', 'ISO 27001', 'PCI DSS Basics', 'GDPR Considerations', 'Saudi NDMO Compliance', 'Audit Trails', 'Policy Enforcement'],
        priority: 'recommended'
      }
    ]
  },
  {
    phase: 9,
    title: 'Phase 9: Certifications & Job Preparation',
    duration: '4-8 weeks',
    color: '#84cc16',
    icon: '🎓',
    description: 'Validate your skills and prepare for the Saudi job market',
    topics: [
      {
        name: 'Priority Certifications',
        subtopics: ['AWS Solutions Architect Associate (SAA-C03)', 'Certified Kubernetes Administrator (CKA)', 'HashiCorp Terraform Associate', 'AWS DevOps Professional (Optional)', 'Azure Administrator AZ-104 (Optional)'],
        priority: 'essential'
      },
      {
        name: 'Hands-on Projects Portfolio',
        subtopics: ['End-to-End CI/CD Pipeline Project', 'Kubernetes Deployment Project', 'Infrastructure as Code Project', 'Security Scanning Pipeline', 'Monitoring Stack Deployment', 'GitHub Portfolio Preparation'],
        priority: 'essential'
      },
      {
        name: 'Saudi Market Preparation',
        subtopics: ['CV Optimization for ATS', 'LinkedIn Profile Update', 'DevSecOps-focused CV Version', 'Saudi Aramco Compliance Knowledge', 'Vision 2030 Alignment', 'Networking in Saudi Tech Community'],
        priority: 'important'
      }
    ]
  }
]

export const totalDuration = '8-12 months (accelerated: 5-7 months with your background)'
