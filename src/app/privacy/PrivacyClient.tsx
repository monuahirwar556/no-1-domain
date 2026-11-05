'use client'

import React from 'react'
import Link from 'next/link'
import {
  Shield,
  ArrowLeft,
  Lock,
  Eye,
  Database,
  Server,
  Key,
  Cookie,
  HelpCircle,
} from 'lucide-react'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

export function PrivacyClient() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090a10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-cyan-400 selection:text-slate-950 font-sans transition-colors`}>
      {/* Background glow */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px]" />
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${isDark ? 'bg-[#090a10]/90 border-zinc-800' : 'bg-white/90 border-slate-200 shadow-sm'} border-b transition-colors`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-700 hover:text-cyan-600'} transition-colors group flex-shrink-0`}
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">Back to Live Marketplace</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Data Protection Certified</span>
            </div>
            <SiteThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Title */}
        <div className={`space-y-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-8`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy & Data Protection</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Privacy Policy
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Last updated: <strong>March 19th, 2024</strong> · Re-certified: <strong>October 2026</strong>
          </p>
          <p className={`text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-slate-700'} leading-relaxed`}>
            This Privacy Policy applies to your use of <strong className={isDark ? "text-white" : "text-slate-900"}>NO. 1 DOMAIN</strong> (no1domain.in) and the payment aggregation infrastructure provided by{' '}
            <strong className={isDark ? "text-white" : "text-slate-900"}>Razorpay Software Private Limited</strong>.
          </p>
        </div>

        {/* Acceptance & Identity Certificate */}
        <div className={`${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#101928] border-cyan-500/30' : 'bg-white border-cyan-200 shadow-md'} border rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden`}>
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-800/60 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy Compliance & Acceptance Certificate</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 text-xs font-bold">
              Executed & Logged
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Merchant Name</span>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>NO. 1 DOMAIN</p>
              <p className="text-zinc-400 text-[11px]">no1domain.in</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Signatory & DPO Contact</span>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>MONU AHIRWAR</p>
              <p className="text-zinc-400 text-[11px]">Designated Privacy Officer</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Owner ID</span>
              <p className="font-mono font-bold text-cyan-500 text-sm">Tj3R9O9KnlMDWW</p>
              <p className="text-zinc-400 text-[11px]">Razorpay Compliance ID</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Contact Email</span>
              <a href="mailto:support@no1domain.in" className="font-bold text-cyan-500 hover:underline">
                support@no1domain.in
              </a>
              <p className="text-zinc-400 text-[11px]">Primary Customer Care</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">WhatsApp Support (Only)</span>
              <a href="https://wa.me/919340367384" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-500 hover:underline">
                +91 9340367384
              </a>
              <p className="text-zinc-400 text-[11px]">WhatsApp Messages Only</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Date of Acceptance</span>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>2026-10-02 20:25:39 IST</p>
              <p className="text-zinc-400 text-[11px]">IP Recorded: 10.26.180.243</p>
            </div>
          </div>
        </div>

        {/* 1. Introduction */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Eye className="w-5 h-5 text-cyan-500" />
            1. Introduction to Privacy Policy
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              The terms <em>&quot;we&quot;</em>, <em>&quot;our&quot;</em> and <em>&quot;us&quot;</em> refer to <strong>NO. 1 DOMAIN</strong> and payment partner <strong>Razorpay</strong>. The terms <em>&quot;you&quot;</em>, <em>&quot;your&quot;</em> and <em>&quot;User&quot;</em> refer to any visitor, domain owner, or listing partner on our platform.
            </p>
            <p>
              <strong>Personal Information:</strong> Information that personally identifies you, such as your full name, email address, telephone number, and transaction identifiers. We have implemented reasonable security practices and procedures commensurate with the information assets being protected to guarantee safety.
            </p>
          </div>
        </section>

        {/* 2. Information We Collect */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Database className="w-5 h-5 text-yellow-500" />
            2. Information We Collect and How We Use It
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>We collect only the minimum information necessary to provide and verify services:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Account & Domain Data:</strong> Business name, website URL, listing category, public title, and description.
              </li>
              <li>
                <strong>Listing Partners & Customers:</strong> Name, contact email, and telephone number for payment receipt dispatch and KYC compliance.
              </li>
              <li>
                <strong>Transaction Data:</strong> Razorpay Order IDs, Payment IDs, timestamps, and payment statuses. <em>We never store credit card CVVs, full card numbers, or banking PINs on our servers.</em>
              </li>
              <li>
                <strong>Activity Logs:</strong> Browser types, access timestamps, and anonymized masked IPs for platform security and redirect analytics.
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Cookies & Tracking Technologies */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Cookie className="w-5 h-5 text-emerald-500" />
            3. Cookies & Session Management
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              We use session cookies (which expire upon closing your browser) and persistent cookies solely to maintain your login status, preserve preferences, and verify checkout sessions with Razorpay. You can configure your browser to decline cookies, although some checkout functions may require session storage.
            </p>
          </div>
        </section>

        {/* 4. Transfer of Information & Third Parties */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Server className="w-5 h-5 text-purple-500" />
            4. Information Sharing & Transfers
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              We do not sell, rent, or trade your personal information. We share information only with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Payment Partners:</strong> Razorpay Software Private Limited and acquiring banks to process orders and verify cryptographic signatures.
              </li>
              <li>
                <strong>Regulatory & Legal Authorities:</strong> As mandated by RBI regulations, PMLA 2002, or court orders under Indian Applicable Law.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Security & User Rights */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Key className="w-5 h-5 text-cyan-500" />
            5. Security Standards & Right to Erasure
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              <strong>Security Practices:</strong> Industry-standard TLS encryption, strict role-based access, and tokenized payment architectures are maintained across all systems.
            </p>
            <p>
              <strong>Right to Correction & Erasure:</strong> You have the right to inspect, update, or request the deletion of your personal data stored on our servers by emailing our designated privacy officer.
            </p>
          </div>
        </section>

        {/* 6. Grievance Redressal, DPO & Nodal Officer */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <HelpCircle className="w-5 h-5 text-yellow-500" />
            6. Complaints & Grievance Redressal (DPO & Nodal Officer)
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
            For questions or complaints concerning personal data, privacy practices, or payment security, please contact the designated officers below:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-2`}>
              <span className="text-cyan-500 font-bold block text-sm">Merchant Privacy Officer</span>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>MONU AHIRWAR (NO. 1 DOMAIN)</p>
              <p className="text-zinc-400">WhatsApp Only: <a href="https://wa.me/919340367384" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">+91 9340367384</a></p>
              <p className="text-zinc-400">
                Email:{' '}
                <a href="mailto:support@no1domain.in" className="text-cyan-500 hover:underline">
                  support@no1domain.in
                </a>
              </p>
              <p className="text-zinc-400">Support Desk: support@no1domain.in</p>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-2`}>
              <span className="text-yellow-500 font-bold block text-sm">Data Protection Officer (Razorpay)</span>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mr. Shashank Karincheti (DPO)</p>
              <p className="text-zinc-400">Razorpay Software Private Limited</p>
              <p className="text-zinc-400">No. 22, 1st Floor, SJR Cyber, Laskar - Hosur Road, Adugodi, Bangalore - 560030</p>
              <p className="text-zinc-400">Phone: 080-46669555</p>
              <p className="text-zinc-400">
                Email: <span className={isDark ? "text-zinc-200" : "text-slate-800"}>dpo@razorpay.com</span>
              </p>
              <p className="text-zinc-400">
                Grievance Portal:{' '}
                <a href="https://razorpay.com/grievances/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                  razorpay.com/grievances/
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'} flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-zinc-400`}>
          <Link href="/" className="text-cyan-500 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-yellow-500 transition-colors">
              About Business →
            </Link>
            <Link href="/contact" className="hover:text-cyan-500 transition-colors">
              Contact Support →
            </Link>
            <Link href="/rules" className="hover:text-purple-500 transition-colors">
              Showcase Guidelines →
            </Link>
            <Link href="/terms" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>
              Terms of Service →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
