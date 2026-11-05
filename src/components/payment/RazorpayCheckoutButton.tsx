'use client'

import React, { useState } from 'react'
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { trackXPurchase, trackXInitiateCheckout } from '@/components/XPixel'

export interface RazorpaySuccessPayload {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayCheckoutButtonProps {
  /** Amount in rupees (e.g., 50 for ₹50) or in paise if isPaise is true */
  amount: number
  /** Whether the amount passed is already in paise. Defaults to false (INR Rupees). */
  isPaise?: boolean
  currency?: string
  receipt?: string
  name?: string
  description?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  themeColor?: string
  buttonText?: string
  className?: string
  onSuccess?: (payload: RazorpaySuccessPayload) => void
  onError?: (errorMessage: string) => void
  onCancel?: () => void
  disabled?: boolean
  children?: React.ReactNode
  createOrderEndpoint?: string
  verifyPaymentEndpoint?: string
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true))
      existingScript.addEventListener('error', () => resolve(false))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function RazorpayCheckoutButton({
  amount,
  isPaise = false,
  currency = 'INR',
  receipt,
  name = 'NO. 1 DOMAIN',
  description = 'Standard Web Checkout',
  prefill = {},
  themeColor = '#eab308',
  buttonText,
  className = '',
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  children,
  createOrderEndpoint = '/api/create-order',
  verifyPaymentEndpoint = '/api/verify-payment',
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)

  const amountInPaise = Math.round(isPaise ? amount : amount * 100)
  const displayAmountInRupees = (amountInPaise / 100).toFixed(2)

  const handleCheckout = async () => {
    if (disabled || loading) return

    setLoading(true)
    setStatusMessage(null)
    setStatusType(null)

    try {
      // Step 2a: Ensure Razorpay checkout.js script is loaded
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.')
      }

      // Step 1: Call Backend Create Order Endpoint
      const createRes = await fetch(createOrderEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
        }),
      })

      const orderData = await createRes.json()

      if (!createRes.ok) {
        throw new Error(orderData.message || 'Failed to create payment order.')
      }

      const orderId = orderData.order_id || orderData.id
      const keyId = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM'

      if (!orderId) {
        throw new Error('Order creation did not return a valid order ID.')
      }

      // Step 2b: Open Razorpay Checkout Modal
      trackXInitiateCheckout(amountInPaise / 100, name)

      const options: any = {
        key: keyId,
        amount: orderData.amount || amountInPaise,
        currency: orderData.currency || currency,
        name: name,
        description: description,
        image: '/images/logo-transparent.png',
        order_id: orderId,
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          // Step 3: Call Backend Verify Signature Endpoint
          try {
            setLoading(true)
            setStatusMessage('Verifying payment signature...')

            const verifyRes = await fetch(verifyPaymentEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id || orderId,
                payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.message || 'Payment signature verification failed.')
            }

            // Track client-side X Pixel purchase conversion
            trackXPurchase({
              conversionId: response.razorpay_order_id || orderId,
              amount: amountInPaise / 100,
              currency,
              domain: name,
            })

            setStatusType('success')
            setStatusMessage(`Payment of ₹${displayAmountInRupees} verified successfully!`)
            onSuccess?.(response)
          } catch (verifyErr: any) {
            const errText = verifyErr.message || 'Error verifying payment signature'
            setStatusType('error')
            setStatusMessage(errText)
            onError?.(errText)
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || '',
        },
        theme: {
          color: themeColor,
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setStatusType(null)
            setStatusMessage('Payment cancelled by user.')
            onCancel?.()
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)

      // Handle payment.failed event
      rzp.on('payment.failed', (failedResp: any) => {
        const errorDesc =
          failedResp?.error?.description ||
          failedResp?.error?.reason ||
          'Payment failed or was declined by the bank.'
        setStatusType('error')
        setStatusMessage(`Payment failed: ${errorDesc}`)
        onError?.(errorDesc)
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during checkout.'
      setStatusType('error')
      setStatusMessage(msg)
      onError?.(msg)
      setLoading(false)
    }
  }

  return (
    <div className="inline-flex flex-col gap-2">
      <button
        type="button"
        id="rzp-checkout-button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={
          className ||
          'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            <span>Processing...</span>
          </>
        ) : children ? (
          children
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span>{buttonText || `Pay ₹${displayAmountInRupees} with Razorpay`}</span>
          </>
        )}
      </button>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all ${
            statusType === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : statusType === 'error'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {statusType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : statusType === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          ) : (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin text-zinc-400" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  )
}
