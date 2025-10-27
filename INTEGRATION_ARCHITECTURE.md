# Integration Architecture: Business Plans ↔ Financial Management
## F12OS - Unified Strategic & Financial Operating System

---

## Document Control

| Attribute | Detail |
|-----------|--------|
| **Document Name** | Integration Architecture Specification |
| **Version** | 1.0 |
| **Owner** | Hafiz "Fiz" Kadir |
| **Created** | 2025-01-22 |
| **Status** | Planning Phase |

---

## 1. Integration Vision

### 1.1 The Problem of Silos
Business plans and financial data are deeply interconnected, yet most systems treat them as separate:
- **Business Plans** answer: "What should we do?"
- **Financial Data** answers: "What are we actually achieving?"

**Without integration:**
- Financial projections in business plans become outdated
- Can't compare planned vs actual performance
- Strategic pivots don't trigger financial reforecasting
- Investor reports require manual data aggregation

### 1.2 The Integrated Solution
F12OS unifies strategy and finance into a **closed-loop operating system**:

```
    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │   BUSINESS PLAN (Strategy)                          │
    │   • Problem, Solution, Market                       │
    │   • GTM Strategy                                    │
    │   • Financial Projections (Targets)                 │
    │                                                     │
    └─────────────────┬───────────────────────────────────┘
                      │
                      │ Real-time Sync
                      │
    ┌─────────────────▼───────────────────────────────────┐
    │                                                     │
    │   FINANCIAL SYSTEM (Execution)                      │
    │   • Actual MRR, Burn Rate, Runway                   │
    │   • Unit Economics (CAC, LTV)                       │
    │   • Performance vs Targets                          │
    │                                                     │
    └─────────────────┬───────────────────────────────────┘
                      │
                      │ Feedback Loop
                      │
    ┌─────────────────▼───────────────────────────────────┐
    │                                                     │
    │   INSIGHTS & ALERTS                                 │
    │   • "Brozkey MRR 20% below target"                  │
    │   • "Burn rate exceeds business plan forecast"      │
    │   • "Trigger: Update GTM strategy"                  │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

**Key Principle: Single Source of Truth**
- Business Plan defines targets
- Financial System tracks actuals
- Alerts flag deviations
- Insights drive plan updates

---

## 2. Integration Points

### 2.1 Core Data Relationships

**Database-Level Relationships:**
```prisma
model Venture {
  id            String   @id @default(cuid())
  name          String   @unique

  // Strategic Layer
  businessPlan  BusinessPlan?     // 1:1 - Each venture has one active plan

  // Financial Layer
  metrics       Metric[]          // 1:N - Time-series financial metrics
  financialProjections FinancialProjection[] // 1:N - Scenario forecasts
  alerts        FinancialAlert[]  // 1:N - Triggered alerts

  // Linking to Goals & Milestones
  goals         Goal[]
  // ... other fields
}

model BusinessPlan {
  id            String   @id
  ventureId     String   @unique
  venture       Venture  @relation(fields: [ventureId], references: [id])

  // Strategic Targets (Set in Business Plan)
  targetMRR     Float?   // "We aim for RM100k MRR by Dec 2026"
  targetARR     Float?
  targetCustomers Int?

  // Unit Economics Assumptions
  expectedCAC   Float?   // "We assume RM350 CAC"
  expectedLTV   Float?   // "We assume RM980 LTV"
  expectedPayback Float? // "We assume 3 month payback"

  // Financial Projections (from Business Plan)
  revenueModel  String?  // Linked to actual revenue streams
  unitEconomics Json?    // CAC, LTV targets

  // Burn Rate Forecast
  expectedBurnRate Float? // "We expect RM8k/month burn"
  expectedRunway   Int?   // "We expect 18 months runway"

  // Sync Status
  lastSyncedAt  DateTime?
  syncStatus    String?  // "IN_SYNC", "ACTUAL_BELOW_TARGET", "ACTUAL_ABOVE_TARGET"

  // ... other business plan fields
}

model Metric {
  id            String   @id
  ventureId     String
  venture       Venture  @relation(fields: [ventureId], references: [id])

  // Actual Performance (from Financial System)
  mrr           Float?
  arr           Float?
  customers     Int?
  cac           Float?
  ltv           Float?
  ltvCacRatio   Float?
  paybackPeriod Float?
  burnRate      Float?
  runway        Int?

  // Comparison Fields (auto-calculated)
  mrrVsTarget   Float?   // % difference from business plan target
  burnVsForecast Float?  // % difference from expected burn
  performanceStatus String? // "ON_TRACK", "LAGGING", "EXCEEDING"

  date          DateTime
  createdAt     DateTime @default(now())
}

