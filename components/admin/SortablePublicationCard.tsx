import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { HiSelector } from 'react-icons/hi'
import Image from 'next/image'

interface Publication {
  id: string
  name: string
  logoUrl: string
  websiteUrl?: string
  sortOrder?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SortablePublicationProps {
  id: string
  publication: Publication
  index: number
}

export function SortablePublicationCard({ id, publication, index }: SortablePublicationProps) {
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
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
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

            {/* Logo Preview */}
            <div className="flex-shrink-0">
              <div className="w-20 h-12 bg-muted rounded overflow-hidden flex items-center justify-center">
                <Image
                  src={publication.logoUrl}
                  alt={publication.name}
                  width={80}
                  height={48}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Publication Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1 truncate">{publication.name}</h3>
              
              <div className="space-y-1">
                {publication.websiteUrl && (
                  <p className="text-muted-foreground text-sm">
                    Website: <a 
                      href={publication.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline truncate inline-block max-w-xs"
                    >
                      {publication.websiteUrl}
                    </a>
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    publication.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {publication.isActive ? 'Visible' : 'Hidden'}
                  </span>
                  {publication.sortOrder && (
                    <span className="text-muted-foreground">Order: {publication.sortOrder}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
