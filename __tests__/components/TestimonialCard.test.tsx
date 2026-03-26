import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TestimonialCard from '@/components/TestimonialCard'

const mockTestimonial = {
  id: '1',
  author: 'Jane Doe',
  company: 'Domino Magazine',
  title: 'Editor',
  quote: 'Working with Shagun was amazing.',
}

const mockTestimonialNoTitle = {
  id: '2',
  author: 'John Smith',
  company: 'Martha Stewart Living',
  quote: 'Exceptional work.',
}

describe('TestimonialCard', () => {
  it('renders quote, author, and title with company', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)

    expect(screen.getByText(/Working with Shagun was amazing/)).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Editor AT Domino Magazine')).toBeInTheDocument()
  })

  it('renders company without title when title is not provided', () => {
    render(<TestimonialCard testimonial={mockTestimonialNoTitle} />)

    expect(screen.getByText(/Exceptional work/)).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Martha Stewart Living')).toBeInTheDocument()
  })
})
