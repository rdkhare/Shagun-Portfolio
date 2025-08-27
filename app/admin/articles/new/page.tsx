"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ArticleForm from '@/components/admin/ArticleForm'
import * as z from 'zod'

// Match the schema from ArticleForm
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  externalUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  publisher: z.string().min(1, 'Publisher is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
})

type ArticleFormData = z.infer<typeof articleSchema>

export default function NewArticlePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (data: ArticleFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create article')
      }

      const result = await response.json()
      
      // Redirect to the manage articles page after a short delay
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500) // Small delay to show the success notification
    } catch (error) {
      console.error('Error creating article:', error)
      // Error notification is now handled by ArticleForm component
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ArticleForm 
      onSave={handleSave} 
      isLoading={isLoading}
    />
  )
}