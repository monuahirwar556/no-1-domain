import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSettings()
    // Only return public settings
    return NextResponse.json({
      top1Increment: settings.top1Increment,
      otherPositionIncrement: settings.otherPositionIncrement,
      minimumStartingBid: settings.minimumStartingBid,
      maximumBid: settings.maximumBid,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      paymentGateway: settings.paymentGateway,
      razorpayKeyId: settings.razorpayKeyId,
      upiId: settings.upiId,
      qrEnabled: settings.qrEnabled,
    })
  } catch (error: any) {
    console.error('Public settings error:', error)
    return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 })
  }
}