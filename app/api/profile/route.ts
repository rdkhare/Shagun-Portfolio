import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    // Get the profile data (public endpoint, no auth required)
    const profileData = await db.select().from(profile).limit(1)
    
    if (profileData.length === 0) {
      // Return default data if no profile exists
      return NextResponse.json({
        profile: {
          heroBio: "I'm a writer, editor, and consultant based in Brooklyn. My work primarily focuses on home, design, lifestyle, and culture.\n\nPut simply? I capture the beauty of environments and objects through words. I'm also interested in the humans behind these things — particularly how people's backgrounds inform their style.",
          aboutBio: "I'm a writer, editor, and consultant based in Brooklyn. My work primarily focuses on home, design, lifestyle, and culture.\n\nPut simply? I capture the beauty of environments and objects through words. I'm also interested in the humans behind these things — particularly how people's backgrounds inform their style.\n\nI've covered prominent figures including Anna Sheffield, Nilou Motamed, and Robin Arzón, among others. Uplifting underrepresented voices is always top of mind.\n\nMy work has appeared in Domino, Martha Stewart Living, Lonny, Apartment Therapy, The Kitchn, Wine Enthusiast Magazine, and The Spruce, among others. Along with editorial, I also cover branded content and social media strategy. This has included work with Sotheby's International Realty, Formica, Toyota, Sunbrella, and others. Previously, I was an editor at Impact.",
          footerBio: 'Digital journalist covering technology, society, and culture. Independent reporting on stories that shape our connected world.',
          headshotImage: '',
          aboutImage: '',
          location: 'Brooklyn, NY',
          tagline: 'Writer, Editor & Consultant',
          contactEmail: ''
        }
      })
    }

    const profileRecord = profileData[0]
    
    // Check if headshotImage contains large base64 data and clean it up
    if (profileRecord.headshotImage && profileRecord.headshotImage.startsWith('data:image/')) {
      console.log('⚠️ Found large base64 image data, cleaning up...')
      
      // Clean up the large base64 data from database
      await db.update(profile).set({
        headshotImage: '', // Clear the large base64 data
        updatedAt: new Date()
      }).where(eq(profile.id, profileRecord.id))
      
      // Return profile without the large image data
      profileRecord.headshotImage = ''
    }

    return NextResponse.json({ profile: profileRecord })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
