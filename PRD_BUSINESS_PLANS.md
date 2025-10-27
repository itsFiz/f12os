# Product Requirements Document: Business Plan Management System
## F12OS - Business Planning Module

---

## Document Control

| Attribute | Detail |
|-----------|--------|
| **Product Name** | F12 Business Plan Master System |
| **Module Route** | `/plans` |
| **Owner** | Hafiz "Fiz" Kadir |
| **Target Audience** | F12 Holdings Founder, C-Suite Executives, Venture CEOs, Investors |
| **Created** | 2025-01-22 |
| **Version** | 1.0 |
| **Status** | Planning Phase (2025 Execution) |

---

## 1. Executive Summary

### 1.1 Vision
Create a centralized, structured business planning system that transforms the strategic insights from narrative.md into actionable, measurable, and investor-ready business plans for all 12 F12 Holdings ventures.

### 1.2 Success Metrics
- **Strategic Clarity**: Every venture has a complete, up-to-date business plan by Q2 2025
- **Collaboration**: 3+ executives can simultaneously work on plans without conflicts
- **Investor Readiness**: Export pitch-ready documents in under 2 minutes
- **Accountability**: Plans drive weekly OKR reviews and quarterly strategy updates

### 1.3 Core Problem
Currently, business strategy is scattered across:
- narrative.md (6,834 lines of unstructured text)
- vision.md (high-level conglomerate structure)
- Mental models and conversations

**Pain Points:**
- No single source of truth for each venture's strategy
- Can't compare ventures side-by-side using structured criteria
- No version history or change tracking
- Can't generate investor-ready documents on demand
- No way to link financial projections to strategic pillars

---

## 2. Product Goals & Non-Goals

### 2.1 Goals
✅ Provide structured templates for comprehensive business planning (Problem, Solution, Market, GTM, Moat)
✅ Enable versioning and historical comparison of strategy evolution
✅ Link business plans to ventures, goals, milestones, and financial projections
✅ Generate exportable pitch decks and one-pagers
✅ Support collaborative editing with role-based access
✅ Implement POFW Framework scoring (Problem, Opportunity, Feasibility, Why Now)

### 2.2 Non-Goals
❌ Replace narrative.md entirely (it remains the philosophical foundation)
❌ Build a full project management system (use Linear/Jira for execution)
❌ Create complex financial modeling (separate Financial Management module)
❌ AI content generation (keep strategic thinking human-driven)

---

## 3. User Personas

### 3.1 Primary: The Founder (You)
**Role**: Chairman of F12 Holdings
**Needs**:
- Quick access to all 12 venture strategies
- Compare ventures using Ocean Strategy, LTV, Scalability frameworks
- Update plans as market conditions change
- Export plans for investor meetings

**Key User Stories:**
- "I need to review all ventures and decide which to prioritize in 2026"
- "I'm meeting a VC next week and need a 1-pager for CareerRPG"
- "I want to see how Brozkey's strategy has evolved over the past 6 months"

### 3.2 Secondary: Venture CEOs (Future Hires)
**Role**: CEO of Brozkey, ServisLah, CareerRPG, etc.
**Needs**:
- Own their venture's business plan
- Propose strategy pivots for founder approval
- Link quarterly goals to strategic pillars
- Track competitive landscape changes

### 3.3 Tertiary: Investors & Advisors
**Role**: External stakeholders (read-only access)
**Needs**:
- View high-level strategy and traction
- Download investment memos
- See how ventures fit into F12 Holdings ecosystem

---

## 4. Core Features & Specifications

### 4.1 Business Plan Structure

Each business plan contains **8 core sections**:

#### Section 1: Vision & Mission
```typescript
{
  vision: string;          // 1-2 sentences: The world you're creating
  mission: string;         // 1-2 sentences: How you'll get there
  oneLinePitch: string;    // Max 140 chars: Twitter-style pitch
  tagline: string;         // Max 60 chars: "Brozkey: Level Up Your Barbering Business"
}
```

