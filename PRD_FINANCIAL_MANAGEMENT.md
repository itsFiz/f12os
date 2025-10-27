# Product Requirements Document: Financial Management System
## F12OS - Financial Intelligence & Treasury Module

---

## Document Control

| Attribute | Detail |
|-----------|--------|
| **Product Name** | F12 Financial Intelligence System |
| **Module Route** | `/finance` |
| **Owner** | Hafiz "Fiz" Kadir |
| **Target Audience** | F12 Holdings CFO, Founder, Venture Finance Teams, Board Members |
| **Created** | 2025-01-22 |
| **Version** | 1.0 |
| **Status** | Planning Phase (2025 Execution) |

---

## 1. Executive Summary

### 1.1 Vision
Create a unified financial operating system that tracks every financial dimension of F12 Holdings—from personal net worth progression to venture-level MRR, burn rates, portfolio valuations, and path to RM150M net worth by 2035.

### 1.2 Success Metrics
- **Transparency**: Real-time visibility into all financial metrics (no manual spreadsheet updates)
- **Accountability**: Automated alerts when burn rate exceeds targets or runway drops below 6 months
- **Strategic Clarity**: Visual dashboards that answer "Am I on track to RM150M by 2035?"
- **Velocity**: Generate board-ready financial reports in under 60 seconds

### 1.3 Core Problem
Financial data is currently scattered across:
- Personal bank accounts (multiple institutions)
- Venture Stripe dashboards (Brozkey, CareerRPG, ServisLah)
- Investment platforms (stocks, BTC, real estate)
- Mental math and spreadsheets

**Pain Points:**
- No consolidated view of total net worth
- Can't compare venture financial health side-by-side
- Burn rate and runway calculations are manual and error-prone
- No alerts when financial metrics cross danger thresholds
- Can't visualize progress toward 2035 goals

---

## 2. Product Goals & Non-Goals

### 2.1 Goals
✅ Track personal net worth progression toward RM150M (2035 target)
✅ Monitor venture-level MRR, ARR, burn rate, and runway for all 12 ventures
✅ Consolidate investment portfolios (stocks, BTC, real estate)
✅ Automate financial reporting (monthly snapshots, quarterly board reports)
✅ Provide early warning alerts for financial risks
✅ Link financial projections to business plans

### 2.2 Non-Goals
❌ Replace accounting software (use Xero/QuickBooks for compliance)
❌ Tax filing automation (hire accountants for this)
❌ Payment processing (Stripe already handles this)
❌ Complex derivative/options modeling (focus on core asset classes)

---

## 3. User Personas

### 3.1 Primary: The Founder (You)
**Role**: Chairman of F12 Holdings, CTO, Chief Capital Allocator
**Needs**:
- Morning dashboard: "What's my net worth today?"
- Portfolio rebalancing decisions: "Should I sell stock to buy more BTC?"
- Venture prioritization: "Which venture needs cash injection?"
- Goal tracking: "Am I on pace for RM150M by 2035?"

**Key User Stories:**
- "I wake up, open F12OS, and see my net worth increased RM50k this month"
- "Brozkey's burn rate spiked—I get an alert before they run out of runway"
- "I'm in an investor meeting and need to show consolidated F12 Holdings financials"

### 3.2 Secondary: Venture CFOs (Future Hires)
**Role**: CFO of Brozkey, CareerRPG, Finnect, etc.
**Needs**:
- Own their venture's financial forecast
- Track unit economics (CAC, LTV, payback period)
- Request funding from F12 Holdings treasury
- Report upward to F12 board

### 3.3 Tertiary: Board Members & Investors
**Role**: External stakeholders (read-only access)
**Needs**:
- Quarterly financial performance summaries
- Venture-by-venture health scores
- F12 Holdings consolidated balance sheet
- Risk indicators and alerts

---

## 4. Core Features & Specifications

### 4.1 Personal Finance Dashboard (Net Worth Tracker)

**Goal: Track path to RM150M net worth by 2035**

