import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import * as z from 'zod'

const profileSchema = z.object({
  heroBio: z.string().optional(),
  aboutBio: z.string().optional(),
  footerBio: z.string().optional(),
  headshotImage: z.string().optional(),
  socialLinks: z.string().optional(),
  contactEmail: z.union([z.string().email('Please enter a valid email'), z.literal('')]).optional(),
  location: z.string().optional(),
  tagline: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the profile (assuming single profile for now)
    const profileData = await db.select().from(profile).limit(1)
    
    if (profileData.length === 0) {
      // Return default empty profile if none exists
      return NextResponse.json({
        profile: {
          heroBio: '',
          aboutBio: '',
          footerBio: '',
          headshotImage: '',
          socialLinks: '{}',
          contactEmail: '',
          location: '',
          tagline: ''
        }
      })
    }

    return NextResponse.json({ profile: profileData[0] })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    // Check if profile exists
    const existingProfile = await db.select().from(profile).limit(1)
    
    if (existingProfile.length === 0) {
      // Create new profile
      const [newProfile] = await db.insert(profile).values({
        ...validatedData,
        updatedAt: new Date()
      }).returning()
      
      // Revalidate cache for profile data
      revalidatePath('/api/profile')
      revalidatePath('/')
      revalidateTag('profile')
      
      return NextResponse.json({ profile: newProfile })
    } else {
      // Update existing profile
      const [updatedProfile] = await db.update(profile)
        .set({
          ...validatedData,
          updatedAt: new Date()
        })
        .where(eq(profile.id, existingProfile[0].id))
        .returning()
      
      // Revalidate cache for profile data
      revalidatePath('/api/profile')
      revalidatePath('/')
      revalidatePath('/about')
      revalidateTag('profile')
      
      return NextResponse.json({ profile: updatedProfile })
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
