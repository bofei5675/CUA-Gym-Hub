# Design System Inspired by USA.gov (USWDS)

USA.gov uses the **U.S. Web Design System (USWDS)** -- a design framework created by the federal government for government websites. The design is clean, accessible, authoritative, and high-contrast.

## 1. Visual Theme & Atmosphere

The site conveys trust, authority, and accessibility. It uses a restrained palette of navy blue and white with clean typography. The layout is spacious with generous whitespace, clear hierarchy, and strong information architecture. There are no decorative flourishes -- every element serves a functional purpose. The overall feeling is professional, institutional, and easy to navigate, designed for the widest possible audience including low-vision users and non-native English speakers.

The page structure is vertically stacked with a full-width layout. Content areas are constrained to a max-width container (1024px desktop). The government banner at the very top is a distinguishing pattern unique to .gov websites.

## 2. Color Palette & Roles

### Primary
- **Primary** (`#005ea2`): Main interactive color -- links, primary buttons, active navigation items, header accents
- **Primary Dark** (`#1a4480`): Header background, navigation bar background, footer headings
- **Primary Darker** (`#162e51`): Government banner background, darkest accents, footer background
- **Primary Light** (`#73b3e7`): Hover highlights, secondary accents
- **Primary Lighter** (`#d9e8f6`): Light info backgrounds, selected states, tag backgrounds

### Base / Neutral
- **White** (`#ffffff`): Page background, card backgrounds, button text on primary
- **Base Lightest** (`#f0f0f0`): Section alternate backgrounds, input backgrounds, table striping
- **Base Lighter** (`#dfe1e2`): Borders, dividers, card borders
- **Base Light** (`#a9aeb1`): Placeholder text, disabled states
- **Base** (`#71767a`): Secondary text, captions, metadata
- **Base Dark** (`#565c65`): Body text secondary
- **Base Darker** (`#3d4551`): Strong body text
- **Base Darkest / Ink** (`#1b1b1b`): Primary body text, headings

### Secondary (Red -- used sparingly)
- **Secondary** (`#d83933`): Error states, required field indicators
- **Secondary Vivid** (`#e41d3d`): Error borders, destructive actions
- **Secondary Dark** (`#b50909`): Error text

### Accent Cool
- **Accent Cool** (`#00bde3`): Info badges, secondary highlights
- **Accent Cool Darker** (`#07648d`): Info text

### Accent Warm
- **Accent Warm** (`#fa9441`): Warning states, attention callouts
- **Accent Warm Dark** (`#c05600`): Warning text

### Status
- **Success** (`#00a91c`): Success messages, confirmation states
- **Warning** (`#ffbe2e`): Warning messages, caution states
- **Error** (`#d54309`): Error messages, form validation errors
- **Info** (`#00bde3`): Informational callouts

## 3. Typography Rules

Font family: `"Source Sans Pro", "Helvetica Neue", Helvetica, Roboto, "Noto Sans", "Noto Sans JP", sans-serif`

| Role | Size | Weight | Line Height | Letter Spacing | Color |
|------|------|--------|-------------|----------------|-------|
| Page Title (h1) | 40px (2.5rem) | 700 (Bold) | 1.2 | -0.015em | `#1b1b1b` |
| Section Heading (h2) | 32px (2rem) | 700 (Bold) | 1.2 | 0 | `#1b1b1b` |
| Subsection (h3) | 24px (1.5rem) | 700 (Bold) | 1.3 | 0 | `#1b1b1b` |
| Card Title (h4) | 20px (1.25rem) | 700 (Bold) | 1.4 | 0 | `#005ea2` |
| Body | 17px (1.06rem) | 400 (Regular) | 1.6 | 0 | `#1b1b1b` |
| Body Small | 15px (0.94rem) | 400 (Regular) | 1.6 | 0 | `#3d4551` |
| Caption / Meta | 13px (0.81rem) | 400 (Regular) | 1.5 | 0.025em | `#71767a` |
| Nav Link | 16px (1rem) | 700 (Bold) | 1.2 | 0 | `#ffffff` |
| Button Text | 16px (1rem) | 700 (Bold) | 1 | 0 | inherit |
| Gov Banner Text | 13px (0.81rem) | 400 (Regular) | 1.5 | 0 | `#1b1b1b` |

## 4. Spacing & Layout

### Page Structure
- **Government banner height**: 32px collapsed, auto expanded
- **Header height**: ~120px (logo row + nav row)
- **Logo row height**: 56px
- **Navigation bar height**: 48px
- **Content max-width**: 1024px (desktop), centered
- **Content padding (horizontal)**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Footer padding**: 40px vertical

### Spacing Scale (USWDS units)
- `4px` (0.5 unit): Tight inline spacing
- `8px` (1 unit): Default inline spacing, small gaps
- `16px` (2 units): Standard padding, card internal padding
- `24px` (3 units): Section gaps, card padding
- `32px` (4 units): Large section spacing
- `40px` (5 units): Hero padding, major section dividers
- `48px` (6 units): Section vertical margins
- `64px` (8 units): Large vertical spacing

### Grid
- Topic grid: 3 columns on desktop (gap: 24px), 2 columns tablet, 1 column mobile
- Agency cards: single column list
- Quick links: 2x2 grid on desktop, stacked on mobile

### Breakpoints
- Mobile: 0-479px
- Mobile-lg: 480-639px
- Tablet: 640-879px
- Tablet-lg: 880-1023px
- Desktop: 1024-1199px
- Desktop-lg: 1200px+

## 5. Component Patterns

