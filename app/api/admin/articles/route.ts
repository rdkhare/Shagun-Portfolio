import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { articles, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import * as z from 'zod'

// Validation schema for article creation
const createArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  externalUrl: z.string().url().optional().or(z.literal('')),
  publisher: z.string().min(1),
  category: z.string().min(1),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
  publishedAt: z.string().optional(), // ISO date string
})

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all articles with author information
    const allArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        excerpt: articles.excerpt,
        coverImage: articles.coverImage,
        externalUrl: articles.externalUrl,
        publisher: articles.publisher,
        category: articles.category,
        status: articles.status,
        featured: articles.featured,
        featuredOrder: articles.featuredOrder,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.createdAt))

    return NextResponse.json({ articles: allArticles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (user.length === 0) {
      // Create user if doesn't exist
      const [newUser] = await db
        .insert(users)
        .values({
          email: session.user.email,
          name: session.user.name || '',
          image: session.user.image || '',
          role: 'admin',
        })
        .returning()

      user.push(newUser)
    }

    const body = await request.json()
    const validatedData = createArticleSchema.parse(body)

    // Create the article
    let publishedAtValue = null
    if (validatedData.publishedAt) {
      publishedAtValue = new Date(validatedData.publishedAt)
    } else if (validatedData.status === 'published') {
      publishedAtValue = new Date()
    }

    const [newArticle] = await db
      .insert(articles)
      .values({
        ...validatedData,
        authorId: user[0].id,
        publishedAt: publishedAtValue,
      })
      .returning()

    return NextResponse.json({ article: newArticle }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
} 