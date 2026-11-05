import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { createRazorpayOrder } from '@/lib/razorpay'
import { DEMO_SHOWCASE_DOMAINS, MAIN_SHOWCASE_DOMAINS } from '@/lib/demo-domains'
import { ensureDatabaseReady } from '@/lib/db-init'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseReady()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const period = searchParams.get('period') || 'all'

    const where: any = {
      status: { in: ['ACTIVE', 'DEMO'] },
    }
    if (category && category !== 'All') {
      where.category = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { domain: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const settings = await getSettings()

    const listings = await prisma.listing.findMany({
      where,
      orderBy: [
        { currentBid: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        currentBidder: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    const isCategoryFilter = Boolean(category && category !== 'All')
    const MAIN_INDEX_MAP = new Map(MAIN_SHOWCASE_DOMAINS.map((d, i) => [d.domain.toLowerCase(), i]))
    const DEMO_INDEX_MAP = new Map(DEMO_SHOWCASE_DOMAINS.map((d, i) => [d.domain.toLowerCase(), i]))

    const categoryMatchedShowcase = isCategoryFilter
      ? DEMO_SHOWCASE_DOMAINS.filter(
          (d) => d.category.toLowerCase().trim() === category!.toLowerCase().trim()
        )
      : MAIN_SHOWCASE_DOMAINS

    // All listings are real active listings
    const isDemoListing = (_l: any) => false

    // In "All" view, show all listings (top 20 main showcase domains followed by all supplementary & user domains)
    const displayListings = listings

    const fallbackShowcase = (categoryMatchedShowcase as any[]).map((d) => ({
      id: `showcase_${d.domain.replace(/[^a-z0-9]/gi, '_')}`,
      title: d.title,
      domain: d.domain,
      websiteUrl: d.websiteUrl,
      category: d.category,
      currentBid: d.tier,
      clicks: d.clicks || 100,
      description: d.description,
      status: 'ACTIVE',
      imageUrl: d.imageUrl,
      createdAt: new Date(),
      currentBidder: null,
    }))

    const candidateListings = displayListings.length > 0
      ? displayListings
      : fallbackShowcase

    // Sort listings: Top 20 main showcase (1000 down to 50), followed by #21 onwards
    const sortedListings = [...candidateListings].sort((a, b) => {
      if (isCategoryFilter) {
        const bidA = a.currentBid || 0
        const bidB = b.currentBid || 0
        if (bidB !== bidA) return bidB - bidA
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }

      const aDomain = (a.domain || '').toLowerCase()
      const bDomain = (b.domain || '').toLowerCase()

      // 1. Any real customer paid outbid with bid > 1000 takes priority at the very top
      const isTopOutbidA = (a.currentBid || 0) > 1000
      const isTopOutbidB = (b.currentBid || 0) > 1000
      if (isTopOutbidA !== isTopOutbidB) return isTopOutbidA ? -1 : 1
      if (isTopOutbidA && isTopOutbidB) return (b.currentBid || 0) - (a.currentBid || 0)

      // 2. Main 20 showcase domains come next (#1 to #20 in exact order)
      const hasMainA = MAIN_INDEX_MAP.has(aDomain)
      const hasMainB = MAIN_INDEX_MAP.has(bDomain)
      if (hasMainA && hasMainB) {
        return MAIN_INDEX_MAP.get(aDomain)! - MAIN_INDEX_MAP.get(bDomain)!
      }
      if (hasMainA !== hasMainB) return hasMainA ? -1 : 1

      // 3. Domains beyond #20: order by demo list order, then currentBid desc
      const demoIdxA = DEMO_INDEX_MAP.has(aDomain) ? DEMO_INDEX_MAP.get(aDomain)! : 9999
      const demoIdxB = DEMO_INDEX_MAP.has(bDomain) ? DEMO_INDEX_MAP.get(bDomain)! : 9999
      if (demoIdxA !== demoIdxB) return demoIdxA - demoIdxB

      const bidA = a.currentBid || 0
      const bidB = b.currentBid || 0
      if (bidB !== bidA) return bidB - bidA
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })

    const modeMinStartingBid = 50
    const modeTop1Increment = 50
    const modeOtherIncrement = 50

    // Safely calculate today's visits across the platform
    let todayVisits = 0
    try {
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      todayVisits = await prisma.visit.count({
        where: {
          createdAt: { gte: startOfToday },
        },
      })
    } catch {
      todayVisits = 0
    }

    const rankedDomains = sortedListings.map((l, idx) => {
      const isDemo = isDemoListing(l)
      const aDomain = (l.domain || '').toLowerCase()
      const isMainShowcase = MAIN_INDEX_MAP.has(aDomain)
      const hasRealUserBid = Boolean((l as any).currentBidderId || l.currentBidder || (l.currentBid && l.currentBid > 1000))

      let bidAmount: number
      if (isCategoryFilter) {
        bidAmount = l.currentBid || modeMinStartingBid
      } else if (hasRealUserBid) {
        bidAmount = l.currentBid
      } else if (isMainShowcase) {
        const mIdx = MAIN_INDEX_MAP.get(aDomain)!
        bidAmount = 1000 - mIdx * 50
      } else {
        bidAmount = modeMinStartingBid
      }

      const outbidRequired = idx === 0
        ? bidAmount + modeTop1Increment
        : bidAmount + modeOtherIncrement

      let createdAtStr = new Date().toISOString()
      try {
        if (l.createdAt) {
          const d = l.createdAt instanceof Date ? l.createdAt : new Date(l.createdAt)
          if (!isNaN(d.getTime())) createdAtStr = d.toISOString()
        }
      } catch {
        createdAtStr = new Date().toISOString()
      }

      const domainName = l.domain || (l.websiteUrl ? new URL(l.websiteUrl).hostname : 'domain.com')

      return {
        id: l.id,
        rank: idx + 1,
        title: domainName,
        domain: domainName,
        websiteUrl: l.websiteUrl || `https://${domainName}`,
        description: l.description,
        category: l.category,
        currentBid: bidAmount,
        rawBid: bidAmount,
        clicks: l.clicks || 0,
        imageUrl: l.imageUrl || `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domainName}&size=128`,
        createdAt: createdAtStr,
        currentBidder: l.currentBidder,
        status: l.status || 'ACTIVE',
        isDemo: false,
        outbidRequired,
      }
    })

    const totalBoardValue = rankedDomains.reduce((sum, l) => sum + (l.currentBid || 0), 0)
    const totalTrackedClicks = rankedDomains.reduce((sum, l) => sum + (l.clicks || 0), 0)
    const topBid = rankedDomains.length > 0 ? (rankedDomains[0].currentBid || 0) : 0
    const minBidForTop1 = topBid > 0 ? topBid + modeTop1Increment : modeMinStartingBid

    return NextResponse.json({
      domains: rankedDomains,
      totalCount: rankedDomains.length,
      totalBoardValue,
      totalTrackedClicks,
      todayVisits,
      top1Bid: topBid,
      top1Increment: modeTop1Increment,
      minBidForTop1,
      hasRealListings: true,
      mode: 'website',
      settings: {
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        top1Increment: modeTop1Increment,
        otherPositionIncrement: modeOtherIncrement,
        minimumStartingBid: modeMinStartingBid,
      },
    })
  } catch (error) {
    console.error('Error fetching domains, returning resilient fallback:', error)
    const fallbackDomains = (DEMO_SHOWCASE_DOMAINS as any[]).map((d, i) => ({
      id: `demo_seed_${i + 1}`,
      rank: i + 1,
      title: d.title,
      domain: d.domain,
      websiteUrl: d.websiteUrl,
      category: d.category,
      currentBid: d.tier,
      rawBid: d.tier,
      clicks: d.clicks,
      description: d.description,
      status: 'DEMO',
      imageUrl: d.imageUrl,
      createdAt: new Date().toISOString(),
      currentBidder: null,
      isDemo: true,
      outbidRequired: d.tier,
    }))

    return NextResponse.json({
      domains: fallbackDomains,
      totalCount: fallbackDomains.length,
      totalBoardValue: 10,
      totalTrackedClicks: 0,
      todayVisits: 0,
      top1Bid: 10,
      top1Increment: 10,
      minBidForTop1: 10,
      hasRealListings: false,
      settings: {
        currency: 'INR',
        currencySymbol: '₹',
        top1Increment: 10,
        otherPositionIncrement: 10,
        minimumStartingBid: 10,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseReady()
    const body = await request.json()
    const { url, title, category, description, amount, email, name } = body

    if (!url || !amount) {
      return NextResponse.json({ message: 'URL and promotional amount are required' }, { status: 400 })
    }

    const settings = await getSettings()
    const parsedAmount = parseInt(amount)

    const DEMO_DOMAINS = [
      'cryptoindia.in',
      'bharatmart.com',
      'techstartup.in',
      'quickloans.co.in',
      'cloudhost.in',
      'medicare24.in',
    ]

    let cleanUrl = url.trim()
    let hostname = ''
    let imageUrl = body.imageUrl || ''
    const videoUrl = body.videoUrl || null

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      try {
        const parsedUrl = new URL(cleanUrl)
        hostname = parsedUrl.hostname.replace(/^www\./, '')
      } catch {
        hostname = cleanUrl
      }
    } else {
      hostname = cleanUrl.replace(/^www\./, '').split('/')[0] || cleanUrl
      cleanUrl = 'https://' + cleanUrl
    }

    if (!imageUrl || imageUrl.includes('google.com/s2/favicons')) {
      const { resolveListingImage } = await import('@/lib/video-thumb')
      imageUrl = await resolveListingImage(cleanUrl, videoUrl, hostname)
    }

    // Find top real active listing to determine minimum required bid floor
    const realListings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        domain: { notIn: DEMO_DOMAINS },
      },
      orderBy: { currentBid: 'desc' },
      take: 1,
    })

    const modeMinBid = 50
    const modeIncrement = 50

    const topRealBid = realListings[0]?.currentBid || 0
    const minBidForTop1 = topRealBid > 0 ? topRealBid + modeIncrement : modeMinBid
    const minStartingBid = modeMinBid

    // Minimum listing tier validation: ₹50
    if (parsedAmount < minStartingBid) {
      return NextResponse.json({
        message: `Boli ₹${minStartingBid.toLocaleString('en-IN')} se kam nahi ho sakti. Minimum listing amount ₹${minStartingBid.toLocaleString('en-IN')} hai.`,
        minBidRequired: minStartingBid,
      }, { status: 400 })
    }

    // Safely find or create bidder user without tampering existing profiles
    const safeDomainForEmail = hostname.replace(/[^a-zA-Z0-9]/g, '') || 'user'
    const bidderEmail = (email || `partner@${safeDomainForEmail}.com`).trim().toLowerCase()
    const bidderName = name || title || hostname
    
    let user = await prisma.user.findUnique({ where: { email: bidderEmail } })
    if (!user) {
      const bcrypt = (await import('bcryptjs')).default
      const safePasswordHash = await bcrypt.hash(`bid_${Date.now()}`, 10)
      user = await prisma.user.create({
        data: {
          email: bidderEmail,
          name: bidderName,
          password: safePasswordHash,
          role: 'USER',
        },
      })
    }

    // Always create a new listing entry so the same profile/domain can be listed multiple times
    const listing = await prisma.listing.create({
      data: {
        title: title || `${hostname} — Online Platform`,
        domain: hostname,
        websiteUrl: cleanUrl,
        videoUrl: videoUrl,
        description: description || `Official platform for ${hostname}. Verified on NO. 1 DOMAIN.`,
        category: category || 'Ecommerce & Retail',
        imageUrl: imageUrl,
        startingBid: parsedAmount,
        currentBid: 0,
        status: 'UNPAID',
        endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        createdById: user.id,
      },
    })

    const receiptId = `dom_${listing.id.substring(0, 10)}_${Date.now()}`
    const razorpayOrder = await createRazorpayOrder(parsedAmount, receiptId)

    // Create Pending Bid
    const bid = await prisma.bid.create({
      data: {
        amount: parsedAmount,
        status: 'PENDING',
        listingId: listing.id,
        userId: user.id,
      },
    })

    // Create Pending Payment Record
    await prisma.payment.create({
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: parsedAmount,
        currency: 'INR',
        status: 'PENDING',
        userId: user.id,
        bidId: bid.id,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: parsedAmount,
      currency: 'INR',
      keyId: settings.razorpayKeyId,
      listingId: listing.id,
      bidId: bid.id,
      domain: hostname,
      isTop1: parsedAmount >= minBidForTop1,
      minBidForTop1,
    })
  } catch (error: any) {
    console.error('Error creating domain promotion:', error)
    return NextResponse.json({ message: error.message || 'Failed to submit domain promotion' }, { status: 500 })
  }
}
