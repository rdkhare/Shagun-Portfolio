import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Article } from '@/lib/db/schema'
import { HiSelector } from 'react-icons/hi'

interface SortableItemProps {
  id: string
  article: Article
  index: number
  formatDate: (date: string | Date) => string
}

export function SortableItem({ id, article, index, formatDate }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className={`${isDragging ? 'shadow-lg' : ''} transition-shadow`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 p-2 cursor-grab hover:bg-muted rounded transition-colors"
              title="Drag to reorder"
            >
              <HiSelector className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Order Number */}
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
              {index}
            </div>

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-2 truncate">{article.title}</h3>
              
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
                    URL: <a 
                      href={article.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline truncate inline-block max-w-xs"
                    >
                      {article.externalUrl}
                    </a>
                  </p>
                )}
              </div>

              {article.excerpt && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  Featured
                </span>
                {article.featuredOrder && (
                  <span>Order: {article.featuredOrder}</span>
                )}
                {article.publishedAt && (
                  <span>Published: {formatDate(article.publishedAt)}</span>
                )}
              </div>
            </div>

            {/* Cover Image Preview */}
            {article.coverImage && (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
