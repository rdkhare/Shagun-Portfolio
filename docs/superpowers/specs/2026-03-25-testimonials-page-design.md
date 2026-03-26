# Testimonials Page Design

**Issue:** [rdkhare/shagun-portfolio#2](https://github.com/rdkhare/shagun-portfolio/issues/2)
**Date:** 2026-03-25

## Overview

Add a dedicated `/testimonials` page accessible from the main navigation, displaying all active testimonials in a scrollable two-column grid. Limit the home page testimonials section to 2 items with a "View all" link.

## Requirements (from issue)

- Dedicated page where all testimonials are visible
- Browsable/scrollable (not just a carousel)
- Accessible from the main navigation

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Page vs anchor | Dedicated `/testimonials` route | Clean URL, own page, doesn't overload home page |
| Layout | Two-column grid | Consistent with existing home page testimonials section |
| Home page behavior | Limit to 2 + "View all" link | Keeps home page focused, gives reason to visit dedicated page |

## Implementation

### 1. New page: `app/testimonials/page.tsx`

- Server-rendered async component
- Fetches all active testimonials from `GET /api/testimonials` with `revalidate: 300` (matches home page caching)
- Centered heading: "Testimonials" (`text-4xl font-display font-light`)
- Subtitle: "What colleagues and collaborators say about working with Shagun"
- Two-column grid: `grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12`
- Each testimonial: blockquote with quote text, author name (bold uppercase), title/company line — same rendering as `TestimonialsSection.tsx`
- Empty state: message if no testimonials exist
- Container: `max-w-6xl` with `px-4`, consistent with other pages

### 2. Navigation update: `components/Navbar.tsx`

Add "Testimonials" entry to the `navigation` array between "Articles" and "About":

```ts
const navigation = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
```

This automatically applies to both desktop and mobile nav since they both iterate over this array.

### 3. Home page update: `components/home/TestimonialsSection.tsx`

- Accept all testimonials as props (no API change)
- Slice to first 2 for display: `testimonials.slice(0, 2)`
- Add a "View all testimonials" link below the grid, pointing to `/testimonials`
- Link styled as a text link with arrow, centered, matching site aesthetic

### 4. No new API endpoints

The existing `GET /api/testimonials` returns all active testimonials ordered by `sortOrder`. The new page uses it directly. The home page component handles its own slicing.

## Files Changed

| File | Change |
|------|--------|
| `app/testimonials/page.tsx` | **New** — dedicated testimonials page |
| `components/Navbar.tsx` | Add "Testimonials" nav item |
| `components/home/TestimonialsSection.tsx` | Limit to 2 items, add "View all" link |

## Out of Scope

- Filtering or search on testimonials page (not needed for current volume)
- Pagination (all testimonials render on one scrollable page)
- Changes to admin testimonials management
- Changes to the testimonial data model
