'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { Button, Card, CardContent, Badge, Input } from '@/components/ui'
import { Crown, Clock, Filter, Search, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  startingBid: number
  currentBid: number
  currentBidderId: string | null
  status: string
  endsAt: string
  createdAt: string
  createdBy: { id: string; name: string | null }
  currentBidder: { id: string; name: string | null } | null
  _count: { bids: number }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function ListingsClient() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 })

  useEffect(() => {
    fetchListings()
    fetchCategories()
  }, [activeCategory, searchQuery, pagination.page])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'all') params.set('category', activeCategory)
      if (searchQuery) params.set('search', searchQuery)
      params.set('status', 'all')
      params.set('page', String(pagination.page))
      params.set('limit', String(pagination.limit))

      const res = await fetch(`/api/listings?${params}`)
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings || [])
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/listings?limit=100')
      if (res.ok) {
        const data = await res.json()
        const cats = Array.from(new Set(data.listings.map((l: Listing) => l.category))) as string[]
        setCategories(cats)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const getTimeRemaining = (endsAt: string) => {
    const now = new Date().getTime()
    const end = new Date(endsAt).getTime()
    const diff = end - now

    if (diff <= 0) return { text: 'Ended', expired: true }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return { text: `${days}d ${hours}h`, expired: false }
    if (hours > 0) return { text: `${hours}h ${minutes}m`, expired: false }
    return { text: `${minutes}m`, expired: false }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-black/90 border border-purple-500/30 p-0.5 flex items-center justify-center shadow-md">
                <img src="/images/logo-transparent.png" alt="Emblem" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(192,132,252,0.8)]" />
              </div>
              <div className="flex items-center text-lg font-black tracking-tight">
                <span className="text-yellow-500">NO. 1</span>
                <span className="ml-1 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">DOMAIN</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/listings">
                <Button variant="ghost" size="sm">Browse Listings</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Verified Domain Showcase Directory</h1>
          <p className="text-dark-600">Discover premium domains and claim top spotlight positions • NO. 1 DOMAIN</p>
        </div>

        {/* Search & Filters */}
        <Card variant="outlined">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-dark-400" />
                <select
                  value={activeCategory}
                  onChange={(e) => {
                    setActiveCategory(e.target.value)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="px-4 py-2.5 border border-dark-300 rounded-lg bg-white text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between my-6">
          <p className="text-dark-600">
            {pagination.total} listing{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} variant="outlined" className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-dark-200 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-dark-200 animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-dark-200 animate-pulse rounded w-full" />
                  <div className="h-4 bg-dark-200 animate-pulse rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <Card variant="outlined" className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto text-dark-300 mb-4" />
            <h3 className="text-lg font-medium text-dark-900 mb-2">No listings found</h3>
            <p className="text-dark-500 mb-6">
              {searchQuery || activeCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No active showcase listings at the moment.'}
            </p>
            {(searchQuery || activeCategory !== 'all') && (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => {
                const timeLeft = getTimeRemaining(listing.endsAt)
                const isEnded = timeLeft.expired
                const bidCount = listing._count.bids

                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card variant="outlined" className="card-hover h-full overflow-hidden">
                      {listing.imageUrl && (
                        <div className="h-40 bg-dark-100 relative overflow-hidden">
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {isEnded && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="danger" className="text-lg px-4 py-2">ENDED</Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="default" size="sm">{listing.category}</Badge>
                          {!isEnded && (
                            listing.status === 'PENDING' ? (
                              <Badge variant="warning" size="sm" dot>PENDING</Badge>
                            ) : (
                              <Badge variant="success" size="sm" dot>Live</Badge>
                            )
                          )}
                        </div>
                        <h3 className="font-semibold text-dark-900 mb-2 line-clamp-2">{listing.title}</h3>
                        <p className="text-dark-500 text-sm mb-4 line-clamp-2">{listing.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-dark-500">Showcase Tier</span>
                            <span className="text-xl font-bold text-dark-900">{formatINR(listing.currentBid)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-dark-500">Starting Tier</span>
                            <span className="font-medium text-dark-900">{formatINR(listing.startingBid)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-dark-500">Spotlight Level</span>
                            <span className="font-medium text-dark-900">{bidCount}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-dark-500 pt-3 border-t border-dark-100">
                          <Clock className="w-4 h-4" />
                          <span>{timeLeft.text}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-dark-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-dark-500 space-y-1">
          <p>All listings in Indian Rupees (₹) | Spotlight increments: ₹50 | Payments via Razorpay</p>
          <p className="text-xs text-dark-400">© 2026 NO. 1 DOMAIN (no1domain.in). Registered Proprietor: MONU AHIRWAR.</p>
        </div>
      </footer>
    </div>
  )
}