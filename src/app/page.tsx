'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useTheme } from '@/context/ThemeContext'
import { formatINR } from '@/lib/utils'
import { CATEGORIES, detectWebsiteCategory } from '@/lib/categories'
import dynamic from 'next/dynamic'
const TrackingDashboard = dynamic(() => import('@/components/TrackingDashboard'), {
  ssr: false,
})
import { trackXPurchase, trackXInitiateCheckout } from '@/components/XPixel'
import {
  Crown,
  Globe,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Minus,
  Search,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MousePointerClick,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  ExternalLink,
  Flame,
  Zap,
  Sun,
  Moon,
  Radio,
  Copy,
  Check,
  Activity,
  QrCode,
  Smartphone,
  CreditCard,
  Users,
  Eye,
  Building2,
  Phone,
  Mail,
  Languages,
  Video,
  Play,
  Upload,
  Film,
  RotateCw,
} from 'lucide-react'

interface DomainItem {
  id: string
  rank: number
  title: string
  domain: string
  websiteUrl: string
  videoUrl?: string
  description: string
  category: string
  currentBid: number
  clicks: number
  imageUrl: string
  createdAt: string
  outbidRequired: number
  status?: string
  isDemo?: boolean
}

// Official Feather Logo Component using the user's uploaded high-res emblem
function BrandLogo({ isDark = true, size = 'md' }: { isDark?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 'w-7 h-7 sm:w-8 sm:h-8' : size === 'lg' ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-7 h-7 sm:w-10 sm:h-10'
  const textSize = size === 'sm' ? 'text-xs sm:text-base' : size === 'lg' ? 'text-lg sm:text-3xl' : 'text-sm sm:text-xl'

  return (
    <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer select-none min-w-0">
      {/* Official Glowing Feather Emblem with neon aura */}
      <div
        className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center rounded-xl p-1 transition-all duration-300 group-hover:scale-105 ${
          isDark
            ? 'bg-black/80 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
            : 'bg-slate-950 border border-purple-500/30 shadow-[0_4px_12px_rgba(147,51,234,0.3)]'
        }`}
      >
        <img
          src="/images/logo-transparent.png"
          alt="NO. 1 DOMAIN Official Logo"
          width="48"
          height="48"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 pointer-events-none" />
      </div>

      {/* Brand Name Text: NO. 1 DOMAIN */}
      <div className="flex flex-col justify-center min-w-0 flex-shrink-0">
        <div className={`flex items-center ${textSize} font-black tracking-tight leading-none whitespace-nowrap`}>
          <span className={isDark ? "text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]" : "text-amber-500 drop-shadow-none"}>NO. 1</span>
          <span className={`ml-1 sm:ml-1.5 ${isDark ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(236,72,153,0.35)]' : 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent'}`}>
            DOMAIN
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 sm:mt-1 whitespace-nowrap">
          <span className={`text-[9px] sm:text-[10px] ${isDark ? 'text-amber-400' : 'text-amber-700'} font-black uppercase tracking-wider flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'} animate-pulse flex-shrink-0`} />
            no1domain.in
          </span>
        </div>
      </div>
    </div>
  )
}

const CATEGORY_META: Record<string, {
  label: string
  shortLabel: string
  icon: string
  darkBadge: string
  lightBadge: string
}> = {
  'Ecommerce & Shopping': {
    label: 'Ecommerce Store',
    shortLabel: 'Ecommerce',
    icon: '🛍️',
    darkBadge: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    lightBadge: 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black',
  },
  'Ecommerce & Retail': {
    label: 'Ecommerce Store',
    shortLabel: 'Ecommerce',
    icon: '🛍️',
    darkBadge: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    lightBadge: 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black',
  },
  'Fashion & Clothing': {
    label: 'Fashion & Clothing',
    shortLabel: 'Fashion',
    icon: '👗',
    darkBadge: 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.25)]',
    lightBadge: 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-950 font-black',
  },
  'Electronics & Gadgets': {
    label: 'Electronics & Gadgets',
    shortLabel: 'Electronics',
    icon: '🎧',
    darkBadge: 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    lightBadge: 'bg-amber-100 border-amber-400 text-amber-950 font-black',
  },
  'Food Delivery & Dining': {
    label: 'Food Delivery & Dining',
    shortLabel: 'Food & Dining',
    icon: '🍔',
    darkBadge: 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.25)]',
    lightBadge: 'bg-orange-100 border-orange-400 text-orange-950 font-black',
  },
  'Fintech & Banking': {
    label: 'Fintech & Banking',
    shortLabel: 'Fintech',
    icon: '💳',
    darkBadge: 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.25)]',
    lightBadge: 'bg-teal-100 border-teal-400 text-teal-950 font-black',
  },
  'Stock Trading & Investment': {
    label: 'Stock Trading & Investment',
    shortLabel: 'Stock Trading',
    icon: '📈',
    darkBadge: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    lightBadge: 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black',
  },
  'Beauty & Personal Care': {
    label: 'Beauty & Personal Care',
    shortLabel: 'Beauty Care',
    icon: '💄',
    darkBadge: 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.25)]',
    lightBadge: 'bg-pink-100 border-pink-400 text-pink-950 font-black',
  },
  'Sports & Fitness': {
    label: 'Sports & Fitness',
    shortLabel: 'Sports & Gym',
    icon: '🏋️',
    darkBadge: 'bg-lime-500/20 border-lime-500/50 text-lime-300 shadow-[0_0_12px_rgba(132,204,22,0.25)]',
    lightBadge: 'bg-lime-100 border-lime-400 text-lime-950 font-black',
  },
  'Watches & Luxury': {
    label: 'Watches & Luxury',
    shortLabel: 'Watches',
    icon: '⌚',
    darkBadge: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]',
    lightBadge: 'bg-amber-100 border-amber-400 text-amber-950 font-black',
  },
  'Eyewear & Optical': {
    label: 'Eyewear & Optical',
    shortLabel: 'Eyewear',
    icon: '👓',
    darkBadge: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    lightBadge: 'bg-cyan-100 border-cyan-400 text-cyan-950 font-black',
  },
  'Ethnic & Handcrafted': {
    label: 'Ethnic & Handcrafted',
    shortLabel: 'Ethnic Handloom',
    icon: '🪔',
    darkBadge: 'bg-amber-600/20 border-amber-600/50 text-amber-300 shadow-[0_0_12px_rgba(217,119,6,0.25)]',
    lightBadge: 'bg-amber-100 border-amber-400 text-amber-950 font-black',
  },
  'Tech, AI & Software': {
    label: 'Tech, AI & Software',
    shortLabel: 'Tech & AI',
    icon: '💻',
    darkBadge: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    lightBadge: 'bg-cyan-100 border-cyan-400 text-cyan-950 font-black',
  },
  'Travel, Flights & Hotels': {
    label: 'Travel, Flights & Hotels',
    shortLabel: 'Travel & Flights',
    icon: '✈️',
    darkBadge: 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.25)]',
    lightBadge: 'bg-sky-100 border-sky-400 text-sky-950 font-black',
  },
  'Real Estate & Property': {
    label: 'Real Estate & Property',
    shortLabel: 'Real Estate',
    icon: '🏠',
    darkBadge: 'bg-amber-700/20 border-amber-700/50 text-amber-300 shadow-[0_0_12px_rgba(180,83,9,0.25)]',
    lightBadge: 'bg-amber-100 border-amber-400 text-amber-950 font-black',
  },
  'Automobile & EV': {
    label: 'Automobile & EV',
    shortLabel: 'Automobile & Cars',
    icon: '🚗',
    darkBadge: 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]',
    lightBadge: 'bg-red-100 border-red-400 text-red-950 font-black',
  },
  'Education & EdTech': {
    label: 'Education & EdTech',
    shortLabel: 'Education & Courses',
    icon: '🎓',
    darkBadge: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]',
    lightBadge: 'bg-indigo-100 border-indigo-400 text-indigo-950 font-black',
  },
  'Healthcare & Pharmacy': {
    label: 'Healthcare & Pharmacy',
    shortLabel: 'Health & Pharma',
    icon: '💊',
    darkBadge: 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]',
    lightBadge: 'bg-rose-100 border-rose-400 text-rose-950 font-black',
  },
  'Media & Entertainment': {
    label: 'Media & Entertainment',
    shortLabel: 'Media & News',
    icon: '🎬',
    darkBadge: 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
    lightBadge: 'bg-purple-100 border-purple-400 text-purple-950 font-black',
  },
  'Marketing & SEO': {
    label: 'Marketing & SEO',
    shortLabel: 'Marketing & Ads',
    icon: '📢',
    darkBadge: 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    lightBadge: 'bg-blue-100 border-blue-400 text-blue-950 font-black',
  },
  'Gaming & Esports': {
    label: 'Gaming & Esports',
    shortLabel: 'Gaming & Esports',
    icon: '🎮',
    darkBadge: 'bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.25)]',
    lightBadge: 'bg-violet-100 border-violet-400 text-violet-950 font-black',
  },
  'Crypto & Web3': {
    label: 'Crypto & Web3',
    shortLabel: 'Crypto & Web3',
    icon: '🪙',
    darkBadge: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]',
    lightBadge: 'bg-yellow-100 border-yellow-400 text-yellow-950 font-black',
  },
}

