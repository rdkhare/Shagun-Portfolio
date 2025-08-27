"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import ArticleForm from '@/components/admin/ArticleForm'
import { Article } from '@/lib/db/schema'

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = use(params)
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  // Fetch article data
  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    try {
      setIsFetching(true)
      const response = await fetch(`/api/admin/articles/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Article not found')
        } else {
          throw new Error('Failed to fetch article')
        }
        return
      }

      const data = await response.json()
      setArticle(data.article)
    } catch (error) {
      console.error('Error fetching article:', error)
      setError('Failed to load article')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSave = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update article')
      }

      const result = await response.json()
      setArticle(result.article)
      
      // Redirect to manage articles page after successful save
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500) // Small delay to show the success notification
    } catch (error) {
      console.error('Error updating article:', error)
      // Error notification is now handled by ArticleForm component
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      router.push('/admin/articles')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article. Please try again.')
    }
  }

  if (isFetching) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/admin/articles')}
            className="text-blue-500 underline"
          >
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-8">
          <p>Article not found</p>
        </div>
      </div>
    )
  }

  return (
    <ArticleForm 
      article={article}
      onSave={handleSave}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  )
}