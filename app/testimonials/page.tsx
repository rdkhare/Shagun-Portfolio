import type { Metadata } from 'next'
import { PublicTestimonial } from '@/lib/types'
import TestimonialCard from '@/components/TestimonialCard'

export const metadata: Metadata = {
  title: 'Testimonials | Shagun Khare',
  description: 'What colleagues and collaborators say about working with Shagun Khare.',
}

async function getTestimonials(): Promise<PublicTestimonial[]> {
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
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  )
}
