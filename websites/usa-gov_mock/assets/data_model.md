# USA.gov Mock -- Data Model

This document defines all entity types, their fields, relationships, and seed data requirements for `dataManager.js`.

---

## Entity: Topic (22 records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"taxes"` |
| `title` | string | `"Taxes"` |
| `description` | string | `"Get answers to common tax questions, including filing requirements and refund status."` |
| `icon` | string | `"taxes"` (used as CSS class or SVG identifier) |
| `slug` | string | `"taxes"` (same as id, used in URL) |
| `subtopics` | Subtopic[] | Nested array of subtopic objects |
| `popularLinks` | PopularLink[] | Array of 3 link objects |
| `inMainNav` | boolean | `true` if shown in top nav bar |
| `order` | number | Sort position (1-22) |

### PopularLink (nested in Topic)
| Field | Type | Example |
|-------|------|---------|
| `label` | string | `"How to file a federal tax return"` |
| `pageId` | string | `"file-federal-tax-return"` |
| `url` | string | `"/taxes/file-federal-taxes"` |

### All 22 Topics (seed data)

1. `the-us-and-its-government` -- "The U.S. and its government" (inMainNav: true)
2. `complaints` -- "Complaints"
3. `disability-services` -- "Disability services"
4. `disasters-and-emergencies` -- "Disasters and emergencies"
5. `education` -- "Education"
6. `government-benefits` -- "Government benefits" (inMainNav: true)
7. `health` -- "Health"
8. `housing` -- "Housing help"
9. `immigration-and-citizenship` -- "Immigration and U.S. citizenship" (inMainNav: true)
10. `innovation` -- "Innovation"
11. `jobs-and-unemployment` -- "Jobs, labor laws, and unemployment"
12. `laws-and-legal-issues` -- "Laws and legal issues"
13. `military-and-veterans` -- "Military and veterans"
14. `money-and-credit` -- "Money and credit" (inMainNav: true)
15. `scams-and-fraud` -- "Scams and fraud"
16. `small-business` -- "Small business"
17. `taxes` -- "Taxes" (inMainNav: true)
18. `travel` -- "Travel" (inMainNav: true)
19. `voting-and-elections` -- "Voting and elections"
20. `life-events` -- "Life events"

**Note**: SCHEMA.md lists 22 but has a duplicate "disability-services" at #20. Use 20 unique topics. The dev should generate realistic 1-2 sentence descriptions for each.

### mainNavTopics (6 IDs)
`["the-us-and-its-government", "government-benefits", "immigration-and-citizenship", "money-and-credit", "taxes", "travel"]`

---

## Entity: Subtopic (~80 records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"file-federal-taxes"` |
| `title` | string | `"File federal taxes"` |
| `description` | string | `"Learn whether you need to file a federal tax return and how to file."` |
| `parentTopicId` | string | `"taxes"` |
| `slug` | string | `"file-federal-taxes"` |
| `pages` | Page[] | Nested content pages |
| `order` | number | Sort order within parent topic |

### Subtopic Counts by Topic

See SCHEMA.md for full breakdown. Key topics:
- taxes: 10 subtopics
- travel: 7 subtopics
- voting-and-elections: 9 subtopics
- the-us-and-its-government: 9 subtopics
- health: 7 subtopics
- immigration-and-citizenship: 6 subtopics
- All others: 3-6 each

Each subtopic needs a realistic title, description, and 1-5 nested pages.

---

## Entity: Page (~120 records, 30+ with full body HTML)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"apply-for-passport"` |
| `title` | string | `"Apply for a new adult passport"` |
| `description` | string | `"Find out what documents and photos you need to apply for a passport."` |
| `body` | string | HTML string with `<h2>`, `<p>`, `<ul>`, `<li>` tags (3-4 paragraphs for priority pages) |
| `parentTopicId` | string | `"travel"` |
| `parentSubtopicId` | string | `"us-passports"` |
| `breadcrumbs` | Breadcrumb[] | `[{label:"Home",path:"/"},{label:"Travel",path:"/travel"},{label:"U.S. passports",path:"/travel/us-passports"}]` |
| `relatedPages` | string[] | `["renew-passport", "get-real-id"]` |
| `lastUpdated` | string | `"2024-10-15"` (ISO date) |

