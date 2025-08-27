import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { profile } from '@/lib/db/schema'

export async function GET() {
  try {
    // Get the profile data (public endpoint, no auth required)
    const profileData = await db.select().from(profile).limit(1)
    
    if (profileData.length === 0) {
      // Return default data if no profile exists
      return NextResponse.json({
        profile: {
          bio: "I'm a writer, editor, and consultant based in Brooklyn. My work primarily focuses on home, design, lifestyle, and culture.\n\nPut simply? I capture the beauty of environments and objects through words. I'm also interested in the humans behind these things — particularly how people's backgrounds inform their style.\n\nI've covered prominent figures including Anna Sheffield, Nilou Motamed, and Robin Arzón, among others. Uplifting underrepresented voices is always top of mind.\n\nMy work has appeared in Domino, Martha Stewart Living, Lonny, Apartment Therapy, The Kitchn, Wine Enthusiast Magazine, and The Spruce, among others. Along with editorial, I also cover branded content and social media strategy. This has included work with Sotheby's International Realty, Formica, Toyota, Sunbrella, and others. Previously, I was an editor at Impact.",
          headshotImage: '',
          location: 'Brooklyn, NY',
          tagline: 'Writer, Editor & Consultant',
          contactEmail: ''
        }
      })
    }

    return NextResponse.json({ profile: profileData[0] })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
