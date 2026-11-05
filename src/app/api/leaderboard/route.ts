import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json({ message: 'Listing ID required' }, { status: 400 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        bids: {
          where: { status: 'PAID' },
          orderBy: { amount: 'desc' },
          include: { user: true },
        },
        currentBidder: true,
      },
    })

    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 })
    }

    const currentUserId = (session?.user as any)?.id

    const entries = listing.bids.map((bid, index) => ({
      position: index + 1,
      bid: {
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt.toISOString(),
        user: {
          id: bid.user.id,
          name: bid.user.name || 'Verified Bidder',
          avatar: bid.user.avatar,
        },
      },
      isCurrentUser: bid.userId === currentUserId,
    }))

    return NextResponse.json({
      entries,
      currentTopBid: listing.currentBid,
      currentBidder: listing.currentBidder ? {
        id: listing.currentBidder.id,
        name: listing.currentBidder.name || 'Top Bidder',
      } : null,
    })
  } catch (error: any) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ message: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}