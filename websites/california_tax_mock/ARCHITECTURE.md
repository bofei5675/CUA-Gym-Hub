# California Tax Filing System Mock - Architecture Design

## 1. Application Overview

**Real Application**: https://www.ftb.ca.gov/file/ways-to-file/online/calfile/index.asp (California FTB CalFile)
**Core Purpose**: A multi-step California state income tax filing system (Form 540) that guides users through entering personal information, reporting income, claiming deductions and credits, reviewing calculations, and submitting their tax return.

**Design Reference**: Based on the California Franchise Tax Board's CalFile system and Form 540 (California Resident Income Tax Return). The mock simulates the complete filing flow for a California resident.

---

## 2. Core Features (Priority Ordered)

1. **Multi-step form navigation** - Step-by-step wizard with sidebar progress tracking - **High priority**
2. **Personal information entry** - Filing status, name, SSN, address, dependents - **High priority**
3. **Income reporting** - W-2 wages, 1099 interest/dividends, other income sources - **High priority**
4. **Deductions selection** - Standard vs itemized deduction, California adjustments - **High priority**
5. **Tax credits** - California Earned Income Tax Credit (CalEITC), child/dependent care, renter's credit - **High priority**
6. **Tax calculation engine** - Auto-compute tax liability using CA tax brackets - **Medium priority**
7. **Review & submit** - Summary view of all sections, e-sign declaration, confirmation - **Medium priority**
8. **Form validation** - Per-field and per-section validation with error indicators - **Medium priority**
9. **Refund/amount owed display** - Calculate and display refund or balance due - **Medium priority**
10. **Direct deposit setup** - Bank routing/account for refund delivery - **Low priority**

**Out of scope:**
- Real MyFTB account creation/authentication
- PDF generation of Form 540
- Estimated tax payment (Form 540-ES)
- Schedule CA (540) as a separate form
- Alternative Minimum Tax (AMT) calculation

---

## 3. Pages and Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Welcome | Landing page with "Start Filing" and "Continue Return" options |
| `/filing/personal-info` | PersonalInfo | Filing status, name, SSN, date of birth, address |
| `/filing/dependents` | Dependents | Dependent information (name, SSN, relationship) |
| `/filing/income` | Income | W-2 wages, 1099-INT, 1099-DIV, other income |
| `/filing/deductions` | Deductions | Standard vs itemized, California adjustments |
| `/filing/credits` | Credits | CalEITC, child care, renter's credit, other credits |
| `/filing/tax-summary` | TaxSummary | Calculated tax, payments/withholdings, refund or amount owed |
| `/filing/review` | Review | Full return summary, e-sign, submit |
| `/filing/confirmation` | Confirmation | Filing confirmation number, refund timeline |
| `/go` | StateInspector | Debug endpoint for RL state inspection |

---

## 4. Data Structure