#### Section 2: Problem & Solution (POFW Framework)
```typescript
{
  problem: {
    score: number;              // 1-10 rating
    title: string;              // "Barbershops Lose 40% Revenue to No-Shows"
    description: string;        // 500-1000 words: Deep dive
    painPoints: string[];       // Bulleted list of specific pains
    currentAlternatives: string; // How customers solve this today
  };
  solution: {
    description: string;        // How your product solves it
    uniqueApproach: string;     // What makes it different
    keyFeatures: string[];      // Top 5 features
  };
}
```

#### Section 3: Market & Opportunity (POFW Framework)
```typescript
{
  opportunity: {
    score: number;              // 1-10 rating
    title: string;              // "RM2.5B Grooming Industry in Malaysia"
    TAM: string;                // Total Addressable Market
    SAM: string;                // Serviceable Addressable Market
    SOM: string;                // Serviceable Obtainable Market
    marketTrends: string[];     // Tailwinds supporting growth
    competitorLandscape: string; // Analysis of existing players
  };
  feasibility: {
    score: number;              // 1-10 rating
    technicalFeasibility: string; // Can we build this?
    marketFeasibility: string;   // Will customers buy?
    resourcesNeeded: string[];   // Team, capital, time required
  };
  whyNow: {
    score: number;              // 1-10 rating
    title: string;              // "Post-COVID Digital Transformation"
    description: string;        // Why this exact moment?
    catalysts: string[];        // Specific market triggers
  };
}
```

#### Section 4: Business Model & Revenue
```typescript
{
  businessModel: string;        // SAAS_SUBSCRIPTION, MARKETPLACE, FREEMIUM, etc.
  revenueStreams: Array<{
    name: string;               // "Pro Subscriptions"
    type: string;               // "Recurring", "Transactional"
    pricing: string;            // "RM99/month per shop"
    percentOfRevenue: number;   // Expected % of total revenue
  }>;
  pricingStrategy: string;      // Value-based, cost-plus, competitor-based
  unitEconomics: {
    CAC: number;                // Customer Acquisition Cost
    LTV: number;                // Lifetime Value
    LTVtoCAC: number;           // Ratio (ideal: 3:1)
    paybackPeriod: number;      // Months to recover CAC
  };
}
```

#### Section 5: Go-to-Market Strategy
```typescript
{
  gtmStrategy: string;          // High-level approach (1000 words)
  customerSegments: Array<{
    name: string;               // "Independent Barbershops (1-3 chairs)"
    size: string;               // "~15,000 shops in Malaysia"
    priority: "PRIMARY" | "SECONDARY" | "TERTIARY";
    acquisitionChannel: string; // "Instagram DM outreach"
  }>;
  channels: Array<{
    name: string;               // "Content Marketing", "Direct Sales"
    stage: "AWARENESS" | "CONSIDERATION" | "CONVERSION" | "RETENTION";
    cost: string;               // "Low", "Medium", "High"
    effectiveness: number;      // 1-10 rating
  }>;
  launchPlan: {
    phase1: string;             // MVP launch (Q1 2026)
    phase2: string;             // Growth (Q2-Q4 2026)
    phase3: string;             // Scale (2027+)
  };
}
```

#### Section 6: Moat & Competitive Advantage
```typescript
{
  moat: string;                 // Primary defensibility (1000 words)
  moatCategories: Array<
    "NETWORK_EFFECTS" |
    "SWITCHING_COSTS" |
    "DATA_MOAT" |
    "BRAND" |
    "REGULATORY" |
    "TECH_SUPERIORITY"
  >;
  competitiveAdvantages: string[]; // Top 3-5 advantages
  risks: Array<{
    type: "MARKET" | "EXECUTION" | "COMPETITIVE" | "REGULATORY" | "FINANCIAL";
    description: string;
    mitigation: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }>;
}
```