#### 4.1.1 Net Worth Breakdown
```typescript
interface NetWorthSnapshot {
  id: string;
  date: Date;

  // Assets
  liquidCash: number;           // Bank accounts
  investments: {
    stocks: number;             // Public equities
    btc: number;                // Bitcoin holdings
    crypto: number;             // Other crypto
    privateEquity: number;      // F12 Holdings shares
  };
  realEstate: {
    primary: number;            // H Tower penthouse
    investment: number;         // SEAlicon Valley land, townhouses
    commercial: number;         // Business Park
  };
  ventures: {
    brozkey: number;            // Equity valuation
    careerRPG: number;
    servisLah: number;
    // ... all 12 ventures
  };

  // Liabilities
  liabilities: {
    loans: number;              // RM100k loan
    mortgages: number;
    creditCards: number;
  };

  // Calculated
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;

  // Targets
  targetNetWorth: number;       // From vision board
  progressPercent: number;      // % toward goal
}
```

#### 4.1.2 Income & Expense Tracking
```typescript
interface MonthlyFinancials {
  id: string;
  month: number;
  year: number;

  // Income Streams
  income: {
    salary: number;             // RM13k/month base
    bonuses: number;            // PAT bonus (up to RM295k)
    ventures: {
      brozkey: number;          // Dividends/distributions
      careerRPG: number;
      lifeOfFiz: number;        // YouTube AdSense, sponsorships
      // ... all revenue-generating ventures
    };
    investments: {
      stockDividends: number;
      rentalIncome: number;
      interestIncome: number;
    };
    other: number;
  };
  totalIncome: number;

  // Expenses
  expenses: {
    personal: {
      housing: number;          // Rent/mortgage
      food: number;
      transport: number;
      insurance: number;
      subscriptions: number;
      entertainment: number;
      travel: number;
    };
    business: {
      salaries: number;         // Team payroll
      software: number;         // SaaS subscriptions
      marketing: number;
      infrastructure: number;   // Vercel, Railway
      legal: number;
      office: number;
    };
    debtPayment: number;        // Loan repayments
  };
  totalExpenses: number;

  // Calculated
  netCashFlow: number;          // Income - Expenses
  savingsRate: number;          // % of income saved
  burnRate: number;             // Monthly cash burn
  runway: number;               // Months until cash depletes
}
```

#### 4.1.3 Visual Components

**1. Hero Metric Card**
```
╔══════════════════════════════════════════════════╗
║           YOUR NET WORTH JOURNEY                ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║             RM 3,254,000                         ║
║         Current Net Worth                        ║
║                                                  ║
║    RM150M Target (2035) · 2.2% Complete         ║
║                                                  ║
║    ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      ║
║                                                  ║
║    ↑ +RM 127,000 (4.1%) this month              ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

**2. Net Worth Chart (Time Series)**
- Line chart showing net worth growth from 2025 → 2035
- Target trajectory line (what growth rate needed)
- Actual progress line (current path)
- Milestone markers: RM3M (2025), RM10M (2028), RM50M (2030), RM150M (2035)

**3. Asset Allocation Pie Chart**
- Ventures: 35% (RM1.1M)
- Real Estate: 30% (RM976k)
- Investments: 25% (RM814k)
- Cash: 10% (RM325k)

**4. Cash Flow Heatmap (12-Month View)**
| Month | Income | Expenses | Net | Runway |
|-------|--------|----------|-----|--------|
| Jan 25 | RM45k | RM32k | +RM13k | 18mo |
| Feb 25 | RM52k | RM38k | +RM14k | 19mo |
| Mar 25 | RM38k | RM41k | -RM3k | 17mo |

---

### 4.2 Venture Financial Dashboard

**Goal: Monitor financial health of all 12 ventures**

#### 4.2.1 Venture Financial Model
```typescript
interface VentureFinancials {
  ventureId: string;
  ventureName: string;

  // Revenue
  mrr: number;                  // Monthly Recurring Revenue
  arr: number;                  // Annual Recurring Revenue (MRR * 12)
  growthRate: number;           // MoM growth %

  // Unit Economics
  customers: number;
  arpu: number;                 // Average Revenue Per User
  cac: number;                  // Customer Acquisition Cost
  ltv: number;                  // Lifetime Value
  ltvCacRatio: number;          // LTV:CAC (target: 3:1)
  paybackPeriod: number;        // Months to recover CAC

  // Expenses
  expenses: {
    salaries: number;
    infrastructure: number;     // Hosting, SaaS tools
    marketing: number;
    operations: number;
  };
  totalExpenses: number;

  // Cash Management
  cashBalance: number;
  burnRate: number;             // Monthly cash burn
  runway: number;               // Months of runway remaining

