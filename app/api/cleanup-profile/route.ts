import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/client'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the profile data
    const profileData = await db.select().from(profile).limit(1)
    
    if (profileData.length === 0) {
      return NextResponse.json({ message: 'No profile found to clean up' })
    }

    const profileRecord = profileData[0]
    
    // Check if headshotImage contains large base64 data
    if (profileRecord.headshotImage && profileRecord.headshotImage.startsWith('data:image/')) {
      const sizeMB = (new Blob([profileRecord.headshotImage]).size / 1024 / 1024).toFixed(2)
      
      console.log(`🧹 Cleaning up large base64 image data (${sizeMB}MB)...`)
      
      // Clean up the large base64 data from database
      await db.update(profile).set({
        headshotImage: '', // Clear the large base64 data
        updatedAt: new Date()
      }).where(eq(profile.id, profileRecord.id))
      
      return NextResponse.json({ 
        message: `Successfully cleaned up ${sizeMB}MB of base64 image data from profile`,
        cleaned: true
      })
    }

    return NextResponse.json({ 
      message: 'No large image data found to clean up',
      cleaned: false
    })
  } catch (error) {
    console.error('Error cleaning up profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
