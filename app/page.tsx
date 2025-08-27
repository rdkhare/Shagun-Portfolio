import HeroSection from '@/components/home/HeroSection'
import ExploreSection from '@/components/home/ExploreSection'
import AsSeenInSection from '@/components/home/AsSeenInSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <main>
      <div className="container mx-auto px-4 max-w-6xl">
        <HeroSection />
        <ExploreSection />
      </div>
      <AsSeenInSection />
      <TestimonialsSection />
    </main>
  )
}
