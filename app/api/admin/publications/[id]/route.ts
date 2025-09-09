import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { publications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

const publicationUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  logoUrl: z.string().min(1, 'Logo URL is required').optional(),
  websiteUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const validatedData = publicationUpdateSchema.parse(body)

    // Check if publication exists
    const existingPublication = await db
      .select()
      .from(publications)
      .where(eq(publications.id, id))
      .limit(1)

    if (existingPublication.length === 0) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    // Update publication
    const [updatedPublication] = await db
      .update(publications)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(publications.id, id))
      .returning()

    // Revalidate the home page cache
    revalidatePath('/')

    return NextResponse.json({ publication: updatedPublication })
  } catch (error) {
    console.error('Error updating publication:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Check if publication exists
    const existingPublication = await db
      .select()
      .from(publications)
      .where(eq(publications.id, id))
      .limit(1)

    if (existingPublication.length === 0) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    // Delete publication
    await db.delete(publications).where(eq(publications.id, id))

    // Revalidate the home page cache
    revalidatePath('/')

    return NextResponse.json({ message: 'Publication deleted successfully' })
  } catch (error) {
    console.error('Error deleting publication:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
