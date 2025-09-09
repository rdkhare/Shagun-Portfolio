"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from '@/components/admin/SortableArticleCard'
import { Article } from '@/lib/db/schema'
import { HiSave, HiArrowLeft } from 'react-icons/hi'
import Link from 'next/link'

export default function FeaturedArticlesOrderPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch featured articles
  useEffect(() => {
    fetchFeaturedArticles()
  }, [])

  const fetchFeaturedArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/articles')
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }

      const data = await response.json()
      // Filter only featured articles and sort by featuredOrder
      const featuredArticles = (data.articles || [])
        .filter((article: Article) => article.featured)
        .sort((a: Article, b: Article) => {
          // Sort by featuredOrder, then by publishedAt as fallback
          const orderA = a.featuredOrder ?? 999
          const orderB = b.featuredOrder ?? 999
          if (orderA !== orderB) {
            return orderA - orderB
          }
          // Fallback to published date if no order set
          return new Date(b.publishedAt || b.createdAt!).getTime() - new Date(a.publishedAt || a.createdAt!).getTime()
        })
      
      setArticles(featuredArticles)
    } catch (error) {
      console.error('Error fetching featured articles:', error)
      setError('Failed to load featured articles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setArticles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        setHasChanges(true)
        return newItems
      })
    }
  }

  const saveOrder = async () => {
    if (!hasChanges) return

    try {
      setIsSaving(true)
      
      const articleIds = articles.map(article => article.id)
      
      const response = await fetch('/api/admin/articles/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to save order')
      }

      setHasChanges(false)
      
      // Refresh to get updated data
      await fetchFeaturedArticles()
      
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Failed to save order. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
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
          <Button onClick={fetchFeaturedArticles} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/articles">
                <HiArrowLeft className="w-4 h-4" />
                Back to Articles
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-display font-light">Featured Articles Order</h1>
          <p className="text-muted-foreground mt-2">
            Drag and drop to reorder your featured articles. This affects how they appear on your portfolio.
          </p>
        </div>
        
        {hasChanges && (
          <Button 
            onClick={saveOrder} 
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <HiSave className="w-4 h-4" />
                Save Order
              </>
            )}
          </Button>
        )}
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No featured articles found</p>
            <p className="text-sm text-muted-foreground">
              Mark some articles as &ldquo;Featured&rdquo; in the main articles page to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={articles.map(article => article.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {articles.map((article, index) => (
                <SortableItem
                  key={article.id}
                  id={article.id}
                  article={article}
                  index={index + 1}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {hasChanges && (
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm font-medium text-orange-700">
                  You have unsaved changes
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchFeaturedArticles}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={saveOrder}
                  disabled={isSaving}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