model FinancialAlert {
  id            String   @id
  ventureId     String?
  venture       Venture? @relation(fields: [ventureId], references: [id])

  type          String   // "MRR_BELOW_TARGET", "BURN_EXCEEDS_FORECAST"
  severity      String   // "INFO", "WARNING", "CRITICAL"

  title         String
  message       String
  suggestedAction String? // "Consider revising GTM strategy in business plan"

  // Link back to Business Plan
  relatedPlanSection String? // "gtmStrategy", "unitEconomics"

  createdAt     DateTime @default(now())
  dismissedAt   DateTime?
}
```

---

### 2.2 Key Integration Scenarios

#### Scenario 1: Business Plan Creation → Financial Targets Set

**User Flow:**
1. Founder creates business plan for **Brozkey**
2. In "Business Model" section, sets targets:
   - Target MRR: RM100k (Dec 2026)
   - Expected CAC: RM350
   - Expected LTV: RM980
   - Expected Burn: RM8k/month
3. System automatically creates baseline financial projection
4. Financial dashboard now shows:
   - Current MRR: RM12k
   - Target MRR: RM100k
   - Progress: 12% (🟡 On Track)

**Technical Implementation:**
```typescript
// When BusinessPlan is created/updated
async function syncBusinessPlanToFinancials(planId: string) {
  const plan = await prisma.businessPlan.findUnique({
    where: { id: planId },
    include: { venture: true }
  });

  // Create/update financial targets
  await prisma.venture.update({
    where: { id: plan.ventureId },
    data: {
      targetMRR: plan.targetMRR,
      currentMRR: plan.venture.currentMRR || 0
    }
  });

  // Generate initial projection based on plan assumptions
  await createFinancialProjection({
    ventureId: plan.ventureId,
    name: `Business Plan Baseline (${plan.version})`,
    assumptions: {
      revenue: {
        baseRevenue: plan.venture.currentMRR || 0,
        growthRate: calculateImpliedGrowthRate(
          plan.venture.currentMRR,
          plan.targetMRR,
          monthsUntilTarget
        ),
      },
      expenses: {
        burnRate: plan.expectedBurnRate,
      }
    }
  });
}
```

---

#### Scenario 2: Actual Metrics Update → Compare vs Business Plan

**User Flow:**
1. Stripe webhook fires: Brozkey MRR updated to RM15k
2. System creates new Metric record
3. System compares actual vs business plan targets:
   - Actual MRR: RM15k
   - Target MRR for this month: RM20k (pro-rated)
   - Status: 🟡 25% Below Target
4. Alert generated: "Brozkey MRR trending below business plan forecast"
5. Founder sees alert with suggested action: "Review GTM strategy"

**Technical Implementation:**
```typescript
// Webhook handler: /api/webhooks/stripe
export async function handleStripeWebhook(event: StripeEvent) {
  if (event.type === 'invoice.payment_succeeded') {
    const subscription = event.data.object;

    // Update venture MRR
    const updatedMetric = await createMetricRecord({
      ventureId: 'brozkey-id',
      mrr: calculateMRR(subscription),
      date: new Date()
    });

    // Compare vs business plan target
    await compareActualVsTarget(updatedMetric);
  }
}

async function compareActualVsTarget(metric: Metric) {
  const plan = await prisma.businessPlan.findUnique({
    where: { ventureId: metric.ventureId }
  });

  if (!plan?.targetMRR) return; // No target set

  const targetForMonth = calculateProRatedTarget(
    plan.targetMRR,
    plan.targetDate,
    metric.date
  );

  const variance = (metric.mrr - targetForMonth) / targetForMonth;

  // Update metric with comparison
  await prisma.metric.update({
    where: { id: metric.id },
    data: {
      mrrVsTarget: variance * 100, // % difference
      performanceStatus: getStatus(variance)
    }
  });

  // Trigger alert if variance exceeds threshold
  if (variance < -0.15) { // 15% below target
    await createFinancialAlert({
      ventureId: metric.ventureId,
      type: 'MRR_BELOW_TARGET',
      severity: 'WARNING',
      title: 'MRR Trending Below Target',
      message: `Current MRR (RM${metric.mrr}) is ${Math.abs(variance * 100)}% below business plan target (RM${targetForMonth})`,
      suggestedAction: 'Consider reviewing GTM strategy in business plan',
      relatedPlanSection: 'gtmStrategy'
    });
  }
}

