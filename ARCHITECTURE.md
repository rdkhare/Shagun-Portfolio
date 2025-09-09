# CMS Architecture Plan

## ASCII Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLIENT SIDE   │    │   SERVER SIDE   │    │   EXTERNAL      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ Next.js Pages   │◄──►│ API Routes      │    │ Supabase        │
│ - /admin/*      │    │ - /api/auth/*   │    │ - Storage       │
│ - /articles/*   │    │ - /api/trpc/*   │    │ - CDN           │
│ - /about        │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ React Components│    │ tRPC Routers    │    │ PostgreSQL      │
│ - Admin Forms   │◄──►│ - articles      │◄──►│ - Users         │
│ - Article Editor│    │ - auth          │    │ - Articles      │
│ - File Upload   │    │ - upload        │    │ - Categories    │
├─────────────────┤    ├─────────────────┤    │ - Media         │
│ tRPC Client     │    │ Drizzle ORM     │    │                 │
│ NextAuth Client │    │ NextAuth Server │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Directory Structure (New Files Only)
```
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   ├── client.ts          # Database client setup
│   │   └── migrations/        # SQL migration files
│   ├── auth/
│   │   ├── config.ts          # NextAuth configuration
│   │   └── providers.ts       # Auth providers (Google, Email)
│   ├── trpc/
│   │   ├── client.ts          # tRPC client (browser)
│   │   ├── server.ts          # tRPC server setup
│   │   └── routers/
│   │       ├── articles.ts    # Article CRUD operations
│   │       ├── categories.ts  # Category management
│   │       ├── auth.ts        # Auth-related procedures
│   │       └── upload.ts      # File upload handling
│   └── storage/
│       ├── config.ts          # Supabase storage config
│       └── upload.ts          # Upload utilities
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   ├── trpc/[trpc]/route.ts         # tRPC handler
│   │   └── upload/route.ts              # File upload endpoint
│   ├── admin/
│   │   ├── layout.tsx         # Admin layout with auth guard
│   │   ├── page.tsx           # Admin dashboard
│   │   ├── articles/
│   │   │   ├── page.tsx       # Article list
│   │   │   ├── new/page.tsx   # Create article
│   │   │   └── [id]/page.tsx  # Edit article
│   │   ├── categories/
│   │   │   └── page.tsx       # Category management
│   │   └── profile/
│   │       └── page.tsx       # Author profile editor
├── components/
│   └── admin/
│       ├── ArticleEditor.tsx  # Rich text editor
│       ├── ImageUpload.tsx    # Drag & drop upload
│       ├── CategorySelect.tsx # Category picker
│       └── AuthGuard.tsx      # Admin route protection
└── drizzle.config.ts          # Drizzle configuration
```

## Database Entities & Schema
```typescript
// Users (NextAuth integration)
users: {
  id: string (uuid, primary)
  email: string (unique, not null)
  name: string?
  image: string?
  role: enum('admin', 'editor') default 'editor'
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}

// Articles
articles: {
  id: string (uuid, primary)
  title: string (not null)
  slug: string (unique, not null)
  content: text (not null)          // HTML/Markdown
  excerpt: string?
  coverImage: string?               // Supabase storage URL
  status: enum('draft', 'published') default 'draft'
  featured: boolean default false
  authorId: string (foreign key -> users.id)
  publishedAt: timestamp?
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}

// Categories
categories: {
  id: string (uuid, primary)
  title: string (unique, not null)
  description: string?
  slug: string (unique, not null)
  createdAt: timestamp default now()
}

// Article-Category junction (many-to-many)
articleCategories: {
  articleId: string (foreign key -> articles.id)
  categoryId: string (foreign key -> categories.id)
  primary key (articleId, categoryId)
}

// Media files
media: {
  id: string (uuid, primary)
  filename: string (not null)
  originalName: string (not null)
  mimeType: string (not null)
  size: integer (not null)
  url: string (not null)           // Supabase storage URL
  uploadedBy: string (foreign key -> users.id)
  createdAt: timestamp default now()
}
```

## Client vs Server Execution

**CLIENT SIDE:**
- React components rendering
- Form interactions & validation
- tRPC client queries/mutations
- File upload UI
- NextAuth session management
- Route navigation

**SERVER SIDE:**
- tRPC routers & procedures
- Database queries (Drizzle)
- Authentication logic (NextAuth)
- File upload processing
- API route handlers
- Middleware (auth guards)

**EXTERNAL:**
- PostgreSQL database operations
- Supabase storage (file uploads/CDN)
- Email delivery (magic links)
- Google OAuth (authentication) 

---

## Operational Decisions and Best Practices

### Caching & Rendering Strategy
- Public pages (`/`, `/articles`, `/articles/[slug]`, `/about`) use SSR with fine-grained cache control. When articles are published or updated, trigger `revalidateTag('articles')` and `revalidateTag(`article:${slug}`)`. List endpoints tagged `"articles"`; detail endpoints tagged per-slug.
- Admin pages (`/admin/*`) are dynamic (`cache: 'no-store'`) and behind auth.
- tRPC queries default to server-only execution; cache read operations with tags; never cache mutations.
- Use incremental static regeneration (ISR) for high-traffic article pages if traffic patterns demand it.

### Security & Auth
- NextAuth with OAuth (Google) + email magic links. Session strategy: JWT. Store minimal PII in JWT; fetch expanded user on server.
- Authorization: role-based (`admin`, `editor`) plus ownership checks (authors can edit their own drafts). Implement in tRPC procedures using a shared `requireRole` and `requireUser` guard.
- Database row-level security (RLS) when using Supabase Postgres. Define policies for articles (only owner can update drafts; only published readable to anon).
- File uploads: validate MIME, size limits, and enforce per-user buckets or key prefixes. For private drafts, use signed URLs; publish by moving to public bucket or toggling ACL.

### Data Modeling & Validation
- Use zod schemas shared between client and server for all tRPC procedures. Derive TypeScript types from zod rather than hand-writing interfaces.
- Slug uniqueness enforced at DB and validated in service before insert/update.
- Soft deletion via `deletedAt` if needed for recovery; otherwise hard delete restricted to admins.

### Observability & Errors
- Centralize error handling in tRPC `onError` to log sanitized details.
- Add request logging middleware (method, path, duration) and structured logs.
- Sentry (or similar) for server and client error tracking.

### Migrations & Seeding
- Drizzle migrations checked into `lib/db/migrations`. Use `drizzle-kit` to generate. CI runs migrations on preview envs.
- Provide seed script for local dev to create a demo admin, categories, and sample articles.

### Background Tasks
- After article publish/update, revalidate affected cache tags and prewarm critical pages (homepage, article list, featured article).
- Optional: search indexing job (e.g., Typesense/Algolia) triggered on publish.

### Environment & Config
- Centralize env parsing with `zod` (e.g., `lib/env.ts`). Validate on boot. Separate runtime server vs client vars.
- Secrets stored in Vercel/Env vars; never committed. Rotate regularly.

### Deployment
- Target Vercel. Configure image optimization domains. Edge runtime for lightweight tRPC reads; Node.js runtime for mutations and uploads.
- CI: lint, typecheck, build, run migrations in a safe preview database, smoke test critical routes.

### Accessibility & UX
- Admin forms keyboard-accessible, with ARIA labels and proper error messaging.
- Graceful fallbacks for images and content placeholders.

### Testing
- Unit tests for routers and utils. Integration tests for critical flows (auth, create article, publish, read). E2E smoke using Playwright.

### Versioning & Content Lifecycle
- Draft -> Review -> Published pipeline. Optional `revisions` table storing previous versions with `articleId`, `content`, `editedBy`, `createdAt`.

---

## Open Questions
- WYSIWYG choice and format (HTML vs Markdown). If Markdown, store as MD + render on read; if HTML, sanitize on write.
- Image transformations (blurhash, responsive sizes) pipeline—local vs Supabase functions.
- Multi-author support on a single article? If yes, add junction table `articleAuthors`. 