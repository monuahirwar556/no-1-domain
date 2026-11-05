import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createRazorpayOrder, getRazorpayCredentials } from '@/lib/razorpay'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { amount, listingId, bidId, email, name } = body

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
        const listingOwner = await prisma.listing.findUnique({ where: { id: listingId } })
        if (listingOwner?.createdById) {
          userId = listingOwner.createdById
        } else {
          return NextResponse.json({ message: 'Unauthorized. Please log in or provide email.' }, { status: 401 })
        }
      }
    }

    if (!amount || amount <= 0 || !listingId) {
      return NextResponse.json({ message: 'Invalid payment data' }, { status: 400 })
    }

    const DEMO_DOMAINS = [
      'cryptoindia.in',
      'bharatmart.com',
      'techstartup.in',
      'quickloans.co.in',
      'cloudhost.in',
      'medicare24.in',
    ]
    const topReal = await prisma.listing.findFirst({
      where: {
        status: 'ACTIVE',
        domain: { notIn: DEMO_DOMAINS },
      },
      orderBy: { currentBid: 'desc' },
    })
    const currentTopBid = topReal?.currentBid || 0
    const listing = await prisma.listing.findUnique({ where: { id: listingId } }).catch(() => null)
    const modeBase = 50
    const modeInc = 50
    const minRequiredBid = currentTopBid > 0 ? currentTopBid + modeInc : modeBase

    if (amount < minRequiredBid) {
      return NextResponse.json({
        message: `Boli ₹${minRequiredBid} se kam nahi ho sakti. Agla minimum claim tier ₹${minRequiredBid} hai.`
      }, { status: 400 })
    }

    const receipt = bidId 
      ? `bid_${bidId}_${Date.now()}`
      : `bid_${listingId}_${userId}_${Date.now()}`

    const order = await createRazorpayOrder(amount, receipt)

    // Ensure pending bid exists or create one
    let targetBidId = bidId
    if (!targetBidId) {
      const existingPending = await prisma.bid.findFirst({
        where: { listingId, userId, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
      })
      if (existingPending) {
        targetBidId = existingPending.id
      } else {
        const newBid = await prisma.bid.create({
          data: {
            amount,
            status: 'PENDING',
            listingId,
            userId,
          },
        })
        targetBidId = newBid.id
      }
    }

    // Upsert payment record in INR
    await prisma.payment.upsert({
      where: { razorpayOrderId: order.id },
      create: {
        razorpayOrderId: order.id,
        amount,
        currency: 'INR',
        status: 'PENDING',
        userId,
        bidId: targetBidId,
      },
      update: {
        amount,
        currency: 'INR',
        bidId: targetBidId,
      },
    })

    const { keyId } = await getRazorpayCredentials()

    return NextResponse.json({
      id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: 'INR',
      keyId: keyId || '',
      key_id: keyId || '',
    })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json({ message: error.message || 'Failed to create order' }, { status: 500 })
  }
}