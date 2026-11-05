'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
  Languages,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export type LangType = 'en' | 'hi' | 'hinglish'

interface AboutBusinessCardProps {
  initialLang?: LangType
  lang?: LangType
  onLangChange?: (lang: LangType) => void
  showNavButtons?: boolean
  isInsideAboutPage?: boolean
  className?: string
}

const contentByLang = {
  en: {
    langName: 'English',
    badge: 'Official Registered Business Identity',
    headingPrefix: 'About Our Platform — ',
    headingHighlight: 'NO. 1 DOMAIN',
    description: (isDark: boolean) => (
      <>
        <strong className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>NO. 1 DOMAIN (no1domain.in)</strong> is an innovative, verified web asset directory and spotlight promotion marketplace providing professional{' '}
        <strong className={isDark ? 'text-yellow-400' : 'text-amber-700 font-bold'}>Domain Showcase and Promotion Services</strong>.
      </>
    ),
    cards: [
      {
        tag: 'PLATFORM & SERVICES',
        value: 'NO. 1 DOMAIN',
        sub: 'Domain Showcase & Marketing',
      },
      {
        tag: 'PROPRIETOR / SIGNATORY',
        value: 'MONU AHIRWAR',
        sub: 'Primary Authorized Representative',
      },
      {
        tag: 'MERCHANT ID',
        value: 'Tj3R9O9KnlMDWW',
        sub: 'Razorpay Active Merchant Account',
        isMerchantId: true,
      },
      {
        tag: 'WHATSAPP SUPPORT (ONLY)',
        value: '+91 9340367384',
        sub: 'support@no1domain.in',
        isWhatsapp: true,
      },
    ],
    pillars: [
      {
        icon: Globe,
        iconColorDark: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        iconColorLight: 'text-amber-700 bg-amber-50 border-amber-200',
        title: 'Verified Directory Listings',
        desc: 'We allow web entrepreneurs and startups to showcase their digital domains, website links, descriptions, and logos in our verified catalog.',
      },
      {
        icon: Zap,
        iconColorDark: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        iconColorLight: 'text-blue-700 bg-blue-50 border-blue-200',
        title: 'Transparent Spotlight Tiers',
        desc: 'Fixed, upfront promotional showcase tiers starting at just ₹50. No speculative auctions, hidden fees, or opaque algorithms.',
      },
      {
        icon: ShieldCheck,
        iconColorDark: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        iconColorLight: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        title: 'Instant Digital Fulfillment',
        desc: 'Real-time placement activation and direct tracked visitor referrals powered by secure Razorpay INR payment infrastructure.',
      },
    ],
    buttons: {
      profile: 'Read Full Business Profile →',
      contact: 'Contact Support Team',
      guidelines: 'Showcase Guidelines',
    },
    switchNotice: 'Language: English',
  },
  hi: {
    langName: 'हिंदी',
    badge: 'आधिकारिक पंजीकृत व्यावसायिक पहचान',
    headingPrefix: 'हमारे प्लेटफॉर्म के बारे में — ',
    headingHighlight: 'NO. 1 DOMAIN',
    description: (isDark: boolean) => (
      <>
        <strong className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>NO. 1 DOMAIN (no1domain.in)</strong> एक आधुनिक और पारदर्शी वेब एसेट डायरेक्टरी तथा स्पॉटलाइट प्रमोशन प्लेटफॉर्म है जो{' '}
        <strong className={isDark ? 'text-yellow-400' : 'text-amber-700 font-bold'}>डोमेन शोकेस और प्रचार सेवाएं</strong> प्रदान करता है।
      </>
    ),
    cards: [
      {
        tag: 'प्लेटफॉर्म एवं सेवाएं',
        value: 'NO. 1 DOMAIN',
        sub: 'डोमेन शोकेस एवं मार्केटिंग',
      },
      {
        tag: 'प्रोपराइटर / स्वामी',
        value: 'MONU AHIRWAR (मोनू अहिरवार)',
        sub: 'मुख्य अधिकृत प्रतिनिधि',
      },
      {
        tag: 'मर्चेंट आईडी (MERCHANT ID)',
        value: 'Tj3R9O9KnlMDWW',
        sub: 'रेज़रपे एक्टिव मर्चेंट अकाउंट',
        isMerchantId: true,
      },
      {
        tag: 'व्हाट्सएप सहायता (केवल)',
        value: '+91 9340367384',
        sub: 'support@no1domain.in',
        isWhatsapp: true,
      },
    ],
    pillars: [
      {
        icon: Globe,
        iconColorDark: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        iconColorLight: 'text-amber-700 bg-amber-50 border-amber-200',
        title: 'सत्यापित डायरेक्टरी लिस्टिंग',
        desc: 'हम उद्यमियों और नए स्टार्टअप्स को अपने डिजिटल डोमेन, वेबसाइट लिंक, विवरण और लोगो को हमारी सत्यापित डायरेक्टरी में प्रदर्शित करने की सुविधा देते हैं।',
      },
      {
        icon: Zap,
        iconColorDark: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        iconColorLight: 'text-blue-700 bg-blue-50 border-blue-200',
        title: 'पारदर्शी स्पॉटलाइट टियर्स',
        desc: 'केवल ₹50 से शुरू होने वाले पारदर्शी विज्ञापन टियर्स। कोई छिपी हुई फीस, नीलामी या अस्पष्ट नियम नहीं।',
      },
      {
        icon: ShieldCheck,
        iconColorDark: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        iconColorLight: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        title: 'त्वरित डिजिटल सक्रियण',
        desc: 'सुरक्षित रेज़रपे INR भुगतान के साथ तुरंत लाइव विज्ञापन सक्रियण और सीधे वेबसाइट ट्रैफ़िक रेफरल।',
      },
    ],
    buttons: {
      profile: 'पूर्ण व्यवसाय विवरण पढ़ें →',
      contact: 'सपोर्ट टीम से संपर्क करें',
      guidelines: 'प्लेटफॉर्म दिशानिर्देश',
    },
    switchNotice: 'भाषा: हिंदी',
  },
  hinglish: {
    langName: 'Hinglish',
    badge: 'Official Registered Business Identity',
    headingPrefix: 'Hamare Platform Ke Baare Me — ',
    headingHighlight: 'NO. 1 DOMAIN',
    description: (isDark: boolean) => (
      <>
        <strong className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>NO. 1 DOMAIN (no1domain.in)</strong> ek modern web showcase aur spotlight promotion marketplace hai jo{' '}
        <strong className={isDark ? 'text-yellow-400' : 'text-amber-700 font-bold'}>Domain Showcase aur Marketing Services</strong> provide karta hai.
      </>
    ),
    cards: [
      {
        tag: 'PLATFORM & SERVICES',
        value: 'NO. 1 DOMAIN',
        sub: 'Domain Showcase & Marketing',
      },
      {
        tag: 'PROPRIETOR / OWNER',
        value: 'MONU AHIRWAR',
        sub: 'Primary Authorized Representative',
      },
      {
        tag: 'MERCHANT ID',
        value: 'Tj3R9O9KnlMDWW',
        sub: 'Razorpay Active Merchant Account',
        isMerchantId: true,
      },
      {
        tag: 'WHATSAPP SUPPORT (ONLY)',
        value: '+91 9340367384',
        sub: 'support@no1domain.in',
        isWhatsapp: true,
      },
    ],
    pillars: [
      {
        icon: Globe,
        iconColorDark: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        iconColorLight: 'text-amber-700 bg-amber-50 border-amber-200',
        title: 'Verified Directory Listings',
        desc: 'Hum startups aur businesses ko apna domain, website link, logo aur description humari verified catalog me showcase karne ki suvidha dete hain.',
      },
      {
        icon: Zap,
        iconColorDark: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        iconColorLight: 'text-blue-700 bg-blue-50 border-blue-200',
        title: 'Transparent Spotlight Tiers',
        desc: 'Fixed upfront promotion tiers jo sirf ₹50 se shuru hote hain. Koi bidding, auction ya hidden charge nahi.',
      },
      {
        icon: ShieldCheck,
        iconColorDark: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        iconColorLight: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        title: 'Instant Digital Activation',
        desc: 'Razorpay INR payment ke through instant live placement activation aur direct tracked visitors aapki website par.',
      },
    ],
    buttons: {
      profile: 'Pura Business Profile Dekhein →',
      contact: 'Support Team Se Contact Karein',
      guidelines: 'Platform Guidelines Dekhein',
    },
    switchNotice: 'Language: Hinglish (English + Hindi)',
  },
}

