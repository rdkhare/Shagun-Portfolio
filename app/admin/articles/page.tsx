"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Article } from '@/lib/db/schema'

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch articles from API
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/articles')
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }

      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError('Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      // Remove from local state
      setArticles(articles.filter(article => article.id !== id))
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchArticles} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-light">Manage Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No articles found</p>
            <Button asChild>
              <Link href="/admin/articles/new">
                <Plus className="w-4 h-4 mr-2" />
                Create your first article
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <div className="space-y-1 mb-3">
                      <p className="text-muted-foreground text-sm">Slug: {article.slug}</p>
                      {article.publisher && (
                        <p className="text-muted-foreground text-sm">Publisher: {article.publisher}</p>
                      )}
                      {article.category && (
                        <p className="text-muted-foreground text-sm">Category: {article.category}</p>
                      )}
                      {article.externalUrl && (
                        <p className="text-muted-foreground text-sm">
                          URL: <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{article.externalUrl}</a>
                        </p>
                      )}
                    </div>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                      {article.featured && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                      <span>Created: {formatDate(article.createdAt!)}</span>
                      {article.publishedAt && (
                        <span>Published: {formatDate(article.publishedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {article.status === 'published' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/articles/${article.slug}`} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/articles/${article.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteArticle(article.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}