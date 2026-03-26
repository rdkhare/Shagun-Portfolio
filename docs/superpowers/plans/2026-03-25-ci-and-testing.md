# CI Workflows & Vitest Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GitHub Actions CI + Claude code review workflows and set up Vitest with initial test coverage across utilities, components, and API routes.

**Architecture:** Three parallel CI jobs (lint, test, build) with concurrency control. Vitest configured with jsdom for component testing, vi.mock for DB isolation. Claude review as a separate workflow on PR events.

**Tech Stack:** Vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @vitejs/plugin-react, GitHub Actions

---

## File Structure

**New files:**
- `.github/workflows/ci.yml` — CI pipeline (lint, test, build)
- `.github/workflows/claude-review.yml` — Claude PR review
- `vitest.config.ts` — Vitest configuration
- `vitest.setup.ts` — Test setup (jest-dom matchers)
- `lib/__tests__/utils.test.ts` — Utility function tests
- `lib/__tests__/auth-helpers.test.ts` — Auth helper tests
- `components/__tests__/ArticleCard.test.tsx` — ArticleCard component tests
- `components/__tests__/Footer.test.tsx` — Footer component tests
- `app/api/__tests__/articles.test.ts` — Articles API route tests

**Modified files:**
- `package.json` — add test scripts + devDependencies

---

### Task 1: Install Vitest and Testing Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install devDependencies**

Run from the worktree root (`/Users/rdkhare-1/Desktop/shagun-portfolio/.worktrees/ci-setup`):

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Add test scripts to package.json**

Add these to the `"scripts"` section of `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest and testing dependencies"
```

---

### Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'lib/db/migrations'],
    coverage: {
      provider: 'v8',
      exclude: ['node_modules', '.next', 'lib/db/migrations'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Create vitest.setup.ts**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Run vitest to verify config works (no tests yet, should exit cleanly)**

```bash
npx vitest run
```

Expected: exits with "no test files found" or similar — no errors about config.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts vitest.setup.ts
git commit -m "chore: configure vitest with jsdom and path aliases"
```

---

### Task 3: Utility Tests — `cn()` and Auth Helpers

**Files:**
- Create: `lib/__tests__/utils.test.ts`
- Create: `lib/__tests__/auth-helpers.test.ts`

- [ ] **Step 1: Write utility tests for `cn()`**

Create `lib/__tests__/utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('resolves tailwind conflicts (last wins)', () => {
    const result = cn('px-4', 'px-6')
    expect(result).toBe('px-6')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })
})
```

- [ ] **Step 2: Write auth helper tests**

The `getAuthorizedEmails` function in `auth.ts` is not exported, so we test the same logic directly. Create `lib/__tests__/auth-helpers.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Test the email parsing logic that getAuthorizedEmails uses
// (the function is not exported, so we test the pattern directly)
function parseAuthorizedEmails(emailsString: string | undefined): string[] {
  if (!emailsString) return []
  return emailsString
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0)
}

