import { client } from '@/lib/sanity.client'
import { featuredArticles, latestArticles } from '@/lib/groq'
import { ArticleGrid } from '@/components/ArticleGrid'
import { Article } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    client.fetch<Article[]>(featuredArticles),
    client.fetch<Article[]>(latestArticles)
  ])

  return (
    <main className="container mx-auto px-4 max-w-6xl">
      {/* Masthead Section */}
      <section className="border-b border-border py-12 mb-12">
        <div className="text-center">
          <h1 className="font-display text-6xl md:text-7xl font-light tracking-tight mb-4">
            Shagun Khare
          </h1>
          <div className="byline mb-6">
            Digital Journalist & Writer
          </div>
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-3xl mx-auto serif">
            Exploring the intersection of technology, society, and culture through 
            investigative journalism and thoughtful commentary. Based in the digital frontier, 
            reporting on stories that shape our connected world.
          </p>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="text-center mb-16">
        <div className="flex justify-center gap-8 flex-wrap">
          <Button asChild variant="outline" size="lg" className="font-medium">
            <Link href="/articles">Latest Stories</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-medium">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild size="lg" className="font-medium">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>

      {/* Featured Stories Section */}
      {featured && featured.length > 0 && (
        <section className="mb-16">
          <div className="border-b border-border pb-3 mb-8">
            <h2 className="font-display text-4xl font-light tracking-tight">
              Featured Stories
            </h2>
            <p className="text-muted-foreground mt-2">
              Highlighted pieces from recent investigations and reports
            </p>
          </div>
          <ArticleGrid articles={featured} />
        </section>
      )}

      {/* Latest Articles Section */}
      {latest && latest.length > 0 && (
        <section className="mb-16">
          <div className="border-b border-border pb-3 mb-8">
            <h2 className="font-display text-4xl font-light tracking-tight">
              Recent Work
            </h2>
            <p className="text-muted-foreground mt-2">
              Latest articles and opinion pieces
            </p>
          </div>
          <ArticleGrid articles={latest} />
        </section>
      )}

      {/* Editorial Note */}
      <section className="border-t border-border pt-12 mt-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed serif">
            This digital space serves as a repository for journalistic work, 
            analysis, and commentary. All articles reflect independent research 
            and reporting. For press inquiries, collaboration opportunities, 
            or story tips, please don&apos;t hesitate to reach out.
          </p>
        </div>
      </section>
    </main>
  )
}
