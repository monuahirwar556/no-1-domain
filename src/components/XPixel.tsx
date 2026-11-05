'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    twq?: (...args: any[]) => void
  }
}

/**
 * Client-side helper to dispatch events to X (Twitter) Pixel
 */
export function trackXEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.twq === 'function') {
      window.twq('event', eventName, params || {})
      console.log(`[X-Pixel] Dispatched event '${eventName}':`, params)
    } else {
      console.warn(`[X-Pixel] window.twq is not defined yet when calling '${eventName}'`)
    }
  } catch (err) {
    console.error(`[X-Pixel] Error dispatching event '${eventName}':`, err)
  }
}

/**
 * Trigger X Purchase conversion on client
 */
export function trackXPurchase(payload: {
  conversionId: string
  amount: number
  currency?: string
  domain?: string
}) {
  const eventId = process.env.NEXT_PUBLIC_X_CONVERSION_EVENT_ID || 'tw-rgkb5-purchase'
  trackXEvent(eventId, {
    conversion_id: payload.conversionId,
    value: payload.amount,
    currency: payload.currency || 'INR',
    content_name: payload.domain || 'Domain Spotlight',
    content_type: 'product',
  })
  // Also dispatch standard 'Purchase' event
  trackXEvent('Purchase', {
    conversion_id: payload.conversionId,
    value: payload.amount,
    currency: payload.currency || 'INR',
  })
}

/**
 * Trigger Initiate Checkout event on client
 */
export function trackXInitiateCheckout(amount: number, domain?: string) {
  trackXEvent('InitiateCheckout', {
    value: amount,
    currency: 'INR',
    content_name: domain || 'Domain Spotlight',
  })
}

export default function XPixel() {
  useEffect(() => {
    // 1. Capture twclid (Twitter Click ID) from URL and save for conversion attribution
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search)
        const twclid = params.get('twclid')
        if (twclid) {
          sessionStorage.setItem('no1_twclid', twclid)
          localStorage.setItem('no1_twclid', twclid)
          console.log('[X-Pixel] Captured twclid:', twclid)
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
    }
  }, [])

  return null
}
