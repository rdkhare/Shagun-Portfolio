import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TestimonialsSection from '@/components/home/TestimonialsSection'

const makeTestimonials = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    author: `Author ${i + 1}`,
    company: `Company ${i + 1}`,
    quote: `Quote ${i + 1}`,
    sortOrder: i,
  }))

describe('TestimonialsSection', () => {
  it('renders nothing when testimonials array is empty', () => {
    const { container } = render(<TestimonialsSection testimonials={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders at most 2 testimonials', () => {
    render(<TestimonialsSection testimonials={makeTestimonials(5)} />)

    expect(screen.getByText(/Quote 1/)).toBeInTheDocument()
    expect(screen.getByText(/Quote 2/)).toBeInTheDocument()
    expect(screen.queryByText(/Quote 3/)).not.toBeInTheDocument()
  })

  it('shows "View all testimonials" link when more than 2 testimonials', () => {
    render(<TestimonialsSection testimonials={makeTestimonials(3)} />)

    const link = screen.getByRole('link', { name: /View all testimonials/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/testimonials')
  })

  it('does not show "View all" link when 2 or fewer testimonials', () => {
    render(<TestimonialsSection testimonials={makeTestimonials(2)} />)

    expect(screen.queryByRole('link', { name: /View all testimonials/i })).not.toBeInTheDocument()
  })

  it('renders all provided testimonials when exactly 2', () => {
    render(<TestimonialsSection testimonials={makeTestimonials(2)} />)

    expect(screen.getByText(/Quote 1/)).toBeInTheDocument()
    expect(screen.getByText(/Quote 2/)).toBeInTheDocument()
  })
})
