# DS-160 Visa Portal Mock — TODO

> Status: READY FOR DEV
> Last updated by: plan agent, 2026-03-09
> Research: `assets/README.md` | Data model: `assets/data_model.md`
> Screenshots: `assets/screenshots/` (27 reference images)

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## P0 — Core Shell & Infrastructure

These items are required for the app to render. Most already exist but need fixes.

- [x] Project scaffold: Vite + React + Tailwind CSS (already done)
- [x] App entry: `index.html`, `main.jsx`, `App.jsx` with BrowserRouter (already done)
- [x] Header component: U.S. Department of State seal, navy gradient, tooltip language selector, Help/FAQ links (already done)
- [x] Footer component: Copyright, Disclaimers, Paperwork Reduction Act links (already done)
- [x] AppContext with session-aware localStorage persistence and dual initial/current state tracking (already done)
- [x] `/go` endpoint: vite.config.js middleware returning `{initial_state, current_state, state_diff}` (already done)
- [x] Session API: POST `/post?sid=`, GET `/state?sid=`, POST `/upload?sid=`, GET `/files/:sid/:filename` (already done)
- [x] Landing page with location selector, mock CAPTCHA, Start/Retrieve buttons (already done)
- [x] Security Question setup page (already done)
- [x] Application ID display page (already done)

- [ ] **Expand INITIAL_STATE in AppContext.jsx**: The current state schema only has `personalInfo`, `addressAndPhone`, and `meta`. Add ALL entity sections from `data_model.md`: `passport`, `travel`, `travelCompanions`, `previousUSTravel`, `usContact`, `family`, `workEducation`, `security` (parts 1-5), `photo`, `signature`. Each field should default to empty string `""`, empty array `[]`, or `false` for booleans. Also add `completedSections: []` and `securityQuestion`/`securityAnswer` to `ds160Application`.

- [ ] **Visual design system refinements**: Study `assets/screenshots/personal_info_000001.jpg` and `personal_info_000004.jpg` closely. The real CEAC UI has:
  - **Progress bar at top**: 4 wide phase tabs: "COMPLETE" (navy blue when active), "PHOTO", "REVIEW", "SIGN" — with a small downward-pointing blue triangle under the active phase. Current ProgressBar.jsx shows 13 individual steps which is WRONG — replace it with the 4-phase bar. The "COMPLETE" phase is active for all form sections (Personal through Security), then "PHOTO" for photo upload, "REVIEW" for review, "SIGN" for sign/submit.
  - **Below the progress bar**: Light blue info bar showing "Online Nonimmigrant Visa Application (DS-160)" on left, "Application ID [bold red AA00XXXXXX]" on right.
  - **Top-right links**: "Contact Us | Help | Exit" as text links ABOVE the header (in a thin gray bar above the navy banner), not inside the banner.

- [ ] **Sidebar navigation — make clickable**: Currently sidebar items are non-interactive. Add `onClick` handlers that navigate to `/application/{sectionId}` using react-router. Only allow clicking sections that are in `completedSections[]` or are the current section. Completed sections should show a blue checkmark (✓) icon to the left of the label (matching screenshots). The "Security and Background" item should be expandable with sub-items: Part 1, Part 2, Part 3, Part 4, Part 5 (see `screenshots/personal_info_000001.jpg`). "Family" section should also be expandable with sub-items: "Relatives", "Spouse" (if married).

