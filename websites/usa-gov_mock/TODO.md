# USA.gov Mock -- TODO

> Status: READY FOR DEV
> Last updated by: plan agent, 2026-04-11
> Research: `assets/README.md` | Data model: `assets/data_model.md` | Design: `DESIGN.md`

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## P0 -- Core Shell

Without these, the app cannot render. Implement these first.

- [ ] **Project scaffold**: Run `npm create vite@latest usa-gov_mock -- --template react` (or manually create package.json, index.html, vite.config.js, src/main.jsx, src/App.jsx). Install deps: `react-router-dom`. Add `"Source Sans Pro"` via Google Fonts link in index.html (`<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">`). See DESIGN.md for full font stack.

- [ ] **Global CSS variables and base styles**: Create `src/index.css` implementing the USWDS-derived design tokens from DESIGN.md. Define CSS custom properties for all colors (`--color-primary: #005ea2`, `--color-primary-dark: #1a4480`, etc.), typography (`--font-family: "Source Sans Pro", ...`), spacing, and breakpoints. Include base reset, body styles, link styles, focus outline styles (`0 0 0 2px #ffffff, 0 0 0 4px #2491ff`).

- [ ] **App layout shell**: `src/App.jsx` with `BrowserRouter`. Layout structure top-to-bottom: `<GovBanner />`, `<Header />` (includes logo row + nav bar), `<main>` with routed content, `<Footer />`. Max-width container: 1024px centered. See DESIGN.md section 4 for measurements.

- [ ] **Routing**: Define all routes in App.jsx:
  - `/` -- `<Homepage />`
  - `/topics` -- `<AllTopicsPage />`
  - `/agency-index` -- `<AgencyDirectory />`
  - `/benefit-finder` -- `<BenefitFinder />`
  - `/life-events` -- `<LifeEventsPage />`
  - `/search` -- `<SearchPage />`
  - `/go` -- `<Go />`
  - `/:topicSlug` -- `<TopicPage />`
  - `/:topicSlug/:subtopicSlug` -- `<SubtopicPage />`
  - `/:topicSlug/:subtopicSlug/:pageSlug` -- `<ContentPage />`
  - `*` -- `<NotFound />` (404 page)

  **Important**: Static routes (`/topics`, `/agency-index`, `/benefit-finder`, `/life-events`, `/search`, `/go`) MUST be defined before the dynamic `/:topicSlug` catch-all routes to avoid conflicts.

- [ ] **State management**: Create `src/context/AppContext.jsx` with React Context. Provider wraps entire app. Exposes `state` object and `dispatch`/`setState` function. On mount: check for server-injected state via `GET /state?sid=<sid>` (read `sid` from URL `?sid=` param); if found, use it; otherwise call `createInitialData()`. Persist state to server via `POST /post?sid=<sid>` with `{"action":"set_current","state":{...}}` on every state mutation (use `saveState` helper). Include helper functions:
  - `searchPages(query)` -- filter `searchIndex` by query string match on title/description (case-insensitive)
  - `filterAgencies(letter, textFilter)` -- filter agencies by letter and text search
  - `filterBenefits(categories, lifeEvent)` -- filter benefits by selected categories and life event

- [ ] **Data manager**: Create `src/utils/dataManager.js` with `createInitialData()` function that returns the full state object. See `assets/data_model.md` for complete structure and SCHEMA.md for all entity definitions. This is the largest single file -- it must contain all 22 topics, ~80 subtopics, ~120 pages (20 with full HTML body), 55+ agencies, 25+ benefits, 12 benefit categories, 3 benefit life events, 6 life events, 4 quick links, and 100+ search index entries. Generate realistic content matching real USA.gov information.

- [ ] **`/go` endpoint**: Create `src/pages/Go.jsx`. Reads `sid` from URL params. Fetches current state and initial state. Computes `state_diff` by comparing each key (using JSON.stringify for deep equality). Renders raw JSON: `{initial_state, current_state, state_diff}`. The diff format: for each changed key, `{ old: <initial_value>, new: <current_value> }`.

- [ ] **Session isolation (vite.config.js)**: Create `vite.config.js` with Vite plugin that provides server middleware for:
  - `POST /post?sid=<sid>` -- set/reset state (actions: `set`, `set_current`, `reset`)
  - `GET /state?sid=<sid>` -- read stored state
  - `GET /go?sid=<sid>` -- return `{initial_state, current_state, state_diff}`

  Use file-based state storage in `.mock-states/` directory. On `set` action, write both `.json` and `.initial.json` files (initial only if it does not exist yet). Duplicate middleware for both `configureServer` and `configurePreviewServer`. Follow the exact pattern from `gmail_mock/vite.config.js`. Import `createInitialData` as `INITIAL_STATE` from `./src/utils/dataManager.js`.