function getStatus(variance: number): string {
  if (variance >= -0.05 && variance <= 0.1) return 'ON_TRACK';
  if (variance < -0.15) return 'LAGGING';
  if (variance > 0.2) return 'EXCEEDING';
  return 'MONITOR';
}
```

---

#### Scenario 3: Strategic Pivot → Update Financial Projections

**User Flow:**
1. Founder updates Brozkey business plan:
   - Changed GTM from "Direct Sales" to "Content Marketing"
   - Expected CAC drops from RM350 → RM200
   - Expected growth rate increases from 10% → 15% MoM
2. System detects business plan change
3. Prompt: "Business plan updated. Regenerate financial projections?"
4. Founder clicks "Yes"
5. System creates new projection with updated assumptions
6. Dashboard now shows 2 scenarios side-by-side:
   - Old projection (Direct Sales)
   - New projection (Content Marketing)

**Technical Implementation:**
```typescript
// When BusinessPlan is updated
async function onBusinessPlanUpdate(planId: string, changes: object) {
  const plan = await prisma.businessPlan.findUnique({
    where: { id: planId }
  });

  // Detect if financial assumptions changed
  const financialFieldsChanged = [
    'expectedCAC',
    'expectedLTV',
    'targetMRR',
    'expectedBurnRate',
    'gtmStrategy'
  ].some(field => field in changes);

  if (financialFieldsChanged) {
    // Flag projections as outdated
    await prisma.financialProjection.updateMany({
      where: {
        ventureId: plan.ventureId,
        status: 'ACTIVE'
      },
      data: {
        status: 'OUTDATED',
        note: 'Business plan updated. Regenerate projections.'
      }
    });

    // Notify founder
    await createNotification({
      userId: plan.createdBy,
      title: 'Update Financial Projections?',
      message: 'Business plan assumptions changed. Regenerate projections to reflect new strategy.',
      actionUrl: `/finance/ventures/${plan.ventureId}/projections/new`,
      actionLabel: 'Regenerate Projections'
    });
  }
}
```

---

#### Scenario 4: Investor Report → Unified View

**User Flow:**
1. Founder clicks "Generate Investor Report" for **Q1 2026**
2. System aggregates:
   - From Business Plans: Strategy summaries, POFW scores
   - From Financial System: Actual MRR, burn, runway
   - Comparison: Targets vs actuals for all ventures
3. PDF generated with:
   - Executive summary
   - Per-venture: Plan vs Performance
   - Portfolio-level financials
   - Key risks and alerts

**Report Structure:**
```markdown
# F12 Holdings - Q1 2026 Investor Report

## Executive Summary
- Portfolio MRR: RM45k (↑ 22% QoQ)
- Ventures: 3 profitable, 4 growth stage, 5 pre-revenue
- Net Worth: RM3.8M (↑ RM546k QoQ)
- Runway: Avg 14 months across all ventures

## Venture Highlights

### Brozkey
**Strategy** (from Business Plan)
- Market: Grooming industry SaaS (TAM: RM2.5B)
- Target: RM100k MRR by Dec 2026
- Moat: Network effects + data moat

**Performance** (from Financial System)
- Actual MRR: RM15k (Target: RM20k) · 🟡 25% Below
- Growth: 18% MoM (Target: 25%)
- Burn: RM8k/month (On Target)
- Runway: 15 months ✅

**Status**: Healthy but growth lagging. Action: Review GTM.

### CareerRPG
[Similar structure]

## Financial Health Dashboard
[Comparison matrix from both systems]

## Risk Factors
[Alerts from financial system]

## Appendix
[Detailed financials, business plan excerpts]
```

**Technical Implementation:**
```typescript
async function generateInvestorReport(quarter: string, year: number) {
  // Fetch all ventures with plans and metrics
  const ventures = await prisma.venture.findMany({
    include: {
      businessPlan: true,
      metrics: {
        where: {
          date: {
            gte: quarterStartDate,
            lte: quarterEndDate
          }
        },
        orderBy: { date: 'desc' }
      },
      alerts: {
        where: {
          createdAt: {
            gte: quarterStartDate,
            lte: quarterEndDate
          }
        }
      }
    }
  });

  // Aggregate data
  const reportData = ventures.map(v => ({
    name: v.name,

    // From Business Plan
    strategy: {
      vision: v.businessPlan?.vision,
      targetMRR: v.businessPlan?.targetMRR,
      moat: v.businessPlan?.moat,
      powfScore: calculatePOWFScore(v.businessPlan)
    },

    // From Financial System
    performance: {
      actualMRR: v.metrics[0]?.mrr,
      growthRate: calculateGrowthRate(v.metrics),
      burnRate: v.metrics[0]?.burnRate,
      runway: v.metrics[0]?.runway,
      status: v.metrics[0]?.performanceStatus
    },

    // Comparison
    variance: {
      mrrVsTarget: v.metrics[0]?.mrrVsTarget,
      growthVsExpected: compareGrowth(v)
    },

    // Risks
    alerts: v.alerts.map(a => ({
      severity: a.severity,
      message: a.message
    }))
  }));

  // Generate PDF
  return await generatePDF({
    template: 'investor-report',
    data: reportData
  });
}
```

---

## 3. Synchronized Workflows

### 3.1 Workflow: New Venture Launch

**Step-by-Step Integration:**

| Step | System | Action | Triggers |
|------|--------|--------|----------|
| 1 | Plans | Create venture: "MyNewSaaS" | → Venture record created |
| 2 | Plans | Write business plan (Vision, Problem, Solution) | → BusinessPlan record created |
| 3 | Plans | Set financial targets (MRR, CAC, Burn) | → FinancialProjection auto-created |
| 4 | Finance | View venture dashboard | → Shows RM0 MRR, target RM100k |
| 5 | Finance | Add first metric: RM500 MRR | → Metric record created |
| 6 | Finance | System compares actual vs target | → Alert: "Great start! 0.5% toward target" |
| 7 | Plans | Update business plan (new GTM strategy) | → Notification: "Regenerate projections?" |
| 8 | Finance | Regenerate projection with new assumptions | → New projection created |

---

### 3.2 Workflow: Monthly Financial Review

**Automated Monthly Process:**

```
Day 1 of Month:
├─ [Finance] Aggregate all venture metrics from previous month
├─ [Finance] Compare actuals vs business plan targets
├─ [Finance] Generate alerts for deviations >15%
├─ [Finance] Create monthly financial snapshot
└─ [Plans] Flag business plans that need review

