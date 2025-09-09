import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { testimonials } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  try {
    // Get all active testimonials ordered by sortOrder, then by createdAt
    const activeTestimonials = await db
      .select({
        id: testimonials.id,
        author: testimonials.author,
        company: testimonials.company,
        title: testimonials.title,
        quote: testimonials.quote,
        sortOrder: testimonials.sortOrder,
      })
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(asc(testimonials.sortOrder), testimonials.createdAt)

    return NextResponse.json({ testimonials: activeTestimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
