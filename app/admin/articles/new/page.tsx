"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ArticleForm from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (data: any) => {
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