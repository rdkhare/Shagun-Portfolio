'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { HiTrash, HiPencil, HiPlus, HiArrowsExpand } from 'react-icons/hi'
import { Notification, useNotification } from '@/components/ui/notification'
import { ImageUpload } from '@/components/admin/ImageUpload'
import Image from 'next/image'
import Link from 'next/link'

const publicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().min(1, 'Logo URL is required'),
  websiteUrl: z.string().optional(),
  isActive: z.boolean().optional(),
})

type PublicationFormData = z.infer<typeof publicationSchema>

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

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { notification, showNotification, hideNotification } = useNotification()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      websiteUrl: '',
      isActive: true,
    },
  })

  // Fetch publications
  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      setIsFetching(true)
      const response = await fetch('/api/admin/publications')
      
      if (response.ok) {
        const data = await response.json()
        setPublications(data.publications || [])
      } else {
        showNotification('error', 'Failed to load publications', 'Please try again.')
      }
    } catch (error) {
      console.error('Error fetching publications:', error)
      showNotification('error', 'Failed to load publications', 'Please try again.')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: PublicationFormData) => {
    try {
      setIsLoading(true)

      const url = editingId 
        ? `/api/admin/publications/${editingId}`
        : '/api/admin/publications'
      
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save publication')
      }

      showNotification(
        'success',
        editingId ? 'Publication Updated!' : 'Publication Created!',
        editingId 
          ? 'The publication has been updated successfully.'
          : 'The publication has been created successfully.',
        3000
      )

      // Reset form and refresh data
      reset()
      setEditingId(null)
      setShowForm(false)
      fetchPublications()
    } catch (error) {
      console.error('Error saving publication:', error)
      showNotification(
        'error',
        'Save Failed',
        'There was an error saving the publication. Please try again.',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (publication: Publication) => {
    setEditingId(publication.id)
    setShowForm(true)
    setValue('name', publication.name)
    setValue('logoUrl', publication.logoUrl)
    setValue('websiteUrl', publication.websiteUrl || '')
    setValue('isActive', publication.isActive)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/publications/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete publication')
      }

      showNotification(
        'success',
        'Publication Deleted!',
        'The publication has been deleted successfully.',
        3000
      )

      fetchPublications()
    } catch (error) {
      console.error('Error deleting publication:', error)
      showNotification(
        'error',
        'Delete Failed',
        'There was an error deleting the publication. Please try again.',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setEditingId(null)
    setShowForm(false)
  }

  const handleAddNew = () => {
    reset()
    setEditingId(null)
    setShowForm(true)
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          isVisible={!!notification}
          onClose={hideNotification}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-light">Manage Publications</h1>
            <p className="text-muted-foreground mt-1">
              Manage the publication logos shown in your "As Seen In" section.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" disabled={isLoading}>
              <Link href="/admin/publications/reorder">
                <HiArrowsExpand className="w-4 h-4 mr-2" />
                Reorder
              </Link>
            </Button>
            <Button onClick={handleAddNew} disabled={isLoading}>
              <HiPlus className="w-4 h-4 mr-2" />
              Add Publication
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          {showForm && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingId ? 'Edit Publication' : 'Add New Publication'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Publication Name *
                      </label>
                      <Input
                        {...register('name')}
                        placeholder="e.g., Martha Stewart Living"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Logo Image *
                      </label>
                      <ImageUpload
                        value={watch('logoUrl')}
                        onChange={(url) => setValue('logoUrl', url)}
                        onError={(error) => showNotification('error', 'Upload Error', error)}
                        type="publication"
                        aspectRatio="16/9"
                        maxSizeMB={2}
                      />
                      {errors.logoUrl && (
                        <p className="text-red-500 text-sm mt-1">{errors.logoUrl.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website URL (Optional)
                      </label>
                      <Input
                        {...register('websiteUrl')}
                        type="url"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={watch('isActive')}
                        onCheckedChange={(checked) => setValue('isActive', !!checked)}
                      />
                      <label htmlFor="isActive" className="text-sm font-medium">
                        Show in "As Seen In" section
                      </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Publications List */}
          <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Publications ({publications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {publications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No publications yet.</p>
                    <Button onClick={handleAddNew} variant="outline">
                      <HiPlus className="w-4 h-4 mr-2" />
                      Add Your First Publication
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {publications.map((publication) => (
                      <div 
                        key={publication.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        {/* Logo */}
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          <Image
                            src={publication.logoUrl}
                            alt={publication.name}
                            width={200}
                            height={100}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        
                        {/* Publication Details */}
                        <div>
                          <h3 className="font-medium text-sm">{publication.name}</h3>
                          {publication.websiteUrl && (
                            <a 
                              href={publication.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {publication.isActive ? 'Visible' : 'Hidden'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(publication)}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            <HiPencil className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(publication.id)}
                            disabled={isLoading}
                          >
                            <HiTrash className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