  // Funding
  funding: {
    stage: string;              // "Pre-Seed", "Seed", "Series A"
    totalRaised: number;
    lastRoundDate: Date;
    lastRoundAmount: number;
    investors: string[];
  };

  // Valuation
  valuation: number;
  valuationMethod: string;      // "Revenue Multiple", "Comparable", "VC Method"

  // Status
  status: "PROFITABLE" | "GROWTH" | "BURN" | "CRITICAL";
  alerts: Alert[];
}

interface Alert {
  type: "RUNWAY_LOW" | "BURN_SPIKE" | "GROWTH_STALLED" | "MRR_TARGET_MISSED";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  triggeredAt: Date;
}
```

#### 4.2.2 Venture Comparison Matrix

**Visual: Sortable Table**

| Venture | MRR | Growth | Burn | Runway | LTV:CAC | Status |
|---------|-----|--------|------|--------|---------|--------|
| Brozkey | RM12k | +18% | RM8k | 15mo | 2.8:1 | 🟢 Growth |
| CareerRPG | RM0 | — | RM15k | 6mo | — | 🔴 Critical |
| ServisLah | RM3k | +5% | RM6k | 9mo | 1.5:1 | 🟡 Burn |
| Life of Fiz | RM8k | +12% | RM2k | Infinite | — | 🟢 Profitable |
| Finnect | RM0 | — | RM25k | 4mo | — | 🔴 Critical |

**Color Coding:**
- 🟢 Green: Profitable or healthy runway (12+ months)
- 🟡 Yellow: Burning cash but manageable (6-12 months)
- 🔴 Red: Critical runway (<6 months) or negative unit economics

#### 4.2.3 MRR Progression Chart (Per Venture)

**Line chart showing MRR over time:**
- Historical data (actual performance)
- Target MRR trajectory (from business plan)
- Milestone markers (e.g., "RM10k MRR", "RM100k MRR", "RM1M MRR")

**Example: Brozkey MRR Chart**
```
MRR (RM)
  100k  |                                    ╱ Target (2028)
        |                                  ╱
   50k  |                              ╱
        |                          ╱
   10k  |                    ╱──── Actual
        |              ╱───
    1k  |      ╱──●──
        |●───
     0  └──────────────────────────────────────────→
        2025  2026   2027   2028   2029   2030
```

---

### 4.3 Investment Portfolio Tracker

**Goal: Monitor stocks, BTC, and other investments**

#### 4.3.1 Portfolio Model
```typescript
interface InvestmentPortfolio {
  id: string;
  date: Date;

  // Stock Portfolio
  stocks: {
    totalValue: number;
    holdings: Array<{
      ticker: string;           // "AAPL", "GOOGL"
      shares: number;
      costBasis: number;        // Average purchase price
      currentPrice: number;
      marketValue: number;
      gainLoss: number;
      gainLossPercent: number;
    }>;
  };

  // Crypto Portfolio
  crypto: {
    totalValue: number;
    holdings: Array<{
      asset: string;            // "BTC", "ETH"
      amount: number;
      costBasis: number;
      currentPrice: number;
      marketValue: number;
      gainLoss: number;
      gainLossPercent: number;
    }>;
  };

  // Target Allocation (from vision board)
  targetAllocation: {
    stocks: number;             // % of portfolio
    btc: number;
    cash: number;
    ventures: number;
    realEstate: number;
  };

  // Actual vs Target
  allocationDrift: {
    stocks: number;             // Difference from target
    btc: number;
    cash: number;
    ventures: number;
    realEstate: number;
  };
}
```

#### 4.3.2 Portfolio Dashboard

**1. Portfolio Value Card**
```
╔════════════════════════════════════════════╗
║       INVESTMENT PORTFOLIO                ║
╠════════════════════════════════════════════╣
║                                            ║
║            RM 814,000                      ║
║         Total Portfolio Value              ║
║                                            ║
║    ↑ +RM 42,000 (5.4%) this month         ║
║                                            ║
║    Stocks: RM450k | Crypto: RM364k        ║
║                                            ║
╚════════════════════════════════════════════╝
```

**2. Asset Allocation vs Target**
```
Asset Class     Actual    Target    Drift
─────────────────────────────────────────
Stocks          55%       50%       +5%  ⚠️
Bitcoin         45%       40%       +5%  ⚠️
Cash             0%       10%      -10%  🔴

