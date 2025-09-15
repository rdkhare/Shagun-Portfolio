"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { HiSave, HiUpload, HiPhotograph } from 'react-icons/hi'
import { Notification, useNotification } from '@/components/ui/notification'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

const profileSchema = z.object({
  heroBio: z.string().optional(),
  aboutBio: z.string().optional(),
  footerBio: z.string().optional(),
  headshotImage: z.string().optional(),
  aboutImage: z.string().optional(),
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
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null)
  const [aboutImagePreview, setAboutImagePreview] = useState<string>('')
  const [imageInputMode, setPhotographInputMode] = useState<'upload' | 'url'>('upload')
  const [aboutImageInputMode, setAboutImageInputMode] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setPhotographUrl] = useState<string>('')
  const [aboutImageUrl, setAboutImageUrl] = useState<string>('')
  const [isPhotographUploading, setIsPhotographUploading] = useState(false)
  const [isAboutImageUploading, setIsAboutImageUploading] = useState(false)
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
      heroBio: '',
      aboutBio: '',
      footerBio: '',
      headshotImage: '',
      aboutImage: '',
      socialLinks: '{}',
      contactEmail: '',
      location: '',
      tagline: '',
    },
  })

  // Watch values for rich text editors
  const heroBio = watch('heroBio')
  const aboutBio = watch('aboutBio')  
  const footerBio = watch('footerBio')

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
        setValue('heroBio', profile.heroBio || '')
        setValue('aboutBio', profile.aboutBio || '')
        setValue('footerBio', profile.footerBio || '')
        setValue('headshotImage', profile.headshotImage || '')
        setValue('aboutImage', profile.aboutImage || '')
        setValue('socialLinks', profile.socialLinks || '{}')
        setValue('contactEmail', profile.contactEmail || '')
        setValue('location', profile.location || '')
        setValue('tagline', profile.tagline || '')
        
        // Set headshot preview
        if (profile.headshotImage) {
          setHeadshotPreview(profile.headshotImage)
          setPhotographUrl(profile.headshotImage)
          if (profile.headshotImage.startsWith('http')) {
            setPhotographInputMode('url')
          }
        }

        // Set about image preview
        if (profile.aboutImage) {
          setAboutImagePreview(profile.aboutImage)
          setAboutImageUrl(profile.aboutImage)
          if (profile.aboutImage.startsWith('http')) {
            setAboutImageInputMode('url')
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

  const handleHeadshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'File Too Large', 'Please select an image smaller than 5MB.')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Invalid File Type', 'Please select an image file.')
        return
      }

      setHeadshotFile(file)
      setIsPhotographUploading(true)

      // Create immediate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setHeadshotPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      try {
        // Upload immediately for better UX
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'profile')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || 'Failed to upload image')
        }

        const uploadResult = await uploadResponse.json()
        
        // Update preview with actual uploaded URL
        setHeadshotPreview(uploadResult.url)
        setPhotographUrl(uploadResult.url)
        setValue('headshotImage', uploadResult.url)
        
        showNotification('success', 'Image Uploaded', 'Your headshot has been uploaded successfully.')
      } catch (error) {
        console.error('Upload error:', error)
        showNotification(
          'error',
          'Upload Failed',
          error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
        )
        // Reset on error
        setHeadshotFile(null)
        setHeadshotPreview('')
      } finally {
        setIsPhotographUploading(false)
      }
    }
  }

  const handlePhotographUrlChange = (url: string) => {
    setPhotographUrl(url)
    setHeadshotPreview(url)
    setHeadshotFile(null)
  }

  const handleModeSwitch = (mode: 'upload' | 'url') => {
    setPhotographInputMode(mode)
    if (mode === 'upload') {
      setPhotographUrl('')
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

  const handleAboutImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'File Too Large', 'Please select an image smaller than 5MB.')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Invalid File Type', 'Please select an image file.')
        return
      }

      setAboutImageFile(file)
      setIsAboutImageUploading(true)

      try {
        // Upload the file
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()
        const imageUrl = result.url

        // Set preview and form value
        setAboutImagePreview(imageUrl)
        setValue('aboutImage', imageUrl)
        
        showNotification('success', 'Image Uploaded', 'About page image has been uploaded successfully.')
      } catch (error) {
        console.error('Upload error:', error)
        showNotification('error', 'Upload Failed', error instanceof Error ? error.message : 'Failed to upload image')
      } finally {
        setIsAboutImageUploading(false)
      }
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)

      // Image is already uploaded when selected, just use the current values
      if (imageInputMode === 'url' && imageUrl) {
        data.headshotImage = imageUrl
      }
      if (aboutImageInputMode === 'url' && aboutImageUrl) {
        data.aboutImage = aboutImageUrl
      }
      // For upload mode, the image URL is already set in the form via setValue()

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
                    <label htmlFor="heroBio" className="block text-sm font-medium mb-2">
                      Hero Section Bio
                    </label>
                    <RichTextEditor
                      value={heroBio}
                      onChange={(value) => setValue('heroBio', value)}
                      placeholder="Brief bio for your homepage hero section..."
                      className="min-h-[200px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This bio appears in your homepage hero section. You can use bold, italic, and underline formatting.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="aboutBio" className="block text-sm font-medium mb-2">
                      About Page Bio
                    </label>
                    <RichTextEditor
                      value={aboutBio}
                      onChange={(value) => setValue('aboutBio', value)}
                      placeholder="Detailed bio for your about page..."
                      className="min-h-[150px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This detailed bio appears on your about page. You can use bold, italic, and underline formatting.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="footerBio" className="block text-sm font-medium mb-2">
                      Footer Bio
                    </label>
                    <RichTextEditor
                      value={footerBio}
                      onChange={(value) => setValue('footerBio', value)}
                      placeholder="Brief bio for your website footer..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This bio appears in your website footer under your name. You can use bold, italic, and underline formatting.
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
                  <CardTitle>Home Page Headshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* HiPhotograph Preview */}
                  {headshotPreview && (
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                      <img 
                        src={headshotPreview} 
                        alt="Headshot preview" 
                        className="w-full h-full object-cover"
                      />
                      {/* Upload loading overlay */}
                      {isPhotographUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2" />
                            <p className="text-white text-sm">Uploading...</p>
                          </div>
                        </div>
                      )}
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
                      disabled={isPhotographUploading}
                    >
                      <HiUpload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={imageInputMode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleModeSwitch('url')}
                      className="flex-1"
                      disabled={isPhotographUploading}
                    >
                      <HiPhotograph className="w-4 h-4 mr-2" />
                      URL
                    </Button>
                  </div>

                  {/* File HiUpload Mode */}
                  {imageInputMode === 'upload' && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeadshotChange}
                        className="hidden"
                        id="headshot-image"
                        disabled={isPhotographUploading}
                      />
                      <label
                        htmlFor="headshot-image"
                        className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg transition-colors ${
                          isPhotographUploading 
                            ? 'border-muted bg-muted/50 cursor-not-allowed opacity-50' 
                            : 'border-border hover:border-primary bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="text-center">
                          {isPhotographUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Uploading...
                              </p>
                            </>
                          ) : (
                            <>
                              <HiPhotograph className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload headshot
                              </p>
                            </>
                          )}
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
                        onChange={(e) => handlePhotographUrlChange(e.target.value)}
                        placeholder="https://example.com/headshot.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a direct URL to your headshot image
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* About Page Image */}
              <Card>
                <CardHeader>
                  <CardTitle>About Page Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* About Image Preview */}
                  {aboutImagePreview && (
                    <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden relative">
                      <img 
                        src={aboutImagePreview} 
                        alt="About page image preview" 
                        className="w-full h-full object-cover"
                      />
                      {/* Upload loading overlay */}
                      {isAboutImageUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2" />
                            <p className="text-white text-sm">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Input Mode Toggle */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={aboutImageInputMode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAboutImageInputMode('upload')}
                      className="flex-1"
                      disabled={isAboutImageUploading}
                    >
                      <HiUpload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={aboutImageInputMode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAboutImageInputMode('url')}
                      className="flex-1"
                      disabled={isAboutImageUploading}
                    >
                      URL
                    </Button>
                  </div>

                  {/* Upload Input Mode */}
                  {aboutImageInputMode === 'upload' && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAboutImageChange}
                        disabled={isAboutImageUploading}
                        className="sr-only"
                        id="about-image-upload"
                      />
                      <label
                        htmlFor="about-image-upload"
                        className={`flex items-center justify-center w-full border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                          isAboutImageUploading 
                            ? 'border-muted bg-muted/50 cursor-not-allowed opacity-50' 
                            : 'border-border hover:border-primary bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="text-center">
                          {isAboutImageUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Uploading...
                              </p>
                            </>
                          ) : (
                            <>
                              <HiPhotograph className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload about page image
                              </p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  )}

                  {/* URL Input Mode */}
                  {aboutImageInputMode === 'url' && (
                    <div>
                      <Input
                        type="url"
                        value={aboutImageUrl}
                        onChange={(e) => setAboutImageUrl(e.target.value)}
                        placeholder="https://example.com/about-image.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a direct URL to your about page image
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || isPhotographUploading || isAboutImageUploading}
                  className="w-full"
                >
                  {isLoading || isPhotographUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isPhotographUploading ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <HiSave className="w-4 h-4 mr-2" />
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