#### Section 7: Ocean Strategy & Positioning
```typescript
{
  oceanStrategy: "BLUE_OCEAN" | "RED_OCEAN" | "PURPLE_OCEAN";
  ltvStrategy: "HIGH_LTV" | "MEDIUM_LTV" | "LOW_LTV";
  scalability: "HIGH_SCALE" | "MEDIUM_SCALE" | "LOW_SCALE";
  riskProfile: "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK";
  strategicPositioning: string; // How this fits in F12 Holdings portfolio
}
```

#### Section 8: Team & Resources
```typescript
{
  foundingTeam: Array<{
    name: string;
    role: string;
    background: string;
    equityPercent: number;
  }>;
  keyHires: Array<{
    role: string;
    timeline: string;           // "Q2 2026"
    salary: number;
    criticality: "ESSENTIAL" | "IMPORTANT" | "NICE_TO_HAVE";
  }>;
  fundingNeeds: {
    stage: "BOOTSTRAPPED" | "PRE_SEED" | "SEED" | "SERIES_A";
    amountRaised: number;
    targetRaise: number;
    useOfFunds: string;         // Detailed breakdown
  };
}
```

---

### 4.2 Version Control & History

**Core Requirements:**
- Every save creates a new version (immutable history)
- Compare any two versions side-by-side
- Restore previous versions
- Tag major versions (e.g., "Pre-Seed Pitch", "Series A Strategy")

**Database Schema Enhancement:**
```prisma
model BusinessPlan {
  id            String   @id @default(cuid())
  ventureId     String
  venture       Venture  @relation(fields: [ventureId], references: [id])

  version       Int      @default(1)
  versionTag    String?  // "Series A Pitch Deck Version"
  isCurrentVersion Boolean @default(true)

  // Core sections (as defined above)
  vision        String?
  mission       String?
  oneLinePitch  String?
  // ... all fields from sections 1-8

  // Metadata
  status        PlanStatus @default(DRAFT)
  createdBy     String   // User ID when auth is added
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  financialProjections FinancialProjection[]
  comments      PlanComment[]
}

enum PlanStatus {
  DRAFT
  ACTIVE
  ARCHIVED
  INVESTOR_READY
}

model PlanComment {
  id          String   @id @default(cuid())
  planId      String
  plan        BusinessPlan @relation(fields: [planId], references: [id])
  section     String   // Which section is commented on
  content     String
  createdBy   String
  createdAt   DateTime @default(now())
}
```

---

### 4.3 POFW Scoring Dashboard

Create a visual comparison matrix of all ventures:

| Venture | Problem (P) | Opportunity (O) | Feasibility (F) | Why Now (W) | Total | Status |
|---------|-------------|-----------------|-----------------|-------------|-------|--------|
| Brozkey | 9/10 | 8/10 | 7/10 | 9/10 | 33/40 | 🟢 Active |
| CareerRPG | 8/10 | 9/10 | 8/10 | 7/10 | 32/40 | 🟢 Active |
| ServisLah | 7/10 | 8/10 | 6/10 | 8/10 | 29/40 | 🟡 Beta |
| Finnect | 9/10 | 10/10 | 5/10 | 8/10 | 32/40 | 🔴 Idea |

**Visual Elements:**
- Radar chart showing POFW scores
- Color-coded heat map
- Sort by total score, individual dimension, or venture status
- Filter by category (SAAS, MEDIA, etc.)

---

### 4.4 Export & Sharing

**Export Formats:**
1. **One-Pager PDF** - Single page investor teaser
2. **Pitch Deck** - 10-12 slide deck (auto-generated from plan data)
3. **Investment Memo** - 5-10 page detailed document
4. **Markdown** - For embedding in notion/docs
5. **JSON** - For API integrations

**Sharing Options:**
- Generate public read-only link (expires in 7 days)
- Email PDF directly from system
- Export to Notion/Google Docs (future integration)

---

## 5. User Interface & Experience