Rebalance Suggestion: Sell RM81k BTC, move to cash
```

**3. Holdings Table**
| Asset | Amount | Cost Basis | Current | Gain/Loss | % |
|-------|--------|------------|---------|-----------|---|
| BTC | 0.5 | RM120k | RM364k | +RM244k | +203% |
| AAPL | 100 | RM18k | RM42k | +RM24k | +133% |
| GOOGL | 50 | RM9k | RM15k | +RM6k | +67% |

---

### 4.4 Financial Projections & Modeling

**Goal: Forecast future financial state based on assumptions**

#### 4.4.1 Projection Model
```typescript
interface FinancialProjection {
  id: string;
  name: string;                 // "Conservative 2026", "Aggressive 2026"
  ventureId?: string;           // Optional: venture-specific
  startDate: Date;
  endDate: Date;

  // Assumptions
  assumptions: {
    revenue: {
      baseRevenue: number;      // Starting MRR/ARR
      growthRate: number;       // Monthly % growth
      churnRate: number;        // % customers lost per month
    };
    expenses: {
      salaries: number;         // Monthly payroll
      salaryGrowth: number;     // % increase (new hires)
      infrastructure: number;
      marketing: number;        // CAC * new customers
      operations: number;
    };
    funding: {
      rounds: Array<{
        date: Date;
        amount: number;
        dilution: number;       // % equity given up
      }>;
    };
  };

  // Calculated Projections (monthly)
  projections: Array<{
    month: Date;
    revenue: number;
    expenses: number;
    netIncome: number;
    cashBalance: number;
    runway: number;
    customers: number;
    valuation: number;
  }>;
}
```

#### 4.4.2 Projection Dashboard

**1. Scenario Comparison**
```
Scenario            2026 ARR    Cash Runway    Valuation
──────────────────────────────────────────────────────────
Conservative        RM240k      9 months       RM3M
Base Case           RM480k      18 months      RM6M
Aggressive          RM960k      36 months      RM12M
```

**2. Projection Chart**
- Line chart showing 3 scenarios
- X-axis: Time (months)
- Y-axis: MRR or Cash Balance
- Shaded confidence intervals

**3. Sensitivity Analysis**
"If growth rate drops from 10% to 5%, runway decreases from 18mo to 9mo"

---

### 4.5 Financial Alerts & Automation

**Goal: Never miss a critical financial event**

#### 4.5.1 Alert Types
```typescript
enum AlertType {
  // Personal Finance
  NET_WORTH_MILESTONE = "Net worth crossed RM10M!",
  SAVINGS_RATE_LOW = "Savings rate dropped below 30%",
  BURN_SPIKE = "Monthly expenses up 25%",

  // Venture Finance
  RUNWAY_LOW = "Brozkey has <6 months runway",
  MRR_MILESTONE = "Brozkey hit RM10k MRR!",
  GROWTH_STALLED = "CareerRPG MRR flat for 3 months",
  CAC_HIGH = "CAC increased 50% this month",

  // Investments
  PORTFOLIO_REBALANCE = "Portfolio drift exceeds 10%",
  BTC_PRICE_ALERT = "BTC crossed $100k",
  STOCK_GAIN = "AAPL position up 100%",

  // Treasury
  LOW_CASH = "F12 Holdings cash below RM100k",
  FUNDING_NEEDED = "3 ventures need capital injection"
}

interface Alert {
  id: string;
  type: AlertType;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  actionRequired: boolean;
  suggestedAction?: string;
  createdAt: Date;
  dismissedAt?: Date;
}
```

#### 4.5.2 Alert Dashboard

**Notification Center (Top Nav)**
```
🔔 (3)  ← Badge shows unread alerts

Dropdown:
─────────────────────────────────────────
🔴 CRITICAL: Finnect runway <4 months
   Consider pausing hiring or raising bridge

🟡 WARNING: Portfolio drift at 12%
   Rebalance: Sell RM81k BTC → Cash

🟢 INFO: Life of Fiz hit RM10k MRR!
   Congrats! New milestone achieved
─────────────────────────────────────────
View All Alerts →
```

#### 4.5.3 Automated Reports

**Weekly Email Report:**
- Net worth change
- Top 3 performing ventures
- Critical alerts
- Action items

**Monthly Board Report (PDF):**
- Consolidated financials
- Venture comparison matrix
- Portfolio performance
- Strategic recommendations

---

### 4.6 Treasury Management (F12 Holdings Level)

**Goal: Manage capital allocation across all ventures**

#### 4.6.1 Treasury Model
```typescript
interface TreasurySnapshot {
  id: string;
  date: Date;

