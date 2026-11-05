import prisma from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { formatINR } from '@/lib/utils'
import { BidValidationResult } from '@/types'

export async function validateBid(
  listingId: string,
  amount: number,
  userId: string
): Promise<BidValidationResult> {
  const settings = await getSettings()
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: {
        where: { status: 'PAID' },
        orderBy: { amount: 'desc' },
        take: 20,
      },
    },
  })

  if (!listing) {
    return { valid: false, message: 'Listing not found' }
  }

  if (listing.status !== 'ACTIVE') {
    return { valid: false, message: 'This listing is not active' }
  }

  if (new Date() > new Date(listing.endsAt)) {
    return { valid: false, message: 'This showcase cycle has ended' }
  }

  if (amount < settings.minimumStartingBid) {
    return { 
      valid: false, 
      message: `Minimum listing tier is ${formatINR(settings.minimumStartingBid)}` 
    }
  }

  if (amount > settings.maximumBid) {
    return { 
      valid: false, 
      message: `Maximum listing tier is ${formatINR(settings.maximumBid)}` 
    }
  }

  // Check if user is already the current top bidder
  if (listing.currentBidderId === userId) {
    return { valid: false, message: 'You are already the highest bidder (#1)' }
  }

  const paidBids = listing.bids.filter(b => b.status === 'PAID')
  const currentTopBid = paidBids[0]?.amount || listing.currentBid || listing.startingBid || 0

  // Calculate required bid to take #1 position
  const minBidForTop1 = currentTopBid > 0 
    ? currentTopBid + settings.top1Increment 
    : Math.max(settings.minimumStartingBid, listing.startingBid || 0)

  // If trying to take #1 position
  if (amount > currentTopBid || paidBids.length === 0) {
    if (amount < minBidForTop1) {
      return {
        valid: false,
        message: `Your promotional tier must be at least ${formatINR(minBidForTop1)} to take the #1 spotlight.`,
        minBidRequired: minBidForTop1,
      }
    }
    
    // Valid promotion for #1 position
    return { 
      valid: true, 
      message: 'Promotion accepted for #1 spotlight position',
      minBidRequired: minBidForTop1,
    }
  }

  // For other positions below #1, use configured otherPositionIncrement
  let targetPosition = paidBids.length + 1
  for (let i = 0; i < paidBids.length; i++) {
    if (amount > paidBids[i].amount) {
      targetPosition = i + 1
      break
    }
  }

  if (targetPosition > 1) {
    const bidAbove = paidBids[targetPosition - 2]
    const minBidForPosition = bidAbove ? bidAbove.amount + settings.otherPositionIncrement : settings.minimumStartingBid
    
    if (amount < minBidForPosition) {
      return {
        valid: false,
        message: `Your promotional tier must be at least ${formatINR(minBidForPosition)} for position #${targetPosition}.`,
        minBidRequired: minBidForPosition,
      }
    }
  }

  return { 
    valid: true, 
    message: 'Promotion accepted',
    minBidRequired: minBidForTop1,
  }
}

export async function processBid(
  listingId: string,
  amount: number,
  userId: string,
  paymentId?: string
): Promise<{ success: boolean; bidId?: string; message: string; newPosition?: number }> {
  const validation = await validateBid(listingId, amount, userId)
  
  if (!validation.valid) {
    return { success: false, message: validation.message }
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: {
        where: { status: 'PAID' },
        orderBy: { amount: 'desc' },
      },
    },
  })

  if (!listing) {
    return { success: false, message: 'Listing not found' }
  }

  // Create the bid as PAID upon successful verification
  const bid = await prisma.bid.create({
    data: {
      amount,
      status: 'PAID',
      listingId,
      userId,
    },
  })

  // Update all bids' positions and listing currentBid/currentBidderId
  const newPosition = await updateBidPositions(listingId, bid.id)

  return { 
    success: true, 
    bidId: bid.id,
    newPosition,
    message: newPosition === 1 
      ? `Congratulations! You are now #1 👑 with a spotlight tier of ${formatINR(amount)}` 
      : `Your domain showcase of ${formatINR(amount)} is placed at position #${newPosition}` 
  }
}

export async function updateBidPositions(listingId: string, targetBidId?: string): Promise<number> {
  const paidBids = await prisma.bid.findMany({
    where: { 
      listingId, 
      status: 'PAID' 
    },
    orderBy: [
      { amount: 'desc' },
      { createdAt: 'asc' },
    ],
  })

  if (paidBids.length === 0) return 1

  // Update positions for all bids: #1 is highest amount, previous #1 moves to #2, etc.
  await prisma.$transaction(
    paidBids.map((bid, index) =>
      prisma.bid.update({
        where: { id: bid.id },
        data: { position: index + 1 },
      })
    )
  )

  // Update listing current bid and winning bidder to the new #1
  const topBid = paidBids[0]
  if (topBid) {
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'ACTIVE',
        currentBid: topBid.amount,
        currentBidderId: topBid.userId,
      },
    })
  }

  if (targetBidId) {
    const foundIdx = paidBids.findIndex((b) => b.id === targetBidId)
    if (foundIdx !== -1) {
      return foundIdx + 1
    }
  }

  return 1
}

export async function getLeaderboard(listingId: string, currentUserId?: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: {
        where: { status: 'PAID' },
        orderBy: [
          { amount: 'desc' },
          { createdAt: 'asc' },
        ],
        include: { user: true },
      },
      currentBidder: true,
    },
  })

  if (!listing) return null

  return listing.bids.map((bid, index) => ({
    position: index + 1,
    bid: {
      id: bid.id,
      amount: bid.amount,
      createdAt: bid.createdAt.toISOString(),
      user: {
        id: bid.user.id,
        name: bid.user.name,
        email: bid.user.email,
        avatar: bid.user.avatar,
      },
    },
    isCurrentUser: bid.userId === currentUserId,
  }))
}

export async function getMinBidForTop1(listingId: string): Promise<{ currentTopBid: number; minBid: number; top1Increment: number }> {
  const settings = await getSettings()
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: {
        where: { status: 'PAID' },
        orderBy: { amount: 'desc' },
        take: 1,
      },
    },
  })

  const currentTopBid = listing?.bids[0]?.amount ?? listing?.currentBid ?? listing?.startingBid ?? 0
  const minBid = currentTopBid > 0 
    ? currentTopBid + settings.top1Increment 
    : Math.max(settings.minimumStartingBid, listing?.startingBid ?? 0)

  return {
    currentTopBid,
    minBid,
    top1Increment: settings.top1Increment,
  }
}