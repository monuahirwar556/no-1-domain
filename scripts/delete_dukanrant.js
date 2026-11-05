const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Searching for dukanrant.com listings in database...')
  
  const dukanrantListings = await prisma.listing.findMany({
    where: {
      OR: [
        { domain: { contains: 'dukanrant' } },
        { title: { contains: 'Dukanrant' } },
      ]
    }
  })

  console.log(`Found ${dukanrantListings.length} matching listings:`, dukanrantListings.map(l => ({ id: l.id, domain: l.domain, title: l.title })))

  for (const listing of dukanrantListings) {
    // Delete related visits
    const v = await prisma.visit.deleteMany({ where: { listingId: listing.id } })
    console.log(`Deleted ${v.count} visits for ${listing.domain}`)

    // Delete related payments
    const payments = await prisma.payment.findMany({
      where: { bid: { listingId: listing.id } }
    })
    for (const p of payments) {
      await prisma.payment.delete({ where: { id: p.id } })
    }

    // Delete related bids
    const b = await prisma.bid.deleteMany({ where: { listingId: listing.id } })
    console.log(`Deleted ${b.count} bids for ${listing.domain}`)

    // Delete listing
    await prisma.listing.delete({ where: { id: listing.id } })
    console.log(`Deleted listing ${listing.domain} (${listing.id})`)
  }

  const remaining = await prisma.listing.count()
  console.log(`Remaining listings count: ${remaining}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
