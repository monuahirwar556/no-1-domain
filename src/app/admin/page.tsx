'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Crown,
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  TrendingUp,
  Globe,
  MousePointerClick,
  Layers,
  ArrowUpRight,
  Shield,
  Save,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowLeft,
  Settings as SettingsIcon,
  Sliders,
  DollarSign,
  LogOut,
  QrCode,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Video,
  Play,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'
import { CATEGORIES } from '@/lib/categories'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

interface AdminListing {
  id: string
  rank: number
  title: string
  domain: string
  websiteUrl: string
  videoUrl?: string
  description: string
  category: string
  currentBid: number
  startingBid: number
  clicks: number
  imageUrl: string
  status: 'ACTIVE' | 'PENDING' | 'PAUSED' | 'REJECTED' | 'DEMO'
  createdAt: string
  currentBidder?: { id: string; name: string; email: string }
}

interface PlatformSettings {
  currency: string
  currencySymbol: string
  top1Increment: number
  otherPositionIncrement: number
  minimumStartingBid: number
  maximumBid: number
  paymentGateway: string
  razorpayKeyId: string
  razorpayKeySecret: string
  upiId: string
  qrEnabled: boolean
  xPixelId?: string
  xPixelToken?: string
  xConversionEventId?: string
}

const QUICK_DOMAIN_PRESETS = [
  { domain: 'zomato.com', title: 'Zomato India', category: 'Food Delivery & Dining', description: 'Restaurant discovery and online food delivery service across India.' },
  { domain: 'swiggy.com', title: 'Swiggy', category: 'Food Delivery & Dining', description: 'Instant food ordering and grocery delivery platform.' },
  { domain: 'flipkart.com', title: 'Flipkart', category: 'Ecommerce & Retail', description: 'Leading Indian ecommerce marketplace for electronics, fashion and more.' },
  { domain: 'bookmyshow.com', title: 'BookMyShow', category: 'Entertainment', description: 'Online movie tickets, events, sports, and entertainment portal.' },
  { domain: 'cred.club', title: 'CRED', category: 'Fintech & Banking', description: 'Credit card rewards, payments, and financial management app.' },
  { domain: 'makemytrip.com', title: 'MakeMyTrip', category: 'Travel & Airlines', description: 'Flight tickets, hotel booking, holiday packages and travel services.' },
  { domain: 'nykaa.com', title: 'Nykaa', category: 'Beauty & Personal Care', description: 'Premier beauty, cosmetics, fashion and wellness destination in India.' },
]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isDark } = useTheme()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin')
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])
  const adminMode = 'website'
  const [activeTab, setActiveTab] = useState<'listings' | 'live_traffic' | 'settings'>('listings')
  const [listings, setListings] = useState<AdminListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Real-Time Live Visitors & Stay Duration ("Kitni der ruka") State
  const [liveTraffic, setLiveTraffic] = useState<{
    liveOnlineCount: number
    activeVisitors: any[]
    recentDeparted: any[]
  }>({ liveOnlineCount: 1, activeVisitors: [], recentDeparted: [] })

  useEffect(() => {
    const fetchLive = () => {
      fetch('/api/track-visit/live')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLiveTraffic({
              liveOnlineCount: data.liveOnlineCount || 0,
              activeVisitors: data.activeVisitors || [],
              recentDeparted: data.recentDeparted || [],
            })
          }
        })
        .catch(() => {})
    }

    fetchLive()
    const timer = setInterval(fetchLive, 2500)
    return () => clearInterval(timer)
  }, [])

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<AdminListing | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    domain: '',
    websiteUrl: '',
    videoUrl: '',
    category: 'Ecommerce & Retail',
    currentBid: 0,
    clicks: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'PENDING' | 'PAUSED' | 'REJECTED' | 'DEMO',
    description: '',
  })

  // Add Domain Modal State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [newFormData, setNewFormData] = useState({
    title: '',
    domain: '',
    websiteUrl: '',
    videoUrl: '',
    category: 'Ecommerce & Retail',
    currentBid: 50,
    clicks: 0,
    description: '',
  })

  // Settings State
  const [settings, setSettings] = useState<PlatformSettings>({
    currency: 'INR',
    currencySymbol: '₹',
    top1Increment: 10,
    otherPositionIncrement: 10,
    minimumStartingBid: 10,
    maximumBid: 10000000,
    paymentGateway: 'Razorpay',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    upiId: '',
    qrEnabled: true,
    xPixelId: '',
    xPixelToken: '',
    xConversionEventId: '',
  })
  const [savingSettings, setSavingSettings] = useState(false)
  const [testingApi, setTestingApi] = useState(false)
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testingXApi, setTestingXApi] = useState(false)
  const [xApiTestResult, setXApiTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Show Toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleTestXApi = async () => {
    setTestingXApi(true)
    setXApiTestResult(null)
    try {
      const pid = encodeURIComponent(settings.xPixelId || 'rgkb5')
      const tok = encodeURIComponent(settings.xPixelToken || '')
      const ev = encodeURIComponent(settings.xConversionEventId || 'tw-rgkb5-purchase')
      const res = await fetch(`/api/conversions/x?pixelId=${pid}&token=${tok}&eventId=${ev}`)
      const data = await res.json()
      if (data.xApiStatus === 200 || data.success) {
        setXApiTestResult({ success: true, message: '✅ Success! X Ads Conversions API connected and test event received.' })
        showToast('success', 'X Ads Conversion Ping Succeeded!')
      } else if (data.xApiResponse?.errors?.[0]?.message) {
        const err = data.xApiResponse.errors[0]
        setXApiTestResult({
          success: false,
          message: `X API (HTTP ${data.xApiStatus}): ${err.message} (${err.parameter || err.code || ''})`
        })
        showToast('error', `X API: ${err.message}`)
      } else {
        setXApiTestResult({
          success: false,
          message: `X API (HTTP ${data.xApiStatus}): ${JSON.stringify(data.xApiResponse || data.error)}`
        })
        showToast('error', `X API returned HTTP ${data.xApiStatus}`)
      }
    } catch (e: any) {
      setXApiTestResult({ success: false, message: e.message || 'Connection test failed' })
      showToast('error', e.message || 'Connection test failed')
    } finally {
      setTestingXApi(false)
    }
  }

  const handleTestApi = async () => {
    setTestingApi(true)
    setApiTestResult(null)
    try {
      const res = await fetch('/api/admin/settings/test-razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyId: settings.razorpayKeyId,
          keySecret: settings.razorpayKeySecret,
        }),
      })
      const data = await res.json()
      setApiTestResult({
        success: res.ok && data.success,
        message: data.message || (res.ok ? 'Credentials verified!' : 'Verification failed'),
      })
      showToast(res.ok && data.success ? 'success' : 'error', data.message || 'API Test completed')
    } catch (err: any) {
      const msg = 'Network error while testing API: ' + (err.message || 'Unknown error')
      setApiTestResult({ success: false, message: msg })
      showToast('error', msg)
    } finally {
      setTestingApi(false)
    }
  }

  // Fetch Listings & Settings
  const fetchData = async (targetMode = adminMode) => {
    setLoading(true)
    try {
      const [listRes, setRes] = useStateRes(targetMode)
      const listData = await listRes
      if (listData?.listings) {
        setListings(listData.listings)
      }
      const setData = await setRes
      if (setData) {
        setSettings(prev => ({
          ...prev,
          ...setData,
          currency: 'INR',
          currencySymbol: '₹',
          qrEnabled: setData.qrEnabled !== undefined ? Boolean(setData.qrEnabled) : true,
        }))
      }
    } catch (err: any) {
      console.error('Fetch error:', err)
      showToast('error', 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const useStateRes = (mode = adminMode) => {
    const listPromise = fetch(`/api/admin/listings?mode=${mode}`, {
      headers: { 'x-admin-key': 'no1domain_admin_secret' }
    })
      .then(res => res.json())
      .catch(() => ({ listings: [] }))
    const setPromise = fetch('/api/admin/settings', {
      headers: { 'x-admin-key': 'no1domain_admin_secret' }
    })
      .then(res => res.json())
      .catch(() => null)
    return [listPromise, setPromise]
  }

  useEffect(() => {
    fetchData('website')
  }, [])

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch =
        searchQuery === '' ||
        item.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.websiteUrl?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [listings, searchQuery, selectedCategory, selectedStatus])

  // Total board metrics
  const totalBoardValue = useMemo(() => {
    return listings.reduce((sum, item) => sum + (item.currentBid || 0), 0)
  }, [listings])

  const totalClicks = useMemo(() => {
    return listings.reduce((sum, item) => sum + (item.clicks || 0), 0)
  }, [listings])

  const top1Listing = listings[0]

  // Handle Edit Click
  const handleOpenEdit = (item: AdminListing) => {
    setEditingItem(item)
    setEditFormData({
      title: item.title,
      domain: item.domain,
      websiteUrl: item.websiteUrl || `https://${item.domain}`,
      videoUrl: item.videoUrl || '',
      category: item.category,
      currentBid: item.currentBid,
      clicks: item.clicks,
      status: item.status,
      description: item.description || '',
    })
  }

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!editingItem) return
    setActionLoading(editingItem.id)
    try {
      const res = await fetch(`/api/admin/listings/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'no1domain_admin_secret',
        },
        body: JSON.stringify(editFormData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to update domain')
      }
      showToast('success', `"${editFormData.domain}" updated successfully!`)
      setEditingItem(null)
      fetchData()
    } catch (err: any) {
      showToast('error', err.message || 'Error updating listing')
    } finally {
      setActionLoading(null)
    }
  }

  // Delete Listing
  const handleDelete = async (id: string, domainName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${domainName}" from the leaderboard?`)) {
      return
    }
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'no1domain_admin_secret',
        },
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to delete domain')
      }
      showToast('success', `"${domainName}" removed from leaderboard.`)
      fetchData()
    } catch (err: any) {
      showToast('error', err.message || 'Error deleting listing')
    } finally {
      setActionLoading(null)
    }
  }

  // Quick Set as #1 / Boost Bid
  const handleQuickOutbid = async (item: AdminListing) => {
    const currentTop = top1Listing?.currentBid || 5000
    const newBid = currentTop + settings.top1Increment
    if (!window.confirm(`Boost "${item.domain}" to #1 with a new spotlight tier of ${formatINR(newBid)}?`)) {
      return
    }
    setActionLoading(item.id)
    try {
      const res = await fetch(`/api/admin/listings/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'no1domain_admin_secret',
        },
        body: JSON.stringify({ currentBid: newBid, status: 'ACTIVE' }),
      })
      if (!res.ok) throw new Error('Failed to update showcase tier')
      showToast('success', `"${item.domain}" is now Ranked #1 with spotlight tier ${formatINR(newBid)}!`)
      fetchData()
    } catch (err: any) {
      showToast('error', err.message || 'Error boosting showcase tier')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDomainInputChange = (val: string) => {
    setModalError(null)
    const clean = val.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').replace(/\s+/g, '')
    const brandName = clean
      ? clean.split('.')[0].charAt(0).toUpperCase() + clean.split('.')[0].slice(1)
      : ''

    setNewFormData(prev => ({
      ...prev,
      domain: clean,
      title: (!prev.title || prev.title === prev.domain || prev.title.toLowerCase() === prev.domain.split('.')[0]) ? brandName : prev.title,
      websiteUrl: clean ? `https://${clean}` : '',
      description: (!prev.description || prev.description.includes('Verified showcase') || prev.description.includes('Official portal')) ? (clean ? `Verified showcase and services for ${clean}.` : '') : prev.description,
    }))
  }

  const applyDomainPreset = (p: typeof QUICK_DOMAIN_PRESETS[0]) => {
    setModalError(null)
    setNewFormData(prev => ({
      ...prev,
      domain: p.domain,
      title: p.title,
      category: p.category,
      websiteUrl: `https://${p.domain}`,
      description: p.description,
    }))
  }

  // Submit Add Domain to Leaderboard
  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalError(null)
    if (!newFormData.domain || !newFormData.domain.trim()) {
      setModalError('Domain name is required (e.g. zomato.com or yourbrand.com)')
      showToast('error', 'Domain name is required')
      return
    }
    const finalDomain = newFormData.domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').replace(/\s+/g, '')
    const brandName = finalDomain.split('.')[0].charAt(0).toUpperCase() + finalDomain.split('.')[0].slice(1)
    const finalTitle = newFormData.title.trim() || brandName || finalDomain
    let finalWebsite = newFormData.websiteUrl.trim() || `https://${finalDomain}`
    if (finalWebsite && !finalWebsite.startsWith('http://') && !finalWebsite.startsWith('https://')) {
      finalWebsite = 'https://' + finalWebsite
    }
    const finalDescription = newFormData.description.trim() || `Verified showcase and services for ${finalDomain}.`

    setActionLoading('create')
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'no1domain_admin_secret',
        },
        body: JSON.stringify({
          ...newFormData,
          domain: finalDomain,
          title: finalTitle,
          websiteUrl: finalWebsite,
          description: finalDescription,
          imageUrl: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(finalWebsite)}&size=128`,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to add item')
      }
      showToast('success', `"${finalDomain}" added to leaderboard successfully!`)
      setIsAddOpen(false)
      setModalError(null)
      setNewFormData({
        title: '',
        domain: '',
        websiteUrl: '',
        videoUrl: '',
        category: 'Ecommerce & Retail',
        currentBid: (top1Listing?.currentBid || 50) + settings.top1Increment,
        clicks: 0,
        description: '',
      })
      fetchData(adminMode)
    } catch (err: any) {
      const errMsg = err.message || 'Error creating listing'
      setModalError(errMsg)
      showToast('error', errMsg)
    } finally {
      setActionLoading(null)
    }
  }

  // Save Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'no1domain_admin_secret',
        },
        body: JSON.stringify(settings),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to save settings')
      }
      showToast('success', 'Platform & Spotlight Showcase rules saved successfully!')
    } catch (err: any) {
      showToast('error', err.message || 'Error saving settings')
    } finally {
      setSavingSettings(false)
    }
  }

  // Reset All to Zero for Live Launch
  const handleResetAllToZero = async () => {
    const confirmMsg = '⚠️ WARNING: Kya aap Website leaderboard ke sabhi domains ZERO karna chahte hain? Sabhi dummy domains aur bids reset ho jayenge!'

    if (!window.confirm(confirmMsg)) {
      return
    }
    setActionLoading('reset-zero')
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'all' }),
      })
      if (!res.ok) throw new Error('Reset failed')
      showToast('success', 'Sabhi domains ZERO kar diye gaye hain!')
      fetchData()
    } catch (err: any) {
      showToast('error', err.message || 'Error resetting')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden pb-20 transition-colors ${
      isDark ? 'bg-[#07080e] text-slate-100' : 'bg-slate-50 text-slate-900'
    } selection:bg-purple-500 selection:text-white`}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-xl animate-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors shadow-sm ${
        isDark ? 'bg-[#0b0c16]/90 border-purple-500/20 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/80 border border-purple-500/40 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src="/images/logo-transparent.png"
                  alt="NO. 1 DOMAIN Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(192,132,252,0.85)]"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-sm sm:text-xl font-black tracking-tight leading-none">
                  <span className="text-yellow-400">NO. 1</span>
                  <span className="ml-1 sm:ml-1.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent">
                    DOMAIN
                  </span>
                </div>
                <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest mt-0.5 sm:mt-1 ${isDark ? 'text-cyan-400' : 'text-purple-600'}`}>
                  Admin Panel
                </span>
              </div>
            </Link>

            <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
              isDark ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
            }`}>
              <Shield className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span>Full Control</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className={`p-2 sm:p-2.5 rounded-xl border transition-colors ${
                isDark ? 'border-zinc-700/60 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-300 hover:text-white' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
            </button>

            <Link
              href="/"
              className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-colors ${
                isDark ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              <ExternalLink className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <span className="hidden sm:inline">Live Website</span>
              <span className="sm:hidden">Live</span>
            </Link>

            <SiteThemeToggle />

            {/* Admin Profile Info */}
            <div className={`hidden md:flex items-center gap-2 pl-3 border-l ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[1px] flex items-center justify-center">
                <div className={`w-full h-full rounded-[11px] flex items-center justify-center font-black text-xs ${
                  isDark ? 'bg-[#0b0c16] text-purple-300' : 'bg-white text-purple-700'
                }`}>
                  M
                </div>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-xs leading-none ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>
                    {session?.user?.name || 'Monu Ahirwar'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                    ADMIN
                  </span>
                </div>
                <span className={`text-[10px] font-mono leading-tight mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  {session?.user?.email || 'support@no1domain.in'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={async () => {
                sessionStorage.removeItem('admin_unlocked_token')
                await signOut({ callbackUrl: '/admin' })
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 transition-colors shadow-sm cursor-pointer"
              title="Logout from Admin"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8 overflow-x-hidden">
        {/* Platform Header Banner */}
        <div className="flex items-center gap-2.5 sm:gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20">
            <Globe className="w-4 h-4 text-slate-950" />
            <span>🌐 Leaderboard Domain Directory</span>
          </div>
        </div>

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
          <div className={`p-5 rounded-2xl border shadow-md transition-all ${
            isDark ? 'bg-gradient-to-br from-[#121324] to-[#0c0d18] border-purple-500/25 text-white' : 'bg-white border-purple-200 text-slate-900 shadow-slate-200/50'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              <span>Total Listed Domains</span>
              <Layers className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{listings.length}</div>
            <div className={`text-[11px] mt-1 font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              Active attention rankings
            </div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-md transition-all ${
            isDark ? 'bg-gradient-to-br from-[#1c142c] to-[#100d1c] border-yellow-500/30 text-white' : 'bg-white border-amber-200 text-slate-900 shadow-slate-200/50'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isDark ? 'text-yellow-400/90' : 'text-amber-700'}`}>
              <span>Current #1 Spotlight Tier</span>
              <Crown className={`w-4 h-4 fill-current ${isDark ? 'text-yellow-400' : 'text-amber-500'}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-yellow-400' : 'text-amber-600'}`}>
              {top1Listing && (top1Listing as any).status !== 'DEMO'
                ? formatINR(top1Listing.currentBid)
                : '₹0 (Base from ₹50)'}
            </div>
            <div className={`text-[11px] truncate mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Top: <strong className={isDark ? 'text-white' : 'text-slate-950 font-bold'}>{top1Listing && (top1Listing as any).status !== 'DEMO' ? top1Listing.domain : 'Open for Bidding'}</strong>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-md transition-all ${
            isDark ? 'bg-gradient-to-br from-[#141b2c] to-[#0b101d] border-cyan-500/25 text-white' : 'bg-white border-blue-200 text-slate-900 shadow-slate-200/50'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isDark ? 'text-cyan-400/90' : 'text-blue-700'}`}>
              <span>Total Board Value</span>
              <TrendingUp className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>
              {formatINR(totalBoardValue)}
            </div>
            <div className={`text-[11px] mt-1 font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>All live active listings</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-md transition-all ${
            isDark ? 'bg-gradient-to-br from-[#1a1226] to-[#0d0a16] border-pink-500/25 text-white' : 'bg-white border-pink-200 text-slate-900 shadow-slate-200/50'
          }`}>
            <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isDark ? 'text-pink-400/90' : 'text-pink-700'}`}>
              <span>Total Tracked Clicks</span>
              <MousePointerClick className={`w-4 h-4 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
              {totalClicks.toLocaleString('en-IN')}
            </div>
            <div className={`text-[11px] mt-1 font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              Verified visitor redirects
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-2 sm:gap-3 border-b pb-3 sm:pb-4 mb-5 sm:mb-6 overflow-x-auto scrollbar-none flex-nowrap w-full ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 whitespace-nowrap ${
              activeTab === 'listings'
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                : isDark
                ? 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-sm'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Leaderboard Domains ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('live_traffic')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex-shrink-0 whitespace-nowrap ${
              activeTab === 'live_traffic'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                : isDark
                ? 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-sm'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 Live Visitors & Stay Duration ({liveTraffic.liveOnlineCount} Online)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                : isDark
                ? 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-sm'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Spotlight Rules & Platform Settings</span>
          </button>
        </div>

        {/* ===================== TAB 1: LISTINGS LIST ===================== */}
        {activeTab === 'listings' && (
          <div>
            {/* Action Bar & Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-6 w-full">
              <div className="flex flex-1 items-center gap-2.5 sm:gap-3 flex-wrap w-full">
                {/* Search */}
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-md w-full">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by domain, title, URL..."
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#11121e] border-zinc-700/60 text-white placeholder-zinc-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className={`border rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors ${
                    isDark
                      ? 'bg-[#11121e] border-zinc-700/60 text-zinc-300'
                      : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className={`border rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors ${
                    isDark
                      ? 'bg-[#11121e] border-zinc-700/60 text-zinc-300'
                      : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                  }`}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PAUSED">PAUSED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Add Domain Button */}
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-yellow-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Domain</span>
                </button>
              </div>
            </div>

            {/* Listings Table / Cards */}
            {loading ? (
              <div className={`p-12 text-center ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-3" />
                <p className="font-semibold">Loading leaderboard domains...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className={`p-12 rounded-3xl border text-center ${
                isDark ? 'bg-[#0f101c] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <Globe className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`} />
                <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  No domains match your search
                </h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Try clearing your filters or add a new domain.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSelectedStatus('ALL')
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  }`}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredListings.map(item => {
                  const isTop1 = item.rank === 1
                  const isTop3 = item.rank <= 3

                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-2xl p-3.5 sm:p-5 border transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4 w-full overflow-hidden ${
                        isTop1
                          ? isDark
                            ? 'bg-gradient-to-r from-[#1b1509] via-[#141224] to-[#0d0e1a] border-yellow-500/40 shadow-xl shadow-yellow-500/5'
                            : 'bg-gradient-to-r from-amber-50/80 via-yellow-50/40 to-white border-amber-300 shadow-md'
                          : isTop3
                          ? isDark
                            ? 'bg-gradient-to-r from-[#170e26] to-[#0e0f1c] border-purple-500/30'
                            : 'bg-purple-50/30 border-purple-200/80 shadow-sm'
                          : isDark
                          ? 'bg-[#0f101c] border-zinc-800/80 hover:border-zinc-700'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      {/* Left: Rank, Logo, Domain & Info */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
                        {/* Rank Badge */}
                        <div
                          className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-sm ${
                            isTop1
                              ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 shadow-md shadow-yellow-400/30'
                              : item.rank === 2
                              ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                              : item.rank === 3
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                              : isDark
                              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          #{item.rank}
                        </div>

                        {/* Domain Favicon or Video Thumbnail */}
                        <div className={`relative w-10 h-10 flex-shrink-0 rounded-xl border p-1 flex items-center justify-center overflow-hidden ${
                          isDark ? 'bg-black/60 border-zinc-700/60' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <img
                            src={item.imageUrl || `https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
                            alt={item.domain}
                            className="w-full h-full object-contain"
                            onError={e => {
                              ;(e.target as any).src = 'https://www.google.com/s2/favicons?domain=example.com'
                            }}
                          />
                          {item.videoUrl && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                            </div>
                          )}
                        </div>

                        {/* Domain Name & Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-extrabold text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                              isDark ? 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' : 'text-cyan-800 bg-cyan-50 border-cyan-200'
                            }`}>
                              {item.domain}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isDark
                                ? 'text-zinc-400 bg-zinc-800/80'
                                : 'text-slate-700 bg-slate-100 border border-slate-200'
                            }`}>
                              {item.category}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                item.status === 'DEMO'
                                  ? isDark ? 'bg-purple-950/50 text-purple-300 border-purple-500/40' : 'bg-purple-50 text-purple-800 border-purple-200'
                                  : item.status === 'ACTIVE'
                                  ? isDark ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : item.status === 'PENDING'
                                  ? isDark ? 'bg-yellow-950/40 text-yellow-300 border-yellow-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                                  : isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {item.status === 'DEMO' ? 'FEATURED' : item.status}
                            </span>
                          </div>

                          <p className={`text-xs truncate max-w-xl mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {item.description || item.websiteUrl}
                          </p>
                        </div>
                      </div>

                      {/* Right: Metrics & Actions */}
                      <div className={`flex items-center justify-between xl:justify-end gap-3 sm:gap-5 flex-wrap sm:flex-nowrap border-t xl:border-t-0 pt-2.5 xl:pt-0 w-full xl:w-auto ${
                        isDark ? 'border-zinc-800' : 'border-slate-200'
                      }`}>
                        {/* Clicks */}
                        <div className="text-right">
                          <div className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Clicks</div>
                          <div className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>
                            {(item.clicks || 0).toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Current Showcase Tier */}
                        <div className="text-right">
                          <div className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Showcase Tier</div>
                          <div
                            className={`text-base sm:text-lg font-black ${
                              isTop1 ? (isDark ? 'text-yellow-400' : 'text-amber-600') : (isDark ? 'text-white' : 'text-slate-900')
                            }`}
                          >
                            {item.status === 'DEMO' ? (
                              <span className={`text-xs font-black px-2 py-0.5 rounded border ${
                                isDark ? 'bg-purple-950/60 text-purple-300 border-purple-500/40' : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                Demo (₹50)
                              </span>
                            ) : (
                              formatINR(item.currentBid)
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Set as #1 / Boost button if not already #1 */}
                          {!isTop1 && (
                            <button
                              onClick={() => handleQuickOutbid(item)}
                              disabled={actionLoading === item.id}
                              title="Boost to #1 Rank"
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                                isDark
                                  ? 'bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                              }`}
                            >
                              <Crown className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Set #1</span>
                            </button>
                          )}

                          {/* Visit Link */}
                          <a
                            href={item.websiteUrl || `https://${item.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors border ${
                              isDark
                                ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700/60'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                            }`}
                            title="Visit Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className={`p-2 rounded-lg transition-colors border ${
                              isDark
                                ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border-purple-500/30'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-900 border-purple-200'
                            }`}
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id, item.domain)}
                            disabled={actionLoading === item.id}
                            className={`p-2 rounded-lg transition-colors border ${
                              isDark
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border-rose-500/30'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 border-rose-200'
                            }`}
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: LIVE VISITORS & STAY DURATION ===================== */}
        {activeTab === 'live_traffic' && (
          <div className="space-y-6">
            {/* Header Status Card */}
            <div className={`p-6 rounded-2xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              isDark ? 'bg-[#0e101c] border-emerald-500/30' : 'bg-emerald-50/80 border-emerald-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-emerald-400">
                      Live Customer Dwell Time & Activity Tracker
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {liveTraffic.liveOnlineCount} CUSTOMERS ONLINE NOW
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Real-time presence, visited target domains, and live dwell stopwatches across all platform visitors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Auto-syncing every 2.5s
                </span>
              </div>
            </div>

            {/* Currently Active Online Visitors */}
            <div className={`p-6 rounded-2xl border shadow-xl ${
              isDark ? 'bg-[#0f101c] border-purple-500/20' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                <span>🟢</span>
                <span>Active Online Right Now ({liveTraffic.activeVisitors.length} Visitors)</span>
              </h3>

              {liveTraffic.activeVisitors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${
                        isDark ? 'border-zinc-800 text-zinc-400 bg-white/[0.02]' : 'border-slate-200 text-slate-500 bg-slate-50'
                      }`}>
                        <th className="py-3 px-3">👤 Customer Arrival & Location</th>
                        <th className="py-3 px-3">⏱️ Total Stay Duration</th>
                        <th className="py-3 px-3">🌐 Target Domain (Visited Website)</th>
                        <th className="py-3 px-3">⏳ Target Dwell Time</th>
                        <th className="py-3 px-3 text-right">🟢 Live Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {liveTraffic.activeVisitors.map((v: any, idx: number) => {
                        const targetDomainName = v.targetDomain || v.domainName || (v.currentUrl?.startsWith('http') ? v.currentUrl.replace(/^https?:\/\//, '').split('/')[0] : 'NO. 1 DOMAIN Directory')
                        const targetStay = v.targetDurationFormatted || v.durationFormatted || `${v.durationSeconds || 1}s`

                        return (
                          <tr key={v.sessionId || idx} className={`transition-colors ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'}`}>
                            {/* 1. Customer Arrival (Location, Time, Device) */}
                            <td className="py-3 px-3">
                              <div className="flex items-start gap-2.5">
                                <span className="text-xl leading-none select-none mt-0.5">{v.flag || '🇮🇳'}</span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <strong className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                      {v.country || 'India'}{v.city ? `, ${v.city}` : ''}
                                    </strong>
                                    {v.arrivalTimeFormatted && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                                        🕒 {v.arrivalTimeFormatted}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-400">
                                    <span className="font-semibold text-purple-300">
                                      {v.device === 'Mobile' ? '📱 Mobile' : '💻 Desktop'}
                                    </span>
                                    <span>•</span>
                                    <span className="font-mono text-zinc-500">{v.browser || 'Browser'}</span>
                                    <span>•</span>
                                    <span className="font-mono text-zinc-500">IP: {v.maskedIp}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Total Stay on Platform */}
                            <td className="py-3 px-3">
                              <div>
                                <strong className="text-sm font-mono font-black text-amber-300 flex items-center gap-1">
                                  <span>⏱️</span>
                                  <span>{v.durationFormatted || `${v.durationSeconds}s`}</span>
                                </strong>
                                <span className="text-[10px] text-zinc-400 block font-medium">Stayed continuously</span>
                              </div>
                            </td>

                            {/* 3. Target Domain (Visited Website) */}
                            <td className="py-3 px-3">
                              <div className="max-w-xs">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 truncate">
                                  <span>🔗</span>
                                  <span className="truncate">{targetDomainName}</span>
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono truncate block mt-0.5">
                                  {v.linkTitle || v.currentUrl}
                                </span>
                              </div>
                            </td>

                            {/* 4. Target Dwell Time (Time on Target Website) */}
                            <td className="py-3 px-3">
                              <div>
                                <strong className="text-sm font-mono font-black text-emerald-300 flex items-center gap-1">
                                  <span>⏳</span>
                                  <span>{targetStay}</span>
                                </strong>
                                <span className="text-[10px] text-emerald-400/80 block font-medium">Spent on website</span>
                              </div>
                            </td>

                            {/* 5. Live Tracking (Real-Time Online Badge) */}
                            <td className="py-3 px-3 text-right">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 inline-flex items-center gap-1.5 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>LIVE ONLINE</span>
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No visitors currently active. As soon as a visitor navigates to a domain or page, live stopwatch tracking begins automatically.
                </div>
              )}
            </div>

            {/* Departed Visitors List */}
            {liveTraffic.recentDeparted.length > 0 && (
              <div className={`p-6 rounded-2xl border shadow-xl ${
                isDark ? 'bg-[#0f101c] border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                  <span>⚪</span>
                  <span>Recently Departed Visitors & Stay History</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${
                        isDark ? 'border-zinc-800 text-zinc-400 bg-white/[0.01]' : 'border-slate-200 text-slate-500 bg-slate-50'
                      }`}>
                        <th className="py-2.5 px-3">👤 Customer Arrival</th>
                        <th className="py-2.5 px-3">⏱️ Total Stay</th>
                        <th className="py-2.5 px-3">🌐 Target Domain</th>
                        <th className="py-2.5 px-3">⏳ Target Dwell</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {liveTraffic.recentDeparted.slice(0, 8).map((dep: any, idx: number) => {
                        const targetDomainName = dep.targetDomain || dep.domainName || (dep.currentUrl?.startsWith('http') ? dep.currentUrl.replace(/^https?:\/\//, '').split('/')[0] : 'NO. 1 DOMAIN Directory')
                        const targetStay = dep.targetDurationFormatted || dep.durationFormatted || `${dep.durationSeconds || 1}s`

                        return (
                          <tr key={dep.sessionId || idx} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="text-base select-none">{dep.flag || '🇮🇳'}</span>
                                <div>
                                  <span className={`font-bold text-xs ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                    {dep.city || dep.country || 'India'}
                                  </span>
                                  {dep.arrivalTimeFormatted && (
                                    <span className="text-[10px] text-zinc-400 block font-mono">
                                      🕒 {dep.arrivalTimeFormatted}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                              {dep.durationFormatted}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-cyan-300 font-bold truncate block max-w-[160px]">
                                {targetDomainName}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                              {targetStay}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">
                                LEFT
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: PLATFORM SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            {/* Top #1 Rule Card */}
            <div className={`rounded-2xl p-6 border shadow-xl transition-all ${
              isDark ? 'bg-[#0f101c] border-purple-500/30' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Crown className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-amber-500'}`} />
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Top #1 Spotlight Rule</h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    To claim #1 spotlight, a domain must upgrade past the current #1 tier by at least this amount.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Top #1 Minimum Increment (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.top1Increment}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, top1Increment: parseInt(e.target.value) || 200 }))
                    }
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-yellow-400 focus:border-yellow-400'
                        : 'bg-slate-50 border-slate-300 text-amber-600 focus:border-amber-500'
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Default rule: ₹200 increment for #1 position.</p>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Other Positions Increment (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.otherPositionIncrement}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, otherPositionIncrement: parseInt(e.target.value) || 100 }))
                    }
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Increment for #2, #3, and lower ranks (₹100).</p>
                </div>
              </div>
            </div>

            {/* Currency & Base Rules */}
            <div className={`rounded-2xl p-6 border shadow-xl transition-all ${
              isDark ? 'bg-[#0f101c] border-zinc-800' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Currency & Minimum Starting Tier</h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Platform strictly enforces Indian Rupees (₹ INR) everywhere.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Currency Code</label>
                  <input
                    type="text"
                    disabled
                    value="INR (₹ Indian Rupees)"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold cursor-not-allowed ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/40 text-emerald-400 opacity-80'
                        : 'bg-slate-100 border-slate-200 text-emerald-700'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Minimum Starting Tier (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.minimumStartingBid}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, minimumStartingBid: parseInt(e.target.value) || 500 }))
                    }
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Base tier required to enter the directory (₹50).</p>
                </div>
              </div>
            </div>



            {/* Razorpay Payment Gateway Settings Card */}
            <div className={`rounded-2xl p-6 border shadow-xl transition-all ${
              isDark ? 'bg-[#0f101c] border-purple-500/30' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className={`w-6 h-6 ${isDark ? 'text-primary-400 text-purple-400' : 'text-purple-600'}`} />
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Razorpay Payment Gateway</h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Enter your live or test Razorpay API keys to receive payments directly.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      Razorpay Key ID
                    </label>
                    {settings.razorpayKeyId && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        settings.razorpayKeyId.startsWith('rzp_live_')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : settings.razorpayKeyId.startsWith('rzp_test_')
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {settings.razorpayKeyId.startsWith('rzp_live_') ? '🟢 LIVE MODE' : '🟡 TEST MODE'}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={settings.razorpayKeyId}
                    onChange={e => setSettings(prev => ({ ...prev, razorpayKeyId: e.target.value.trim() }))}
                    placeholder="rzp_live_... or rzp_test_..."
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    Razorpay Dashboard &gt; Account &amp; Settings &gt; API Keys
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Razorpay Key Secret
                  </label>
                  <input
                    type="password"
                    value={settings.razorpayKeySecret}
                    onChange={e => setSettings(prev => ({ ...prev, razorpayKeySecret: e.target.value.trim() }))}
                    placeholder="Paste Key Secret from Razorpay Dashboard"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white focus:border-purple-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    Secret key generated when downloading your API keys from Razorpay.
                  </p>
                </div>
              </div>

              {/* Test Razorpay API Connection Button & Feedback */}
              <div className={`mt-4 p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={testingApi || !settings.razorpayKeyId || !settings.razorpayKeySecret}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingApi ? 'animate-spin' : ''}`} />
                  <span>{testingApi ? 'Testing Connection...' : 'Test Razorpay Connection'}</span>
                </button>
                {apiTestResult && (
                  <p className={`text-xs font-semibold ${apiTestResult.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {apiTestResult.message}
                  </p>
                )}
              </div>
            </div>

            {/* X (Twitter) Ads Measurement & Conversions API (CAPI) */}
            <div className={`rounded-2xl p-6 border shadow-xl transition-all ${
              isDark ? 'bg-[#0f101c] border-purple-500/30' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-base border border-zinc-700 shadow-sm">
                    𝕏
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                      <span>X (Twitter) Ads Measurement API</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        CAPI Active
                      </span>
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Server-to-server conversion tracking for X (Twitter) Ads campaigns (`POST /12/measurement/conversions/:pixel_id`)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      X Pixel ID / Tag ID
                    </label>
                    <input
                      type="text"
                      value={settings.xPixelId || ''}
                      onChange={e => setSettings(prev => ({ ...prev, xPixelId: e.target.value }))}
                      placeholder="e.g. rgkb5"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-[#161828] border-zinc-700/80 text-cyan-300 focus:border-cyan-400'
                          : 'bg-slate-50 border-slate-300 text-cyan-700 focus:border-cyan-600'
                      }`}
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Endpoint: https://ads-api.x.com/12/measurement/conversions/:pixel_id
                    </span>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      Conversion Event ID (SET Tag)
                    </label>
                    <input
                      type="text"
                      value={settings.xConversionEventId || ''}
                      onChange={e => setSettings(prev => ({ ...prev, xConversionEventId: e.target.value }))}
                      placeholder="e.g. tw-rgkb5-purchase or tw-rgkb5-xxxxx"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-[#161828] border-zinc-700/80 text-yellow-300 focus:border-yellow-400'
                          : 'bg-slate-50 border-slate-300 text-yellow-700 focus:border-yellow-600'
                      }`}
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      X Ads Events Manager me Event ke samne diya gaya Event ID (jaise `tw-rgkb5-xxxxx`)
                    </span>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    X Pixel Token (Access Token)
                  </label>
                  <input
                    type="password"
                    value={settings.xPixelToken || ''}
                    onChange={e => setSettings(prev => ({ ...prev, xPixelToken: e.target.value }))}
                    placeholder="Enter generated access token from X Events Manager"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white focus:border-cyan-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Sent as header &apos;X-Pixel-Token: :token&apos; to authenticate measurement requests
                  </span>
                </div>

                {/* Instant Test X Conversion API Button */}
                <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={handleTestXApi}
                    disabled={testingXApi || !settings.xPixelId || !settings.xPixelToken}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow cursor-pointer flex-shrink-0"
                  >
                    {testingXApi ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Test Conversion Ping to X...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono">𝕏</span>
                        <span>Test X Conversion Ping (Send Event)</span>
                      </>
                    )}
                  </button>

                  {xApiTestResult ? (
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 max-w-full overflow-hidden ${
                      xApiTestResult.success
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {xApiTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="truncate">{xApiTestResult.message}</span>
                    </div>
                  ) : (
                    <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Pixel ID aur Token check karne ke liye &quot;Test X Conversion Ping&quot; par click karein.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-black text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ===================== EDIT MODAL ===================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex justify-center items-start sm:items-center">
          <div className={`border rounded-2xl sm:rounded-3xl max-w-lg w-full my-auto flex flex-col max-h-[92vh] p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 transition-all ${
            isDark ? 'bg-[#10111e] border-purple-500/30' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 sm:pb-4 border-b mb-4 flex-shrink-0 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  #{editingItem.rank}
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Edit Domain Listing
                  </h3>
                  <p className={`text-[11px] sm:text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{editingItem.domain}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Brand / Company Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={e => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                    isDark
                      ? 'bg-[#161828] border-zinc-700/80 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Domain Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.domain}
                    onChange={e => setEditFormData(prev => ({ ...prev, domain: e.target.value }))}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-cyan-300'
                        : 'bg-slate-50 border-slate-300 text-cyan-700'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={e => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Website URL</label>
                <input
                  type="text"
                  value={editFormData.websiteUrl}
                  onChange={e => setEditFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                    isDark
                      ? 'bg-[#161828] border-zinc-700/80 text-zinc-300'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`}>Showcase Tier (₹)</label>
                  <input
                    type="number"
                    value={editFormData.currentBid}
                    onChange={e =>
                      setEditFormData(prev => ({ ...prev, currentBid: parseInt(e.target.value) || 0 }))
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm font-black focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-yellow-500/50 text-yellow-400 focus:border-yellow-400'
                        : 'bg-amber-50/70 border-amber-300 text-amber-700 focus:border-amber-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Tracked Clicks</label>
                  <input
                    type="number"
                    value={editFormData.clicks}
                    onChange={e =>
                      setEditFormData(prev => ({ ...prev, clicks: parseInt(e.target.value) || 0 }))
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={e =>
                      setEditFormData(prev => ({
                        ...prev,
                        status: e.target.value as 'ACTIVE' | 'PENDING' | 'PAUSED' | 'REJECTED',
                      }))
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PAUSED">PAUSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={e => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                    isDark
                      ? 'bg-[#161828] border-zinc-700/80 text-zinc-300'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 mt-4 pt-3 border-t flex-shrink-0 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setEditingItem(null)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading !== null}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{actionLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD NEW DOMAIN MODAL ===================== */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex justify-center items-start sm:items-center">
          <form
            onSubmit={handleCreateDomain}
            className={`border rounded-2xl sm:rounded-3xl max-w-lg w-full my-auto flex flex-col max-h-[92vh] p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 transition-all ${
              isDark ? 'bg-[#10111e] border-purple-500/30' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between pb-3 sm:pb-4 border-b mb-4 flex-shrink-0 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                  isDark ? 'bg-yellow-400/20 text-yellow-400' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Add New Domain
                  </h3>
                  <p className={`text-[11px] sm:text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Domain name enter karein aur seedhe leaderboard me add karein
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              {/* Domain Input & Quick Presets (Primary field on top) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-black uppercase tracking-wider ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                    🌐 Domain Name *
                  </label>
                  <span className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Auto-fills Name & URL
                  </span>
                </div>
                <div className="relative">
                  <Globe className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. zomato.com, swiggy.com, or yoursite.in"
                    value={newFormData.domain}
                    onChange={e => handleDomainInputChange(e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      isDark
                        ? 'bg-[#161828] border-cyan-500/50 text-cyan-300 placeholder-zinc-500'
                        : 'bg-cyan-50/50 border-cyan-400 text-cyan-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none py-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    Quick Add:
                  </span>
                  {QUICK_DOMAIN_PRESETS.map(preset => (
                    <button
                      key={preset.domain}
                      type="button"
                      onClick={() => applyDomainPreset(preset)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-medium transition-all flex-shrink-0 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                        newFormData.domain === preset.domain
                          ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400 shadow-sm'
                          : isDark
                          ? 'bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-cyan-400 hover:text-white'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-cyan-500 hover:bg-white'
                      }`}
                    >
                      +{preset.domain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Starting Tier (2 Cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Category</label>
                  <select
                    value={newFormData.category}
                    onChange={e => setNewFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`}>Starting Tier (₹) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    step={50}
                    value={newFormData.currentBid}
                    onChange={e =>
                      setNewFormData(prev => ({
                        ...prev,
                        currentBid: parseInt(e.target.value) || 50,
                      }))
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm font-black focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-yellow-500/50 text-yellow-400 focus:border-yellow-400'
                        : 'bg-amber-50/70 border-amber-300 text-amber-700 focus:border-amber-500'
                    }`}
                  />
                  <p className={`text-[10px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    To make #1: {formatINR((top1Listing?.currentBid || 50) + 50)}+
                  </p>
                </div>
              </div>

              {/* Brand Name & Website URL (2 Cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Brand / Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zomato India"
                    value={newFormData.title}
                    onChange={e => setNewFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://zomato.com"
                    value={newFormData.websiteUrl}
                    onChange={e => setNewFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-zinc-300'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Initial Clicks & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Initial Clicks</label>
                  <input
                    type="number"
                    value={newFormData.clicks}
                    onChange={e =>
                      setNewFormData(prev => ({ ...prev, clicks: parseInt(e.target.value) || 0 }))
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Short Description</label>
                  <input
                    type="text"
                    placeholder="Short tagline or platform overview..."
                    value={newFormData.description}
                    onChange={e => setNewFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors ${
                      isDark
                        ? 'bg-[#161828] border-zinc-700/80 text-zinc-300'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Inline Modal Error Alert */}
            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 mt-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className={`flex items-center justify-end gap-3 mt-4 pt-3 border-t flex-shrink-0 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setModalError(null)
                  setIsAddOpen(false)
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading === 'create'}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-yellow-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {actionLoading === 'create' ? 'Adding Domain...' : 'Add Domain'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
