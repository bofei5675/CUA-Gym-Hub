# California Tax Mock — Data Model

## Entity Overview

The state is a single flat object managed by React Context + `useReducer`. All entities are nested under a single root state object.

| Entity | Type | Description |
|--------|------|-------------|
| `taxReturn` | Object | Return metadata (id, year, status, timestamps) |
| `personalInfo` | Object | Taxpayer + spouse + address + contact |
| `dependents` | Array | List of dependent persons |
| `income` | Object | W-2s, 1099-INT, 1099-DIV, other income, federal AGI |
| `deductions` | Object | Standard/itemized choice + CA adjustments |
| `credits` | Object | Tax credits (CalEITC, child care, renter's, etc.) |
| `calculations` | Object | Computed tax values (read-only, auto-calculated) |
| `payment` | Object | Refund/payment method and bank info |
| `formProgress` | Object | Current step, completed steps, step errors |
| `ui` | Object | UI state (current view, validation display) |
| `meta` | Object | Session metadata |

---

## Entity Definitions

### taxReturn
```
{
  id: string,                    // "CA540-XXXXXXXXXX" (auto-generated)
  taxYear: number,               // 2024
  status: string,                // "draft" | "in_progress" | "submitted"
  createdAt: string,             // ISO 8601 timestamp
  updatedAt: string,             // ISO 8601 timestamp
  confirmationNumber: string|null // "CA-XXXXXX-XXXXXX" (set on submit)
}
```

### personalInfo
```
{
  filingStatus: string,          // "" | "single" | "married_joint" | "married_separate" | "head_of_household" | "qualifying_widow"
  firstName: string,
  middleInitial: string,         // Single char, auto-uppercase
  lastName: string,
  suffix: string,                // "" | "SR" | "JR" | "II" | "III" | "IV"
  ssn: string,                   // 9 digits, no dashes (stored raw)
  dateOfBirth: string,           // "YYYY-MM-DD"
  spouseFirstName: string,       // Only used when married
  spouseMiddleInitial: string,
  spouseLastName: string,
  spouseSsn: string,             // 9 digits
  spouseDateOfBirth: string,
  address: {
    street: string,              // "123 Main Street"
    apt: string,                 // "Apt 4B"
    city: string,                // "Sacramento"
    state: string,               // Always "CA"
    zip: string                  // "90210" or "90210-1234"
  },
  phone: string,                 // "(555) 123-4567" formatted
  email: string                  // "user@example.com"
}
```

### dependents (Array)
```
[
  {
    id: string,                  // Unique ID (Date.now())
    firstName: string,
    lastName: string,
    ssn: string,                 // 9 digits
    relationship: string,        // "Son" | "Daughter" | "Stepson" | "Stepdaughter" | "Foster child" | "Brother" | "Sister" | "Half brother" | "Half sister" | "Stepbrother" | "Stepsister" | "Grandchild" | "Niece" | "Nephew" | "Parent" | "Other"
    dateOfBirth: string,         // "YYYY-MM-DD"
    monthsLived: number          // 0-12
  }
]
```

### income
```
{
  w2s: [                         // Array of W-2 forms
    {
      id: number,               // Unique ID
      employerName: string,      // "ABC Corporation"
      employerEin: string,       // "12-3456789" (XX-XXXXXXX format)
      wages: string,             // "75000.00" (Box 1)
      federalWithheld: string,   // "12000.00" (Box 2)
      stateWages: string,        // "75000.00" (Box 16)
      stateWithheld: string      // "5000.00" (Box 17)
    }
  ],
  interest1099: [                // Array of 1099-INT forms
    {
      id: number,
      payerName: string,         // "Bank of America"
      amount: string             // "250.00"
    }
  ],
  dividend1099: [                // Array of 1099-DIV forms
    {
      id: number,
      payerName: string,         // "Vanguard"
      ordinaryDividends: string, // "1200.00" (Box 1a)
      qualifiedDividends: string // "800.00" (Box 1b)
    }
  ],
  otherIncome: [                 // Array of other income
    {
      id: number,
      description: string,       // "Freelance consulting"
      amount: string             // "5000.00"
    }
  ],
  federalAgi: number|string      // From federal Form 1040, Line 11
}
```

### deductions
```
{
  type: string,                  // "standard" | "itemized"
  standardAmount: number,        // Auto-calculated from filing status
  itemized: {
    medicalExpenses: number|string,         // Amount exceeding 7.5% of federal AGI
    stateLocalTaxes: number|string,         // SALT
    mortgageInterest: number|string,
    charitableContributions: number|string,
    otherDeductions: number|string
  },
  caAdjustmentsSubtraction: number|string,  // Schedule CA Column B
  caAdjustmentsAddition: number|string      // Schedule CA Column C
}
```

### credits
```
{
  calEitc: {
    eligible: boolean,
    amount: number               // Up to $3,644
  },
  childDependentCare: {
    eligible: boolean,
    expenses: number,            // Total care expenses
    amount: number               // Calculated (expenses * 0.5)
  },
  rentersCredit: {
    eligible: boolean,
    amount: number               // $60 single, $120 joint (auto-set)
  },
  seniorHeadOfHousehold: {
    eligible: boolean,
    amount: number
  },
  jointCustodyHeadOfHousehold: {
    eligible: boolean,
    amount: number
  },
  dependentParent: {
    eligible: boolean,
    amount: number
  },
  otherCredits: [                // Array of custom credits
    {
      id: string,
      code: string,              // Credit code (e.g., "188")
      description: string,
      amount: number
    }
  ]
}
```

### calculations (computed, read-only)
```
{
  totalIncome: number,
  adjustedGrossIncome: number,    // Federal AGI +/- CA adjustments
  totalDeductions: number,
  taxableIncome: number,          // AGI - deductions (min 0)
  taxBeforeCredits: number,       // From CA tax brackets
  exemptionCredits: number,       // $149/person + $461/dependent
  totalNonrefundableCredits: number,
  totalRefundableCredits: number,
  netTax: number,                 // Tax after all credits (min 0)
  totalWithholdings: number,      // Sum of W-2 Box 17
  estimatedPayments: number,      // Placeholder (0)
  totalPayments: number,
  overpayment: number,            // Positive = refund
  amountOwed: number,             // Positive = owe tax
  refundAmount: number            // Same as overpayment
}
```

### payment
```
{
  refundMethod: string,           // "direct_deposit" | "check"
  bankRoutingNumber: string,      // 9 digits
  bankAccountNumber: string,      // Up to 17 digits
  accountType: string,            // "checking" | "savings"
  paymentMethod: string,          // "electronic" | "check" (when owing)
  paymentDate: string             // "YYYY-MM-DD"
}
```

### formProgress
```
{
  currentStep: number,            // 0-based step index
  completedSteps: string[],       // ["personal-info", "dependents", ...]
  stepErrors: {                   // Keyed by step ID
    [stepId]: string[]            // Array of error messages
  }
}
```

### ui
```
{
  currentView: string,            // "welcome" | "filing"
  showValidationErrors: boolean,
  isSaving: boolean,
  showConfirmDialog: boolean,
  activeTooltip: string|null
}
```

### meta
```
{
  lastSavedAt: string|null,       // ISO 8601 timestamp
  sessionExpiresAt: string|null
}
```

---

## Relationships

```
taxReturn 1---* (contains all sections)
personalInfo.filingStatus --> determines:
  - Whether spouseInfo fields are shown (married_joint, married_separate)
  - Standard deduction amount
  - Tax bracket table (single vs. joint)
  - Renter's credit amount ($60 vs $120)

dependents[] --> affects:
  - Exemption credits ($461 per dependent)
  - CalEITC eligibility

income.w2s[].stateWithheld --> calculations.totalWithholdings
income.federalAgi --> calculations.adjustedGrossIncome (starting point)
deductions.type --> which deduction amount is used
credits --> calculations.totalNonrefundableCredits + totalRefundableCredits

calculations.refundAmount > 0 --> show refund method section
calculations.amountOwed > 0 --> show payment method section
```

---

## Suggested createInitialData() with Seed Data

For agent training, the app should start pre-filled with realistic data so the agent can observe and modify values. Here is the recommended seed data:

```javascript
export const initialData = {
  taxReturn: {
    id: 'CA540-2024-DEMO001',
    taxYear: 2024,
    status: 'in_progress',
    createdAt: '2025-02-15T10:30:00.000Z',
    updatedAt: '2025-02-15T10:30:00.000Z',
    confirmationNumber: null
  },

  personalInfo: {
    filingStatus: 'single',
    firstName: 'Maria',
    middleInitial: 'L',
    lastName: 'Santos',
    suffix: '',
    ssn: '592847163',
    dateOfBirth: '1988-06-14',
    spouseFirstName: '',
    spouseMiddleInitial: '',
    spouseLastName: '',
    spouseSsn: '',
    spouseDateOfBirth: '',
    address: {
      street: '2847 Oak Valley Drive',
      apt: 'Unit 12',
      city: 'San Jose',
      state: 'CA',
      zip: '95128'
    },
    phone: '(408) 555-3291',
    email: 'maria.santos@email.com'
  },

  dependents: [],

  income: {
    w2s: [
      {
        id: 1001,
        employerName: 'Bay Area Tech Solutions Inc',
        employerEin: '94-3281756',
        wages: '82500.00',
        federalWithheld: '14200.00',
        stateWages: '82500.00',
        stateWithheld: '4950.00'
      }
    ],
    interest1099: [
      {
        id: 2001,
        payerName: 'Wells Fargo Bank',
        amount: '342.50'
      }
    ],
    dividend1099: [],
    otherIncome: [],
    federalAgi: '82500.00'
  },

  deductions: {
    type: 'standard',
    standardAmount: 5540,
    itemized: {
      medicalExpenses: 0,
      stateLocalTaxes: 0,
      mortgageInterest: 0,
      charitableContributions: 0,
      otherDeductions: 0
    },
    caAdjustmentsSubtraction: 0,
    caAdjustmentsAddition: 0
  },

  credits: {
    calEitc: { eligible: false, amount: 0 },
    childDependentCare: { eligible: false, expenses: 0, amount: 0 },
    rentersCredit: { eligible: true, amount: 60 },
    seniorHeadOfHousehold: { eligible: false, amount: 0 },
    jointCustodyHeadOfHousehold: { eligible: false, amount: 0 },
    dependentParent: { eligible: false, amount: 0 },
    otherCredits: []
  },

  calculations: {}, // Auto-computed by taxCalculator.js

  payment: {
    refundMethod: 'direct_deposit',
    bankRoutingNumber: '',
    bankAccountNumber: '',
    accountType: '',
    paymentMethod: '',
    paymentDate: ''
  },

  formProgress: {
    currentStep: 1,
    completedSteps: ['personal-info'],
    stepErrors: {}
  },

  ui: {
    currentView: 'filing',
    showValidationErrors: false,
    isSaving: false,
    showConfirmDialog: false,
    activeTooltip: null
  },

  meta: {
    lastSavedAt: null,
    sessionExpiresAt: null
  }
};
```

### Why this seed data works for training:
- **Filing status already set** (Single) — agent can change it
- **Name and SSN pre-filled** — agent can verify/modify
- **One W-2 already entered** — agent can add more, edit, or remove
- **One 1099-INT present** — shows the pattern for income entries
- **Renter's credit enabled** — agent can toggle credits
- **Standard deduction selected** — agent can switch to itemized
- **Refund scenario** ($4,950 withheld > tax owed) — agent sees refund flow
- **First step marked complete** — agent picks up mid-flow
- **Bank info empty** — agent must fill it for direct deposit
