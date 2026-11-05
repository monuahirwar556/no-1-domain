import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminAuthorized } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { syncDummyDomainsWithRealCount } from '@/lib/demo-domains'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { par  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        currentBidder: { select: { id: true, name: true, email: true } },
        bids: {
          orderBy: { amount: 'desc' },
          take: 20,
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        },
      },
    })

    if (!listing) {
  return NextResponse.json({ message: 'Listing not found' }, { status: 404 })
}

const isAdmin = session?.user && (session.user as any).role === 'ADMIN'
const isOwner = session?.user && listing.createdById === (session.user as any)?.id

return NextResponse.json({ ...listing, isAdmin, isOwner })
  } catch (error: any) {
  console.error('Get listing error:', error)
  return NextResponse.json({ message: 'Failed to fetch listing' }, { status: 500 })
}
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin session required.' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const {
      title,
      domain,
      websiteUrl,
      videoUrl,
      description,
      category,
      imageUrl,
      currentBid,
      startingBid,
      clicks,
      endsAt,
      status
    } = body

    let cleanDomain: string | undefined = undefined
    if (domain !== undefined) {
      cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
    }
    let cleanUrl = websiteUrl !== undefined ? websiteUrl.trim() : undefined
    if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (cleanDomain !== undefined) updateData.domain = cleanDomain
    if (cleanUrl !== undefined) updateData.websiteUrl = cleanUrl
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl || null
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (currentBid !== undefined) updateData.currentBid = parseInt(currentBid) || 0
    if (startingBid !== undefined) updateData.startingBid = parseInt(startingBid) || 0
    if (clicks !== undefined) updateData.clicks = parseInt(clicks) || 0
    if (status !== undefined) updateData.status = status
    if (endsAt !== undefined) updateData.endsAt = new Date(endsAt)

    const listing = await prisma.listing.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error('Update listing error:', error)
    return NextResponse.json({ message: 'Failed to update listing: ' + (error.message || 'Unknown error') }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthorized = await isAdminAuthorized(request)
    if (!isAuthorized) {
      return NextResponse.json({ message: 'Unauthorized. Admin session required.' }, { status: 401 })
    }

    const { id } = params

    // First delete associated bids to avoid foreign key constraints
    await prisma.bid.deleteMany({
      where: { listingId: id },
    })

    await prisma.listing.delete({
      where: { id }
    })

    // If real domain was deleted, re-sync dummy domains so board stays populated
    await syncDummyDomainsWithRealCount()

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error: any) {
    console.error('Delete listing error:', error)
    return NextResponse.json({ message: 'Failed to delete listing: ' + (error.message || 'Unknown error') }, { status: 500 })
  }
}