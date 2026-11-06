import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ensureDatabaseReady } from '@/lib/db-init'
import { getActiveVisitorsData, recordVisitorHeartbeat } from '@/lib/live-tracker'
import { detectGeoFromHeaders, detectDeviceAndBrowser } from '@/lib/geo'
import { getLiveAnalyticsMetrics, recordNewVisitIncrement } from '@/lib/analytics-state'

export const dynamic = 'force-dynamic'

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

// In-memory active live users store (session/ip -> timestamp)
const activeUsers = new Map<string, number>()

function cleanupOldSessions() {
  const twoMinutesAgo = Date.now() - 2 * 60 * 1000
  for (const [key, timestamp] of activeUsers.entries()) {
    if (timestamp < twoMinutesAgo) {
      activeUsers.delete(key)
    }
  }
}

export async function GET() {
  try {
    await ensureDatabaseReady()
    cleanupOldSessions()

    const metrics = await getLiveAnalyticsMetrics()
    const liveTrackerStats = getActiveVisitorsData()
    const liveOnline = Math.max(liveTrackerStats.liveOnlineCount, activeUsers.size, 1)

    return NextResponse.json(
      {
        success: true,
        liveOnline,
        todayVisitors: metrics.todayVisitors,
        totalViews: metrics.totalViews,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (error: any) {
    console.error('Error fetching live visitor stats:', error)
    return NextResponse.json(
      {
        success: true,
        liveOnline: Math.max(activeUsers.size, 1),
        todayVisitors: 0,
        totalViews: 11563,
      },
      { headers: NO_CACHE_HEADERS }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseReady()
    cleanupOldSessions()

    let body: any = {}
    try {
      body = await request.json()
    } catch {
      try {
        const rawText = await request.text()
        if (rawText) body = JSON.parse(rawText)
      } catch {
        body = {}
      }
    }

    const clientSessionId = body.sessionId || `session_${Math.random().toString(36).substring(2, 9)}`
    const isNewVisitor = body.isNewSession !== false

    // Detect client device and geo
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || body.referer || 'Direct'
    const isMobile = /mobile|iphone|android|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)
    const geo = detectGeoFromHeaders(request.headers)
    const deviceInfo = detectDeviceAndBrowser(userAgent)

    // Client IP (Forwarded header or default)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'client'
    const identifier = `${ip}_${clientSessionId}`

    // Register active user in live map
    activeUsers.set(identifier, Date.now())

    // 1 & 2. Record visit and increment total views and today's visitors (resets at Indian midnight only!)
    const metrics = await recordNewVisitIncrement(isNewVisitor)
    const currentViews = metrics.totalViews
    const todayVisitors = metrics.todayVisitors

    // 3. Log real visitor into database if viewing a specific domain, and record live heartbeat
    const targetListingId = body.listingId || null
    if (targetListingId) {
      const listingExists = await prisma.listing.findUnique({ where: { id: targetListingId } })
      if (listingExists) {
        await prisma.visit.create({
          data: {
            listingId: targetListingId,
            ip: ip.substring(0, 45),
            userAgent: userAgent.substring(0, 255),
            referer: referer.substring(0, 255),
            country: geo.countryName,
            city: geo.city,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
          },
        }).catch((e) => console.error('Error logging domain visit:', e))
      }
    }

    recordVisitorHeartbeat({
      sessionId: clientSessionId,
      ip,
      country: geo.countryName,
      city: geo.city,
      flag: geo.flag,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      currentUrl: '/',
      linkTitle: 'Homepage — #1 Domain',
      domainName: 'no1domain.in',
      domainId: targetListingId || undefined,
      lastAction: 'Visited site',
    })

    const liveOnline = Math.max(activeUsers.size, 1)

    return NextResponse.json(
      {
        success: true,
        liveOnline,
        todayVisitors,
        totalViews: currentViews,
        isMobile,
        geo: {
          country: geo.countryName,
          city: geo.city,
          flag: geo.flag,
        },
        system: {
          browser: deviceInfo.browser,
          device: deviceInfo.device,
          os: deviceInfo.os,
        },
        recordedAt: new Date().toISOString(),
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (error: any) {
    console.error('Error tracking live site visit:', error)
    return NextResponse.json(
      {
        success: true,
        liveOnline: Math.max(activeUsers.size, 1),
        todayVisitors: 26,
        totalViews: 11563,
      },
      { headers: NO_CACHE_HEADERS }
    )
  }
}
