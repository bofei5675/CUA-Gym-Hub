# USA.gov Mock -- Research & Assets

## App Overview

USA.gov is the official web portal of the United States federal government. It serves as a centralized directory for government information, services, benefits, and agency contacts. The site helps citizens find answers to common questions about taxes, passports, benefits, voting, immigration, and more.

The site is built on the U.S. Web Design System (USWDS) and emphasizes accessibility, clarity, and trust. It is purely informational -- there are no user accounts, no content creation, and no transactional workflows. All interactions are read-only navigation, search, and filtering.

## Key User Personas

1. **General Citizen** -- Needs to find information about a government service (e.g., how to get a passport, file taxes, apply for benefits)
2. **Benefits Seeker** -- Looking for government assistance programs they may qualify for
3. **Agency Contact Finder** -- Needs to find the right government agency and its contact information
4. **Life Event Navigator** -- Experiencing a major life event (retirement, death of loved one, new child) and needs to know what government resources are available

## Primary Workflows

1. **Search for information** -- Type a query, get matching results, click through to content pages
2. **Browse by topic** -- Navigate topic grid > topic page > subtopic > article
3. **Find government benefits** -- Use the benefit finder with category and life event filters
4. **Look up an agency** -- Use the A-Z directory with letter navigation and text search
5. **Navigate via quick links** -- Click homepage quick links for common tasks
6. **Switch language** -- Toggle between English and Espanol
7. **Expand government banner** -- Learn about .gov website security

## Complete Feature List

### P0 -- Core Shell (must have for app to render)
- Government banner with expandable security info
- Header with USAGov logo, search bar, phone number, language toggle
- Navigation bar with 6 topic links + "All topics" link
- Footer with 4 columns of links and contact info
- Routing for all 10 routes
- State management with AppContext and dataManager
- /go endpoint for state inspection
- Session isolation via vite.config.js mock-api plugin

### P1 -- Primary Features (core interactive workflows)
- Homepage: hero banner, "How do I..." quick links (4), benefits CTA card, topic grid (22 topics)
- All Topics page: full card grid of 22 topics
- Topic page: topic heading, "Most Popular" links (3), subtopic cards
- Subtopic page: heading, description, content page cards, sidebar nav
- Content/Article page: breadcrumbs, heading, body HTML, "Last updated" date, related pages
- Agency Directory: A-Z letter nav, search input, agency cards with name/description/website/phone
- Benefit Finder: category checkboxes (12), life event dropdown (3), filtered benefit cards
- Search page: search input, results list with title/description/link
- Mega-menu dropdowns for navigation topics (open/close tracked in state)

### P2 -- Secondary Features (depth and realism)
- Life Events page: 6 life event cards linking to benefit finder with pre-selected filters
- Back-to-top button on long pages
- 404 page for unknown routes
- Responsive layout (mobile hamburger menu)
- "Share this page" links on content pages
- Skip navigation link for accessibility
- Print-friendly article layout

## UI Layout Descriptions

### Homepage (/)
- **Top**: Government banner (grey bar, US flag, "An official website..." text, expandable accordion)
- **Header**: Logo left, search bar center-right, phone number right, Espanol button
- **Nav bar**: Dark blue bar with 6 topic links + "All topics and services"
- **Hero**: Dark blue banner with "Making government services easier to find" heading
- **Quick Links**: "How do I..." section with 4 pill/link buttons in a 2x2 grid
- **Benefits CTA**: Blue card with "Government benefits and financial assistance" heading + "Find benefits" button
- **Topics Grid**: 22 topic cards in 3-column grid, each with title (blue link) + short description
- **Footer**: Dark background, 4-column layout with links, contact info, GSA attribution

### Agency Directory (/agency-index)
- Breadcrumbs: Home > A-Z index of U.S. government departments and agencies
- Heading: "A-Z index of U.S. government departments and agencies"
- Search input: "Search agencies and departments" with magnifying glass button
- Letter navigation: A through Z horizontal bar, each letter clickable, active letter highlighted
- Agency list: Cards separated by horizontal rules, each showing name (bold link), description, website URL, phone, contact link

### Benefit Finder (/benefit-finder)
- Breadcrumbs: Home > Government benefits
- Heading: "Benefit finder"
- Left sidebar: Category checkboxes (12 categories) + Life event dropdown (3 options)
- Main area: Filtered benefit cards, each showing name, description, eligibility summary, how to apply, administering agency

### Search Page (/search?query=)
- Search input pre-filled with query
- Results count ("X results for 'query'")
- Result list: each result has blue title link, URL breadcrumb, description snippet

## Screenshots

- `assets/screenshots/reference/000001.jpg` -- USAGov logo with search.gov and Vote.gov branding
- `assets/screenshots/000001.jpg` -- USAGov logo magnified showing circular badge design and government banner text
- `assets/screenshots/000005.jpg` -- USA.gov mobile header showing government banner, logo, Espanol button, "How Do I..." section

## Data Model Overview

See `assets/data_model.md` for full entity specifications. Key entities:

| Entity | Count | Purpose |
|--------|-------|---------|
| Topics | 22 | Main navigation categories |
| Subtopics | ~80 | Sub-categories within topics |
| Pages | ~120 | Content articles (30+ with full HTML body) |
| Agencies | 55+ | Government departments/agencies for A-Z directory |
| Benefits | 25+ | Government benefit programs |
| Benefit Categories | 12 | Filter categories for benefits |
| Life Events | 6 | Major life event groupings |
| Quick Links | 4 | Homepage shortcuts |
| Search Results | 100+ | Pre-indexed search entries |

## What to Skip

- **Authentication**: No login/logout. Site is public, no user accounts.
- **Real external links**: Agency websites, program websites are display-only (not functional links to external sites)
- **Real search API**: Search is client-side against the pre-built searchIndex array
- **Real language translation**: Espanol toggle changes `currentLanguage` state but does not translate content (this is a mock)
- **Real file downloads**: No actual PDF downloads
- **Form submissions**: No actual form processing (benefit applications, etc.)
