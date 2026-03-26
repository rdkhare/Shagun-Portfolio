import HeroSection from '@/components/home/HeroSection'
import ExploreSection from '@/components/home/ExploreSection'
import AsSeenInSection from '@/components/home/AsSeenInSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'

async function getHomePageData() {
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  try {
    // Fetch all data in parallel
    const [profileResponse, articlesResponse, testimonialsResponse, publicationsResponse] = await Promise.all([
      fetch(`${baseUrl}/api/profile`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/articles`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/testimonials`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/publications`, { next: { revalidate: 300 } })
    ])

    const profile = profileResponse.ok ? (await profileResponse.json()).profile : null
    const articles = articlesResponse.ok ? (await articlesResponse.json()).articles : []
    const testimonials = testimonialsResponse.ok ? (await testimonialsResponse.json()).testimonials : []
    const publications = publicationsResponse.ok ? (await publicationsResponse.json()).publications : []

    return { profile, articles, testimonials, publications }
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return { profile: null, articles: [], testimonials: [], publications: [] }
  }
}

export default async function HomePage() {
  const { profile, articles, testimonials, publications } = await getHomePageData()

  return (
    <main>
      <div className="container mx-auto px-4 max-w-6xl">
        <HeroSection profile={profile} />
        <AsSeenInSection publications={publications} />
        <ExploreSection articles={articles} />
      </div>
      <TestimonialsSection testimonials={testimonials} />
    </main>
  )
}