### 5.1 Navigation Structure
```
/plans
  ├── /dashboard          → POFW comparison matrix, quick stats
  ├── /list               → All business plans (filterable, sortable)
  ├── /[planId]           → View single plan (read mode)
  ├── /[planId]/edit      → Edit plan (section-by-section)
  ├── /[planId]/versions  → Version history & comparison
  ├── /[planId]/export    → Export options
  └── /new                → Create new plan (venture selector)
```

### 5.2 Dashboard View (Landing Page)

**Hero Metrics:**
- Total Plans: 12 (4 Active, 3 Draft, 5 Idea)
- Avg POFW Score: 31.5/40
- Plans Updated This Week: 3

**POFW Comparison Matrix:**
- Sortable table (as shown in 4.3)
- Click row to view plan
- Quick actions: Edit, Duplicate, Export

**Recent Activity Feed:**
- "Brozkey plan updated: Added Series A fundraising section"
- "CareerRPG: Problem score increased from 7 to 8"
- "Finnect plan marked as INVESTOR_READY"

### 5.3 Plan Edit View

**Layout: Sidebar + Main Content**

**Sidebar (Always Visible):**
- Progress indicator (8 sections, mark complete)
- Quick navigation (jump to section)
- Version info (v3, last saved 2 hours ago)
- Actions: Save, Publish, Export, View History

**Main Content: Tabbed Sections**
1. Tab: Vision & Mission
2. Tab: Problem & Solution
3. Tab: Market & Opportunity
4. Tab: Business Model
5. Tab: Go-to-Market
6. Tab: Moat & Competition
7. Tab: Strategy & Positioning
8. Tab: Team & Resources

**Form Design:**
- Rich text editor for long-form content (Tiptap or Lexical)
- Number inputs with validation for scores (1-10)
- Dynamic arrays for lists (add/remove revenue streams, channels, etc.)
- Auto-save every 30 seconds
- Validation warnings (e.g., "TAM should be larger than SAM")

### 5.4 Version History View

**Layout: Side-by-Side Comparison**

Left Panel: Version 2 (Feb 1, 2025) - Tagged "Pre-Seed Pitch"
Right Panel: Version 3 (Feb 15, 2025) - Current

**Diff Highlighting:**
- Green: New content
- Red: Deleted content
- Yellow: Modified content

**Actions:**
- Restore this version
- Tag this version
- Download this version

---

## 6. Technical Implementation

### 6.1 Technology Stack (Aligned with F12OS)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 + React 19 | Already in use, App Router |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Rich Text** | Tiptap | Extensible, collaborative-ready |
| **Database** | PostgreSQL + Prisma | Existing setup |
| **Export** | Puppeteer (PDF), Slidev (Decks) | Automated generation |
| **Storage** | Cloudflare R2 | For exported PDFs |

### 6.2 Database Schema Updates

