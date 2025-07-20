'use client'

import { useState, useMemo } from 'react'
import { Article, Category } from '@/lib/types'
import { ArticleGrid } from './ArticleGrid'
import { CategoryFilter } from './CategoryFilter'

interface ArticleFilterProps {
  articles: Article[]
  categories: Category[]
}

export function ArticleFilter({ articles, categories }: ArticleFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) {
      return articles
    }
    return articles.filter(article =>
      article.categories?.some(cat => cat.title === selectedCategory)
    )
  }, [articles, selectedCategory])

  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ArticleGrid articles={filteredArticles} />
    </div>
  )
} 