export function AboutBusinessCard({
  initialLang = 'en',
  lang: controlledLang,
  onLangChange,
  showNavButtons = true,
  isInsideAboutPage = false,
  className = '',
}: AboutBusinessCardProps) {
  const { isDark } = useTheme()
  const [internalLang, setInternalLang] = useState<LangType>(initialLang)
  const lang = controlledLang || internalLang

  // Read saved language preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('no1domain_lang') as LangType | null
      if (saved === 'en' || saved === 'hi' || saved === 'hinglish') {
        setInternalLang(saved)
        if (onLangChange) {
          onLangChange(saved)
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [])

  const handleLangChange = (newLang: LangType) => {
    setInternalLang(newLang)
    try {
      localStorage.setItem('no1domain_lang', newLang)
    } catch (e) {
      // Ignore
    }
    if (onLangChange) {
      onLangChange(newLang)
    }
  }

  const current = contentByLang[lang]

  return (
    <div
      className={`rounded-3xl p-6 sm:p-10 border shadow-2xl transition-all relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-[#0c0d18] via-[#101222] to-[#0c0d18] border-purple-500/30 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      } ${className}`}
    >
      {/* Background ambient glow in dark mode */}
      {isDark && (
        <>
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top Bar: Badge + Language Switcher */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b ${
          isDark ? 'border-zinc-800/80' : 'border-slate-200'
        }`}
      >
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-sm ${
            isDark
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}
        >
          <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-700'}`} />
          <span>{current.badge}</span>
        </div>

        {/* Language Switcher Tabs */}
        <div
          className={`inline-flex items-center gap-1 p-1 rounded-xl border shadow-inner ${
            isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold mr-1 ${
              isDark ? 'text-zinc-400' : 'text-slate-600'
            }`}
          >
            <Languages className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
            <span className={`hidden sm:inline text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Language:
            </span>
          </div>

          {(['en', 'hi', 'hinglish'] as const).map((l) => {
            const isActive = lang === l
            const labels: Record<LangType, string> = {
              en: 'English',
              hi: 'हिंदी',
              hinglish: 'Hinglish',
            }

            return (
              <button
                key={l}
                type="button"
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/20 scale-[1.03]'
                    : isDark
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title={`Switch language to ${labels[l]}`}
              >
                {isActive && <Sparkles className="w-3 h-3 fill-slate-950" />}
                <span>{labels[l]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {current.headingPrefix}
          <span
            className={
              isDark
                ? 'text-yellow-400 drop-shadow-[0_2px_12px_rgba(250,204,21,0.25)]'
                : 'text-amber-600 font-extrabold'
            }
          >
            {current.headingHighlight}
          </span>
        </h2>
        <p
          className={`text-xs sm:text-sm leading-relaxed font-medium ${
            isDark ? 'text-zinc-300' : 'text-slate-700'
          }`}
        >
          {current.description(isDark)}
        </p>
      </div>

      {/* Business Credentials Cards (4 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs">
        {current.cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border space-y-1 transition-all ${
              isDark
                ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-white'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm text-slate-900'
            }`}
          >
            <span
              className={`font-bold block uppercase tracking-wider text-[10px] ${
                isDark ? 'text-zinc-500' : 'text-slate-500'
              }`}
            >
              {card.tag}
            </span>
            {card.isWhatsapp ? (
              <a
                href="https://wa.me/919340367384"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-bold text-sm block hover:underline ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}
              >
                {card.value}
              </a>
            ) : (
              <p
                className={`font-bold text-base ${
                  isDark
                    ? card.isMerchantId
                      ? 'text-cyan-400 font-mono'
                      : 'text-white'
                    : card.isMerchantId
                    ? 'text-blue-700 font-mono font-bold'
                    : 'text-slate-900'
                }`}
              >
                {card.value}
              </p>
            )}
            <p className={`text-[11px] truncate ${isDark ? 'text-zinc-400' : 'text-slate-600 font-medium'}`}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Business Model & Value Proposition (3 items) */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8 text-xs">
        {current.pillars.map((pillar, idx) => {
          const IconComponent = pillar.icon
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-2 transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                  isDark ? pillar.iconColorDark : pillar.iconColorLight
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {pillar.title}
              </h3>
              <p className={`leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600 font-normal'}`}>
                {pillar.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      {showNavButtons && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {isInsideAboutPage ? (
            <>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 group"
              >
                <span>
                  {lang === 'hi'
                    ? 'लाइव डोमेन बोर्ड देखें →'
                    : lang === 'hinglish'
                    ? 'Live Domain Board Dekhein →'
                    : 'Explore Live Domain Board →'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#detailed-profile"
                className={`px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-200'
                    : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800 shadow-sm'
                }`}
              >
                <span>
                  {lang === 'hi'
                    ? 'पूर्ण व्यवसाय विवरण पढ़ें ↓'
                    : lang === 'hinglish'
                    ? 'Pura Business Profile Dekhein ↓'
                    : 'Read Full Business Profile ↓'}
                </span>
              </a>
            </>
          ) : (
            <Link
              href="/about"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 group"
            >
              <span>{current.buttons.profile}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          <Link
            href="/contact"
            className={`px-5 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-white'
                : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800 shadow-sm'
            }`}
          >
            {current.buttons.contact}
          </Link>
          <Link
            href="/rules"
            className={`px-5 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-colors ${
              isDark
                ? 'bg-purple-950/40 border-purple-500/30 hover:border-purple-500/60 text-purple-300'
                : 'bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-800 shadow-sm'
            }`}
          >
            {current.buttons.guidelines}
          </Link>
        </div>
      )}
    </div>
  )
}
