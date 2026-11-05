import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getSettings } from '@/lib/settings'

export async function POST(request: NextRequest) {
  try {
    const settings = await getSettings().catch(() => null)
    const keyId = (settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim()
    const keySecret = (settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || '').trim()

    // Authentication / configuration check
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { message: 'Razorpay API credentials not configured in settings or environment variables' },
        { status: 401 }
      )
    }

    let body: any = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ message: 'Invalid JSON request body' }, { status: 400 })
    }

    const { amount, currency = 'INR', receipt, notes } = body

    // Validation: amount is required and numeric
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json(
        { message: 'Amount is required and must be numeric (in paise)' },
        { status: 400 }
      )
    }

    const parsedAmount = Math.round(Number(amount))

    // Minimum amount: 100 paise (₹1)
    if (parsedAmount < 100) {
      return NextResponse.json(
        { message: 'Amount must be at least 100 paise (₹1)' },
        { status: 400 }
      )
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const receiptId = receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    const order: any = await (razorpay.orders.create as any)({
      amount: parsedAmount,
      currency: currency || 'INR',
      receipt: receiptId,
      payment_capture: true,
      notes: notes || undefined,
    })

    // Return: { order_id, amount, currency }
    return NextResponse.json({
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: keyId,
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)

    const statusCode = error?.statusCode || error?.status
    if (statusCode === 401 || (error?.error && error?.error?.code === 'BAD_REQUEST_ERROR' && error?.error?.description?.toLowerCase().includes('auth'))) {
      return NextResponse.json(
        { message: error?.error?.description || 'Razorpay authentication failed: Invalid API credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: error?.error?.description || error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}