Day 5 of Month:
├─ [Finance] Email report to founder with:
│   ├─ Portfolio performance summary
│   ├─ Ventures needing attention
│   ├─ Comparison: Plan vs Actual
│   └─ Suggested actions
└─ [Plans] Prompt: "Review business plans for lagging ventures"

Week 2 of Month:
├─ [Plans] Founder reviews flagged business plans
├─ [Plans] Updates strategy (if needed)
└─ [Finance] Projections auto-regenerate with new assumptions
```

**Implementation:**
```typescript
// Cron job: Run on 1st of each month
export async function runMonthlyFinancialReview() {
  const lastMonth = getLastMonth();

  // 1. Aggregate metrics
  const venturePerformance = await aggregateVentureMetrics(lastMonth);

  // 2. Compare vs business plan targets
  const comparisons = await Promise.all(
    venturePerformance.map(async (perf) => {
      const plan = await getBusinessPlan(perf.ventureId);
      return comparePerformance(perf, plan);
    })
  );

  // 3. Generate alerts
  const alerts = comparisons
    .filter(c => Math.abs(c.variance) > 0.15) // 15% threshold
    .map(c => createAlert(c));

  await prisma.financialAlert.createMany({ data: alerts });

  // 4. Flag business plans needing review
  const plansToReview = comparisons
    .filter(c => c.status === 'LAGGING')
    .map(c => c.planId);

  await prisma.businessPlan.updateMany({
    where: { id: { in: plansToReview } },
    data: { status: 'NEEDS_REVIEW' }
  });

  // 5. Send email report
  await sendMonthlyReport({
    to: 'hafiz@f12.global',
    subject: `F12 Holdings - ${lastMonth} Financial Review`,
    data: {
      performance: venturePerformance,
      comparisons,
      alerts,
      plansToReview
    }
  });
}
```

---

### 3.3 Workflow: Fundraising Preparation

**Scenario: Preparing for Brozkey Series A**

| Step | System | Action | Output |
|------|--------|--------|--------|
| 1 | Plans | Update business plan to "INVESTOR_READY" status | → Version tagged "Series A Pitch" |
| 2 | Plans | Export business plan as "Investment Memo" | → PDF generated |
| 3 | Finance | Generate financial performance report (last 12 months) | → Actual MRR, growth, burn data |
| 4 | Both | Create unified pitch deck | → Combines strategy + financials |
| 5 | Finance | Add investor-specific projections | → 3 scenarios (Conservative, Base, Aggressive) |
| 6 | Plans | Share read-only link with investor | → Investor sees strategy + live financials |

**Unified Pitch Deck Generator:**
```typescript
async function generatePitchDeck(ventureId: string, format: 'Series A' | 'Pre-Seed') {
  const venture = await prisma.venture.findUnique({
    where: { id: ventureId },
    include: {
      businessPlan: true,
      metrics: {
        orderBy: { date: 'desc' },
        take: 12 // Last 12 months
      }
    }
  });

  const slides = [
    // Slide 1: Vision (from Business Plan)
    {
      title: venture.name,
      tagline: venture.businessPlan.tagline,
      oneLinePitch: venture.businessPlan.oneLinePitch
    },

    // Slide 2: Problem (from Business Plan)
    {
      title: 'The Problem',
      content: venture.businessPlan.problemDesc,
      score: venture.businessPlan.problemScore
    },

    // Slide 3: Solution (from Business Plan)
    {
      title: 'Our Solution',
      content: venture.businessPlan.solutionDesc,
      features: venture.businessPlan.keyFeatures
    },

    // Slide 4: Market (from Business Plan)
    {
      title: 'Market Opportunity',
      TAM: venture.businessPlan.TAM,
      SAM: venture.businessPlan.SAM,
      SOM: venture.businessPlan.SOM
    },

    // Slide 5: Traction (from Financial System)
    {
      title: 'Traction',
      mrr: venture.metrics[0]?.mrr,
      growth: calculateGrowth(venture.metrics),
      customers: venture.metrics[0]?.customers,
      chart: generateMRRChart(venture.metrics)
    },

    // Slide 6: Unit Economics (from both)
    {
      title: 'Unit Economics',
      planned: {
        cac: venture.businessPlan.expectedCAC,
        ltv: venture.businessPlan.expectedLTV
      },
      actual: {
        cac: venture.metrics[0]?.cac,
        ltv: venture.metrics[0]?.ltv,
        ratio: venture.metrics[0]?.ltvCacRatio
      }
    },

    // Slides 7-10: GTM, Team, Financials, Ask
    // ... (similar pattern: Plans + Finance)
  ];

  return await generateSlideDeck(slides);
}
```

---

## 4. UI Integration Points

### 4.1 Unified Venture Dashboard

**URL:** `/ventures/[id]`

**Layout: Tabbed Interface**

```
┌─────────────────────────────────────────────────────────┐
│  BROZKEY                                    🟢 Healthy   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Overview] [Strategy] [Financials] [Metrics] [Updates] │
│  ───────────────────────────────────────────────────────│
│                                                          │
│  TAB: Overview (Unified View)                            │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ Strategic Position   │  │ Financial Health     │    │
│  │ ──────────────────── │  │ ──────────────────── │    │
│  │ POFW Score: 33/40    │  │ MRR: RM15k           │    │
│  │ Market: BLUE_OCEAN   │  │ Target: RM20k        │    │
│  │ Status: SCALING      │  │ Gap: -25% 🟡         │    │
│  │                      │  │                      │    │
│  │ [View Plan →]        │  │ Burn: RM8k/month     │    │
│  │                      │  │ Runway: 15 months ✅  │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  Performance vs Business Plan                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │  MRR (RM)                                         │  │
│  │   30k  |                          ╱ Target        │  │
│  │        |                      ╱                   │  │
│  │   20k  |                  ╱───                    │  │
│  │        |            ●───  Actual (25% below)      │  │
│  │   10k  |      ●───                                │  │
│  │        |●───                                      │  │
│  │     0  └────────────────────────────────────→     │  │
│  │        Jan   Mar   May   Jul   Sep   Nov          │  │
│  │                                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🟡 Alert: MRR trending 25% below business plan forecast│
│     Suggested Action: Review GTM strategy              │
│     [View Business Plan] [Dismiss]                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Tab Breakdown:**