### Breadcrumb (nested in Page)
| Field | Type | Example |
|-------|------|---------|
| `label` | string | `"Travel"` |
| `path` | string | `"/travel"` |

### Priority Pages (must have full body HTML)

These 20 pages MUST have complete body content (3-4 paragraphs with headings, lists, etc.):

1. `apply-for-passport` -- How to apply for a new passport
2. `renew-passport` -- How to renew an existing passport
3. `file-federal-tax-return` -- Steps to file federal taxes
4. `get-help-filing-taxes` -- Free tax preparation resources
5. `check-tax-refund-status` -- How to check your refund
6. `register-to-vote` -- Voter registration process
7. `how-to-vote` -- Voting methods and locations
8. `apply-for-medicare` -- Medicare enrollment
9. `apply-for-medicaid` -- Medicaid application process
10. `check-immigration-case-status` -- Track immigration cases
11. `apply-for-green-card` -- Green card application
12. `file-unemployment-benefits` -- Unemployment filing process
13. `find-unclaimed-money` -- Search for unclaimed money
14. `report-a-scam` -- How to report fraud
15. `get-real-id` -- REAL ID requirements
16. `social-security-benefits` -- Social Security overview
17. `find-government-benefits` -- Benefit discovery guide
18. `apply-for-snap` -- SNAP application process
19. `find-affordable-housing` -- Housing assistance
20. `start-small-business` -- Starting a business guide

For remaining ~100 pages, a short description (1 sentence) is sufficient as body content.

---

## Entity: Agency (55+ records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"irs"` |
| `name` | string | `"Internal Revenue Service (IRS)"` |
| `acronym` | string | `"IRS"` |
| `description` | string | `"Collects taxes and enforces tax law"` |
| `website` | string | `"https://www.irs.gov"` |
| `phone` | string | `"1-800-829-1040"` |
| `contactFormUrl` | string | `"https://www.irs.gov/contact"` |
| `category` | string | One of: `"department"`, `"agency"`, `"commission"`, `"corporation"` |
| `parentDepartment` | string | `"Department of the Treasury"` (or empty for top-level departments) |
| `letter` | string | `"I"` (first letter for A-Z index, derived from name) |

### Agency Seed Data (55+ spanning A-Z)

See SCHEMA.md for the full list of agency IDs by letter. Key agencies:
- 5 agencies starting with A
- 1 starting with B
- 5 starting with C
- 15 starting with D (all "Department of..." entries)
- 2 starting with E
- 8 starting with F
- 1 starting with G
- 2 starting with I
- 1 starting with L
- 4 starting with N
- 2 starting with O
- 1 starting with P
- 4 starting with S
- 1 starting with T
- 3 starting with U

Each agency must have realistic name, acronym, description, website URL, and phone number.

---

## Entity: Benefit (25+ records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"snap"` |
| `name` | string | `"Supplemental Nutrition Assistance Program (SNAP)"` |
| `description` | string | `"Provides food-purchasing assistance for low-income individuals and families."` |
| `categories` | string[] | `["food", "children-and-families"]` |
| `lifeEvents` | string[] | `["financial-hardship"]` |
| `eligibility` | string | `"Based on income and household size. Must meet work requirements."` |
| `howToApply` | string | `"Apply through your state's SNAP office or online."` |
| `agencyId` | string | `"usda"` |
| `website` | string | `"https://www.fns.usda.gov/snap"` |

### All 25 Benefit IDs

See SCHEMA.md for the complete list with names, categories, and life events. Benefits span all 12 categories and reference the 3 life event filters.

---

## Entity: BenefitCategory (12 records, fixed)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"food"` |
| `label` | string | `"Food"` |

IDs: `children-and-families`, `death`, `disabilities`, `disasters`, `education`, `food`, `health`, `housing-and-utilities`, `jobs-and-unemployment`, `military-and-veterans`, `retirement-and-seniors`, `welfare-and-cash-assistance`

---

## Entity: BenefitLifeEvent (3 records, fixed)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"disability-or-illness"` |
| `label` | string | `"Living with disability or illness"` |

IDs: `disability-or-illness`, `death-of-loved-one`, `approaching-retirement`

---

