"use client"

import { useState, useMemo } from 'react'
import { mockArticles, getUniqueCategories } from '@/lib/mockArticles'
import { ArticleGrid } from '@/components/ArticleGrid'
import ArticleFilters, { FilterType } from '@/components/articles/ArticleFilters'

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType | string>('recent')
  
  // Get unique categories from articles
  const categories = getUniqueCategories()
  
  // Filter and sort articles based on active filter
  const filteredArticles = useMemo(() => {
    let filtered = [...mockArticles]
    
    switch (activeFilter) {
      case 'featured':
        filtered = filtered.filter(article => article.featured)
        break
      case 'recent':
        // Already sorted by most recent in mock data, but ensure it
        filtered = filtered.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
        break
      case 'category':
        // Show all articles (no additional filtering)
        break
      default:
        // Filter by specific category
        if (categories.includes(activeFilter)) {
          filtered = filtered.filter(article => article.category === activeFilter)
        }
        break
    }
    
    return filtered
  }, [activeFilter, categories])
  
  // Get filter display text
  const getFilterDisplayText = () => {
    switch (activeFilter) {
      case 'featured':
        return 'Featured Articles'
      case 'recent':
        return 'Most Recent Articles'
      case 'category':
        return 'All Articles'
      default:
        if (categories.includes(activeFilter)) {
          return `${activeFilter} Articles`
        }
        return 'Articles'
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-light mb-4">Articles</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Investigative journalism and thoughtful commentary on technology, society, and culture.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12">
        <ArticleFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          categories={categories}
        />
      </div>

      {/* Results Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-display font-light">
            {getFilterDisplayText()}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <ArticleGrid articles={filteredArticles} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No articles found for the selected filter.
          </p>
          <button
            onClick={() => setActiveFilter('recent')}
            className="text-primary hover:underline"
          >
            View all articles
          </button>
        </div>
      )}
    </div>
  )
} 