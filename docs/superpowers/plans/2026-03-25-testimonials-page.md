# Testimonials Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `/testimonials` page showing all testimonials, add it to the navbar, and limit the home page section to 2 testimonials with a "View all" link.

**Architecture:** New server-rendered page at `app/testimonials/page.tsx` fetches from the existing `GET /api/testimonials` endpoint. The existing `TestimonialsSection` component is updated to accept a limit and show a "View all" link. Navigation array in `Navbar.tsx` gets a new entry.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-25-testimonials-page-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/Navbar.tsx` | Modify (line 10-15) | Add "Testimonials" nav item |
| `components/home/TestimonialsSection.tsx` | Modify | Limit display to 2, add "View all" link |
| `app/testimonials/page.tsx` | Create | Dedicated testimonials page |

---

### Task 1: Add "Testimonials" to navigation

**Files:**
- Modify: `components/Navbar.tsx:10-15`

- [ ] **Step 1: Add nav item**

In `components/Navbar.tsx`, update the `navigation` array (line 10-15) from:

```ts
const navigation = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
```

To:

```ts
const navigation = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
```

Both desktop and mobile nav iterate over this array, so both update automatically.

- [ ] **Step 2: Verify**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds (the `/testimonials` route doesn't exist yet, but the nav link is just an `<a>` tag — no build error).

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(nav): add Testimonials link to main navigation"
```

---

### Task 2: Update home page testimonials section

**Files:**
- Modify: `components/home/TestimonialsSection.tsx`

- [ ] **Step 1: Update component to limit display and add "View all" link**

Replace the entire content of `components/home/TestimonialsSection.tsx` with:

```tsx
import Link from 'next/link'

interface Testimonial {
  id: string
  author: string
  company: string
  title?: string
  quote: string
  sortOrder?: number
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Don't render the section if no testimonials
  if (testimonials.length === 0) {
    return null
  }

  const displayedTestimonials = testimonials.slice(0, 2)
  const hasMore = testimonials.length > 2

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-light mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What colleagues and collaborators say about working with Shagun
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {displayedTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-4">
              {/* Main Quote */}
              <blockquote className="text-lg leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author and Title */}
              <div className="space-y-1">
                <div className="text-base font-bold tracking-wider uppercase text-muted-foreground">
                  {testimonial.author}
                </div>
                <div className="text-base font-bold tracking-wider uppercase text-muted-foreground">
                  {testimonial.title ? `${testimonial.title} AT ${testimonial.company}` : testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <Link
              href="/testimonials"
              className="text-base font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
            >
              View all testimonials
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
```

Key changes from the original:
- Added `import Link from 'next/link'`
- `displayedTestimonials = testimonials.slice(0, 2)` limits to 2
- `hasMore` flag shows the "View all" link only when there are more than 2
- "View all testimonials →" link at the bottom, centered, styled with `text-primary`

- [ ] **Step 2: Verify**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/home/TestimonialsSection.tsx
git commit -m "feat(home): limit testimonials to 2 with 'View all' link"
```

---

### Task 3: Create the dedicated testimonials page

**Files:**
- Create: `app/testimonials/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/testimonials/page.tsx`:

```tsx
interface Testimonial {
  id: string
  author: string
  company: string
  title?: string
  quote: string
  sortOrder?: number
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/testimonials`, {
      next: { revalidate: 300, tags: ['testimonials'] },
    })

    if (response.ok) {
      const data = await response.json()
      return data.testimonials
    }
    return []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-light mb-4">Testimonials</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          What colleagues and collaborators say about working with Shagun
        </p>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground">No testimonials yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-4">
              <blockquote className="text-lg leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="space-y-1">
                <div className="text-base font-bold tracking-wider uppercase text-muted-foreground">
                  {testimonial.author}
                </div>
                <div className="text-base font-bold tracking-wider uppercase text-muted-foreground">
                  {testimonial.title ? `${testimonial.title} AT ${testimonial.company}` : testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

This follows the pattern from `app/about/page.tsx`:
- Server-rendered async component
- Same `getProfile()`-style data fetching with `revalidate`
- Same container width (`max-w-6xl`) and padding (`px-4 py-8`)
- Same heading style (`text-4xl font-display font-light`)
- Testimonial card rendering matches `TestimonialsSection.tsx` exactly
- Empty state message for when no testimonials exist

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds. The `/testimonials` route should appear in the build output.

- [ ] **Step 3: Commit**

```bash
git add app/testimonials/page.tsx
git commit -m "feat: add dedicated testimonials page

Closes #2"
```
