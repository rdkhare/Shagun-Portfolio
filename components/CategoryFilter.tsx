'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Category } from '@/lib/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex justify-center mb-8">
      <ToggleGroup
        type="single"
        value={selectedCategory || 'all'}
        onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
        className="flex flex-wrap justify-center gap-2"
      >
        <ToggleGroupItem value="all" aria-label="All categories">
          All
        </ToggleGroupItem>
        {categories.map((category) => (
          <ToggleGroupItem
            key={category.id}
            value={category.title}
            aria-label={`Filter to ${category.title}`}
          >
            {category.title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
} 