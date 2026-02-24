/**
 * AWS Cloud & Security Career Path Roadmap Data
 * ==============================================
 * Structured roadmap data for the AWS Cloud & Security Career Path.
 * Maps to 5 AWS certifications progressing from foundational to specialty:
 *
 * 1. Cloud Practitioner (CLF-C02)
 * 2. CloudOps Engineer (SOA-C03)
 * 3. DevOps Engineer Professional (DOP-C02)
 * 4. Security Specialty (SCS-C03)
 * 5. Advanced Networking Specialty (ANS-C01)
 *
 * Statistics: 5 phases, 34 topics, ~244 subtopics, 32 weeks total
 */

import type { Phase } from './roadmap'

export const awsPhases: Phase[] = [
  // =============================================================================
  // Phase 1: AWS Cloud Practitioner (CLF-C02)
  // =============================================================================
  {
    phase: 1,
    title: 'Phase 1: AWS Cloud Practitioner (CLF-C02)',
    slug: 'phase-1-cloud-practitioner',
    duration: '4 weeks',
    color: '#14b8a6',
    icon: 'AWS1',
    description: 'Build your cloud foundation and earn the AWS Cloud Practitioner certification',
    topics: [
      {
        name: 'Cloud Computing Concepts',
        slug: 'cloud-computing-concepts',
        subtopics: [
          'Cloud Computing Definition & Benefits',
          'Types of Cloud Computing (IaaS PaaS SaaS)',
          'Cloud Deployment Models (Public Private Hybrid Multi-Cloud)',
          'AWS Global Infrastructure (Regions AZs Edge Locations)',
          'Well-Architected Framework Overview',
          'Cloud Economics & Total Cost of Ownership',
          'High Availability & Fault Tolerance Concepts'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Security & Compliance Foundations',
        slug: 'security-compliance-foundations',
        subtopics: [
          'Shared Responsibility Model',
          'AWS Identity & Access Management (IAM) Basics',
          'IAM Users Groups Roles & Policies',
          'Multi-Factor Authentication (MFA)',
          'AWS Organizations & Consolidated Billing',
          'AWS Compliance Programs (SOC ISO PCI)',
          'Data Protection & Encryption Basics',
          'AWS Artifact for Compliance Reports'
        ],
        priority: 'essential'
      },
      {
        name: 'AWS Core Services',
        slug: 'aws-core-services',
        subtopics: [
          'Amazon EC2 Instance Types & Use Cases',
          'Amazon S3 Storage Classes & Features',
          'Amazon VPC & Networking Basics',
          'Amazon RDS & Database Options',
          'AWS Lambda & Serverless Concepts',
          'Elastic Load Balancing & Auto Scaling',
          'Amazon CloudFront & Edge Services',
          'Amazon Route 53 DNS Basics'
        ],
        priority: 'essential'
      },
      {
        name: 'Additional AWS Services',
        slug: 'additional-aws-services',
        subtopics: [
          'Amazon SQS SNS & EventBridge',
          'AWS Step Functions & Application Integration',
          'Amazon ECS & EKS Container Services',
          'AWS CloudFormation Basics',
          'Amazon CloudWatch Monitoring',
          'AWS CloudTrail Auditing',
          'AWS Systems Manager Overview',
          'Amazon DynamoDB Basics'
        ],
        priority: 'important'
      },
      {
        name: 'Billing Pricing & Support',
        slug: 'billing-pricing-support',
        subtopics: [
          'AWS Pricing Models (On-Demand Reserved Spot Savings Plans)',
          'AWS Free Tier',
          'AWS Pricing Calculator',
          'AWS Cost Explorer & Budgets',
          'AWS Support Plans (Basic Developer Business Enterprise)',
          'AWS Trusted Advisor',
          'AWS Service Quotas',
          'Consolidated Billing & Cost Allocation Tags'
        ],
        priority: 'important'
      },
      {
        name: 'Cloud Migration & Innovation',
        slug: 'cloud-migration-innovation',
        subtopics: [
          'AWS Cloud Adoption Framework (CAF)',
          'Migration Strategies (6 Rs)',
          'AWS Migration Hub',
          'AWS Snow Family',
          'AWS Outposts & Hybrid Solutions',
          'Machine Learning & AI Services Overview'
        ],
        priority: 'recommended'
      },
      {
        name: 'Exam Preparation: Cloud Practitioner',
        slug: 'exam-preparation-cloud-practitioner',
        subtopics: [
          'CLF-C02 Exam Format & Strategy',
          'Practice Questions: Cloud Concepts',
          'Practice Questions: Security & Compliance',
          'Practice Questions: Cloud Technology & Services',
          'Practice Questions: Billing & Support',
          'Full Practice Exam: Cloud Practitioner'
        ],
        priority: 'essential'
      }
    ]
  },

  // =============================================================================
  // Phase 2: AWS CloudOps Engineer (SOA-C03)
  // =============================================================================
  {
    phase: 2,
    title: 'Phase 2: AWS CloudOps Engineer (SOA-C03)',
    slug: 'phase-2-cloudops-engineer',
    duration: '6 weeks',
    color: '#f97316',
    icon: 'AWS2',
    description: 'Master AWS operations, monitoring, and automation for the SysOps Administrator certification',
    topics: [
      {
        name: 'Monitoring Logging & Remediation',
        slug: 'monitoring-logging-remediation',
        subtopics: [
          'Amazon CloudWatch Metrics & Alarms',
          'CloudWatch Logs & Log Insights',
          'CloudWatch Dashboards & Anomaly Detection',
          'AWS X-Ray for Distributed Tracing',
          'Amazon EventBridge for Event-Driven Automation',
          'Automated Remediation with AWS Config Rules',
          'Performance Optimization Strategies',
          'Troubleshooting EC2 RDS & Lambda Issues'
        ],
        priority: 'essential'
      },
      {
        name: 'Reliability & Business Continuity',
        slug: 'reliability-business-continuity',
        subtopics: [
          'Multi-AZ & Multi-Region Architectures',
          'AWS Backup & Recovery Strategies',
          'RDS Automated Backups & Snapshots',
          'S3 Cross-Region Replication',
          'EC2 Auto Scaling Policies & Strategies',
          'Elastic Load Balancer Health Checks',
          'Route 53 Failover Routing',
          'Disaster Recovery Patterns (Pilot Light Warm Standby Active-Active)'
        ],
        priority: 'essential'
      },
      {
        name: 'Deployment & Provisioning',
        slug: 'deployment-provisioning',
        subtopics: [
          'AWS CloudFormation Templates & Stacks',
          'CloudFormation Stack Sets & Drift Detection',
          'AWS Systems Manager Automation',
          'EC2 Image Builder & AMI Management',
          'AWS Elastic Beanstalk Deployments',
          'Blue-Green & Rolling Deployment Strategies',
          'AWS OpsWorks & Configuration Management',
          'Launch Templates & Auto Scaling Groups'
        ],
        priority: 'essential'
      },
      {
        name: 'Security & Compliance for Operations',
        slug: 'security-compliance-operations',
        subtopics: [
          'IAM Policies & Permission Boundaries',
          'AWS Security Hub & Findings',
          'AWS Config for Compliance Monitoring',
          'AWS Systems Manager Parameter Store & Secrets Manager',
          'VPC Security Groups & Network ACLs',
          'SSL/TLS Certificate Management with ACM',
          'AWS GuardDuty Threat Detection',
          'CloudTrail Log Analysis for Security Events'
        ],
        priority: 'important'
      },
      {
        name: 'Networking & Content Delivery',
        slug: 'networking-content-delivery',
        subtopics: [
          'VPC Design & Subnet Architecture',
          'VPC Peering & Transit Gateway',
          'NAT Gateway & VPC Endpoints',
          'Route 53 Routing Policies (Simple Weighted Latency Geolocation)',
          'CloudFront Distributions & Cache Behaviors',
          'AWS Global Accelerator',
          'Network Troubleshooting Tools & Techniques'
        ],
        priority: 'important'
      },
      {
        name: 'Automation & Scripting for Operations',
        slug: 'automation-scripting-operations',
        subtopics: [
          'AWS CLI Advanced Usage',
          'AWS SDK for Python (Boto3)',
          'AWS Lambda for Operational Tasks',
          'AWS Systems Manager Run Command',
          'EventBridge Scheduled Rules',
          'CloudFormation Custom Resources'
        ],
        priority: 'important'
      },
      {
        name: 'Exam Preparation: CloudOps Engineer',
        slug: 'exam-preparation-cloudops-engineer',
        subtopics: [
          'SOA-C03 Exam Format & Strategy',
          'Practice Questions: Monitoring & Remediation',
          'Practice Questions: Reliability & Business Continuity',
          'Practice Questions: Deployment & Automation',
          'Practice Questions: Security & Compliance',
          'Practice Questions: Networking & Content Delivery',
          'Full Practice Exam: CloudOps Engineer'
        ],
        priority: 'essential'
      }
    ]
  },

  // =============================================================================
  // Phase 3: AWS DevOps Engineer Professional (DOP-C02)
  // =============================================================================
  {
    phase: 3,
    title: 'Phase 3: AWS DevOps Engineer Professional (DOP-C02)',
    slug: 'phase-3-devops-professional',
    duration: '8 weeks',
    color: '#8b5cf6',
    icon: 'AWS3',
    description: 'Advance to professional-level DevOps practices on AWS with CI/CD and IaC mastery',
    topics: [
      {
        name: 'SDLC Automation',
        slug: 'sdlc-automation',
        subtopics: [
          'AWS CodeCommit & Source Control',
          'AWS CodeBuild & Build Specifications',
          'AWS CodeDeploy Deployment Strategies',
          'AWS CodePipeline Orchestration',
          'Testing Automation in CI/CD Pipelines',
          'Multi-Region & Multi-Account Deployment Patterns',
          'Pipeline Notifications & Approval Actions',
          'Artifact Management with S3 & CodeArtifact'
        ],
        priority: 'essential'
      },
      {
        name: 'Configuration Management & IaC',
        slug: 'configuration-management-iac',
        subtopics: [
          'CloudFormation Advanced (Nested Stacks Macros Custom Resources)',
          'AWS CDK Infrastructure as Code',
          'Terraform with AWS Provider',
          'AWS Service Catalog for Standardized Provisioning',
          'AWS Systems Manager State Manager',
          'Configuration Compliance & Drift Management',
          'Tagging Strategies & Resource Organization'
        ],
        priority: 'essential'
      },
      {
        name: 'Resilient Cloud Solutions',
        slug: 'resilient-cloud-solutions',
        subtopics: [
          'Multi-AZ & Multi-Region Application Architectures',
          'Auto Scaling with Predictive & Dynamic Policies',
          'Amazon Aurora Global Databases',
          'DynamoDB Global Tables',
          'S3 Intelligent Tiering & Lifecycle Policies',
          'Fault Injection Testing with AWS FIS',
          'Chaos Engineering Principles on AWS'
        ],
        priority: 'important'
      },
      {
        name: 'Monitoring & Logging at Scale',
        slug: 'monitoring-logging-at-scale',
        subtopics: [
          'CloudWatch Embedded Metrics & Custom Metrics',
          'Centralized Logging with CloudWatch Logs & S3',
          'Kinesis Data Firehose for Log Aggregation',
          'AWS X-Ray Service Maps & Trace Analysis',
          'Composite Alarms & Anomaly Detection',
          'Operational Dashboards & Runbooks'
        ],
        priority: 'important'
      },
      {
        name: 'Incident & Event Response',
        slug: 'incident-event-response',
        subtopics: [
          'EventBridge Advanced Patterns',
          'AWS Health Dashboard & Notifications',
          'Automated Incident Response with Lambda',
          'AWS Systems Manager Incident Manager',
          'Runbook Automation for Common Failures',
          'Post-Incident Analysis & Improvement'
        ],
        priority: 'important'
      },
      {
        name: 'Security & Compliance in DevOps',
        slug: 'security-compliance-devops',
        subtopics: [
          'Security Automation in CI/CD Pipelines',
          'AWS CodeGuru for Code Quality & Security',
          'Secrets Rotation with Secrets Manager',
          'IAM Roles for Cross-Account Deployments',
          'AWS Config Advanced Rules & Conformance Packs',
          'Container Security Scanning in Pipelines',
          'Compliance as Code with AWS Config'
        ],
        priority: 'essential'
      },
      {
        name: 'Exam Preparation: DevOps Professional',
        slug: 'exam-preparation-devops-professional',
        subtopics: [
          'DOP-C02 Exam Format & Strategy',
          'Practice Questions: SDLC Automation',
          'Practice Questions: Config Management & IaC',
          'Practice Questions: Resilient Cloud Solutions',
          'Practice Questions: Monitoring & Logging',
          'Practice Questions: Incident & Event Response',
          'Practice Questions: Security & Compliance',
          'Full Practice Exam: DevOps Professional'
        ],
        priority: 'essential'
      }
    ]
  },

  // =============================================================================
  // Phase 4: AWS Security Specialty (SCS-C03)
  // =============================================================================
  {
    phase: 4,
    title: 'Phase 4: AWS Security Specialty (SCS-C03)',
    slug: 'phase-4-security-specialty',
    duration: '8 weeks',
    color: '#ef4444',
    icon: 'AWS4',
    description: 'Specialize in AWS security with identity management, data protection, and incident response',
    topics: [
      {
        name: 'Identity & Access Management',
        slug: 'identity-access-management',
        subtopics: [
          'IAM Advanced Policies (Conditions Variables Policy Evaluation Logic)',
          'Permission Boundaries & SCPs',
          'AWS IAM Identity Center (SSO)',
          'Federation with SAML & OIDC',
          'Cross-Account Access Patterns',
          'IAM Access Analyzer',
          'Attribute-Based Access Control (ABAC)',
          'Least Privilege Enforcement Strategies'
        ],
        priority: 'essential'
      },
      {
        name: 'Infrastructure Security',
        slug: 'infrastructure-security',
        subtopics: [
          'VPC Advanced Security (Security Groups NACLs Flow Logs)',
          'AWS WAF Rules & Web ACLs',
          'AWS Shield Standard & Advanced',
          'AWS Network Firewall',
          'AWS PrivateLink & VPC Endpoints',
          'CloudFront Security (OAI/OAC Field-Level Encryption)',
          'EC2 Instance Security (IMDSv2 Nitro Enclaves)',
          'Container Security on ECS & EKS'
        ],
        priority: 'essential'
      },
      {
        name: 'Data Protection',
        slug: 'data-protection',
        subtopics: [
          'AWS KMS Key Management & Policies',
          'KMS Key Rotation & Cross-Region Keys',
          'S3 Encryption (SSE-S3 SSE-KMS SSE-C Client-Side)',
          'RDS & DynamoDB Encryption at Rest',
          'Data in Transit Protection (TLS VPN Direct Connect)',
          'AWS Certificate Manager (ACM)',
          'AWS CloudHSM for Hardware Security',
          'Secrets Manager & Parameter Store for Sensitive Data'
        ],
        priority: 'essential'
      },
      {
        name: 'Threat Detection & Monitoring',
        slug: 'threat-detection-monitoring',
        subtopics: [
          'Amazon GuardDuty Findings & Threat Intelligence',
          'AWS Security Hub Aggregation & Standards',
          'Amazon Detective for Investigation',
          'VPC Flow Logs Analysis',
          'CloudTrail Advanced (Organization Trails Insights)',
          'Amazon Macie for Sensitive Data Discovery',
          'AWS Config Rules for Security Compliance'
        ],
        priority: 'important'
      },
      {
        name: 'Incident Response',
        slug: 'incident-response',
        subtopics: [
          'Incident Response Frameworks on AWS',
          'Automated Response with EventBridge & Lambda',
          'AWS Step Functions for Orchestrated Response',
          'Forensic Analysis on EC2 (Isolation Snapshots Memory Capture)',
          'Compromised IAM Credentials Response',
          'Container Incident Response Procedures',
          'Post-Incident Reporting & Lessons Learned'
        ],
        priority: 'important'
      },
      {
        name: 'Security Foundations & Governance',
        slug: 'security-foundations-governance',
        subtopics: [
          'AWS Control Tower & Landing Zones',
          'AWS Organizations Security Policies',
          'AWS Audit Manager for Compliance',
          'Multi-Account Security Architecture',
          'Security Reference Architectures',
          'AWS Well-Architected Security Pillar',
          'Regulatory Compliance Frameworks (SOC 2 PCI-DSS HIPAA)'
        ],
        priority: 'important'
      },
      {
        name: 'Exam Preparation: Security Specialty',
        slug: 'exam-preparation-security-specialty',
        subtopics: [
          'SCS-C03 Exam Format & Strategy',
          'Practice Questions: IAM',
          'Practice Questions: Infrastructure Security',
          'Practice Questions: Data Protection',
          'Practice Questions: Detection',
          'Practice Questions: Incident Response',
          'Practice Questions: Security Governance',
          'Full Practice Exam: Security Specialty'
        ],
        priority: 'essential'
      }
    ]
  },

  // =============================================================================
  // Phase 5: AWS Advanced Networking Specialty (ANS-C01)
  // =============================================================================
  {
    phase: 5,
    title: 'Phase 5: AWS Advanced Networking Specialty (ANS-C01)',
    slug: 'phase-5-advanced-networking',
    duration: '6 weeks',
    color: '#3b82f6',
    icon: 'AWS5',
    description: 'Master advanced AWS networking with VPC design, hybrid connectivity, and edge services',
    topics: [
      {
        name: 'Network Design',
        slug: 'network-design',
        subtopics: [
          'Multi-VPC Architectures & Connectivity',
          'AWS Transit Gateway Design Patterns',
          'Hybrid Connectivity Design (Site-to-Site VPN Direct Connect)',
          'Multi-Region Network Architectures',
          'IP Address Planning & CIDR Management',
          'Network Segmentation Strategies',
          'High Availability Network Design',
          'DNS Architecture with Route 53 (Private Hosted Zones Resolver)'
        ],
        priority: 'essential'
      },
      {
        name: 'Network Implementation',
        slug: 'network-implementation',
        subtopics: [
          'VPC Advanced Configuration (Secondary CIDRs IPv6)',
          'Transit Gateway Implementation & Route Tables',
          'AWS Direct Connect Setup & Virtual Interfaces',
          'Site-to-Site VPN Configuration & Troubleshooting',
          'VPC Peering & PrivateLink Implementation',
          'Route 53 Advanced Routing (Failover Geoproximity Multivalue)',
          'Elastic Load Balancer Advanced Features (ALB NLB GWLB)'
        ],
        priority: 'essential'
      },
      {
        name: 'Network Management & Operations',
        slug: 'network-management-operations',
        subtopics: [
          'VPC Flow Logs Analysis & Troubleshooting',
          'Network Performance Monitoring with CloudWatch',
          'AWS Transit Gateway Network Manager',
          'Reachability Analyzer & Network Access Analyzer',
          'Route 53 Health Checks & DNS Failover',
          'CloudFront Real-Time Logs & Monitoring',
          'Network Automation with CloudFormation & Terraform'
        ],
        priority: 'important'
      },
      {
        name: 'Network Security & Compliance',
        slug: 'network-security-compliance',
        subtopics: [
          'AWS Network Firewall Rules & Policies',
          'AWS WAF Advanced Rules & Rate Limiting',
          'DDoS Protection with AWS Shield Advanced',
          'VPC Security Group & NACL Best Practices',
          'TLS Termination & Certificate Management',
          'VPN Encryption & IPSec Tunnels',
          'Network Logging for Compliance & Auditing',
          'AWS PrivateLink for Secure Service Access'
        ],
        priority: 'essential'
      },
      {
        name: 'Content Delivery & Edge Networking',
        slug: 'content-delivery-edge-networking',
        subtopics: [
          'CloudFront Advanced Distribution Configuration',
          'Lambda@Edge & CloudFront Functions',
          'CloudFront Origin Failover & Origin Shield',
          'AWS Global Accelerator for Performance',
          'Amazon CloudFront Security Best Practices',
          'Edge Location Optimization Strategies'
        ],
        priority: 'important'
      },
      {
        name: 'Exam Preparation: Advanced Networking',
        slug: 'exam-preparation-advanced-networking',
        subtopics: [
          'ANS-C01 Exam Format & Strategy',
          'Practice Questions: Network Design',
          'Practice Questions: Network Implementation',
          'Practice Questions: Network Management',
          'Practice Questions: Network Security',
          'Full Practice Exam: Advanced Networking'
        ],
        priority: 'essential'
      }
    ]
  }
]