---

## P1 -- Primary Features

Core features a user interacts with in the first 5 minutes. Implement after P0 is complete.

### Government Banner Component
- [ ] **GovBanner** (`src/components/GovBanner.jsx`): Full-width grey bar (`#f0f0f0`) at very top of page. Shows small US flag icon (use a simple SVG or emoji), text "An official website of the United States government", and a clickable "Here's how you know" link/button. Clicking it toggles `expandedBannerInfo` in state (must call `saveState` to persist). When expanded, shows two columns: left column with .gov domain explanation ("Official websites use .gov" + description), right column with HTTPS lock explanation ("Secure .gov websites use HTTPS" + description). Collapsing sets `expandedBannerInfo` to `false`. See DESIGN.md `.gov-banner` styles.

### Header Component
- [ ] **Header** (`src/components/Header.jsx`): Two-row header. **Row 1 (logo row)**: USAGov text logo on the left (dark blue circle with "usa" in white and "gov" in cyan, or just styled text "USAGov"), search input + button in the center-right area, phone number "1-844-USAGOV1" and language toggle button ("Espanol" when `currentLanguage === "en"`, "English" when `"es"`). Clicking language toggle updates `currentLanguage` in state. Search input: on submit (Enter key or button click), navigate to `/search?query=<input_value>` and update `currentSearch` in state. **Row 2 (navigation bar)**: Dark blue bar (`#1a4480`), horizontal list of 6 main nav topic links (from `mainNavTopics` mapped to topic titles) + "All topics and services" link to `/topics`. Each nav link shows the topic title. Clicking a nav item navigates to `/:topicSlug`. Hovering or clicking a nav item with `inMainNav: true` should open a mega-menu dropdown showing that topic's `popularLinks` (3 links) and subtopics. Opening a menu sets `expandedMenus[topicId] = true`; closing sets it to `false`. Only one menu open at a time.

### Footer Component
- [ ] **Footer** (`src/components/Footer.jsx`): Dark background (`#1b1b1b`). Max-width container inside. 4-column grid layout on desktop (stacked on mobile). **Column 1**: "About USAGov" with links (About us, Accessibility policy, Privacy policy). **Column 2**: "Government information" with links (All topics, Agency index, Benefits). **Column 3**: "Contact center" with phone number "1-844-USAGOV1", hours "8am-6pm ET". **Column 4**: "Find us on social media" with placeholder social links. Below columns: bottom bar (`#162e51`) with "USAGov is the official guide to government information and services" text and GSA attribution. See DESIGN.md footer styles.

### Homepage
- [ ] **Homepage** (`src/pages/Homepage.jsx`): Composed of sections top-to-bottom:
  1. **Hero banner**: Dark blue background (`#1a4480`), white text. Heading: value of `tagline` from state ("Making government services easier to find"). Subtext: "USAGov makes it easier for you to find what you need from the federal government." Full-width, padded 48px vertical.
  2. **Quick links section**: Heading "How do I..." followed by 4 quick link buttons/pills from `quickLinks` state. Each is a rounded outlined button/link showing the label text. Clicking navigates to the `url`. Layout: 2x2 grid on desktop, stacked on mobile. Style: outlined buttons with blue border and text, white background.
  3. **Benefits CTA card**: Blue-tinted card with heading "Government benefits and financial assistance", description text "Find benefits you may be eligible for", and a "Find benefits" primary button linking to `/benefit-finder`.
  4. **Topics grid**: Heading "All topics and services" with link to `/topics`. Grid of 22 topic cards (3 columns desktop, 2 tablet, 1 mobile, gap 24px). Each card: white background, 1px `#dfe1e2` border, 24px padding. Card title is blue link text (`#005ea2`, underlined), clicking navigates to `/:topicSlug`. Below title: 1-2 line grey description text.

### All Topics Page
- [ ] **AllTopicsPage** (`src/pages/AllTopicsPage.jsx`): Breadcrumbs: Home > All topics and services. Heading: "All topics and services". Same topic card grid as homepage but full-page (no hero, no quick links). 22 topic cards, 3-column grid. Each card links to `/:topicSlug`.

