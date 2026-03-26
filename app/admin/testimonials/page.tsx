"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTestimonialCard } from '@/components/admin/SortableTestimonialCard'
import { HiPlus, HiSave } from 'react-icons/hi'
import { Testimonial } from '@/lib/db/schema'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      if (response.ok) {
        const data = await response.json()
        // Sort testimonials by sortOrder, then by createdAt
        const sortedTestimonials = (data.testimonials || []).sort((a: Testimonial, b: Testimonial) => {
          const orderA = a.sortOrder ?? 999
          const orderB = b.sortOrder ?? 999
          if (orderA !== orderB) {
            return orderA - orderB
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
        setTestimonials(sortedTestimonials)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTestimonials((items) => {
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
      
      const testimonialIds = testimonials.map(testimonial => testimonial.id)
      
      const response = await fetch('/api/admin/testimonials/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testimonialIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to save order')
      }

      setHasChanges(false)
      
      // Refresh to get updated data
      await fetchTestimonials()
      
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Failed to save order. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <>
      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onClose={() => {
            setShowForm(false)
            setEditingTestimonial(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setEditingTestimonial(null)
            fetchTestimonials()
          }}
        />
      )}
      
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-light">Testimonials</h2>
          <p className="text-muted-foreground mt-1">
            Drag and drop to reorder testimonials as they appear on your homepage.
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <HiPlus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No testimonials found.</p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <HiPlus className="w-4 h-4" />
              Create your first testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={testimonials.map(testimonial => testimonial.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <SortableTestimonialCard
                  key={testimonial.id}
                  id={testimonial.id}
                  testimonial={testimonial}
                  index={index + 1}
                  onEdit={(testimonial) => {
                    setEditingTestimonial(testimonial)
                    setShowForm(true)
                  }}
                  onDelete={deleteTestimonial}
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
                  onClick={fetchTestimonials}
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
    </>
  )
}

// Simple inline testimonial form component
function TestimonialForm({ 
  testimonial, 
  onClose, 
  onSuccess 
}: { 
  testimonial: Testimonial | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    author: testimonial?.author || '',
    title: testimonial?.title || '',
    company: testimonial?.company || '',
    quote: testimonial?.quote || '',
    isActive: testimonial?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = testimonial ? 'PUT' : 'POST'
      const url = testimonial 
        ? `/api/admin/testimonials/${testimonial.id}`
        : '/api/admin/testimonials'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Author Name</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title/Position</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border border-border rounded"
                placeholder="e.g. Editor (will show as 'EDITOR AT THE SPRUCE')"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full p-2 border border-border rounded"
                placeholder="e.g. The Spruce"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Will display as: {formData.title ? `"${formData.title.toUpperCase()} AT ${formData.company.toUpperCase()}"` : formData.company.toUpperCase()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Testimonial Quote</label>
              <textarea
                required
                rows={4}
                value={formData.quote}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
                className="w-full p-2 border border-border rounded resize-none"
                placeholder="Enter the testimonial quote..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active (show on homepage)</label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
