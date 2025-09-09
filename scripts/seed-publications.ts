// Script to seed the publications table with existing publication data
import { db } from '../lib/db/client'
import { publications } from '../lib/db/schema'

const existingPublications = [
  { name: "Domino", logoUrl: "/icons/publications/domino.jpeg", sortOrder: 1 },
  { name: "The Spruce", logoUrl: "/icons/publications/the-spruce.png", sortOrder: 2 },
  { name: "Apartment Therapy", logoUrl: "/icons/publications/at.jpeg", sortOrder: 3 },
  { name: "Martha Stewart Living", logoUrl: "/icons/publications/marthastewart.jpeg", sortOrder: 4 },
  { name: "The Kitchn", logoUrl: "/icons/publications/kitchn.jpeg", sortOrder: 5 },
  { name: "Wine Enthusiast Magazine", logoUrl: "/icons/publications/wine-enthusiast.png", sortOrder: 6 },
  { name: "Yahoo Life", logoUrl: "/icons/publications/yahoo-life.jpg", sortOrder: 7 }
]

async function seedPublications() {
  try {
    console.log('Seeding publications...')
    
    for (const publication of existingPublications) {
      await db.insert(publications).values({
        name: publication.name,
        logoUrl: publication.logoUrl,
        sortOrder: publication.sortOrder,
        isActive: true,
      })
      console.log(`✓ Added ${publication.name}`)
    }
    
    console.log('✅ Publications seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding publications:', error)
  }
}

// Run if called directly
if (require.main === module) {
  seedPublications()
}
