import { SiLinkedin } from 'react-icons/si'
import { HiMail } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ProfileData {
  heroBio?: string
  aboutBio?: string
  headshotImage?: string
  aboutImage?: string
  tagline?: string
  location?: string
  contactEmail?: string
}

async function getProfile(): Promise<ProfileData | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/profile`, {
      next: { revalidate: 60, tags: ['profile'] }, // Revalidate every 1 minute and use tags for immediate updates
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.profile
    }
    return null
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function AboutPage() {
  const profile = await getProfile()
  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-light mb-4">About</h1>
        <p className="text-lg text-foreground/70">
          {profile?.tagline}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="relative w-64 h-80 mx-auto mb-6 rounded-lg overflow-hidden bg-muted">
              <Image
                src={profile?.aboutImage || profile?.headshotImage || "/icons/headshot/shagun.png"}
                alt="Shagun Khare"
                width={256}
                height={320}
                className="w-full h-full object-cover"
                quality={95}
              />
            </div>
            <h2 className="text-2xl font-display font-light mb-2">Shagun Khare</h2>
            {profile?.location && (
              <p className="text-foreground/60 mb-2">{profile.location}</p>
            )}
            <p className="text-foreground/70 mb-6">{profile?.tagline}</p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a 
                  href="https://www.linkedin.com/in/shagun-khare-" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a 
                  href="mailto:shagunkhare.st@gmail.com"
                  aria-label="Send Email"
                >
                  <HiMail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="lg:col-span-2">
          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-medium mb-4">Biography</h3>
            {profile?.aboutBio ? (
              <div 
                className="prose prose-lg max-w-none [&>p]:text-foreground/80 [&>p]:leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: profile.aboutBio }} 
              />
            ) : (
              <>
                <p className="text-foreground/80 leading-relaxed mb-6">
                  Shagun Khare is a writer, editor, and consultant specializing in home, design, lifestyle, and culture. 
                  With a focus on capturing the beauty of environments and objects through words, Shagun explores the 
                  humans behind these things — particularly how people&apos;s backgrounds inform their style.
                </p>
                
                <p className="text-foreground/80 leading-relaxed mb-6">
                  Her work has appeared in prominent publications including Domino, Martha Stewart Living, Lonny, 
                  Apartment Therapy, The Kitchn, Wine Enthusiast Magazine, and The Spruce. Along with editorial work, 
                  she also covers branded content and social media strategy.
                </p>
              </>
            )}

            <h3 className="text-xl font-medium mb-4 mt-8">Contact</h3>
            <p className="text-foreground/80 leading-relaxed">
              For press inquiries, collaboration opportunities, or story tips, 
              please don&apos;t hesitate to reach out through the social media 
              links above or the{' '}
              <a href="/contact" className="underline hover:text-primary transition-colors">
                contact page
              </a>.
            </p>
          </div>
        </div>
      </div>


    </div>
  );
} 