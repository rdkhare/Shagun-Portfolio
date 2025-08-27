"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, Upload, Image } from 'lucide-react'
import { Notification, useNotification } from '@/components/ui/notification'

const profileSchema = z.object({
  bio: z.string().optional(),
  headshotImage: z.string().optional(),
  socialLinks: z.string().optional(),
  contactEmail: z.union([z.string().email('Please enter a valid email'), z.literal('')]).optional(),
  location: z.string().optional(),
  tagline: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [headshotFile, setHeadshotFile] = useState<File | null>(null)
  const [headshotPreview, setHeadshotPreview] = useState<string>('')
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const { notification, showNotification, hideNotification } = useNotification()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: '',
      headshotImage: '',
      socialLinks: '{}',
      contactEmail: '',
      location: '',
      tagline: '',
    },
  })

  // Fetch existing profile data
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsFetching(true)
      const response = await fetch('/api/admin/profile')
      
      if (response.ok) {
        const data = await response.json()
        const profile = data.profile
        
        // Set form values
        setValue('bio', profile.bio || '')
        setValue('headshotImage', profile.headshotImage || '')
        setValue('socialLinks', profile.socialLinks || '{}')
        setValue('contactEmail', profile.contactEmail || '')
        setValue('location', profile.location || '')
        setValue('tagline', profile.tagline || '')
        
        // Set headshot preview
        if (profile.headshotImage) {
          setHeadshotPreview(profile.headshotImage)
          setImageUrl(profile.headshotImage)
          if (profile.headshotImage.startsWith('http')) {
            setImageInputMode('url')
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      showNotification('error', 'Failed to load profile', 'Please try again.')
    } finally {
      setIsFetching(false)
    }
  }

  const handleHeadshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeadshotFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setHeadshotPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setHeadshotPreview(url)
    setHeadshotFile(null)
  }

  const handleModeSwitch = (mode: 'upload' | 'url') => {
    setImageInputMode(mode)
    if (mode === 'upload') {
      setImageUrl('')
      if (!headshotFile) {
        setHeadshotPreview('')
      }
    } else {
      setHeadshotFile(null)
      if (!imageUrl) {
        setHeadshotPreview('')
      }
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)

      // Handle headshot image
      if (imageInputMode === 'upload' && headshotFile) {
        setIsUploading(true)
        // For now, we'll use the preview URL. In production, you'd upload to Supabase
        data.headshotImage = headshotPreview
      } else if (imageInputMode === 'url' && imageUrl) {
        data.headshotImage = imageUrl
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }

      showNotification(
        'success',
        'Profile Saved!',
        'Your profile has been updated successfully.',
        3000
      )
    } catch (error) {
      console.error('Error saving profile:', error)
      showNotification(
        'error',
        'Save Failed',
        'There was an error saving your profile. Please try again.',
        5000
      )
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
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

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-light">Edit Profile</h1>
          <p className="text-muted-foreground mt-1">
            Update your bio, headshot, and contact information. Changes will sync across your website.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bio & About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium mb-2">
                      Tagline
                    </label>
                    <Input
                      {...register('tagline')}
                      placeholder="Short tagline for your hero section"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This appears in your hero section
                    </p>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">
                      Bio
                    </label>
                    <Textarea
                      {...register('bio')}
                      placeholder="Tell your story..."
                      rows={8}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This bio will appear on your about page and hero section
                    </p>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <Input
                      {...register('location')}
                      placeholder="e.g., Brooklyn, NY"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium mb-2">
                      Contact Email
                    </label>
                    <Input
                      {...register('contactEmail')}
                      type="email"
                      placeholder="your@email.com"
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Headshot Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  {headshotPreview && (
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={headshotPreview} 
                        alt="Headshot preview" 
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
                      <Image className="w-4 h-4 mr-2" />
                      URL
                    </Button>
                  </div>

                  {/* File Upload Mode */}
                  {imageInputMode === 'upload' && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeadshotChange}
                        className="hidden"
                        id="headshot-image"
                      />
                      <label
                        htmlFor="headshot-image"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-center">
                          <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload headshot
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
                        placeholder="https://example.com/headshot.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a direct URL to your headshot image
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
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
} 