- [ ] **Fix ProgressBar**: Replace current 13-step bar with 4-phase bar: COMPLETE | PHOTO | REVIEW | SIGN. Each phase is a wide tab. Active phase = navy blue (#003366) background + white text + small blue triangle below. Inactive = gray background (#E0E0E0) + gray text. Map routes: `/application/personal*` through `/application/security*` → COMPLETE; `/application/photo` → PHOTO; `/application/review` → REVIEW; `/application/sign` → SIGN.

- [ ] **ApplicationLayout info bar**: Add "Online Nonimmigrant Visa Application (DS-160)" text on left side of the info bar (currently only shows location and app ID). Match screenshot layout.

- [ ] **Session timeout countdown**: Replace hardcoded "19:45" with an actual 20-minute countdown timer that resets on user interaction. Show "Session Times Out in: MM:SS" in the info bar. On timeout, show an alert dialog and redirect to landing page.

---

## P1 — Primary Form Pages

Each form page follows this pattern (see screenshots for exact layout):
- **Page title** in dark blue serif font: "Section Name" with "Print" and "Help" links top-right
- **NOTE box**: Gray background box with section-specific instructions
- **Form fields**: 35%/65% grid layout. Labels right-aligned in left column, inputs in right column. Blue "i" help icons next to inputs. Red asterisk `*` for required fields.
- **Navigation bar** at bottom: 3 buttons — "◄ Back: [Previous]" (gray gradient), "💾 Save" (gray gradient with floppy disk icon), "Next: [NextSection] ►" (blue gradient). All buttons should be functional.

### Fix PersonalInfo1.jsx (partially implemented, needs state binding fixes)

- [ ] **Bind all unconnected fields to state**: Currently only `surname`, `givenName`, `nativeFullName`, `nativeFullNameDoesNotApply`, and `otherNamesUsed` are wired to state via `handleChange()`. The following fields are rendered as HTML but NOT connected to state — fix all of them:
  - **Telecode**: Radio buttons use `defaultChecked` instead of `checked` + `onChange`. Bind to `handleChange('telecodeName', 'Yes'/'No')`.
  - **Sex**: Radio buttons have no `checked` or `onChange`. Bind to `handleChange('sex', 'Male'/'Female')`.
  - **Marital Status**: `<select>` has no `value` or `onChange`. Bind to `handleChange('maritalStatus', e.target.value)`. Add missing options: `"LEGALLY SEPARATED"`, `"OTHER"`.
  - **Date of Birth**: DD input, MONTH select, YYYY input have no state binding. Bind to `handleChange('dobDay/dobMonth/dobYear', ...)`. Add all 12 months (JAN-DEC) to the month dropdown.
  - **City of Birth**: Text input has no value/onChange. Bind to `handleChange('pobCity', ...)`.
  - **State/Province of Birth**: Text input + "Does Not Apply" checkbox both unconnected. Bind both to state.
  - **Country/Region of Birth**: Dropdown unconnected. Bind to `handleChange('pobCountry', ...)`. Populate with full country list from `data_model.md`.
- [ ] **Back button**: Add `onClick={() => navigate('/application/id-generation')}` (or back to Getting Started depending on flow).
- [ ] **Save button**: Add `onClick` that calls `updateState('meta.lastSavedAt', new Date().toISOString())` and shows a brief "Saved" confirmation (e.g., flash a green checkmark or text near the button for 2 seconds).
- [ ] **Conditional fields**: When `otherNamesUsed === 'Yes'`, show a sub-form to add other names (surname + given name) with an "Add Another" button. When `telecodeName === 'Yes'`, show telecode input fields (surname telecode + given name telecode).

### Create PersonalInfo2.jsx

- [ ] **Personal Information 2 page**: Route: `/application/personal2`. Title: "Personal Information 2". All fields from `data_model.md §personalInfo.personal2`. Layout: same 35%/65% grid as PersonalInfo1. Fields:
  - **Nationality**: Country dropdown (required *). Same country list as Country of Birth.
  - **Do you hold or have you held any nationality other than indicated above?**: Yes/No radio. If Yes, show country dropdown for other nationality + "Add Another" button.
  - **Are you a permanent resident of a country/region other than your country/region of origin?**: Yes/No radio. If Yes, show country dropdown.
  - **National Identification Number**: Text input + "Does Not Apply" checkbox. When DNA checked, disable input.
  - **U.S. Social Security Number**: Text input (formatted XXX-XX-XXXX) + "Does Not Apply" checkbox.
  - **U.S. Taxpayer ID Number**: Text input + "Does Not Apply" checkbox.
  - Navigation: Back: Personal 1 | Save | Next: Address & Phone

### Create AddressPhone.jsx

- [ ] **Address and Phone page**: Route: `/application/address`. Title: "Address and Phone". Fields from `data_model.md §addressAndPhone`:
  - **Home Address section**: Street Address (Line 1) *, Street Address (Line 2), City *, State/Province (with DNA checkbox), Postal Zone/ZIP Code (with DNA checkbox), Country * (dropdown)
  - **Mailing Address**: "Is your Mailing Address the same as your Home Address?" Yes/No radio. If No, show identical address sub-form.
  - **Phone**: Primary Phone Number *, Secondary Phone Number (with DNA checkbox), Work Phone Number (with DNA checkbox)
  - **Email**: Email Address *, Secondary Email (with DNA checkbox)
  - **Social Media**: "Do you have a social media presence?" — Platform dropdown (FACEBOOK, TWITTER/X, LINKEDIN, INSTAGRAM, YOUTUBE, OTHER) + Handle text field. "Add Another" button. "Do you wish to provide additional social media information?" Yes/No.
  - **Additional Contact**: "Do you have any additional emails, websites, or social media?" Yes/No.
  - Navigation: Back: Personal 2 | Save | Next: Passport

### Create Passport.jsx

- [ ] **Passport page**: Route: `/application/passport`. Title: "Passport/Travel Document". Fields from `data_model.md §passport`:
  - **Passport/Travel Document Type**: Dropdown (REGULAR, OFFICIAL/GOVERNMENTAL, DIPLOMATIC, LAISSEZ-PASSER, OTHER) *
  - **Passport/Travel Document Number** *: Text input
  - **Passport Book Number**: Text input + DNA checkbox
  - **Country/Authority That Issued Passport**: Country dropdown *
  - **Where Was the Passport Issued?**: City *, State (with DNA checkbox), Country *
  - **Issuance Date**: DD-MMM-YYYY date fields *
  - **Expiration Date**: DD-MMM-YYYY date fields + DNA checkbox (some passports don't expire)
  - **Have You Ever Lost a Passport or Had One Stolen?**: Yes/No radio *. If Yes, show sub-form: Passport Number, Country, Explanation — with "Add Another" button.
  - Navigation: Back: Address & Phone | Save | Next: Travel

### Create Travel.jsx

- [ ] **Travel page**: Route: `/application/travel`. Title: "Travel Information". Fields from `data_model.md §travel`:
  - **Purpose of Trip to the U.S.**: Dropdown with visa categories (see data_model.md "Visa Type / Purpose of Trip Options") *
  - **Have You Made Specific Travel Plans?**: Yes/No radio *
  - If Yes: **Intended Date of Arrival** (DD-MMM-YYYY) *, **Intended Date of Departure** (DD-MMM-YYYY) *, **Arrival Flight Number**, **Arrival City**, **Departure Flight Number**, **Departure City**
  - If No: **Intended Length of Stay in U.S.** (number + unit dropdown: DAYS/WEEKS/MONTHS/YEARS) *, **Intended Date of Arrival** (DD-MMM-YYYY) *
  - **Address Where You Will Stay in the U.S.**: Street *, City *, State (US states dropdown) *, ZIP *
  - **Who Is Paying for Your Trip?**: Radio: SELF / OTHER PERSON / OTHER COMPANY/ORGANIZATION. If not self, show: Name, Phone, Email, Relationship, Address (with same-as-above checkbox option).
  - Navigation: Back: Passport | Save | Next: Travel Companions

### Create TravelCompanions.jsx

- [ ] **Travel Companions page**: Route: `/application/travelCompanions`. Title: "Travel Companions". Fields from `data_model.md §travelCompanions`:
  - **Are There Other Persons Traveling With You?**: Yes/No radio *
  - If Yes: **Are you traveling as part of a group or organization?** Yes/No. If Yes: Group/Org Name.
  - Companion list: Surname *, Given Name *, Relationship to You * (dropdown). "Add Another" button.
  - Navigation: Back: Travel | Save | Next: Previous U.S. Travel

### Create PreviousUSTravel.jsx

- [ ] **Previous U.S. Travel page**: Route: `/application/previousTravel`. Title: "Previous U.S. Travel". Fields from `data_model.md §previousUSTravel`:
  - **Have You Ever Been in the U.S.?**: Yes/No *. If Yes: show date fields for each visit (arrival date + length of stay), with "Add Another" button.
  - **Do You or Did You Ever Hold a U.S. Driver's License?**: Yes/No *. If Yes: License Number, State dropdown.
  - **Have You Ever Been Issued a U.S. Visa?**: Yes/No *. If Yes: Date Last Visa Was Issued (DD-MMM-YYYY), Visa Number, Are You Applying for the Same Type of Visa? Yes/No, Are You Applying in the Same Location? Yes/No, Have You Been Ten-Printed? Yes/No.
  - **Have You Ever Been Refused a U.S. Visa, or Been Refused Admission to the U.S., or Withdrawn Your Application for Admission?**: Yes/No *. If Yes: Explanation text area.
  - **Has Anyone Ever Filed an Immigrant Petition on Your Behalf?**: Yes/No *. If Yes: Explanation text area.
  - **Has Your U.S. Visa Ever Been Cancelled or Revoked?**: Yes/No *. If Yes: Explanation.
  - Navigation: Back: Travel Companions | Save | Next: U.S. Contact

### Create USContact.jsx

- [ ] **U.S. Contact page**: Route: `/application/usContact`. Title: "U.S. Point of Contact Information". Fields from `data_model.md §usContact`:
  - **Contact Person or Organization in the U.S.**: Surname *, Given Names *, Organization Name
  - **Relationship to You**: Dropdown (FRIEND, RELATIVE, BUSINESS ASSOCIATE, SCHOOL, EMPLOYER, OTHER) *
  - **Contact Address**: Street *, City *, State (US states dropdown) *, ZIP *
  - **Phone Number** *
  - **Email Address** (with "Do Not Know" checkbox)
  - Navigation: Back: Previous U.S. Travel | Save | Next: Family Information

### Create Family.jsx

- [ ] **Family Information page**: Route: `/application/family`. Title: "Family Information: Relatives". This page has two sub-sections visible in the sidebar: "Relatives" and "Spouse" (if married). Fields from `data_model.md §family`:
  - **Father's Information**: Surnames *, Given Names *, Date of Birth (DD-MMM-YYYY, with "Do Not Know" checkbox), Is Your Father in the U.S.? Yes/No (if Yes: US status dropdown)
  - **Mother's Information**: Same structure as father.
  - **Do You Have Any Immediate Relatives, Not Including Parents, in the United States?**: Yes/No *. If Yes: list with Surname, Given Name, Relationship (dropdown: CHILD, SIBLING, GRANDPARENT, GRANDCHILD, OTHER), US Status.
  - **Do You Have Any Other Relatives in the United States?**: Yes/No *.
  - If marital status is MARRIED/LEGALLY SEPARATED, show **Spouse Information** section (either on same page or as sub-page): Spouse Surname *, Given Names *, Date of Birth *, Nationality (country dropdown), City of Birth, Country of Birth, Address Type (SAME AS HOME / OTHER), Address (if OTHER).
  - Navigation: Back: U.S. Contact | Save | Next: Work/Education/Training

### Create WorkEducation.jsx

- [ ] **Work / Education / Training page**: Route: `/application/work`. Title: "Work/Education/Training". Fields from `data_model.md §workEducation`:
  - **Primary Occupation**: Dropdown (see data_model.md "Occupation Options") *
  - **If Other, Explain**: Text input (conditional on "OTHER" selection)
  - **Present Employer or School Name**: Text input
  - **Employer/School Address**: Street, City, State (with DNA), ZIP, Country, Phone
  - **Monthly Income in Local Currency**: Text input + DNA checkbox
  - **Briefly Describe Your Duties**: Text area
  - **Employment Start Date**: Month (dropdown) + Year
  - **Previous Employment**: "Were You Previously Employed?" Yes/No. If Yes: sub-form for previous employer (Name, Address, Job Title, Supervisor Name, Start/End Dates). "Add Another" button. Show up to 2 previous employers.
  - **Education**: "Have You Attended Any Educational Institutions?" Yes/No. If Yes: Institution Name, Address, Course of Study, Date From, Date To. "Add Another" button.
  - **Do You Speak Any Other Languages?** — Multi-select or comma-separated text.
  - **Have You Traveled to Any Countries in the Last 5 Years?** Yes/No. If Yes: country multi-select or list.
  - **Have You Belonged to, Contributed to, or Worked for Any Professional, Social, or Charitable Organization?** Yes/No. If Yes: Organization names list.
  - **Do You Have Any Specialized Skills or Training?** (firearms, explosives, nuclear, biological, chemical, etc.) Yes/No. If Yes: Explain.
  - **Have You Ever Served in the Military?** Yes/No. If Yes: Branch, Rank, Military Specialty, Date of Service From/To, Country.
  - Navigation: Back: Family Information | Save | Next: Security and Background Part 1

### Create SecurityBackground.jsx (Parts 1-5)

- [ ] **Security and Background pages**: These are 5 separate sub-pages, each containing Yes/No questions in Q/A format (see `screenshots/personal_info_000001.jpg` and `personal_info_000004.jpg` for exact layout):
  - Each question shows "Q:" in blue followed by the question text, then "A:" with Yes/No radio buttons.
  - Gray NOTE box at top: "Provide the following security and background information. Provide complete and accurate information to all questions that require an explanation. A visa may not be issued to persons who are within specific categories defined by law as inadmissible to the United States..."
  - **Routes**: `/application/security1` through `/application/security5`
  - **Part 1** (3 questions): communicableDisease, mentalDisorder, drugAbuser — see `data_model.md §security.part1`
  - **Part 2** (7 questions): arrestedOrConvicted, controlledSubstances, prostitution, moneyLaundering, humanTrafficking, aidedHumanTrafficking, humanTraffickingRelated
  - **Part 3** (9 questions): espionage, terrorism, financialSupportTerrorism, terroristMember, genocide, torture, extrajudicialKillings, childSoldiers, religiousFreedom
  - **Part 4** (6 questions): removalHearing, unlawfulPresence, deportedOrRemoved, immigrationFraud, failedToAttend, illegalEntrant
  - **Part 5** (3 questions): childCustody, votingViolation, taxEvasion
  - Navigation between parts: Part 1 → Part 2 → ... → Part 5 → Photo
  - Sidebar should show "Security and Background" as expandable with Part 1-5 sub-items (see screenshot)

### Create PhotoUpload.jsx

- [ ] **Photo Upload page**: Route: `/application/photo`. Title: "Upload Photo". See `screenshots/personal_info_000005.jpg` for reference layout:
  - **Photo requirements panel**: Display bullet list of photo specifications (600x600 pixels, white background, recent photo, full face, no glasses, etc.)
  - **Upload area**: "Choose File" button using `<input type="file" accept="image/*">`. On file selection, POST to `/upload?sid=` endpoint to store the file.
  - **Photo preview**: After upload, show the photo in a 200x200 preview box with crop guidelines.
  - **Confirm/Replace**: Buttons to confirm the photo or upload a different one.
  - Store `photo.photoUrl` and `photo.photoUploaded = true` in state.
  - Navigation: Back: Security/Background Part 5 | Save | Next: REVIEW

### Create Review.jsx

- [ ] **Review page**: Route: `/application/review`. Title: "Review Application". See `screenshots/personal_info_000003.jpg` for layout reference:
  - Display ALL entered data in read-only table format, organized by section.
  - Each section header has "Edit [Section Name]" link that navigates back to that section's form page.
  - **Print** button top-right (calls `window.print()`).
  - Sections to display: Personal Information, Address and Phone, Passport, Travel, Travel Companions, Previous U.S. Travel, U.S. Contact, Family Information (Relatives + Spouse), Work/Education/Training, Security and Background (all 5 parts).
  - Each field displayed as: label on left (bold), value on right. Use a two-column table layout with alternating row shading.
  - Navigation: Back: Photo | Save | Next: Sign and Submit

### Create SignSubmit.jsx

- [ ] **Sign and Submit page**: Route: `/application/sign`. Title: "Sign and Submit Application":
  - **Certification text**: Long paragraph about certifying that all answers are true and complete, penalties for false statements, etc.
  - **E-Signature checkbox**: "I certify that I have read and understood the questions in this application..." — required checkbox.
  - **Sign Application button**: Only enabled when checkbox is checked. On click: set `signature.eSigned = true`, `signature.signedAt = new Date().toISOString()`, `ds160Application.status = 'Submitted'`, then navigate to confirmation page.
  - Navigation: Back: Review | Sign Application (blue button, replaces "Next")

### Create Confirmation.jsx

- [ ] **Confirmation page**: Route: `/application/confirmation`. See `screenshots/personal_info_000002.jpg` for exact layout:
  - Header: U.S. Department of State banner
  - "Online Nonimmigrant Visa Application (DS-160)"
  - Title: "Confirmation" with mock barcode image on the right
  - "This confirms the submission of the Nonimmigrant visa application for:"
  - **Summary card** (gray background table):
    - Photo (or placeholder) on left
    - Name Provided, Date of Birth, Place of Birth, Gender, Nationality, Passport Number, Purpose of Travel, Completed On, Confirmation No (bold red, same as Application ID)
    - Right panel: Location Selected with embassy/consulate address
  - **Red banner**: "THIS IS NOT A VISA"
  - **YOU MUST BRING**: instruction text about bringing confirmation page + passport to interview
  - **Print button**: Print the confirmation page
  - Mock barcode at bottom

---

## P2 — Secondary Features (Depth & Polish)

- [ ] **Help tooltip system**: All blue "i" icon circles should show contextual help text on hover. Use a tooltip component (CSS-only or simple JS). Each field has specific help text. Examples:
  - Surnames: "Enter your surname(s) (family name) exactly as they appear on your passport."
  - Given Names: "Enter your given name(s) (first and middle names) exactly as they appear on your passport."
  - National ID: "Enter your national identification number if your country issues one."
  - Create a `HELP_TEXT` constant object mapping field IDs to help strings.

- [ ] **Form validation with error display**: When user clicks "Next" without filling required fields:
  - Show a red error box at top of form: "Please correct the following errors:" with a bulleted list of missing/invalid fields.
  - Highlight invalid fields with red border.
  - Scroll to first error.
  - Required field validation: check that all fields marked with `*` have non-empty values.
  - Special validations: DOB year 4 digits, passport number alphanumeric, email format, phone format.

- [ ] **Auto-save with visual feedback**: Every 60 seconds, auto-save current state. Show a brief "💾 Auto-saved" indicator near the session timeout display. Also save on any field blur event.

- [ ] **"Does Not Apply" / conditional field logic**: Ensure all "Does Not Apply" checkboxes properly disable their associated text inputs (set `disabled` attribute AND clear the field value). Ensure all conditional Yes/No radios properly show/hide their sub-forms with smooth transitions.

- [ ] **Retrieve Application flow enhancement**: On the `/retrieve` page, validate that the Application ID format matches `AA00XXXXXX`, security question matches the stored one, and answer matches. Show specific error messages: "Application ID not found" vs "Incorrect security answer". On success, navigate to the section where the user left off (`currentSection`).

- [ ] **"Add Another" dynamic list fields**: Multiple form pages have repeatable entries (other names, previous employers, education, travel companions, lost passports, etc.). Implement a reusable `DynamicList` component that:
  - Shows existing entries in a compact row format
  - Has an "Add Another" button that expands a new entry form
  - Has a "Remove" button on each entry
  - Updates the corresponding array in state
  - Limits to reasonable maximums (e.g., 5 other names, 2 previous employers, 5 education entries)

- [ ] **Print functionality**: "Print" links on review and confirmation pages should call `window.print()`. Add `@media print` CSS that hides navigation (sidebar, header, footer, progress bar) and shows only the content area in a clean printable format.

- [ ] **Landing page "Upload an Application" button**: The real DS-160 has three buttons: Start, Upload, Retrieve. Currently only Start and Retrieve exist. Add "Upload an Application" button (with maroon gradient). This is a mock-only feature — clicking it can show a file picker dialog that accepts `.dat` files but doesn't need to actually process them (just show a "Feature not available in mock" message).

- [ ] **Update routes in App.jsx**: Add routes for all new pages:
  ```
  /application/personal1    → PersonalInfo1
  /application/personal2    → PersonalInfo2
  /application/address      → AddressPhone
  /application/passport     → Passport
  /application/travel       → Travel
  /application/travelCompanions → TravelCompanions
  /application/previousTravel   → PreviousUSTravel
  /application/usContact    → USContact
  /application/family       → Family
  /application/work         → WorkEducation
  /application/security1    → SecurityBackground (Part 1)
  /application/security2    → SecurityBackground (Part 2)
  /application/security3    → SecurityBackground (Part 3)
  /application/security4    → SecurityBackground (Part 4)
  /application/security5    → SecurityBackground (Part 5)
  /application/photo        → PhotoUpload
  /application/review       → Review
  /application/sign         → SignSubmit
  /application/confirmation → Confirmation
  ```

- [ ] **Reusable form field components**: Create a shared component library to reduce duplication:
  - `FormField`: Label (right-aligned) + input + help icon + required star
  - `RadioGroup`: Yes/No or custom radio button group
  - `DateField`: DD-MMM-YYYY three-part date input
  - `CountryDropdown`: Pre-populated country select
  - `USStateDropdown`: Pre-populated US state select
  - `AddressBlock`: Reusable address sub-form (street, city, state, zip, country)
  - `DNACheckbox`: "Does Not Apply" checkbox that disables an associated input

---

## Data Seed (implement in createInitialData())

- [ ] **Default empty state**: All sections initialized with empty string defaults as shown in `data_model.md`. The app should start with an empty application where the user just selected a location and got an Application ID (simulating they just clicked "Start Application").

- [ ] **Pre-filled example via /post**: Document in SCHEMA.md a complete JSON payload that can be POSTed to `/post?sid=test` to inject a fully filled-out application. Use the `PREFILLED_EXAMPLE` from `data_model.md` as the base, extended to include all sections. This enables agent training scenarios like "edit the applicant's phone number" or "change the travel date."

---

## Out of Scope

Dev must NOT implement these:
- **Authentication / login** — App starts with an application in progress (application ID already generated)
- **Real CAPTCHA verification** — Show mock CAPTCHA image; accept any input
- **Real file uploads to external servers** — Use existing vite middleware `/upload` endpoint for local mock storage
- **Real email/SMS sending** — No communication features
- **Real encryption/SSL** — Not relevant for mock
- **Actual 20-minute session expiry** — Show countdown timer but don't hard-expire (reset on any interaction)
- **Real barcode generation** — Use a mock barcode image (black bars pattern) on confirmation page
- **PDF generation** — Print uses browser print dialog (`window.print()`)
- **Multi-language translation** — Tooltip language selector is visual only; all content stays in English
- **Accessibility compliance** — Not required for agent training mock
