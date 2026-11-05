import { NextRequest, NextResponse } from 'next/server'
import { sendXConversionEvent } from '@/lib/x-conversions'

export const dynamic = 'force-dynamic'

// GET: Diagnostic test endpoint to test sending a test conversion event to X Ads API
export async function GET(request: NextRequest) {
  try {
    const testOrderId = `order_test_${Date.now()}`
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '192.0.2.1'
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'

    const url = new URL(request.url)
    const queryEventId = url.searchParams.get('eventId') || url.searchParams.get('event_id')
    const queryToken = url.searchParams.get('token')
    const queryPixelId = url.searchParams.get('pixelId') || url.searchParams.get('pixel_id')

    const result = await sendXConversionEvent({
      conversionId: testOrderId,
      eventSourceUrl: 'https://no1domain.in/checkout',
      pixelId: queryPixelId || undefined,
      token: queryToken || undefined,
      eventId: queryEventId || process.env.X_CONVERSION_EVENT_ID || 'tw-rgkb5-purchase',
      ipAddress: clientIp,
      userAgent,
      email: url.searchParams.get('email') || undefined,
      phone: url.searchParams.get('phone') || undefined,
      twclid: url.searchParams.get('twclid') || undefined,
    })

    return NextResponse.json({
      success: result.success,
      endpoint: `https://ads-api.x.com/12/measurement/conversions/${process.env.X_PIXEL_ID || 'rgkb5'}`,
      xApiStatus: result.status,
      xApiResponse: result.data || result.error,
      sentPayload: result.payload,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Error executing test conversion event',
    }, { status: 500 })
  }
}

// POST: Trigger real conversion event from checkout or payment verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || body.ip_address || '192.0.2.1'
    const userAgent = request.headers.get('user-agent') || body.user_agent || ''

    const result = await sendXConversionEvent({
      pixelId: body.pixelId,
      token: body.token,
      eventId: body.eventId || body.event_id,
      conversionId: body.conversionId || body.conversion_id || body.orderId || body.order_id,
      eventSourceUrl: body.eventSourceUrl || body.event_source_url,
      email: body.email,
      phone: body.phone,
      twclid: body.twclid,
      ipAddress: clientIp,
      userAgent,
    })

    return NextResponse.json({
      success: result.success,
      status: result.status,
      data: result.data || result.error,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Error processing conversion',
    }, { status: 500 })
  }
}
