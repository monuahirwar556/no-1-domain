import { NextRequest, NextResponse } from 'next/server'
import { recordVisitorLeave } from '@/lib/live-tracker'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    let sessionId = ''
    try {
      const text = await request.text()
      if (text) {
        const body = JSON.parse(text)
        sessionId = body.sessionId || ''
      }
    } catch {
      // Beacon may send text or raw string
    }

    if (sessionId) {
      recordVisitorLeave(sessionId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
