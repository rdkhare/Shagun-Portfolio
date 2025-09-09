import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { testimonials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for reordering
const reorderSchema = z.object({
  testimonialIds: z.array(z.string()).min(1, 'At least one testimonial ID is required'),
})

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { testimonialIds } = reorderSchema.parse(body)

    // Update the sort order for each testimonial
    const updatePromises = testimonialIds.map((testimonialId, index) => 
      db
        .update(testimonials)
        .set({ 
          sortOrder: index + 1,
          updatedAt: new Date(),
        })
        .where(eq(testimonials.id, testimonialId))
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ 
      message: 'Testimonials order updated successfully',
      updatedCount: testimonialIds.length 
    })

  } catch (error) {
    console.error('Error reordering testimonials:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid data',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to reorder testimonials' },
      { status: 500 }
    )
  }
}