1. **Overview Tab** (Shown above)
   - Combines strategy + financials
   - Shows performance vs plan
   - Displays alerts

2. **Strategy Tab**
   - Embeds business plan viewer
   - Quick link to edit plan
   - Shows POFW scores

3. **Financials Tab**
   - Deep dive into metrics
   - MRR, burn, runway charts
   - Unit economics breakdown

4. **Metrics Tab**
   - Time-series data table
   - Custom metric tracking
   - Export to CSV

5. **Updates Tab**
   - Venture updates feed
   - Milestone achievements
   - Team activity log

---

### 4.2 Cross-System Navigation

**Bidirectional Links:**

**From Business Plan → Financial Dashboard:**
```
Business Plan Page (/plans/[id])
├─ Section: "Revenue Model"
│   └─ "Actual MRR: RM15k → [View in Financial Dashboard]"
│
├─ Section: "Unit Economics"
│   ├─ Expected CAC: RM350
│   ├─ Actual CAC: RM420 (🟡 20% higher)
│   └─ [View Unit Economics Dashboard →]
│
└─ Export Menu
    ├─ Export as One-Pager
    ├─ Export as Investment Memo
    └─ Generate Pitch Deck (includes live financials)
```

**From Financial Dashboard → Business Plan:**
```
Financial Dashboard (/finance/ventures/[id])
├─ Alert: "MRR 25% below target"
│   └─ Suggested Action: [Review GTM Strategy in Business Plan →]
│
├─ Unit Economics Card
│   ├─ Actual LTV:CAC: 2.3:1
│   ├─ Target LTV:CAC: 3:1 (from business plan)
│   └─ [View Business Model in Plan →]
│
└─ Projection Outdated Warning
    └─ "Business plan updated 3 days ago. [Regenerate Projection →]"
```

---

### 4.3 Unified Global Dashboard

**URL:** `/dashboard` (Main F12OS landing page)

**Layout: 4 Quadrants**

