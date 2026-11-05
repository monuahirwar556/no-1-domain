'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Card, CardContent, Alert } from '@/components/ui'
import { Crown, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { addToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed')
        addToast({ message: data.message || 'Registration failed', variant: 'danger' })
        return
      }

      setSuccess('Account created successfully! Redirecting to login...')
      addToast({ message: 'Account created successfully!', variant: 'success', title: 'Welcome!' })

      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent('/')}`)
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      addToast({ message: 'An error occurred. Please try again.', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ]

  return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-xl bg-black/90 border border-purple-500/30 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img src="/images/logo-transparent.png" alt="Emblem" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
            </div>
            <div className="flex items-center text-2xl font-black tracking-tight">
              <span className="text-yellow-500">NO. 1</span>
              <span className="ml-1.5 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">DOMAIN</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-dark-900">Create Your Account</h1>
          <p className="text-dark-500 mt-2">Join the domain showcase platform and claim top spotlight rankings</p>
        </div>

        {/* Register Card */}
        <Card variant="elevated">
          <CardContent className="p-6 sm:p-8">
            {error && (
              <Alert variant="danger" className="mb-6" dismissible onDismiss={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                disabled={loading}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-dark-400 hover:text-dark-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
                />
              </div>

              {password && (
                <div className="space-y-1.5">
                  <p className="text-xs text-dark-500">Password strength:</p>
                  <div className="flex gap-1">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full transition-colors" style={{
                        backgroundColor: req.met ? '#22c55e' : '#e2e8f0'
                      }} />
                    ))}
                  </div>
                  <ul className="text-xs text-dark-500 space-y-0.5">
                    {passwordRequirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle className={`w-3 h-3 ${req.met ? 'text-green-500' : 'text-dark-300'}`} />
                        <span className={req.met ? 'text-green-600' : 'text-dark-400'}>{req.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                <Loader2 className="w-5 h-5" />
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-dark-500 mt-6">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-dark-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-dark-400 mt-4">
          All listings in Indian Rupees (₹) | Spotlight increments: ₹50 | NO. 1 DOMAIN
        </p>
      </div>
    </div>
  )
}