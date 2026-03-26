import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the DB client before importing the route handler.
// This prevents the top-level DATABASE_URL check from throwing.
vi.mock('@/lib/db/client', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockLeftJoin = vi.fn()
  const mockWhere = vi.fn()

  // Chain: db.select().from().leftJoin().where()
  mockWhere.mockResolvedValue([])
  mockLeftJoin.mockReturnValue({ where: mockWhere })
  mockFrom.mockReturnValue({ leftJoin: mockLeftJoin })
  mockSelect.mockReturnValue({ from: mockFrom })

  return {
    db: {
      select: mockSelect,
      query: {},
    },
    __mockWhere: mockWhere,
    __mockSelect: mockSelect,
  }
})

// Import after mocking
import { GET } from '@/app/api/articles/route'

// Get mock handles for assertions
async function getMocks() {
  const mod = await import('@/lib/db/client')
  return mod as typeof mod & { __mockWhere: ReturnType<typeof vi.fn>; __mockSelect: ReturnType<typeof vi.fn> }
}

describe('GET /api/articles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty articles array when no articles exist', async () => {
    const mocks = await getMocks()
    mocks.__mockWhere.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/articles')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.articles).toEqual([])
  })

  it('returns articles sorted with featured first', async () => {
    const mocks = await getMocks()
    mocks.__mockWhere.mockResolvedValue([
      {
        id: '1',
        title: 'Regular Article',
        slug: 'regular',
        excerpt: null,
        coverImage: null,
        externalUrl: null,
        publisher: null,
        category: null,
        featured: false,
        featuredOrder: null,
        publishedAt: '2025-06-01T00:00:00.000Z',
        author: { id: 'u1', name: 'Author', slug: 'author@test.com' },
      },
      {
        id: '2',
        title: 'Featured Article',
        slug: 'featured',
        excerpt: 'A featured piece',
        coverImage: '/cover.jpg',
        externalUrl: null,
        publisher: null,
        category: 'Tech',
        featured: true,
        featuredOrder: 1,
        publishedAt: '2025-05-01T00:00:00.000Z',
        author: { id: 'u1', name: 'Author', slug: 'author@test.com' },
      },
    ])

    const request = new NextRequest('http://localhost:3000/api/articles')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.articles).toHaveLength(2)
    // Featured article should come first despite older date
    expect(data.articles[0].title).toBe('Featured Article')
    expect(data.articles[1].title).toBe('Regular Article')
  })

  it('returns 500 when database query fails', async () => {
    const mocks = await getMocks()
    mocks.__mockWhere.mockRejectedValue(new Error('DB connection failed'))

    const request = new NextRequest('http://localhost:3000/api/articles')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch articles')
  })
})
