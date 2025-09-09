import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HiSelector, HiPencil, HiTrash } from 'react-icons/hi'

interface Testimonial {
  id: string
  author: string
  company: string
  title?: string
  quote: string
  sortOrder?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SortableTestimonialCardProps {
  id: string
  testimonial: Testimonial
  index: number
  onEdit: (testimonial: Testimonial) => void
  onDelete: (id: string) => void
}

export function SortableTestimonialCard({ 
  id, 
  testimonial, 
  index, 
  onEdit, 
  onDelete 
}: SortableTestimonialCardProps) {
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

            {/* Testimonial Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{testimonial.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title && `${testimonial.title} • `}{testimonial.company}
                  </p>
                  {testimonial.isActive && (
                    <span className="inline-block px-2 py-1 text-xs bg-green-500 text-white rounded mt-1">
                      Active
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => onEdit(testimonial)}
                  >
                    <HiPencil className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onDelete(testimonial.id)}
                  >
                    <HiTrash className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Quote Preview (as it appears on frontend) */}
              <div className="bg-muted/30 rounded-lg p-4 mb-4 space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Preview:</p>
                <blockquote className="text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="space-y-1">
                  <div className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
                    {testimonial.title ? `${testimonial.title} AT ${testimonial.company}` : testimonial.company}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {testimonial.sortOrder && (
                  <span>Order: {testimonial.sortOrder}</span>
                )}
                <span>
                  Created: {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