### Government Banner (top of every page)
```css
.gov-banner {
  background: #f0f0f0;
  padding: 4px 16px;
  font-size: 13px;
  color: #1b1b1b;
  border-bottom: none;
}
.gov-banner__flag { height: 11px; margin-right: 8px; }
.gov-banner__button { color: #005ea2; font-size: 13px; text-decoration: underline; cursor: pointer; background: none; border: none; }
.gov-banner__content { padding: 16px 0; display: flex; gap: 32px; }
```

### Header
```css
.usa-header {
  background: #ffffff;
  border-bottom: none;
}
.usa-header__logo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  max-width: 1024px;
  margin: 0 auto;
}
.usa-header__logo { height: 40px; }
.usa-header__search {
  display: flex;
  align-items: center;
}
.usa-header__phone { font-size: 14px; color: #1b1b1b; font-weight: 700; }
```

### Navigation Bar
```css
.usa-nav {
  background: #1a4480;
  padding: 0;
}
.usa-nav__list {
  display: flex;
  max-width: 1024px;
  margin: 0 auto;
  list-style: none;
  padding: 0;
}
.usa-nav__item > a {
  color: #ffffff;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  display: block;
}
.usa-nav__item > a:hover { background: #162e51; }
.usa-nav__item--active > a { border-bottom: 4px solid #ffffff; }
```

### Primary Button
```css
.usa-button {
  background: #005ea2;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Source Sans Pro", sans-serif;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.usa-button:hover { background: #1a4480; }
.usa-button:active { background: #162e51; }
.usa-button--outline {
  background: transparent;
  color: #005ea2;
  border: 2px solid #005ea2;
}
.usa-button--outline:hover { background: #d9e8f6; }
```

### Search Input
```css
.usa-search input[type="search"] {
  border: 1px solid #565c65;
  border-radius: 0;
  padding: 8px 12px;
  font-size: 16px;
  height: 40px;
  font-family: "Source Sans Pro", sans-serif;
}
.usa-search button {
  background: #005ea2;
  color: #ffffff;
  border: none;
  height: 40px;
  width: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Topic Card
```css
.usa-card {
  border: 1px solid #dfe1e2;
  border-radius: 0;
  padding: 24px;
  background: #ffffff;
  text-decoration: none;
  display: block;
  transition: border-color 0.15s;
}
.usa-card:hover { border-color: #005ea2; }
.usa-card__title {
  color: #005ea2;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  text-decoration: underline;
}
.usa-card__description {
  color: #3d4551;
  font-size: 15px;
  line-height: 1.6;
}
```

### Link Styles
```css
a { color: #005ea2; text-decoration: underline; }
a:hover { color: #1a4480; }
a:visited { color: #54278f; }
a:active { color: #162e51; }
```

### Breadcrumbs
```css
.usa-breadcrumb {
  padding: 16px 0;
  font-size: 14px;
}
.usa-breadcrumb__item { display: inline; color: #71767a; }
.usa-breadcrumb__item a { color: #005ea2; text-decoration: none; }
.usa-breadcrumb__item a:hover { text-decoration: underline; }
.usa-breadcrumb__separator { margin: 0 8px; color: #71767a; }
```

### Accordion
```css
.usa-accordion__button {
  background: #f0f0f0;
  border: none;
  padding: 16px;
  width: 100%;
  text-align: left;
  font-size: 17px;
  font-weight: 700;
  color: #1b1b1b;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.usa-accordion__content {
  padding: 16px;
  border: 1px solid #dfe1e2;
  border-top: none;
}
```

### Checkbox / Filter
```css
.usa-checkbox__input { width: 20px; height: 20px; accent-color: #005ea2; }
.usa-checkbox__label { font-size: 16px; color: #1b1b1b; padding-left: 8px; cursor: pointer; }
```

## 6. Shadow & Elevation

USWDS is intentionally flat with minimal elevation:
- **Card shadow**: none (border-based separation)
- **Dropdown/menu shadow**: `0 4px 8px rgba(0, 0, 0, 0.1)`
- **Modal overlay**: `rgba(0, 0, 0, 0.5)` background
- **Sticky header shadow**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Focus ring**: `0 0 0 2px #ffffff, 0 0 0 4px #2491ff` (USWDS focus outline)

## 7. Icon System

USA.gov uses simple inline SVG icons. For the mock, use basic SVG or Unicode symbols:
- Search: magnifying glass
- Menu: hamburger (3 lines)
- Expand/collapse: chevron up/down
- External link: box-arrow-up-right
- Phone: telephone receiver
- Flag: US flag emoji or small SVG
- Topic icons: simple representational SVGs (can be omitted, use colored circles as fallback)

## 8. Footer Pattern
```css
.usa-footer {
  background: #1b1b1b;
  color: #ffffff;
  padding: 40px 0;
}
.usa-footer a { color: #d9e8f6; text-decoration: underline; }
.usa-footer a:hover { color: #ffffff; }
.usa-footer__heading { font-size: 17px; font-weight: 700; margin-bottom: 16px; }
.usa-footer__list { list-style: none; padding: 0; }
.usa-footer__list li { margin-bottom: 8px; font-size: 15px; }
.usa-footer__bottom {
  background: #162e51;
  padding: 16px 0;
  text-align: center;
  font-size: 13px;
  color: #a9aeb1;
}
```

## 9. Language Toggle
```css
.language-toggle {
  background: #162e51;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.language-toggle:hover { background: #ffffff; color: #162e51; }
```

## 10. Hero Banner (Homepage)
```css
.usa-hero {
  background: #1a4480;
  color: #ffffff;
  padding: 48px 0;
}
.usa-hero__heading {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}
.usa-hero__text {
  font-size: 20px;
  line-height: 1.5;
  max-width: 640px;
}
```
