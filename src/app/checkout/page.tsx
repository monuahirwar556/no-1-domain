'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatINR } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'
import {
  Crown,
  Globe,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowUpRight,
  Zap,
  QrCode,
  Copy,
  Check,
  X,
  CreditCard,
  Smartphone,
} from 'lucide-react'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

function CheckoutContent() {
  const { isDark } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Ecommerce & Retail')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(50)
  const [minBidForTop1, setMinBidForTop1] = useState(50)
  const [top1Bid, setTop1Bid] = useState(0)
  const [top1Increment, setTop1Increment] = useState(50)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch current board stats to set correct pricing
  useEffect(() => {
    fetch('/api/domains')
      .then((res) => res.json())
      .then((data) => {
        const t1Bid = data.top1Bid || 0
        const inc = data.top1Increment || 50
        const requiredTop1 = data.minBidForTop1 || (t1Bid > 0 ? t1Bid + inc : 50)
        setTop1Bid(t1Bid)
        setTop1Increment(inc)
        setMinBidForTop1(requiredTop1)

        // Read prefill from query params if present
        const queryAmount = searchParams.get('amount')
        const queryUrl = searchParams.get('url')
        const queryTitle = searchParams.get('title')

        if (queryAmount) {
          const parsed = parseInt(queryAmount)
          setAmount(isNaN(parsed) || parsed < 50 ? 50 : parsed)
        } else {
          setAmount(50)
        }

        if (queryUrl) setUrl(queryUrl)
        if (queryTitle) setTitle(queryTitle)
      })
      .catch((e) => console.error('Error fetching board stats:', e))
      .finally(() => setLoading(false))

    // Fetch live UPI ID from public settings
    fetch('/api/admin/settings/public')
      .then((res) => res.json())
      .then((settings) => {
        if (settings?.upiId) setUpiId(settings.upiId)
        if (settings?.qrEnabled !== undefined) {
          setQrEnabled(Boolean(settings.qrEnabled))
          if (!settings.qrEnabled) {
            setActiveTab('razorpay')
          }
        }
      })
      .catch(() => {})
  }, [searchParams])

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [activePaymentData, setActivePaymentData] = useState<any>(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [activeTab, setActiveTab] = useState<'qr' | 'razorpay'>('qr')
  const [upiId, setUpiId] = useState('paytm-7828003666@paytm')
  const [qrEnabled, setQrEnabled] = useState(true)

  const executeVerification = async (payload: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
    listingId: string
    amount: number
    domain?: string
    url?: string
    title?: string
    category?: string
  }) => {
    try {
      setVerifyingPayment(true)
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          domain: payload.domain || activePaymentData?.domain || url,
          url: payload.url || url,
          title: payload.title || title || url,
          category: payload.category || category,
        }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || 'Payment verification failed')
      }

      setPaymentModalOpen(false)
      setSuccess(`Payment of ${formatINR(payload.amount)} verified! Your domain is now live on the board.`)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error processing payment verification')
    } finally {
      setVerifyingPayment(false)
      setSubmitting(false)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!url.trim()) {
      setError('Please enter your website URL or domain name')
      return
    }

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service and Board Rules to proceed')
      return
    }

    try {
      setSubmitting(true)

      const effectiveAmount = Math.max(50, amount)

      // Step 1: Create Order on server
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim() || undefined,
          category,
          description: description.trim() || undefined,
          amount: effectiveAmount,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to initialize showcase checkout')
      }

      setActivePaymentData(data)
      let razorpayOpened = false

      if (typeof window !== 'undefined') {
        const loadRazorpay = (): Promise<boolean> => {
          return new Promise((resolve) => {
            if ((window as any).Razorpay) return resolve(true)
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
          })
        }

        const isLoaded = await loadRazorpay()

        if (isLoaded && (window as any).Razorpay && data.orderId && !data.orderId.startsWith('order_sim_')) {
          try {
            const options: any = {
              key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
              amount: amount * 100, // paise
              currency: 'INR',
              name: 'NO. 1 DOMAIN',
              description: `Claim spot for ${data.domain || url}`,
              image: '/images/logo-transparent.png',
              order_id: data.orderId,
              handler: async function (response: any) {
                await executeVerification({
                  razorpayOrderId: response.razorpay_order_id || data.orderId,
                  razorpayPaymentId: response.razorpay_payment_id || '',
                  razorpaySignature: response.razorpay_signature || '',
                  listingId: data.listingId,
                  amount,
                })
              },
              prefill: {
                name: title.trim() || 'Partner',
                email: 'contact@' + (data.domain || 'no1domain.in'),
              },
              theme: {
                color: '#eab308',
              },
              modal: {
                ondismiss: function () {
                  setSubmitting(false)
                },
              },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.on('payment.failed', function (resp: any) {
              const failureReason = resp?.error?.description || 'Payment was declined or failed.'
              setError(`Razorpay error: ${failureReason}`)
              setPaymentModalOpen(true)
              setSubmitting(false)
            })
            rzp.open()
            razorpayOpened = true
          } catch (rzpErr) {
            console.warn('Razorpay popup error, opening payment modal fallback:', rzpErr)
          }
        }
      }

      // If Razorpay popup wasn't opened, open interactive UPI QR / Gateway modal
      if (!razorpayOpened) {
        setPaymentModalOpen(true)
      }
    } catch (err: any) {
      setError(err.message || 'Error initializing payment checkout')
    } finally {
      setSubmitting(false)
    }
  }

  const isTop1 = amount >= minBidForTop1

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090a10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-yellow-400 selection:text-slate-950 transition-colors`}>
      {/* Background Glow */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[130px]" />
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${isDark ? 'bg-[#090a10]/90 border-purple-500/20' : 'bg-white/90 border-slate-200 shadow-sm'} border-b transition-colors`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-700 hover:text-amber-600'} transition-colors group flex-shrink-0`}
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">Back to Live Board</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className={`hidden sm:flex text-xs font-black ${isDark ? 'text-amber-400' : 'text-amber-700'} items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'} animate-pulse`} />
              NO. 1 DOMAIN
            </span>
            <SiteThemeToggle />
          </div>
        </div>
      </header>

      {/* Checkout Card Form */}
      <main className="relative z-10 max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="rounded-3xl border-2 border-yellow-500/30 bg-[#0e0f1a] shadow-2xl overflow-hidden">
          {/* Top Bar (Exact user screenshot design) */}
          <div className="p-5 sm:p-6 pb-2 border-b border-purple-500/15">
            <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-cyan-400 block mb-1">
              SECURE CHECKOUT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Confirm this rank
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Check the rank and price, then agree to the Terms of Service to continue.
            </p>
          </div>

          <form onSubmit={handleCheckout} className="p-5 sm:p-6 space-y-4">
            {/* Rank & Price Card (Exact layout from user screenshot) */}
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-[#141528] flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  RANK
                </span>
                <div className="flex items-center gap-1.5 my-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                    {isTop1 ? '#1 👑' : '#Competitive'}
                  </span>
                </div>
                <span className="text-xs text-purple-300 font-bold block truncate max-w-[160px]">
                  {category}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  PRICE
                </span>
                <strong className="text-2xl sm:text-3xl font-black text-yellow-400 block my-0.5">
                  {formatINR(amount)}
                </strong>
                <span className="text-xs text-zinc-400 font-medium block">
                  Due now
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              A listing at that rank on the public board. It goes live when payment confirms. Someone else can claim a higher rank.
            </p>

            {/* Domain & URL Input */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Website URL / Domain Name <span className="text-yellow-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. yourbrand.in or https://..."
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-purple-500/30 bg-[#090a12] text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-500/30 bg-[#090a12] text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Showcase / Listing Tier (INR ₹)
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setAmount((prev) => Math.max(50, prev - top1Increment))}
                      disabled={amount <= 50}
                      className="px-3 py-2.5 rounded-xl border border-purple-500/30 bg-[#151628] text-xs font-black text-yellow-400 hover:bg-[#1f2038] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Math.max(50, parseInt(e.target.value) || 50))}
                      className="w-full text-center py-2.5 rounded-xl border border-purple-500/30 bg-[#090a12] text-yellow-400 font-black text-xs"
                      min={50}
                      step={50}
                    />
                    <button
                      type="button"
                      onClick={() => setAmount((prev) => prev + top1Increment)}
                      className="px-3 py-2.5 rounded-xl border border-purple-500/30 bg-[#151628] text-xs font-black text-yellow-400 hover:bg-[#1f2038]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Brand / Website Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. YourBrand Official Store"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-[#090a12] text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Terms Checkbox Card */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
              termsAccepted
                ? 'border-yellow-400/60 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.1)]'
                : 'border-purple-500/30 bg-[#0c0d16] hover:border-purple-500/50'
            }`}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400 cursor-pointer accent-yellow-400"
              />
              <span className="text-xs text-zinc-300 leading-relaxed">
                I have read and agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-amber-400 font-bold underline hover:text-amber-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  href="/rules"
                  target="_blank"
                  className="text-cyan-400 font-bold underline hover:text-cyan-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  Board Rules
                </Link>{' '}
                of NO. 1 DOMAIN (no1domain.in).
              </span>
            </label>

            {/* Error / Success banners */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Modal Sub-Footer Links */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <div className="flex items-center gap-2">
                <Link href="/privacy" target="_blank" className="hover:text-cyan-400 hover:underline">
                  Privacy
                </Link>
                <span>·</span>
                <Link href="/rules" target="_blank" className="hover:text-yellow-400 hover:underline">
                  Rules
                </Link>
                <span>·</span>
                <Link href="/terms" target="_blank" className="hover:text-purple-400 hover:underline">
                  Terms
                </Link>
              </div>
              <div className="flex items-center gap-1 font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Razorpay Secure</span>
              </div>
            </div>

            {/* Actions: Cancel & Continue to checkout */}
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/"
                className="flex-1 py-3 text-center rounded-full border border-zinc-700 hover:bg-zinc-800 text-xs font-bold text-zinc-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!termsAccepted || submitting}
                className={`flex-[1.5] py-3 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 ${
                  termsAccepted
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-yellow-500/25 hover:from-yellow-300 hover:to-yellow-400 cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                }`}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <span>Continue to checkout ({formatINR(amount)})</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* Interactive Razorpay / UPI QR Payment Gateway Modal */}
      {paymentModalOpen && activePaymentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-yellow-500/40 bg-[#0e0f1a] p-5 sm:p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close payment modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-purple-500/20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-md">
                ₹
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                    SECURE PAYMENT
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Complete Spotlight Listing Payment
                </h3>
              </div>
            </div>

            {/* Order Summary */}
            <div className="my-4 p-3.5 rounded-2xl bg-[#141528] border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Target Domain</span>
                <span className="text-sm font-black text-yellow-400 block truncate max-w-[180px]">
                  {activePaymentData.domain || url}
                </span>
                <span className="text-[10px] font-bold text-emerald-400">Position: #1 Spotlight 👑</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Amount Due</span>
                <strong className="text-xl font-black text-yellow-400 block">
                  {formatINR(amount)}
                </strong>
                <span className="text-[10px] text-zinc-400">INR (Instant)</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            {qrEnabled ? (
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#090a12] border border-purple-500/20 mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'qr'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 shadow-md font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('razorpay')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'razorpay'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 shadow-md font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Razorpay Gateway</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#090a12] border border-purple-500/20 mb-4 text-xs font-bold text-center text-amber-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Razorpay Gateway Checkout</span>
              </div>
            )}

            {/* Tab 1: UPI QR Code */}
            {activeTab === 'qr' && (
              <div className="space-y-3.5 text-center animate-in fade-in duration-150">
                <div className="mx-auto w-[180px] h-[180px] p-2 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-yellow-400/50">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `upi://pay?pa=${upiId}&pn=NO.1%20DOMAIN&am=${amount}&cu=INR&tn=Domain_Showcase_${activePaymentData.domain || 'no1'}`
                    )}`}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-300">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scan with PhonePe, Paytm, Google Pay or BHIM</span>
                </div>

                {/* UPI ID copy box */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#141528] border border-purple-500/20 text-xs">
                  <span className="font-mono text-zinc-300 truncate">{upiId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(upiId)
                      setCopiedUpi(true)
                      setTimeout(() => setCopiedUpi(false), 2000)
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 ml-2 flex-shrink-0"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy UPI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Razorpay Gateway Popup Trigger */}
            {activeTab === 'razorpay' && (
              <div className="space-y-4 py-2 text-center animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-[#141528] border border-purple-500/20 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official Razorpay Gateway</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Click the button below to launch the official Razorpay Checkout popup supporting Credit/Debit Cards, Netbanking, and UPI.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).Razorpay) {
                      const options: any = {
                        key: activePaymentData?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
                        amount: amount * 100,
                        currency: 'INR',
                        name: 'NO. 1 DOMAIN',
                        description: `Claim spot for ${activePaymentData?.domain || url}`,
                        handler: async function (response: any) {
                          await executeVerification({
                            razorpayOrderId: response.razorpay_order_id || activePaymentData?.orderId,
                            razorpayPaymentId: response.razorpay_payment_id || '',
                            razorpaySignature: response.razorpay_signature || '',
                            listingId: activePaymentData?.listingId,
                            amount,
                          })
                        },
                        modal: {
                          ondismiss: function () {
                            setSubmitting(false)
                          },
                        },
                      }
                      if (activePaymentData.orderId && !activePaymentData.orderId.startsWith('order_sim_')) {
                        options.order_id = activePaymentData.orderId
                      }
                      const rzpInstance = new (window as any).Razorpay(options)
                      rzpInstance.on('payment.failed', function (failedResp: any) {
                        const reason = failedResp?.error?.description || 'Payment was declined.'
                        setError(`Razorpay error: ${reason}`)
                        setSubmitting(false)
                      })
                      rzpInstance.open()
                    }
                  }}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-xs sm:text-sm hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Launch Razorpay Popup ({formatINR(amount)})</span>
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-purple-500/20 mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).Razorpay) {
                    const options: any = {
                      key: activePaymentData?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                      amount: amount * 100,
                      currency: 'INR',
                      name: 'NO. 1 DOMAIN',
                      description: `Claim spot for ${activePaymentData?.domain || url}`,
                      order_id: activePaymentData?.orderId,
                      handler: async function (response: any) {
                        await executeVerification({
                          razorpayOrderId: response.razorpay_order_id || activePaymentData?.orderId,
                          razorpayPaymentId: response.razorpay_payment_id,
                          razorpaySignature: response.razorpay_signature,
                          listingId: activePaymentData?.listingId,
                          amount,
                        })
                      },
                      modal: {
                        ondismiss: function () {
                          setSubmitting(false)
                        },
                      },
                    }
                    const rzpInstance = new (window as any).Razorpay(options)
                    rzpInstance.on('payment.failed', function (failedResp: any) {
                      const reason = failedResp?.error?.description || 'Payment was declined.'
                      setError(`Razorpay error: ${reason}`)
                      setSubmitting(false)
                    })
                    rzpInstance.open()
                  } else {
                    setError('Razorpay SDK loading. Please retry.')
                  }
                }}
                disabled={verifyingPayment}
                className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                {verifyingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Proceed to Secure Payment ({formatINR(amount)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                disabled={verifyingPayment}
                className="w-full py-2 text-center text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090a10] text-slate-100 flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
