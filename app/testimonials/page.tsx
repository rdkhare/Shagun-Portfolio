import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Testimonials | Shagun Khare',
  description: 'What colleagues and collaborators say about working with Shagun Khare.',
}

interface Testimonial {
  id: string
  author: string
  company: string
  title?: string
  quote: string
  sortOrder?: number
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/testimonials`, {
      next: { revalidate: 300, tags: ['testimonials'] },
    })

    if (response.ok) {
      const data = await response.json()
      return data.testimonials
    }
    return []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-light mb-4">Testimonials</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          What colleagues and collaborators say about working with Shagun
        </p>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground">No testimonials yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-4">
              <blockquote className="text-lg leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

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
      )}
    </div>
  )
}
