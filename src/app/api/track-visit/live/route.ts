import { NextRequest, NextResponse } from 'next/server'
import { getActiveVisitorsData } from '@/lib/live-tracker'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domainId = searchParams.get('domainId') || undefined

    const data = getActiveVisitorsData(domainId)
    return NextResponse.json({
      success: true,
      ...data,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
