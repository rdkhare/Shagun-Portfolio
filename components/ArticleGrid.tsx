import { Article } from '@/lib/types'
import { ArticleCard } from './ArticleCard'

interface ArticleGridProps {
  articles: Article[]
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (!articles || articles.length === 0) {
    return <p>No articles found.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          title={article.title}
          slug={article.slug}
          coverImage={article.mainImage}
          publishedAt={article.publishedAt}
          category={article.categories?.[0]?.title || 'General'}
        />
      ))}
    </div>
  )
} 