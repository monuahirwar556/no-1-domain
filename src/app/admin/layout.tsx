'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Shield, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, User, KeyRound } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  // Always start with blank username and password every time
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Track session unlock state in sessionStorage so it requires login on every new visit/tab/logout
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const userRole = (session?.user as any)?.role

  useEffect(() => {
    // Check if current tab session was unlocked
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_unlocked_token') : null
    if (token && status === 'authenticated' && userRole === 'ADMIN') {
      setIsUnlocked(true)
    } else {
      setIsUnlocked(false)
    }
    setIsReady(true)
  }, [status, userRole])

  // Handle Admin Login submission
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    const trimmedInput = usernameOrEmail.trim()
    if (!trimmedInput || !password) {
      setErrorMsg('Username aur password dono enter karein.')
      return
    }

    setSubmitting(true)
    try {
      const res = await signIn('credentials', {
        email: trimmedInput,
        password: password,
        redirect: false,
      })

      if (res?.error) {
        setErrorMsg('Galat username ya password! Sahi details enter karein.')
      } else {
        // Unlock only for the active session/tab
        sessionStorage.setItem('admin_unlocked_token', `unlocked_${Date.now()}`)
        setIsUnlocked(true)
        setPassword('')
        window.location.reload()
      }
    } catch (err: any) {
      setErrorMsg('Authentication error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // 1. Initial loading check
  if (!isReady || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#07080e] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-black/80 border border-purple-500/40 p-2 flex items-center justify-center shadow-2xl mb-4 animate-pulse">
          <img
            src="/images/logo-transparent.png"
            alt="Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]"
          />
        </div>
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm tracking-wider uppercase">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying Admin Access...</span>
        </div>
      </div>
    )
  }

  // 2. Check if user is authenticated and explicitly unlocked in this session
  if (status === 'authenticated' && userRole === 'ADMIN' && isUnlocked) {
    return <>{children}</>
  }

  // 3. User is logged in as non-admin
  if (status === 'authenticated' && userRole !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#07080e] flex items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
        <div className="w-full max-w-md bg-[#0c0d18] border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center mb-6 text-rose-400">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Aapka current account (<span className="text-zinc-200 font-semibold">{session?.user?.email}</span>) administrator privileges nahi rakhta.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_unlocked_token')
                signOut({ callbackUrl: '/admin' })
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Switch to Admin Account</span>
            </button>
            <Link
              href="/"
              className="block w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold text-sm border border-zinc-800 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 4. Show Admin Login Form - Prompting for Username and Password every single time
  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-black/90 border border-purple-500/40 p-1.5 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <img
                src="/images/logo-transparent.png"
                alt="Emblem"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(192,132,252,0.9)]"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center text-2xl font-black tracking-tight leading-none">
                <span className="text-yellow-400">NO. 1</span>
                <span className="ml-1.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent">
                  DOMAIN
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest mt-1">
                Admin Control Portal
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-300">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Restricted Access • Administrator Only</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0b0c16]/90 backdrop-blur-xl border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
          <div className="mb-6">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Admin Login</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Admin panel access karne ke liye apna username aur password enter karein.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center gap-3 text-rose-200 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Admin Username / Email ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-black text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                    <span>Unlock Admin Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Live Website</span>
            </Link>
            <span className="font-mono text-[11px] text-zinc-500">Protected Portal</span>
          </div>
        </div>
      </div>
    </div>
  )
}
