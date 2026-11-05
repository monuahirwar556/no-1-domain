'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Code,
  Zap,
} from 'lucide-react'
import RazorpayCheckoutButton from '@/components/payment/RazorpayCheckoutButton'

export default function TestPaymentPage() {
  const [amountRupees, setAmountRupees] = useState(50)
  const [customerName, setCustomerName] = useState('Test Customer')
  const [customerEmail, setCustomerEmail] = useState('customer@example.com')
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null)
  const [logs, setLogs] = useState<Array<{ timestamp: string; message: string; type: 'info' | 'success' | 'error' }>>([
    {
      timestamp: new Date().toLocaleTimeString(),
      message: 'Razorpay Standard Checkout Test Panel initialized.',
      type: 'info',
    },
  ])
  const [copied, setCopied] = useState(false)

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      },
      ...prev,
    ])
  }

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 p-4 sm:p-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Razorpay Test Environment
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Zap className="w-7 h-7 text-yellow-400" />
            Razorpay Standard Web Checkout
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Test order creation (<code>POST /api/create-order</code>), modal checkout, and HMAC-SHA256 signature verification (<code>POST /api/verify-payment</code>).
          </p>
        </div>

        {/* Credentials & Architecture Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Step 1: Order API</span>
            <p className="text-sm font-semibold text-white mt-1">POST /api/create-order</p>
            <p className="text-xs text-zinc-400 mt-1">Calls Razorpay v1/orders, generates order_id (amount in paise).</p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Step 2: Modal UI</span>
            <p className="text-sm font-semibold text-white mt-1">checkout.razorpay.com</p>
            <p className="text-xs text-zinc-400 mt-1">Opens standard modal with UPI, Cards, NetBanking, Wallets.</p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Step 3: Verification</span>
            <p className="text-sm font-semibold text-white mt-1">POST /api/verify-payment</p>
            <p className="text-xs text-zinc-400 mt-1">Validates HMAC-SHA256(order_id|payment_id, KEY_SECRET).</p>
          </div>
        </div>

        {/* Checkout Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-yellow-400" />
            Interactive Checkout Test
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Amount (in ₹ Rupees)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Will be sent as {amountRupees * 100} paise to Razorpay API (min 100 paise).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Quick Select
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountRupees(preset)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      amountRupees === preset
                        ? 'bg-yellow-400 text-slate-950 border-yellow-400 shadow-md shadow-yellow-400/20'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-2">
            <RazorpayCheckoutButton
              amount={amountRupees}
              isPaise={false}
              currency="INR"
              name="NO. 1 DOMAIN"
              description={`Test Checkout for ₹${amountRupees}`}
              prefill={{
                name: customerName,
                email: customerEmail,
              }}
              onSuccess={(payload) => {
                setLastPaymentResult(payload)
                addLog(
                  `Payment SUCCESS! Order: ${payload.razorpay_order_id} | Payment ID: ${payload.razorpay_payment_id} | Signature Verified!`,
                  'success'
                )
              }}
              onError={(err) => {
                addLog(`Checkout error: ${err}`, 'error')
              }}
              onCancel={() => {
                addLog('Checkout modal closed by user without paying.', 'info')
              }}
              buttonText={`Pay ₹${amountRupees} Now via Razorpay`}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 active:scale-[0.99] transition-all shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2 cursor-pointer text-base"
            />
          </div>

          {/* Result Banner */}
          {lastPaymentResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Payment & Signature Verified Successfully!</span>
              </div>
              <div className="text-xs font-mono space-y-1 bg-black/40 p-3 rounded-lg text-emerald-200">
                <p>Order ID: {lastPaymentResult.razorpay_order_id}</p>
                <p>Payment ID: {lastPaymentResult.razorpay_payment_id}</p>
                <p className="break-all">Signature: {lastPaymentResult.razorpay_signature}</p>
              </div>
            </div>
          )}
        </div>

        {/* Live Event Logs */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Code className="w-4 h-4 text-zinc-400" />
              Event Stream / Debug Log
            </h3>
            <button
              onClick={handleCopyLogs}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Logs'}</span>
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1.5 font-mono text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-emerald-400 font-semibold'
                      : log.type === 'error'
                      ? 'text-rose-400 font-semibold'
                      : 'text-zinc-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