```
┌────────────────────────────────────────────────────────────┐
│  F12 OPERATING SYSTEM                           Hi, Fiz 👋 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐ │
│  │ STRATEGIC STATUS    │  │ FINANCIAL STATUS            │ │
│  │ ─────────────────── │  │ ───────────────────────────  │ │
│  │ Business Plans:     │  │ Net Worth: RM3.8M           │ │
│  │ ✅ Complete: 8/12   │  │ Target: RM150M (2.5%)       │ │
│  │ 🟡 Draft: 3/12      │  │                             │ │
│  │ 🔴 Missing: 1/12    │  │ Portfolio MRR: RM45k        │ │
│  │                     │  │ Growth: +22% QoQ            │ │
│  │ Avg POFW: 31/40     │  │                             │ │
│  │                     │  │ Runway: Avg 14 months       │ │
│  │ [View Plans →]      │  │ [View Finances →]           │ │
│  └─────────────────────┘  └─────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ VENTURES: STRATEGY VS PERFORMANCE                   │  │
│  │ ─────────────────────────────────────────────────── │  │
│  │                                                      │  │
│  │ Venture    | POFW  | Target MRR | Actual | Status  │  │
│  │ ───────────────────────────────────────────────────│  │
│  │ Brozkey    | 33/40 | RM20k      | RM15k  | 🟡 -25% │  │
│  │ CareerRPG  | 32/40 | RM0        | RM0    | 🟢 Plan │  │
│  │ Life of Fiz| 29/40 | RM10k      | RM12k  | 🟢 +20% │  │
│  │ ServisLah  | 29/40 | RM5k       | RM3k   | 🟡 -40% │  │
│  │                                                      │  │
│  │ [View All Ventures →]                                │  │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ALERTS & ACTIONS                                    │  │
│  │ ─────────────────────────────────────────────────── │  │
│  │                                                      │  │
│  │ 🔴 Finnect runway <4 months → [Review Funding]      │  │
│  │ 🟡 Brozkey MRR lagging → [Update GTM Strategy]      │  │
│  │ 🟡 Portfolio needs rebalancing → [View Investments] │  │
│  │ 🟢 Life of Fiz hit RM10k MRR milestone!             │  │
│  │                                                      │  │
│  │ [View All Alerts →]                                  │  │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Side-by-side strategy vs financials
- Unified venture comparison (POFW + actual performance)
- Actionable alerts linking to both systems
- Quick navigation to deep dives

---

## 5. Technical Implementation

### 5.1 Sync Service Architecture

**Microservice: `sync-service`**

```typescript
// services/sync-service.ts

export class SyncService {

  /**
   * Called when BusinessPlan is created/updated
   */
  async syncPlanToFinance(planId: string) {
    const plan = await prisma.businessPlan.findUnique({
      where: { id: planId },
      include: { venture: true }
    });

    // Update venture targets
    await prisma.venture.update({
      where: { id: plan.ventureId },
      data: {
        targetMRR: plan.targetMRR,
        targetARR: plan.targetARR,
      }
    });

    // Create/update financial projection
    await this.generateProjectionFromPlan(plan);

    // Update sync status
    await prisma.businessPlan.update({
      where: { id: planId },
      data: {
        lastSyncedAt: new Date(),
        syncStatus: 'IN_SYNC'
      }
    });
  }

  /**
   * Called when Metric is created/updated
   */
  async syncFinanceToPlan(metricId: string) {
    const metric = await prisma.metric.findUnique({
      where: { id: metricId },
      include: {
        venture: {
          include: { businessPlan: true }
        }
      }
    });

    if (!metric.venture.businessPlan) return; // No plan to sync

    const plan = metric.venture.businessPlan;

    // Calculate variance
    const variance = this.calculateVariance(metric, plan);

    // Update metric with comparison
    await prisma.metric.update({
      where: { id: metricId },
      data: {
        mrrVsTarget: variance.mrr,
        burnVsForecast: variance.burn,
        performanceStatus: variance.status
      }
    });

    // Update business plan sync status
    const newSyncStatus = this.determineSyncStatus(variance);

    await prisma.businessPlan.update({
      where: { id: plan.id },
      data: { syncStatus: newSyncStatus }
    });

    // Trigger alerts if needed
    if (Math.abs(variance.mrr) > 15) {
      await this.createVarianceAlert(metric, plan, variance);
    }
  }

