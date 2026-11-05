'use client'

import React from 'react'
import Link from 'next/link'
import { Crown, ArrowLeft, Zap, ShieldCheck, Sparkles, Building2, CheckCircle2 } from 'lucide-react'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

export function RulesClient() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090a10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-yellow-400 selection:text-slate-950 font-sans transition-colors`}>
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px]" />
        </div>
      )}

      <header className={`sticky top-0 z-40 backdrop-blur-xl ${isDark ? 'bg-[#090a10]/90 border-purple-500/20' : 'bg-white/90 border-slate-200 shadow-sm'} border-b transition-colors`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-700 hover:text-purple-600'} transition-colors group flex-shrink-0`}
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">Back to Marketplace</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className={`hidden sm:inline text-xs font-black ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>NO. 1 DOMAIN</span>
            <SiteThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        <div className={`space-y-3 border-b ${isDark ? 'border-purple-500/20' : 'border-slate-200'} pb-8`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-xs font-bold text-yellow-500">
            <Crown className="w-3.5 h-3.5" />
            <span>Official Showcase & Promotion Structure</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Platform Guidelines & Spotlight Tiers</h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'} leading-relaxed`}>
            Transparent directory listings, verified digital showcases, and spotlight promotional tiers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#111222] border-yellow-500/30' : 'bg-white border-amber-200 shadow-sm'} border space-y-2`}>
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Guideline 1: Standard Listing Tier</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
              Any business, creator, or domain investor can showcase their domain on the public directory with an entry spotlight tier starting at strictly <strong>₹50</strong>.
            </p>
          </div>

          <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#111222] border-purple-500/30' : 'bg-white border-purple-200 shadow-sm'} border space-y-2`}>
            <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Guideline 2: Spotlight Priority Tier (+₹50)</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
              Every promotion tier requires a minimum step increment of <strong>₹50</strong> above the lower rank to claim premium showcase placement.
            </p>
          </div>

          <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#111222] border-emerald-500/30' : 'bg-white border-emerald-200 shadow-sm'} border space-y-2`}>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Guideline 3: RBI & Merchant Compliance</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
              All payments are processed securely via RBI-authorized payment aggregators (Razorpay).
            </p>
          </div>

          <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#111222] border-cyan-500/30' : 'bg-white border-cyan-200 shadow-sm'} border space-y-2`}>
            <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Guideline 4: Instant Digital Delivery</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
              Upon successful INR payment capture, promotional showcases and direct click-forwarding redirects go live immediately on the platform.
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gradient-to-r from-purple-950/40 via-[#101222] to-yellow-950/30 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-amber-50 border-purple-200'} border space-y-4`}>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-yellow-500" />
            <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Official Business Details</h3>
          </div>
          <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            Platform operated by <strong>NO. 1 DOMAIN</strong> (Proprietor: <strong>MONU AHIRWAR</strong>). Support: <span className="text-emerald-500 font-bold">+91 9340367384</span> / <span className="text-cyan-500 font-bold">support@no1domain.in</span>.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/about"
              className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-bold text-xs hover:bg-yellow-300 transition-colors shadow-sm"
            >
              Read Full Business Profile →
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 rounded-xl ${isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-white text-slate-800 hover:bg-slate-100'} border border-zinc-700 font-bold text-xs transition-colors`}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
