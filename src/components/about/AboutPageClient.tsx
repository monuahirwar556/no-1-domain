'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Users2,
  Mail,
  Phone,
  Compass,
  Award,
  Zap,
  Lock,
  Languages,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { AboutBusinessCard, LangType } from './AboutBusinessCard'
import { BrandLogo } from '@/components/common/BrandLogo'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

const extraAboutContent = {
  en: {
    backToHome: 'Back to Platform',
    verifiedEntity: 'Verified Platform: NO. 1 DOMAIN',
    whatWeDoTitle: 'What We Do',
    whatWeDoIntro1:
      'In today’s digital era, thousands of great domain names and online ventures struggle to get discovered because traditional search engines and ad networks are cluttered, slow, and expensive.',
    whatWeDoIntro2:
      'NO. 1 DOMAIN offers a direct, transparent showcase directory for digital ventures. Our platform operates on a direct promotional listing model:',
    whatWeDoItems: [
      {
        title: 'Directory Listings & Brand Showcasing:',
        text: 'Verified domain holders list their domain, official logo, company description, and target category.',
      },
      {
        title: 'Transparent Spotlight Promotion Tiers:',
        text: 'Starting at just ₹50, businesses can activate featured directory spots with transparent promotional tiers. Higher spotlight tiers receive prime visibility atop the live platform.',
      },
      {
        title: 'Direct Traffic Forwarding:',
        text: 'Every listed domain receives live tracked visitor referrals directly to their destination website, enhancing legitimate traffic and user acquisition.',
      },
      {
        title: 'No Guesswork or Hidden Fees:',
        text: 'Pricing is 100% upfront in Indian Rupees (₹) with instant activation upon verified payment through RBI-regulated payment gateways.',
      },
    ],
    whyChooseTitle: 'Why Choose NO. 1 DOMAIN?',
    whyChooseItems: [
      {
        title: 'Instant Digital Delivery',
        text: 'Once payment is completed and verified through Razorpay, your domain listing and spotlight tier are activated immediately on the live board.',
      },
      {
        title: '100% Secure Payments',
        text: "All transactions are processed through Razorpay's PCI-DSS Level 1 certified gateway using UPI, Net Banking, and major Indian cards.",
      },
      {
        title: 'Verified & Compliant',
        text: 'NO. 1 DOMAIN strictly complies with IT Rules 2021, RBI payment aggregator directives, and consumer protection regulations.',
      },
    ],
    leadershipTitle: 'Leadership & Contact Information',
    leadershipIntro:
      'NO. 1 DOMAIN is proudly founded and spearheaded by MONU AHIRWAR. We are committed to building transparent, accessible digital discovery tools for the Indian startup and domain ecosystem.',
    customerCareTitle: 'Customer Care & Business Inquiries',
    customerCareSub: 'Operating from India · WhatsApp messages & email queries answered within 24 hours.',
    grievanceTitle: 'Grievance & Compliance Officer',
    grievanceSub: 'Designated Officer for Consumer Grievances & Razorpay Compliance',
    turnaround: 'Turnaround: within 24-48 business hours.',
    navContact: 'Contact Us →',
    navRules: 'Listing Guidelines →',
    navTerms: 'Terms & Conditions →',
  },
  hi: {
    backToHome: 'मुख्य प्लेटफॉर्म पर लौटें',
    verifiedEntity: 'सत्यापित प्लेटफॉर्म: NO. 1 DOMAIN',
    whatWeDoTitle: 'हम क्या करते हैं (What We Do)',
    whatWeDoIntro1:
      'आज के डिजिटल युग में, कई बेहतरीन डोमेन नाम और ऑनलाइन स्टार्टअप्स सही पहचान पाने के लिए संघर्ष करते हैं क्योंकि पारंपरिक सर्च इंजन और विज्ञापन नेटवर्क अत्यधिक जटिल, धीमे और महंगे हैं।',
    whatWeDoIntro2:
      'NO. 1 DOMAIN की स्थापना इसलिए की गई ताकि सभी प्रकार के डिजिटल व्यवसायों को एक सीधा, पारदर्शी और प्रभावी विज्ञापन मंच मिल सके:',
    whatWeDoItems: [
      {
        title: 'डायरेक्टरी लिस्टिंग एवं ब्रांड शोकेस:',
        text: 'सत्यापित डोमेन स्वामी अपना डोमेन, आधिकारिक लोगो, व्यवसाय का विवरण और श्रेणी सूचीबद्ध करते हैं।',
      },
      {
        title: 'पारदर्शी स्पॉटलाइट प्रमोशन टियर्स:',
        text: 'मात्र ₹50 से शुरू होने वाले स्पष्ट प्रचार टियर्स। उच्च टियर पर रहने वाले ब्रांड्स को लाइव प्लेटफॉर्म पर शीर्ष स्थान और अधिकतम दृश्यता मिलती है।',
      },
      {
        title: 'सीधा वेब ट्रैफ़िक रेफरल:',
        text: 'प्रत्येक सूचीबद्ध डोमेन पर आने वाले वास्तविक आगंतुकों को सीधे मुख्य वेबसाइट पर भेजा जाता है जिससे प्रामाणिक ट्रैफ़िक बढ़ता है।',
      },
      {
        title: 'कोई छिपे हुए शुल्क या नीलामी नहीं:',
        text: '100% पारदर्शी मूल्य भारतीय रुपये (₹) में और आरबीआई-विनियमित रेज़रपे भुगतान गेटवे द्वारा त्वरित सत्यापन।',
      },
    ],
    whyChooseTitle: 'NO. 1 DOMAIN को क्यों चुनें?',
    whyChooseItems: [
      {
        title: 'त्वरित डिजिटल सक्रियण',
        text: 'रेज़रपे द्वारा भुगतान सत्यापित होते ही आपकी डोमेन लिस्टिंग और स्पॉटलाइट टियर तुरंत लाइव बोर्ड पर सक्रिय हो जाते हैं।',
      },
      {
        title: '100% सुरक्षित भुगतान',
        text: 'सभी लेन-देन रेज़रपे के PCI-DSS लेवल 1 प्रमाणित गेटवे द्वारा UPI, नेट बैंकिंग और कार्ड्स के माध्यम से सुरक्षित होते हैं।',
      },
      {
        title: 'सत्यापित एवं कानूनी अनुपालन',
        text: 'NO. 1 DOMAIN आईटी नियम 2021, आरबीआई पेमेंट एग्रीगेटर दिशानिर्देशों और उपभोक्ता संरक्षण नियमों का कड़ाई से पालन करता है।',
      },
    ],
    leadershipTitle: 'नेतृत्व एवं आधिकारिक संपर्क जानकारी',
    leadershipIntro:
      'NO. 1 DOMAIN की स्थापना और संचालन MONU AHIRWAR (मोनू अहिरवार) द्वारा किया जाता है। हम भारतीय उद्यमियों और स्टार्टअप्स के लिए पारदर्शी और विश्वसनीय डिजिटल प्रचार उपकरण प्रदान करने के लिए प्रतिबद्ध हैं।',
    customerCareTitle: 'ग्राहक सेवा एवं व्यावसायिक पूछताछ',
    customerCareSub: 'भारत में संचालित · व्हाट्सएप संदेशों और ईमेल प्रश्नों का उत्तर 24 घंटे के भीतर दिया जाता है।',
    grievanceTitle: 'शिकायत निवारण एवं अनुपालन अधिकारी',
    grievanceSub: 'उपभोक्ता शिकायतों एवं रेज़रपे अनुपालन के लिए नामित अधिकारी',
    turnaround: 'समाधान समय सीमा: 24-48 कार्य घंटे।',
    navContact: 'हमसे संपर्क करें →',
    navRules: 'दिशानिर्देश एवं नियम →',
    navTerms: 'नियम व शर्तें →',
  },
  hinglish: {
    backToHome: 'Back to Platform',
    verifiedEntity: 'Verified Platform: NO. 1 DOMAIN',
    whatWeDoTitle: 'Hum Kya Karte Hain (What We Do)',
    whatWeDoIntro1:
      'Aaj ke digital daur me hazaron acche domain names aur online startups discover hone me struggle karte hain kyunki purane ad networks slow aur expensive hain.',
    whatWeDoIntro2:
      'NO. 1 DOMAIN isliye shuru kiya gaya taaki digital ventures ko ek direct, transparent showcase directory aur spotlight promotion marketplace mil sake:',
    whatWeDoItems: [
      {
        title: 'Directory Listings & Brand Showcasing:',
        text: 'Verified domain owners apna domain, official logo, company description aur targeted category direct showcase kar sakte hain.',
      },
      {
        title: 'Transparent Spotlight Promotion Tiers:',
        text: 'Sirf ₹50 se shuru hone wale fixed promotional tiers. Top tiers par rehne wale brands ko live platform par prime visibility milti hai.',
      },
      {
        title: 'Direct Traffic Forwarding:',
        text: 'Listed domain par aane wale live visitors directly aapki website par forward hote hain jisse real traffic boost milta hai.',
      },
      {
        title: 'No Guesswork or Hidden Fees:',
        text: '100% transparent pricing Indian Rupees (₹) me aur Razorpay secured gateway dwara instant payment activation.',
      },
    ],
    whyChooseTitle: 'Why Choose NO. 1 DOMAIN?',
    whyChooseItems: [
      {
        title: 'Instant Digital Delivery',
        text: 'Razorpay ke through payment verify hote hi aapki domain listing aur spotlight tier instant live active ho jaati hai.',
      },
      {
        title: '100% Secure Payments',
        text: "Saare transactions Razorpay PCI-DSS certified gateway ke through UPI, Net Banking aur cards se process hote hain.",
      },
      {
        title: 'Verified & Compliant',
        text: 'NO. 1 DOMAIN IT Rules 2021, RBI payment aggregator directives aur consumer protection guidelines ka strict compliance karta hai.',
      },
    ],
    leadershipTitle: 'Leadership & Contact Information',
    leadershipIntro:
      'NO. 1 DOMAIN ko lead karte hain MONU AHIRWAR. Hum Indian startup ecosystem ke liye transparent aur fast digital visibility platform build kar rahe hain.',
    customerCareTitle: 'Customer Care & Business Inquiries',
    customerCareSub: 'India se operated · WhatsApp messages & email queries 24 ghante ke andar respond ki jaati hain.',
    grievanceTitle: 'Grievance & Compliance Officer',
    grievanceSub: 'Designated Officer for Consumer Grievances & Razorpay Compliance',
    turnaround: 'Turnaround: 24-48 business hours.',
    navContact: 'Contact Us →',
    navRules: 'Listing Guidelines →',
    navTerms: 'Terms & Conditions →',
  },
}

