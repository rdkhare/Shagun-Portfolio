import { pgTable, text, timestamp, boolean, uuid, integer } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  role: text('role').notNull().default('editor'), // 'admin' | 'editor'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull().unique(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Articles table
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'), // Optional - for internal articles
  excerpt: text('excerpt'), // Description/summary
  coverImage: text('cover_image'),
  externalUrl: text('external_url'), // Link to third-party article
  publisher: text('publisher'), // Company/publication name
  category: text('category'), // Article category
  status: text('status').notNull().default('draft'), // 'draft' | 'published'
  featured: boolean('featured').notNull().default(false),
  featuredOrder: integer('featured_order'), // Custom order for featured articles
  authorId: uuid('author_id').notNull().references(() => users.id),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Article-Category junction table (many-to-many)
export const articleCategories = pgTable('article_categories', {
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
})

// Media files table
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Profile table for author information
export const profile = pgTable('profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroBio: text('hero_bio'), // Bio text for home page hero section
  aboutBio: text('about_bio'), // Bio text for about page
  footerBio: text('footer_bio'), // Bio text for footer section
  headshotImage: text('headshot_image'), // Profile/headshot image URL
  socialLinks: text('social_links'), // JSON string with social media links
  contactEmail: text('contact_email'),
  location: text('location'),
  tagline: text('tagline'), // Short tagline for hero section
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Testimonials table
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  author: text('author').notNull(), // Person's name
  company: text('company').notNull(), // Company/publication
  title: text('title'), // Their job title
  quote: text('quote').notNull(), // The testimonial text
  sortOrder: integer('sort_order'), // Custom ordering
  isActive: boolean('is_active').notNull().default(true), // Show/hide testimonials
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Publications table (for "As Seen In" section)
export const publications = pgTable('publications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // Publication name
  logoUrl: text('logo_url').notNull(), // Logo image URL
  websiteUrl: text('website_url'), // Optional publication website link
  sortOrder: integer('sort_order'), // Custom ordering for display
  isActive: boolean('is_active').notNull().default(true), // Show/hide publications
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Export types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert
export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert
export type Publication = typeof publications.$inferSelect
export type NewPublication = typeof publications.$inferInsert 