"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ArticleCard from './ArticleCard'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  externalUrl?: string
  publisher?: string
  category?: string
  featured: boolean
  featuredOrder?: number
  publishedAt: string
  author: {
    id: string
    name: string
    slug: string
  }
}

interface ExploreSectionProps {
  articles: Article[]
}

export default function ExploreSection({ articles }: ExploreSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("featured")

  // Get featured and latest articles from provided data
  const featuredArticles = articles
    .filter(article => article.featured)
    .sort((a, b) => {
      // Sort by featuredOrder if available, otherwise by publishedAt
      if (a.featuredOrder !== undefined && b.featuredOrder !== undefined) {
        return a.featuredOrder - b.featuredOrder
      }
      if (a.featuredOrder !== undefined) return -1
      if (b.featuredOrder !== undefined) return 1
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
    .slice(0, 3)
  
  // Sort ALL articles by publication date to get truly latest ones
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
  
  const currentArticles = activeTab === "featured" ? featuredArticles : latestArticles

  // Show message if no articles
  if (articles.length === 0) {
    return (
      <section className="py-12 sm:py-16 border-t border-border">
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-light mb-6 sm:mb-8">Explore My Work</h3>
            <p className="text-muted-foreground">No articles published yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="space-y-8">
        {/* Header with Buttons */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-light mb-6 sm:mb-8">Explore My Work</h3>
          <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
            <Button 
              variant={activeTab === "featured" ? "default" : "outline"} 
              size="lg" 
              className="font-medium text-sm sm:text-base"
              onClick={() => setActiveTab("featured")}
            >
              Featured
            </Button>
            <Button 
              variant={activeTab === "recent" ? "default" : "outline"} 
              size="lg" 
              className="font-medium text-sm sm:text-base"
              onClick={() => setActiveTab("recent")}
            >
              Latest
            </Button>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentArticles.length > 0 ? (
            currentArticles.map((article) => (
              <ArticleCard 
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt || ''}
                publishedAt={article.publishedAt}
                slug={article.slug}
                coverImage={article.coverImage}
                externalUrl={article.externalUrl}
                publisher={article.publisher}
                category={article.category}
                featured={article.featured}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                {activeTab === "featured" ? "No featured articles yet." : "No articles published yet."}
              </p>
            </div>
          )}
        </div>

        {/* View More Button */}
        <div className="flex justify-end">
          <Button asChild variant="outline" size="lg" className="font-medium">
            <Link href="/articles">View More Articles →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
