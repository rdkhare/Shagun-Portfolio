import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />)
    expect(screen.getByText('Shagun Khare')).toBeInTheDocument()
  })

  it('renders quick links', () => {
    render(<Footer />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Articles')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders quick links with correct hrefs', () => {
    render(<Footer />)
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Articles').closest('a')).toHaveAttribute('href', '/articles')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
  })

  it('renders default bio when no profile provided', () => {
    render(<Footer />)
    expect(
      screen.getByText('Writer, journalist, and lifestyle enthusiast based in Brooklyn.')
    ).toBeInTheDocument()
  })

  it('renders custom footer bio from profile', () => {
    render(<Footer profile={{ footerBio: '<p>Custom bio text</p>' }} />)
    expect(screen.getByText('Custom bio text')).toBeInTheDocument()
  })

  it('renders contact email when provided', () => {
    render(<Footer profile={{ contactEmail: 'hello@example.com' }} />)
    expect(screen.getByText('hello@example.com')).toBeInTheDocument()
    expect(screen.getByText('hello@example.com').closest('a')).toHaveAttribute(
      'href',
      'mailto:hello@example.com'
    )
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} Shagun Khare`)).toBeInTheDocument()
  })

  it('renders developer credit', () => {
    render(<Footer />)
    expect(screen.getByText('Rajat Khare')).toBeInTheDocument()
  })

  it('renders LinkedIn link', () => {
    render(<Footer />)
    const linkedinLink = screen.getByText('shagun-khare-').closest('a')
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/shagun-khare-/')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })
})
