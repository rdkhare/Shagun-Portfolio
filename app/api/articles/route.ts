import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { articles, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get all published articles with author information
    const publishedArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
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
      .where(eq(articles.status, 'published'))
      .orderBy(desc(articles.publishedAt))

    return NextResponse.json({ articles: publishedArticles })
  } catch (error) {
    console.error('Error fetching published articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
