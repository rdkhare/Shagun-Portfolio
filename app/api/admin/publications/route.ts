import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { publications } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

const publicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().min(1, 'Logo URL is required'),
  websiteUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all publications ordered by sortOrder
    const allPublications = await db
      .select()
      .from(publications)
      .orderBy(asc(publications.sortOrder), asc(publications.createdAt))

    return NextResponse.json({ publications: allPublications })
  } catch (error) {
    console.error('Error fetching publications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = publicationSchema.parse(body)

    // Get the next sort order if not provided
    if (!validatedData.sortOrder) {
      const lastPublication = await db
        .select({ sortOrder: publications.sortOrder })
        .from(publications)
        .orderBy(asc(publications.sortOrder))
        .limit(1)
      
      validatedData.sortOrder = (lastPublication[0]?.sortOrder || 0) + 1
    }

    // Create new publication
    const [newPublication] = await db.insert(publications).values({
      ...validatedData,
      isActive: validatedData.isActive ?? true,
    }).returning()

    // Revalidate the home page cache
    revalidatePath('/')

    return NextResponse.json({ publication: newPublication })
  } catch (error) {
    console.error('Error creating publication:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
