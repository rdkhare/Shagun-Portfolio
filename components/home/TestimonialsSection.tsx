// Mock testimonials data
const testimonials = [
  {
    id: 1,
    company: "MEDIA OUTLET",
    quote: "Shagun impresses with her ability to produce outstanding investigative journalism. Her attention to detail and great work ethic constantly made her meet even the toughest deadlines. Her professionalism and insight is a valuable addition to any publication."
  },
  {
    id: 2,
    company: "TECH PUBLICATION", 
    quote: "Where would the digital journalism world be without her? I wouldn't be as fast or as joyful. Shagun is an asset to the industry. Her analytical skills and welcoming energy makes her a dream to work with on projects, both great and small."
  }
]

export default function TestimonialsSection() {
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
            <div key={testimonial.id} className="space-y-6">
              {/* Company/Source */}
              <div className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                {testimonial.company}
              </div>

              {/* Main Quote */}
              <blockquote className="text-lg leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