```javascript
{
  // Tax return metadata
  "taxReturn": {
    "id": "CA540-XXXXXXXXXX",
    "taxYear": 2024,
    "status": "draft",           // draft | in_progress | submitted
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T10:00:00Z",
    "confirmationNumber": null    // set on submit
  },

  // Filing status and personal information
  "personalInfo": {
    "filingStatus": "",           // single | married_joint | married_separate | head_of_household | qualifying_widow
    "firstName": "",
    "middleInitial": "",
    "lastName": "",
    "suffix": "",                 // SR, JR, III, IV
    "ssn": "",
    "dateOfBirth": "",
    "spouseFirstName": "",
    "spouseMiddleInitial": "",
    "spouseLastName": "",
    "spouseSsn": "",
    "spouseDateOfBirth": "",
    "address": {
      "street": "",
      "apt": "",
      "city": "",
      "state": "CA",
      "zip": ""
    },
    "phone": "",
    "email": ""
  },

  // Dependents
  "dependents": [
    // { id, firstName, lastName, ssn, relationship, dateOfBirth, monthsLived }
  ],

  // Income sources
  "income": {
    "w2s": [
      // { id, employerName, employerEin, wages, federalWithheld, stateWages, stateWithheld }
    ],
    "interest1099": [
      // { id, payerName, amount }
    ],
    "dividend1099": [
      // { id, payerName, ordinaryDividends, qualifiedDividends }
    ],
    "otherIncome": [
      // { id, description, amount }
    ],
    "federalAgi": 0              // From federal Form 1040 line 11
  },

  // Deductions
  "deductions": {
    "type": "standard",           // standard | itemized
    "standardAmount": 0,          // Auto-calculated based on filing status
    "itemized": {
      "medicalExpenses": 0,
      "stateLocalTaxes": 0,       // SALT (capped at $10,000 federally, different for CA)
      "mortgageInterest": 0,
      "charitableContributions": 0,
      "otherDeductions": 0
    },
    "caAdjustmentsSubtraction": 0,  // Schedule CA subtractions
    "caAdjustmentsAddition": 0      // Schedule CA additions
  },

  // Tax credits
  "credits": {
    "calEitc": {
      "eligible": false,
      "amount": 0
    },
    "childDependentCare": {
      "eligible": false,
      "expenses": 0,
      "amount": 0
    },
    "rentersCredit": {
      "eligible": false,
      "amount": 0                   // $60 single, $120 joint
    },
    "seniorHeadOfHousehold": {
      "eligible": false,
      "amount": 0
    },
    "jointCustodyHeadOfHousehold": {
      "eligible": false,
      "amount": 0
    },
    "dependentParent": {
      "eligible": false,
      "amount": 0
    },
    "otherCredits": [
      // { id, code, description, amount }
    ]
  },

  // Tax calculation results (auto-computed, read-only for UI)
  "calculations": {
    "totalIncome": 0,
    "adjustedGrossIncome": 0,       // CA AGI
    "totalDeductions": 0,
    "taxableIncome": 0,
    "taxBeforeCredits": 0,          // From tax table/rate schedule
    "exemptionCredits": 0,          // Personal + dependent exemptions
    "totalNonrefundableCredits": 0,
    "totalRefundableCredits": 0,
    "netTax": 0,
    "totalWithholdings": 0,         // Sum of state withholdings from W-2s
    "estimatedPayments": 0,
    "totalPayments": 0,             // withholdings + estimated + other
    "overpayment": 0,               // If payments > tax
    "amountOwed": 0,                // If tax > payments
    "refundAmount": 0               // = overpayment (if choosing refund)
  },

  // Payment / refund preferences
  "payment": {
    "refundMethod": "direct_deposit",   // direct_deposit | check
    "bankRoutingNumber": "",
    "bankAccountNumber": "",
    "accountType": "",                   // checking | savings
    "paymentMethod": "",                 // electronic | check (if amount owed)
    "paymentDate": ""
  },

  // Form progress and validation
  "formProgress": {
    "currentStep": 0,
    "completedSteps": [],            // ["personal-info", "dependents", ...]
    "stepErrors": {}                 // { "personal-info": ["SSN is required"], ... }
  },

  // UI state
  "ui": {
    "currentView": "welcome",
    "showValidationErrors": false,
    "isSaving": false,
    "showConfirmDialog": false,
    "activeTooltip": null
  },

  // Meta
  "meta": {
    "lastSavedAt": null,
    "sessionExpiresAt": null
  }
}
```

---

## 5. Module Division

### Module A: Personal Information (Implementer-1)

**Components**:
- `components/PersonalInfoForm.jsx` - Filing status, taxpayer name, SSN, DOB, address, phone, email
- `components/SpouseInfo.jsx` - Spouse details (shown when filing status is married_joint or married_separate)
- `components/DependentsList.jsx` - Add/edit/remove dependents table (name, SSN, relationship, DOB, months lived)

**Responsibilities**:
- Filing status radio group (5 options) with conditional spouse fields
- Taxpayer name fields with suffix dropdown
- SSN input with masking (XXX-XX-XXXX format)
- Address form (street, apt, city, state=CA fixed, zip)
- Dependent entry form with add/remove rows
- Per-field validation: required fields, SSN format, zip code format
- Update `state.personalInfo`, `state.dependents`

**Dependencies**: None (reads/writes only its own state sections)

**Data domain**: `state.personalInfo`, `state.dependents`

---

### Module B: Income & Deductions (Implementer-2)

**Components**:
- `components/W2Form.jsx` - W-2 wage entry form (employer name, EIN, wages, withholdings)
- `components/IncomeForm.jsx` - 1099-INT, 1099-DIV, other income entry with add/remove
- `components/DeductionsForm.jsx` - Standard vs itemized toggle, itemized fields, CA adjustments

