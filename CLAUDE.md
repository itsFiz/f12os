# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository (`f12os`) contains strategic planning and narrative documentation for personal and business projects, primarily focused on:

- **Life of Fiz**: A YouTube creator brand strategy inspired by cinematic vlogging
- **Brozkey LevelUp**: A barbering platform SaaS business plan
- Long-term vision boards and financial planning documents

The primary artifact is `narrative.md` (6800+ lines), which serves as a comprehensive strategic blueprint combining:
- Content creation strategy and brand positioning
- Technical infrastructure planning
- Business roadmaps and financial projections
- Personal development goals and vision boards

## Key Document Structure

### narrative.md Sections

The narrative document is organized into major sections covering:

1. **Content Strategy** (Lines 1-4500): Analysis of successful creator channels like "Life of Riza", brand positioning for "Life of Fiz", including visual language (cinematic techniques, halation effects, pacing), narrative frameworks, and audience building strategies.

2. **Technical Infrastructure** (Lines 4500-4700): Complete technology stack for the Brozkey platform:
   - Frontend: Next.js + TypeScript, Tailwind CSS, shadcn/ui
   - Backend: Next.js API Routes / Go microservices, Prisma ORM
   - Database: PostgreSQL on Railway
   - Storage: Cloudflare R2
   - Auth: Auth.js or Clerk
   - Payments: Stripe
   - Monitoring: Sentry, PostHog
   - Maps: Google Maps API

3. **Vision Boards** (Lines 4700-6834): Multi-year financial and personal goals organized by timeframes (2025, 2028, 2030, 2035, 2045+) across Professional, Financial, Lifestyle, and Personal Growth categories.

## Working with This Repository

### Document Navigation

Given the large size of narrative.md (>500KB), use these approaches:

```bash
# Search for specific topics
grep -i "brozkey\|life of fiz\|tech stack" narrative.md

# Find section headers
grep "^##" narrative.md

# Extract specific line ranges
sed -n '4500,4700p' narrative.md  # Technical infrastructure section
```

### Key Topics & Line References

- Creator brand strategy: Lines 1-100
- Visual/cinematic techniques: Lines 15-75
- Brozkey tech stack: Lines 4573-4677
- Infrastructure tools: Lines 4625-4664
- Financial projections: Lines 4789-4815
- Vision boards by year: Lines 4867-6834

### Editing Guidelines

When updating strategic documents:
- Maintain the existing organizational structure (numbered sections, strategic pillars)
- Keep technical stack recommendations current and aligned across sections
- Preserve financial projections formatting for easy tracking
- Vision board entries should follow the 4-part structure: Professional/Business, Financial/Investments, Lifestyle/Possessions, Personal Growth

### Context for AI Tools

The narrative mentions heavy use of AI coding assistants:
- Claude Code for code generation
- Cursor for bug fixes

This suggests a workflow where Claude Code would be used to scaffold and build features based on the technical specifications outlined in narrative.md (particularly the Brozkey stack).
