// Simple test script to debug database connection and seeding
import { seedDatabase } from './lib/db/seed.js'

async function testSeed() {
  console.log('Starting seed test...')
  
  try {
    await seedDatabase()
    console.log('Seed completed successfully!')
  } catch (error) {
    console.error('Seed failed with error:', error)
    console.error('Error stack:', error.stack)
  }
}

testSeed()
