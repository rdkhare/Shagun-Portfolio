import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '@/components/ArticleCard'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiExternalLink: () => <span data-testid="external-icon" />,
}))

const baseProps = {
  title: 'Test Article',
  slug: 'test-article',
  publishedAt: '2025-06-15T12:00:00.000Z',
}

describe('ArticleCard', () => {
  it('renders title and formatted date', () => {
    render(<ArticleCard {...baseProps} />)
    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('June 15, 2025')).toBeInTheDocument()
  })

  it('links to internal article by default', () => {
    render(<ArticleCard {...baseProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/articles/test-article')
  })

  it('links to external URL when provided', () => {
    render(<ArticleCard {...baseProps} externalUrl="https://example.com/article" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/article')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows external icon for external articles', () => {
    render(<ArticleCard {...baseProps} externalUrl="https://example.com" />)
    expect(screen.getByTestId('external-icon')).toBeInTheDocument()
    expect(screen.getByText('External')).toBeInTheDocument()
  })

  it('renders cover image when provided', () => {
    render(<ArticleCard {...baseProps} coverImage="/test-cover.jpg" />)
    const img = screen.getByAltText('Cover image for Test Article')
    expect(img).toBeInTheDocument()
  })

  it('renders category when provided', () => {
    render(<ArticleCard {...baseProps} category="Tech" />)
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('renders featured badge when featured', () => {
    render(<ArticleCard {...baseProps} featured />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders publisher when provided', () => {
    render(<ArticleCard {...baseProps} publisher="NYT" />)
    expect(screen.getByText('Published in NYT')).toBeInTheDocument()
  })

  it('renders excerpt when provided', () => {
    render(<ArticleCard {...baseProps} excerpt="A short summary" />)
    expect(screen.getByText('A short summary')).toBeInTheDocument()
  })
})
