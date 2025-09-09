interface Testimonial {
  id: string
  author: string
  company: string
  title?: string
  quote: string
  sortOrder?: number
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Don't render the section if no testimonials
  if (testimonials.length === 0) {
    return null
  }
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-light mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What colleagues and collaborators say about working with Shagun
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-4">
              {/* Main Quote */}
              <blockquote className="text-lg leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author and Title */}
              <div className="space-y-1">
                <div className="text-base font-bold tracking-wider uppercase text-muted-foreground">
                  {testimonial.author}
                </div>
                <div className="text-base font-bold tracking-wider uppercase text-muted-foreground">
                  {testimonial.title ? `${testimonial.title} AT ${testimonial.company}` : testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
