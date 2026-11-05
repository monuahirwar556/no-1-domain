import { NextRequest, NextResponse } from 'next/server'
import { recordVisitorHeartbeat } from '@/lib/live-tracker'
import { detectGeoFromHeaders, detectDeviceAndBrowser } from '@/lib/geo'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const sessionId = body.sessionId || `sess_${Math.random().toString(36).substring(2, 9)}`

    const userAgent = request.headers.get('user-agent') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    const geo = detectGeoFromHeaders(request.headers)
    const deviceInfo = detectDeviceAndBrowser(userAgent)

    const session = recordVisitorHeartbeat({
      sessionId,
      ip,
      country: geo.countryName,
      flag: geo.flag,
      city: geo.city,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      currentUrl: body.currentUrl || '/',
      linkTitle: body.linkTitle || 'Website Page',
      domainId: body.domainId,
      domainName: body.domainName,
      targetDomain: body.targetDomain,
      targetStartedAt: body.targetStartedAt,
      lastAction: body.lastAction || 'Active Browsing',
      isExternal: body.isExternal,
      stayOnlineMinutes: body.stayOnlineMinutes,
    })

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      durationSeconds: session.durationSeconds,
      isOnline: session.isOnline,
      status: session.status,
    })
  } catch (error: any) {
    console.error('Heartbeat tracking error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
