"use client"

import { useState, useEffect } from 'react'
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
  publishedAt: string
  author: {
    id: string
    name: string
    slug: string
  }
}

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState<string>("featured")
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch articles from API
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get featured and latest articles from fetched data
  const featuredArticles = articles.filter(article => article.featured).slice(0, 3)
  const latestArticles = articles.slice(0, 3) // Already sorted by publishedAt from API
  
  const currentArticles = activeTab === "featured" ? featuredArticles : latestArticles

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 border-t border-border">
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-light mb-6 sm:mb-8">Explore My Work</h3>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

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
              variant={activeTab === "latest" ? "default" : "outline"} 
              size="lg" 
              className="font-medium text-sm sm:text-base"
              onClick={() => setActiveTab("latest")}
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
