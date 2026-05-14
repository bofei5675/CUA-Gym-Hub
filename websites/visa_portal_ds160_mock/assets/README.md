# DS-160 Online Nonimmigrant Visa Application — Research Summary

## Application Overview

The **DS-160** (Online Nonimmigrant Visa Application) is the official U.S. Department of State form used by all nonimmigrant visa applicants. It is hosted at `ceac.state.gov/genniv/` under the **Consular Electronic Application Center (CEAC)**. The form replaced the older paper forms DS-156, DS-157, DS-158, and DS-3032.

**Purpose:** Consular officers use DS-160 data combined with a personal interview to determine visa eligibility.

**Key characteristics:**
- ~90 minutes to complete
- Multi-page wizard form (12-15 sections depending on visa type)
- 20-minute inactivity timeout with warning alerts
- All answers in English using English characters only (except native alphabet name fields)
- Application ID generated on start (format: `AA00XXXXXX`)
- Save/resume capability via Application ID + security question
- 128-bit TLS encryption, JavaScript required
- Supported browsers: Chrome 58+, Edge, Firefox (Safari explicitly unsupported)

---

## Key User Personas

### Primary: Visa Applicant
- Fills out the entire form with personal, travel, employment, family, and security information
- May need to save/resume across multiple sessions
- Must upload a passport-style photo
- Reviews all entered data before signing and submitting
- Prints confirmation page with barcode for interview

### Secondary: Third-Party Assistant
- Helps applicant fill out the form (e.g., travel agent, lawyer)
- Must still have the applicant sign and submit the application themselves

---

## UI Layout (from screenshots)