  /**
   * Calculate variance between actual and planned
   */
  private calculateVariance(metric: Metric, plan: BusinessPlan) {
    const targetMRRForMonth = this.calculateProRatedTarget(
      plan.targetMRR,
      plan.targetDate,
      metric.date
    );

    const mrrVariance = ((metric.mrr - targetMRRForMonth) / targetMRRForMonth) * 100;
    const burnVariance = ((metric.burnRate - plan.expectedBurnRate) / plan.expectedBurnRate) * 100;

    let status: 'ON_TRACK' | 'LAGGING' | 'EXCEEDING' | 'MONITOR';

    if (mrrVariance >= -5 && mrrVariance <= 10) status = 'ON_TRACK';
    else if (mrrVariance < -15) status = 'LAGGING';
    else if (mrrVariance > 20) status = 'EXCEEDING';
    else status = 'MONITOR';

    return { mrr: mrrVariance, burn: burnVariance, status };
  }

  /**
   * Generate financial projection from business plan assumptions
   */
  private async generateProjectionFromPlan(plan: BusinessPlan) {
    const venture = await prisma.venture.findUnique({
      where: { id: plan.ventureId },
      include: { metrics: { orderBy: { date: 'desc' }, take: 1 } }
    });

    const currentMRR = venture.metrics[0]?.mrr || 0;
    const monthsToTarget = this.calculateMonthsToTarget(new Date(), plan.targetDate);
    const requiredGrowthRate = this.calculateRequiredGrowthRate(
      currentMRR,
      plan.targetMRR,
      monthsToTarget
    );

    const projection = await prisma.financialProjection.create({
      data: {
        name: `Business Plan Baseline (v${plan.version})`,
        ventureId: plan.ventureId,
        startDate: new Date(),
        endDate: plan.targetDate,
        assumptions: {
          revenue: {
            baseRevenue: currentMRR,
            growthRate: requiredGrowthRate,
            targetRevenue: plan.targetMRR
          },
          expenses: {
            burnRate: plan.expectedBurnRate,
            salaryGrowth: 0.05 // 5% monthly (hiring)
          }
        },
        projections: this.calculateMonthlyProjections({
          baseRevenue: currentMRR,
          targetRevenue: plan.targetMRR,
          growthRate: requiredGrowthRate,
          burnRate: plan.expectedBurnRate,
          months: monthsToTarget
        })
      }
    });

    return projection;
  }

  /**
   * Create alert when actual deviates from plan
   */
  private async createVarianceAlert(
    metric: Metric,
    plan: BusinessPlan,
    variance: { mrr: number; burn: number; status: string }
  ) {
    const severity = Math.abs(variance.mrr) > 30 ? 'CRITICAL' :
                     Math.abs(variance.mrr) > 15 ? 'WARNING' : 'INFO';

    await prisma.financialAlert.create({
      data: {
        ventureId: metric.ventureId,
        type: variance.mrr < 0 ? 'MRR_BELOW_TARGET' : 'MRR_ABOVE_TARGET',
        severity,
        title: variance.mrr < 0
          ? 'MRR Trending Below Business Plan'
          : 'MRR Exceeding Business Plan',
        message: `Current MRR (RM${metric.mrr}) is ${Math.abs(variance.mrr).toFixed(1)}% ${variance.mrr < 0 ? 'below' : 'above'} business plan target.`,
        suggestedAction: variance.mrr < 0
          ? 'Consider reviewing GTM strategy or adjusting targets in business plan'
          : 'Excellent progress! Consider increasing targets in business plan',
        relatedPlanSection: 'gtmStrategy'
      }
    });
  }
}

// Export singleton
export const syncService = new SyncService();
```

---

### 5.2 Webhook Integration Points

**Trigger Syncs on Database Events:**

```typescript
// API Route: /api/webhooks/internal/business-plan-updated
export async function POST(req: Request) {
  const { planId } = await req.json();

  await syncService.syncPlanToFinance(planId);

  return Response.json({ success: true });
}

// API Route: /api/webhooks/internal/metric-created
export async function POST(req: Request) {
  const { metricId } = await req.json();

  await syncService.syncFinanceToPlan(metricId);

  return Response.json({ success: true });
}

// Prisma Middleware (Alternative: Trigger syncs automatically)
prisma.$use(async (params, next) => {
  const result = await next(params);

  // After BusinessPlan create/update
  if (params.model === 'BusinessPlan' &&
      (params.action === 'create' || params.action === 'update')) {
    await syncService.syncPlanToFinance(result.id);
  }

  // After Metric create
  if (params.model === 'Metric' && params.action === 'create') {
    await syncService.syncFinanceToPlan(result.id);
  }

  return result;
});
```

---

### 5.3 Cron Jobs for Continuous Sync

```typescript
// cron/daily-sync.ts (Runs every day at 2am)
export async function runDailySync() {
  console.log('Running daily financial sync...');

  // 1. Sync all venture metrics
  const ventures = await prisma.venture.findMany({
    include: {
      metrics: {
        orderBy: { date: 'desc' },
        take: 1
      },
      businessPlan: true
    }
  });

  for (const venture of ventures) {
    if (venture.metrics[0]) {
      await syncService.syncFinanceToPlan(venture.metrics[0].id);
    }
  }

  // 2. Check for outdated projections
  const outdatedProjections = await prisma.financialProjection.findMany({
    where: {
      status: 'ACTIVE',
      updatedAt: { lt: thirtyDaysAgo }
    }
  });

  for (const projection of outdatedProjections) {
    await prisma.financialProjection.update({
      where: { id: projection.id },
      data: { status: 'OUTDATED' }
    });
  }

  console.log('Daily sync complete.');
}

