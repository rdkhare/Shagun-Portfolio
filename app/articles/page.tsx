"use client"

import { useState, useMemo, useEffect } from 'react'
import { ArticleGrid } from '@/components/ArticleGrid'
import ArticleFilters, { FilterType } from '@/components/articles/ArticleFilters'
import { Article } from '@/lib/types'

// Define fallback categories as a constant to avoid recreating arrays
const FALLBACK_CATEGORIES = ['Home Tours', 'Designer Features', 'Expert Insights', 'Commerce', 'Gardens & Plants', 'Cleaning & Organizing', 'Food & Wine']

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType | string>('recent')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Fetch articles from API - exactly like ExploreSection
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await fetch('/api/articles')
        
        if (response.ok) {
          const data = await response.json()
          setArticles(data.articles || [])
        } else {
          throw new Error('Failed to fetch articles')
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
        setError('Failed to load articles')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchArticles()
  }, [])

  // Retry function for error state
  const retryFetch = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/articles')
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      } else {
        throw new Error('Failed to fetch articles')
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError('Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique categories from articles
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(
      articles.map(article => article.category).filter(Boolean)
    )) as string[]
    return uniqueCategories.length > 0 ? uniqueCategories : FALLBACK_CATEGORIES
  }, [articles])
  
  // Filter and sort articles based on active filter
  const filteredArticles = useMemo(() => {
    let filtered = [...articles]
    
    switch (activeFilter) {
      case 'featured':
        filtered = filtered.filter(article => article.featured)
        break
      case 'recent':
        // Already sorted by most recent from API
        break
      case 'category':
        // Show all articles (no additional filtering)
        break
      default:
        // Filter by specific category
        if (typeof activeFilter === 'string' && activeFilter !== 'recent' && activeFilter !== 'featured' && activeFilter !== 'category') {
          filtered = filtered.filter(article => article.category === activeFilter)
        }
        break
    }
    
    return filtered
  }, [activeFilter, articles])
  
  // Get filter display text - memoize to prevent unnecessary re-renders
  const filterDisplayText = useMemo(() => {
    switch (activeFilter) {
      case 'featured':
        return 'Featured Articles'
      case 'recent':
        return 'Most Recent Articles'
      case 'category':
        return 'All Articles'
      default:
        if (typeof activeFilter === 'string' && categories.includes(activeFilter)) {
          return `${activeFilter} Articles`
        }
        return 'Articles'
    }
  }, [activeFilter, categories])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={retryFetch}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
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

      {/* TESTING: Filters */}
      <div className="mb-12">
        <ArticleFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          categories={categories}
        />
      </div>

      {/* TESTING: Results Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-display font-light">
            {filterDisplayText}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No articles published yet.
          </p>
        </div>
      ) : filteredArticles.length > 0 ? (
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