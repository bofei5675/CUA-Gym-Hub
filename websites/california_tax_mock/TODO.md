# California Tax Filing Mock (CalFile) — TODO

> Status: READY FOR DEV
> Last updated by: plan agent, 2026-03-02
> Research: `assets/README.md` | Data model: `assets/data_model.md`

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## P0 — Core Infrastructure Fixes

These items fix critical gaps in the existing app that prevent proper RL training use.

- [x] **Session isolation**: Update `vite.config.js` to add mock-API plugin with `POST /post?sid=` and `GET /state?sid=` endpoints. The POST endpoint accepts custom initial state JSON and merges it with defaults using `deepMergeWithDefaults`. The GET endpoint returns `{initial_state, current_state, state_diff}`. Add `normalizeState()` in `initialState.js` that ensures all array fields (`dependents`, `income.w2s`, `income.interest1099`, `income.dividend1099`, `income.otherIncome`, `credits.otherCredits`) have properly structured items with required fields (id, etc.) when custom state is POSTed. Follow the pattern from other mocks (see CLAUDE.md memory notes about session isolation architecture: 4 files — vite.config.js, dataManager/initialState.js, TaxContext.jsx, App.jsx). Critical: check localStorage BEFORE calling `initializeData()` since it writes defaults on first call. Store `sid` in `sessionStorage` so it persists across React Router navigation. Add `RedirectWithQuery` component to preserve `?sid=` in any React Router redirects. **Fixed reset: clearState() now also removes .initial.json.**

- [x] **Pre-filled seed data for agent training**: Replace the current empty `initialData` in `initialState.js` with realistic pre-filled seed data so the `/go` endpoint shows meaningful state_diff when an agent modifies values. Use the seed data from `assets/data_model.md` § "Suggested createInitialData() with Seed Data". The default user is "Maria L. Santos" (Single, SSN 592-84-7163, San Jose CA 95128) with one W-2 from "Bay Area Tech Solutions Inc" ($82,500 wages, $4,950 CA withheld), one 1099-INT from Wells Fargo ($342.50), renter's credit enabled ($60), standard deduction selected, and personal-info step already marked complete. This gives the agent a mid-flow starting point with data to edit, add to, or complete.

- [x] **Fix /go endpoint to work with session isolation**: Update `Go.jsx` to read `sid` from URL query params and pass it through the context. The `/go` route should also be accessible at `/go?sid=XXX` and return the session-specific state. Ensure the JSON output includes `initial_state`, `current_state`, and `state_diff` with proper deep-diff calculation.

---

## P1 — Functionality Gaps & Improvements

These items add missing interactive behaviors that a computer-use agent would expect to work.

- [x] **SSN masking on blur**: In `PersonalInfoForm.jsx` and `SpouseInfo.jsx`, when the SSN field loses focus (`onBlur`), set `ssnVisible` to `false` so the SSN is automatically masked to `XXX-XX-6789` format. Currently the SSN stays visible after blur because only the Show/Hide button toggles visibility. Same fix needed in `DependentsList.jsx` — the dependent SSN field should mask on blur too (currently it always shows masked but the editing experience is inconsistent since the raw digits are stored and the mask is applied on display).

- [x] **Estimated tax payments entry**: In `TaxSummaryView.jsx`, add an "Estimated Tax Payments" input field below the tax calculation table. Currently `calculations.estimatedPayments` is hardcoded to `0`. Add a field in the `payment` section of state (`estimatedPayments: ''`) and update `taxCalculator.js` to read `state.payment.estimatedPayments` (or add it to a new `payments` section). The field should be a currency input with `$` prefix, same pattern as W-2 wage fields. The estimated payments get added to `totalPayments` and affect the refund/owed calculation.