## Entity: LifeEvent (6 records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"financial-hardship"` |
| `title` | string | `"Facing financial hardship"` |
| `description` | string | `"Find government resources to help with financial difficulties."` |
| `icon` | string | `"financial-hardship"` |
| `relatedTopics` | string[] | `["government-benefits", "housing"]` |
| `relatedBenefitCategories` | string[] | `["welfare-and-cash-assistance", "food", "housing-and-utilities"]` |

IDs: `financial-hardship`, `having-a-child`, `transitioning-to-adulthood`, `approaching-retirement`, `recovering-from-disaster`, `death-of-loved-one`

---

## Entity: QuickLink (4 records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"file-taxes"` |
| `label` | string | `"File your 2025 taxes"` |
| `url` | string | `"/taxes/file-federal-taxes"` |
| `icon` | string | `"taxes"` |
| `order` | number | `1` |

4 quick links: file-taxes, unclaimed-money, passport, unemployment (see SCHEMA.md for details)

---

## Entity: SearchResult (100+ records)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `"sr-1"` |
| `title` | string | `"Apply for a New Adult Passport"` |
| `description` | string | `"Find out what documents and photos you need to apply for a passport."` |
| `url` | string | `"/travel/us-passports/apply-for-passport"` |
| `topicId` | string | `"travel"` |

Generate from all pages (using page title, description, and URL) plus all topics (using topic title, description, and slug). Every page and every topic should have a corresponding SearchResult entry.

---

## UI State Fields (mutable)

| Field | Type | Default | Mutated By |
|-------|------|---------|------------|
| `currentSearch` | string | `""` | Search form submission |
| `selectedBenefitCategories` | string[] | `[]` | Benefit category checkboxes |
| `selectedBenefitLifeEvent` | string\|null | `null` | Benefit life event dropdown |
| `agencyDirectoryFilter` | string | `""` | Agency search input |
| `agencyDirectoryLetter` | string | `"A"` | Agency A-Z letter click |
| `expandedBannerInfo` | boolean | `false` | Government banner toggle |
| `expandedMenus` | object | `{}` | Navigation mega-menu open/close |
| `currentLanguage` | string | `"en"` | Language toggle button |

---

## Relationships Diagram

```
Topic (22)
  |-- has many Subtopics (3-10 each)
  |     |-- has many Pages (1-5 each)
  |-- has 3 PopularLinks (reference Pages)
  |-- referenced by LifeEvents

Agency (55+)
  |-- administers Benefits

Benefit (25+)
  |-- belongs to 1+ BenefitCategories
  |-- belongs to 0+ BenefitLifeEvents
  |-- administered by 1 Agency

LifeEvent (6)
  |-- references Topics
  |-- references BenefitCategories

QuickLink (4)
  |-- links to Subtopic or Page route

SearchResult (100+)
  |-- generated from Pages + Topics
```

---

## createInitialData() Structure

```javascript
export function createInitialData() {
  return {
    // Site metadata
    siteName: "USAGov",
    tagline: "Making government services easier to find",
    phoneNumber: "1-844-USAGOV1",
    language: "en",

    // Content data (read-only)
    topics: [...],           // 22 Topic objects with nested subtopics array
    mainNavTopics: [...],    // 6 topic ID strings
    quickLinks: [...],       // 4 QuickLink objects
    subtopics: [...],        // ~80 Subtopic objects (flat array)
    pages: [...],            // ~120 Page objects (flat array)
    agencies: [...],         // 55+ Agency objects
    benefits: [...],         // 25+ Benefit objects
    benefitCategories: [...],// 12 category objects
    benefitLifeEvents: [...],// 3 life event filter objects
    lifeEvents: [...],       // 6 LifeEvent objects
    searchIndex: [...],      // 100+ SearchResult objects

    // Mutable UI state
    currentSearch: "",
    selectedBenefitCategories: [],
    selectedBenefitLifeEvent: null,
    agencyDirectoryFilter: "",
    agencyDirectoryLetter: "A",
    expandedBannerInfo: false,
    expandedMenus: {},
    currentLanguage: "en"
  };
}
```

The `topics` array contains nested `subtopics` and `popularLinks`. The flat `subtopics` and `pages` arrays are the canonical source, with `parentTopicId` and `parentSubtopicId` fields enabling lookups by route parameters.
