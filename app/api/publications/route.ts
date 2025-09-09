import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { publications } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  try {
    // Get active publications ordered by sortOrder
    const activePublications = await db
      .select({
        id: publications.id,
        name: publications.name,
        logoUrl: publications.logoUrl,
        websiteUrl: publications.websiteUrl,
        sortOrder: publications.sortOrder,
      })
      .from(publications)
      .where(eq(publications.isActive, true))
      .orderBy(asc(publications.sortOrder), asc(publications.createdAt))

    return NextResponse.json({ publications: activePublications })
  } catch (error) {
    console.error('Error fetching publications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