**Extend Existing `BusinessPlan` Model:**
```prisma
// Add to schema.prisma

model BusinessPlan {
  id          String   @id @default(cuid())
  ventureId   String   @unique // One plan per venture (use versions for history)
  venture     Venture  @relation(fields: [ventureId], references: [id])

  version     Int      @default(1)
  versionTag  String?
  isCurrentVersion Boolean @default(true)

  // Section 1: Vision & Mission
  vision      String?  @db.Text
  mission     String?  @db.Text
  oneLinePitch String?
  tagline     String?

  // Section 2: Problem & Solution
  problemScore      Int?     @default(0)
  problemTitle      String?
  problemDesc       String?  @db.Text
  painPoints        Json?    // string[]
  currentAlternatives String? @db.Text

  solutionDesc      String?  @db.Text
  uniqueApproach    String?  @db.Text
  keyFeatures       Json?    // string[]

  // Section 3: Market & Opportunity
  opportunityScore  Int?     @default(0)
  opportunityTitle  String?
  TAM               String?
  SAM               String?
  SOM               String?
  marketTrends      Json?    // string[]
  competitorLandscape String? @db.Text

  feasibilityScore  Int?     @default(0)
  technicalFeasibility String? @db.Text
  marketFeasibility String? @db.Text
  resourcesNeeded   Json?    // string[]

  whyNowScore       Int?     @default(0)
  whyNowTitle       String?
  whyNowDesc        String?  @db.Text
  catalysts         Json?    // string[]

  // Section 4: Business Model
  businessModel     String?
  revenueStreams    Json?    // Array of objects
  pricingStrategy   String?  @db.Text
  unitEconomics     Json?    // Object with CAC, LTV, etc.

  // Section 5: GTM
  gtmStrategy       String?  @db.Text
  customerSegments  Json?    // Array of objects
  channels          Json?    // Array of objects
  launchPlan        Json?    // Object with phase1, phase2, phase3

  // Section 6: Moat
  moat              String?  @db.Text
  moatCategories    Json?    // string[]
  competitiveAdvantages Json? // string[]
  risks             Json?    // Array of risk objects

  // Section 7: Strategy
  oceanStrategy     String?
  ltvStrategy       String?
  scalability       String?
  riskProfile       String?
  strategicPositioning String? @db.Text

  // Section 8: Team & Resources
  foundingTeam      Json?    // Array of team members
  keyHires          Json?    // Array of hiring plans
  fundingNeeds      Json?    // Object with stage, amounts, use of funds

  // Metadata
  status        PlanStatus @default(DRAFT)
  createdBy     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  comments      PlanComment[]
  exports       PlanExport[]
}

enum PlanStatus {
  DRAFT
  IN_REVIEW
  ACTIVE
  INVESTOR_READY
  ARCHIVED
}

model PlanComment {
  id          String   @id @default(cuid())
  planId      String
  plan        BusinessPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  section     String   // e.g., "problem", "gtm"
  content     String   @db.Text
  createdBy   String?
  createdAt   DateTime @default(now())
}

model PlanExport {
  id          String   @id @default(cuid())
  planId      String
  plan        BusinessPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  format      ExportFormat
  fileUrl     String?  // Cloudflare R2 URL
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
}

enum ExportFormat {
  ONE_PAGER_PDF
  PITCH_DECK_PDF
  INVESTMENT_MEMO_PDF
  MARKDOWN
  JSON
}

// Update Venture model to add relation
model Venture {
  // ... existing fields ...
  businessPlan BusinessPlan?
}
```

### 6.3 API Routes

**Create/Read/Update/Delete:**
- `POST /api/plans` - Create new plan
- `GET /api/plans` - List all plans (with filters)
- `GET /api/plans/[id]` - Get single plan
- `PATCH /api/plans/[id]` - Update plan (auto-increments version)
- `DELETE /api/plans/[id]` - Soft delete (archive)

**Version Management:**
- `GET /api/plans/[id]/versions` - List all versions
- `GET /api/plans/[id]/versions/[versionNum]` - Get specific version
- `POST /api/plans/[id]/versions/[versionNum]/restore` - Restore version
- `PATCH /api/plans/[id]/versions/[versionNum]/tag` - Add version tag

**Export:**
- `POST /api/plans/[id]/export` - Generate export (returns job ID)
- `GET /api/plans/[id]/exports` - List all exports
- `GET /api/plans/[id]/exports/[exportId]/download` - Download file

**POFW Scoring:**
- `GET /api/plans/scores` - Get POFW comparison matrix

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Update Prisma schema with complete BusinessPlan model
- [ ] Create database migrations
- [ ] Build API routes for CRUD operations
- [ ] Create basic plan list and view pages

### Phase 2: Core Editing (Week 3-4)
- [ ] Build section-by-section edit forms
- [ ] Implement auto-save functionality
- [ ] Add form validation with Zod
- [ ] Create rich text editor integration

### Phase 3: POFW Dashboard (Week 5)
- [ ] Build comparison matrix table
- [ ] Create radar chart visualizations
- [ ] Add filtering and sorting
- [ ] Implement quick actions

