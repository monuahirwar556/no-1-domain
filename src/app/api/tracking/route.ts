import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domainQuery = searchParams.get('domain')

    const where: any = { status: 'ACTIVE', currentBid: { gt: 0 } }
    if (domainQuery) {
      where.OR = [
        { domain: { contains: domainQuery } },
        { title: { contains: domainQuery } },
      ]
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { clicks: 'desc' },
      select: {
        id: true,
        title: true,
        domain: true,
        category: true,
        clicks: true,
        currentBid: true,
        imageUrl: true,
        updatedAt: true,
      },
    })

    const totalTrackedVisits = listings.reduce((sum, l) => sum + (l.clicks || 0), 0)

    // Recent 10 visits across all domains
    const recentGlobalVisits = await prisma.visit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        listing: {
          select: {
            id: true,
            domain: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      totalDomains: listings.length,
      totalTrackedVisits,
      domains: listings.map((l, index) => ({
        ...l,
        rankByVisits: index + 1,
      })),
      recentVisits: recentGlobalVisits.map((v) => ({
        id: v.id,
        domain: v.listing?.domain,
        title: v.listing?.title,
        time: v.createdAt.toISOString(),
      })),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error in global tracking summary:', error)
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 })
  }
}
