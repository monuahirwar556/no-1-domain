import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin credentials required to perform database reset.' }, { status: 401 })
    }

    // 1. Delete all traffic tracking / visits
    await prisma.visit.deleteMany({})

    // 2. Delete all payments
    await prisma.payment.deleteMany({})

    // 3. Delete all bids
    await prisma.bid.deleteMany({})

    // 4. Delete all listings
    await prisma.listing.deleteMany({})

    // 5. Delete non-admin users
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({
      where: {
        role: { not: 'ADMIN' },
      },
    })

    // 6. Reset platform settings to clean live defaults (preserving active payment keys)
    const currentKeyId = await prisma.setting.findUnique({ where: { key: 'razorpay_key_id' } })
    const currentKeySecret = await prisma.setting.findUnique({ where: { key: 'razorpay_key_secret' } })

    const liveSettings = [
      { key: 'currency', value: 'INR' },
      { key: 'currency_symbol', value: '₹' },
      { key: 'top1_increment', value: '50' },
      { key: 'other_position_increment', value: '50' },
      { key: 'minimum_starting_bid', value: '50' },
      { key: 'maximum_bid', value: '10000000' },
      { key: 'payment_gateway', value: 'Razorpay' },
      { key: 'razorpay_key_id', value: currentKeyId?.value || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '' },
      { key: 'razorpay_key_secret', value: currentKeySecret?.value || process.env.RAZORPAY_KEY_SECRET || '' },
    ]

    for (const s of liveSettings) {
      await prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'All listings, bids, visits, and payments have been completely reset to zero.',
    })
  } catch (error: any) {
    console.error('Reset error:', error)
    return NextResponse.json(
      { message: 'Failed to reset: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
