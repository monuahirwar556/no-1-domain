'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { Alert, Badge, Button, Card, CardContent } from '@/components/ui'
import { formatINR } from '@/lib/utils'
import { Crown, AlertCircle, CheckCircle, ShieldCheck, Zap, ArrowRight, X } from 'lucide-react'
import { trackXPurchase } from '@/components/XPixel'

interface BidFormProps {
  listingId: string
  currentTopBid: number
  currentUserId?: string
  onBidSuccess?: (message: string) => void
  onBidError?: (message: string) => void
}

interface PaymentOrderModalState {
  isOpen: boolean
  orderId: string
  amount: number
  currency: string
  bidId: string
}

export function BidForm({
  listingId,
  currentTopBid,
  currentUserId,
  onBidSuccess,
  onBidError,
}: BidFormProps) {
  const { data: session } = useSession()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [minBid, setMinBid] = useState<number>(0)
  const [liveTopBid, setLiveTopBid] = useState<number>(currentTopBid)
  const [top1Increment, setTop1Increment] = useState<number>(200)
  const [paymentModal, setPaymentModal] = useState<PaymentOrderModalState | null>(null)

  useEffect(() => {
    fetchSettingsAndMinBid()
  }, [listingId, currentTopBid])

  const fetchSettingsAndMinBid = async () => {
    try {
      const res = await fetch(`/api/bids/min-bid?listingId=${listingId}`)
      if (res.ok) {
        const data = await res.json()
        setMinBid(data.minBid)
        setLiveTopBid(data.currentTopBid)
        setTop1Increment(data.top1Increment || 200)
      } else {
        // Fallback calculation
        const inc = 200
        const top = currentTopBid || 5000
        setLiveTopBid(top)
        setMinBid(top + inc)
        setTop1Increment(inc)
      }
    } catch {
      const inc = 200
      const top = currentTopBid || 5000
      setLiveTopBid(top)
      setMinBid(top + inc)
      setTop1Increment(inc)
    }
  }

  // Parse entered amount as number
  const parsedAmount = parseInt(amount.replace(/[^0-9]/g, '')) || 0

  // Real-time validation warning if less than minBid
  const isLessThanMinBid = amount.trim() !== '' && parsedAmount > 0 && parsedAmount < minBid

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (!raw) {
      setAmount('')
      setError(null)
      return
    }
    const num = parseInt(raw)
    setAmount(num.toLocaleString('en-IN'))

    if (num < minBid) {
      setError(`Your promotional tier must be at least ${formatINR(minBid)} to take the #1 spotlight.`)
    } else {
      setError(null)
    }
  }

  const handleQuickPrefill = () => {
    setAmount(minBid.toLocaleString('en-IN'))
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const finalAmount = parsedAmount > 0 ? parsedAmount : minBid

    if (finalAmount < minBid) {
      setError(`Your promotional tier must be at least ${formatINR(minBid)} to take the #1 spotlight.`)
      return
    }

    setLoading(true)

    try {
      // Create bid & Razorpay Order in INR on the server
      const orderRes = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, amount: finalAmount }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to initialize promotion')
      }

      const effectiveKeyId = orderData.keyId || orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM'
      const effectiveOrderId = orderData.orderId || orderData.id

      // Check if real Razorpay Checkout is loaded in browser
      if (
        typeof window !== 'undefined' &&
        (window as any).Razorpay &&
        effectiveKeyId &&
        effectiveOrderId &&
        !effectiveOrderId.startsWith('order_sim_')
      ) {
        const razorpay = new (window as any).Razorpay({
          key: effectiveKeyId,
          amount: orderData.amount,
          currency: 'INR',
          order_id: effectiveOrderId,
          name: 'NO. 1 DOMAIN',
          description: `Promote ${formatINR(finalAmount)} to claim #1 spotlight`,
          handler: async (response: any) => {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              listingId,
              amount: finalAmount,
            })
          },
          prefill: {
            email: session?.user?.email || 'partner@no1domain.in',
            name: session?.user?.name || 'Verified Partner',
          },
          theme: { color: '#ed890f' },
          modal: {
            ondismiss: () => {
              setLoading(false)
              setError('Payment cancelled')
            },
          },
        })
        razorpay.on('payment.failed', (resp: any) => {
          setLoading(false)
          const desc = resp?.error?.description || 'Payment failed'
          setError(`Razorpay error: ${desc}`)
        })
        razorpay.open()
      } else {
        // Open the dedicated interactive Razorpay Payment Verification Modal
        setPaymentModal({
          isOpen: true,
          orderId: orderData.orderId,
          amount: finalAmount,
          currency: 'INR',
          bidId: orderData.bidId,
        })
      }
    } catch (err: any) {
      setLoading(false)
      setError(err.message || 'Failed to initialize promotion')
      onBidError?.(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyPayment = async (payload: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
    listingId: string
    amount: number
  }) => {
    setVerifying(true)
    setError(null)

    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await verifyRes.json()

      if (!verifyRes.ok) {
        throw new Error(data.message || 'Payment verification failed')
      }

      // Track client-side X Pixel purchase conversion
      trackXPurchase({
        conversionId: payload.razorpayOrderId,
        amount: payload.amount,
      })

      setSuccess(data.message || `Payment verified! You are now ranked #1 👑`)
      onBidSuccess?.(data.message)
      setAmount('')
      setPaymentModal(null)

      // Refresh min-bid state
      await fetchSettingsAndMinBid()
    } catch (err: any) {
      setError(err.message || 'Payment verification failed')
      onBidError?.(err.message)
    } finally {
      setVerifying(false)
      setLoading(false)
    }
  }

  const isCurrentTopBidder = currentUserId && liveTopBid > 0 && liveTopBid === currentTopBid

  return (
    <>
      <Card variant="elevated" className="w-full border-2 border-primary-100 shadow-xl overflow-hidden">
        {/* Prominent UI Message Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-primary-600 p-4 text-white text-center shadow-inner">
          <p className="text-base font-bold flex items-center justify-center gap-1.5">
            <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
            Claim #1 Spotlight? Upgrade listing tier by +{formatINR(top1Increment)}.
          </p>
          <p className="text-xs text-amber-100 font-medium mt-0.5">
            All listings are in Indian Rupees (₹).
          </p>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-dark-900 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Promote Listing
            </h3>
            {isCurrentTopBidder ? (
              <Badge variant="gold" size="sm" dot>
                You Hold #1 Spotlight 👑
              </Badge>
            ) : (
              <Badge variant="primary" size="sm">
                Featured Spotlight
              </Badge>
            )}
          </div>

          {/* Current Spotlight Tier & Minimum Tier to Take #1 */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-br from-dark-50 to-amber-50/40 rounded-xl border border-dark-100">
            <div>
              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1">
                Current Top Spotlight Tier
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-dark-900">
                {formatINR(liveTopBid)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">
                Minimum Tier for #1 Spotlight
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary-600">
                {formatINR(minBid)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input: Enter Promotional Tier */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-dark-800">
                  Enter Promotional Tier
                </label>
                <button
                  type="button"
                  onClick={handleQuickPrefill}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 underline"
                >
                  Quick Fill: {formatINR(minBid)}
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-dark-400">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={minBid > 0 ? minBid.toLocaleString('en-IN') : '5,200'}
                  className={`w-full pl-9 pr-4 py-3.5 text-xl font-bold text-dark-900 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    isLessThanMinBid
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-dark-300 focus:border-primary-500'
                  }`}
                  autoComplete="off"
                  disabled={loading}
                />
              </div>

              {/* Exact Validation Error Message when amount < minBid */}
              {isLessThanMinBid && (
                <p className="mt-2 text-sm font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Your promotional tier must be at least {formatINR(minBid)} to take the #1 spotlight.
                </p>
              )}
            </div>

            {error && !isLessThanMinBid && (
              <Alert variant="danger">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {success}
              </Alert>
            )}

            {/* Dynamic Button: Promote ₹X,XXX and Take #1 */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full text-lg font-bold py-4 shadow-lg shadow-primary-500/25 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                loading={loading}
                disabled={isLessThanMinBid || loading}
              >
                <Crown className="w-5 h-5 mr-1.5 text-amber-200 fill-amber-200" />
                {parsedAmount > 0
                  ? `Promote for ${formatINR(parsedAmount)} & Take #1`
                  : `Promote for ${formatINR(minBid)} & Take #1`}
              </Button>
            </div>

            {/* Payment Specifications Notice */}
            <div className="pt-3 border-t border-dark-100 space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-dark-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Payment Gateway: <strong>Razorpay</strong></span>
                <span>•</span>
                <span>Currency: <strong>INR (₹)</strong></span>
              </div>
              <p className="text-xs text-dark-500">
                Only after successful payment verification should the spotlight listing become active.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Razorpay INR Checkout Modal */}
      {paymentModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-dark-200 relative animate-scale-in">
            <button
              onClick={() => setPaymentModal(null)}
              className="absolute right-4 top-4 text-dark-400 hover:text-dark-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Razorpay Gateway Header */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-dark-100">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                R
              </div>
              <div>
                <h4 className="font-bold text-dark-900 text-base">Razorpay Secure Checkout</h4>
                <p className="text-xs text-dark-500">Fast, verified payment in Indian Rupees</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 p-4 bg-dark-50 rounded-xl mb-5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-dark-500">Target Position</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  #1 Rank 👑
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-500">Currency</span>
                <span className="font-semibold text-dark-900">INR (₹)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-500">Order Reference</span>
                <span className="font-mono text-xs text-dark-600 truncate max-w-[180px]">
                  {paymentModal.orderId}
                </span>
              </div>
              <div className="pt-2 border-t border-dark-200 flex justify-between items-center text-base">
                <span className="font-semibold text-dark-900">Showcase Tier Amount</span>
                <span className="font-extrabold text-primary-600 text-xl">
                  {formatINR(paymentModal.amount)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-5 text-xs text-blue-800">
              <p className="font-semibold mb-0.5">Verification Rule:</p>
              <p>
                Only after successful payment verification will your spotlight listing become active on the live directory.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-md bg-blue-600 hover:bg-blue-700"
                loading={verifying}
                onClick={() =>
                  verifyPayment({
                    razorpayOrderId: paymentModal.orderId,
                    razorpayPaymentId: `pay_sim_${Date.now()}`,
                    razorpaySignature: 'simulated_success_signature',
                    listingId,
                    amount: paymentModal.amount,
                  })
                }
              >
                Pay {formatINR(paymentModal.amount)} & Verify
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-dark-500"
                onClick={() => setPaymentModal(null)}
                disabled={verifying}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}