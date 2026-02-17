---
title: "Waterfall & V-Model"
description: "Learn how the Waterfall and V-Model organize software projects into sequential phases with structured validation."
estimatedMinutes: 14
difficulty: beginner
learningObjectives:
  - "Understand what the Waterfall Model is and how its phases flow"
  - "Identify the six phases of the Waterfall Model"
  - "Explain how the V-Model extends Waterfall with verification and validation"
  - "Compare the strengths and weaknesses of both models"
  - "Recognize when sequential models are a good fit for a project"
prerequisites:
  - "sdlc-models"
quiz:
  passingScore: 70
  questions:
    - question: "What is the main characteristic of the Waterfall Model?"
      type: single
      options:
        - "Phases flow in one direction with no overlap"
        - "Teams work on all phases at the same time"
        - "Requirements change freely throughout the project"
        - "Testing happens before design"
      correctAnswer: "Phases flow in one direction with no overlap"
      explanation: "The Waterfall Model is called 'waterfall' because each phase flows down to the next in a single direction. You must finish one phase before starting the next."

    - question: "How does the V-Model improve on plain Waterfall?"
      type: single
      options:
        - "It removes the need for documentation"
        - "It pairs each development phase with a matching test phase"
        - "It allows teams to skip the design phase"
        - "It replaces coding with automated generation"
      correctAnswer: "It pairs each development phase with a matching test phase"
      explanation: "The V-Model maps each left-side development phase to a right-side testing phase. This means you plan your tests during design, not after coding is done."

    - question: "Select all situations where sequential models like Waterfall or V-Model work well."
      type: multiple
      options:
        - "Requirements are clear and unlikely to change"
        - "The team needs to respond to daily user feedback"
        - "Regulatory compliance demands detailed documentation"
        - "The technology and domain are well understood"
      correctAnswers:
        - "Requirements are clear and unlikely to change"
        - "Regulatory compliance demands detailed documentation"
        - "The technology and domain are well understood"
      explanation: "Sequential models work best when requirements are stable, documentation matters, and the team knows the technology. They do not handle rapid feedback well."

    - question: "In the V-Model, unit tests are planned during the requirements gathering phase."
      type: true-false
      correctAnswer: false
      explanation: "This is false. In the V-Model, unit tests map to the detailed design phase, not requirements. Acceptance tests are the ones that map to requirements. Each test level matches its corresponding design level."

    - question: "What is a key disadvantage shared by both Waterfall and V-Model?"
      type: single
      options:
        - "They produce too little documentation"
        - "They are too flexible and lack structure"
        - "Changes discovered late are expensive to fix"
        - "They require daily stand-up meetings"
      correctAnswer: "Changes discovered late are expensive to fix"
      explanation: "Both models move in a forward direction. If you find a problem or a changed requirement late in the process, going back is costly. This is the main criticism of all sequential models."
---

# Waterfall & V-Model

The Waterfall Model and the V-Model are two of the oldest ways to organize software projects. Both follow a sequential path -- you finish one phase before starting the next. They bring order and predictability to projects where requirements are clear from the start.

As a DevOps architect, you will meet these models in regulated industries, government projects, and legacy organizations. Understanding them helps you choose the right process for each situation and recognize when a more iterative approach is needed.

## What is the Waterfall Model?

The Waterfall Model is a **linear and sequential** approach to software development. Each phase must finish before the next one begins. There is no overlap, and going back to a previous phase is difficult and expensive.

Think of building a bridge. You would not pour concrete before finishing the structural design. The Waterfall Model applies the same strict order to software projects.

Winston Royce described this approach in his 1970 paper. Each phase produces documents that serve as the input for the next phase.

## The Six Phases of Waterfall

::illustration-linear-flow
---
steps:
  - label: Requirements
    sublabel: Gather needs
    icon: "\U0001F4CB"
    color: violet
  - label: Design
    sublabel: Plan solution
    icon: "\U0001F3D7\uFE0F"
    color: blue
  - label: Implementation
    sublabel: Write code
    icon: "\U0001F4BB"
    color: cyan
  - label: Testing
    sublabel: Find bugs
    icon: "\U0001F50D"
    color: amber
  - label: Deployment
    sublabel: Go live
    icon: "\U0001F680"
    color: emerald
  - label: Maintenance
    sublabel: Fix & improve
    icon: "\U0001F527"
    color: gray
size: full
---
::

1. **Requirements** -- Gather and document everything the software needs to do. Talk to users, stakeholders, and business experts. The output is a detailed requirements specification.

2. **Design** -- Plan how to build the system. Choose technologies, design the database, and define how parts connect. This produces architecture and design documents.

3. **Implementation** -- Developers write the code based on the design documents. Teams often split work into modules built by different programmers.

