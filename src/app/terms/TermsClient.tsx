'use client'

import React from 'react'
import Link from 'next/link'
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Lock,
  Globe,
  FileText,
  Building,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  HelpCircle,
} from 'lucide-react'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

export function TermsClient() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090a10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-yellow-400 selection:text-slate-950 font-sans transition-colors`}>
      {/* Ambient background glow */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px]" />
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${isDark ? 'bg-[#090a10]/90 border-zinc-800' : 'bg-white/90 border-slate-200 shadow-sm'} border-b transition-colors`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-700 hover:text-amber-600'} transition-colors group flex-shrink-0`}
          >
            <ArrowLeft className="w-4 h-4 text-yellow-500 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">Back to Live Marketplace</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Platform: NO. 1 DOMAIN</span>
            </div>
            <SiteThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Document Header */}
        <div className={`space-y-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-8`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-xs font-bold text-yellow-500">
            <Scale className="w-3.5 h-3.5" />
            <span>Official Legal Agreement & Electronic Record</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            General Terms and Conditions
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Published pursuant to Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 read with Information Technology Act, 2000.
          </p>
          <p className={`text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-slate-700'} leading-relaxed`}>
            These Terms constitute a legal agreement between You (the Customer / User / Merchant) and{' '}
            <strong className="text-yellow-500">NO. 1 DOMAIN</strong> (no1domain.in) for the provision of <strong>Domain Advertisement and Marketing Services</strong>, in association with{' '}
            <strong>Razorpay Software Private Limited</strong>.
          </p>
        </div>

        {/* Merchant Acceptance Details Box */}
        <div className={`${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#12131f] border-yellow-500/30' : 'bg-white border-amber-200 shadow-md'} border rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden`}>
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-800/60 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Merchant Acceptance & Verification Certificate</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold">
              Digitally Executed & Valid
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Owner / Platform</span>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>NO. 1 DOMAIN</p>
              <p className="text-zinc-400 text-[11px]">no1domain.in</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Authorized Signatory</span>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>MONU AHIRWAR</p>
              <p className="text-zinc-400 text-[11px]">Primary Representative</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Merchant / Owner ID</span>
              <p className="font-mono font-bold text-yellow-500 text-sm">Tj3R9O9KnlMDWW</p>
              <p className="text-zinc-400 text-[11px]">Razorpay Registered Entity</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Contact Email</span>
              <a href="mailto:support@no1domain.in" className="font-bold text-cyan-500 hover:underline">
                support@no1domain.in
              </a>
              <p className="text-zinc-400 text-[11px]">Primary Customer Care</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Contact Number</span>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>+91 9340367384</p>
              <p className="text-emerald-500 text-[11px] font-medium">WhatsApp Only</p>
            </div>

            <div className={`p-3.5 rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-1`}>
              <span className="text-zinc-500 font-semibold block uppercase tracking-wider text-[10px]">Date of Acceptance</span>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>2026-10-02 20:25:39 IST</p>
              <p className="text-zinc-400 text-[11px]">IP: 10.26.180.243</p>
            </div>
          </div>
        </div>

        {/* Section 1: Proprietary Rights */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Building className="w-5 h-5 text-yellow-500" />
            1. Proprietary Rights
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              <strong>1.1. Ownership:</strong> All right, title, and interest in and to the platform, including software, algorithms, rankings, interfaces, domain assets, and logos, remain the exclusive property of <strong>NO. 1 DOMAIN</strong>, its licensors, and Razorpay Software Private Limited where applicable.
            </p>
            <p>
              <strong>1.2. Materials License:</strong> By submitting domain listings, URLs, titles, descriptions, and logos, you grant NO. 1 DOMAIN and its payment aggregators a non-exclusive, royalty-free, worldwide license to display, promote, and process transactions for your listings across our platforms.
            </p>
          </div>
        </section>

        {/* Section 2: Usage of the Website and Services */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <UserCheck className="w-5 h-5 text-cyan-500" />
            2. Usage of the Website and Use of Services by the User
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              <strong>2.1. Eligibility:</strong> You must be at least 18 years of age and legally competent to enter into binding contracts under the Indian Contract Act, 1872 and other applicable laws.
            </p>
            <p>
              <strong>2.2. Accuracy of Information:</strong> You agree to provide true, accurate, and current information when submitting domains, claiming spots, or providing contact and payment information.
            </p>
            <p>
              <strong>2.3. Communications:</strong> You explicitly consent to receiving transactional alerts, payment confirmations, and communications via SMS, Email, and WhatsApp as provided during checkout.
            </p>
            <p>
              <strong>2.4. KYC Verification:</strong> In accordance with RBI Guidelines on Payment Aggregators and Payment Gateways (PA/PG) and PMLA 2002, you agree to provide valid KYC documentation upon request for high-value transactions.
            </p>
          </div>
        </section>

        {/* Section 3: Payment, Fees & Tax Compliance */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <FileText className="w-5 h-5 text-emerald-500" />
            3. Payment, Currency & Billing Terms
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              <strong>3.1. Currency & Gateway:</strong> All transactions on NO. 1 DOMAIN are denominated and processed in <strong>Indian Rupees (INR ₹)</strong> through authorized payment gateways, primarily <strong>Razorpay Standard Web Checkout</strong> and verified UPI channels.
            </p>
            <p>
              <strong>3.2. Showcase & Promotional Listing Tiers:</strong> Standard starting listing tier on the platform is <strong>₹50</strong>, and spotlight tier increments for featured promotional rankings are set at <strong>₹50</strong> as configured by platform guidelines. Minimum Razorpay transaction amount is 100 paise (₹1).
            </p>
            <p>
              <strong>3.3. Taxes:</strong> Fees are inclusive or exclusive of applicable Goods and Services Tax (GST) as displayed at checkout. In accordance with applicable income tax laws, statutory obligations are adhered to.
            </p>
          </div>
        </section>

        {/* Section 4: Chargebacks, Refunds & Cancellations */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            4. Chargebacks, Refunds & Fraudulent Transactions
          </h2>
          <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            <p>
              <strong>4.1. Nature of Domain Advertisement & Marketing Services:</strong> Promotional domain listings placed and verified are instant digital allocations that feature the submitted domain live on the public directory showcase. Consequently, once advertisement position and marketing visibility are allocated and verified by Razorpay, the digital service is considered fulfilled and non-refundable except in documented cases of technical duplicate debit.
            </p>
            <p>
              <strong>4.2. Chargeback Resolution:</strong> If a chargeback claim is initiated, the merchant and facility providers review proof of allocation. Erroneous or duplicate debits are resolved and routed to the original payment method within 5-7 business days.
            </p>
            <p>
              <strong>4.3. Fraud Prevention:</strong> Unlawful transactions, stolen cards, or attempts to exploit payment gateways will result in immediate suspension, blacklist of the domain, and reporting to relevant cyber authorities.
            </p>
          </div>
        </section>

        {/* Section 5: Prohibited Products and Services */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <Lock className="w-5 h-5 text-rose-500" />
            5. Prohibited Products and Domain Categories
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
            In compliance with Part A Clause 17 of the Razorpay Partner Agreement and Indian laws, the following categories are strictly prohibited from being listed, promoted, or transacted on our platform:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 font-mono">
            {[
              '1. Adult goods, pornography & sexually suggestive materials',
              '2. Alcohol, alcoholic beverages, wine, or champagne',
              '3. Body parts or organs',
              '4. Bulk spam marketing tools & software',
              '5. Cable descramblers & illicit decoders',
              '6. Child exploitation / abuse materials',
              '7. Copyright circumvention & mod chips',
              '8. Pirated movies, music, or media copies',
              '9. Cracked software, video games & unauthorized OEM keys',
              '10. Counterfeit branded goods and replicas',
              '11. Illegal drugs, narcotics & drug paraphernalia',
              '12. Drug test circumvention aids & cleansers',
              '13. Endangered species, wildlife & animal parts',
              '14. Gambling, betting, lottery tickets & online casinos',
              '15. Fake government IDs, fake passports & diplomas',
              '16. Hacking tools, exploit materials & cyber weapons',
              '17. Illegal firearms, explosives & dangerous weapons',
              '18. Unsubstantiated miracle cures & deceptive health remedies',
              '19. Hate speech, defamatory or violently offensive content',
              '20. Unregulated crypto, NFTs & virtual currency schemes',
              '21. Multi-level marketing (MLM) & pyramid schemes',
              '22. Any goods/services banned under Indian Applicable Laws',
            ].map((item, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg ${isDark ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-700'} border flex items-center gap-2`}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Grievance Redressal & Nodal Officer */}
        <section className={`space-y-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-3`}>
            <HelpCircle className="w-5 h-5 text-yellow-500" />
            6. Customer Grievance Redressal & Nodal Officer Details
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
            In compliance with RBI Payment Aggregator Guidelines and IT Rules 2021, merchant and payment gateway grievance redressal officers are designated as follows:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-2`}>
              <span className="text-yellow-500 font-bold block text-sm">Merchant Grievance Officer</span>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>MONU AHIRWAR (NO. 1 DOMAIN)</p>
              <p className="text-zinc-400">Address: India</p>
              <p className="text-zinc-400">WhatsApp Only: <a href="https://wa.me/919340367384" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">+91 9340367384</a></p>
              <p className="text-zinc-400">
                Email:{' '}
                <a href="mailto:support@no1domain.in" className="text-cyan-500 hover:underline">
                  support@no1domain.in
                </a>
              </p>
              <p className="text-[11px] text-zinc-500">Response turnaround: within 48-72 business hours.</p>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'} border space-y-2`}>
              <span className="text-cyan-500 font-bold block text-sm">Payment Gateway Nodal Officer (Razorpay)</span>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mr. Vijay Thakral / Mr. Shashank Karincheti (DPO)</p>
              <p className="text-zinc-400">Razorpay Software Private Limited</p>
              <p className="text-zinc-400">No. 22, 1st Floor, SJR Cyber, Laskar-Hosur Road, Adugodi, Bangalore - 560030</p>
              <p className="text-zinc-400">
                Email: <span className={isDark ? "text-zinc-200" : "text-slate-800"}>nodal-officer@razorpay.com</span> | <span className={isDark ? "text-zinc-200" : "text-slate-800"}>dpo@razorpay.com</span>
              </p>
              <p className="text-zinc-400">
                Portal:{' '}
                <a href="https://razorpay.com/grievances/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                  razorpay.com/grievances/
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Applicable Law & Jurisdiction */}
        <section className={`space-y-3 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'} border p-6 sm:p-8 rounded-2xl text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'} leading-relaxed`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
            <Scale className="w-4 h-4 text-cyan-500" />
            7. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms shall be governed by, construed and enforced in accordance with the laws of India. Any legal dispute or proceeding arising under or in connection with these Terms or use of the Services shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>

        {/* Navigation Footer */}
        <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'} flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-zinc-400`}>
          <Link href="/" className="text-yellow-500 hover:underline flex items-center gap-1">
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
            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