export function AboutPageClient() {
  const { isDark } = useTheme()
  const [lang, setLang] = useState<LangType>('en')
  const content = extraAboutContent[lang]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090a10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-yellow-400 selection:text-slate-950 font-sans transition-colors`}>
      {/* Ambient background glow */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px]" />
        </div>
      )}

      {/* Sticky Header with Brand Emblem & Back Link */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${isDark ? 'bg-[#090a10]/90 border-zinc-800' : 'bg-white/90 border-slate-200 shadow-sm'} border-b transition-colors`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo isDark={isDark} size="sm" showTagline={false} />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-300 hover:text-yellow-400' : 'text-slate-700 hover:text-amber-600'} transition-colors group flex-shrink-0`}
            >
              <ArrowLeft className="w-4 h-4 text-yellow-500 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
              <span className="hidden sm:inline">{content.backToHome}</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <SiteThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">
        {/* Core Showcase Card (Featured Component with internal sync) */}
        <AboutBusinessCard
          lang={lang}
          onLangChange={setLang}
          showNavButtons={true}
          isInsideAboutPage={true}
        />

        <div id="detailed-profile" className="space-y-12 pt-4 scroll-mt-24">
        {/* Section 1: What is Our Business? */}
        <section className={`space-y-5 border p-6 sm:p-8 rounded-2xl ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center gap-3 border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <Compass className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
            <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{content.whatWeDoTitle}</h2>
          </div>
          <div className={`space-y-4 text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-slate-700'} leading-relaxed`}>
            <p>{content.whatWeDoIntro1}</p>
            <p>{content.whatWeDoIntro2}</p>
            <ul className="space-y-3 pt-2">
              {content.whatWeDoItems.map((item, idx) => {
                const iconColors = isDark
                  ? ['text-emerald-400', 'text-yellow-400', 'text-cyan-400', 'text-purple-400']
                  : ['text-emerald-600', 'text-amber-600', 'text-blue-600', 'text-purple-600']
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 ${iconColors[idx % iconColors.length]} shrink-0 mt-0.5`}
                    />
                    <span>
                      <strong className={isDark ? 'text-white' : 'text-slate-950 font-bold'}>{item.title} </strong>
                      {item.text}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* Section 2: Why Choose NO. 1 DOMAIN? */}
        <section className="space-y-4">
          <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <ShieldCheck className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
            <span>{content.whyChooseTitle}</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {content.whyChooseItems.map((item, idx) => {
              const icons = [Zap, Lock, Award]
              const IconComp = icons[idx]
              const colors = isDark
                ? [
                    'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
                    'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
                    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  ]
                : [
                    'text-amber-700 bg-amber-50 border-amber-200',
                    'text-blue-700 bg-blue-50 border-blue-200',
                    'text-emerald-700 bg-emerald-50 border-emerald-200',
                  ]
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border space-y-3 transition-colors ${
                    isDark
                      ? 'bg-[#111222] border-zinc-800 hover:border-zinc-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[idx]}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{item.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Section 3: Leadership & Official Contact */}
        <section className={`space-y-4 border p-6 sm:p-8 rounded-2xl ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center gap-3 border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <Users2 className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{content.leadershipTitle}</h2>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
            {content.leadershipIntro}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <span className={`font-bold block text-sm ${isDark ? 'text-yellow-400' : 'text-amber-700'}`}>
                {content.customerCareTitle}
              </span>
              <p className={`flex items-center gap-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <a
                  href="https://wa.me/919340367384"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:underline font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}
                >
                  +91 9340367384 (WhatsApp Only)
                </a>
              </p>
              <p className={`flex items-center gap-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                <Mail className={`w-4 h-4 shrink-0 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                <a href="mailto:support@no1domain.in" className={`hover:underline ${isDark ? 'text-cyan-400' : 'text-blue-600 font-semibold'}`}>
                  support@no1domain.in
                </a>
              </p>
              <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{content.customerCareSub}</p>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <span className={`font-bold block text-sm ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
                {content.grievanceTitle}
              </span>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>MONU AHIRWAR</p>
              <p className={isDark ? 'text-zinc-400' : 'text-slate-600'}>{content.grievanceSub}</p>
              <p className={isDark ? 'text-zinc-400' : 'text-slate-600'}>
                Email:{' '}
                <a href="mailto:support@no1domain.in" className={`hover:underline ${isDark ? 'text-cyan-400' : 'text-blue-600 font-semibold'}`}>
                  support@no1domain.in
                </a>
              </p>
              <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{content.turnaround}</p>
            </div>
          </div>
        </section>
        </div>

        {/* Navigation Footer */}
        <div className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-bold ${
          isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'
        }`}>
          <Link href="/" className={`hover:underline flex items-center gap-1 ${isDark ? 'text-yellow-400' : 'text-amber-700'}`}>
            <ArrowLeft className="w-3.5 h-3.5" /> {content.backToHome}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/contact" className={`transition-colors ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>
              {content.navContact}
            </Link>
            <Link href="/rules" className={`transition-colors ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-700'}`}>
              {content.navRules}
            </Link>
            <Link href="/terms" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              {content.navTerms}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
