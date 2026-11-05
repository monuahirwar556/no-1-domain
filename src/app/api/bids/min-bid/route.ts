import { NextRequest, NextResponse } from 'next/server'
import { getMinBidForTop1 } from '@/lib/bid-logic'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json({ message: 'Listing ID required' }, { status: 400 })
    }

    const { currentTopBid, minBid, top1Increment } = await getMinBidForTop1(listingId)

    return NextResponse.json({
      currentTopBid,
      minBid,
      top1Increment,
    })
  } catch (error: any) {
    console.error('Min bid error:', error)
    return NextResponse.json({ message: 'Failed to get min bid' }, { status: 500 })
  }
}