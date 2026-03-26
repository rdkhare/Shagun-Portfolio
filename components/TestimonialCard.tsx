import { PublicTestimonial } from '@/lib/types'

interface TestimonialCardProps {
  testimonial: PublicTestimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="space-y-4">
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
  )
}
