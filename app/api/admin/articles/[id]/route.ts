import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { articles, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import * as z from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Validation schema for article updates
const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  externalUrl: z.string().url().optional().or(z.literal('')),
  publisher: z.string().optional(),
  category: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  featured: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get article by ID with author information
    const article = await db
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
      .where(eq(articles.id, id))
      .limit(1)

    if (article.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article: article[0] })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateArticleSchema.parse(body)

    // Check if article exists
    const existingArticle = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1)

    if (existingArticle.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Update the article
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
      ...(validatedData.status === 'published' && existingArticle[0].status !== 'published' 
        ? { publishedAt: new Date() } 
        : {}),
    }

    const [updatedArticle] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning()

    return NextResponse.json({ article: updatedArticle })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if article exists
    const existingArticle = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1)

    if (existingArticle.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Delete the article
    await db.delete(articles).where(eq(articles.id, id))

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
} 