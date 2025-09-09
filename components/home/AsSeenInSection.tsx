import Marquee from "react-fast-marquee"
import Image from "next/image"

interface Publication {
  id: string
  name: string
  logoUrl: string
  websiteUrl?: string
}

interface AsSeenInSectionProps {
  publications?: Publication[]
}

export default function AsSeenInSection({ publications = [] }: AsSeenInSectionProps) {
  // Show nothing if no publications
  if (publications.length === 0) {
    return null
  }
  return (
    <section className="py-12 sm:py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4 max-w-6xl mb-8">
        <h2 className="text-center text-2xl font-medium tracking-wider text-muted-foreground uppercase">
          As Seen In
        </h2>
      </div>
      
      <Marquee 
        speed={50}
        gradient={true}
        gradientColor="hsl(var(--background))"
        gradientWidth={80}
        pauseOnHover={false}
      >
        {publications.map((publication) => (
          <div 
            key={publication.id}
            className="mx-12 flex items-center justify-center"
          >
            {publication.websiteUrl ? (
              <a 
                href={publication.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="w-40 h-24 flex items-center justify-center bg-white/10 rounded-lg p-2">
                  <Image
                    src={publication.logoUrl}
                    alt={publication.name}
                    width={180}
                    height={90}
                    className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            ) : (
              <div className="w-40 h-24 flex items-center justify-center bg-white/10 rounded-lg p-2">
                <Image
                  src={publication.logoUrl}
                  alt={publication.name}
                    width={180}
                    height={90}
                  className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            )}
          </div>
        ))}
      </Marquee>
    </section>
  )
}