### Phase 4: Version Control (Week 6)
- [ ] Implement version history tracking
- [ ] Build side-by-side diff view
- [ ] Add version tagging
- [ ] Create restore functionality

### Phase 5: Export System (Week 7-8)
- [ ] Design PDF templates (one-pager, memo)
- [ ] Implement Puppeteer PDF generation
- [ ] Create pitch deck template with Slidev
- [ ] Build export job queue
- [ ] Integrate Cloudflare R2 for file storage

### Phase 6: Polish & Integration (Week 9-10)
- [ ] Link plans to ventures, goals, and financials
- [ ] Add commenting system
- [ ] Implement sharing links
- [ ] Performance optimization
- [ ] User testing and refinements

---

## 8. Success Criteria

### 8.1 Quantitative Metrics
- ✅ All 12 ventures have business plans by end of Q2 2025
- ✅ Plans updated at least once per quarter
- ✅ Export generation completes in under 60 seconds
- ✅ Zero data loss (version history prevents accidental deletions)

### 8.2 Qualitative Metrics
- ✅ Founder can create investor-ready one-pager in under 10 minutes
- ✅ New C-suite executives onboard using business plans
- ✅ Plans drive strategic decision-making (not just documentation)
- ✅ VCs provide positive feedback on plan quality and structure

---

## 9. Future Enhancements (Post-MVP)

**Q3 2025:**
- Collaborative real-time editing (when team expands)
- AI-powered competitive analysis scraping
- Integration with Linear for linking goals to strategic pillars
- Mobile app for on-the-go plan reviews

**Q4 2025:**
- Public venture portfolio page (investor showcase)
- Scenario modeling (compare different GTM strategies)
- Integration with financial projections for automated updates
- API for third-party integrations (Notion, Airtable, etc.)

**2026+:**
- AI strategy advisor (suggest improvements based on market data)
- Benchmark against similar ventures (anonymized data sharing)
- Automated pitch deck generation with custom branding

---

## 10. Appendix

### 10.1 Sample One-Pager Template (Brozkey)

```
╔════════════════════════════════════════════════════════╗
║         BROZKEY LEVELUP - BUSINESS ONE-PAGER          ║
╚════════════════════════════════════════════════════════╝

TAGLINE
Level Up Your Barbering Business

ONE-LINE PITCH
The all-in-one SaaS platform helping barbershops eliminate
no-shows, maximize chair utilization, and scale to RM1M+ ARR.

THE PROBLEM (Score: 9/10)
Malaysian barbershops lose 40% potential revenue due to
no-shows, manual booking chaos, and zero customer data.
Average shop makes RM8k/month when it should make RM15k+.

THE SOLUTION
Smart booking system + customer loyalty gamification +
inventory management. Barbers get an AI assistant that
sends reminders, tracks preferences, and upsells services.

THE MARKET (Score: 8/10)
• TAM: RM2.5B grooming industry in Malaysia
• SAM: 15,000 independent barbershops
• SOM: 1,500 shops (10% penetration) = RM18M ARR

BUSINESS MODEL
• Freemium: Free for 1 chair, RM99/mo for Pro (unlimited)
• Marketplace: 15% commission on product sales
• Target: RM1M MRR by 2028

TRACTION
• Beta: 12 shops using daily
• MRR: RM1,200 (pre-launch)
• NPS: 9.2/10

THE MOAT
1. Network effects (more barbers = more customer data)
2. High switching costs (all customer history locked in)
3. ServisLah integration (automotive + grooming ecosystem)

THE ASK
Pre-Seed: RM500k for 10% equity
Use: 60% engineering, 30% marketing, 10% operations

CONTACT
hafiz@f12.global | brozkey.app
╚════════════════════════════════════════════════════════╝
```

---

**END OF PRD: BUSINESS PLAN MANAGEMENT SYSTEM**
