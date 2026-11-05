const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  const settings = await prisma.setting.findMany()
  console.log('Settings:', settings)
  const listings = await prisma.listing.findMany()
  console.log('Listings count:', listings.length)
  listings.forEach(l => console.log('Listing:', l.id, l.domain, l.status, l.currentBid))
}

check().finally(() => prisma.$disconnect())
