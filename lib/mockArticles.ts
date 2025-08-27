import { Article, Author } from '@/lib/types'

// Mock author data
const shagunAuthor: Author = {
  id: 'shagun-khare',
  name: 'Shagun Khare',
  slug: 'shagun-khare',
  image: '/images/shagun-headshot.jpg',
  bio: 'Digital journalist covering technology, society, and culture.',
  socials: {
    twitter: 'https://twitter.com/shagunkhare',
    linkedin: 'https://linkedin.com/in/shagunkhare',
    email: 'hello@shagunkhare.com'
  }
}

// Mock articles data
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of AI in Journalism: Opportunities and Challenges',
    slug: 'future-ai-journalism',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Technology',
    categories: [{ id: 'tech', title: 'Technology' }],
    publishedAt: '2024-01-20T10:00:00Z',
    featured: true,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Exploring how artificial intelligence is transforming the journalism industry and what it means for the future of news reporting.'
  },
  {
    id: '2',
    title: 'Digital Privacy in the Age of Social Media',
    slug: 'digital-privacy-social-media',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Society',
    categories: [{ id: 'society', title: 'Society' }],
    publishedAt: '2024-01-18T14:30:00Z',
    featured: true,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'An investigation into how social media platforms handle user data and the implications for personal privacy.'
  },
  {
    id: '3',
    title: 'The Rise of Remote Work: Reshaping Urban Culture',
    slug: 'remote-work-urban-culture',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Culture',
    categories: [{ id: 'culture', title: 'Culture' }],
    publishedAt: '2024-01-16T09:15:00Z',
    featured: false,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'How the shift to remote work is changing city dynamics and cultural patterns across the globe.'
  },
  {
    id: '4',
    title: 'Blockchain Technology Beyond Cryptocurrency',
    slug: 'blockchain-beyond-crypto',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Technology',
    categories: [{ id: 'tech', title: 'Technology' }],
    publishedAt: '2024-01-14T11:45:00Z',
    featured: false,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Examining real-world applications of blockchain technology in industries beyond finance.'
  },
  {
    id: '5',
    title: 'The Ethics of Tech Surveillance in Public Spaces',
    slug: 'ethics-tech-surveillance',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Society',
    categories: [{ id: 'society', title: 'Society' }],
    publishedAt: '2024-01-12T16:20:00Z',
    featured: true,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'A deep dive into the ethical implications of surveillance technology in public spaces and smart cities.'
  },
  {
    id: '6',
    title: 'How Streaming Services Are Changing Cultural Consumption',
    slug: 'streaming-cultural-consumption',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Culture',
    categories: [{ id: 'culture', title: 'Culture' }],
    publishedAt: '2024-01-10T13:00:00Z',
    featured: false,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Analyzing the impact of streaming platforms on how we discover and consume cultural content.'
  },
  {
    id: '7',
    title: 'The Gig Economy: Redefining Work and Worker Rights',
    slug: 'gig-economy-worker-rights',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Society',
    categories: [{ id: 'society', title: 'Society' }],
    publishedAt: '2024-01-08T08:30:00Z',
    featured: false,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Investigating how the gig economy is changing traditional employment and what it means for worker protections.'
  },
  {
    id: '8',
    title: 'Quantum Computing: The Next Technological Revolution',
    slug: 'quantum-computing-revolution',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Technology',
    categories: [{ id: 'tech', title: 'Technology' }],
    publishedAt: '2024-01-06T15:45:00Z',
    featured: false,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Understanding quantum computing technology and its potential to revolutionize various industries.'
  },
  {
    id: '9',
    title: 'Digital Art and NFTs: Transforming Creative Industries',
    slug: 'digital-art-nfts-creative',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Culture',
    categories: [{ id: 'culture', title: 'Culture' }],
    publishedAt: '2024-01-04T12:10:00Z',
    featured: false,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Exploring how digital art and NFTs are reshaping the creative economy and artist-audience relationships.'
  },
  {
    id: '10',
    title: 'Climate Tech: Innovation in the Fight Against Climate Change',
    slug: 'climate-tech-innovation',
    author: shagunAuthor,
    coverImage: undefined,
    category: 'Technology',
    categories: [{ id: 'tech', title: 'Technology' }],
    publishedAt: '2024-01-02T10:25:00Z',
    featured: true,
    content: 'Lorem ipsum dolor sit amet...',
    excerpt: 'Investigating cutting-edge technologies being developed to address climate change and environmental challenges.'
  }
]

// Helper function to get unique categories
export const getUniqueCategories = (): string[] => {
  const categories = mockArticles.map(article => article.category).filter(Boolean) as string[]
  return [...new Set(categories)].sort()
}
