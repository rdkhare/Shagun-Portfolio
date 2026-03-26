import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db/client'
import { publications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema for reordering
const reorderSchema = z.object({
  publicationIds: z.array(z.string()).min(1, 'At least one publication ID is required'),
})

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { publicationIds } = reorderSchema.parse(body)

    // Update the sort order for each publication
    const updatePromises = publicationIds.map((publicationId, index) => 
      db
        .update(publications)
        .set({ 
          sortOrder: index + 1,
          updatedAt: new Date(),
        })
        .where(eq(publications.id, publicationId))
    )

    await Promise.all(updatePromises)

    // Revalidate the home page cache
    revalidatePath('/')

    return NextResponse.json({ 
      message: 'Publications order updated successfully',
      updatedCount: publicationIds.length 
    })

  } catch (error) {
    console.error('Error reordering publications:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid data',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to reorder publications' },
      { status: 500 }
    )
  }
}
