# California Tax Filing Mock — Research Summary

## App Overview

This mock replicates **CalFile**, the California Franchise Tax Board's (FTB) free online tax filing system at **ftb.ca.gov**. CalFile allows California residents to file their Form 540 (Resident Income Tax Return) directly with the FTB. The mock focuses on the complete multi-step tax filing workflow — from personal information through submission and confirmation.

**Real-world URL**: https://www.ftb.ca.gov/file/ways-to-file/online/calfile/
**MyFTB Portal**: https://www.ftb.ca.gov/myftb/index.asp

## Key User Personas

### Primary: California Resident Taxpayer
- Files annual Form 540 state income tax return
- Has W-2 wage income, possibly interest/dividend income
- May have dependents, spouse/RDP
- Wants fastest refund via direct deposit
- Typical workflow: 15-30 minutes to complete return

### Secondary: Tax Professional / Preparer
- Files on behalf of clients
- Needs to enter exact figures from federal return
- Uses the account dashboard to manage multiple returns

## Real FTB Website Structure

### Top-Level Navigation
| Section | URL | Purpose |
|---------|-----|---------|
| File | /file/ | Filing resources, CalFile, credits, deductions |
| Forms | /forms/ | Form search, tax year collections, publications |
| Pay | /pay/ | Web Pay, credit card, payment plans, collections |
| Refund | /refund/ | "Where's My Refund" tracker |
| Help | /help/ | Contact, dispute resolution, scam alerts |
| MyFTB | /myftb/ | Account portal, secure messaging, return history |

### CalFile Filing Process (8 Steps)
1. **Personal Information** — Filing status, taxpayer name, SSN, DOB, address, contact
2. **Dependents** — Add/remove dependents with name, SSN, relationship, DOB, months in home
3. **Income** — W-2 wages, 1099-INT interest, 1099-DIV dividends, other income, federal AGI
4. **Deductions** — Standard vs. itemized, California adjustments (Schedule CA)
5. **Credits** — CalEITC, child care, renter's credit, senior HOH, other credits
6. **Tax Summary** — Computed tax breakdown, refund/payment method selection, bank info
7. **Review & Sign** — Full return review with edit links, e-signature declaration
8. **Confirmation** — Confirmation number, refund timeline, print/start new

## Visual Design System

### Color Palette (from real FTB website)
| Token | Hex | Usage |
|-------|-----|-------|
| `ftb-blue` | `#003688` | Primary brand color, nav bar, headings, buttons |
| `ftb-blue-hover` | `#002a5c` | Button hover states |
| `ftb-gold` | `#FDB81E` | Accent/CTA, California brand gold |
| `ftb-error` | `#cd2026` | Error states, required asterisks |
| `ftb-success` | `#0f6d38` | Success states, checkmarks, refund amounts |
| `ftb-warning` | `#dcba00` | Warning states |
| `ftb-light` | `#fafafa` | Page background |
| `ca-gray-800` | `#3b3a48` | Footer background, dark text |

