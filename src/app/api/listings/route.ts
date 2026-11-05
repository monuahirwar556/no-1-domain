import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ensureDatabaseReady } from '@/lib/db-init'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseReady()
    const { searchParams } = new URL(request.url)
    const rawPage = parseInt(searchParams.get('page') || '1')
    const rawLimit = parseInt(searchParams.get('limit') || '12')
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 12 : Math.min(rawLimit, 100)
    const statusParam = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const where: any = statusParam && statusParam !== 'all' 
      ? { status: statusParam } 
      : { status: { in: ['ACTIVE', 'PENDING', 'DEMO'] } }
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true } },
          currentBidder: { select: { id: true, name: true } },
          _count: { select: { bids: true } },
        },
      }),
      prisma.listing.count({ where }),
    ])

    return NextResponse.json({
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    console.error('Get listings error:', error)
    return NextResponse.json({ message: 'Failed to fetch listings' }, { status: 500 })
  }
}