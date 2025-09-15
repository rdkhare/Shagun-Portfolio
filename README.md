# Shagun Khare Portfolio & CMS

A modern, full-stack portfolio website and content management system for Shagun Khare, a journalist and writer covering home, design, lifestyle, and culture.

🔗 **Live Site**: [shagunkhare.com](https://shagunkhare.com)

## Overview

This is a sophisticated portfolio platform that combines a beautiful public-facing website with a powerful content management system. Built with modern web technologies, it allows for dynamic content management, article publishing, and portfolio showcasing.

## Tech Stack

### Frontend & Framework
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - Component library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety and developer experience
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling with custom design system
- **[Radix UI](https://www.radix-ui.com)** - Unstyled, accessible UI primitives

### Backend & Database
- **[PostgreSQL](https://www.postgresql.org)** - Primary database via Neon
- **[Drizzle ORM](https://orm.drizzle.team)** - Type-safe database operations
- **[NextAuth.js](https://next-auth.js.org)** - Authentication with Google OAuth
- **API Routes** - Server-side endpoints for data operations

### File Storage & Media
- **[Supabase Storage](https://supabase.com/storage)** - File uploads and CDN
- **Image optimization** - Next.js built-in optimization

### Content Management
- **[Lexical](https://lexical.dev)** - Facebook's rich text editor for article content
- **Custom CMS** - Built-in admin interface for content management
- **Drag & Drop** - Sortable interfaces using @dnd-kit

### Development & Deployment
- **[ESLint](https://eslint.org)** - Code linting and consistency
- **[Vercel](https://vercel.com)** - Hosting and deployment platform
- **Git-based workflow** - Automated deployments from GitHub

## Architecture

### Database Schema
The application uses a well-structured PostgreSQL schema with the following core entities:

- **Users** - Authentication and role management (admin/editor)
- **Articles** - Blog posts with rich content, external links, and categorization
- **Categories** - Article organization and filtering
- **Profile** - Dynamic bio content for different page sections
- **Testimonials** - Client/colleague recommendations with ordering
- **Publications** - "As Seen In" section with publication logos
- **Media** - File uploads and asset management

### Content Management System
The CMS provides comprehensive content management capabilities:

#### Article Management
- **Rich Text Editor**: Lexical-powered editor with formatting, links, and media embedding
- **Dual Article Types**: Internal articles with full content or external links to third-party publications
- **Draft/Published Workflow**: Content staging and publishing controls
- **Featured Articles**: Highlighting important content with custom ordering
- **Category Organization**: Flexible article categorization and filtering

#### Profile Management
- **Dynamic Bio Content**: Separate bio sections for homepage, about page, and footer
- **Image Management**: Multiple profile images for different contexts
- **Social Links**: Configurable social media integration
- **Contact Information**: Editable contact details and location

#### Content Organization
- **Drag-and-Drop Sorting**: Custom ordering for testimonials and publications
- **Publication Showcase**: "As Seen In" section with logo management
- **Testimonial Management**: Client quotes with company attribution
- **Media Library**: Centralized file upload and management

### Authentication & Security
- **Google OAuth Integration**: Secure sign-in with Google accounts
- **Role-Based Access**: Admin-only access to CMS features
- **Email Whitelist**: Controlled access via environment-configured authorized emails
- **Session Management**: JWT-based sessions with NextAuth.js

### Frontend Features
#### Public Site
- **Responsive Design**: Mobile-first, fully responsive layout
- **Performance Optimized**: SSR/SSG for fast loading and SEO
- **Modern UI**: Clean, professional design with smooth animations
- **Content Filtering**: Dynamic article filtering by category
- **Contact Integration**: Built-in contact form functionality

#### Admin Interface
- **Intuitive Dashboard**: Clean admin interface for content management
- **Form Validation**: Comprehensive client and server-side validation
- **Real-time Preview**: WYSIWYG editing experience
- **Image Upload**: Drag-and-drop file uploads with Supabase integration
- **Bulk Operations**: Efficient content management workflows

## Key Functional Areas

### 1. Content Management System (CMS)
**Location**: `/app/admin/*`

The CMS is a fully-featured admin interface that provides:
- Article creation and editing with rich text capabilities
- Category management and organization
- Profile content management across multiple page sections
- Testimonial and publication showcase management
- Media library with upload capabilities
- Real-time content preview and publishing workflow

### 2. Article Publishing System
**Location**: `/app/articles/*`

Supports two types of articles:
- **Internal Articles**: Full content stored and rendered within the platform
- **External Articles**: Links to publications with excerpts and metadata
- Dynamic routing with SEO-friendly slugs
- Category-based filtering and organization
- Featured article highlighting system

### 3. Authentication & Authorization
**Location**: `/lib/auth/*`

Secure admin access through:
- Google OAuth integration via NextAuth.js
- Environment-based email whitelisting for admin access
- JWT session management with role-based permissions
- Protected admin routes with automatic redirects

### 4. File & Media Management
**Location**: `/lib/storage/*`

Comprehensive media handling:
- Supabase Storage integration for file uploads
- Automatic image optimization and resizing
- CDN delivery for optimal performance
- Secure upload workflows with validation

### 5. Database Layer
**Location**: `/lib/db/*`

Type-safe database operations:
- Drizzle ORM with full TypeScript support
- Automated migration system
- Structured schema with proper relationships
- Query optimization and caching strategies

## Deployment

The site is deployed on Vercel with:
- Automatic deployments from the main branch
- Environment variable configuration
- Database migrations via CI/CD
- Optimized build settings for Next.js
- CDN distribution for global performance

---

**Built with ❤️ by Rajat Khare.**