  // F12 Holdings Consolidated
  totalCash: number;            // Available capital
  reserves: number;             // Emergency fund
  deployable: number;           // Capital ready to allocate

  // Capital Deployment
  allocations: Array<{
    ventureId: string;
    amount: number;
    purpose: string;            // "Seed funding", "Growth capital"
    date: Date;
    expectedReturn: number;     // IRR projection
  }>;

  // Capital Requests
  requests: Array<{
    ventureId: string;
    requestedAmount: number;
    justification: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>;

  // Returns
  returns: Array<{
    ventureId: string;
    type: "DIVIDEND" | "EXIT" | "BUYBACK";
    amount: number;
    returnMultiple: number;     // e.g., 3.2x
    irr: number;                // Internal Rate of Return %
    date: Date;
  }>;
}
```

#### 4.6.2 Capital Allocation Dashboard

**1. Treasury Overview**
```
╔════════════════════════════════════════════╗
║       F12 HOLDINGS TREASURY               ║
╠════════════════════════════════════════════╣
║                                            ║
║  Total Cash:         RM 2,500,000         ║
║  Reserves (20%):     RM   500,000         ║
║  Deployable:         RM 2,000,000         ║
║                                            ║
║  Deployed YTD:       RM 1,200,000         ║
║  Avg IRR:            28%                   ║
║                                            ║
╚════════════════════════════════════════════╝
```

**2. Capital Requests Queue**
| Venture | Amount | Purpose | Runway | Urgency | Action |
|---------|--------|---------|--------|---------|--------|
| Finnect | RM500k | Seed round | 4mo | 🔴 HIGH | Approve |
| CareerRPG | RM200k | Marketing | 6mo | 🟡 MED | Review |
| ServisLah | RM100k | Hiring | 9mo | 🟢 LOW | Defer |

**3. Portfolio Performance**
| Venture | Invested | Valuation | Multiple | IRR | Status |
|---------|----------|-----------|----------|-----|--------|
| Brozkey | RM300k | RM4.5M | 15x | 82% | 🟢 Scaling |
| Life of Fiz | RM50k | RM800k | 16x | 95% | 🟢 Profitable |
| CareerRPG | RM500k | RM1.5M | 3x | 35% | 🟡 Growth |

---

## 5. User Interface & Experience

### 5.1 Navigation Structure
```
/finance
  ├── /dashboard              → Overview (net worth, alerts, quick stats)
  ├── /personal               → Personal finance (income, expenses, net worth)
  │   ├── /net-worth          → Net worth tracker & projection
  │   ├── /cash-flow          → Monthly income/expense management
  │   └── /goals              → Financial goal tracking (RM150M by 2035)
  ├── /ventures               → All venture financials
  │   ├── /overview           → Comparison matrix
  │   ├── /[ventureId]        → Individual venture dashboard
  │   │   ├── /revenue        → MRR, ARR, growth
  │   │   ├── /expenses       → Burn rate, runway
  │   │   ├── /unit-economics → CAC, LTV, payback
  │   │   └── /projections    → Financial forecasts
  ├── /investments            → Portfolio (stocks, BTC, crypto)
  │   ├── /portfolio          → Holdings & performance
  │   ├── /allocation         → Target vs actual allocation
  │   └── /rebalance          → Rebalancing suggestions
  ├── /treasury               → F12 Holdings capital management
  │   ├── /overview           → Cash, reserves, deployable
  │   ├── /allocations        → Capital deployed to ventures
  │   ├── /requests           → Pending capital requests
  │   └── /returns            → ROI from ventures
  ├── /projections            → Financial modeling
  │   ├── /scenarios          → Compare projections
  │   └── /new                → Create new projection
  ├── /alerts                 → All financial alerts
  └── /reports                → Generate board reports
```

### 5.2 Dashboard View (Landing Page)

**Layout: 3-Column Grid**

**Column 1: Personal Finance**
- Net Worth Card (hero metric)
- Net worth chart (time series)
- Cash flow this month

**Column 2: Ventures**
- MRR leaderboard (top 5 ventures)
- Critical alerts (runway <6 months)
- Growth chart (aggregate F12 Holdings MRR)

**Column 3: Investments & Treasury**
- Portfolio value card
- Asset allocation pie chart
- Capital deployment summary

**Bottom: Recent Activity Feed**
- "Brozkey MRR increased to RM12.5k (+8%)"
- "Portfolio rebalance suggested: Sell RM81k BTC"
- "Finnect requested RM500k seed funding"

---

### 5.3 Personal Net Worth View

**Hero Section:**
```
╔════════════════════════════════════════════════════════╗
║              PATH TO RM150M NET WORTH                 ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║                   RM 3,254,000                         ║
║               Current Net Worth                        ║
║                                                        ║
║   RM150M Target (2035) · 2.2% Complete · 10.2 years   ║
║                                                        ║
║   ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        ║
║                                                        ║
║   Avg Monthly Growth: RM 45k (+1.4%)                   ║
║   Required Growth: RM 1.2M/month (36.8%) 🔴           ║
║   Status: Behind Pace - Accelerate Growth              ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

**Asset Breakdown (Expandable Cards):**
1. Ventures (RM1.1M) - Click to see per-venture valuations
2. Real Estate (RM976k) - Properties list
3. Investments (RM814k) - Stocks + crypto
4. Cash (RM325k) - Bank accounts

**Liabilities:**
- Loan: RM100k (18 months remaining)

**Net Worth Chart:**
- Historical data (actual)
- Target trajectory (what's needed)
- Milestone markers

---

### 5.4 Venture Financial View

**Venture Selector Dropdown:**
[Select Venture: Brozkey ▼]

**4-Tab Layout:**

**Tab 1: Overview**
- MRR card (RM12.5k, +8% MoM)
- Burn rate card (RM8k/month)
- Runway card (15 months)
- Status: 🟢 Healthy Growth

**Tab 2: Revenue**
- MRR chart (time series)
- ARR progression
- Customer count
- ARPU trend

**Tab 3: Expenses & Burn**
- Expense breakdown (pie chart)
- Burn rate trend
- Runway projection
- Cost per customer

**Tab 4: Unit Economics**
- CAC: RM350
- LTV: RM980
- LTV:CAC: 2.8:1 (🟡 Below target 3:1)
- Payback Period: 3.2 months

---

### 5.5 Investment Portfolio View

**Portfolio Summary Card:**
- Total Value: RM814k
- Gain/Loss: +RM124k (+18%)
- Top Performer: BTC (+203%)

**Holdings Table (Sortable):**
| Asset | Amount | Cost | Current | Gain/Loss | % | Actions |
|-------|--------|------|---------|-----------|---|---------|
| BTC | 0.5 | RM120k | RM364k | +RM244k | +203% | Sell/Buy |
| AAPL | 100 | RM18k | RM42k | +RM24k | +133% | Sell/Buy |

**Allocation vs Target:**
- Circular progress chart for each asset class
- "Rebalance" button when drift >10%

---

## 6. Technical Implementation

### 6.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 + React 19 | Existing stack |
| **Charts** | Recharts | Already in package.json |
| **Database** | PostgreSQL + Prisma | Existing setup |
| **Real-time Data** | Plaid API (bank), Stripe API (MRR), CoinGecko API (crypto) | Automated data sync |
| **Calculations** | Server-side functions | Complex financial math |
| **Reports** | React PDF / Puppeteer | Generate PDFs |

### 6.2 Database Schema

**Extend Existing Models:**

```prisma
// Update existing FinancialSnapshot model
model FinancialSnapshot {
  id          String   @id @default(cuid())

  // Personal Income
  income      Json     // Detailed breakdown
  salary      Float
  bonuses     Float?
  ventureIncome Json?  // Per-venture income
  investmentIncome Float?

  // Personal Expenses
  expenses    Json     // Detailed breakdown
  personalExpenses Float
  businessExpenses Float
  debtPayment Float?

  // Assets
  liquidCash  Float
  stockValue  Float?
  btcValue    Float?
  cryptoValue Float?
  realEstateValue Float?
  venturesValue Json?  // Per-venture valuation

  // Liabilities
  liabilities Json?    // Detailed breakdown
  totalLiabilities Float

  // Calculated
  totalAssets Float
  netWorth    Float
  targetNetWorth Float?
  progressPercent Float?

  // Cash Flow
  netCashFlow Float
  savingsRate Float?
  burnRate    Float?
  runway      Int?     // months

  // Date
  month       Int
  year        Int
  date        DateTime

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([month, year])
  @@index([date])
}

// Update existing Metric model (venture-level)
model Metric {
  id          String   @id @default(cuid())
  ventureId   String
  venture     Venture  @relation(fields: [ventureId], references: [id], onDelete: Cascade)

  // Revenue Metrics
  mrr         Float?
  arr         Float?
  customers   Int?
  arpu        Float?
  growthRate  Float?   // MoM %
  churnRate   Float?

  // Unit Economics
  cac         Float?   // Customer Acquisition Cost
  ltv         Float?   // Lifetime Value
  ltvCacRatio Float?
  paybackPeriod Float? // months

  // Expenses
  expenses    Json?    // Detailed breakdown
  totalExpenses Float?
  burnRate    Float?

  // Cash
  cashBalance Float?
  runway      Int?     // months

  // Metadata
  date        DateTime @default(now())
  createdAt   DateTime @default(now())

  @@index([ventureId, date])
}

// New: Investment Portfolio
model InvestmentPortfolio {
  id          String   @id @default(cuid())
  date        DateTime

  // Summary
  totalValue  Float
  gainLoss    Float
  gainLossPercent Float

  // Holdings (JSON for flexibility)
  stocks      Json?    // Array of stock holdings
  crypto      Json?    // Array of crypto holdings

  // Target Allocation
  targetAllocation Json?
  allocationDrift Json?

  createdAt   DateTime @default(now())

  @@index([date])
}

// New: Financial Projections
model FinancialProjection {
  id          String   @id @default(cuid())
  name        String   // "Conservative 2026"
  ventureId   String?
  venture     Venture? @relation(fields: [ventureId], references: [id])

  startDate   DateTime
  endDate     DateTime

  // Assumptions (JSON)
  assumptions Json

  // Projections (JSON array of monthly data)
  projections Json

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// New: Financial Alerts
model FinancialAlert {
  id          String   @id @default(cuid())
  type        String   // AlertType enum
  severity    String   // INFO, WARNING, CRITICAL

  title       String
  message     String   @db.Text

  actionRequired Boolean @default(false)
  suggestedAction String? @db.Text

  // Optional: Link to entity
  ventureId   String?
  venture     Venture? @relation(fields: [ventureId], references: [id])

  dismissedAt DateTime?
  createdAt   DateTime @default(now())

  @@index([createdAt])
  @@index([dismissedAt])
}

// New: Treasury Management
model TreasurySnapshot {
  id          String   @id @default(cuid())
  date        DateTime

  totalCash   Float
  reserves    Float
  deployable  Float

  allocations Json?    // Array of capital deployments
  requests    Json?    // Array of pending requests
  returns     Json?    // Array of returns received

  createdAt   DateTime @default(now())

  @@index([date])
}

// Add relations to Venture model
model Venture {
  // ... existing fields ...

  metrics     Metric[]
  projections FinancialProjection[]
  alerts      FinancialAlert[]
}
```

### 6.3 API Routes

**Personal Finance:**
- `GET /api/finance/net-worth` - Current net worth
- `GET /api/finance/net-worth/history` - Time series
- `POST /api/finance/snapshots` - Create monthly snapshot
- `GET /api/finance/cash-flow` - Income/expense analysis

**Venture Finance:**
- `GET /api/finance/ventures` - All venture metrics
- `GET /api/finance/ventures/[id]` - Single venture financials
- `POST /api/finance/ventures/[id]/metrics` - Add metric data
- `GET /api/finance/ventures/comparison` - Comparison matrix

**Investments:**
- `GET /api/finance/portfolio` - Current portfolio
- `GET /api/finance/portfolio/history` - Historical performance
- `POST /api/finance/portfolio/holdings` - Update holdings
- `GET /api/finance/portfolio/rebalance` - Get rebalance suggestions

**Projections:**
- `POST /api/finance/projections` - Create projection
- `GET /api/finance/projections/[id]` - Get projection
- `GET /api/finance/projections/compare` - Compare scenarios

**Alerts:**
- `GET /api/finance/alerts` - All alerts (filterable)
- `PATCH /api/finance/alerts/[id]/dismiss` - Dismiss alert
- `POST /api/finance/alerts/check` - Run alert checks (cron)

**Treasury:**
- `GET /api/finance/treasury` - Treasury overview
- `POST /api/finance/treasury/allocate` - Deploy capital
- `POST /api/finance/treasury/requests` - Submit capital request
- `PATCH /api/finance/treasury/requests/[id]` - Approve/reject

**Reports:**
- `POST /api/finance/reports/generate` - Generate PDF report

### 6.4 External Integrations

**Phase 1 (Manual Entry):**
- Admin forms to input data manually
- CSV import for historical data

**Phase 2 (API Integration):**
- **Stripe API** - Auto-sync venture MRR
- **CoinGecko API** - Real-time crypto prices
- **Alpha Vantage / Yahoo Finance API** - Stock prices
- **Plaid API** - Bank account balances (optional, privacy concerns)

---

## 7. Implementation Phases

### Phase 1: Personal Finance Foundation (Week 1-2)
- [ ] Update FinancialSnapshot schema
- [ ] Build net worth tracker dashboard
- [ ] Create manual entry forms
- [ ] Implement net worth chart

### Phase 2: Venture Financials (Week 3-4)
- [ ] Update Metric schema for ventures
- [ ] Build venture comparison matrix
- [ ] Create individual venture dashboards
- [ ] Add MRR/burn rate charts

### Phase 3: Investment Portfolio (Week 5)
- [ ] Create InvestmentPortfolio model
- [ ] Build portfolio dashboard
- [ ] Integrate CoinGecko API for crypto prices
- [ ] Add allocation vs target visualization

### Phase 4: Alerts & Automation (Week 6)
- [ ] Create FinancialAlert model
- [ ] Build alert checking logic
- [ ] Implement notification UI
- [ ] Set up cron jobs for daily checks

### Phase 5: Projections & Modeling (Week 7-8)
- [ ] Create FinancialProjection model
- [ ] Build projection creation UI
- [ ] Implement scenario comparison
- [ ] Add sensitivity analysis

### Phase 6: Treasury & Capital Allocation (Week 9)
- [ ] Create TreasurySnapshot model
- [ ] Build capital request workflow
- [ ] Create portfolio performance view
- [ ] Add IRR calculations

### Phase 7: Reports & Export (Week 10)
- [ ] Design PDF report templates
- [ ] Implement report generation
- [ ] Add email automation
- [ ] Create investor-ready exports

### Phase 8: External Integrations (Week 11-12)
- [ ] Integrate Stripe API for MRR auto-sync
- [ ] Add CoinGecko for real-time crypto
- [ ] Connect stock price APIs
- [ ] Set up data refresh cron jobs

---

## 8. Success Criteria

### 8.1 Quantitative Metrics
- ✅ 100% of financial data consolidated in one system
- ✅ Net worth updated within 24 hours of market close
- ✅ Venture MRR synced daily from Stripe
- ✅ Alerts triggered within 1 hour of threshold breach
- ✅ Report generation completes in <60 seconds

### 8.2 Qualitative Metrics
- ✅ Founder can answer "What's my net worth?" in 5 seconds
- ✅ Board members access financial reports without requesting them
- ✅ Venture CEOs use system for monthly financial reviews
- ✅ Early detection of financial risks (runway depletion)

---

## 9. Future Enhancements (Post-MVP)

**Q3 2025:**
- Mobile app for on-the-go financial checks
- Real-time net worth updates (push notifications)
- Plaid integration for automated bank syncing
- Tax optimization recommendations

**Q4 2025:**
- AI financial advisor chatbot
- Predictive analytics (forecast runway depletion)
- Benchmarking against industry standards
- Multi-currency support (USD, SGD, EUR)

**2026+:**
- Real-time collaboration (CFO + Founder)
- Investor portal (read-only access)
- Integration with cap table management (Carta, Pulley)
- Crypto DeFi tracking (yield farming, staking)

---

## 10. Risk Mitigation

### 10.1 Data Security
- **Encryption**: All financial data encrypted at rest (AES-256)
- **Access Control**: Role-based permissions (Founder, CFO, Read-Only)
- **Audit Logs**: Track all data changes
- **Backups**: Daily automated backups to Cloudflare R2

### 10.2 Data Accuracy
- **Manual Review**: Monthly spot-checks of automated data
- **Reconciliation**: Compare Stripe data vs manual records
- **Version Control**: Historical snapshots prevent data loss

### 10.3 Privacy
- **No Third-Party Sharing**: Financial data never leaves F12OS
- **Optional Integrations**: Plaid/bank APIs are opt-in only
- **Investor Access**: Heavily sanitized, aggregated data only

---

**END OF PRD: FINANCIAL MANAGEMENT SYSTEM**
