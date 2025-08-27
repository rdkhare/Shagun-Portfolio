"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProfileData {
  bio?: string
  headshotImage?: string
  tagline?: string
  location?: string
  contactEmail?: string
}

export default function HeroSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Headshot */}
        <div className="flex justify-center lg:justify-start order-1 lg:order-1">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-sm aspect-[4/5] max-h-80 lg:max-h-96 bg-muted rounded-lg overflow-hidden">
            {profile?.headshotImage ? (
              <Image
                src={profile.headshotImage}
                alt="Shagun Khare"
                width={400}
                height={500}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm">Headshot Placeholder</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio Content */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-2">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-4">
              Hi, I&apos;m Shagun.
            </h1>
            {profile?.tagline && (
              <p className="text-xl sm:text-2xl text-muted-foreground font-light">
                {profile.tagline}
              </p>
            )}
          </div>
          
          <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
            {profile?.bio ? (
              // Render dynamic bio from profile
              profile.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>
                  {paragraph.includes('Impact') ? (
                    <>
                      {paragraph.split('Impact')[0]}
                      <Link 
                        href="https://impact.site" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline hover:text-primary transition-colors"
                      >
                        Impact
                      </Link>
                      {paragraph.split('Impact')[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))
            ) : (
              // Fallback to hardcoded bio
              <>
                <p>
                  I&apos;m a writer, editor, and consultant based in Brooklyn. My work primarily focuses on home, design, lifestyle, and culture.
                </p>
                
                <p>
                  Put simply? I capture the beauty of environments and objects through words. I&apos;m also interested in the humans behind these things — particularly how people&apos;s backgrounds inform their style.
                </p>
                
                <p>
                  I&apos;ve covered prominent figures including Anna Sheffield, Nilou Motamed, and Robin Arzón, among others. Uplifting underrepresented voices is always top of mind.
                </p>
                
                <p>
                  My work has appeared in Domino, Martha Stewart Living, Lonny, Apartment Therapy, The Kitchn, Wine Enthusiast Magazine, and The Spruce, among others. Along with editorial, I also cover branded content and social media strategy. This has included work with Sotheby&apos;s International Realty, Formica, Toyota, Sunbrella, and others. Previously, I was an editor at{' '}
                  <Link 
                    href="https://impact.site" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline hover:text-primary transition-colors"
                  >
                    Impact
                  </Link>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
