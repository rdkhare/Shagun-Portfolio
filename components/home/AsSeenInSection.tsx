import Marquee from "react-fast-marquee"

// Publication names for the marquee
const publications = [
  "Domino",
  "The Spruce", 
  "Apartment Therapy",
  "The Guardian",
  "MIT Technology Review",
  "Martha Stewart Living",
  "La-Z-Boy",
  "The Kitchn",
  "Wine Enthusiast Magazine",
  "Impact",
]

export default function AsSeenInSection() {
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
        {publications.map((publication, index) => (
          <span 
            key={index}
            className="mx-8 text-lg font-light text-muted-foreground italic"
          >
            {publication}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
