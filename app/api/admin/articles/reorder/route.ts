import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db/client'
import { articles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for reordering
const reorderSchema = z.object({
  articleIds: z.array(z.string()).min(1, 'At least one article ID is required'),
})

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { articleIds } = reorderSchema.parse(body)

    // Update the sort order for each article
    const updatePromises = articleIds.map((articleId, index) => 
      db
        .update(articles)
        .set({ 
          featuredOrder: index + 1,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, articleId))
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ 
      message: 'Featured articles order updated successfully',
      updatedCount: articleIds.length 
    })

  } catch (error) {
    console.error('Error reordering featured articles:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid data',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to reorder featured articles' },
      { status: 500 }
    )
  }
}
