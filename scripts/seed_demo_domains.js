const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log('Seeding demo showcase domains...')
    let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: 'support@dukanrant.com',
          name: 'MONU AHIRWAR',
          password: 'demo_password',
          role: 'ADMIN',
        },
      })
      console.log('Created admin user:', admin.email)
    }

    const demoDomains = [
      {
        title: 'CryptoIndia — Leading Web3 Portal',
        domain: 'cryptoindia.in',
        websiteUrl: 'https://cryptoindia.in',
        category: 'Finance & Banking',
        currentBid: 300,
        startingBid: 50,
        clicks: 342,
        description: "India's fastest cryptocurrency news, coin analysis and Web3 community directory.",
        status: 'DEMO',
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: 'BharatMart — Pan-India Wholesale',
        domain: 'bharatmart.com',
        websiteUrl: 'https://bharatmart.com',
        category: 'Ecommerce & Retail',
        currentBid: 250,
        startingBid: 50,
        clicks: 218,
        description: 'Direct B2B wholesale marketplace connecting Indian artisans and regional retailers.',
        status: 'DEMO',
        endsAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: 'TechStartup — Ecosystem Radar',
        domain: 'techstartup.in',
        websiteUrl: 'https://techstartup.in',
        category: 'Tech & Software',
        currentBid: 200,
        startingBid: 50,
        clicks: 154,
        description: 'Curated ecosystem tracking high-growth early-stage Indian SaaS and AI startups.',
        status: 'DEMO',
        endsAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: 'QuickLoans — Instant Credit Compare',
        domain: 'quickloans.co.in',
        websiteUrl: 'https://quickloans.co.in',
        category: 'Finance & Banking',
        currentBid: 150,
        startingBid: 50,
        clicks: 96,
        description: 'Transparent personal and MSME loan comparison aggregator with zero hidden fees.',
        status: 'DEMO',
        endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: 'CloudHost — Ultra-Fast Cloud VPS',
        domain: 'cloudhost.in',
        websiteUrl: 'https://cloudhost.in',
        category: 'Tech & Software',
        currentBid: 100,
        startingBid: 50,
        clicks: 64,
        description: 'High-speed Indian NVMe cloud server hosting and managed Linux infrastructure.',
        status: 'DEMO',
        endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: 'MediCare24 — Tele-Health & Pharmacy',
        domain: 'medicare24.in',
        websiteUrl: 'https://medicare24.in',
        category: 'Healthcare & Pharma',
        currentBid: 50,
        startingBid: 50,
        clicks: 38,
        description: '24/7 verified online medicine delivery and certified doctor tele-consultations.',
        status: 'DEMO',
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
    ]

    for (const d of demoDomains) {
      const existing = await prisma.listing.findFirst({ where: { domain: d.domain } })
      if (!existing) {
        await prisma.listing.create({ data: d })
        console.log(`Created demo listing: ${d.domain} (Bid: ₹${d.currentBid}, Status: DEMO)`)
      } else {
        await prisma.listing.update({
          where: { id: existing.id },
          data: {
            title: d.title,
            currentBid: d.currentBid,
            clicks: d.clicks,
            status: 'DEMO',
          },
        })
        console.log(`Updated demo listing: ${d.domain} (Bid: ₹${d.currentBid}, Status: DEMO)`)
      }
    }

    const total = await prisma.listing.count()
    console.log(`Total listings in database now: ${total}`)

    // Sync database files
    const root = path.resolve(__dirname, '..')
    const rootDb = path.join(root, 'dev.db')
    const prismaDb = path.join(root, 'prisma', 'dev.db')
    if (fs.existsSync(prismaDb)) {
      fs.copyFileSync(prismaDb, rootDb)
      console.log('Synced prisma/dev.db to root dev.db')
    }
  } catch (err) {
    console.error('Seed error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
