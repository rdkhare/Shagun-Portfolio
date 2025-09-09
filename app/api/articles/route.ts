import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { articles, users } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get all published articles with author information
    const rawArticles = await db
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
        featuredOrder: articles.featuredOrder,
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

    // Sort articles: Featured articles by featuredOrder first, then all by publishedAt
    const sortedArticles = rawArticles.sort((a, b) => {
      // If both are featured with orders, sort by featuredOrder
      if (a.featured && b.featured && a.featuredOrder && b.featuredOrder) {
        return a.featuredOrder - b.featuredOrder
      }
      
      // If one is featured with order and the other isn't, prioritize the featured one
      if (a.featured && a.featuredOrder && (!b.featured || !b.featuredOrder)) {
        return -1
      }
      if (b.featured && b.featuredOrder && (!a.featured || !a.featuredOrder)) {
        return 1
      }
      
      // For all other cases, sort by publication date (most recent first)
      const dateA = new Date(a.publishedAt || '').getTime()
      const dateB = new Date(b.publishedAt || '').getTime()
      return dateB - dateA
    })

    return NextResponse.json({ articles: sortedArticles })
  } catch (error) {
    console.error('Error fetching published articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
