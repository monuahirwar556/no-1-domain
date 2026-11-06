import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  detectDeviceAndBrowser,
  buildAnalyticsBreakdown,
  COUNTRIES_MAP,
  getRandomGeo,
} from '@/lib/geo'
import { recordVisitorHeartbeat, getActiveVisitorsData } from '@/lib/live-tracker'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch listing with recent visits
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        visits: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ message: 'Domain not found' }, { status: 404 })
    }

    // Determine current rank
    const higherRankCount = await prisma.listing.count({
      where: {
        status: 'ACTIVE',
        currentBid: { gt: listing.currentBid },
      },
    })
    const rank = higherRankCount + 1

    // Calculate time metrics
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const [todayVisitsDb, lastHourVisits, allVisits, viewsSetting, todaySiteVisitorsSetting] = await Promise.all([
      prisma.visit.count({
        where: {
          listingId: id,
          createdAt: { gte: startOfToday },
        },
      }),
      prisma.visit.count({
        where: {
          listingId: id,
          createdAt: { gte: oneHourAgo },
        },
      }),
      prisma.visit.findMany({
        where: { listingId: id },
        select: { country: true, city: true, device: true, browser: true },
        take: 1000,
      }),
      prisma.setting.findUnique({ where: { key: 'total_site_views' } }),
      prisma.setting.findUnique({ where: { key: 'today_site_visitors' } }),
    ])

    const todayVisits = Math.max(todayVisitsDb, parseInt(todaySiteVisitorsSetting?.value || '0', 10), 1)

    const totalViewsConfigured = Math.max(parseInt(viewsSetting?.value || '0', 10), 11563)
    // Scale analytics to show the full ~11,563+ total visitors volume across charts
    const displayTotalViews = Math.max(totalViewsConfigured, listing.clicks, 11563)

    // Build geographic and device breakdowns matching Datafa / Plausible analytics
    const analytics = buildAnalyticsBreakdown(displayTotalViews, allVisits)

    const recentVisitsFormatted = listing.visits.map((v) => {
      // Mask IP for privacy (e.g. 192.168.1.1 -> 192.168.*.*)
      const parts = (v.ip || '').split('.')
      const maskedIp = parts.length === 4 ? `${parts[0]}.${parts[1]}.*.*` : 'Direct Visitor'

      const countryName = v.country || 'India'
      const countryCode = Object.values(COUNTRIES_MAP).find(c => c.name.toLowerCase() === countryName.toLowerCase())?.code || 'IN'
      const flag = COUNTRIES_MAP[countryCode]?.flag || '🇮🇳'

      return {
        id: v.id,
        time: v.createdAt.toISOString(),
        maskedIp,
        country: countryName,
        city: v.city || 'Mumbai',
        flag,
        device: v.device || 'Mobile',
        browser: v.browser || 'Chrome',
        referer: v.referer || 'Direct / Live Board',
      }
    })

    // Include live online visitors and stay duration
    const liveData = getActiveVisitorsData(listing.id, listing.domain || undefined)

    return NextResponse.json({
      success: true,
      id: listing.id,
      domain: listing.domain,
      title: listing.title,
      websiteUrl: listing.websiteUrl,
      category: listing.category,
      imageUrl: listing.imageUrl,
      currentBid: listing.currentBid,
      rank,
      totalVisits: displayTotalViews,
      todayVisits,
      lastHourVisits,
      trackingUrl: `/go/${listing.id}`,
      recentVisits: recentVisitsFormatted,
      countries: analytics.countries,
      regions: analytics.regions,
      cities: analytics.cities,
      devices: analytics.devices,
      browsers: analytics.browsers,
      os: analytics.os,
      paths: analytics.paths,
      sources: analytics.sources,
      channels: analytics.channels,
      referrers: analytics.referrers,
      campaigns: analytics.campaigns,
      pagesExtended: analytics.pagesExtended,
      events: analytics.events,
      chart: analytics.chart,
      summary: {
        ...analytics.summary,
        liveNow: Math.max(liveData.liveOnlineCount, 1),
      },
      liveOnlineVisitors: liveData,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error fetching live tracking data:', error)
    return NextResponse.json({ message: error.message || 'Error fetching tracking data' }, { status: 500 })
  }
}

// POST: Simulate or log a live tracked visit
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'Direct'
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
    const referer = request.headers.get('referer') || 'Live Board Visitor'

    const geo = getRandomGeo()
    const deviceInfo = detectDeviceAndBrowser(userAgent)

    const [updatedListing, newVisit] = await prisma.$transaction([
      prisma.listing.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      }),
      prisma.visit.create({
        data: {
          listingId: id,
          ip: clientIp.substring(0, 45),
          userAgent: userAgent.substring(0, 255),
          referer: referer.substring(0, 255),
          country: geo.countryName,
          city: geo.city,
          device: deviceInfo.device,
          browser: deviceInfo.browser,
        },
      }),
    ])

    // Also register this visitor in live heartbeat session store
    const simSessionId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    recordVisitorHeartbeat({
      sessionId: simSessionId,
      ip: clientIp,
      country: geo.countryName,
      city: geo.city,
      flag: geo.flag,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      domainId: id,
      domainName: updatedListing.domain || undefined,
      targetDomain: updatedListing.domain || undefined,
      targetStartedAt: Date.now(),
      currentUrl: updatedListing.websiteUrl || `/go/${id}`,
      linkTitle: updatedListing.title || updatedListing.domain || 'Domain Visit',
      lastAction: 'Simulated Live Visit',
      isExternal: true,
      stayOnlineMinutes: 5,
    })

    return NextResponse.json({
      success: true,
      message: 'Visit logged successfully in real time',
      totalVisits: updatedListing.clicks,
      visitId: newVisit.id,
      country: geo.countryName,
      city: geo.city,
      flag: geo.flag,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      timestamp: newVisit.createdAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Error logging simulated visit:', error)
    return NextResponse.json({ message: error.message || 'Error logging visit' }, { status: 500 })
  }
}
