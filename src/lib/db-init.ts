import prisma from './prisma'
import bcrypt from 'bcryptjs'
import { MAIN_SHOWCASE_DOMAINS, syncDummyDomainsWithRealCount } from './demo-domains'

let isInitialized = false

export async function ensureDatabaseReady() {
  if (isInitialized) return
  isInitialized = true

  try {
    // 1. Create tables if not exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "avatar" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Setting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Setting_key_key" ON "Setting"("key");`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Listing" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "imageUrl" TEXT,
        "videoUrl" TEXT,
        "websiteUrl" TEXT,
        "domain" TEXT,
        "clicks" INTEGER NOT NULL DEFAULT 0,
        "startingBid" INTEGER NOT NULL DEFAULT 0,
        "currentBid" INTEGER NOT NULL DEFAULT 0,
        "currentBidderId" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "endsAt" DATETIME NOT NULL,
        "createdById" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Bid" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "amount" INTEGER NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "position" INTEGER,
        "listingId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Payment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "razorpayOrderId" TEXT NOT NULL,
        "razorpayPaymentId" TEXT,
        "razorpaySignature" TEXT,
        "amount" INTEGER NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "userId" TEXT NOT NULL,
        "bidId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Visit" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "listingId" TEXT NOT NULL,
        "ip" TEXT,
        "userAgent" TEXT,
        "referer" TEXT,
        "country" TEXT,
        "city" TEXT,
        "device" TEXT,
        "browser" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Ensure all columns exist on Listing
    try {
      const listingCols = await prisma.$queryRawUnsafe<any[]>(`PRAGMA table_info("Listing");`)
      const colNames = Array.isArray(listingCols) ? listingCols.map(c => c.name) : []
      for (const col of ['videoUrl', 'targetUrl', 'websiteUrl', 'domain', 'imageUrl', 'status']) {
        if (!colNames.includes(col)) {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Listing" ADD COLUMN "${col}" TEXT;`).catch(() => {})
        }
      }
    } catch (e) {
      // Ignore if already altered
    }

    // Ensure geo columns exist on Visit for real-time tracking
    try {
      const visitCols = await prisma.$queryRawUnsafe<any[]>(`PRAGMA table_info("Visit");`)
      const colNames = Array.isArray(visitCols) ? visitCols.map(c => c.name) : []
      for (const col of ['country', 'city', 'device', 'browser']) {
        if (!colNames.includes(col)) {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Visit" ADD COLUMN "${col}" TEXT;`).catch(() => {})
        }
      }
    } catch (e) {
      // Ignore if already altered
    }

    // 2. Ensure Master Admin exists
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('Monu860@', 10)
      await prisma.user.upsert({
        where: { email: 'support@no1domain.in' },
        update: { password: passwordHash, role: 'ADMIN' },
        create: {
          email: 'support@no1domain.in',
          name: 'MONU AHIRWAR',
          password: passwordHash,
          role: 'ADMIN',
        },
      })
    }

    // 3. Ensure Default Settings exist
    const settingCount = await prisma.setting.count()
    if (settingCount === 0) {
      const defaultSettings = [
        { key: 'currency', value: 'INR' },
        { key: 'currency_symbol', value: '₹' },
        { key: 'top1_increment', value: '50' },
        { key: 'other_position_increment', value: '50' },
        { key: 'minimum_starting_bid', value: '50' },
        { key: 'maximum_bid', value: '10000000' },
        { key: 'payment_gateway', value: 'Razorpay' },
        { key: 'razorpay_key_id', value: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM' },
        { key: 'razorpay_key_secret', value: process.env.RAZORPAY_KEY_SECRET || 'blxpBpB5MQYUrWo35a2ZMPsM' },
        { key: 'upi_id', value: process.env.NEXT_PUBLIC_UPI_ID || 'paytm-7828003666@paytm' },
      ]

      for (const s of defaultSettings) {
        await prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: s,
        })
      }
    } else {
      // Ensure upi_id key exists even in pre-existing settings table
      const existingUpi = await prisma.setting.findUnique({ where: { key: 'upi_id' } })
      if (!existingUpi) {
        await prisma.setting.create({
          data: { key: 'upi_id', value: 'paytm-7828003666@paytm' }
        })
      }

      // Guarantee live Razorpay credentials: auto-heal any obsolete/revoked keys (like Ts1mCDRVp1m6We)
      const existingKeyId = await prisma.setting.findUnique({ where: { key: 'razorpay_key_id' } })
      const isObsoleteKey = !existingKeyId || !existingKeyId.value || existingKeyId.value.includes('Ts1mCDRVp1m6We')
      if (isObsoleteKey) {
        const activeLiveKey = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM').trim()
        await prisma.setting.upsert({
          where: { key: 'razorpay_key_id' },
          update: { value: activeLiveKey },
          create: { key: 'razorpay_key_id', value: activeLiveKey },
        })
      }

      const existingKeySecret = await prisma.setting.findUnique({ where: { key: 'razorpay_key_secret' } })
      const isObsoleteSecret = !existingKeySecret || !existingKeySecret.value || isObsoleteKey
      if (isObsoleteSecret) {
        const activeLiveSecret = (process.env.RAZORPAY_KEY_SECRET || 'blxpBpB5MQYUrWo35a2ZMPsM').trim()
        await prisma.setting.upsert({
          where: { key: 'razorpay_key_secret' },
          update: { value: activeLiveSecret },
          create: { key: 'razorpay_key_secret', value: activeLiveSecret },
        })
      }

      // Ensure baseline live stats: at least 11563 views (never reset backwards)
      const viewsSetting = await prisma.setting.findUnique({ where: { key: 'total_site_views' } })
      const currentViews = parseInt(viewsSetting?.value || '0', 10)
      if (!viewsSetting || isNaN(currentViews) || currentViews < 11563) {
        await prisma.setting.upsert({
          where: { key: 'total_site_views' },
          update: { value: '11563' },
          create: { key: 'total_site_views', value: '11563' },
        })
      }

      const visitorsSetting = await prisma.setting.findUnique({ where: { key: 'today_site_visitors' } })
      if (!visitorsSetting) {
        await prisma.setting.create({
          data: { key: 'today_site_visitors', value: '26' },
        })
      }
    }

    // Ensure #20 showcase domain is x.com
    await prisma.listing.updateMany({
      where: { domain: 'easemytrip.com' },
      data: {
        title: 'x.com',
        domain: 'x.com',
        websiteUrl: 'https://x.com',
        category: 'Media & Entertainment',
        description: 'The global digital town square for breaking news, live real-time conversations, and trending community topics.',
        imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://x.com&size=128',
      }
    }).catch(() => {})

    // Ensure #4 showcase domain is amazon.in
    await prisma.listing.updateMany({
      where: { domain: 'inc42.com' },
      data: {
        title: 'amazon.in',
        domain: 'amazon.in',
        websiteUrl: 'https://www.amazon.in',
        category: 'Ecommerce & Retail',
        description: "India's premier online marketplace for electronics, fashion, groceries, home appliances, and daily essentials.",
        imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.in&size=128',
      }
    }).catch(() => {})

    // Ensure all listings are real/ACTIVE (no DEMO)
    await prisma.listing.updateMany({
      where: { status: 'DEMO' },
      data: { status: 'ACTIVE' }
    }).catch(() => {})

    // Ensure all real showcase domains are seeded if Listing table has fewer than 20 domains
    const listingCount = await prisma.listing.count()
    if (listingCount < 20) {
      const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
      const adminId = adminUser ? adminUser.id : 'admin_default'
      for (const d of MAIN_SHOWCASE_DOMAINS) {
        const exists = await prisma.listing.findFirst({ where: { domain: d.domain } })
        if (!exists) {
          await prisma.listing.create({
            data: {
              title: d.title,
              domain: d.domain,
              websiteUrl: d.websiteUrl,
              category: d.category,
              currentBid: d.tier,
              startingBid: 50,
              clicks: d.clicks || 100,
              description: d.description,
              status: 'ACTIVE',
              imageUrl: d.imageUrl,
              endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              createdById: adminId,
            }
          }).catch(() => {})
        }
      }
    }

    // 5. Ensure DEMO showcase domains only exist up to needed slots (6 - realListings)
    await syncDummyDomainsWithRealCount()
  } catch (err) {
    console.error('Database auto-initialization warning:', err)
  }
}
