import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { updateBidPositions } from '@/lib/bid-logic'
import { syncDummyDomainsWithRealCount } from '@/lib/demo-domains'
import { getSettings } from '@/lib/settings'
import { sendXConversionEvent } from '@/lib/x-conversions'

export async function POST(request: NextRequest) {
  try {
    const settings = await getSettings().catch(() => null)
    const keySecret = (settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || '').trim()

    if (!keySecret) {
      return NextResponse.json(
        { success: false, message: 'Server error: RAZORPAY_KEY_SECRET is not configured' },
        { status: 500 }
      )
    }

    let body: any = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request body' },
        { status: 400 }
      )
    }

    // Support both standard API naming (order_id) and Razorpay handler naming (razorpay_order_id)
    const orderId = body.order_id || body.razorpay_order_id
    const paymentId = body.payment_id || body.razorpay_payment_id
    const signature = body.signature || body.razorpay_signature

    // Validate missing fields
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required payment verification fields (order_id, payment_id, razorpay_signature)',
        },
        { status: 400 }
      )
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    // Constant-time signature comparison to prevent timing attacks
    let isMatch = false
    if (generatedSignature.length === signature.length) {
      try {
        isMatch = crypto.timingSafeEqual(
          Buffer.from(generatedSignature, 'utf-8'),
          Buffer.from(signature, 'utf-8')
        )
      } catch {
        isMatch = generatedSignature === signature
      }
    }

    // Signature mismatch: return 400, do NOT mark as paid
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature: verification failed' },
        { status: 400 }
      )
    }

    // If order exists in database, mark payment and bid as successful
    try {
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
        include: { bid: true },
      })

      if (payment && payment.status !== 'SUCCESS') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            status: 'SUCCESS',
          },
        })

        if (payment.bidId) {
          await prisma.bid.update({
            where: { id: payment.bidId },
            data: { status: 'PAID' },
          })
        }

        if (payment.bid?.listingId) {
          await prisma.listing.update({
            where: { id: payment.bid.listingId },
            data: {
              status: 'ACTIVE',
              currentBid: payment.amount,
              currentBidderId: payment.userId,
            },
          })
          await updateBidPositions(payment.bid.listingId)
          await syncDummyDomainsWithRealCount()
        }
      }
    } catch (dbErr) {
      console.warn('Note: Database update skipped or completed:', dbErr)
    }

    // Dispatch X (Twitter) Ads Conversion Event (CAPI)
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '192.0.2.1'
    const userAgent = request.headers.get('user-agent') || ''
    sendXConversionEvent({
      conversionId: orderId,
      eventSourceUrl: `${request.nextUrl.origin}/checkout`,
      eventId: process.env.X_CONVERSION_EVENT_ID || 'tw-rgkb5-purchase',
      ipAddress: clientIp,
      userAgent,
      email: body.email,
      phone: body.phone,
      twclid: body.twclid,
    }).catch(err => console.error('[X-CAPI] Error dispatching payment conversion:', err))

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order_id: orderId,
      payment_id: paymentId,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}