**Responsibilities**:
- W-2 entry with add/remove multiple employers
- 1099-INT interest income list
- 1099-DIV dividend income list
- Other income entries (description + amount)
- Federal AGI entry field (from federal Form 1040)
- Standard deduction auto-calculation based on filing status (reads `state.personalInfo.filingStatus`)
- Itemized deductions form (medical, SALT, mortgage, charitable, other)
- California adjustment entries (subtractions and additions)
- Validation: amounts must be non-negative numbers, EIN format
- Update `state.income`, `state.deductions`

**Dependencies**: None (reads `state.personalInfo.filingStatus` for standard deduction amount, but does not write to it)

**Data domain**: `state.income`, `state.deductions`

---

### Module C: Credits & Review (Implementer-3)

**Components**:
- `components/CreditsForm.jsx` - Tax credits selection and entry (CalEITC, child care, renter's, etc.)
- `components/TaxSummaryView.jsx` - Computed tax breakdown display (income, deductions, tax, credits, refund/owed)
- `components/ReviewPage.jsx` - Full return summary, e-sign checkbox, submit button
- `components/ConfirmationPage.jsx` - Confirmation number, refund timeline, print option

**Responsibilities**:
- CalEITC eligibility checker (income threshold, filing status)
- Child/dependent care credit form (expenses entry)
- Renter's credit checkbox (income eligibility, $60/$120 amount)
- Other credits list with add/remove
- Tax summary display with line-item breakdown
- Review page with read-only summary of all sections
- E-signature declaration checkbox and date
- Submit action (sets `state.taxReturn.status = "submitted"`)
- Confirmation page with generated confirmation number
- Payment/refund method selection (direct deposit fields, check option)
- Update `state.credits`, `state.payment`, `state.taxReturn`

**Dependencies**: None (reads computed values from `state.calculations` and displays them, but the calculation logic lives in Module D's context)

**Data domain**: `state.credits`, `state.payment`, `state.taxReturn` (partial)

---

### Module D: Integration + Data (Implementer-4)

**Components**:
- `App.jsx` - Main app with routing, layout shell (header, sidebar, main content, footer)
- `context/TaxContext.jsx` - React Context with state, dispatch, tax calculation logic
- `utils/initialState.js` - Default state, session-aware localStorage persistence, deep merge
- `utils/taxCalculator.js` - Pure functions for CA tax computation (brackets, exemptions, credits)
- `utils/validators.js` - Shared validation functions (SSN, EIN, zip, required, numeric)
- `components/Layout.jsx` - Page shell with FTB-style header, step sidebar, footer
- `components/StepSidebar.jsx` - Left sidebar showing filing steps with completion indicators
- `components/WelcomePage.jsx` - Landing page with "Start Filing" / "Continue" buttons
- `pages/Go.jsx` - State inspection endpoint (`/go`)

**Responsibilities**:
1. **State management**: Create TaxContext with useReducer, expose state + dispatch + computed calculations
2. **Tax calculation engine** (`taxCalculator.js`):
   - Total income = sum of W-2 wages + interest + dividends + other
   - California AGI = Federal AGI +/- CA adjustments
   - Taxable income = CA AGI - deductions
   - Tax from bracket table (9 brackets, 1% to 12.3%)
   - Exemption credits ($149 per personal/spouse, $461 per dependent)
   - Apply nonrefundable credits (capped at tax liability)
   - Apply refundable credits (CalEITC)
   - Net tax = tax - credits
   - Refund/owed = payments - net tax
3. **Persistence**: Load/save to localStorage with session ID support (`?sid=`)
4. **Routing**: Configure react-router-dom with nested `/filing/*` routes
5. **Layout**: FTB-styled header (blue/gold), step sidebar with progress indicators, footer
6. **Step navigation**: Previous/Next buttons, step completion tracking
7. **/go endpoint**: Return `{ initial_state, current_state, state_diff }`
8. **Integration**: Import and compose components from Modules A, B, C into page routes
9. **Validation orchestration**: Run validators on step transitions, show error indicators in sidebar

**Dependencies**: Modules A, B, C must provide their components

**Data domain**: All (manages entire state tree, owns calculation logic)

---

## 6. Tax Calculation Reference

### California 2024 Tax Rate Schedule (Single)

| Taxable Income | Tax Rate |
|---------------|----------|
| $0 - $10,412 | 1% |
| $10,413 - $24,684 | 2% |
| $24,685 - $38,959 | 4% |
| $38,960 - $54,081 | 6% |
| $54,082 - $68,350 | 8% |
| $68,351 - $349,137 | 9.3% |
| $349,138 - $418,961 | 10.3% |
| $418,962 - $698,271 | 11.3% |
| $698,272+ | 12.3% |

### Standard Deduction Amounts (2024)

| Filing Status | Amount |
|--------------|--------|
| Single | $5,540 |
| Married Filing Jointly | $11,080 |
| Married Filing Separately | $5,540 |
| Head of Household | $11,080 |
| Qualifying Widow(er) | $11,080 |

### Exemption Credits (2024)

| Type | Credit Amount |
|------|--------------|
| Personal (taxpayer) | $149 |
| Personal (spouse, if joint) | $149 |
| Dependent | $461 each |
| Blind | $149 each |
| Senior (65+) | $149 each |

### Key Credits

| Credit | Amount |
|--------|--------|
| Renter's Credit (Single, AGI <= $50,746) | $60 |
| Renter's Credit (Joint, AGI <= $101,492) | $120 |
| CalEITC | Up to $3,644 (income-based) |

---

## 7. API Endpoints

**Required**:
- `GET /go` - Returns `{ initial_state, current_state, state_diff }` for RL training

**Client-side state operations** (no real backend):
- All form updates happen via React Context dispatch
- Tax calculations run client-side in `taxCalculator.js`
- State persisted to localStorage automatically

---

## 8. Tech Stack

- **Framework**: React 18
- **Build tool**: Vite
- **State management**: React Context + useReducer
- **Styling**: Tailwind CSS
- **Routing**: react-router-dom v6
- **Persistence**: localStorage (session-aware with `?sid=` support)
- **Icons**: lucide-react

**Rationale**:
- Context + useReducer over Redux: form-heavy app with section-based updates, useReducer gives structured actions without Redux boilerplate
- Tailwind CSS: rapid UI development, easy to match FTB's blue/gold government aesthetic
- No backend: pure frontend mock for agent training, all tax calculations are client-side

---

## 9. File Structure

```
california_tax_mock/
├── public/
│   └── ftb-logo.svg                # FTB-style logo
├── src/
│   ├── App.jsx                      # Implementer-4: Main app, routing, layout
│   ├── main.jsx                     # React entry point
│   ├── index.css                    # Tailwind imports + custom styles
│   ├── components/
│   │   ├── Layout.jsx               # Implementer-4: Header, sidebar, footer shell
│   │   ├── StepSidebar.jsx          # Implementer-4: Left navigation with step indicators
│   │   ├── WelcomePage.jsx          # Implementer-4: Landing page
│   │   ├── PersonalInfoForm.jsx     # Implementer-1: Filing status + taxpayer info
│   │   ├── SpouseInfo.jsx           # Implementer-1: Spouse details (conditional)
│   │   ├── DependentsList.jsx       # Implementer-1: Dependents add/edit/remove
│   │   ├── W2Form.jsx              # Implementer-2: W-2 wage entry
│   │   ├── IncomeForm.jsx          # Implementer-2: 1099 + other income
│   │   ├── DeductionsForm.jsx      # Implementer-2: Standard/itemized deductions
│   │   ├── CreditsForm.jsx         # Implementer-3: Tax credits selection
│   │   ├── TaxSummaryView.jsx      # Implementer-3: Tax calculation breakdown
│   │   ├── ReviewPage.jsx          # Implementer-3: Full review + e-sign
│   │   └── ConfirmationPage.jsx    # Implementer-3: Filing confirmation
│   ├── context/
│   │   └── TaxContext.jsx           # Implementer-4: State management + reducer
│   ├── utils/
│   │   ├── initialState.js          # Implementer-4: Default state, persistence, deep merge
│   │   ├── taxCalculator.js         # Implementer-4: CA tax computation functions
│   │   └── validators.js            # Implementer-4: Shared validation helpers
│   └── pages/
│       └── Go.jsx                   # Implementer-4: /go state inspection endpoint
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

---

## 10. Initial Data Sample

```javascript
const initialData = {
  taxReturn: {
    id: 'CA540-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
    taxYear: 2024,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    confirmationNumber: null
  },

  personalInfo: {
    filingStatus: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    suffix: '',
    ssn: '',
    dateOfBirth: '',
    spouseFirstName: '',
    spouseMiddleInitial: '',
    spouseLastName: '',
    spouseSsn: '',
    spouseDateOfBirth: '',
    address: {
      street: '',
      apt: '',
      city: '',
      state: 'CA',
      zip: ''
    },
    phone: '',
    email: ''
  },

  dependents: [],

  income: {
    w2s: [],
    interest1099: [],
    dividend1099: [],
    otherIncome: [],
    federalAgi: 0
  },

  deductions: {
    type: 'standard',
    standardAmount: 0,
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
    rentersCredit: { eligible: false, amount: 0 },
    seniorHeadOfHousehold: { eligible: false, amount: 0 },
    jointCustodyHeadOfHousehold: { eligible: false, amount: 0 },
    dependentParent: { eligible: false, amount: 0 },
    otherCredits: []
  },

  calculations: {
    totalIncome: 0,
    adjustedGrossIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    taxBeforeCredits: 0,
    exemptionCredits: 0,
    totalNonrefundableCredits: 0,
    totalRefundableCredits: 0,
    netTax: 0,
    totalWithholdings: 0,
    estimatedPayments: 0,
    totalPayments: 0,
    overpayment: 0,
    amountOwed: 0,
    refundAmount: 0
  },

  payment: {
    refundMethod: 'direct_deposit',
    bankRoutingNumber: '',
    bankAccountNumber: '',
    accountType: '',
    paymentMethod: '',
    paymentDate: ''
  },

  formProgress: {
    currentStep: 0,
    completedSteps: [],
    stepErrors: {}
  },

  ui: {
    currentView: 'welcome',
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

---

## 11. Step Navigation Flow

The filing wizard follows this linear progression:

```
Welcome -> Personal Info -> Dependents -> Income -> Deductions -> Credits -> Tax Summary -> Review -> Confirmation
   (0)         (1)            (2)          (3)        (4)          (5)         (6)          (7)        (8)
```

**Step transition rules**:
- Users can navigate freely to any previously completed step via sidebar
- Moving forward requires current step validation to pass
- Tax calculations recompute on every step transition
- Step sidebar shows: completed (checkmark), current (highlighted), incomplete with errors (warning icon), future (grayed out)

---

## 12. Styling Theme

The mock follows the California FTB / government website aesthetic:

| Element | Color |
|---------|-------|
| Header background | `#003366` (FTB dark blue) |
| Header accent / links | `#FDB81E` (gold) |
| Primary buttons | `#003366` (blue) |
| Error / warnings | `#D63E04` (red-orange) |
| Success / completed | `#2E8540` (green) |
| Page background | `#F0F0F0` (light gray) |
| Form backgrounds | `#FFFFFF` (white) |
| Step sidebar | `#FFFFFF` with blue left-border for active |

---

## 13. References

**Similar mocks studied**:
- `visa_portal_mock` - Multi-step form wizard, sidebar navigation, React Context + useReducer, session-aware persistence
- `visa_portal_ds160_mock` - Complex form sections, ApplicationLayout pattern, deep merge for custom state
- `personal_profile_form_mock` - Form Context pattern, section-based updates, auto-save, toast notifications

**Real app research**:
- California FTB CalFile: https://www.ftb.ca.gov/file/ways-to-file/online/calfile/index.asp
- Form 540 Instructions: https://www.ftb.ca.gov/forms/2024/2024-540-booklet.html
- CA Tax Rate Schedules: https://www.ftb.ca.gov/forms/2024/2024-540-tax-rate-schedules.pdf

**Key design decisions**:
- Flat data structure with ID references for array items (W-2s, dependents, 1099s)
- Separate `calculations` object that is computed (not user-editable) - lives as derived state in context
- `formProgress` tracks step completion independently from data - allows partial saves
- Tax calculation logic isolated in `taxCalculator.js` as pure functions for testability
- Session-aware persistence with `?sid=` parameter matching existing mock patterns
- useReducer over useState for structured form actions (UPDATE_SECTION, ADD_ARRAY_ITEM, etc.)
