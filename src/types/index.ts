export interface User {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Listing {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  startingBid: number
  currentBid: number
  currentBidderId: string | null
  status: 'ACTIVE' | 'ENDED' | 'PENDING'
  endsAt: Date
  createdById: string
  createdAt: Date
  updatedAt: Date
  createdBy?: User
  currentBidder?: User | null
  bids?: Bid[]
}

export interface Bid {
  id: string
  amount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  position: number | null
  listingId: string
  userId: string
  paymentId: string | null
  createdAt: Date
  updatedAt: Date
  user?: User
  listing?: Listing
  payment?: Payment | null
}

export interface Payment {
  id: string
  razorpayOrderId: string
  razorpayPaymentId: string | null
  razorpaySignature: string | null
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  userId: string
  bidId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface LeaderboardEntry {
  position: number
  bid: Bid
  user: User
  isCurrentUser: boolean
}

export interface SiteSettings {
  currency: string
  currencySymbol: string
  top1Increment: number
  otherPositionIncrement: number
  minimumStartingBid: number
  maximumBid: number
  paymentGateway: string
  razorpayKeyId: string
  razorpayKeySecret: string
}

export interface BidValidationResult {
  valid: boolean
  message: string
  minBidRequired?: number
}

export interface CreateBidInput {
  listingId: string
  amount: number
}

export interface CreateOrderInput {
  amount: number
  currency: string
  receipt: string
}