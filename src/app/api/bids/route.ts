import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { validateBid } from '@/lib/bid-logic'
import { getSettings } from '@/lib/settings'
import { createRazorpayOrder } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { listingId, amount, email, name } = body

    // Support session user or verified guest bidder
    let userId = (session?.user as any)?.id
    if (!userId) {
      if (email && typeof email === 'string' && email.includes('@')) {
        const cleanEmail = email.trim().toLowerCase()
        let guestUser = await prisma.user.findUnique({ where: { email: cleanEmail } })
        if (!guestUser) {
          const bcrypt = (await import('bcryptjs')).default
          const safeHash = await bcrypt.hash(`guest_${Date.now()}_${Math.random()}`, 10)
          guestUser = await prisma.user.create({
            data: {
              email: cleanEmail,
              name: name?.trim() || cleanEmail.split('@')[0],
              password: safeHash,
              role: 'USER',
            },
          })
        }
        userId = guestUser.id
      } else {
        return NextResponse.json({ message: 'Please sign in to place a bid' }, { status: 401 })
      }
    }

    if (!listingId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ message: 'Invalid bid data' }, { status: 400 })
    }

    const settings = await getSettings()

    // Validate bid with server-side ranking logic
    const validation = await validateBid(listingId, amount, userId)
    if (!validation.valid) {
      return NextResponse.json({ 
        message: validation.message, 
        minBidRequired: validation.minBidRequired 
      }, { status: 400 })
    }

    // Create Razorpay order in INR
    const receipt = `bid_${listingId}_${userId}_${Date.now()}`
    const order = await createRazorpayOrder(amount, receipt)

    // Create pending bid record
    const bid = await prisma.bid.create({
      data: {
        amount,
        status: 'PENDING',
        listingId,
        userId,
      },
    })

    // Create payment record in INR
    await prisma.payment.create({
      data: {
        razorpayOrderId: order.id,
        amount,
        currency: 'INR',
        status: 'PENDING',
        userId,
        bidId: bid.id,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      keyId: settings.razorpayKeyId,
      bidId: bid.id,
    })
  } catch (error: any) {
    console.error('Bid creation error:', error)
    return NextResponse.json({ message: error.message || 'Failed to create bid' }, { status: 500 })
  }
}