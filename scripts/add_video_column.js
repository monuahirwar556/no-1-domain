const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "Listing" ADD COLUMN "videoUrl" TEXT;')
    console.log('Successfully added videoUrl column to Listing table.')
  } catch (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('videoUrl column already exists.')
    } else {
      console.error('Error adding column:', err.message)
    }
  }
}

main().finally(() => prisma.$disconnect())
