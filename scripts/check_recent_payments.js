const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { bid: true }
  })
  console.log('--- RECENT PAYMENTS ---')
  console.log(JSON.stringify(payments, null, 2))

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log('--- RECENT LISTINGS ---')
  console.log(JSON.stringify(listings, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
