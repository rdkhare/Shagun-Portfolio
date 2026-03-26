import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db/client'
import { testimonials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Validation schema for testimonial updates
const updateTestimonialSchema = z.object({
  author: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  title: z.string().optional(),
  quote: z.string().min(1).optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const testimonial = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1)

    if (testimonial.length === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json({ testimonial: testimonial[0] })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateTestimonialSchema.parse(body)

    // Update testimonial
    const updatedTestimonial = await db
      .update(testimonials)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id))
      .returning()

    if (updatedTestimonial.length === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      testimonial: updatedTestimonial[0],
      message: 'Testimonial updated successfully' 
    })

  } catch (error) {
    console.error('Error updating testimonial:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid data',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const deletedTestimonial = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning()

    if (deletedTestimonial.length === 0) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Testimonial deleted successfully' })

  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
