const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('Setting amazon.in to Rank 1 with ₹1050 bid...')

  // 1. Update Listing table
  const amazon = await prisma.listing.findFirst({
    where: { domain: 'amazon.in' }
  })

  if (amazon) {
    const updated = await prisma.listing.update({
      where: { id: amazon.id },
      data: {
        currentBid: 1050,
        startingBid: 1050,
        status: 'ACTIVE',
      }
    })
    console.log('Updated amazon.in listing:', updated.id, 'currentBid:', updated.currentBid)

    // Check if there is an existing bid or create a top bid for amazon.in
    const existingBid = await prisma.bid.findFirst({
      where: { listingId: amazon.id },
      orderBy: { amount: 'desc' }
    })

    if (existingBid) {
      await prisma.bid.update({
        where: { id: existingBid.id },
        data: {
          amount: 1050,
          status: 'PAID',
          position: 1,
        }
      })
      console.log('Updated existing bid to 1050')
    } else {
      await prisma.bid.create({
        data: {
          listingId: amazon.id,
          userId: amazon.createdById || 'user_admin',
          amount: 1050,
          status: 'PAID',
          position: 1,
        }
      })
      console.log('Created new top bid 1050 for amazon.in')
    }
  } else {
    console.log('amazon.in not found, creating listing...')
    await prisma.listing.create({
      data: {
        title: 'amazon.in',
        domain: 'amazon.in',
        websiteUrl: 'https://www.amazon.in',
        category: 'Ecommerce & Retail',
        currentBid: 1050,
        startingBid: 1050,
        clicks: 529,
        status: 'ACTIVE',
        description: "India's premier online marketplace for electronics, fashion, groceries, home appliances, and daily essentials.",
        imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.in&size=128',
      }
    })
    console.log('Created amazon.in listing with 1050')
  }

  // Verify rank ordering of all listings
  const topListings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { currentBid: 'desc' },
    take: 5
  })
  console.log('\nTop 5 Listings now:')
  topListings.forEach((l, idx) => console.log(`#${idx + 1}: ${l.domain} - ₹${l.currentBid}`))

  await prisma.$disconnect()

  // 2. Sync database files
  const root = path.resolve(__dirname, '..')
  const rootDb = path.join(root, 'dev.db')
  const prismaDb = path.join(root, 'prisma', 'dev.db')
  const seedDb = path.join(root, 'prisma', 'seed_initial.db')

  if (fs.existsSync(rootDb)) {
    fs.copyFileSync(rootDb, prismaDb)
    fs.copyFileSync(rootDb, seedDb)
    console.log('Synced dev.db to prisma/dev.db and prisma/seed_initial.db')
  }
}

main().catch(console.error)
