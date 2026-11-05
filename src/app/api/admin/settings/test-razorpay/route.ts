import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getSettings } from '@/lib/settings'
import { isAdminAuthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin credentials required.' }, { status: 401 })
    }

    let body: any = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    let { keyId, keySecret } = body

    if (!keyId || !keySecret) {
      const current = await getSettings()
      keyId = keyId || current.razorpayKeyId
      keySecret = keySecret || current.razorpayKeySecret
    }

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        message: 'Key ID aur Key Secret dono required hain. Please enter both fields.'
      }, { status: 400 })
    }

    keyId = String(keyId).trim().replace(/^["']|["']$/g, '')
    keySecret = String(keySecret).trim().replace(/^["']|["']$/g, '')

    const isLive = keyId.startsWith('rzp_live_')
    const isTest = keyId.startsWith('rzp_test_')

    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Validate against Razorpay API
    // Fetching 1 order or payment verifies authentication without creating any charges
    let verified = false
    let verificationError: any = null

    try {
      await (rzp.orders.all as any)({ count: 1 })
      verified = true
    } catch (orderErr: any) {
      // Some accounts might not have order access or require payments API
      try {
        await (rzp.payments.all as any)({ count: 1 })
        verified = true
      } catch (payErr: any) {
        verificationError = payErr || orderErr
      }
    }

    if (!verified) {
      const statusCode = verificationError?.statusCode || verificationError?.status
      const desc =
        verificationError?.error?.description ||
        verificationError?.message ||
        'Razorpay authentication failed'

      return NextResponse.json({
        success: false,
        statusCode: statusCode || 401,
        message: `Razorpay API Verification Failed: ${desc}. Kripya Razorpay dashboard se Key ID aur Secret dobara check karein.`
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      mode: isLive ? 'LIVE' : isTest ? 'TEST' : 'CUSTOM',
      message: `Razorpay credentials successfully verified! (${isLive ? 'LIVE Mode 🟢' : 'TEST Mode 🟡'}). Aapka payment gateway bilkul sahi kaam kar raha hai.`
    })
  } catch (error: any) {
    console.error('Test Razorpay error:', error)
    return NextResponse.json({
      success: false,
      message: error?.message || 'Failed to verify Razorpay credentials'
    }, { status: 500 })
  }
}
