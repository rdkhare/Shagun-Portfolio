import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { testimonials } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for testimonial creation/updates
const testimonialSchema = z.object({
  author: z.string().min(1, 'Author name is required'),
  company: z.string().min(1, 'Company is required'),
  title: z.string().optional(),
  quote: z.string().min(1, 'Quote is required'),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional().default(true),
})

export async function GET() {
  try {
    // Get all testimonials ordered by sortOrder, then by createdAt
    const allTestimonials = await db
      .select()
      .from(testimonials)
      .orderBy(testimonials.sortOrder, desc(testimonials.createdAt))

    return NextResponse.json({ testimonials: allTestimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = testimonialSchema.parse(body)

    // Create new testimonial
    const newTestimonial = await db
      .insert(testimonials)
      .values({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json({ 
      testimonial: newTestimonial[0],
      message: 'Testimonial created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating testimonial:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid data',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
