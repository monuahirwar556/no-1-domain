const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDetails() {
  const listings = await prisma.listing.findMany({
    include: { bids: true }
  })
  const payments = await prisma.payment.findMany()
  console.log('Listings:', JSON.stringify(listings, null, 2))
  console.log('Payments:', JSON.stringify(payments, null, 2))
}

checkDetails().finally(() => prisma.$disconnect())
