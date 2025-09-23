// Image Performance Test Script
// Run this in your browser console on the main page

function testImagePerformance() {
  console.log('🧪 Testing Image Performance...\n')
  
  // Find all images on the page
  const images = Array.from(document.querySelectorAll('img'))
  const heroImage = images.find(img => img.alt === 'Shagun Khare')
  
  if (heroImage) {
    console.log('📸 Hero Image Found:')
    console.log('  Source:', heroImage.src)
    console.log('  Natural Size:', heroImage.naturalWidth + 'x' + heroImage.naturalHeight)
    console.log('  Displayed Size:', heroImage.offsetWidth + 'x' + heroImage.offsetHeight)
    console.log('  Loading:', heroImage.loading)
    console.log('')
  }
  
  // Test image loading times
  async function testImageLoad(src) {
    const start = performance.now()
    const img = new Image()
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const end = performance.now()
        const size = img.naturalWidth * img.naturalHeight * 4 / 1024 // Rough size estimate in KB
        resolve({
          url: src,
          loadTime: Math.round(end - start),
          dimensions: `${img.naturalWidth}x${img.naturalHeight}`,
          estimatedSize: Math.round(size) + 'KB'
        })
      }
      img.onerror = () => reject(new Error('Failed to load'))
      img.src = src
    })
  }
  
  // Test all images
  Promise.all(images.map(img => testImageLoad(img.src).catch(e => ({ url: img.src, error: e.message }))))
    .then(results => {
      console.log('📊 Image Loading Results:')
      console.table(results.map(r => ({
        url: r.url.split('/').pop()?.substring(0, 30) + '...',
        loadTime: r.loadTime ? r.loadTime + 'ms' : 'Error',
        dimensions: r.dimensions || 'N/A',
        size: r.estimatedSize || 'N/A'
      })))
      
      const heroResult = results.find(r => r.url.includes('profile') || r.url.includes('headshot'))
      if (heroResult && heroResult.loadTime) {
        console.log(`\n🎯 Hero Image Performance: ${heroResult.loadTime}ms`)
        if (heroResult.loadTime < 300) {
          console.log('✅ Excellent! Under 300ms')
        } else if (heroResult.loadTime < 500) {
          console.log('✅ Good! Under 500ms')  
        } else {
          console.log('⚠️ Could be better. Over 500ms')
        }
      }
    })
}

// Run the test
testImagePerformance()

console.log(`
🔧 Performance Tips:
- Check Network tab for actual download sizes
- Look for "Direct M" or "Direct D" indicators (dev mode)
- Mobile should load smaller images automatically
- Preload should eliminate most loading time

📱 Mobile Test:
- Resize window to less than 768px to test mobile optimization
- Should see "Direct M" indicator in dev mode
- Should load smaller, faster images
`)
