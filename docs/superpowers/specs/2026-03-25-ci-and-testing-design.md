# CI Workflows & Vitest Setup Design

**Date:** 2026-03-25
**Branch:** rdkhare.ci-setup
**Status:** Approved

## Goal

Add GitHub Actions CI and Claude code review workflows to the Shagun portfolio repo, modeled after the Kavi project's setup. Also set up Vitest with initial test coverage across utilities, components, and API routes.

## 1. CI Workflow — `.github/workflows/ci.yml`

**Triggers:** push to `main`, PRs targeting `main`

**Concurrency:** `cancel-in-progress: true` per workflow+ref (matches Kavi pattern)

**Runner:** `ubuntu-latest`, Node 22, npm cache

**Three parallel jobs:**

### Lint
- `npm ci`
- `npx next lint`

### Test
- `npm ci`
- `npx vitest run`
- No `DATABASE_URL` needed — DB is mocked in tests

### Build
- `npm ci`
- `next build`
- Requires `DATABASE_URL` secret (lib/db/client.ts throws at import time without it)

**Secrets required:** `DATABASE_URL` (build job only)

## 2. Claude Review Workflow — `.github/workflows/claude-review.yml`

**Triggers:** PR events — opened, synchronize, ready_for_review, reopened

**Permissions:** contents read, pull-requests write, id-token write

**Skip:** dependabot PRs

**Action:** `anthropics/claude-code-action@v1` with `ANTHROPIC_API_KEY` secret

**Review prompt focus areas:**
- Code quality and correctness
- Potential bugs or edge cases
- Security issues (OWASP top 10)
- Performance concerns
- DRY violations
- Missing error handling at system boundaries

**Context in prompt:** Next.js 16 portfolio CMS with Drizzle ORM (Neon PostgreSQL), NextAuth v5 (Google OAuth), Supabase storage, tRPC, Lexical rich text editor

**Behavior:**
- Auto-approve if no critical/high-severity issues
- Request changes if critical/high-severity issues found

**Allowed tools:** inline comments + `gh pr` commands (same as Kavi)

## 3. Vitest Setup

### Dependencies (devDependencies)
- `vitest`
- `@vitejs/plugin-react`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`

### Configuration — `vitest.config.ts`
- `@vitejs/plugin-react` plugin
- `@/*` path alias matching tsconfig
- `jsdom` environment
- `v8` coverage provider
- Exclude: `node_modules`, `.next`, `lib/db/migrations`

### package.json scripts
- `"test": "vitest run"`
- `"test:watch": "vitest"`

### Test Structure

#### Layer 1: Utility Tests (`lib/__tests__/`)
- Pure function tests: `cn()` utility, env helpers
- `getAuthorizedEmails()` logic from auth.ts
- No mocking needed

#### Layer 2: Component Tests (`components/__tests__/`)
- `ArticleCard` — renders title, excerpt, image, link
- `Footer` — renders expected content and links
- Mocks for Next.js internals: `next/image`, `next/link`, `next/navigation`

#### Layer 3: API Route Tests (`app/api/__tests__/`)
- Test the public `GET /api/articles` endpoint
- Mock `lib/db/client` module — no real database needed
- Validate request handling, response shape, error cases
- Uses mock `NextRequest` / `NextResponse`

### DB Mocking Approach
- `vi.mock('@/lib/db/client')` at the vitest level
- Mock the `db` export with controlled return values per test
- Keeps tests fast, deterministic, and CI-friendly (no DB secret for test job)

## Secrets Summary

| Secret | Workflow | Job | Notes |
|--------|----------|-----|-------|
| `DATABASE_URL` | ci.yml | build | Required for `next build` |
| `ANTHROPIC_API_KEY` | claude-review.yml | review | Likely already at org level from Kavi |
