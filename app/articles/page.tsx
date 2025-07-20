import { client } from '@/lib/sanity.client'
import { allArticles, categories } from '@/lib/groq'
import { Article } from '@/lib/types'
import { Category } from '@/lib/types'
import { ArticleFilter } from '@/components/ArticleFilter'

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function ArticlesPage() {
  const [articles, cats] = await Promise.all([
    client.fetch<Article[]>(allArticles),
    client.fetch<Category[]>(categories),
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-12">
        All Articles
      </h1>
      <ArticleFilter articles={articles} categories={cats} />
    </main>
  )
} 