- [x] **Voluntary contribution funds on deductions page**: Add a "Voluntary Contributions" section at the bottom of `DeductionsForm.jsx`. California allows taxpayers to donate to various state funds (e.g., CA Seniors Special Fund, Alzheimer's Disease Fund, California Firefighters Memorial Fund). Display as a list of checkboxes with fund name and a dollar amount input for each checked fund. Store as `deductions.voluntaryContributions: [{ id, fundName, amount }]` array. These amounts are added to the tax owed (they don't reduce taxable income — they're donations from refund/payment). Show 5-6 real CA fund names.

- [x] **Auto-save indicator**: Add a small "Saved" / "Saving..." toast notification in the bottom-right corner that appears briefly (1.5s) whenever state is auto-saved to localStorage. Use `ui.isSaving` state — set to `true` before save, `false` after. Show a green checkmark + "Saved" or a spinner + "Saving..." text. Fade in/out with CSS transition. This makes the auto-save behavior visible to agents.

- [x] **Tooltip system for tax terms**: Add `?` icons next to key tax terms that show a tooltip on hover/click with a brief explanation. Terms to define: "Filing Status" (explains each option), "Adjusted Gross Income" (federal AGI from 1040 line 11), "Standard Deduction" (fixed amount based on filing status), "Itemized Deductions" (individual expense totals), "CalEITC" (California Earned Income Tax Credit for low-to-moderate income), "Exemption Credit" ($149 per person), "Taxable Income" (AGI minus deductions), "Schedule CA" (California adjustments to federal income). Use a small popover component — 250px wide, white background, shadow, positioned above the `?` icon. Store `ui.activeTooltip` in state (string id of visible tooltip, or null).

- [x] **Payment page (Web Pay)**: Add a new route `/pay` with a `PaymentPage.jsx` component that simulates the FTB Web Pay interface. Layout: top section shows "Make a Payment" heading with current balance owed (from `calculations.amountOwed`). Below: radio buttons for payment type (Tax Due, Estimated Payment, Extension Payment). Then: bank account entry (routing number 9 digits, account number, account type checking/savings), payment amount field, and payment date picker (default to today). A "Review Payment" button opens a summary modal, and "Submit Payment" records the payment in state under `payment.webPaySubmissions: [{ id, type, amount, date, status }]`. Add "Web Pay" to the nav bar. This gives agents a realistic payment workflow.

- [x] **Refund tracker page**: Add a new route `/refund` with a `RefundPage.jsx` component that shows "Where's My Refund?" interface. Top section: 3 required fields — SSN (last 4 digits), ZIP code, and exact refund amount. A "Check Status" button (validates the 3 fields match the current state's data) shows a refund timeline with steps: (1) Return Received, (2) Return Processed, (3) Refund Approved, (4) Refund Sent. If the return has been submitted (`taxReturn.status === 'submitted'`), show step 1 as complete and step 2 as "In Progress". If not submitted, show "No return found" message. Add "Refund" link to nav bar.

- [x] **Nav bar dropdown menus**: The current nav bar has flat links (File, Pay, Refund, Forms, Help) that are `<a href="#">` no-ops. Convert them to dropdown menus that appear on hover/click. Each dropdown should list 3-5 sub-items matching the real FTB site structure (see `assets/README.md` § "Real FTB Website Structure"). The "File" dropdown: "CalFile (Free)", "Ways to File", "After You File", "When to File". The "Pay" dropdown: "Web Pay", "Credit Card", "Payment Plans", "Penalties & Interest". The "Refund" dropdown: "Check Refund Status", "Refund Help". The "Forms" dropdown: "Search Forms", "2024 Forms", "Publications". The "Help" dropdown: "Contact Us", "Free Tax Help", "Letters & Notices", "Scam Alerts". Each sub-item should navigate to either an existing route (e.g., `/pay`, `/refund`) or show a "Coming Soon" placeholder page.

- [x] **Forms search page**: Add a new route `/forms` with a `FormsPage.jsx` component showing a searchable list of California tax forms. Display a search input at top, then a table of forms: Form Number, Form Name, Tax Year, Description. Include ~15 real CA forms: 540, 540-2EZ, 540-ES, 540-NR, 540-X (amended), Schedule CA, FTB 3514 (CalEITC), FTB 3532 (HOH), FTB 3506 (child care credit), FTB 5805 (underpayment penalty), DE-4 (withholding), 593 (real estate withholding), 588 (nonresident withholding waiver). Each row has a "View" button that opens a modal showing form details (no actual PDF). Search filters by form number or name. Store forms as a static array in the component.

- [x] **Help/Contact page**: Add a new route `/help` with a `HelpPage.jsx` component showing FTB contact information in a clean government-style layout. Include: (1) Phone numbers section — General Info: 800-852-5711, Hearing Impaired: 800-822-6268, Outside US: 916-845-6500. (2) Mailing addresses — for returns (Franchise Tax Board PO Box 942840 Sacramento CA 94240), for payments (separate PO Box). (3) Office locations — Sacramento HQ (9646 Butterfield Way, Sacramento, CA 95827), hours Mon-Fri 8am-5pm. (4) "Send a Message" button that opens a simple contact form modal (subject dropdown, message textarea, send button — stores message in state but doesn't actually send). (5) Quick links to CalFile Help, Tax Glossary, Free Tax Help (VITA). Add "Help" link to nav bar.

- [x] **MyFTB account dashboard**: Add a new route `/account` with a `AccountPage.jsx` component showing a simplified MyFTB portal. Layout: left sidebar with menu items (Account Summary, Tax Returns, Notices, Payments, Messages, Settings). Main area shows selected section. **Account Summary** (default): name, SSN masked, address, filing status, account balance (from calculations), last login date. **Tax Returns**: table with tax year, form, status, filed date, refund/amount owed columns — show the current return plus 2 mock prior years (2023 Submitted, 2022 Submitted). Clicking a row shows return details. **Notices**: list of 2-3 mock notices (e.g., "Important: Your 2024 return has been received", "Reminder: Estimated tax payment due"). **Payments**: table of payment history (show 1-2 mock estimated payments from prior years). **Messages**: simple inbox with 1-2 mock messages from FTB. Add "MyFTB" link to the utility bar at the top.

---

## P2 — Polish & Realism

These items add depth but should only be implemented after P1 is solid.

- [ ] **Print-friendly return summary**: Add a "Print Return" button on the Review page (next to Submit) that triggers `window.print()` with a `@media print` stylesheet hiding the nav, sidebar, and footer, and formatting the review data in a clean Form 540-like layout.

- [ ] **Keyboard navigation improvements**: Ensure all form fields have proper `tabIndex` ordering. Add keyboard shortcut: `Ctrl+S` = Save & Exit, `Enter` on last field of a section = Next step. Ensure radio buttons are navigable with arrow keys. All clickable elements should have visible focus rings (already partially done via Tailwind `focus:ring-2`).

- [ ] **Mobile responsive layout**: The sidebar currently has fixed 256px width. On screens < 768px: collapse sidebar into a hamburger menu or horizontal step indicator at the top. Form grids should stack to single column. Nav bar should collapse to hamburger. Footer columns should stack.

- [ ] **Loading states**: Add skeleton loading screens for each form section. When navigating between steps, show a brief (200ms) skeleton placeholder before the form renders. This prevents flash of empty content and trains agents to wait for content to load.

- [ ] **Confirm before leaving**: When a user has unsaved changes (form is dirty) and tries to navigate away (browser back, click nav link), show a "You have unsaved changes. Are you sure you want to leave?" confirmation dialog. Track dirty state by comparing current state to last-saved state.

- [ ] **Tax bracket visualization**: On the Tax Summary page, add a visual bar chart showing how income is distributed across the 9 CA tax brackets. Use colored horizontal bars with labels showing the rate and amount in each bracket. This helps agents (and humans) understand progressive taxation visually.

- [ ] **Form 540 line-by-line mapping**: On the Tax Summary page, add a toggle "Show Form 540 Lines" that displays the calculation as a line-by-line mapping to the actual Form 540 (Line 7: Federal AGI, Line 13: Taxable Income, Line 31: Tax, Line 32: Exemption Credits, etc.). This adds realism for agents that need to understand tax form structure.

- [ ] **Dark mode toggle**: Add a dark mode toggle in the utility bar. When enabled, swap the color scheme: `ftb-light` → dark gray (#1a1a2e), white cards → dark cards (#2d2d44), text → light gray (#e0e0e0), `ftb-blue` stays the same. Store preference in `ui.darkMode`.

---

## Data Seed (implement in createInitialData())

- [ ] **Default user**: Maria L. Santos, Single, SSN 592-84-7163, DOB 1988-06-14, 2847 Oak Valley Drive Unit 12, San Jose CA 95128, phone (408) 555-3291, email maria.santos@email.com
- [ ] **W-2 #1**: Bay Area Tech Solutions Inc, EIN 94-3281756, wages $82,500, federal withheld $14,200, state wages $82,500, state withheld $4,950
- [ ] **1099-INT #1**: Wells Fargo Bank, interest $342.50
- [ ] **Renter's credit**: Enabled, $60
- [ ] **Standard deduction**: Selected ($5,540 for Single)
- [ ] **Expected calculations**: Total income ~$82,842.50, taxable income ~$77,302.50, tax before credits ~$4,850 (approx), net tax ~$4,700 (approx), refund ~$250 (approx with $4,950 withheld)
- [ ] **Form progress**: personal-info step marked complete, currentStep = 1

## Out of Scope
<!-- Dev must NOT implement these. -->
- Authentication / login (app starts pre-logged-in as Maria L. Santos)
- Real API calls or server communication
- Actual file uploads (W-2 PDFs, etc.)
- Email/SMS notification sending
- Database persistence beyond localStorage
- Real encryption of SSN/sensitive data
- Federal return filing (only CA Form 540)
- Real tax calculation edge cases (AMT, capital gains rates, phase-outs)
