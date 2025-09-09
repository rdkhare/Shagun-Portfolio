'use client'

import { useState, useCallback } from 'react'
import { HiUpload, HiPhotograph, HiTrash } from 'react-icons/hi'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  type?: string // Used to categorize uploads (e.g., 'profile', 'article')
  aspectRatio?: string // CSS aspect ratio
  maxSizeMB?: number
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onError,
  type = 'general',
  aspectRatio = '1/1',
  maxSizeMB = 5,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || '')

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File too large. Max size is ${maxSizeMB}MB.`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Only image files are allowed')
      return
    }

    try {
      setIsUploading(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const result = await response.json()
      onChange(result.url)
    } catch (error) {
      console.error('Upload error:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to upload image')
      setPreview(value || '') // Reset preview on error
    } finally {
      setIsUploading(false)
    }
  }, [value, onChange, onError, type, maxSizeMB])

  const handleRemove = useCallback(() => {
    onChange('')
    setPreview('')
  }, [onChange])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview */}
      {preview && (
        <div 
          className="relative bg-muted rounded-lg overflow-hidden"
          style={{ aspectRatio }}
        >
          <img 
            src={preview} 
            alt="Upload preview" 
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <HiTrash className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${type}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`image-upload-${type}`}
            className="flex items-center justify-center w-full p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="text-center">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              ) : (
                <HiPhotograph className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Replace Button */}
      {preview && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-replace-${type}`}
            disabled={isUploading}
          />
          <label htmlFor={`image-replace-${type}`}>
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              asChild
            >
              <div className="cursor-pointer">
                <HiUpload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Replace Image'}
              </div>
            </Button>
          </label>
        </div>
      )}
    </div>
  )
} 