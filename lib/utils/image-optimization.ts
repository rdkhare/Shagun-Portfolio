/**
 * Image optimization utilities for better loading performance
 */

// Specialized optimization for hero headshot images with multiple resolutions
export async function optimizeHeroImage(file: File): Promise<{
  mobile: File;
  desktop: File;
}> {
  const [mobileFile, desktopFile] = await Promise.all([
    optimizeImageForUpload(file, 400, 500, 0.7), // Aggressive optimization for mobile
    optimizeImageForUpload(file, 600, 750, 0.75)  // Slightly larger for desktop
  ])
  
  return {
    mobile: mobileFile,
    desktop: desktopFile
  }
}

// Compress and resize image before upload
export async function optimizeImageForUpload(file: File, maxWidth: number = 1200, maxHeight: number = 1500, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const aspectRatio = img.width / img.height
      let newWidth = img.width
      let newHeight = img.height
      
      if (newWidth > maxWidth) {
        newWidth = maxWidth
        newHeight = newWidth / aspectRatio
      }
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight
        newWidth = newHeight * aspectRatio
      }
      
      // Set canvas dimensions
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Draw and compress
      ctx!.drawImage(img, 0, 0, newWidth, newHeight)
      
      canvas.toBlob((blob) => {
        if (blob) {
          // Create new file with optimized blob
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(optimizedFile)
        } else {
          resolve(file) // Fallback to original if optimization fails
        }
      }, 'image/jpeg', quality)
    }
    
    img.onerror = () => {
      resolve(file) // Fallback to original if image loading fails
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Generate blur placeholder data URL from image file
export async function generateBlurDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Create tiny version (10x10px) for blur placeholder
      canvas.width = 10
      canvas.height = 10
      
      ctx!.drawImage(img, 0, 0, 10, 10)
      
      const dataURL = canvas.toDataURL('image/jpeg', 0.1)
      resolve(dataURL)
    }
    
    img.onerror = () => {
      // Fallback blur placeholder
      resolve('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==')
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Check if image optimization is supported
export function supportsImageOptimization(): boolean {
  return typeof document !== 'undefined' && !!document.createElement('canvas').getContext
}
