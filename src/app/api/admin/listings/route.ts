import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ensureDatabaseReady } from '@/lib/db-init'
import { syncDummyDomainsWithRealCount, DEMO_SHOWCASE_DOMAINS } from '@/lib/demo-domains'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseReady()
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin session required.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'currentBid'

    const where: any = {
      status: { notIn: ['UNPAID', 'DRAFT'] },
      NOT: {
        AND: [
          { status: 'PENDING' },
          { currentBid: 0 },
        ],
      },
    }
    if (status && status !== 'ALL') where.status = status
    if (category && category !== 'All') where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { domain: { contains: search } },
        { description: { contains: search } },
        { websiteUrl: { contains: search } },
      ]
    }

    const orderBy: any = sortBy === 'createdAt' 
      ? { createdAt: 'desc' } 
      : { currentBid: 'desc' }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        currentBidder: { select: { id: true, name: true, email: true } },
        _count: { select: { bids: true } },
      },
    })

    const DEMO_DOMAINS = DEMO_SHOWCASE_DOMAINS.map((d) => d.domain.toLowerCase())

    const isDemoListing = (_l: any) => false

    const realListings = listings
    const dbDemoListings: any[] = []

    let availableDemoListings: any[] = dbDemoListings
    if (availableDemoListings.length === 0) {
      availableDemoListings = (DEMO_SHOWCASE_DOMAINS as any[]).map((d, i) => ({
        id: `demo_seed_${i + 1}`,
        title: d.title,
        domain: d.domain,
        websiteUrl: d.websiteUrl,
        category: d.category,
        currentBid: d.tier,
        clicks: d.clicks,
        description: d.description,
        status: 'DEMO',
        imageUrl: d.imageUrl,
        videoUrl: d.videoUrl || null,
        createdAt: new Date(),
        currentBidder: null,
      }))
    }

    // Combine real listings first, then pad with remaining dummy items
    const combinedListings = [
      ...realListings,
      ...availableDemoListings.slice(0, Math.max(0, 10 - realListings.length)),
    ]

    // Sort by currentBid descending to calculate live ranking
    const sortedListings = [...combinedListings].sort((a, b) => (b.currentBid || 0) - (a.currentBid || 0))

    const activeListingsWithRanks = sortedListings.map((item, index) => {
      const isDemo = isDemoListing(item)
      const rank = index + 1
      const currentBid = item.currentBid || 50
      let outbidRequired = rank === 1 ? currentBid + 50 : currentBid + 50
      return {
        ...item,
        rank,
        isDemo,
        outbidRequired,
      }
    })

    const top1 = activeListingsWithRanks[0]
    const top1Bid = top1 ? top1.currentBid : 0
    const minBidForTop1 = top1Bid > 0 ? top1Bid + 50 : 50

    return NextResponse.json({
      listings: activeListingsWithRanks,
      totalListings: activeListingsWithRanks.length,
      realListingsCount: realListings.length,
      top1Bid,
      minBidForTop1,
      top1Increment: 50,
      otherIncrement: 50,
      totalClicks: activeListingsWithRanks.reduce((acc, l) => acc + (l.clicks || 0), 0),
      totalValue: activeListingsWithRanks.reduce((acc, l) => acc + (l.currentBid || 0), 0),
    })
  } catch (error: any) {
    console.error('Admin listings fetch error:', error)
    return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseReady()
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin session required.' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      domain, 
      websiteUrl, 
      description, 
      category, 
      imageUrl, 
      videoUrl,
      currentBid, 
      startingBid, 
      clicks, 
      status,
    } = body

    let cleanDomain = domain ? domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').replace(/\s+/g, '') : ''
    let cleanUrl = websiteUrl ? websiteUrl.trim() : (cleanDomain ? `https://${cleanDomain}` : '')
    if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl
    }
    if (!cleanDomain && cleanUrl) {
      try {
        cleanDomain = new URL(cleanUrl).hostname.replace(/^www\./, '').replace(/\s+/g, '')
      } catch {
        cleanDomain = 'domain.com'
      }
    }

    if (!cleanDomain) {
      return NextResponse.json({ message: 'Valid domain name is required' }, { status: 400 })
    }

    const brandName = cleanDomain.split('.')[0].charAt(0).toUpperCase() + cleanDomain.split('.')[0].slice(1)
    const finalTitle = title?.trim() || brandName || cleanDomain

    // Get admin user as creator
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })
    if (!adminUser) {
      adminUser = await prisma.user.findFirst()
    }
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'support@no1domain.in',
          name: 'MONU AHIRWAR',
          password: 'admin_secure_password',
          role: 'ADMIN',
        },
      })
    }

    const parsedBid = parseInt(currentBid) || parseInt(startingBid) || 50
    const parsedClicks = parseInt(clicks) || 0
    const defaultImg = imageUrl || `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(cleanUrl || `https://${cleanDomain}`)}&size=128`
    const defaultCategory = category || 'Ecommerce & Retail'

    // Upsert domain so adding an existing domain updates it rather than failing
    const existing = await prisma.listing.findFirst({
      where: { domain: cleanDomain },
    })

    let listing
    if (existing) {
      listing = await prisma.listing.update({
        where: { id: existing.id },
        data: {
          title: finalTitle,
          domain: cleanDomain,
          websiteUrl: cleanUrl,
          description: description || `Verified showcase and services for ${cleanDomain}.`,
          category: defaultCategory,
          imageUrl: defaultImg,
          currentBid: parsedBid,
          startingBid: parsedBid,
          clicks: parsedClicks,
          status: status || 'ACTIVE',
        },
      })
    } else {
      listing = await prisma.listing.create({
        data: {
          title: finalTitle,
          domain: cleanDomain,
          websiteUrl: cleanUrl,
          videoUrl: videoUrl || null,
          description: description || `Verified showcase and services for ${cleanDomain}.`,
          category: defaultCategory,
          imageUrl: defaultImg,
          startingBid: parsedBid,
          currentBid: parsedBid,
          clicks: parsedClicks,
          status: status || 'ACTIVE',
          endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdById: adminUser.id,
          currentBidderId: adminUser.id,
        },
      })
    }

    // Auto-sync active database across dev.db and prisma/dev.db immediately
    try {
      const fs = require('fs')
      const path = require('path')
      const prismaDb = path.join(process.cwd(), 'prisma', 'dev.db')
      const rootDb = path.join(process.cwd(), 'dev.db')
      const seedDb = path.join(process.cwd(), 'prisma', 'seed_initial.db')
      if (fs.existsSync(prismaDb)) {
        fs.copyFileSync(prismaDb, rootDb)
        fs.copyFileSync(prismaDb, seedDb)
      } else if (fs.existsSync(rootDb)) {
        fs.copyFileSync(rootDb, prismaDb)
        fs.copyFileSync(rootDb, seedDb)
      }
    } catch (e) {
      // Sync notice ignored
    }

    return NextResponse.json(listing, { status: 201 })
  } catch (error: any) {
    console.error('Create listing error:', error)
    return NextResponse.json({ message: 'Failed to create listing: ' + (error.message || 'Unknown error') }, { status: 500 })
  }
}