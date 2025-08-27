"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ArticleCard from './ArticleCard'
import { mockArticles } from '@/lib/mockArticles'

// Get featured and latest articles from mock data
const featuredArticles = mockArticles.filter(article => article.featured).slice(0, 3)
const latestArticles = mockArticles
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 3)

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState<string>("featured")
  
  const currentArticles = activeTab === "featured" ? featuredArticles : latestArticles

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
          {currentArticles.map((article) => (
            <ArticleCard 
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt || ''}
              publishedAt={article.publishedAt}
              slug={article.slug}
              featured={article.featured}
            />
          ))}
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
