'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatINR } from '@/lib/utils'
import { Button, Card, CardContent, Badge, Alert } from '@/components/ui'
import { BidForm } from '@/components/bid'
import { Leaderboard } from '@/components/leaderboard'
import { Crown, Clock, ArrowLeft, Share2, Eye, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

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
  createdById?: string
  createdBy: { id: string; name: string | null; email: string }
  currentBidder: { id: string; name: string | null; email: string } | null
  bids: Array<{
    id: string
    amount: number
    createdAt: string
    user: { id: string; name: string | null; email: string; avatar: string | null }
  }>
}

export default function ListingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboardEntries, setLeaderboardEntries] = useState<any[]>([])
  const [top1Increment, setTop1Increment] = useState<number>(200)

  useEffect(() => {
    fetchListing()
    fetchLeaderboard()
    fetchMinBidInfo()
  }, [params.id])

  const fetchMinBidInfo = async () => {
    try {
      const res = await fetch(`/api/bids/min-bid?listingId=${params.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data.top1Increment) setTop1Increment(data.top1Increment)
      }
    } catch (err) {
      console.error('Failed to fetch min bid info:', err)
    }
  }

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('Listing not found')
          router.push('/listings')
        }
        throw new Error('Failed to fetch listing')
      }
      const data = await res.json()
      setListing(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?listingId=${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setLeaderboardEntries(data.entries || [])
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    }
  }

  const handleBidSuccess = (message: string) => {
    fetchLeaderboard()
    // Refresh listing to get updated current bid
    fetchListing()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-dark-200 animate-pulse rounded w-1/3" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-dark-200 animate-pulse rounded-xl" />
              <div className="space-y-4">
                <div className="h-64 bg-dark-200 animate-pulse rounded-xl" />
                <div className="h-80 bg-dark-200 animate-pulse rounded-xl" />
              </div>
            </div>
            <div className="h-96 bg-dark-200 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Crown className="w-16 h-16 mx-auto text-dark-300 mb-4" />
          <h1 className="text-2xl font-bold text-dark-900 mb-2">Listing Not Found</h1>
          <p className="text-dark-500 mb-6">{error || 'This listing does not exist or has been removed.'}</p>
          <Link href="/listings">
            <Button>Browse Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  const timeLeft = getTimeRemaining(listing.endsAt)
  const isEnded = timeLeft.expired || listing.status !== 'ACTIVE'
  const isOwner = session?.user && (listing.createdById === (session.user as any)?.id || listing.createdBy?.id === (session.user as any)?.id)
  const isCurrentBidder = session?.user && listing.currentBidderId === (session.user as any)?.id

  const leaderboardData = leaderboardEntries.map((entry, index) => ({
    position: index + 1,
    bid: {
      id: entry.bid.id,
      amount: entry.bid.amount,
      createdAt: entry.bid.createdAt,
      user: entry.bid.user,
    },
    isCurrentUser: entry.isCurrentUser,
  }))

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
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
            <Link href="/listings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant={listing.status === 'ACTIVE' && !isEnded ? 'success' : (listing.status === 'PENDING' ? 'warning' : 'danger')} dot>
            {listing.status === 'ACTIVE' && !isEnded ? 'Live' : listing.status}
          </Badge>
          <Badge variant="default">{listing.category}</Badge>
          {isOwner && <Badge variant="info">You created this</Badge>}
          {isCurrentBidder && <Badge variant="gold">You are #1 👑</Badge>}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Listing Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {listing.imageUrl && (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-dark-100">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title & Description */}
            <div>
              <h1 className="text-3xl font-bold text-dark-900 mb-4">{listing.title}</h1>
              <div className="prose prose-dark max-w-none text-dark-600">
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>

            {/* Bid Form */}
            {!isEnded && (
              <Card variant="elevated">
                <CardContent className="p-6">
                  <BidForm
                    listingId={listing.id}
                    currentTopBid={listing.currentBid}
                    currentUserId={session?.user?.id}
                    onBidSuccess={handleBidSuccess}
                  />
                </CardContent>
              </Card>
            )}

            {isEnded && (
              <Alert variant={isCurrentBidder ? 'success' : 'info'} className="mb-6">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  <span>
                    Showcase cycle completed. 
                    {isCurrentBidder 
                      ? 'Congratulations! Your showcase position is active with ' + formatINR(listing.currentBid)
                      : 'Featured Leader: ' + (listing.currentBidder?.name || 'Partner') + ' with ' + formatINR(listing.currentBid)}
                  </span>
                </div>
              </Alert>
            )}

            {/* Leaderboard */}
            <Card variant="outlined">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-dark-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    Live Leaderboard
                  </h2>
                  <Badge variant="default">{listing.bids.length} spotlight tiers</Badge>
                </div>
                <Leaderboard
                  entries={leaderboardData}
                  currentUserId={session?.user?.id}
                  listingId={listing.id}
                />
              </CardContent>
            </Card>

            {/* Listing Info */}
            <Card variant="outlined">
              <CardContent className="p-6">
                <h3 className="font-semibold text-dark-900 mb-4">Listing Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-dark-500">Created by</p>
                    <p className="font-medium text-dark-900">{listing.createdBy.name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500">Created on</p>
                    <p className="font-medium text-dark-900">
                      {new Date(listing.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500">Starting Tier</p>
                    <p className="font-medium text-dark-900">{formatINR(listing.startingBid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500">Current Showcase Tier</p>
                    <p className="font-bold text-primary-600 text-lg">{formatINR(listing.currentBid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500">Ends</p>
                    <p className="font-medium text-dark-900 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(listing.endsAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-dark-500">Time Remaining</p>
                    <p className="font-bold text-primary-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {timeLeft.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Current Spotlight Card */}
            <Card variant="elevated" className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-dark-500 mb-1">Current Spotlight Tier</p>
                  <p className="text-4xl font-bold text-dark-900">{formatINR(listing.currentBid)}</p>
                  {listing.currentBidder && (
                    <p className="text-sm text-dark-500 mt-2">
                      Featured Brand: <span className="font-medium text-dark-900">{listing.currentBidder.name || 'Listing Partner'}</span>
                    </p>
                  )}
                </div>

                <div className="p-4 bg-primary-50 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 text-primary-700 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Claim Spotlight #1</span>
                  </div>
                  <p className="text-center text-primary-700">
                    Upgrade to top showcase tier by <strong>+{formatINR(top1Increment)}</strong>
                  </p>
                  <p className="text-center text-xs text-primary-600 mt-1">
                    Next spotlight tier: {formatINR(listing.currentBid + top1Increment)}
                  </p>
                </div>

                <div className="text-center text-sm text-dark-500">
                  <p>All listings in <strong>Indian Rupees (₹)</strong></p>
                  <p className="mt-1">Secure payments via <strong>Razorpay</strong></p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card variant="outlined">
              <CardContent className="p-6">
                <h3 className="font-semibold text-dark-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-500">Spotlight Upgrades</p>
                        <p className="font-bold text-dark-900">{listing.bids.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-500">Promoter Brands</p>
                        <p className="font-bold text-dark-900">
                          {new Set(listing.bids.map(b => b.user.id)).size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-500">Tier Increment</p>
                        <p className="font-bold text-dark-900">{formatINR(top1Increment)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card variant="outlined">
              <CardContent className="p-6">
                <h3 className="font-semibold text-dark-900 mb-4">Share this Listing</h3>
                <button
                  onClick={async () => {
                    if (navigator.share) {
                      await navigator.share({
                        title: 'https://no1domain.in/',
                        url: 'https://no1domain.in/',
                      })
                    } else {
                      navigator.clipboard.writeText('https://no1domain.in/')
                      alert('Link copied: https://no1domain.in/')
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dark-300 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Listing</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-dark-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-dark-500 space-y-1">
          <p>All listings in Indian Rupees (₹) | Spotlight increments: ₹50 | Payments via Razorpay</p>
          <p className="text-xs text-dark-400">© 2026 NO. 1 DOMAIN (no1domain.in). Registered Proprietor: MONU AHIRWAR.</p>
        </div>
      </footer>
    </div>
  )
}