4. **Testing** -- Testers check that the software meets all requirements. Bugs go back to developers for fixing. This phase covers integration, system, and acceptance tests.

5. **Deployment** -- The tested software goes live. This includes installation, data migration, and user training.

6. **Maintenance** -- Fix bugs users find, make small improvements, and keep the system running. This phase can last for years.

## What is the V-Model?

The V-Model (Verification and Validation Model) builds on Waterfall by adding a clear testing strategy. Instead of a straight line, the process forms a **V shape**. The left side goes down through design phases. The right side goes up through matching test phases.

The key idea: **you plan your tests while you design, not after you code**. Each design phase on the left maps to a test phase on the right.

::illustration-comparison-map
---
leftTitle: Design Phases
rightTitle: Test Phases
leftColor: blue
rightColor: emerald
connections:
  - left: Requirements
    right: Acceptance Testing
    icon: "\U0001F3AF"
  - left: System Design
    right: System Testing
    icon: "\U0001F5A5\uFE0F"
  - left: Architecture Design
    right: Integration Testing
    icon: "\U0001F517"
  - left: Detailed Design
    right: Unit Testing
    icon: "\U0001F9E9"
footnote: Each design phase maps to a corresponding test phase
---
::

### How the Mapping Works

| Design Phase (Left) | Creates | Test Phase (Right) |
|---|---|---|
| Requirements | Acceptance criteria | Acceptance Testing |
| System Design | System test plan | System Testing |
| Architecture Design | Integration test plan | Integration Testing |
| Detailed Design | Unit test cases | Unit Testing |

At the bottom of the V sits **Implementation** (coding). After coding, you move up the right side, running each planned test level.

## Why the V-Model Matters for Architects

The V-Model teaches an important lesson: **think about validation early**. When you write requirements, also define how you will prove those requirements are met. When you design components, also plan how you will test those components work together.

This habit of pairing design decisions with test strategies is valuable in any methodology, even Agile and DevOps.

## When Sequential Models Fit

::illustration-checklist
---
title: Good Fit for Waterfall / V-Model
items:
  - text: Requirements are clear and stable
    icon: "\U00002705"
  - text: Regulatory compliance needs full documentation
    icon: "\U0001F4DC"
  - text: Technology and domain are well understood
    icon: "\U0001F9E0"
  - text: Project has fixed scope, budget, and deadline
    icon: "\U0001F4C5"
  - text: Safety-critical systems need formal verification
    icon: "\U0001F6E1\uFE0F"
note: Sequential models fit projects where surprises are unlikely and traceability matters
color: emerald
size: 2xl
---
::

**Real-world examples:**

- Medical device software (FDA regulations demand documented phases)
- Aerospace and defense systems (safety-critical, formal verification)
- Government contracts with fixed requirements
- Database migrations with a clear start and end state

## Advantages and Disadvantages

### Advantages

- **Easy to understand** -- The linear flow is simple to explain and manage
- **Clear milestones** -- Each phase ends with a deliverable you can review
- **Strong documentation** -- Detailed records help auditors, new team members, and future maintenance
- **Early test planning (V-Model)** -- Test plans exist before a single line of code is written

### Disadvantages

- **Inflexible** -- Going back to change earlier decisions is expensive
- **Late feedback** -- Users see working software only at the end
- **Risk of misunderstanding** -- Wrong requirements discovered late cost the most to fix
- **Long delivery time** -- No working software until the full cycle completes

## Waterfall & V-Model vs. Iterative Approaches

Modern teams often prefer iterative methods like Agile because they deliver working software in small increments. Users give feedback early and often, which reduces the risk of building the wrong thing.

However, sequential models still have their place. Some projects genuinely need detailed upfront planning. Some industries require phase-gate sign-offs before any coding begins. A skilled architect knows when to pick each approach -- or when to blend them.

## Common Mistakes to Avoid

1. **Using Waterfall when requirements are unclear** -- If stakeholders cannot define what they need upfront, a sequential model will lead to expensive rework later.

2. **Skipping test planning in the V-Model** -- The whole point of the V-Model is early test planning. If you write test plans only after coding, you lose the model's main benefit.

3. **Treating all projects the same** -- Not every project fits one model. Choose based on the project's stability, risk, and regulatory needs.

## Key Takeaways

- The Waterfall Model is a linear, sequential approach where each phase completes before the next begins
- The V-Model extends Waterfall by pairing each design phase with a matching test phase
- Both models work best when requirements are stable and documentation is important
- Their main weakness is inflexibility -- late changes are costly
- The V-Model's lesson of early test planning is valuable in any methodology
- As an architect, knowing these models helps you pick the right process for each project's constraints
