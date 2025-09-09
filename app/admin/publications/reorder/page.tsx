'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortablePublicationCard } from '@/components/admin/SortablePublicationCard'
import { HiSave, HiArrowLeft } from 'react-icons/hi'
import Link from 'next/link'

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

export default function PublicationsOrderPage() {
  const [publications, setPublications] = useState<Publication[]>([])
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

  // Fetch publications
  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/publications')
      
      if (!response.ok) {
        throw new Error('Failed to fetch publications')
      }

      const data = await response.json()
      // Sort by current sortOrder
      const sortedPublications = (data.publications || [])
        .sort((a: Publication, b: Publication) => {
          const orderA = a.sortOrder ?? 999
          const orderB = b.sortOrder ?? 999
          if (orderA !== orderB) {
            return orderA - orderB
          }
          // Fallback to created date if no order set
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
      
      setPublications(sortedPublications)
    } catch (error) {
      console.error('Error fetching publications:', error)
      setError('Failed to load publications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setPublications((items) => {
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
      
      const publicationIds = publications.map(publication => publication.id)
      
      const response = await fetch('/api/admin/publications/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicationIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to save order')
      }

      setHasChanges(false)
      
      // Refresh to get updated data
      await fetchPublications()
      
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Failed to save order. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchPublications} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/publications">
                <HiArrowLeft className="w-4 h-4" />
                Back to Publications
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-display font-light">Reorder Publications</h1>
          <p className="text-muted-foreground mt-2">
            Drag and drop to reorder your publications. This affects how they appear in the &ldquo;As Seen In&rdquo; carousel.
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

      {publications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No publications found</p>
            <p className="text-sm text-muted-foreground">
              Add some publications first to reorder them.
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
            items={publications.map(publication => publication.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {publications.map((publication, index) => (
                <SortablePublicationCard
                  key={publication.id}
                  id={publication.id}
                  publication={publication}
                  index={index + 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
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
                  onClick={fetchPublications}
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
