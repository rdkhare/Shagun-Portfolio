"use client"

import { Button } from '@/components/ui/button'

export type FilterType = 'recent' | 'featured' | 'category'

interface ArticleFiltersProps {
  activeFilter: FilterType | string
  onFilterChange: (filter: FilterType | string) => void
  categories: string[]
  articles: Array<{ featured: boolean; category?: string }>
  baseContext?: 'featured' | 'recent'
}

export default function ArticleFilters({ activeFilter, onFilterChange, categories, articles, baseContext }: ArticleFiltersProps) {
  // Define the preferred category order
  const categoryOrder = [
    'Home Tours',
    'Designer Features', 
    'Expert Insights',
    'Commerce',
    'Food & Wine',
    'Gardens & Plants',
    'Cleaning & Organizing'
  ]

  // Use the baseContext prop to determine which main filter is active
  const isInFeaturedContext = baseContext === 'featured' || activeFilter === 'featured'
  const isInRecentContext = baseContext === 'recent' || activeFilter === 'recent'
  
  // Filter categories based on the current context and sort by preferred order
  const availableCategories = categories
    .filter(category => {
      if (isInFeaturedContext) {
        // For featured section, only show categories that have featured articles
        return articles.some(article => article.featured && article.category === category)
      } else if (isInRecentContext) {
        // For all articles section, show all categories that have any articles
        return articles.some(article => article.category === category)
      }
      return false
    })
    .sort((a, b) => {
      const indexA = categoryOrder.indexOf(a)
      const indexB = categoryOrder.indexOf(b)
      // If both categories are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      // If only one is in the list, prioritize it
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      // If neither is in the list, maintain original order
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Main Filters */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <Button
          variant={isInFeaturedContext ? 'default' : 'outline'}
          onClick={() => onFilterChange('featured')}
          className="font-medium"
        >
          Featured
        </Button>
        <Button
          variant={isInRecentContext ? 'default' : 'outline'}
          onClick={() => onFilterChange('recent')}
          className="font-medium"
        >
          All Articles
        </Button>
      </div>

      {/* Category Filters - Show only when main filter is active and has categories */}
      {availableCategories.length > 0 && (isInFeaturedContext || isInRecentContext) && (
        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              variant={(activeFilter === 'recent' || activeFilter === 'featured') ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(isInFeaturedContext ? 'featured' : 'recent')}
              className="text-sm"
            >
              All
            </Button>
            {availableCategories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
