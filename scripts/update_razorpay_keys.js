const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const keyId = 'rzp_live_TtJd2an6QYjilM'
  const keySecret = 'blxpBpB5MQYUrWo35a2ZMPsM'

  await prisma.setting.upsert({
    where: { key: 'razorpay_key_id' },
    update: { value: keyId },
    create: { key: 'razorpay_key_id', value: keyId },
  })

  await prisma.setting.upsert({
    where: { key: 'razorpay_key_secret' },
    update: { value: keySecret },
    create: { key: 'razorpay_key_secret', value: keySecret },
  })

  await prisma.setting.upsert({
    where: { key: 'total_site_views' },
    update: { value: '11563' },
    create: { key: 'total_site_views', value: '11563' },
  })

  await prisma.setting.upsert({
    where: { key: 'today_site_visitors' },
    update: { value: '26' },
    create: { key: 'today_site_visitors', value: '26' },
  })

  // Ensure #4 is amazon.in
  const inc42 = await prisma.listing.findFirst({
    where: { OR: [{ domain: 'inc42.com' }, { domain: 'amazon.in' }] },
  })
  if (inc42) {
    await prisma.listing.update({
      where: { id: inc42.id },
      data: {
        title: 'amazon.in',
        domain: 'amazon.in',
        websiteUrl: 'https://www.amazon.in',
        category: 'Ecommerce & Retail',
        currentBid: 850,
        startingBid: 850,
        imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.in&size=128',
      },
    })
  }

  const settings = await prisma.setting.findMany()
  console.log('--- VERIFIED SETTINGS ---')
  settings.forEach((s) => console.log(`${s.key}: ${s.value}`))

  const listings = await prisma.listing.findMany()
  console.log('--- VERIFIED LISTINGS ---')
  listings.forEach((l) => console.log(`${l.domain} | status: ${l.status} | bid: ${l.currentBid}`))

  // Ensure dev.db and seed_initial.db are copies of prisma/dev.db
  const prismaDb = path.join(__dirname, '..', 'prisma', 'dev.db')
  const rootDb = path.join(__dirname, '..', 'dev.db')
  const seedDb = path.join(__dirname, '..', 'prisma', 'seed_initial.db')
  if (fs.existsSync(prismaDb)) {
    fs.copyFileSync(prismaDb, rootDb)
    fs.copyFileSync(prismaDb, seedDb)
    console.log('Synced prisma/dev.db to dev.db and prisma/seed_initial.db')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

