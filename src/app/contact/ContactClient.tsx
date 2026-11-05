'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Send,
  CheckCircle2,
  Building,
  HelpCircle,
  AlertCircle,
} from 'lucide-react'
import { SiteThemeToggle } from '@/components/common/SiteThemeToggle'
import { useTheme } from '@/context/ThemeContext'

export function ContactClient() {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090a10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-cyan-400 selection:text-slate-950 font-sans transition-colors`}>
      {/* Ambient background glow */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-yellow-500/10 rounded-full blur-[130px]" />
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
            <span className="hidden sm:inline">Back to Marketplace</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Support Desk: NO. 1 DOMAIN</span>
            </div>
            <SiteThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Page Title */}
        <div className={`space-y-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'} pb-8 text-center sm:text-left`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
            isDark 
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' 
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            <Mail className="w-3.5 h-3.5" />
            <span>Customer Assistance & Merchant Helpdesk</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Contact Our Business
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-slate-700'} max-w-2xl leading-relaxed`}>
            Have questions about listing your domain, upgrading your spotlight tier, or verifying your transaction? Our customer support desk at <strong className={isDark ? 'text-white' : 'text-slate-950 font-bold'}>NO. 1 DOMAIN</strong> is here to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Official Merchant Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`border rounded-2xl p-6 space-y-5 shadow-xl ${
              isDark 
                ? 'bg-gradient-to-br from-zinc-900 to-[#101422] border-cyan-500/30 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              <div className={`flex items-center gap-2.5 border-b pb-3 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                <Building className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Registered Business Information</h2>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} font-semibold uppercase tracking-wider text-[10px] block`}>
                    Operating Entity
                  </span>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>NO. 1 DOMAIN</p>
                  <p className={`${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Platform: no1domain.in</p>
                </div>

                <div className="space-y-1">
                  <span className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} font-semibold uppercase tracking-wider text-[10px] block`}>
                    Authorized Signatory & Proprietor
                  </span>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>MONU AHIRWAR</p>
                </div>

                <div className="space-y-1">
                  <span className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} font-semibold uppercase tracking-wider text-[10px] block`}>
                    WhatsApp Support Helpline (Only)
                  </span>
                  <a
                    href="https://wa.me/919340367384"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-bold text-sm flex items-center gap-1.5 hover:underline ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    +91 9340367384
                  </a>
                  <p className={`${isDark ? 'text-emerald-400/90' : 'text-emerald-700'} text-[11px] font-semibold`}>Only WhatsApp messages accepted</p>
                </div>

                <div className="space-y-1">
                  <span className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} font-semibold uppercase tracking-wider text-[10px] block`}>
                    Official Support Email
                  </span>
                  <a
                    href="mailto:support@no1domain.in"
                    className={`font-bold text-sm hover:underline flex items-center gap-1.5 ${
                      isDark ? 'text-cyan-400' : 'text-blue-600'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    support@no1domain.in
                  </a>
                  <p className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} text-[11px]`}>Primary Customer Care & Compliance</p>
                </div>

                <div className="space-y-1">
                  <span className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} font-semibold uppercase tracking-wider text-[10px] block`}>
                    Operating Location & Country
                  </span>
                  <p className={`${isDark ? 'text-zinc-300' : 'text-slate-800'} flex items-center gap-1.5 font-medium`}>
                    <MapPin className="w-4 h-4 text-amber-500" />
                    India
                  </p>
                </div>

                <div className="space-y-1">
                  <span className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} font-semibold uppercase tracking-wider text-[10px] block`}>
                    Working Hours
                  </span>
                  <p className={`${isDark ? 'text-zinc-300' : 'text-slate-800'} flex items-center gap-1.5 font-medium`}>
                    <Clock className="w-4 h-4 text-purple-500" />
                    Monday – Saturday: 9:00 AM – 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Grievance Box */}
            <div className={`p-5 rounded-2xl border space-y-2 text-xs ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-300 shadow-sm'
            }`}>
              <span className={`font-bold block text-sm flex items-center gap-1.5 ${
                isDark ? 'text-yellow-400' : 'text-amber-800'
              }`}>
                <ShieldCheck className="w-4 h-4" />
                Grievance Redressal Desk
              </span>
              <p className={`${isDark ? 'text-zinc-400' : 'text-slate-600'} leading-relaxed`}>
                Pursuant to the Information Technology (Intermediary Guidelines) Rules, 2021 and RBI Guidelines:
              </p>
              <p className={`${isDark ? 'text-zinc-300' : 'text-slate-800'} leading-relaxed`}>
                <strong>Officer:</strong> MONU AHIRWAR (NO. 1 DOMAIN)<br />
                <strong>Email:</strong> support@no1domain.in<br />
                <strong>WhatsApp Only:</strong> +91 9340367384<br />
                <strong>Turnaround Time:</strong> Acknowledged within 24 hours, resolved within 48-72 business hours.
              </p>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className={`lg:col-span-7 border rounded-2xl p-6 sm:p-8 space-y-6 ${
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="space-y-1">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Send Us a Direct Message</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Fill out the form below and our merchant support team will respond promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Message Sent Successfully!</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-700'} leading-relaxed`}>
                  Thank you for reaching out to NO. 1 DOMAIN. Our team has received your message and will get back to you at{' '}
                  <strong className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>{formData.email || 'your email'}</strong> within 24-48 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                        isDark 
                          ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                        isDark 
                          ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                        isDark 
                          ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                        isDark 
                          ? 'bg-zinc-950 border-zinc-800 text-white focus:outline-none focus:border-cyan-400' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white'
                      }`}
                    >
                      <option value="General Inquiry">General Business Inquiry</option>
                      <option value="Domain Listing Support">Domain Listing & Promotion Support</option>
                      <option value="Payment Verification">Payment / Invoice Inquiry</option>
                      <option value="Partnership">Commercial Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your domain, query, or transaction ID..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs resize-none ${
                      isDark 
                        ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {sending ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to NO. 1 DOMAIN</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-bold ${
          isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'
        }`}>
          <Link href="/" className={`hover:underline flex items-center gap-1 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className={`transition-colors ${isDark ? 'hover:text-yellow-400' : 'hover:text-amber-700'}`}>
              About Business →
            </Link>
            <Link href="/terms" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              Terms & Conditions →
            </Link>
            <Link href="/privacy" className={`transition-colors ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>
              Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