// Register cron job (Vercel Cron or similar)
// vercel.json
{
  "crons": [{
    "path": "/api/cron/daily-sync",
    "schedule": "0 2 * * *"
  }]
}
```

---

## 6. Data Flow Diagrams

### 6.1 Plan → Finance Flow

```
┌─────────────────────────────────────────────────────────┐
│ USER ACTION: Update Business Plan                       │
│ (Set target MRR, expected CAC, burn rate)               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ SYSTEM: Save BusinessPlan record                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ TRIGGER: Prisma middleware or webhook                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ SYNC SERVICE: syncPlanToFinance(planId)                 │
│ ├─ Update Venture.targetMRR                             │
│ ├─ Generate/update FinancialProjection                  │
│ └─ Set BusinessPlan.syncStatus = 'IN_SYNC'              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ RESULT: Financial dashboard shows new targets           │
└─────────────────────────────────────────────────────────┘
```

---

### 6.2 Finance → Plan Flow

```
┌─────────────────────────────────────────────────────────┐
│ EVENT: New Stripe payment (MRR increases)               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ WEBHOOK: /api/webhooks/stripe                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ SYSTEM: Create Metric record                            │
│ (mrr: RM15k, date: today)                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ TRIGGER: Prisma middleware                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ SYNC SERVICE: syncFinanceToPlan(metricId)               │
│ ├─ Fetch BusinessPlan                                   │
│ ├─ Calculate variance (actual vs target)                │
│ ├─ Update Metric.mrrVsTarget = -25%                     │
│ ├─ Update BusinessPlan.syncStatus = 'ACTUAL_BELOW_TARGET'│
│ └─ Create FinancialAlert if variance >15%               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ RESULT: Alert shown on dashboard                        │
│ "Brozkey MRR 25% below target → Review GTM strategy"    │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Update Prisma schema with sync fields
- [ ] Create SyncService class
- [ ] Implement basic Plan → Finance sync
- [ ] Test: Updating business plan updates venture targets

### Phase 2: Variance Tracking (Week 3-4)
- [ ] Implement Finance → Plan sync
- [ ] Build variance calculation logic
- [ ] Create FinancialAlert generation
- [ ] Test: New metric triggers comparison and alert

### Phase 3: UI Integration (Week 5-6)
- [ ] Build unified venture dashboard
- [ ] Add bidirectional navigation links
- [ ] Create unified global dashboard
- [ ] Test: Navigate seamlessly between plans and financials

### Phase 4: Automated Workflows (Week 7-8)
- [ ] Implement monthly financial review cron job
- [ ] Build projection regeneration workflow
- [ ] Create email reports with plan vs actual comparison
- [ ] Test: Monthly report includes both strategy and financials

### Phase 5: Advanced Features (Week 9-10)
- [ ] Build unified pitch deck generator
- [ ] Implement investor report generation
- [ ] Add scenario comparison (old plan vs new plan)
- [ ] Test: Generate investor-ready report with one click

---

## 8. Success Metrics

### 8.1 Technical Metrics
- ✅ Sync latency <1 second (plan update → finance update)
- ✅ 100% of business plan changes trigger financial alerts
- ✅ Zero data inconsistencies between systems
- ✅ Alert accuracy: >95% (no false positives)

### 8.2 User Experience Metrics
- ✅ Founder can answer "How is Brozkey performing vs plan?" in <10 seconds
- ✅ Investor report generation time <60 seconds
- ✅ Zero manual data entry between systems
- ✅ Weekly usage: Founder checks unified dashboard 5+ times/week

---

## 9. Future Enhancements

**Q3 2025:**
- AI-powered insights: "MRR lagging → Suggest specific GTM improvements"
- Predictive alerts: "Based on trend, you'll miss Q4 target"
- Auto-rebalancing: "Adjust targets based on actual performance"

**Q4 2025:**
- Collaborative editing: Venture CEOs update plans, auto-syncs to financials
- Real-time dashboards: Live MRR updates on business plan page
- Integration with Linear: Link goals to OKRs from business plan

**2026+:**
- Public investor portal: Read-only unified view of strategy + financials
- AI strategy advisor: "Your burn is high, consider extending runway"
- Benchmarking: Compare your plan vs actual against similar ventures

---

**END OF INTEGRATION ARCHITECTURE DOCUMENT**
