import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ensureDatabaseReady } from '@/lib/db-init'
import { getActiveVisitorsData, recordVisitorHeartbeat } from '@/lib/live-tracker'
import { detectGeoFromHeaders, detectDeviceAndBrowser } from '@/lib/geo'

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

function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

async function getAnalyticsData() {
  await ensureDatabaseReady()
  cleanupOldSessions()

  const todayStr = getTodayString()

  const [viewsSetting, todayVisitorsSetting, todayDateSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'total_site_views' } }),
    prisma.setting.findUnique({ where: { key: 'today_site_visitors' } }),
    prisma.setting.findUnique({ where: { key: 'today_visitors_date' } }),
  ])

  // Total views baseline starts at minimum 11563 and continuously accumulates forever (never resets back)
  let totalViews = Math.max(parseInt(viewsSetting?.value || '0', 10), 11563)
  let todayVisitors = Math.max(parseInt(todayVisitorsSetting?.value || '26', 10), 26)

  // Ensure today's date is tracked without wiping out previous visitors data
  if (todayDateSetting?.value !== todayStr) {
    await prisma.setting.upsert({
      where: { key: 'today_visitors_date' },
      update: { value: todayStr },
      create: { key: 'today_visitors_date', value: todayStr },
    })
    await prisma.setting.upsert({
      where: { key: 'today_site_visitors' },
      update: { value: String(todayVisitors) },
      create: { key: 'today_site_visitors', value: String(todayVisitors) },
    })
  }

  // Live online users (sync with live-tracker which tracks both on-site and external browsing visitors)
  const liveTrackerStats = getActiveVisitorsData()
  const liveOnline = Math.max(liveTrackerStats.liveOnlineCount, activeUsers.size, 1)

  return {
    totalViews,
    todayVisitors,
    liveOnline,
    todayStr,
  }
}

export async function GET() {
  try {
    const data = await getAnalyticsData()
    return NextResponse.json(
      {
        success: true,
        liveOnline: data.liveOnline,
        todayVisitors: data.todayVisitors,
        totalViews: data.totalViews,
      },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (error: any) {
    console.error('Error fetching live visitor stats:', error)
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

    const todayStr = getTodayString()

    // 1. Increment total site views starting from base 11563 (always increments on every visit)
    const viewsSetting = await prisma.setting.findUnique({ where: { key: 'total_site_views' } })
    const baseViews = Math.max(parseInt(viewsSetting?.value || '0', 10), 11563)
    const currentViews = baseViews + 1

    await prisma.setting.upsert({
      where: { key: 'total_site_views' },
      update: { value: String(currentViews) },
      create: { key: 'total_site_views', value: String(currentViews) },
    })

    // 2. Increment today's visitors continuously (never wiping out previous visitors)
    const todayVisitorsSetting = await prisma.setting.findUnique({ where: { key: 'today_site_visitors' } })
    const prev = Math.max(parseInt(todayVisitorsSetting?.value || '26', 10), 26)
    const todayVisitors = prev + 1

    await prisma.setting.upsert({
      where: { key: 'today_visitors_date' },
      update: { value: todayStr },
      create: { key: 'today_visitors_date', value: todayStr },
    })

    await prisma.setting.upsert({
      where: { key: 'today_site_visitors' },
      update: { value: String(todayVisitors) },
      create: { key: 'today_site_visitors', value: String(todayVisitors) },
    })

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
