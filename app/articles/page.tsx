"use client"

import { useState, useMemo, useEffect } from 'react'
import { ArticleGrid } from '@/components/ArticleGrid'
import ArticleFilters, { FilterType } from '@/components/articles/ArticleFilters'
import { Article } from '@/lib/types'

// Define fallback categories as a constant to avoid recreating arrays
const FALLBACK_CATEGORIES = ['Home Tours', 'Designer Features', 'Expert Insights', 'Commerce', 'Gardens & Plants', 'Cleaning & Organizing', 'Food & Wine']

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType | string>('featured')
  const [baseContext, setBaseContext] = useState<'featured' | 'recent'>('featured')
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

  // Handle filter changes and track base context
  const handleFilterChange = (filter: FilterType | string) => {
    if (filter === 'featured' || filter === 'recent') {
      setBaseContext(filter)
    }
    setActiveFilter(filter)
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
    
    // Apply base filter based on tracked context
    if (baseContext === 'featured') {
      filtered = filtered.filter(article => article.featured)
    }
    // For 'recent', we keep all articles (already sorted by most recent from API)
    
    // Apply category filter if a specific category is selected
    if (typeof activeFilter === 'string' && activeFilter !== 'recent' && activeFilter !== 'featured') {
      filtered = filtered.filter(article => article.category === activeFilter)
    }
    
    return filtered
  }, [activeFilter, articles, baseContext])
  
  // Get filter display text - memoize to prevent unnecessary re-renders
  const filterDisplayText = useMemo(() => {
    if (typeof activeFilter === 'string' && categories.includes(activeFilter)) {
      return activeFilter
    }
    
    switch (activeFilter) {
      case 'featured':
        return 'Featured Articles'
      case 'recent':
        return 'All Articles'
      default:
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
          Check out my published work across different verticals, publications, and formats.
        </p>
      </div>

      {/* TESTING: Filters */}
      <div className="mb-12">
        <ArticleFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          categories={categories}
          articles={articles}
          baseContext={baseContext}
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