### Topic Page
- [ ] **TopicPage** (`src/pages/TopicPage.jsx`): Reads `:topicSlug` from URL params. Looks up topic from `topics` array by slug. Breadcrumbs: Home > [Topic Title]. Heading: topic title. Description paragraph. **"Most popular" section**: Bulleted list of `popularLinks` (3 items), each a blue link navigating to the link's `url`. **"Subtopics" section**: Cards for each subtopic under this topic (filter `subtopics` flat array by `parentTopicId === topicSlug`). Each card: subtopic title as blue link to `/:topicSlug/:subtopicSlug`, description below. If topic not found, show 404.

### Subtopic Page
- [ ] **SubtopicPage** (`src/pages/SubtopicPage.jsx`): Reads `:topicSlug` and `:subtopicSlug` from URL params. Look up subtopic from flat `subtopics` array by slug and parentTopicId. Breadcrumbs: Home > [Topic] > [Subtopic]. Heading: subtopic title. Description paragraph. **Content pages list**: Cards for each page under this subtopic (filter `pages` flat array by `parentSubtopicId === subtopicSlug`). Each card: page title as blue link to `/:topicSlug/:subtopicSlug/:pageSlug`, description below, "Last updated: [date]" in grey caption text. **Sidebar navigation** (optional, on desktop right): list of sibling subtopics under same parent topic for quick navigation.

### Content/Article Page
- [ ] **ContentPage** (`src/pages/ContentPage.jsx`): Reads `:topicSlug`, `:subtopicSlug`, `:pageSlug` from URL params. Look up page from flat `pages` array by id matching `pageSlug`. Breadcrumbs from page's `breadcrumbs` array (render as clickable links with ">" separators). Heading: page title. Description paragraph (italic or regular). **Body content**: Render `page.body` as `dangerouslySetInnerHTML` (the body contains safe HTML: `<h2>`, `<p>`, `<ul>`, `<li>`, `<ol>`, `<a>`). **Last updated**: "Last updated: [lastUpdated]" in grey text. **Related pages section**: If `relatedPages` array is non-empty, show "Related pages" heading with links to each related page (look up page by ID to get its title and construct its URL from parentTopicId/parentSubtopicId/id).

### Agency Directory
- [ ] **AgencyDirectory** (`src/pages/AgencyDirectory.jsx`): Breadcrumbs: Home > A-Z index of U.S. government departments and agencies. Heading: "A-Z index of U.S. government departments and agencies". **Search input**: Full-width input with placeholder "Search agencies and departments" + magnifying glass button. Typing updates `agencyDirectoryFilter` in state (on each keystroke or on submit -- use onChange for immediate filtering, and persist state on blur or debounced). **Letter navigation**: Horizontal bar of letters A-Z. Each letter is a clickable button. Active letter (`agencyDirectoryLetter`) is highlighted (blue background, white text). Clicking a letter updates `agencyDirectoryLetter` in state and filters the agency list. **Agency list**: Show agencies matching current letter AND text filter. Each agency card separated by horizontal rule (`<hr>`). Card shows: **Name** (bold, large), **Description** (1 line), **Website**: displayed URL (blue link, but opens nothing in mock), **Phone**: phone number, **Contact**: "Contact [Agency Name]" link. Filter logic: if `agencyDirectoryFilter` is non-empty, search across `name`, `acronym`, `description` (case-insensitive substring match), show all matches regardless of letter. If filter is empty, show agencies whose `letter` matches `agencyDirectoryLetter`.

### Benefit Finder
- [ ] **BenefitFinder** (`src/pages/BenefitFinder.jsx`): Breadcrumbs: Home > Government benefits > Benefit finder. Heading: "Benefit finder". Two-column layout on desktop (sidebar left 280px, main area right). **Left sidebar**: "Filter by category" heading, then 12 checkboxes (one per `benefitCategories` item). Checking/unchecking toggles the category ID in `selectedBenefitCategories` array in state. Below: "Filter by life event" heading, then a `<select>` dropdown with default "All life events" + 3 options from `benefitLifeEvents`. Selecting updates `selectedBenefitLifeEvent` in state (null for "All"). "Clear all filters" link resets both to defaults. **Main area**: Benefit cards matching current filters. Filter logic: if categories selected, benefit must have at least one matching category; if life event selected, benefit must include that life event in its `lifeEvents` array. If no filters, show all. Each card: benefit name (bold heading), description, "Eligibility:" + eligibility text, "How to apply:" + howToApply text, "Agency:" + agency name (look up from agencies by agencyId). Show count: "Showing X of Y benefits".

### Search Page
- [ ] **SearchPage** (`src/pages/SearchPage.jsx`): Read `query` from URL search params (`?query=`). On mount, set `currentSearch` to query value in state. Search input pre-filled with query, with submit button. On submit, update URL and state. **Results area**: Call `searchPages(query)` helper. Display "X results for '[query]'" heading. List of results: each shows title (blue link), URL path in grey below title, description snippet (2-3 lines). Clicking title navigates to result's `url`. If no results, show "No results found for '[query]'. Try different search terms."

