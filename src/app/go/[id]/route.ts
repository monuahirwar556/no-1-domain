import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { detectGeoFromHeaders, detectDeviceAndBrowser } from '@/lib/geo'
import { recordVisitorHeartbeat } from '@/lib/live-tracker'
import { DEMO_SHOWCASE_DOMAINS } from '@/lib/demo-domains'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    let listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, title: true, websiteUrl: true, domain: true, status: true, currentBid: true },
    })

    if (!listing) {
      const cleanedDomain = id.replace(/^demo_/, '').replace(/_/g, '.')
      listing = await prisma.listing.findFirst({
        where: {
          OR: [
            { domain: id },
            { domain: cleanedDomain },
          ],
        },
        select: { id: true, title: true, websiteUrl: true, domain: true, status: true, currentBid: true },
      })
    }

    let targetUrl = listing?.websiteUrl || (listing?.domain ? listing.domain : '')
    if (!targetUrl) {
      const demo = DEMO_SHOWCASE_DOMAINS.find(
        (d) =>
          d.domain.toLowerCase() === id.toLowerCase() ||
          `demo_${d.domain.replace(/[^a-z0-9]/gi, '_')}`.toLowerCase() === id.toLowerCase()
      )
      if (demo) {
        targetUrl = demo.websiteUrl || `https://${demo.domain}`
      }
    }

    if (!targetUrl) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`
    }

    // Increment click count and record detailed Visit log for live tracking
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'Direct'
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    const geo = detectGeoFromHeaders(request.headers)
    const deviceInfo = detectDeviceAndBrowser(userAgent)

    if (listing) {
      await prisma.$transaction([
        prisma.listing.update({
          where: { id: listing.id },
          data: { clicks: { increment: 1 } },
        }),
        prisma.visit.create({
          data: {
            listingId: listing.id,
            ip: clientIp.substring(0, 45),
            userAgent: userAgent.substring(0, 255),
            referer: referer.substring(0, 255),
            country: geo.countryName,
            city: geo.city,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
          },
        }),
      ]).catch((err) => console.error('Error logging visit:', err))
    }

    // Increment today's visitors count in settings on every visit
    try {
      const todayVisitorsSetting = await prisma.setting.findUnique({ where: { key: 'today_site_visitors' } })
      const prevVis = parseInt(todayVisitorsSetting?.value || '0', 10)
      await prisma.setting.upsert({
        where: { key: 'today_site_visitors' },
        update: { value: String(prevVis + 1) },
        create: { key: 'today_site_visitors', value: String(prevVis + 1) },
      })
    } catch (e) {}

    // Use client's session ID if passed, or create a unique session ID
    const clientSid = request.nextUrl.searchParams.get('sid')
    const visitorSessionId = clientSid || `visit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const cleanDomain = listing?.domain || (targetUrl.replace(/^https?:\/\//, '').split('/')[0])
    const cleanTitle = listing?.title || cleanDomain || 'Official Website'

    // Immediately record heartbeat in memory store for live dashboard
    recordVisitorHeartbeat({
      sessionId: visitorSessionId,
      ip: clientIp,
      country: geo.countryName,
      city: geo.city,
      flag: geo.flag,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      domainId: listing?.id || id,
      domainName: cleanDomain,
      targetDomain: cleanDomain,
      targetStartedAt: Date.now(),
      currentUrl: targetUrl,
      linkTitle: cleanTitle,
      lastAction: `Active on ${cleanDomain}`,
      isExternal: true,
      stayOnlineMinutes: 5,
    })

    // Direct redirect to the official website with no-cache headers so repeat clicks are tracked
    const response = NextResponse.redirect(targetUrl, 307)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