### Typography
- **Font family**: "Public Sans", Arial, Helvetica, sans-serif (California state standard)
- **Headings**: Bold, FTB blue (#003688)
- **Body text**: Gray-700 (#616161)
- **Form labels**: Semi-bold, Gray-700

### Layout
- **Max width**: 1176px (centered)
- **Utility bar**: Top bar with Contact/Translate/Search links (gray background)
- **Brand bar**: White, FTB logo + "Franchise Tax Board / State of California"
- **Nav bar**: FTB blue background, white text links
- **Filing layout**: 256px sidebar (step navigation) + flexible main content
- **Footer**: Dark (ca-gray-800), 3-column grid, copyright bar

## Feature List by Priority

### P0 — Core Shell (app cannot render without these)
- [x] Project scaffold (Vite + React + Tailwind)
- [x] Visual design system (FTB colors, typography, spacing)
- [x] App layout (utility bar, brand bar, nav bar, sidebar, footer)
- [x] Routing (BrowserRouter, 8 filing steps + welcome + /go)
- [x] State management (TaxContext + useReducer + dataManager)
- [x] `/go` endpoint (initial_state, current_state, state_diff)
- [ ] Session isolation (vite.config.js mock-api plugin, POST/GET endpoints)
- [ ] Pre-filled seed data (realistic taxpayer with income for agent training)

### P1 — Primary Features (core interactive workflows)
- [x] Personal Information form (filing status, name, SSN, DOB, address, contact)
- [x] Spouse/RDP conditional section
- [x] Dependents list (add/remove/edit with validation)
- [x] W-2 form (employer name, EIN, wages, withholdings)
- [x] 1099-INT interest income (add/remove)
- [x] 1099-DIV dividend income (add/remove)
- [x] Other income (add/remove)
- [x] Federal AGI entry
- [x] Deductions (standard vs. itemized toggle)
- [x] California Adjustments (Schedule CA subtractions/additions)
- [x] Credits (CalEITC, child care, renter's, senior HOH, other)
- [x] Tax Summary with computed breakdown
- [x] Refund/payment method selection
- [x] Direct deposit bank info entry
- [x] Review page with edit links for each section
- [x] E-signature declaration with checkbox and date
- [x] Submit confirmation dialog
- [x] Confirmation page with number, timeline, print
- [x] Step sidebar with progress bar and completion indicators
- [x] Step validation with error display
- [x] Next/Previous/Save & Exit navigation
- [ ] Breadcrumb navigation fix (preserve query params)

### P2 — Secondary Features (depth and realism)
- [ ] MyFTB account dashboard (account summary, return history, notices)
- [ ] "Where's My Refund" tracker page
- [ ] Payment page (Web Pay form, credit card option)
- [ ] Form search/download page
- [ ] Help/Contact page with phone numbers and office locations
- [ ] Estimated tax payments entry
- [ ] Voluntary contribution funds (on deductions page)
- [ ] Print-friendly return summary
- [ ] Auto-save indicator ("Saving..." toast)
- [ ] Tooltip system for tax terms (hover for definitions)
- [ ] Mobile responsive improvements
- [ ] Keyboard navigation and accessibility (Tab order, ARIA labels)

## California Tax Rules (2024 Tax Year)

### Tax Brackets (Single)
| Income Range | Rate |
|---|---|
| $0 - $10,412 | 1% |
| $10,413 - $24,684 | 2% |
| $24,685 - $38,959 | 4% |
| $38,960 - $54,081 | 6% |
| $54,082 - $68,350 | 8% |
| $68,351 - $349,137 | 9.3% |
| $349,138 - $418,961 | 10.3% |
| $418,962 - $698,271 | 11.3% |
| $698,272+ | 12.3% |

### Standard Deductions (2024)
- Single / Married Filing Separately: $5,540
- Married Filing Jointly / Head of Household / Qualifying Widow(er): $11,080

### Exemption Credits (2024)
- Personal exemption credit: $149 per taxpayer
- Dependent exemption credit: $461 per dependent

### Filing Status Options
1. Single
2. Married/RDP Filing Jointly
3. Married/RDP Filing Separately
4. Head of Household
5. Qualifying Surviving Spouse/RDP

## Screenshots

### Existing Mock Screenshots (from QA testing)
Located in `/screenshots/` (root level):
- `01-welcome.png` — Welcome page with hero section
- `02-personal-info.png` — Filing status and taxpayer info form
- `03-personal-info-filled.png` — Completed personal info
- `04-spouse-info.png` — Spouse/RDP conditional section
- `05-validation-errors.png` — Validation error display
- `07-dependents-empty.png` — Empty dependents state
- `08-dependent-added.png` — Dependent entry form
- `09-income-empty.png` — Income page initial state
- `11-income-forms.png` — Income forms with data
- `12-deductions.png` — Standard deduction view
- `13-deductions-itemized.png` — Itemized deductions form
- `14-credits.png` — Credits selection page
- `15-credits-filled.png` — Credits with amounts
- `17-review.png` — Full review page
- `18-confirm-dialog.png` — Submit confirmation modal
- `19-confirmation.png` — Success confirmation page
- `20-go-endpoint.png` — /go state inspector

### Reference Screenshots (from real FTB website)
Located in `assets/screenshots/`:
- `000001.jpg` — FTB WebPay name/address form (shows real FTB form field styling)
- `000003.jpg` — FTB archive page (shows real header/nav/sidebar layout)

## Out of Scope
- **Authentication / Login** — App starts pre-logged-in; no MyFTB login flow
- **Real API calls** — All data is in localStorage; no server communication
- **File uploads** — No actual document upload (W-2 PDF, etc.)
- **Email/SMS** — No notification sending
- **Database persistence** — Beyond localStorage
- **Real tax calculations** — Simplified; does not handle every edge case
- **Encryption** — No real SSN protection (mock data only)
- **Federal return filing** — Only California Form 540

## Data Model
See `assets/data_model.md` for complete entity definitions and `createInitialData()` structure.
