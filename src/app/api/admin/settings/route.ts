import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/auth'
import { getSettings, updateSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Get settings error:', error)
    return NextResponse.json({ message: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Please log in as Admin first.' }, { status: 401 })
    }

    const body = await request.json()
    await updateSettings(body)

    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 })
  }
}