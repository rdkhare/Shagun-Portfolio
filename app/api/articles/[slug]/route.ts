import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { articles, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    // Get published article by slug with author information
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
        featured: articles.featured,
        publishedAt: articles.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          slug: users.email, // Use email as slug for now
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(and(
        eq(articles.slug, slug),
        eq(articles.status, 'published')
      ))
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
