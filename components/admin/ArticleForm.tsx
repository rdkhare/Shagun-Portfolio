"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Save, Eye, Trash2, Link2, Image } from 'lucide-react'
import { uploadFile } from '@/lib/storage/supabase'
import { Article } from '@/lib/db/schema'
import { Notification, useNotification } from '@/components/ui/notification'

// Form validation schema
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  externalUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  publisher: z.string().min(1, 'Publisher is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().optional(), // Optional for external articles
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  article?: Article
  onSave: (data: ArticleFormData) => Promise<void>
  onDelete?: () => Promise<void>
  isLoading?: boolean
}

export default function ArticleForm({ article, onSave, onDelete, isLoading }: ArticleFormProps) {
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const { notification, showNotification, hideNotification } = useNotification()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      externalUrl: article?.externalUrl || '',
      publisher: article?.publisher || '',
      category: article?.category || '',
      content: article?.content || '',
      excerpt: article?.excerpt || '',
      coverImage: article?.coverImage || '',
      status: article?.status || 'draft',
      featured: article?.featured || false,
    },
  })

  // Common categories for articles
  const predefinedCategories = [
    'Home Tours',
    'Designer Features', 
    'Expert Insights',
    'Commerce',
    'Gardens & Plants',
    'Cleaning & Organizing',
    'Food & Wine'
  ]

  const watchTitle = watch('title')

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && !article) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setValue('slug', slug)
    }
  }, [watchTitle, article, setValue])

  // Set cover image preview and mode
  useEffect(() => {
    if (article?.coverImage) {
      setCoverImagePreview(article.coverImage)
      setImageUrl(article.coverImage)
      // If it's a URL, set mode to URL
      if (article.coverImage.startsWith('http')) {
        setImageInputMode('url')
      }
    }
  }, [article])

  // Check if current category is custom (not in predefined list)
  useEffect(() => {
    if (article?.category && !predefinedCategories.includes(article.category)) {
      setShowCustomCategory(true)
      setCustomCategory(article.category)
    }
  }, [article])

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setCoverImagePreview(url)
    // Clear file if user switches to URL
    setCoverImageFile(null)
  }

  const handleModeSwitch = (mode: 'upload' | 'url') => {
    setImageInputMode(mode)
    if (mode === 'upload') {
      setImageUrl('')
      if (!coverImageFile) {
        setCoverImagePreview('')
      }
    } else {
      setCoverImageFile(null)
      if (!imageUrl) {
        setCoverImagePreview('')
      }
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true)
      setCustomCategory('')
      setValue('category', '')
    } else {
      setShowCustomCategory(false)
      setCustomCategory('')
      setValue('category', value)
    }
  }

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value)
    setValue('category', value)
  }

  const onSubmit = async (data: ArticleFormData) => {
    try {
      // Handle cover image based on input mode
      if (imageInputMode === 'upload' && coverImageFile) {
        setIsUploading(true)
        const timestamp = Date.now()
        const filename = `${timestamp}-${coverImageFile.name}`
        const uploadResult = await uploadFile(coverImageFile, filename)
        data.coverImage = uploadResult.url
      } else if (imageInputMode === 'url' && imageUrl) {
        data.coverImage = imageUrl
      }

      await onSave(data)
      
      // Show success notification
      showNotification(
        'success',
        'Article Saved!',
        `Your article "${data.title}" has been saved successfully.`,
        3000
      )
    } catch (error) {
      console.error('Error saving article:', error)
      
      // Show error notification
      showNotification(
        'error',
        'Save Failed',
        'There was an error saving your article. Please try again.',
        5000
      )
    } finally {
      setIsUploading(false)
    }
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

    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-light">
          {article ? 'Edit Article' : 'Create New Article'}
        </h1>
        <div className="flex gap-2">
          {article && onDelete && (
            <Button 
              variant="destructive" 
              onClick={onDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="Enter article title"
                    className="text-lg"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-2">
                    Slug *
                  </label>
                  <Input
                    {...register('slug')}
                    placeholder="article-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="externalUrl" className="block text-sm font-medium mb-2">
                    Article URL
                  </label>
                  <Input
                    {...register('externalUrl')}
                    placeholder="https://example.com/article-link"
                    type="url"
                  />
                  {errors.externalUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.externalUrl.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to the article on the publisher's website
                  </p>
                </div>

                <div>
                  <label htmlFor="publisher" className="block text-sm font-medium mb-2">
                    Publisher *
                  </label>
                  <Input
                    {...register('publisher')}
                    placeholder="e.g., The Washington Post, TechCrunch, Wired"
                  />
                  {errors.publisher && (
                    <p className="text-red-500 text-sm mt-1">{errors.publisher.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <Select 
                    defaultValue={showCustomCategory ? 'custom' : watch('category')} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">+ Add Custom Category</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {showCustomCategory && (
                    <div className="mt-2">
                      <Input
                        value={customCategory}
                        onChange={(e) => handleCustomCategoryChange(e.target.value)}
                        placeholder="Enter custom category name"
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    {...register('excerpt')}
                    placeholder="Brief description or summary of the article"
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    {...register('content')}
                    placeholder="Any additional notes or content..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional field for internal notes or additional context
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <Select 
                    defaultValue={watch('status')} 
                    onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured"
                    {...register('featured')}
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Article
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Preview */}
                {coverImagePreview && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Input Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageInputMode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeSwitch('upload')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant={imageInputMode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeSwitch('url')}
                    className="flex-1"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    URL
                  </Button>
                </div>

                {/* File Upload Mode */}
                {imageInputMode === 'upload' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      id="cover-image"
                    />
                    <label
                      htmlFor="cover-image"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload cover image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {/* URL Input Mode */}
                {imageInputMode === 'url' && (
                  <div>
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a direct URL to an image
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button 
                type="submit" 
                disabled={isLoading || isUploading}
                className="w-full"
              >
                {isLoading || isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isUploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Article
                  </>
                )}
              </Button>
              
              {watch('slug') && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.open(`/articles/${watch('slug')}`, '_blank')}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}