function CategoryBadge({
  category,
  isDark = true,
  size = 'md',
}: {
  category: string
  isDark?: boolean
  size?: 'sm' | 'md'
}) {
  const meta = CATEGORY_META[category] || {
    label: category,
    shortLabel: category,
    icon: '🌐',
    darkBadge: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    lightBadge: 'bg-purple-100 border-purple-400 text-purple-950 font-black',
  }

  const isSmall = size === 'sm'

  return (
    <span
      className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border font-black transition-all ${
        isSmall
          ? 'text-[10px] sm:text-[11px] px-2 py-0.5'
          : 'text-[11px] sm:text-xs px-2.5 py-1'
      } ${isDark ? meta.darkBadge : meta.lightBadge} whitespace-nowrap`}
    >
      <span className="text-xs sm:text-sm">{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  )
}

type Lang = 'en' | 'hi' | 'hinglish'

const homeTranslations = {
  en: {
    navAbout: 'About Us',
    navContact: 'Contact',
    navGuidelines: 'Guidelines',
    navCheckout: 'Checkout',
    navLive: 'Live',
    navAdmin: 'Admin',
    liveOnline: 'Live Online',
    visitorsToday: 'Visitors Today',
    totalViews: 'Total Views',
    bannerWant1: 'Want #1 Spotlight? Upgrade to top showcase by',
    bannerMarketOpen: 'Marketplace open! Claim #1 Spotlight Crown for just',
    bannerFeatures: 'Transparent spotlight tiers • Direct traffic',
    bannerOperated: '⚡ Direct Spotlight Tiers',
    heroBadge: 'Domain Showcase & Spotlight Rankings ⚡',
    heroTagline: "India's Premier Domain Showcase platform. Brands wanting top spotlight feature claim their tier directly.",
    periodAll: 'All-time',
    periodToday: 'Today',
    periodWeek: 'This Week',
    claimFor: 'Claim',
    claimForRank: 'List Domain for',
    currentSpotlightIs: 'Current #1 spotlight tier is',
    minToTake: 'Minimum to take #1 is',
    ruleIncrement: '(+₹50 rule). Every domain increases next rank by ₹50.',
    listingTierDesc: 'Starting entry tier is ₹50. Current #1 is',
    topPayingRule: 'Pay more to claim #1 crown. Highest paying domains stay on top!',
    firstDomainTier: 'Marketplace is open! First domain can claim #1 crown at ₹50 starting tier. Every rank increases by ₹50.',
    inputPlaceholderUrl: 'yourcompany.in or https://...',
    inputPlaceholderTitle: 'Company / Brand Name (e.g. Zara India)',
    inputPlaceholderDesc: 'Tagline or what your company does',
    btnClaimRank: 'Claim rank',
    previewMetadata: 'Metadata preview appears as you type your URL.',
    previewTarget1: 'Target: #1 👑',
    previewTargetRank: 'Target: Competitive Rank',
    allListingsInr: 'All listings in INR (₹)',
    marketPulseLabel: 'Market Pulse / Verified Data',
    marketPulseTitle: 'The board, in motion.',
    liveNow: 'LIVE NOW',
    statDomains: 'Domains',
    statVerifiedSpots: 'Verified spots',
    statBoardValue: 'Board Value',
    statTotalListings: 'Total Listings',
    statLiveVisitors: 'Live Visitors & Views',
    statStream: 'Live Real-Time Stream 📡',
    currentNumber1: 'Current #1 👑',
    claimForMin: 'Claim for',
    loadingLeaderboard: 'Loading live domain leaderboard...',
    boardOpenTitle: 'Board Is Completely Open! 👑',
    boardOpenDesc: 'All previous domains cleared (0 domains). Claim the #1 crown spot for just ₹50 entry fee!',
    boardOpenRule: '⚡ Rule: Each new domain / competitor increases tier by +₹50',
    boardOpenBtn: 'Claim First #1 Spot for ₹50',
    rankingsHeader: 'Domain Leaderboard Rankings',
    visits: 'visits',
    btnVisit: 'Visit',
    btnClaim: 'Claim',
    btnPromote: 'Promote',
    footerOperatedBy: "India's premier verified domain showcase and marketplace operated by",
    footerAbout: 'About Business',
    footerContact: 'Contact Us',
    footerGuidelines: 'Showcase Guidelines',
    footerTerms: 'Terms of Service',
    footerPrivacy: 'Privacy Policy',
    footerRights: 'All rights reserved. Operating NO. 1 DOMAIN (no1domain.in).',
    langSelectTitle: 'Language / भाषा चुनें',
    langEnglish: 'English',
    langHindi: 'हिंदी',
    langHinglish: 'Hinglish',
    langDefaultTag: '(Default)',
    inputUrlRequired: 'Please enter your website or domain URL (e.g. yourbrand.com)',
    validDomain: 'Valid Domain',
    autoDetectedCategory: 'Category Auto-detected:',
    autoDetectedHint: '(You can change it from the dropdown anytime)',
    paymentSuccessMsg: 'Payment successful! Your domain is now live on the board!',
    editAmountTooltip: 'Click to edit amount',
    themeToggleLightTooltip: 'Switch to Light Mode',
    themeToggleDarkTooltip: 'Switch to Dark Mode',
    changeLanguageTooltip: 'Change Language',
  },
  hi: {
    navAbout: 'हमारे बारे में',
    navContact: 'संपर्क करें',
    navGuidelines: 'दिशानिर्देश',
    navCheckout: 'चेकआउट',
    navLive: 'लाइव',
    navAdmin: 'एडमिन',
    liveOnline: 'लाइव ऑनलाइन',
    visitorsToday: 'आज के विज़िटर्स',
    totalViews: 'कुल व्यूज',
    bannerWant1: 'क्या आप #1 स्थान चाहते हैं? शीर्ष शोकेस के लिए अपग्रेड करें',
    bannerMarketOpen: 'मार्केटप्लेस खुला है! #1 स्पॉटलाइट क्राउन केवल में पाएं',
    bannerFeatures: 'पारदर्शी स्पॉटलाइट स्तर • सीधा ट्रैफ़िक',
    bannerOperated: '⚡ डायरेक्ट स्पॉटलाइट टियर्स',
    heroBadge: 'डोमेन शोकेस एवं स्पॉटलाइट रैंकिंग ⚡',
    heroTagline: 'भारत का प्रमुख डोमेन शोकेस प्लेटफ़ॉर्म। जो ब्रांड शीर्ष पर प्रदर्शित होना चाहते हैं, वे सीधे स्पॉटलाइट टियर क्लेम करते हैं।',
    periodAll: 'सभी समय',
    periodToday: 'आज',
    periodWeek: 'इस सप्ताह',
    claimFor: 'प्राप्त करें',
    claimForRank: 'डोमेन लिस्ट करें',
    currentSpotlightIs: 'वर्तमान #1 स्पॉटलाइट टियर है',
    minToTake: '#1 स्थान लेने के लिए न्यूनतम राशि',
    ruleIncrement: '(+₹50 नियम)। प्रत्येक डोमेन अगली रैंक को ₹50 बढ़ाता है।',
    listingTierDesc: 'शुरुआती लिस्टिंग टियर ₹50 है। वर्तमान #1 है',
    topPayingRule: '#1 क्राउन के लिए अधिक राशि दें। जो ज़्यादा पैसे देगा वो टॉप पर रहेगा!',
    firstDomainTier: 'मार्केटप्लेस खुला है! पहला डोमेन केवल ₹50 में #1 क्राउन ले सकता है। प्रत्येक रैंक के साथ ₹50 बढ़ेगा।',
    inputPlaceholderUrl: 'yourcompany.in या https://...',
    inputPlaceholderTitle: 'कंपनी / ब्रांड का नाम (उदा. ज़ारा इंडिया)',
    inputPlaceholderDesc: 'टैगलाइन या आपकी कंपनी क्या करती है',
    btnClaimRank: 'रैंक क्लेम करें',
    previewMetadata: 'URL दर्ज करने पर मेटाडेटा पूर्वावलोकन दिखाई देगा।',
    previewTarget1: 'लक्ष्य: #1 👑',
    previewTargetRank: 'लक्ष्य: प्रतिस्पर्धी रैंक',
    allListingsInr: 'सभी लिस्टिंग भारतीय रुपये (₹) में',
    marketPulseLabel: 'मार्केट पल्स / सत्यापित डेटा',
    marketPulseTitle: 'लाइव बोर्ड गतिविधि',
    liveNow: 'लाइव जारी',
    statDomains: 'डोमेन',
    statVerifiedSpots: 'सत्यापित स्थान',
    statBoardValue: 'बोर्ड वैल्यू',
    statTotalListings: 'कुल लिस्टिंग',
    statLiveVisitors: 'लाइव विज़िटर्स एवं व्यूज',
    statStream: 'लाइव रीयल-टाइम स्ट्रीम 📡',
    currentNumber1: 'वर्तमान #1 👑',
    claimForMin: 'क्लेम करें',
    loadingLeaderboard: 'लाइव डोमेन लीडरबोर्ड लोड हो रहा है...',
    boardOpenTitle: 'बोर्ड पूरी तरह से खुला है! 👑',
    boardOpenDesc: 'सभी पुराने डोमेन साफ़ कर दिए गए हैं (0 डोमेन)। केवल ₹50 प्रवेश शुल्क में #1 क्राउन रैंक पर लिस्ट करें!',
    boardOpenRule: '⚡ नियम: प्रत्येक नए डोमेन / प्रतियोगी के साथ +₹50 बढ़ता जाएगा',
    boardOpenBtn: 'पहला #1 स्थान ₹50 में क्लेम करें',
    rankingsHeader: 'डोमेन लीडरबोर्ड रैंकिंग',
    visits: 'विज़िट',
    btnVisit: 'देखें',
    btnClaim: 'क्लेम करें',
    btnPromote: 'प्रमोट करें',
    footerOperatedBy: 'भारत का प्रमुख सत्यापित डोमेन शोकेस एवं लीडरबोर्ड प्लेटफ़ॉर्म।',
    footerAbout: 'व्यापार परिचय',
    footerContact: 'संपर्क करें',
    footerGuidelines: 'दिशानिर्देश',
    footerTerms: 'सेवा की शर्तें',
    footerPrivacy: 'गोपनीयता नीति',
    footerRights: 'सर्वाधिकार सुरक्षित। NO. 1 DOMAIN (no1domain.in) संचालित।',
    langSelectTitle: 'भाषा चुनें / Select Language',
    langEnglish: 'English (अंग्रेज़ी)',
    langHindi: 'हिंदी',
    langHinglish: 'Hinglish (हिंग्लिश)',
    langDefaultTag: '(डिफ़ॉल्ट)',
    inputUrlRequired: 'कृपया अपना डोमेन या वेबसाइट URL दर्ज करें (उदा. yourbrand.com)',
    validDomain: 'सत्यापित डोमेन',
    autoDetectedCategory: 'श्रेणी स्वचालित रूप से पहचानी गई:',
    autoDetectedHint: '(आप ड्रॉपडाउन से बदल भी सकते हैं)',
    paymentSuccessMsg: 'भुगतान सफल रहा! आपका डोमेन अब बोर्ड पर लाइव है!',
    editAmountTooltip: 'राशि बदलने के लिए क्लिक करें',
    themeToggleLightTooltip: 'लाइट मोड चालू करें',
    themeToggleDarkTooltip: 'डार्क मोड चालू करें',
    changeLanguageTooltip: 'भाषा बदलें',
  },
  hinglish: {
    navAbout: 'About Us',
    navContact: 'Contact Karein',
    navGuidelines: 'Rules & Guidelines',
    navCheckout: 'Checkout',
    navLive: 'Live Tracking',
    navAdmin: 'Admin',
    liveOnline: 'Live Online',
    visitorsToday: 'Aaj Ke Visitors',
    totalViews: 'Total Views',
    bannerWant1: '#1 Spotlight Spot Chahiye? Top rank par jaane ke liye upgrade karein',
    bannerMarketOpen: 'Marketplace open hai! #1 Spotlight Crown claim karein sirf',
    bannerFeatures: 'Transparent spotlight tiers • Direct verified traffic',
    bannerOperated: '⚡ Direct Spotlight Tiers',
    heroBadge: 'Domain Showcase & Spotlight Rankings ⚡',
    heroTagline: 'India ka premier Domain Showcase platform. Jo brand apna domain top par feature karna chahta hai, wo direct spotlight tier claim karta hai.',
    periodAll: 'All-time',
    periodToday: 'Aaj',
    periodWeek: 'Is Hafte',
    claimFor: 'Claim Karein',
    claimForRank: 'Domain List Karein',
    currentSpotlightIs: 'Current #1 spotlight tier hai',
    minToTake: '#1 lene ke liye minimum bid hai',
    ruleIncrement: '(+₹50 rule). Har domain ke sath agla rank ₹50 badhega.',
    listingTierDesc: 'Starting tier ₹50 hai. Current #1 spotlight hai',
    topPayingRule: 'Zyada pay karke #1 crown le sakte hain. Jo zyada paise dega wo top pe rahega!',
    firstDomainTier: 'Marketplace open hai! Pehla domain sirf ₹50 starting tier me #1 crown le sakta hai. Har rank ke sath ₹50 badhta jayega.',
    inputPlaceholderUrl: 'yourcompany.in ya https://...',
    inputPlaceholderTitle: 'Company / Brand Name (jaise: Zara India)',
    inputPlaceholderDesc: 'Tagline ya aapki company kya karti hai',
    btnClaimRank: 'Claim Rank',
    previewMetadata: 'URL enter karte hi preview show hoga.',
    previewTarget1: 'Target: #1 👑',
    previewTargetRank: 'Target: Competitive Rank',
    allListingsInr: 'Sabhi listings INR (₹) me hain',
    marketPulseLabel: 'Market Pulse / Verified Data',
    marketPulseTitle: 'Board ki live activity.',
    liveNow: 'LIVE NOW',
    statDomains: 'Total Domains',
    statVerifiedSpots: 'Verified spots',
    statBoardValue: 'Board Value',
    statTotalListings: 'Total Listings',
    statLiveVisitors: 'Live Visitors & Views',
    statStream: 'Live Real-Time Stream 📡',
    currentNumber1: 'Current #1 👑',
    claimForMin: 'Claim karein',
    loadingLeaderboard: 'Live domain leaderboard load ho raha hai...',
    boardOpenTitle: 'Board Poori Tarah Open Hai! 👑',
    boardOpenDesc: 'Saare purane domains clear hain (0 domains). Sirf ₹50 entry fee me apna domain #1 crown rank par list karein!',
    boardOpenRule: '⚡ Rule: Har naye domain ke sath +₹50 badhta jayega',
    boardOpenBtn: 'Pehla #1 Spot ₹50 me Claim Karein',
    rankingsHeader: 'Domain Leaderboard Rankings',
    visits: 'visits',
    btnVisit: 'Visit',
    btnClaim: 'Claim Karein',
    btnPromote: 'Promote Karein',
    footerOperatedBy: "India ka premier verified domain showcase aur marketplace operated by",
    footerAbout: 'About Business',
    footerContact: 'Contact Karein',
    footerGuidelines: 'Showcase Guidelines',
    footerTerms: 'Terms of Service',
    footerPrivacy: 'Privacy Policy',
    footerRights: 'All rights reserved. Operating NO. 1 DOMAIN (no1domain.in).',
    langSelectTitle: 'Bhasha Chunein / Select Language',
    langEnglish: 'English',
    langHindi: 'हिंदी',
    langHinglish: 'Hinglish',
    langDefaultTag: '(Default)',
    inputUrlRequired: 'Kripya apna domain ya website URL enter karein (e.g. yourbrand.com)',
    validDomain: 'Valid Domain',
    autoDetectedCategory: 'Category Auto-detected:',
    autoDetectedHint: '(Aap dropdown se change bhi kar sakte hain)',
    paymentSuccessMsg: 'Payment successful! Aapka domain ab board par LIVE ho gaya hai!',
    editAmountTooltip: 'Amount change karne ke liye click karein',
    themeToggleLightTooltip: 'Light Mode karein',
    themeToggleDarkTooltip: 'Dark Mode karein',
    changeLanguageTooltip: 'Language Badlein',
  },
} as const

function getPaginationPages(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages]
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export default function HomePage() {
  const { data: session } = useSession()
  const [domains, setDomains] = useState<DomainItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [period, setPeriod] = useState<'all' | 'today' | 'week'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rankingsRef = useRef<HTMLDivElement>(null)

  // Language State - Default is strictly 'en' (English) for any first-time visitor
  const [lang, setLang] = useState<Lang>('en')
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Reset to page 1 whenever category or search filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchQuery, period])

  // Load saved language preference from localStorage on mount (if set by user)
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('no1domain_lang') as Lang | null
      if (savedLang === 'en' || savedLang === 'hi' || savedLang === 'hinglish') {
        setLang(savedLang)
      }
    } catch (e) {
      // Ignore storage errors in private browsing
    }
  }, [])

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Switch language and persist to localStorage
  const handleSelectLang = (selected: Lang) => {
    setLang(selected)
    setLangMenuOpen(false)
    try {
      localStorage.setItem('no1domain_lang', selected)
    } catch (e) {
      // Ignore storage errors
    }
  }

  // Active translation dictionary
  const t = homeTranslations[lang] || homeTranslations.en

  // Global Theme from ThemeContext (toggles entire site!)
  const { isDark, toggleTheme: handleToggleTheme } = useTheme()

  // Settings from admin
  const [top1Bid, setTop1Bid] = useState(1000)
  const [top1Increment, setTop1Increment] = useState(50)
  const [minBidForTop1, setMinBidForTop1] = useState(1050)
  const [totalBoardValue, setTotalBoardValue] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [todayVisits, setTodayVisits] = useState(0)
  const [liveOnlineCount, setLiveOnlineCount] = useState(1)
  const [todayVisitorsCount, setTodayVisitorsCount] = useState(26)
  const [totalViewsCount, setTotalViewsCount] = useState(8610)
  const [visitorSessionId, setVisitorSessionId] = useState('')

  // Top 3 Podium Domains (Always persistent all-time #1, #2, #3 champions)
  const [allTop3Domains, setAllTop3Domains] = useState<DomainItem[]>([])



  // Active Video Modal Player
  const [activePlayingVideo, setActivePlayingVideo] = useState<{
    id?: string
    title: string
    videoUrl: string
    websiteUrl?: string
    domain?: string
    rank?: number
    category?: string
  } | null>(null)

  const getYoutubeEmbed = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null
  }

  const getYoutubeThumb = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` : null
  }

  // Hero Claim Form State
  const [claimAmount, setClaimAmount] = useState(1050)
  const [inputUrl, setInputUrl] = useState('')
  const [inputTitle, setInputTitle] = useState('')
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false)
  const [inputCategory, setInputCategory] = useState('Ecommerce & Shopping')
  const [isCategoryManuallyEdited, setIsCategoryManuallyEdited] = useState(false)
  const [autoDetectedCategory, setAutoDetectedCategory] = useState<string | null>(null)
  const [inputDescription, setInputDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Real-time Projected Rank calculation based on claimAmount and current board listings
  const projectedRank = useMemo(() => {
    if (claimAmount >= minBidForTop1) return 1
    const domainsAhead = domains.filter((d) => {
      const bid = d.currentBid || 0
      if (bid >= claimAmount) return true
      return false
    }).length
    return Math.max(2, Math.min(20, domainsAhead + 1))
  }, [claimAmount, minBidForTop1, domains])

  // Real-time URL preview
  const [previewLoading, setPreviewLoading] = useState(false)
  const [domainPreview, setDomainPreview] = useState<{
    domain: string
    title: string
    faviconUrl: string
    brandName?: string
    stats?: string
    verified?: boolean
    detectedCategory?: string
  } | null>(null)
  const activeSearchRef = useRef('')

  // Payment Modal State
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean
    domain: string
    url: string
    title: string
    category: string
    description: string
    imageUrl?: string
    videoUrl?: string
    amount: number
    orderId: string
    keyId: string
    isTop1: boolean
    targetRank?: number
    listingId?: string
    step?: 'terms' | 'payment_gate'
  } | null>(null)
  const [modalActiveTab, setModalActiveTab] = useState<'qr' | 'razorpay'>('qr')
  const [modalCopiedUpi, setModalCopiedUpi] = useState(false)
  const [platformUpiId, setPlatformUpiId] = useState('paytm-7828003666@paytm')
  const [platformQrEnabled, setPlatformQrEnabled] = useState(true)

  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Live Visitor Tracking State (DataFast Dashboard Suite)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  const [selectedTrackingDomainId, setSelectedTrackingDomainId] = useState<string | null>(null)
  const [trackingDetails, setTrackingDetails] = useState<any>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [dataFastTab, setDataFastTab] = useState<'all' | 'live_users' | 'chart' | 'paths' | 'locations' | 'sources' | 'systems' | 'events' | 'stream'>('all')
  const [dataFastPeriod, setDataFastPeriod] = useState<'last24h' | 'last7d' | 'last30d' | 'all'>('last24h')
  const [locationSubTab, setLocationSubTab] = useState<'country' | 'region' | 'city'>('country')
  const [systemSubTab, setSystemSubTab] = useState<'browser' | 'os' | 'device'>('browser')
  const [sourceSubTab, setSourceSubTab] = useState<'source' | 'medium'>('source')
  const [showAllCountries, setShowAllCountries] = useState(false)
  const [showAllPaths, setShowAllPaths] = useState(false)
  const [channelPillTab, setChannelPillTab] = useState<'channel' | 'referrer' | 'campaign'>('channel')
  const [pagePillTab, setPagePillTab] = useState<'hostname' | 'page' | 'entry_page' | 'exit_link'>('page')
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>('organic_search')
  const [selectedPageItem, setSelectedPageItem] = useState<any | null>(null)
  const [showChannelDetails, setShowChannelDetails] = useState(false)
  const [demoNotice, setDemoNotice] = useState<string | null>(null)

  useEffect(() => {
    if (demoNotice) {
      const timer = setTimeout(() => setDemoNotice(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [demoNotice])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const demoParam = params.get('demo_domain')
      if (demoParam) {
        setDemoNotice(
          lang === 'hi'
            ? `⚡ ${demoParam} केवल एक डेमो डोमेन (Showcase) है। अपनी असली वेबसाइट लगाने के लिए क्लेम करें!`
            : lang === 'hinglish'
            ? `⚡ ${demoParam} ek demo showcase domain hai. Apni real website lagane ke liye claim karein!`
            : `⚡ ${demoParam} is a showcase domain. Claim this spot to display your own website!`
        )
      }
    }
  }, [])

  // Fetch domains & stats (with silent background polling option)
  const fetchBoardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const params = new URLSearchParams()
      if (activeCategory !== 'All') params.set('category', activeCategory)
      if (searchQuery) params.set('search', searchQuery)
      params.set('period', period)

      const res = await fetch(`/api/domains?${params}`)
      if (res.ok) {
        const data = await res.json()
        setDomains(data.domains || [])
        setTotalBoardValue(data.totalBoardValue || 0)
        setTotalClicks(data.totalTrackedClicks || 0)
        setTodayVisits(data.todayVisits || 0)
        const t1Bid = data.top1Bid || 0
        const defaultMin = 50
        const defaultInc = 50
        const inc = data.top1Increment || defaultInc
        setTop1Bid(t1Bid)
        setTop1Increment(inc)
        const requiredTop1 = data.minBidForTop1 || (t1Bid > 0 ? t1Bid + inc : (activeCategory === 'All' ? 1050 : defaultMin))
        setMinBidForTop1(requiredTop1)
        if (showLoading) {
          setClaimAmount(requiredTop1)
        }
        if (activeCategory === 'All') {
          setAllTop3Domains((data.domains || []).slice(0, 3))
        }
        if (data.domains?.[0]?.id && !selectedTrackingDomainId) {
          setSelectedTrackingDomainId(data.domains[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load domains:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // Fetch detailed live tracking data for a domain
  const fetchTrackingDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/tracking/${id}`)
      if (res.ok) {
        const data = await res.json()
        setTrackingDetails(data)
      }
    } catch (e) {
      console.error('Failed to fetch tracking details:', e)
    }
  }

  // Open live tracking modal with browser history state so Chrome Back button closes modal smoothly
  const handleOpenTracking = (domainId?: string) => {
    const targetId = domainId || selectedTrackingDomainId || domains[0]?.id || null
    setSelectedTrackingDomainId(targetId)
    setTrackingModalOpen(true)
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ no1Modal: 'tracking' }, '')
      } catch (e) {}
    }
    if (targetId) {
      setTrackingLoading(true)
      fetchTrackingDetails(targetId).finally(() => setTrackingLoading(false))
    }
  }

  const handleCloseTracking = () => {
    setTrackingModalOpen(false)
    if (typeof window !== 'undefined' && window.history.state?.no1Modal === 'tracking') {
      try {
        window.history.back()
      } catch (e) {}
    }
  }

  // Handle Chrome / Browser Back button navigation so it closes open modals instead of exiting the page
  useEffect(() => {
    const onPopState = () => {
      setTrackingModalOpen(false)
      setPaymentModal(null)
      setActivePlayingVideo(null)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Auto-poll domain tracking details (runs continuously so embedded dashboard & modal always stay live)
  useEffect(() => {
    const targetId = selectedTrackingDomainId || domains[0]?.id
    if (!targetId) return
    fetchTrackingDetails(targetId)
    const interval = setInterval(() => {
      fetchTrackingDetails(targetId)
    }, 3500)
    return () => clearInterval(interval)
  }, [selectedTrackingDomainId, domains[0]?.id])

  // Real-time background auto-polling for board domain visit updates (every 3.5s)
  useEffect(() => {
    fetchBoardData(true)
    const interval = setInterval(() => {
      fetchBoardData(false)
    }, 3500)
    return () => clearInterval(interval)
  }, [activeCategory, period, searchQuery])

  // Load platform public settings (including live admin UPI ID and QR enable status)
  useEffect(() => {
    fetch('/api/admin/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data?.upiId) {
          setPlatformUpiId(data.upiId)
        }
        if (data?.qrEnabled !== undefined) {
          setPlatformQrEnabled(Boolean(data.qrEnabled))
          if (!data.qrEnabled) {
            setModalActiveTab('razorpay')
          }
        }
      })
      .catch(() => {})
  }, [])

  // Live Site Visitor & Page Views Recording (Works automatically on Mobile & Desktop)
  useEffect(() => {
    let sessionId = ''
    let isNew = false
    try {
      sessionId = sessionStorage.getItem('no1_visitor_session') || ''
      isNew = sessionStorage.getItem('no1_is_new') === '1'
      if (isNew) {
        sessionStorage.removeItem('no1_is_new')
      }
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        sessionStorage.setItem('no1_visitor_session', sessionId)
        isNew = true
      }
      setVisitorSessionId(sessionId)

      // Capture Twitter / X Ads Click ID (twclid) for CAPI attribution
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const twclid = urlParams.get('twclid')
        if (twclid) {
          sessionStorage.setItem('no1_twclid', twclid)
        }
      }
    } catch (e) {
      sessionId = `sess_${Date.now()}`
      setVisitorSessionId(sessionId)
    }

    const recordVisit = async () => {
      try {
        const res = await fetch(`/api/track-visit?t=${Date.now()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
          body: JSON.stringify({
            sessionId,
            isNewSession: true,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (typeof data.liveOnline === 'number') setLiveOnlineCount(data.liveOnline)
          if (typeof data.todayVisitors === 'number') {
            setTodayVisitorsCount(data.todayVisitors)
            setTodayVisits(data.todayVisitors)
          }
          if (typeof data.totalViews === 'number') setTotalViewsCount(data.totalViews)
        }
      } catch (e) {
        console.warn('Live visit track error:', e)
      }
    }

    recordVisit()

    // Real-Time Heartbeat Ping (keeps visitor ONLINE and records dwell time "kitni der ruka")
    const sendLiveHeartbeat = (extraPayload?: any) => {
      try {
        let activeTargetDomain: string | null = null
        let activeTargetUrl: string | null = null
        let activeTargetTitle: string | null = null
        let activeTargetTime: number | undefined = undefined

        if (typeof window !== 'undefined') {
          try {
            activeTargetDomain = sessionStorage.getItem('no1_active_target_domain')
            activeTargetUrl = sessionStorage.getItem('no1_active_target_url')
            activeTargetTitle = sessionStorage.getItem('no1_active_target_title')
            const rawTime = sessionStorage.getItem('no1_active_target_time')
            if (rawTime) {
              const diff = Date.now() - parseInt(rawTime, 10)
              if (diff > 5 * 60 * 1000) {
                // Expired: reset back to no1domain.in
                sessionStorage.removeItem('no1_active_target_domain')
                sessionStorage.removeItem('no1_active_target_url')
                sessionStorage.removeItem('no1_active_target_title')
                sessionStorage.removeItem('no1_active_target_time')
                activeTargetDomain = null
              } else {
                activeTargetTime = parseInt(rawTime, 10)
              }
            }
          } catch (e) {}
        }

        const isExternal = Boolean(activeTargetDomain && activeTargetDomain !== 'no1domain.in' && activeTargetDomain !== 'NO. 1 DOMAIN Directory')

        fetch('/api/track-visit/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            currentUrl: isExternal ? (activeTargetUrl || `https://${activeTargetDomain}`) : (window.location.pathname + window.location.search),
            linkTitle: isExternal ? (activeTargetTitle || activeTargetDomain) : 'no1domain.in',
            domainName: isExternal ? activeTargetDomain : 'no1domain.in',
            targetDomain: isExternal ? activeTargetDomain : 'no1domain.in',
            domainId: isExternal ? (selectedTrackingDomainId || undefined) : undefined,
            targetStartedAt: isExternal ? activeTargetTime : undefined,
            isExternal,
            lastAction: isExternal
              ? `Active on ${activeTargetDomain}`
              : (activeCategory ? `Browsing category: ${activeCategory}` : 'Browsing no1domain.in'),
            ...extraPayload,
          }),
        }).catch(() => {})
      } catch (e) {}
    }

    sendLiveHeartbeat()
    const heartbeatTimer = setInterval(sendLiveHeartbeat, 3000)

    // Mark visitor as LEFT when tab is closed / navigated away
    const handleVisitorLeave = () => {
      try {
        const payload = JSON.stringify({ sessionId })
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track-visit/leave', payload)
        } else {
          fetch('/api/track-visit/leave', {
            method: 'POST',
            body: payload,
            keepalive: true,
          })
        }
      } catch (e) {}
    }

    window.addEventListener('beforeunload', handleVisitorLeave)

    // When visitor returns to this tab from browsing the destination site, update their status back to active board
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendLiveHeartbeat({
          lastAction: 'Returned to Board',
          isExternal: false,
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Track when any link or button is clicked anywhere on the website
    const handleGlobalClick = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement
        const anchor = target.closest('a')
        const button = target.closest('button')
        const el = anchor || button
        if (el) {
          const text = (el.textContent || '').trim().replace(/\s+/g, ' ').substring(0, 50)
          const href = anchor?.getAttribute('href') || ''
          sendLiveHeartbeat({
            lastAction: `Clicked: ${text || href || 'Interactive Button'}`,
            currentUrl: href || window.location.pathname,
            linkTitle: text || 'Navigated Link',
          })
        }
      } catch (e) {}
    }

    document.addEventListener('click', handleGlobalClick, { capture: true })

    // Poll live online users and total views smoothly in real-time when page is active
    const pollTimer = setInterval(async () => {
      if (typeof document !== 'undefined' && document.hidden) return
      try {
        const res = await fetch(`/api/track-visit?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
        if (res.ok) {
          const data = await res.json()
          if (typeof data.liveOnline === 'number') setLiveOnlineCount(data.liveOnline)
          if (typeof data.todayVisitors === 'number') {
            setTodayVisitorsCount(data.todayVisitors)
            setTodayVisits(data.todayVisitors)
          }
          if (typeof data.totalViews === 'number') setTotalViewsCount(data.totalViews)
        }
      } catch (e) {}
    }, 3500)

    return () => {
      clearInterval(pollTimer)
      clearInterval(heartbeatTimer)
      window.removeEventListener('beforeunload', handleVisitorLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('click', handleGlobalClick, { capture: true })
    }
  }, [selectedTrackingDomainId, activeCategory])

  // Load all-time top 3 on initial mount
  useEffect(() => {
    fetch('/api/domains')
      .then((res) => res.json())
      .then((data) => {
        setAllTop3Domains((data.domains || []).slice(0, 3))
      })
      .catch((e) => console.error('Failed to load all-time top 3:', e))
  }, [])

  useEffect(() => {
    fetchBoardData(true)
  }, [activeCategory, period])

  // Manual trigger for domain & website preview search
  const handleManualProfileSearch = async (forcedQuery?: string, forceRefresh = true) => {
    const raw = (forcedQuery !== undefined ? forcedQuery : inputUrl).trim()
    const cleanQuery = raw

    if (!cleanQuery || cleanQuery.length < 2) return

    activeSearchRef.current = cleanQuery
    try {
      setPreviewLoading(true)
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(cleanQuery)}${forceRefresh ? '&refresh=true' : ''}`)
      if (res.ok) {
        const data = await res.json()
        if (activeSearchRef.current === cleanQuery) {
          setDomainPreview({
            domain: data.domain,
            title: data.title,
            faviconUrl: data.faviconUrl,
            brandName: data.brandName,
            detectedCategory: data.detectedCategory,
          })
          if (!isTitleManuallyEdited && (data.brandName || data.title)) {
            setInputTitle(data.brandName || data.title)
          }
          if (!isCategoryManuallyEdited && data.detectedCategory) {
            setInputCategory(data.detectedCategory)
            setAutoDetectedCategory(data.detectedCategory)
          }
          if (data.description && !inputDescription.trim()) {
            setInputDescription(data.description)
          }
        }
      }
    } catch (err: any) {
      console.warn('Profile search error:', err)
    } finally {
      if (activeSearchRef.current === cleanQuery) {
        setPreviewLoading(false)
      }
    }
  }



  // Live URL Preview Debounce & Auto Title/Category Sync (Domain Mode)
  useEffect(() => {
    const raw = inputUrl.trim()
    if (!raw || raw.length < 2) {
      setDomainPreview(null)
      activeSearchRef.current = ''
      return
    }

    activeSearchRef.current = raw
    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        setPreviewLoading(true)
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(raw)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          if (activeSearchRef.current === raw) {
            setDomainPreview({
              domain: data.domain,
              title: data.title,
              faviconUrl: data.faviconUrl,
              brandName: data.brandName,
              stats: data.stats,
              verified: Boolean(data.verified),
              detectedCategory: data.detectedCategory,
            })
            if (!isTitleManuallyEdited && (data.brandName || data.title)) {
              setInputTitle(data.brandName || data.title)
            }
            if (!isCategoryManuallyEdited && data.detectedCategory) {
              setInputCategory(data.detectedCategory)
              setAutoDetectedCategory(data.detectedCategory)
            }
            if (data.description && !inputDescription.trim()) {
              setInputDescription(data.description)
            }
          }
        }
      } catch (err: any) {
        // ignore
      } finally {
        if (activeSearchRef.current === raw) {
          setPreviewLoading(false)
        }
      }
    }, 450)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [inputUrl, isTitleManuallyEdited, isCategoryManuallyEdited, inputDescription])

  // Top 1 minimum increment control
  const handleIncreaseBid = () => {
    setClaimAmount((prev) => prev + top1Increment)
    setFormError(null)
  }

  const handleDecreaseBid = () => {
    const minTier = 50
    setClaimAmount((prev) => Math.max(minTier, prev - top1Increment))
    setFormError(null)
  }

  // Handle Hero Submission (Video Upload or Domain Claim)
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    let rawUrl = inputUrl.trim()
    if (!rawUrl) {
      setFormError(t.inputUrlRequired)
      return
    }

    const cleanDom = rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || rawUrl
    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
    const finalThumbnail = domainPreview?.faviconUrl || `https://www.google.com/s2/favicons?domain=${cleanDom}&sz=128`
    const rawTitle = inputTitle.trim()
    const finalTitle = rawTitle || cleanDom

    // Open Checkout Modal
    setTermsAccepted(false)
    const finalBidAmount = Math.max(50, claimAmount || 50)
    setPaymentModal({
      isOpen: true,
      domain: cleanDom,
      url: fullUrl,
      title: finalTitle,
      category: inputCategory || 'Ecommerce & Shopping',
      description: inputDescription.trim() || '',
      imageUrl: finalThumbnail,
      amount: finalBidAmount,
      orderId: `order_${Date.now()}`,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
      isTop1: finalBidAmount >= minBidForTop1,
      targetRank: projectedRank,
    })
  }

  // Handle click on domain link or visit button (optimistically increments UI count and opens /go/:id tracking)
  const handleDomainVisit = (e: React.MouseEvent, domain: DomainItem) => {
    e.stopPropagation()
    // Optimistically increment visit count on screen immediately so user sees count increase instantly!
    setDomains((prev) =>
      prev.map((d) => (d.id === domain.id ? { ...d, clicks: (d.clicks || 0) + 1 } : d))
    )

    const clickNow = Date.now()
    const targetUrl = domain.websiteUrl || `https://${domain.domain}`
    const targetTitle = domain.title || domain.domain

    // Persist active target domain in sessionStorage so ongoing heartbeat continues tracking dwell time on this website
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('no1_active_target_domain', domain.domain)
        sessionStorage.setItem('no1_active_target_url', targetUrl)
        sessionStorage.setItem('no1_active_target_title', targetTitle)
        sessionStorage.setItem('no1_active_target_time', clickNow.toString())
      } catch (e) {}
    }

    // Notify server that visitor is browsing this external website so live tracker keeps them online
    const sessId = visitorSessionId || (typeof window !== 'undefined' ? (sessionStorage.getItem('no1_visitor_session') || '') : '')
    if (sessId) {
      fetch('/api/track-visit/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessId,
          domainId: domain.id,
          domainName: domain.domain,
          targetDomain: domain.domain,
          targetStartedAt: clickNow,
          currentUrl: targetUrl,
          linkTitle: targetTitle,
          lastAction: `Active on ${domain.domain}`,
          isExternal: true,
          stayOnlineMinutes: 5,
        }),
      }).catch(() => {})
    }
    return true
  }

  // Handle click anywhere on domain card to open website tracking link
  const handleCardClick = (e: React.MouseEvent, domain: DomainItem) => {
    const target = e.target as HTMLElement
    // If clicked on or inside an interactive button or anchor link, let that element handle it directly
    if (target.closest('button') || target.closest('a')) {
      return
    }

    // Optimistically increment click count in state immediately
    setDomains((prev) =>
      prev.map((d) => (d.id === domain.id ? { ...d, clicks: (d.clicks || 0) + 1 } : d))
    )

    const clickNow = Date.now()
    const targetUrl = domain.websiteUrl || `https://${domain.domain}`
    const targetTitle = domain.title || domain.domain

    // Persist active target domain in sessionStorage so ongoing heartbeat continues tracking dwell time on this website
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('no1_active_target_domain', domain.domain)
        sessionStorage.setItem('no1_active_target_url', targetUrl)
        sessionStorage.setItem('no1_active_target_title', targetTitle)
        sessionStorage.setItem('no1_active_target_time', clickNow.toString())
      } catch (e) {}
    }

    const sessId = visitorSessionId || (typeof window !== 'undefined' ? (sessionStorage.getItem('no1_visitor_session') || '') : '')
    if (sessId) {
      fetch('/api/track-visit/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessId,
          domainId: domain.id,
          domainName: domain.domain,
          targetDomain: domain.domain,
          targetStartedAt: clickNow,
          currentUrl: targetUrl,
          linkTitle: targetTitle,
          lastAction: `Active on ${domain.domain}`,
          isExternal: true,
          stayOnlineMinutes: 5,
        }),
      }).catch(() => {})
    }

    const sidParam = sessId ? `?sid=${encodeURIComponent(sessId)}` : ''
    const trackingUrl = domain.id ? `/go/${domain.id}${sidParam}` : (domain.websiteUrl || `https://${domain.domain}`)
    window.open(trackingUrl, '_blank', 'noopener,noreferrer')
  }

  // Handle Quick Promote button from any card - Opens checkout modal directly!
  const handleQuickOutbid = (domain: DomainItem) => {
    const targetAmount = domain.rank === 1
      ? minBidForTop1
      : domain.currentBid + top1Increment

    setClaimAmount(Math.max(50, targetAmount))

    // The user wants to claim this spotlight tier for THEIR OWN brand/website!
    // Do NOT copy the competitor's domain. Preserve what user typed in hero input or prompt for new domain.
    const currentInput = inputUrl.trim()
    const cleanDom = currentInput ? currentInput.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : ''
    const targetUrl = currentInput ? (currentInput.startsWith('http') ? currentInput : `https://${currentInput}`) : ''

    // Open checkout modal directly
    setTermsAccepted(false)
    trackXInitiateCheckout(targetAmount, cleanDom || domain.domain)
    const isTop1Claim = targetAmount >= minBidForTop1
    const quickTargetRank = isTop1Claim ? 1 : domain.rank

    setPaymentModal({
      isOpen: true,
      domain: cleanDom,
      url: targetUrl,
      title: inputTitle.trim() || (cleanDom ? cleanDom : `Target: Spotlight #${quickTargetRank}`),
      category: domain.category || inputCategory || 'Ecommerce & Retail',
      description: inputDescription.trim() || '',
      imageUrl: domainPreview?.faviconUrl || undefined,
      amount: targetAmount,
      orderId: `order_spotlight_${Date.now()}`,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
      isTop1: isTop1Claim,
      targetRank: quickTargetRank,
    })
  }

  const executeDirectVerification = async (payload: {
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
      setSubmitting(true)
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          domain: payload.domain || paymentModal?.domain,
          url: payload.url || paymentModal?.url,
          title: payload.title || paymentModal?.title,
          category: payload.category || paymentModal?.category,
          imageUrl: paymentModal?.imageUrl || domainPreview?.faviconUrl,
          videoUrl: paymentModal?.videoUrl,
          description: paymentModal?.description,
          twclid: typeof window !== 'undefined' ? (sessionStorage.getItem('no1_twclid') || undefined) : undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        // Fire client-side X Pixel purchase conversion for browser + CAPI dual tracking & deduplication
        trackXPurchase({
          conversionId: payload.razorpayOrderId,
          amount: payload.amount,
          domain: payload.domain || paymentModal?.domain,
        })

        setPaymentSuccess(`🎉 ${t.paymentSuccessMsg} (${payload.domain || paymentModal?.domain})`)
        setPaymentModal(null)
        setInputUrl('')
        setInputTitle('')
        setInputDescription('')
        setDomainPreview(null)
        await fetchBoardData(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        alert(data.message || 'Payment verification failed')
      }
    } catch (err: any) {
      alert(err.message || 'Error verifying payment')
    } finally {
      setSubmitting(false)
    }
  }

  // Real Razorpay Payment Gateway Integration
  const handleVerifyPayment = async () => {
    if (!paymentModal) return

    try {
      setSubmitting(true)
      let activeListingId = paymentModal.listingId

      // Step 1: Create or fetch listing on server (status PENDING)
      if (!activeListingId) {
        const createRes = await fetch('/api/domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: paymentModal.url || `https://${paymentModal.domain}`,
            title: paymentModal.title || paymentModal.domain,
            category: paymentModal.category || 'Ecommerce & Shopping',
            description: paymentModal.description || '',
            amount: paymentModal.amount,
            imageUrl: paymentModal.imageUrl,
            videoUrl: paymentModal.videoUrl,
          }),
        })
        const createData = await createRes.json()
        if (!createRes.ok) {
          throw new Error(createData.message || 'Failed to initialize domain listing')
        }
        activeListingId = createData.listingId
      }

      // Step 2: Create real Razorpay order on server
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(paymentModal.amount * 100), // paise
          currency: 'INR',
          receipt: `bid_${activeListingId}_${Date.now()}`,
          notes: {
            domain: paymentModal.domain,
            listingId: activeListingId,
            website: 'https://no1domain.in/',
          },
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.message || 'Failed to initialize Razorpay payment order')
      }

      // Step 3: Launch Razorpay Checkout Popup
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        throw new Error('Razorpay SDK is loading. Please click pay again in 2 seconds.')
      }

      const rzpOptions: any = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: 'INR',
        name: 'NO. 1 DOMAIN',
        description: `Showcase spot for ${paymentModal.domain} (${paymentModal.isTop1 ? 'Rank #1 Spotlight 👑' : `Rank #${paymentModal.targetRank || ''}`})`,
        image: '/images/logo-transparent.png',
        order_id: orderData.order_id,
        prefill: {
          name: paymentModal.title || paymentModal.domain,
        },
        theme: {
          color: '#FACC15',
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false)
          },
        },
        handler: async (response: any) => {
          await executeDirectVerification({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            listingId: activeListingId || '',
            amount: paymentModal.amount,
            domain: paymentModal.domain,
            url: paymentModal.url,
            title: paymentModal.title,
            category: paymentModal.category,
          })
        },
      }

      const rzp = new (window as any).Razorpay(rzpOptions)
      rzp.on('payment.failed', (resp: any) => {
        setSubmitting(false)
        alert(`Payment Failed: ${resp.error?.description || 'Transaction was cancelled or declined.'}`)
      })
      rzp.open()
    } catch (err: any) {
      alert(err.message || 'Error processing payment')
      setSubmitting(false)
    }
  }

  const ITEMS_PER_PAGE = 50

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(domains.length / ITEMS_PER_PAGE))
  }, [domains])

  const top3Domains = useMemo(() => {
    if (currentPage === 1) {
      return domains.slice(0, 3)
    }
    return []
  }, [domains, currentPage])

  const remainingDomains = useMemo(() => {
    if (currentPage === 1) {
      return domains.slice(3, ITEMS_PER_PAGE)
    }
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return domains.slice(startIndex, endIndex)
  }, [domains, currentPage])

  const currentRangeText = useMemo(() => {
    if (domains.length === 0) return '0 - 0 of 0'
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const end = Math.min(currentPage * ITEMS_PER_PAGE, domains.length)
    return `${start} - ${end} of ${domains.length.toLocaleString()}`
  }, [domains, currentPage])

  const paginationPages = useMemo(() => {
    return getPaginationPages(currentPage, totalPages)
  }, [currentPage, totalPages])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return
    setCurrentPage(newPage)
    if (rankingsRef.current) {
      rankingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }

  // Theme-specific styles
  const theme = {
    bg: isDark ? 'bg-[#090a0f]' : 'bg-[#f8fafc]',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    headerBg: isDark ? 'bg-[#090a0f]/90 border-purple-500/15' : 'bg-white/95 border-slate-200',
    cardBg: isDark ? 'bg-[#121320]/90 border-purple-500/20' : 'bg-white border-slate-200 shadow-sm',
    heroBg: isDark ? 'bg-gradient-to-b from-[#131422] via-[#0f1019] to-[#0c0d15] border-purple-500/25' : 'bg-gradient-to-b from-purple-50 via-white to-white border-purple-100 shadow-md',
    inputBg: isDark ? 'bg-[#0a0b12] border-purple-500/30 text-white' : 'bg-white border-slate-300 text-slate-900',
    subtext: isDark ? 'text-zinc-400' : 'text-slate-800 font-medium',
    statCard: isDark ? 'bg-[#11121e]/90 border-purple-500/20' : 'bg-white border-slate-200 shadow-sm',
    footerBg: isDark ? 'bg-[#06070a] border-purple-500/20' : 'bg-slate-100 border-slate-200',
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} relative overflow-x-hidden pb-16 sm:pb-0 transition-colors duration-300`} suppressHydrationWarning>
      {/* Background Ambient Glows */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[400px] bg-cyan-500/10 rounded-full blur-[130px]"></div>
          <div className="absolute top-[50%] left-[-10%] w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-[130px]"></div>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="relative z-20 bg-gradient-to-r from-purple-950 via-[#0d0e17] to-cyan-950 border-b border-purple-500/20 text-[11px] sm:text-xs py-2 px-3 text-center font-medium backdrop-blur-md flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-white">
        <span className="flex items-center gap-1.5 text-yellow-400 font-extrabold tracking-wide">
          <Crown className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse flex-shrink-0" />
          {top1Bid > 0 ? (
            <>{t.bannerWant1} +{formatINR(top1Increment)} ({formatINR(minBidForTop1)}).</>
          ) : (
            <>{t.bannerMarketOpen} {formatINR(minBidForTop1)} (₹50 tier).</>
          )}
        </span>
        <span className="hidden sm:inline text-purple-400/40">•</span>
        <span className="text-cyan-300 font-semibold">{t.bannerFeatures}</span>
        <span className="hidden sm:inline text-purple-400/40">•</span>
        <Link href="/about" className="text-amber-400 font-black bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 text-[10px] flex items-center gap-1 hover:bg-amber-400/20 transition-colors">
          {t.bannerOperated}
        </Link>
      </div>

      {/* Navigation Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${theme.headerBg} border-b shadow-lg transition-colors`}>
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-1 sm:gap-3">
          {/* Logo (Never wraps, never overlaps) */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <BrandLogo isDark={isDark} />
            </Link>

            {/* Live Indicator Pill (Visible on Desktop & Laptop) */}
            <div
              onClick={() => handleOpenTracking()}
              className={`hidden md:flex items-center gap-2.5 text-xs px-3.5 py-1.5 rounded-full border shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                isDark ? 'bg-purple-950/40 border-purple-500/25 text-purple-200' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
              }`}
              title="Click to view Live Platform & Domain Visitor Tracking"
            >
              <span className={`flex items-center gap-1.5 font-black px-2.5 py-0.5 rounded-full border ${
                isDark ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' : 'text-emerald-800 bg-emerald-50 border-emerald-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
                <span>{liveOnlineCount} {t.liveOnline}</span>
              </span>
              <span className="opacity-40">·</span>
              <span className={`flex items-center gap-1 font-black ${isDark ? 'text-yellow-400' : 'text-amber-800'}`}>
                <Users className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-700'}`} />
                <span>{todayVisitorsCount.toLocaleString('en-IN')} {t.visitorsToday}</span>
              </span>
              <span className="opacity-40">·</span>
              <span className={`flex items-center gap-1 font-black ${isDark ? 'text-cyan-400' : 'text-sky-800'}`}>
                <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`} />
                <span>{totalViewsCount.toLocaleString('en-IN')} {t.totalViews}</span>
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Business Navigation Links (Visible on Laptop & Desktop) */}
            <nav className={`hidden lg:flex items-center gap-3 sm:gap-4 text-xs font-black ${isDark ? 'text-zinc-300' : 'text-slate-900'} mr-1`}>
              <Link href="/about" className={`${isDark ? 'hover:text-yellow-400' : 'hover:text-amber-700 text-slate-800'} transition-colors flex items-center gap-1 py-1`}>
                <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-700'}`} />
                <span>{t.navAbout}</span>
              </Link>
              <Link href="/contact" className={`${isDark ? 'hover:text-cyan-400' : 'hover:text-cyan-700 text-slate-800'} transition-colors flex items-center gap-1 py-1`}>
                <Phone className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
                <span>{t.navContact}</span>
              </Link>
              <Link href="/rules" className={`${isDark ? 'hover:text-purple-400' : 'hover:text-purple-700 text-slate-800'} transition-colors flex items-center gap-1 py-1`}>
                <Crown className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-700'}`} />
                <span>{t.navGuidelines}</span>
              </Link>
            </nav>

            {/* Direct Checkout Link */}
            <Link
              href="/checkout"
              className="text-xs sm:text-sm font-black text-slate-950 flex items-center gap-1 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-[0_0_15px_rgba(250,204,21,0.35)] active:scale-95 flex-shrink-0"
              title="Open Payment Checkout"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950 flex-shrink-0" />
              <span className="hidden xs:inline">{t.navCheckout}</span>
              <span className="xs:hidden text-[11px]">Pay</span>
            </Link>

            {/* Live Visitor Tracking Opener (hidden on small mobile, visible on sm:flex since mobile has dedicated bar below header) */}
            <button
              onClick={() => handleOpenTracking()}
              className={`hidden sm:flex text-xs sm:text-sm font-black items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border transition-all active:scale-95 flex-shrink-0 ${
                isDark
                  ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'text-sky-950 bg-sky-50 border-sky-300 hover:bg-sky-100 shadow-sm'
              }`}
              title="Live Domain Visitor Tracking"
            >
              <Radio className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-700'} animate-pulse flex-shrink-0`} />
              <span>{t.navLive}</span>
            </button>

            {/* Admin Panel Link */}
            <Link
              href="/admin"
              className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-black flex-shrink-0 ${
                isDark
                  ? 'border-purple-500/20 bg-purple-500/10 text-purple-300 hover:text-purple-200'
                  : 'border-purple-200 bg-purple-50 text-purple-950 hover:bg-purple-100 shadow-sm'
              }`}
              title="Admin Panel"
            >
              <Shield className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-700'} flex-shrink-0`} />
              <span className="hidden md:inline">{t.navAdmin}</span>
            </Link>

            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className={`px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border flex items-center gap-0.5 sm:gap-1.5 text-xs font-black transition-all flex-shrink-0 ${
                  isDark
                    ? 'bg-zinc-800/80 border-purple-500/30 text-zinc-200 hover:text-white hover:bg-zinc-700 hover:border-purple-400/60'
                    : 'bg-white border-slate-300 text-slate-950 hover:bg-slate-100 hover:border-slate-400 shadow-sm'
                }`}
                title={t.changeLanguageTooltip}
                aria-label="Change Language"
                aria-expanded={langMenuOpen}
              >
                <Languages className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-600'} flex-shrink-0`} />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide">
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'HG'}
                </span>
                <ChevronDown className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'} transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-2xl p-1.5 border shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDark
                      ? 'bg-[#12131f]/95 border-purple-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.85)] text-zinc-200'
                      : 'bg-white/95 border-slate-200 shadow-[0_10px_35px_rgba(0,0,0,0.15)] text-slate-800'
                  }`}
                >
                  <div className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-b mb-1 ${
                    isDark ? 'text-zinc-400 border-zinc-800' : 'text-slate-400 border-slate-100'
                  }`}>
                    {t.langSelectTitle}
                  </div>

                  {/* English Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectLang('en')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      lang === 'en'
                        ? isDark
                          ? 'bg-purple-600/25 text-yellow-300 border border-purple-500/50'
                          : 'bg-amber-50 text-amber-900 border border-amber-300'
                        : isDark
                        ? 'hover:bg-zinc-800/80 text-zinc-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇬🇧</span>
                      <span>English <span className="text-[10px] font-normal opacity-70">{t.langDefaultTag}</span></span>
                    </span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                  </button>

                  {/* Hindi Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectLang('hi')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left mt-1 ${
                      lang === 'hi'
                        ? isDark
                          ? 'bg-purple-600/25 text-yellow-300 border border-purple-500/50'
                          : 'bg-amber-50 text-amber-900 border border-amber-300'
                        : isDark
                        ? 'hover:bg-zinc-800/80 text-zinc-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇮🇳</span>
                      <span>हिंदी (Hindi)</span>
                    </span>
                    {lang === 'hi' && <Check className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                  </button>

                  {/* Hinglish Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectLang('hinglish')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left mt-1 ${
                      lang === 'hinglish'
                        ? isDark
                          ? 'bg-purple-600/25 text-yellow-300 border border-purple-500/50'
                          : 'bg-amber-50 text-amber-900 border border-amber-300'
                        : isDark
                        ? 'hover:bg-zinc-800/80 text-zinc-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇮🇳</span>
                      <span>Hinglish</span>
                    </span>
                    {lang === 'hinglish' && <Check className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            {/* Prominent, Never-Hidden Theme Toggle Button (Light / Dark) */}
            <button
              onClick={handleToggleTheme}
              className={`p-1.5 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all flex-shrink-0 cursor-pointer active:scale-95 select-none shadow-sm ${
                isDark
                  ? 'bg-amber-400/15 border-amber-400/40 text-yellow-300 hover:bg-amber-400/25 hover:border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                  : 'bg-indigo-50/95 border-indigo-300 text-indigo-950 hover:bg-indigo-100'
              }`}
              title={isDark ? t.themeToggleLightTooltip : t.themeToggleDarkTooltip}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-in spin-in-180 duration-300 flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-black text-yellow-300 hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600 animate-in spin-in-180 duration-300 flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-black text-indigo-950 hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-Only Dedicated Live Visitor & Views Bar */}
      <div
        onClick={() => handleOpenTracking()}
        className="w-full sm:hidden bg-gradient-to-r from-purple-950/90 via-[#0a0b14] to-purple-950/90 border-b border-purple-500/25 px-3 py-2 flex items-center justify-between text-[11px] font-extrabold cursor-pointer active:opacity-80 transition-opacity shadow-sm"
      >
        <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{liveOnlineCount} {t.liveOnline}</span>
        </span>
        <span className="flex items-center gap-1 text-yellow-400">
          <Users className="w-3 h-3 text-yellow-400" />
          <span>{todayVisitorsCount} {t.visitorsToday}</span>
        </span>
        <span className="flex items-center gap-1 text-cyan-300">
          <Eye className="w-3 h-3 text-cyan-300" />
          <span>{totalViewsCount.toLocaleString('en-IN')} {t.totalViews}</span>
        </span>
      </div>



      {/* Category Filter Rail */}
      <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 pt-2 sm:pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            const meta = CATEGORY_META[cat]
            const icon = cat === 'All' ? '🌟' : (meta?.icon || '🌐')
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  if (cat !== 'All') {
                    setInputCategory(cat)
                  }
                }}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20 font-black'
                    : isDark
                    ? 'bg-[#13141f] text-zinc-400 hover:text-white hover:bg-[#1a1c2b] border border-purple-500/15'
                    : 'bg-white text-slate-800 font-bold hover:text-slate-950 border border-slate-300 shadow-sm'
                }`}
              >
                <span>{icon}</span>
                <span>{cat}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Hero Domain Showcase Section */}
      <section id="showcase-hero" className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
        <div className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border shadow-2xl transition-colors ${theme.heroBg}`}>
          <div className="relative z-10 max-w-3xl mx-auto text-center mb-4 sm:mb-5">
            <div className={`inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full border mb-2.5 sm:mb-3 max-w-full shadow-sm ${
              isDark
                ? 'bg-purple-500/15 border-purple-500/30 text-cyan-300'
                : 'bg-indigo-50 border-indigo-200 text-indigo-950'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400 animate-ping' : 'bg-indigo-600 animate-pulse'} flex-shrink-0`}></span>
              <span className={`text-[10px] sm:text-xs font-black truncate ${isDark ? 'text-cyan-300' : 'text-indigo-950'}`}>
                {t.heroBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2.5 sm:mb-3.5">
              <span className={`${isDark ? 'text-yellow-400' : 'text-amber-500'} drop-shadow-[0_2px_12px_rgba(250,204,21,0.35)]`}>NO. 1</span>
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent ml-2">
                DOMAIN
              </span>
              <span className="sr-only"> — Domain Advertisement & Marketing Services Platform</span>
            </h1>

            {/* Ranking Period Switch */}
            <div className={`inline-flex p-1 rounded-xl border text-xs font-bold mb-3 sm:mb-4 ${isDark ? 'bg-[#090a10] border-purple-500/30' : 'bg-slate-100 border-slate-300'}`}>
              {(['all', 'today', 'week'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg capitalize transition-all ${
                    period === p
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25'
                      : isDark
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-slate-800 font-bold hover:text-slate-950'
                  }`}
                >
                  {p === 'all' ? t.periodAll : p === 'today' ? t.periodToday : t.periodWeek}
                </button>
              ))}
            </div>

            {/* Claim #1 for Amount Counter */}
            <div className="flex flex-col items-center justify-center gap-1.5 mb-2.5 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <span className="text-lg sm:text-2xl font-extrabold flex items-center gap-1.5 flex-wrap justify-center">
                  {claimAmount >= minBidForTop1 ? (
                    <>{t.claimFor} <span className="text-yellow-500 dark:text-yellow-400 font-black">#1 👑</span> for</>
                  ) : (
                    <>{t.claimForRank} <span className="text-cyan-400 font-black">Rank #{projectedRank}</span> for</>
                  )}
                </span>
                <div className={`inline-flex items-center gap-1.5 sm:gap-2 border-2 rounded-xl px-2 sm:px-2.5 py-1 shadow-[0_0_20px_rgba(250,204,21,0.2)] ${
                  isDark ? 'border-yellow-400/70 bg-[#171828] text-yellow-400' : 'border-amber-400 bg-amber-50 text-amber-950 font-black'
                }`}>
                  <button
                    onClick={handleDecreaseBid}
                    disabled={claimAmount <= 50}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all font-bold disabled:opacity-40 disabled:cursor-not-allowed ${
                      isDark ? 'border-yellow-400/40 bg-[#212338] text-yellow-400 hover:bg-yellow-400 hover:text-slate-950' : 'border-amber-300 bg-white text-amber-950 hover:bg-amber-100'
                    }`}
                    aria-label="Decrease tier"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <label className="inline-flex items-center justify-center cursor-text min-w-[80px] sm:min-w-[105px] px-1 py-0.5 rounded-xl hover:bg-yellow-400/10 transition-colors group">
                    <span className="text-lg sm:text-2xl font-black select-none">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={claimAmount === 0 ? '' : claimAmount}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9]/g, '')
                        if (!cleaned) {
                          setClaimAmount(0)
                        } else {
                          const val = parseInt(cleaned, 10)
                          setClaimAmount(val)
                        }
                        setFormError(null)
                      }}
                      onBlur={() => {
                        const minAllowed = 50
                        if (claimAmount < minAllowed) {
                          setClaimAmount(minAllowed)
                        }
                      }}
                      className={`text-lg sm:text-2xl font-black text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-400/70 rounded-lg px-1 py-0.5 tracking-tight transition-all cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDark ? 'text-yellow-400' : 'text-amber-950'
                      }`}
                      style={{
                        width: `${Math.max(2, String(claimAmount || 50).length) * 1.3 + 0.8}ch`,
                        maxWidth: '120px',
                      }}
                      title={t.editAmountTooltip}
                      aria-label="Claim amount"
                    />
                  </label>
                  <button
                    onClick={handleIncreaseBid}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center active:scale-95 transition-all font-bold ${
                      isDark ? 'border-yellow-400/40 bg-[#212338] text-yellow-400 hover:bg-yellow-400 hover:text-slate-950' : 'border-amber-300 bg-white text-amber-950 hover:bg-amber-100'
                    }`}
                    aria-label="Increase tier"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Form: Website / Domain Showcase */}
          <form onSubmit={handleHeroSubmit} className="relative z-10 max-w-2xl mx-auto space-y-3">
            <div className="grid sm:grid-cols-12 gap-2.5 sm:gap-3">
              <div className="sm:col-span-6 relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
                  <Globe className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    const val = e.target.value
                    setInputUrl(val)
                    if (!val.trim()) {
                      setInputTitle('')
                      setIsTitleManuallyEdited(false)
                      setIsCategoryManuallyEdited(false)
                      setAutoDetectedCategory(null)
                    } else if (!isCategoryManuallyEdited) {
                      const detected = detectWebsiteCategory(val)
                      setInputCategory(detected)
                      setAutoDetectedCategory(detected)
                    }
                  }}
                  placeholder={t.inputPlaceholderUrl}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${theme.inputBg}`}
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={inputCategory}
                  onChange={(e) => {
                    setInputCategory(e.target.value)
                    setIsCategoryManuallyEdited(true)
                  }}
                  className={`w-full px-3 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 ${theme.inputBg}`}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                    const meta = CATEGORY_META[cat]
                    return (
                      <option key={cat} value={cat}>
                        {meta?.icon ? `${meta.icon} ` : ''}{cat}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 sm:py-0 sm:h-full min-h-[46px] rounded-xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98] bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-950 shadow-yellow-500/25 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <span>Claim for {formatINR(claimAmount)}</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>


            {domainPreview && (
              <div
                className={`rounded-2xl border p-3.5 sm:p-4 transition-all ${
                  isDark
                    ? 'bg-[#10121e] border-slate-700/60 shadow-md text-zinc-300'
                    : 'bg-white border-slate-300 shadow-md text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={domainPreview.faviconUrl || '/favicon.ico'}
                      alt={domainPreview.domain}
                      className="w-10 h-10 rounded-lg object-contain bg-zinc-900 border p-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{domainPreview.domain}</p>
                      <p className="text-xs text-zinc-400 truncate max-w-xs">{domainPreview.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryBadge category={inputCategory} isDark={isDark} size="sm" />
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.validDomain}</span>
                    </span>
                  </div>
                </div>

                {autoDetectedCategory && !isCategoryManuallyEdited && (
                  <div className="mt-2.5 pt-2 border-t border-purple-500/15 flex items-center justify-between text-xs flex-wrap gap-1">
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span>{t.autoDetectedCategory}</span>
                      <strong className={isDark ? 'text-yellow-300' : 'text-amber-950 font-black'}>
                        {autoDetectedCategory}
                      </strong>
                    </span>
                    <span className="text-[10px] sm:text-[11px] opacity-70">
                      {t.autoDetectedHint}
                    </span>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Error Banner */}
          {formError && (
            <div className="mt-3 p-3 bg-red-950/60 border border-red-500/50 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-2 max-w-2xl mx-auto">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Success Banner */}
          {paymentSuccess && (
            <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{paymentSuccess}</span>
              </div>
              <button onClick={() => setPaymentSuccess(null)} className="text-emerald-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>


      {/* Leaderboard Section (Top 3 Podium + Ranked Domain Cards) */}
      <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 pb-24 sm:pb-20">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500 mb-2" />
            <p className="text-sm text-zinc-400">{t.loadingLeaderboard}</p>
          </div>
        ) : domains.length === 0 ? (
          <div className={`py-12 sm:py-16 px-4 text-center border-2 border-dashed rounded-3xl ${isDark ? 'border-yellow-500/30 bg-[#121322]/80' : 'border-amber-400 bg-amber-50/60 shadow-sm'}`}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Crown className="w-8 h-8 text-slate-950 fill-slate-950 animate-bounce" />
            </div>
            <h3 className={`font-black text-xl sm:text-2xl mb-2 ${isDark ? 'text-yellow-400' : 'text-amber-950'}`}>
              {t.boardOpenTitle}
            </h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-900'} max-w-md mx-auto mb-4 leading-relaxed font-semibold`}>
              {t.boardOpenDesc}
            </p>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black ${isDark ? 'bg-purple-500/15 border-purple-500/30 text-cyan-300' : 'bg-amber-100 border-amber-300 text-amber-950'} mb-5`}>
              <span>{t.boardOpenRule}</span>
            </div>
            <div>
              <button
                onClick={() => {
                  setTermsAccepted(false)
                  setPaymentModal({
                    isOpen: true,
                    domain: inputUrl.trim() || 'yourbrand.com',
                    url: inputUrl.trim() ? (inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`) : 'https://yourbrand.com',
                    title: inputTitle.trim() || 'My Showcase Spot',
                    category: inputCategory || 'Ecommerce & Shopping',
                    description: inputDescription.trim() || '',
                    imageUrl: domainPreview?.faviconUrl || undefined,
                    amount: minBidForTop1 || 50,
                    orderId: `order_${Date.now()}`,
                    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
                    isTop1: true,
                  })
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-yellow-500/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t.boardOpenBtn}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Top 3 Podium Grid (Page 1 Only) */}
            {top3Domains.length > 0 && (
            <div className="grid gap-3.5 sm:gap-4 md:grid-cols-3">
              {top3Domains.map((item) => {
                const isTop1 = item.rank === 1
                const isTop2 = item.rank === 2
                const isTop3 = item.rank === 3

                const nextOutbid = isTop1 ? minBidForTop1 : item.currentBid + top1Increment

                return (
                  <article
                    key={item.id}
                    onClick={(e) => handleCardClick(e, item)}
                    onAuxClick={(e) => {
                      if (e.button === 1) handleCardClick(e, item)
                    }}
                    className={`relative rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] cursor-pointer group/card ${
                      isDark
                        ? isTop1
                          ? 'bg-gradient-to-b from-yellow-500/15 via-[#151624] to-[#10111a] border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.15)] ring-1 ring-yellow-400/50'
                          : isTop2
                          ? 'bg-gradient-to-b from-purple-500/15 via-[#151624] to-[#10111a] border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.12)]'
                          : 'bg-gradient-to-b from-cyan-500/15 via-[#151624] to-[#10111a] border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.12)]'
                        : isTop1
                        ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md ring-1 ring-amber-300'
                        : isTop2
                        ? 'bg-gradient-to-b from-purple-50 to-white border-purple-200 shadow-sm'
                        : 'bg-gradient-to-b from-cyan-50 to-white border-cyan-200 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Rank Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span
                            className={`font-black px-2.5 sm:px-3 py-1 rounded-full text-xs tracking-wide ${
                              isTop1
                                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/30'
                                : isTop2
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
                            }`}
                          >
                            #{item.rank} {isTop1 && '👑'}
                          </span>
                          {item.status === 'PENDING' && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-yellow-950/60 text-yellow-300 border border-yellow-500/40 animate-pulse">
                              PENDING
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-lg sm:text-xl font-black ${
                            isTop1 ? 'text-yellow-500' : isTop2 ? 'text-pink-500' : 'text-cyan-500'
                          }`}
                        >
                          {formatINR(item.currentBid)}
                        </span>
                      </div>

                      {/* Domain & Favicon / Video Thumbnail */}
                      <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5">
                        <div
                          className="relative flex-shrink-0 cursor-pointer group/thumb"
                          onClick={(e) => {
                            if (item.videoUrl) {
                              e.stopPropagation()
                              setActivePlayingVideo({
                                id: item.id,
                                title: item.title,
                                videoUrl: item.videoUrl,
                                websiteUrl: item.websiteUrl,
                                domain: item.domain,
                                rank: item.rank,
                                category: item.category,
                              })
                            }
                          }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.domain}
                            width="56"
                            height="56"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-purple-500/30 object-contain p-2 bg-[#0e101a] flex-shrink-0 shadow-md group-hover/card:border-yellow-400/50 transition-all"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${item.domain}&size=128`
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <a
                            href={item.id ? `/go/${item.id}${visitorSessionId ? `?sid=${encodeURIComponent(visitorSessionId)}` : ''}` : (item.websiteUrl || `https://${item.domain}`)}
                            onClick={(e) => {
                              handleDomainVisit(e, item)
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-sm sm:text-base text-cyan-400 hover:text-cyan-300 font-mono tracking-tight flex items-center gap-1 truncate group-hover/card:underline"
                            title={item.domain}
                          >
                            <span className="truncate">{item.domain}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          </a>
                          <div className="mt-1.5">
                            <CategoryBadge category={item.category} isDark={isDark} size="md" />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className={`text-xs ${theme.subtext} line-clamp-2 mb-3 leading-relaxed font-medium`}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenTracking(item.id)
                        }}
                        className={`flex items-center gap-1.5 text-xs font-black flex-shrink-0 px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 ${
                          isDark
                            ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-300 shadow-sm'
                        }`}
                        title="View Live Visitor Tracking for this domain"
                      >
                        <Radio className={`w-3.5 h-3.5 animate-pulse flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`} />
                        <span className={isDark ? 'text-cyan-300 font-bold' : 'text-sky-950 font-black'}>{item.clicks} visits</span>
                      </button>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <a
                          href={item.id ? `/go/${item.id}${visitorSessionId ? `?sid=${encodeURIComponent(visitorSessionId)}` : ''}` : (item.websiteUrl || `https://${item.domain}`)}
                          onClick={(e) => {
                            handleDomainVisit(e, item)
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                            isDark
                              ? 'border-zinc-700/80 bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {t.btnVisit}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickOutbid(item)
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 ${
                            isTop1
                              ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-yellow-500/25'
                              : isTop2
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-pink-500/25'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                          }`}
                        >
                          {isTop1
                            ? `${t.btnClaim} ${formatINR(minBidForTop1)}`
                            : `${t.btnPromote} ${formatINR(nextOutbid)}`}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            )}

            {/* Ranked List for #4 onwards (or #51 onwards on page 2+) */}
            {remainingDomains.length > 0 && (
            <div ref={rankingsRef} className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-black uppercase tracking-wider px-1 sm:px-2 opacity-60">
                <span>{t.rankingsHeader}</span>
                <span className="text-yellow-500 font-bold">INR (₹)</span>
              </div>

              {remainingDomains.map((item) => {
                const nextOutbid = item.currentBid + top1Increment

                return (
                  <article
                    key={item.id}
                    onClick={(e) => handleCardClick(e, item)}
                    onAuxClick={(e) => {
                      if (e.button === 1) handleCardClick(e, item)
                    }}
                    className={`rounded-xl p-3 sm:p-4 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 transition-all shadow-sm cursor-pointer group/card ${
                      isDark
                        ? 'border-purple-500/15 bg-[#10111d]/90 hover:border-yellow-400/50 hover:bg-[#151627]'
                        : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <span className="font-black opacity-60 text-xs sm:text-sm w-6 sm:w-7 text-center pt-0.5 sm:pt-0 flex-shrink-0">
                        #{item.rank}
                      </span>

                      <div className="relative flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.domain}
                          width="44"
                          height="44"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-purple-500/25 p-1.5 bg-[#0e101a] object-contain flex-shrink-0 shadow-sm group-hover/card:border-yellow-400/40 transition-all"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${item.domain}&size=128`
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <a
                            href={item.id ? `/go/${item.id}${visitorSessionId ? `?sid=${encodeURIComponent(visitorSessionId)}` : ''}` : (item.websiteUrl || `https://${item.domain}`)}
                            onClick={(e) => {
                              handleDomainVisit(e, item)
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-sm sm:text-base font-mono tracking-tight text-cyan-400 hover:text-cyan-300 group-hover/card:underline truncate max-w-[200px] sm:max-w-none flex items-center gap-1"
                            title={item.domain}
                          >
                            <span className="truncate">{item.domain}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          </a>
                          <CategoryBadge category={item.category} isDark={isDark} size="sm" />
                          {item.status === 'PENDING' && (
                            <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md bg-yellow-950/60 text-yellow-300 border border-yellow-500/40 animate-pulse whitespace-nowrap">
                              PENDING
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className={`text-xs ${theme.subtext} truncate mt-0.5 font-medium`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-purple-500/15">
                      <div className="text-left sm:text-right">
                        <span className="block font-black text-sm text-yellow-500">
                          {formatINR(item.currentBid)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenTracking(item.id)
                          }}
                          className={`text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1 mt-0.5 group cursor-pointer transition-colors ${
                            isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-800 hover:text-sky-950'
                          }`}
                          title="Open Live Visitor Tracking"
                        >
                          <Radio className={`w-2.5 h-2.5 animate-pulse flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                          <span className={`group-hover:underline ${isDark ? 'text-cyan-300' : 'text-sky-950 font-black'}`}>{item.clicks} {t.visits}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={item.id ? `/go/${item.id}${visitorSessionId ? `?sid=${encodeURIComponent(visitorSessionId)}` : ''}` : (item.websiteUrl || `https://${item.domain}`)}
                          onClick={(e) => {
                            handleDomainVisit(e, item)
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                            isDark
                              ? 'border-zinc-700 bg-[#0c0d15] text-zinc-300 hover:text-white hover:bg-zinc-800'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {t.btnVisit}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickOutbid(item)
                          }}
                          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 whitespace-nowrap shadow-sm transition-all active:scale-95 ${
                            isDark
                              ? 'bg-[#222438] hover:bg-yellow-400 hover:text-slate-950 text-yellow-300 border border-yellow-400/30'
                              : 'bg-slate-900 hover:bg-amber-500 text-white'
                          }`}
                        >
                          {item.rank === 1 ? `${t.btnClaim} ${formatINR(minBidForTop1)}` : `${t.btnPromote} ${formatINR(nextOutbid)}`}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            )}

            {/* Pagination Controls & Range Count matching user reference style */}
            {domains.length > 0 && (
              <div className="pt-6 sm:pt-8 pb-3 flex flex-col items-center justify-center gap-2.5">
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 select-none">
                    {/* Previous Page Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        currentPage === 1
                          ? 'opacity-25 cursor-not-allowed text-zinc-500'
                          : isDark
                          ? 'text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:scale-95'
                      }`}
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {paginationPages.map((page, idx) => {
                      if (typeof page === 'string') {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-7 h-9 flex items-center justify-center text-zinc-500 font-bold"
                          >
                            ...
                          </span>
                        )
                      }

                      const isActive = page === currentPage

                      return (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-[#e06b53] text-white shadow-md shadow-[#e06b53]/40 scale-105'
                              : isDark
                              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 active:scale-95'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}

                    {/* Next Page Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        currentPage === totalPages
                          ? 'opacity-25 cursor-not-allowed text-zinc-500'
                          : isDark
                          ? 'text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:scale-95'
                      }`}
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Range text e.g. "1 - 20 of 20" or "1 - 50 of 3,149" */}
                <div className={`text-xs sm:text-sm font-semibold tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {currentRangeText}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Live Domain Visitor Tracking Dashboard (DataFast Full Suite, Fullscreen Modal) */}
      <TrackingDashboard
        isOpen={trackingModalOpen}
        onClose={handleCloseTracking}
        domains={domains}
        selectedDomainId={selectedTrackingDomainId}
        onSelectDomain={(id) => {
          setSelectedTrackingDomainId(id)
          fetchTrackingDetails(id)
        }}
        trackingDetails={trackingDetails}
        trackingLoading={trackingLoading}
        lang={lang}
        isDark={isDark}
        minBidForTop1={minBidForTop1}
        onClaimFirstSpot={() => {
          setTrackingModalOpen(false)
          setTermsAccepted(false)
          setPaymentModal({
            isOpen: true,
            domain: inputUrl.trim() || 'yourbrand.com',
            url: inputUrl.trim() ? (inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`) : 'https://yourbrand.com',
            title: inputTitle.trim() || 'My Domain',
            category: inputCategory || 'Ecommerce & Retail',
            description: inputDescription.trim() || '',
            amount: minBidForTop1 || 50,
            orderId: `order_${Date.now()}`,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
            isTop1: true,
          })
        }}
        siteLiveOnlineCount={liveOnlineCount}
      />

      {/* Razorpay INR Checkout Modal (With Terms of Service Agreement & Payment Gateway) */}
      {paymentModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border-2 border-yellow-500/30 overflow-hidden ${isDark ? 'bg-[#0e0f1a] text-slate-100' : 'bg-white text-slate-900'}`}>
            {paymentModal.step === 'payment_gate' ? (
              /* Step 2: Payment Gate (UPI QR Code / Razorpay) */
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-md">
                      ₹
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
                        PAYMENT GATEWAY
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        Complete Spotlight Listing Payment
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setPaymentModal(null)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Domain & Price Pill */}
                <div className="p-3.5 rounded-2xl bg-[#141528] border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Target Domain</span>
                    <span className="text-sm font-black text-yellow-400 block truncate max-w-[180px]">
                      {paymentModal.domain}
                    </span>
                    <span className={`text-[10px] font-bold ${paymentModal.isTop1 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      Position: {paymentModal.isTop1 ? '#1 Spotlight 👑' : `Rank #${paymentModal.targetRank || 2} Showcase`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Amount Due</span>
                    <strong className="text-xl font-black text-yellow-400 block">
                      {formatINR(paymentModal.amount)}
                    </strong>
                    <span className="text-[10px] text-zinc-400">INR (Instant)</span>
                  </div>
                </div>

                {/* Tabs */}
                {platformQrEnabled ? (
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#090a12] border border-purple-500/20 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setModalActiveTab('qr')}
                      className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        modalActiveTab === 'qr'
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 shadow-md font-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI QR Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalActiveTab('razorpay')}
                      className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        modalActiveTab === 'razorpay'
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 shadow-md font-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Razorpay Popup</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#090a12] border border-purple-500/20 text-xs font-bold text-center text-amber-400 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Razorpay Gateway Checkout</span>
                  </div>
                )}

                {modalActiveTab === 'qr' && (
                  <div className="space-y-3 text-center">
                    <div className="mx-auto w-[170px] h-[170px] p-2 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-yellow-400/50">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          `upi://pay?pa=${platformUpiId}&pn=NO.1%20DOMAIN&am=${paymentModal.amount}&cu=INR&tn=Domain_Showcase_${paymentModal.domain}`
                        )}`}
                        alt="UPI Payment QR Code"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-300">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Scan with PhonePe, Paytm, Google Pay or BHIM</span>
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#141528] border border-purple-500/20 text-xs">
                      <span className="font-mono text-zinc-300 truncate">{platformUpiId}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(platformUpiId)
                          setModalCopiedUpi(true)
                          setTimeout(() => setModalCopiedUpi(false), 2000)
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 ml-2 flex-shrink-0"
                      >
                        {modalCopiedUpi ? (
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

                {modalActiveTab === 'razorpay' && (
                  <div className="space-y-4 py-2 text-center">
                    <div className="p-4 rounded-2xl bg-[#141528] border border-purple-500/20 text-left space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Razorpay Gateway Integration</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">
                        Click below to open the Razorpay checkout overlay for Card, Netbanking, or UPI payments.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).Razorpay) {
                          const options: any = {
                            key: paymentModal.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                            amount: paymentModal.amount * 100,
                            currency: 'INR',
                            name: 'NO. 1 DOMAIN',
                            description: `Claim spot for ${paymentModal.domain}`,
                            handler: async function (response: any) {
                              await executeDirectVerification({
                                razorpayOrderId: response.razorpay_order_id || paymentModal.orderId,
                                razorpayPaymentId: response.razorpay_payment_id || '',
                                razorpaySignature: response.razorpay_signature || '',
                                listingId: paymentModal.listingId || '',
                                amount: paymentModal.amount,
                              })
                            },
                          }
                          if (paymentModal.orderId && !paymentModal.orderId.startsWith('order_sim_')) {
                            options.order_id = paymentModal.orderId
                          }
                          new (window as any).Razorpay(options).open()
                        }
                      }}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-xs sm:text-sm hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Launch Razorpay Popup ({formatINR(paymentModal.amount)})</span>
                    </button>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-purple-500/20 space-y-2">
                  <button
                    type="button"
                    onClick={handleVerifyPayment}
                    disabled={submitting}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Opening Razorpay Gateway...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-slate-950" />
                        <span>Pay {formatINR(paymentModal.amount)} with Razorpay / UPI</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentModal(prev => prev ? { ...prev, step: 'terms' } : null)}
                    disabled={submitting}
                    className="w-full py-2 text-center text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    ← Back to Terms & Review
                  </button>
                </div>
              </div>
            ) : (
              /* Step 1: Confirm Rank & Terms */
              <div>
                {/* Top Bar */}
                <div className="p-5 pb-0 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-yellow-400 block mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                      <span>SECURE PAYMENT (RAZORPAY GATEWAY)</span>
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Confirm & Pay for Rank
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 font-medium">
                      Pay securely via UPI (PhonePe, Paytm, GPay), Cards, or NetBanking. Listing goes LIVE instantly upon payment confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentModal(null)}
                    className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close checkout modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Rank & Price Card (Exact layout from user screenshot) */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-[#151628] border-purple-500/25' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      {paymentModal.imageUrl && (
                        <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex-shrink-0 shadow-sm">
                          <img
                            src={paymentModal.imageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-zinc-950 bg-zinc-900"
                            onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                          RANK
                        </span>
                        <div className="flex items-center gap-1.5 my-0.5">
                          <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                            {paymentModal.isTop1 ? '#1 👑' : '#Showcase'}
                          </span>
                        </div>
                        <span className="text-xs text-purple-300 font-bold block truncate max-w-[150px]">
                          {paymentModal.category || 'Ecommerce & Retail'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        PRICE
                      </span>
                      <label className="inline-flex items-center justify-end my-0.5 cursor-text hover:bg-yellow-400/10 px-1 py-0.5 rounded-lg transition-colors">
                        <span className="text-2xl sm:text-3xl font-black text-yellow-400 select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={paymentModal.amount === 0 ? '' : paymentModal.amount}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^0-9]/g, '')
                            const val = cleaned ? parseInt(cleaned, 10) : 0
                            setPaymentModal(prev => prev ? {
                              ...prev,
                              amount: val,
                              isTop1: val >= minBidForTop1,
                            } : null)
                          }}
                          onBlur={() => {
                            if (paymentModal.amount < 50) {
                              setPaymentModal(prev => prev ? {
                                ...prev,
                                amount: 50,
                                isTop1: 50 >= minBidForTop1,
                              } : null)
                            }
                          }}
                          className="w-24 text-right text-2xl sm:text-3xl font-black text-yellow-400 bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-400 rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          title="Click to edit payment amount"
                          aria-label="Payment amount"
                        />
                      </label>
                      <span className="text-xs text-zinc-400 font-medium block">
                        Due now
                      </span>
                    </div>
                  </div>

                  {/* Explanatory note */}
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    A listing at that rank on the public board. It goes live when payment confirms. Someone else can claim a higher rank.
                  </p>

                  {/* Target Domain Input Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Your Website / Domain:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400">
                        <Globe className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={paymentModal.url || paymentModal.domain}
                        onChange={(e) => {
                          const val = e.target.value
                          const cleanDom = val.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || val
                          setPaymentModal({
                            ...paymentModal,
                            url: val,
                            domain: cleanDom,
                          })
                        }}
                        placeholder="e.g. yourbrand.in"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                          isDark ? 'bg-[#0a0b14] border-purple-500/30 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Terms of Service Checkbox Card */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                    termsAccepted
                      ? 'border-yellow-400/60 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.1)]'
                      : isDark ? 'border-purple-500/30 bg-[#0c0d16] hover:border-purple-500/50' : 'border-slate-300 bg-slate-50'
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
                    <div className="flex items-center gap-1 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Razorpay Checkout</span>
                    </div>
                  </div>

                  {/* Actions: Cancel & Continue to checkout */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleVerifyPayment}
                      disabled={submitting || !termsAccepted}
                      className="w-full sm:flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-950 shadow-yellow-500/25 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950 flex-shrink-0" />
                          <span>Opening Razorpay Gateway...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-slate-950 flex-shrink-0" />
                          <span className="whitespace-nowrap">Pay {formatINR(paymentModal.amount)} with Razorpay / UPI</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentModal(null)}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-zinc-700/80 hover:bg-zinc-800 text-xs font-bold text-zinc-300 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Spotlight Modal Player */}
      {activePlayingVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePlayingVideo(null)}
        >
          <div
            className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
              isDark
                ? 'bg-[#0e0f1a] border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)]'
                : 'bg-white border-slate-300 shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-slate-900/30 to-black/40">
              <div className="flex items-center gap-2.5 min-w-0">
                {activePlayingVideo.rank && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 flex-shrink-0">
                    #{activePlayingVideo.rank} {activePlayingVideo.rank === 1 && '👑'}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-black text-sm sm:text-base truncate text-white">
                    {activePlayingVideo.title}
                  </h3>
                  {activePlayingVideo.category && (
                    <span className="text-[11px] font-bold text-zinc-400">
                      {activePlayingVideo.category}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePlayingVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Content */}
            <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
              {getYoutubeEmbed(activePlayingVideo.videoUrl) ? (
                <iframe
                  src={getYoutubeEmbed(activePlayingVideo.videoUrl)!}
                  title={activePlayingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activePlayingVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'bg-[#0a0b14]' : 'bg-slate-50'
            }`}>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                  Official Sponsor / Creator
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 truncate block">
                  {activePlayingVideo.domain || activePlayingVideo.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {activePlayingVideo.websiteUrl && (
                  <a
                    href={activePlayingVideo.id ? `/go/${activePlayingVideo.id}${visitorSessionId ? `?sid=${encodeURIComponent(visitorSessionId)}` : ''}` : (activePlayingVideo.websiteUrl.startsWith('http') ? activePlayingVideo.websiteUrl : `https://${activePlayingVideo.websiteUrl}`)}
                    onClick={() => {
                      if (activePlayingVideo.id) {
                        setDomains((prev) =>
                          prev.map((d) => (d.id === activePlayingVideo.id ? { ...d, clicks: (d.clicks || 0) + 1 } : d))
                        )
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span>Visit Website</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActivePlayingVideo(null)
                    const elem = document.getElementById('claim')
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-yellow-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Outbid & Feature Here</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`relative z-10 border-t py-10 sm:py-14 text-xs transition-colors ${theme.footerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className={`flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <BrandLogo isDark={isDark} size="md" />
              <div>
                <p className={`font-medium max-w-sm ${isDark ? 'text-zinc-300 opacity-90' : 'text-slate-700'}`}>
                  {t.footerOperatedBy}
                </p>
                <div className={`flex items-center justify-center sm:justify-start gap-1.5 mt-1.5 font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  <span>⚡ NO. 1 DOMAIN</span>
                  <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>•</span>
                  <span className={`font-normal ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Proprietor: MONU AHIRWAR</span>
                </div>
              </div>
            </div>

            {/* Quick Policy & Business Links */}
            <div className={`flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              <Link href="/about" className={`${isDark ? 'hover:text-yellow-400' : 'hover:text-amber-600 text-slate-700'} transition-colors`}>
                {t.footerAbout}
              </Link>
              <span className={isDark ? 'opacity-40' : 'text-slate-400'}>·</span>
              <Link href="/contact" className={`${isDark ? 'hover:text-cyan-400' : 'hover:text-cyan-700 text-slate-700'} transition-colors`}>
                {t.footerContact}
              </Link>
              <span className={isDark ? 'opacity-40' : 'text-slate-400'}>·</span>
              <Link href="/rules" className={`${isDark ? 'hover:text-purple-400' : 'hover:text-purple-700 text-slate-700'} transition-colors`}>
                {t.footerGuidelines}
              </Link>
              <span className={isDark ? 'opacity-40' : 'text-slate-400'}>·</span>
              <Link href="/terms" className={`${isDark ? 'hover:text-yellow-400' : 'hover:text-amber-600 text-slate-700'} transition-colors`}>
                {t.footerTerms}
              </Link>
              <span className={isDark ? 'opacity-40' : 'text-slate-400'}>·</span>
              <Link href="/privacy" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700 text-slate-700'} transition-colors`}>
                {t.footerPrivacy}
              </Link>
            </div>
          </div>

          {/* Legal Compliance Bar */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            <div className="text-center sm:text-left">
              <p>
                © 2026 <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>NO. 1 DOMAIN</strong>. {t.footerRights}
              </p>
              <p className={`mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                WhatsApp: <a href="https://wa.me/919340367384" target="_blank" rel="noopener noreferrer" className={`hover:underline font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>+91 9340367384 (WhatsApp Only)</a> • Email: <a href="mailto:support@no1domain.in" className={`hover:underline font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>support@no1domain.in</a>
              </p>
            </div>
            <div className="text-center sm:text-right font-medium">
              <span>All listings in Indian Rupees (₹) • Spotlight tier step: <strong className={`font-bold ${isDark ? 'text-yellow-400' : 'text-amber-700'}`}>{formatINR(top1Increment)}</strong></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Quick Action Bar */}
      <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-3 py-2 flex items-center justify-between shadow-2xl gap-2 ${
        isDark ? 'bg-[#090a10]/95 border-purple-500/30' : 'bg-white/95 border-slate-300'
      }`}>
        <div
          onClick={() => handleOpenTracking()}
          className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform min-w-0 flex-shrink"
        >
          <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse flex-shrink-0`} />
          <div className="leading-tight min-w-0 truncate">
            <span className={`text-[10px] block font-black truncate ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{todayVisits} {t.visits}</span>
            <strong className={`font-black text-xs truncate block ${isDark ? 'text-yellow-400' : 'text-amber-700'}`}>{top1Bid > 0 ? formatINR(top1Bid) : '₹50 Tier'}</strong>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Quick Theme Toggle for Mobile (Always prominent, never clipped) */}
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-xl border flex items-center justify-center text-xs font-bold transition-all active:scale-90 flex-shrink-0 cursor-pointer ${
              isDark
                ? 'bg-amber-400/15 border-amber-400/40 text-yellow-300'
                : 'bg-indigo-50 border-indigo-300 text-indigo-950'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme on mobile"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            )}
          </button>

          <button
            onClick={() => {
              const targetDomain = domains[0]
              if (targetDomain) {
                handleQuickOutbid(targetDomain)
              } else {
                setTermsAccepted(false)
                setPaymentModal({
                  isOpen: true,
                  domain: inputUrl.trim() || 'yourbrand.com',
                  url: inputUrl.trim() ? (inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`) : 'https://yourbrand.com',
                  title: inputTitle || 'New Listing',
                  category: inputCategory,
                  description: inputDescription || '',
                  amount: minBidForTop1,
                  orderId: `order_top1_${Date.now()}`,
                  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
                  isTop1: true,
                })
              }
            }}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-yellow-500/25 flex items-center gap-1 active:scale-95 flex-shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span>Claim #1 👑</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Demo Domain Notice Floating Toast */}
      {demoNotice && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] p-4 rounded-2xl bg-slate-950/95 text-white border-2 border-yellow-400 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-sm flex-shrink-0">
              ⚡
            </div>
            <p className="text-xs sm:text-sm font-bold text-yellow-100 leading-snug">
              {demoNotice}
            </p>
          </div>
          <button
            onClick={() => setDemoNotice(null)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}