### Global Shell
- **Header**: Dark navy blue (#003366) gradient banner, ~88px tall
  - Left: U.S. Department of State seal (72px) + "U.S. DEPARTMENT of STATE" in white serif + "CONSULAR ELECTRONIC APPLICATION CENTER" in white sans-serif
  - Right top: "Contact Us | Help | Exit" text links
  - Right middle: "Select Tooltip Language" dropdown (ENGLISH, ESPAÑOL, etc.)
- **Progress Bar**: Horizontal tab strip below header showing: COMPLETE → PHOTO → REVIEW → SIGN (4 broad phases, active one highlighted in navy blue)
- **Info Bar**: Light blue (#E8F0F8) bar showing "Online Nonimmigrant Visa Application (DS-160)" + "Application ID [AA00XXXXXX]"
- **Content Area**: Split layout:
  - Left sidebar (~170px): Section navigation list with checkmarks for completed sections
  - Main content (~770px): Form fields area with white background
- **Footer**: Gray text on light background, links: "Copyright Information | Disclaimers | Paperwork Reduction Act"
- **Body background**: Silver/gray (#C0C0C0) simulating older government site aesthetic
- **Container**: Max-width 980px, centered, white background, subtle box-shadow

### Sidebar Navigation (from screenshots)
The sidebar shows sections with blue checkmarks (✓) for completed ones:
1. Getting Started
2. Personal (expandable — contains Personal 1 & Personal 2 sub-items)
3. Address and Phone
4. Passport
5. Travel
6. Travel Companions
7. Previous U.S. Travel
8. U.S. Contact
9. Family
10. Work / Education / Training
11. Security and Background (expandable — contains Part 1-5 sub-items)
12. Location (visible on review)

Active section has gray (#666666) background with white text. Help box at bottom: "Help: Navigation Buttons — Click on the buttons above to access previously entered data."

### Form Page Layout
- Page title in dark blue serif font (~18px): e.g., "Security and Background: Part 5"
- NOTE box at top with gray background explaining the section
- Fields arranged in Q/A format:
  - "Q:" prefix in blue, followed by question text
  - "A:" prefix, followed by form controls (radio buttons, text inputs, dropdowns)
  - Blue circle "i" icons for help tooltips
  - Red asterisks (*) for required fields
- Navigation bar at bottom with 3 buttons:
  - Left: "◄ Back: [Previous Section]" (gray gradient)
  - Center: "💾 Save" (gray gradient)
  - Right: "Next: [Next Section] ►" (blue gradient #003366)

---

## Complete Feature List

### P0 — Core Infrastructure (Must have for app to render)
1. Project scaffold with Vite + React + Tailwind
2. Visual design system matching CEAC retro government styling
3. App shell layout: header, progress bar, sidebar, content area, footer
4. React Router with all section routes
5. AppContext + state management with session isolation
6. `/go` endpoint for state inspection
7. Session API middleware (POST /post, GET /state, GET /go)

### P1 — Primary Form Sections (Core interactive workflows)
1. **Landing page** — Location selector, CAPTCHA mock, Start/Retrieve buttons
2. **Security Question** — Question selector + answer field
3. **Application ID Display** — Shows generated ID with seal
4. **Personal Information 1** — Surname, given name, native name, other names, telecode, sex, marital status, DOB, place of birth
5. **Personal Information 2** — Nationality, other nationalities, national ID, SSN, US taxpayer ID
6. **Address and Phone** — Home address (street, city, state, zip, country), mailing address, phone numbers, email
7. **Passport** — Passport type, number, book number, country, city, state, issue date, expiry date, lost/stolen passport info
8. **Travel** — Purpose of trip, visa type, specific travel plans (arrival date, length of stay, US address), who is paying
9. **Travel Companions** — Traveling alone or with group/organization, companion info
10. **Previous U.S. Travel** — Have you been to US before, dates, visa info, have you been refused/denied, immigration petition filed
11. **U.S. Contact** — Contact person/organization name, address, phone, email, relationship
12. **Family Information** — Father's/Mother's names, DOB, in US; spouse info (if married); immediate relatives in US
13. **Work / Education / Training** — Current occupation, employer details, previous employers, education (schools attended), languages spoken
14. **Security and Background (Parts 1-5)** — ~25 Yes/No questions about diseases, criminal history, drug abuse, terrorism, etc.
15. **Photo Upload** — Upload passport photo, preview, requirements display
16. **Review** — Read-only summary of all entered data with "Edit" links per section
17. **Sign and Submit** — E-signature checkbox, submit confirmation
18. **Confirmation** — Confirmation page with barcode, summary card, "THIS IS NOT A VISA" banner

### P2 — Secondary Features (Depth and polish)
1. Sidebar navigation — Click to jump to any completed section
2. Progress bar — Accurate step tracking across all phases (COMPLETE/PHOTO/REVIEW/SIGN)
3. Session timeout countdown — 20-minute timer with warning
4. Help tooltips — Hover on blue "i" icons to see contextual help
5. Form validation — Red error messages for missing required fields
6. Auto-save with visual feedback (save icon flash)
7. Print functionality for review/confirmation pages
8. Retrieve Application flow — Look up by Application ID + security answer
9. "Does Not Apply" checkboxes that disable associated fields
10. Conditional field display (e.g., spouse fields only if marital status = MARRIED)

---

## Data Model Overview

The DS-160 form collects data across these entity groups:
- **Application metadata** — ID, location, status, timestamps
- **Personal Info (Part 1 & 2)** — Name, DOB, birthplace, nationality, IDs
- **Address & Phone** — Home/mailing address, phone numbers, email
- **Passport** — Type, number, issue/expiry dates, lost passport history
- **Travel** — Purpose, visa type, itinerary, payment source
- **Travel Companions** — Group/individual companion info
- **Previous U.S. Travel** — Visit history, visa history, immigration petitions
- **U.S. Contact** — Contact person in the US
- **Family** — Parents, spouse, relatives in US
- **Work/Education** — Employment history, education history, languages
- **Security & Background** — 25 Yes/No security questions (5 parts)
- **Photo** — Uploaded photo URL/data
- **Signature** — E-signature consent, submit timestamp

See `data_model.md` for complete field-level definitions.

---

## Notes for Implementation

### What to Skip
- **Real authentication** — App starts with a generated application in progress
- **Real CAPTCHA** — Show a mock CAPTCHA image with hardcoded text
- **Real file upload** — Use the existing vite middleware for mock file handling
- **Real email/SMS** — No communication features needed
- **Encryption/SSL** — Not relevant for mock
- **20-min actual timeout** — Show a countdown timer but don't actually expire

### Styling Guidelines
- **Font family**: Arial, Helvetica, sans-serif (body); Times New Roman, serif (headings)
- **Base font size**: 13px for body text, 11px for form labels, 10px for helper text
- **Primary blue**: #003366 (header, headings, buttons)
- **Secondary blue**: #3366CC (help icons, links)
- **Red accent**: #CC0000 / #990000 (required stars, buttons, warning text)
- **Light blue**: #E8F0F8 (info bars, sidebar help box)
- **Gray background**: #C0C0C0 (body), #F5F5F5 (sidebar), #F0F0F0 (progress bar)
- **Input border**: #7F9DB9
- **Button gradients**: Gray (linear-gradient #F0F0F0 → #D0D0D0), Blue (linear-gradient #004488 → #003366)
- **Container**: 980px max-width, white background, centered

### Screenshot Reference Files
- `screenshots/personal_info_000001.jpg` — Security & Background Part 5 (Q&A format, sidebar with sub-sections)
- `screenshots/personal_info_000002.jpg` — Confirmation page (barcode, summary card, "THIS IS NOT A VISA")
- `screenshots/personal_info_000003.jpg` — Family Information review page (relatives + spouse sections)
- `screenshots/personal_info_000004.jpg` — Security & Background Part 1 (disease/disorder/drug questions)
- `screenshots/personal_info_000005.jpg` — Photo upload page
- `screenshots/landing_000004.jpg` — Landing page (location selector, CAPTCHA, start/retrieve buttons, full layout)
- `screenshots/review_000005.jpg` — YouTube thumbnail showing confirmation page
