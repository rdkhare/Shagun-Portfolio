import Link from 'next/link'
import Image from 'next/image'

interface ProfileData {
  heroBio?: string
  aboutBio?: string
  headshotImage?: string
  tagline?: string
  location?: string
  contactEmail?: string
}

interface HeroSectionProps {
  profile: ProfileData | null
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-12 lg:gap-16">
        {/* Headshot */}
        <div className="flex justify-center order-1 lg:order-1">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-sm aspect-[4/5] max-h-80 lg:max-h-96 bg-muted rounded-lg overflow-hidden">
            <Image
              src={profile?.headshotImage || "/icons/headshot/shagun.png"}
              alt="Shagun Khare"
              width={400}
              height={500}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Bio Content */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-2 flex-1">
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
            {profile?.heroBio ? (
              // Render dynamic bio from profile
              profile.heroBio.split('\n\n').map((paragraph, index) => (
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
