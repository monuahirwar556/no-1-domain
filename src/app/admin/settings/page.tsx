'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Alert, Badge } from '@/components/ui'
import { Crown, Save, Shield, ArrowLeft, Landmark, CheckCircle, RefreshCw, QrCode, Smartphone, AlertCircle, ExternalLink, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'

interface Settings {
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
  totalSiteViews?: number
}

export default function AdminSettingsPage() {
  const { isDark } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    currency: 'INR',
    currencySymbol: '₹',
    top1Increment: 200,
    otherPositionIncrement: 100,
    minimumStartingBid: 500,
    maximumBid: 10000000,
    paymentGateway: 'Razorpay',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    upiId: '',
    totalSiteViews: 8610,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingApi, setTestingApi] = useState(false)
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')

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
        message: data.message || (res.ok ? 'Razorpay credentials verified!' : 'Verification failed'),
      })
    } catch (err: any) {
      setApiTestResult({
        success: false,
        message: 'Network error while testing API: ' + (err.message || 'Unknown error'),
      })
    } finally {
      setTestingApi(false)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/settings')
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings({
          ...data,
          currency: 'INR',
          currencySymbol: '₹',
          paymentGateway: data.paymentGateway || 'Razorpay',
        })
      } else {
        // Fetch public settings if admin session is not yet active
        const pubRes = await fetch('/api/admin/settings/public')
        if (pubRes.ok) {
          const pubData = await pubRes.json()
          setSettings(prev => ({
            ...prev,
            ...pubData,
            currency: 'INR',
            currencySymbol: '₹',
          }))
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: keyof Settings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        const updated = await res.json()
        setSettings(prev => ({ ...prev, ...updated, currency: 'INR', currencySymbol: '₹' }))
        setSuccessMsg('Settings updated successfully! Spotlight rules are now active.')
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to save settings')
      }
    } catch {
      setError('An error occurred while saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen p-4 sm:p-8 transition-colors ${isDark ? 'bg-[#07080e]' : 'bg-dark-50'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className={`h-8 rounded w-1/4 animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-dark-200'}`} />
          <div className={`h-64 rounded-xl animate-pulse ${isDark ? 'bg-zinc-800/60' : 'bg-dark-200'}`} />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pb-16 transition-colors ${
      isDark ? 'bg-[#07080e] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors ${
        isDark ? 'bg-[#0b0c16]/95 border-purple-500/20 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link href="/" className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors flex-shrink-0" title="Back to Home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black/90 border border-purple-500/30 p-0.5 flex items-center justify-center shadow-md">
                  <img src="/images/logo-transparent.png" alt="Emblem" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(192,132,252,0.8)]" />
                </div>
                <div className="flex items-center text-sm sm:text-lg font-black tracking-tight whitespace-nowrap">
                  <span className="text-yellow-400">NO. 1</span>
                  <span className="ml-1 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">DOMAIN</span>
                </div>
              </Link>
              <span className="hidden md:inline-flex">
                <Badge variant="gold">Admin Settings</Badge>
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <Link href="/admin">
                <Button variant="primary" size="sm" className="font-bold flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 border-0 shadow-md text-xs px-2.5 sm:px-3">
                  <Crown className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Leaderboard List</span>
                  <span className="sm:hidden">Board</span>
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3">
                  <ExternalLink className="w-3.5 h-3.5 sm:hidden" />
                  <span className="hidden sm:inline">Live Site</span>
                </Button>
              </Link>
              <SiteThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3 ${isDark ? 'text-white' : 'text-dark-900'}`}>
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary-500 flex-shrink-0" />
            <span>Platform &amp; Bidding Settings</span>
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-dark-600'}`}>
            Control the Top #1 minimum outbid increment, position rules, currency, and Razorpay payment gateway.
          </p>
        </div>

        {status !== 'loading' && (!session || (session.user as any)?.role !== 'ADMIN') && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Aap Admin session mein login nahi hain</p>
                <p className="text-xs text-amber-800">Production server par settings save karne ke liye Admin login zaroori hai.</p>
              </div>
            </div>
            <Link href="/login" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow">
              Admin Login Karein &rarr;
            </Link>
          </div>
        )}

        {successMsg && (
          <Alert variant="success" className="mb-6" dismissible onDismiss={() => setSuccessMsg('')}>
            <CheckCircle className="w-5 h-5 mr-2 inline" />
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mb-6" dismissible onDismiss={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Currency Settings */}
        <Card variant="outlined" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary-500" />
              Currency Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">
                  Platform Currency
                </label>
                <input
                  type="text"
                  value="Indian Rupees (INR)"
                  disabled
                  className="w-full px-4 py-2.5 bg-dark-100 border border-dark-200 rounded-lg text-dark-700 font-semibold cursor-not-allowed"
                />
                <p className="text-xs text-dark-500 mt-1">All listings and payments are strictly in Indian Rupees (₹).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value="₹ (INR)"
                  disabled
                  className="w-full px-4 py-2.5 bg-dark-100 border border-dark-200 rounded-lg text-dark-700 font-bold text-lg cursor-not-allowed"
                />
                <p className="text-xs text-dark-500 mt-1">Platform currency is strictly Indian Rupees (₹ INR).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bidding Increments Card */}
        <Card variant="outlined" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Bidding Increment Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Top #1 Increment (Main Platform Rule) */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                <label className="block text-sm font-bold text-dark-900 mb-1">
                  Top #1 Minimum Increment (₹)
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-600 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={settings.top1Increment}
                    onChange={(e) => handleChange('top1Increment', parseInt(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-lg"
                    min="1"
                  />
                </div>
                <p className="text-xs text-amber-800 mt-2 font-medium">
                  Main rule: To take #1, user must beat current #1 by at least {formatINR(settings.top1Increment)}.
                </p>
              </div>

              {/* Other Position Increment */}
              <div className="p-4 bg-dark-50 rounded-xl border border-dark-200">
                <label className="block text-sm font-bold text-dark-900 mb-1">
                  Other Position Increment (₹)
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-600 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={settings.otherPositionIncrement}
                    onChange={(e) => handleChange('otherPositionIncrement', parseInt(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2.5 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                    min="1"
                  />
                </div>
                <p className="text-xs text-dark-500 mt-2">
                  Minimum increment required when bidding for positions below #1.
                </p>
              </div>
            </div>

            {/* Starting & Maximum Bids */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-dark-200">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Minimum Starting Bid (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={settings.minimumStartingBid}
                    onChange={(e) => handleChange('minimumStartingBid', parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>
                <p className="text-xs text-dark-500 mt-1">Current minimum: {formatINR(settings.minimumStartingBid)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Maximum Bid (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={settings.maximumBid}
                    onChange={(e) => handleChange('maximumBid', parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="1000"
                  />
                </div>
                <p className="text-xs text-dark-500 mt-1">Current maximum: {formatINR(settings.maximumBid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Total Views Counter Setting */}
        <Card variant="outlined" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-sky-500" />
              Total Site Views Counter (कुल व्यूज - Live Counter)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200">
                <label className="block text-sm font-bold text-dark-900 mb-1">
                  Total Site Views (कुल व्यूज)
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={settings.totalSiteViews ?? 8610}
                    onChange={(e) => handleChange('totalSiteViews', parseInt(e.target.value) || 8610)}
                    className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-lg"
                    min="1"
                  />
                </div>
                <p className="text-xs text-sky-800 mt-2 font-medium">
                  Ye live website ka Total Views counter hai. Roj aane wale naye customers isme automatically +1 hote jayenge aur ye kabhi reset nahi hoga.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway Settings */}
        <Card variant="outlined" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Payment Gateway Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Active Gateway
              </label>
              <select
                value={settings.paymentGateway}
                onChange={(e) => handleChange('paymentGateway', e.target.value)}
                className="w-full px-4 py-2.5 border border-dark-300 rounded-lg bg-white font-semibold text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Razorpay">Razorpay (INR ₹)</option>
              </select>
              <p className="text-xs text-dark-500 mt-1">
                All bids are settled via Razorpay in INR.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-dark-700">
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
                <Input
                  value={settings.razorpayKeyId}
                  onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                  placeholder="rzp_live_... or rzp_test_..."
                />
                <p className="text-[11px] text-dark-500 mt-1">
                  Razorpay Dashboard &gt; Account &amp; Settings &gt; API Keys
                </p>
              </div>
              <div>
                <Input
                  label="Razorpay Key Secret"
                  type="password"
                  value={settings.razorpayKeySecret}
                  onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                  placeholder="Paste Key Secret from Razorpay Dashboard"
                />
                <p className="text-[11px] text-dark-500 mt-1">
                  Secret key generated when downloading your API keys from Razorpay.
                </p>
              </div>
            </div>

            {/* Test Razorpay API Connection Button & Feedback */}
            <div className="p-3.5 bg-dark-50 rounded-xl border border-dark-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestApi}
                disabled={testingApi || !settings.razorpayKeyId || !settings.razorpayKeySecret}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                {testingApi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                    <span>Razorpay API Check ho rha hai...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Test API Connection (Check Karein)</span>
                  </>
                )}
              </button>

              {apiTestResult ? (
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                  apiTestResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  {apiTestResult.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{apiTestResult.message}</span>
                </div>
              ) : (
                <span className="text-[11px] text-dark-500">
                  Key ID aur Secret daal kar &quot;Test API Connection&quot; par click karein to check if valid.
                </span>
              )}
            </div>

            {/* Direct UPI ID / VPA Setting - Directly below Razorpay */}
            <div className="pt-6 border-t border-dark-200">
              <div className="flex items-center gap-2 mb-1.5">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-dark-900">Direct Admin UPI ID / VPA (PhonePe / GPay / Paytm QR)</h3>
              </div>
              <p className="text-xs text-dark-500 mb-4">
                Yaha apni UPI ID dalein. Customer jab QR code scan karega ya &quot;Copy UPI&quot; par click karega, to is UPI ID par payment jayegi.
              </p>

              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
                <Input
                  label="Admin UPI ID (VPA Address)"
                  value={settings.upiId || ''}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  placeholder="e.g. paytm-7828003666@paytm or 9876543210@paytm / yourname@oksbi"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-700 font-semibold">Active Live UPI ID:</span>
                    <span className="font-mono font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-md border border-emerald-300">
                      {settings.upiId || 'paytm-7828003666@paytm'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-generates dynamic QR code on checkout &amp; home bidding
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl text-xs text-primary-900 leading-relaxed space-y-1.5">
              <div>
                <strong>Payment Gateway &amp; UPI Mode:</strong> All payments are processed in Indian Rupees (₹).
              </div>
              <p className="text-dark-600">
                • <strong>Live Razorpay Gateway:</strong> If both Key ID and Secret Key match your active Razorpay account, the official Razorpay popup (Cards/Netbanking/UPI) opens.
              </p>
              <p className="text-dark-600">
                • <strong>UPI QR Direct Mode:</strong> If Secret Key is pending or popup fails, users scan the instant UPI QR code with PhonePe, Paytm, or GPay before confirming verification. No domain is ever added without verified payment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings Action */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={fetchSettings} disabled={saving}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Settings
          </Button>

          <Button onClick={handleSave} size="lg" loading={saving} className="px-8 shadow-lg">
            <Save className="w-5 h-5 mr-2" />
            Save Platform Settings
          </Button>
        </div>
      </main>
    </div>
  )
}