### Breadcrumbs Component
- [ ] **Breadcrumbs** (`src/components/Breadcrumbs.jsx`): Reusable component. Takes `items` prop (array of `{label, path}`). Renders horizontal list with ">" separators. Each item except last is a blue link. Last item is plain text (current page). See DESIGN.md breadcrumb styles.

---

## P2 -- Secondary Features

Depth features that add realism. Implement only after P1 is solid.

- [ ] **Life Events page** (`src/pages/LifeEventsPage.jsx`): Breadcrumbs: Home > Life events. Heading: "Life events". Grid of 6 life event cards (2 columns desktop, 1 mobile). Each card: title (bold heading), description, "Find related benefits" link that navigates to `/benefit-finder` with pre-selected categories (using URL params or by setting state before navigation based on `relatedBenefitCategories`).

- [ ] **Navigation mega-menu**: When a main nav item is hovered or clicked, show a dropdown panel below the nav bar. Panel shows: left column with "Most popular" links (topic's popularLinks), right column with subtopic list. Panel has white background, box shadow, full-width of nav bar. Clicking outside closes menu. Track open state in `expandedMenus`.

- [ ] **Back-to-top button**: Fixed position button (bottom-right, 24px from edges) that appears when user scrolls down 300px+. Clicking smoothly scrolls to top. Styled as blue circle with up-arrow icon.

- [ ] **404 Not Found page** (`src/pages/NotFound.jsx`): Heading "Page not found". Description: "We're sorry, we can't find the page you're looking for." Link back to homepage. Fallback for topic/subtopic/page lookups that find no matching data.

- [ ] **Mobile responsive**: Hamburger menu icon replaces nav bar on screens < 640px. Clicking opens a slide-out or full-width nav panel listing all topics. Search moves inside mobile menu. Quick links stack to single column.

- [ ] **Skip navigation link**: First focusable element, visually hidden until focused. Text: "Skip to main content". On Enter, focus jumps to `<main>` element. Accessibility best practice for USWDS.

- [ ] **Print-friendly styles**: `@media print` rules that hide header, footer, nav, and show only main content with clean typography.

---

## Data Seed (implement in createInitialData())

- [ ] **Topics**: 20 unique topics (see data_model.md), each with realistic title, description (1-2 sentences about the topic), icon field, slug, inMainNav flag, order number, and 3 popularLinks referencing real page IDs/URLs. Generate descriptions matching real USA.gov content.

- [ ] **Subtopics**: ~80 subtopics distributed across topics (see SCHEMA.md for counts per topic). Each with title, description, parentTopicId, slug, order. Subtopic IDs must be kebab-case slugs matching their URL segment.

- [ ] **Pages**: ~120 pages. 20 priority pages (listed in data_model.md) must have full HTML body content (3-4 paragraphs with `<h2>`, `<p>`, `<ul>`, `<li>` tags providing realistic government information). Remaining ~100 pages need at minimum: title, description (1 sentence), parentTopicId, parentSubtopicId, breadcrumbs array, empty relatedPages, and lastUpdated date. Body can be a single `<p>` with the description for non-priority pages.

- [ ] **Agencies**: 55+ agencies spanning letters A-Z. Use real agency names, acronyms, descriptions, website URLs, and phone numbers. See SCHEMA.md for the full list of agency IDs by letter. Each must have category (department/agency/commission/corporation) and parentDepartment where applicable.

- [ ] **Benefits**: 25+ benefits covering all 12 categories. Each with name, description, categories array, lifeEvents array, eligibility summary, howToApply instructions, agencyId, and website. See SCHEMA.md for the complete list.

- [ ] **Search index**: 100+ SearchResult entries. Generate one entry per page (using page title, description, URL constructed from parentTopicId/parentSubtopicId/id) plus one entry per topic (using topic title, description, `/:topicSlug`). Assign sequential IDs (`sr-1`, `sr-2`, ...).

---

## Out of Scope

Dev must NOT implement these:

- Authentication / login (site is public, no user accounts)
- Real external links (agency websites display as text only, do not open in new tabs)
- Real language translation (Espanol toggle changes `currentLanguage` state but does not translate UI text)
- Real search API (search is purely client-side filtering of `searchIndex`)
- Database persistence (beyond server-side JSON files per session)
- File uploads or downloads
- Real form submissions (benefit applications, voter registration, etc.)
- Email/SMS sending
- Analytics or tracking