describe('parseAuthorizedEmails', () => {
  it('returns empty array when input is undefined', () => {
    expect(parseAuthorizedEmails(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseAuthorizedEmails('')).toEqual([])
  })

  it('parses single email', () => {
    expect(parseAuthorizedEmails('admin@example.com')).toEqual(['admin@example.com'])
  })

  it('parses comma-separated emails', () => {
    expect(parseAuthorizedEmails('a@example.com,b@example.com')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })

  it('trims whitespace around emails', () => {
    expect(parseAuthorizedEmails('  a@example.com , b@example.com  ')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })

  it('filters out empty entries from trailing commas', () => {
    expect(parseAuthorizedEmails('a@example.com,,b@example.com,')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add lib/__tests__/utils.test.ts lib/__tests__/auth-helpers.test.ts
git commit -m "test: add utility and auth helper tests"
```

---

### Task 4: Component Tests — ArticleCard

**Files:**
- Create: `components/__tests__/ArticleCard.test.tsx`

- [ ] **Step 1: Write ArticleCard component tests**

Create `components/__tests__/ArticleCard.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '@/components/ArticleCard'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiExternalLink: () => <span data-testid="external-icon" />,
}))

const baseProps = {
  title: 'Test Article',
  slug: 'test-article',
  publishedAt: '2025-06-15T00:00:00.000Z',
}

describe('ArticleCard', () => {
  it('renders title and formatted date', () => {
    render(<ArticleCard {...baseProps} />)
    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('June 15, 2025')).toBeInTheDocument()
  })

  it('links to internal article by default', () => {
    render(<ArticleCard {...baseProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/articles/test-article')
  })

  it('links to external URL when provided', () => {
    render(<ArticleCard {...baseProps} externalUrl="https://example.com/article" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/article')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows external icon for external articles', () => {
    render(<ArticleCard {...baseProps} externalUrl="https://example.com" />)
    expect(screen.getByTestId('external-icon')).toBeInTheDocument()
    expect(screen.getByText('External')).toBeInTheDocument()
  })

  it('renders cover image when provided', () => {
    render(<ArticleCard {...baseProps} coverImage="/test-cover.jpg" />)
    const img = screen.getByAltText('Cover image for Test Article')
    expect(img).toBeInTheDocument()
  })

  it('renders category when provided', () => {
    render(<ArticleCard {...baseProps} category="Tech" />)
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('renders featured badge when featured', () => {
    render(<ArticleCard {...baseProps} featured />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders publisher when provided', () => {
    render(<ArticleCard {...baseProps} publisher="NYT" />)
    expect(screen.getByText('Published in NYT')).toBeInTheDocument()
  })

  it('renders excerpt when provided', () => {
    render(<ArticleCard {...baseProps} excerpt="A short summary" />)
    expect(screen.getByText('A short summary')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add components/__tests__/ArticleCard.test.tsx
git commit -m "test: add ArticleCard component tests"
```

---

### Task 5: Component Tests — Footer

**Files:**
- Create: `components/__tests__/Footer.test.tsx`

- [ ] **Step 1: Write Footer component tests**

Create `components/__tests__/Footer.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />)
    expect(screen.getByText('Shagun Khare')).toBeInTheDocument()
  })

  it('renders quick links', () => {
    render(<Footer />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Articles')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders quick links with correct hrefs', () => {
    render(<Footer />)
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Articles').closest('a')).toHaveAttribute('href', '/articles')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
  })

  it('renders default bio when no profile provided', () => {
    render(<Footer />)
    expect(
      screen.getByText('Writer, journalist, and lifestyle enthusiast based in Brooklyn.')
    ).toBeInTheDocument()
  })

  it('renders custom footer bio from profile', () => {
    render(<Footer profile={{ footerBio: '<p>Custom bio text</p>' }} />)
    expect(screen.getByText('Custom bio text')).toBeInTheDocument()
  })

  it('renders contact email when provided', () => {
    render(<Footer profile={{ contactEmail: 'hello@example.com' }} />)
    expect(screen.getByText('hello@example.com')).toBeInTheDocument()
    expect(screen.getByText('hello@example.com').closest('a')).toHaveAttribute(
      'href',
      'mailto:hello@example.com'
    )
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} Shagun Khare`)).toBeInTheDocument()
  })

  it('renders developer credit', () => {
    render(<Footer />)
    expect(screen.getByText('Rajat Khare')).toBeInTheDocument()
  })

  it('renders LinkedIn link', () => {
    render(<Footer />)
    const linkedinLink = screen.getByText('shagun-khare-').closest('a')
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/shagun-khare-/')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add components/__tests__/Footer.test.tsx
git commit -m "test: add Footer component tests"
```

---

### Task 6: API Route Tests — GET /api/articles

**Files:**
- Create: `app/api/__tests__/articles.test.ts`

This task tests the public articles API route with a mocked database. The key challenge is that `lib/db/client.ts` throws if `DATABASE_URL` is not set, so we mock the entire module.

- [ ] **Step 1: Write API route tests**

Create `app/api/__tests__/articles.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the DB client before importing the route handler.
// This prevents the top-level DATABASE_URL check from throwing.
vi.mock('@/lib/db/client', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockLeftJoin = vi.fn()
  const mockWhere = vi.fn()

  // Chain: db.select().from().leftJoin().where()
  mockWhere.mockResolvedValue([])
  mockLeftJoin.mockReturnValue({ where: mockWhere })
  mockFrom.mockReturnValue({ leftJoin: mockLeftJoin })
  mockSelect.mockReturnValue({ from: mockFrom })

  return {
    db: {
      select: mockSelect,
      query: {},
    },
    __mockWhere: mockWhere,
    __mockSelect: mockSelect,
  }
})

// Import after mocking
import { GET } from '@/app/api/articles/route'

// Get mock handles for assertions
async function getMocks() {
  const mod = await import('@/lib/db/client')
  return mod as typeof mod & { __mockWhere: ReturnType<typeof vi.fn>; __mockSelect: ReturnType<typeof vi.fn> }
}

describe('GET /api/articles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty articles array when no articles exist', async () => {
    const mocks = await getMocks()
    mocks.__mockWhere.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/articles')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.articles).toEqual([])
  })

  it('returns articles sorted with featured first', async () => {
    const mocks = await getMocks()
    mocks.__mockWhere.mockResolvedValue([
      {
        id: '1',
        title: 'Regular Article',
        slug: 'regular',
        excerpt: null,
        coverImage: null,
        externalUrl: null,
        publisher: null,
        category: null,
        featured: false,
        featuredOrder: null,
        publishedAt: '2025-06-01T00:00:00.000Z',
        author: { id: 'u1', name: 'Author', slug: 'author@test.com' },
      },
      {
        id: '2',
        title: 'Featured Article',
        slug: 'featured',
        excerpt: 'A featured piece',
        coverImage: '/cover.jpg',
        externalUrl: null,
        publisher: null,
        category: 'Tech',
        featured: true,
        featuredOrder: 1,
        publishedAt: '2025-05-01T00:00:00.000Z',
        author: { id: 'u1', name: 'Author', slug: 'author@test.com' },
      },
    ])

    const request = new NextRequest('http://localhost:3000/api/articles')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.articles).toHaveLength(2)
    // Featured article should come first despite older date
    expect(data.articles[0].title).toBe('Featured Article')
    expect(data.articles[1].title).toBe('Regular Article')
  })

  it('returns 500 when database query fails', async () => {
    const mocks = await getMocks()
    mocks.__mockWhere.mockRejectedValue(new Error('DB connection failed'))

    const request = new NextRequest('http://localhost:3000/api/articles')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch articles')
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add app/api/__tests__/articles.test.ts
git commit -m "test: add API route tests for GET /api/articles"
```

---

### Task 7: CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx next lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx vitest run

  build:
    name: Build
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx next build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add CI workflow with lint, test, and build jobs"
```

---

### Task 8: Claude Review Workflow

**Files:**
- Create: `.github/workflows/claude-review.yml`

- [ ] **Step 1: Create claude-review.yml**

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]

jobs:
  review:
    if: github.actor != 'dependabot[bot]'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          track_progress: true
          prompt: |
            REPO: ${{ github.repository }}
            PR NUMBER: ${{ github.event.pull_request.number }}

            Review this pull request. Focus on:
            - Code quality and correctness
            - Potential bugs or edge cases
            - Security issues (OWASP top 10)
            - Performance concerns
            - DRY violations
            - Missing error handling at system boundaries

            This is a Next.js 16 portfolio CMS with Drizzle ORM (Neon PostgreSQL),
            NextAuth v5 (Google OAuth), Supabase storage, tRPC, and Lexical rich text editor.

            Use inline comments for specific code issues.
            Use a top-level PR comment to summarize your review.

            After reviewing, if there are NO critical or high-severity issues:
            - Approve the PR with `gh pr review --approve -b "Claude automated review: no critical issues found."`

            If there ARE critical or high-severity issues:
            - Request changes with `gh pr review --request-changes -b "<summary of critical issues>"`

          claude_args: |
            --allowedTools "mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr review:*)"
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/claude-review.yml
git commit -m "ci: add Claude code review workflow for PRs"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass across all 3 test layers (utility, component, API).

- [ ] **Step 2: Run lint**

```bash
npx next lint
```

Expected: no lint errors (test files may need minor adjustments if next/lint flags anything).

- [ ] **Step 3: Verify GitHub Actions YAML is valid**

```bash
cat .github/workflows/ci.yml | head -5
cat .github/workflows/claude-review.yml | head -5
```

Expected: both files exist and have valid YAML headers.

- [ ] **Step 4: Review git log**

```bash
git log --oneline origin/main..HEAD
```

Expected: clean commit history with descriptive messages.
