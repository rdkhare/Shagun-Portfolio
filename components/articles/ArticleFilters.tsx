"use client"

import { Button } from '@/components/ui/button'

export type FilterType = 'recent' | 'featured' | 'category'

interface ArticleFiltersProps {
  activeFilter: FilterType | string
  onFilterChange: (filter: FilterType | string) => void
  categories: string[]
}

export default function ArticleFilters({ activeFilter, onFilterChange, categories }: ArticleFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Main Filters */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <Button
          variant={activeFilter === 'recent' ? 'default' : 'outline'}
          onClick={() => onFilterChange('recent')}
          className="font-medium"
        >
          Most Recent
        </Button>
        <Button
          variant={activeFilter === 'featured' ? 'default' : 'outline'}
          onClick={() => onFilterChange('featured')}
          className="font-medium"
        >
          Featured
        </Button>
        <Button
          variant={activeFilter === 'category' ? 'default' : 'outline'}
          onClick={() => onFilterChange('category')}
          className="font-medium"
        >
          All Categories
        </Button>
      </div>

      {/* Category Filters - Show only when category filter is active */}
      {activeFilter !== 'recent' && activeFilter !== 'featured' && (
        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              variant={activeFilter === 'category' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('category')}
              className="text-sm"
            >
              All
            </Button>
            {categories.map((category) => (
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
