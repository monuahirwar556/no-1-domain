import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyRazorpayPayment } from '@/lib/razorpay'
import { updateBidPositions, getLeaderboard, getMinBidForTop1 } from '@/lib/bid-logic'
import { syncDummyDomainsWithRealCount } from '@/lib/demo-domains'
import { formatINR } from '@/lib/utils'
import { getSettings } from '@/lib/settings'
import { sendXConversionEvent } from '@/lib/x-conversions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      listingId,
      amount,
      domain,
      url,
      title,
      category,
      imageUrl,
      description,
    } = body

    const orderId = razorpayOrderId || body.order_id
    const paymentId = razorpayPaymentId || body.payment_id
    const signature = razorpaySignature || body.signature
    const videoUrl = body.videoUrl || null

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({
        message: 'Missing required Razorpay payment verification fields (orderId, paymentId, signature)'
      }, { status: 400 })
    }

    const minStartingBid = 50
    const finalAmount = Number(amount)

    if (isNaN(finalAmount) || finalAmount < minStartingBid) {
      return NextResponse.json({
        message: `Boli ₹${minStartingBid} se kam nahi ho sakti. Minimum listing amount ₹${minStartingBid} hai.`
      }, { status: 400 })
    }

    // 1. Strict Cryptographic Signature Verification
    const settings = await getSettings().catch(() => null)
    const isValid = verifyRazorpayPayment(orderId, paymentId, signature, settings?.razorpayKeySecret)
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid payment signature. Verification failed.' }, { status: 400 })
    }

    // 2. Resolve Target Listing
    let targetListingId = listingId

    if (!targetListingId) {
      // Extract hostname
      let targetDomain = domain
      if (!targetDomain && url) {
        try {
          const cleanUrl = url.startsWith('http') ? url : 'https://' + url
          targetDomain = new URL(cleanUrl).hostname.replace(/^www\./, '')
        } catch {
          targetDomain = `brand_${Date.now()}.in`
        }
      }
      if (!targetDomain) targetDomain = `brand_${Date.now()}.in`

      // Check if listing already exists
      let existingListing = await prisma.listing.findFirst({
        where: { domain: targetDomain },
        orderBy: { createdAt: 'desc' },
      })

      const { resolveListingImage } = await import('@/lib/video-thumb')
      let finalImage = imageUrl
      if (!finalImage || finalImage.includes('google.com/s2/favicons')) {
        finalImage = await resolveListingImage(url, videoUrl, targetDomain)
      }

      if (!existingListing) {
        let user = await prisma.user.findFirst({ where: { role: 'USER' } }) || await prisma.user.findFirst()
        if (!user) {
          const bcrypt = (await import('bcryptjs')).default
          user = await prisma.user.create({
            data: {
              email: `partner@${targetDomain.replace(/[^a-zA-Z0-9.-]/g, '')}`,
              name: title || targetDomain,
              password: await bcrypt.hash(`partner_${Date.now()}`, 10),
              role: 'USER',
            },
          })
        }

        const cleanWebsite = url
          ? url.startsWith('http')
            ? url
            : `https://${url}`
          : `https://${targetDomain}`

        existingListing = await prisma.listing.create({
          data: {
            title: title || `${targetDomain} — Official Platform`,
            domain: targetDomain,
            websiteUrl: cleanWebsite,
            videoUrl: videoUrl,
            description: description || `Official platform for ${targetDomain}. Verified on NO. 1 DOMAIN.`,
            category: category || 'Ecommerce & Retail',
            imageUrl: finalImage,
            startingBid: finalAmount,
            currentBid: finalAmount,
            status: 'ACTIVE',
            endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            createdById: user.id,
          },
        })
      } else if (imageUrl || videoUrl) {
        // Update listing image and details with fresh high-res avatar / video
        const updatedImg = imageUrl && !imageUrl.includes('google.com/s2/favicons')
          ? imageUrl
          : await resolveListingImage(url, videoUrl, targetDomain)
        await prisma.listing.update({
          where: { id: existingListing.id },
          data: {
            ...(updatedImg ? { imageUrl: updatedImg } : {}),
            ...(videoUrl ? { videoUrl } : {}),
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
          },
        }).catch(() => {})
      }
      targetListingId = existingListing.id
    }

    // 3. Find or Create Payment & Bid Record
    let payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { bid: true },
    })

    if (!payment) {
      // Find latest pending payment for this listing
      payment = await prisma.payment.findFirst({
        where: {
          status: 'PENDING',
          bid: { listingId: targetListingId },
        },
        orderBy: { createdAt: 'desc' },
        include: { bid: true },
      })
    }

    if (!payment) {
      // Automatically create payment & bid record so user is NEVER blocked
      const targetListing = await prisma.listing.findUnique({ where: { id: targetListingId } })
      const userId = targetListing?.createdById || (await prisma.user.findFirst())?.id || 'system_user'

      const newBid = await prisma.bid.create({
        data: {
          amount: finalAmount,
          status: 'PAID',
          listingId: targetListingId,
          userId,
        },
      })

      payment = await prisma.payment.create({
        data: {
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          amount: finalAmount,
          currency: 'INR',
          status: 'SUCCESS',
          userId,
          bidId: newBid.id,
        },
        include: { bid: true },
      })
    } else {
      // Update existing payment to SUCCESS
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: 'SUCCESS',
          amount: finalAmount,
        },
      })

      if (payment.bidId) {
        await prisma.bid.update({
          where: { id: payment.bidId },
          data: {
            status: 'PAID',
            amount: finalAmount,
          },
        })
      }
    }

    // 4. Update Listing to ACTIVE with the verified bid amount and bidder
    await prisma.listing.update({
      where: { id: targetListingId },
      data: {
        status: 'ACTIVE',
        currentBid: finalAmount,
        startingBid: finalAmount,
        currentBidderId: payment.userId,
        ...(category ? { category } : {}),
        ...(title ? { title } : {}),
        ...(url ? { websiteUrl: url.startsWith('http') ? url : `https://${url}` } : {}),
      },
    })

    // 5. Run Server-Side Ranking Logic
    await updateBidPositions(targetListingId)

    // 6. Progressive replacement: Remove dummy domain as new real domain is verified
    await syncDummyDomainsWithRealCount()

    // 6. Fetch Updated Board Metrics
    const { currentTopBid, minBid, top1Increment } = await getMinBidForTop1(targetListingId)
    const updatedLeaderboard = await getLeaderboard(targetListingId, payment.userId)

    const isTop1 = finalAmount >= minBid
    const successMsg = isTop1
      ? `Payment of ${formatINR(finalAmount)} verified successfully! Your domain is now ranked #1 👑`
      : `Payment of ${formatINR(finalAmount)} verified successfully! Your domain is now active on the leaderboard.`

    // 7. Dispatch X (Twitter) Ads Conversion Event (CAPI)
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '192.0.2.1'
    const userAgent = request.headers.get('user-agent') || ''
    sendXConversionEvent({
      conversionId: orderId,
      eventSourceUrl: `${request.nextUrl.origin}/checkout`,
      eventId: process.env.X_CONVERSION_EVENT_ID || 'tw-rgkb5-purchase',
      ipAddress: clientIp,
      userAgent,
      email: body.email || `customer@${domain || 'no1domain.in'}`,
      phone: body.phone,
      twclid: body.twclid,
    }).catch(err => console.error('[X-CAPI] Error dispatching payment conversion:', err))

    return NextResponse.json({
      success: true,
      message: successMsg,
      listingId: targetListingId,
      currentTopBid,
      minBid,
      top1Increment,
      leaderboard: updatedLeaderboard,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ message: error.message || 'Payment verification failed' }, { status: 500 })
  }
}