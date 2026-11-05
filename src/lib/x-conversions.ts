import crypto from 'crypto'

export interface XConversionIdentifier {
  twclid?: string
  hashed_email?: string
  hashed_phone_number?: string
  ip_address?: string
  user_agent?: string
}

export interface XConversionItem {
  conversion_time: string
  event_id: string
  event_source_url?: string
  conversion_id?: string
  identifiers: XConversionIdentifier[]
}

export interface XConversionPayload {
  conversions: XConversionItem[]
}

export interface SendXConversionParams {
  pixelId?: string
  token?: string
  eventId?: string
  conversionId?: string
  eventSourceUrl?: string
  email?: string
  phone?: string
  twclid?: string
  ipAddress?: string
  userAgent?: string
  conversionTime?: string
}

/**
 * SHA-256 hash formatted as 64-hexadecimal characters for X (Twitter) CAPI
 */
export function hashSha256(val?: string | null): string | undefined {
  if (!val) return undefined
  const cleaned = val.trim().toLowerCase()
  if (!cleaned) return undefined
  // If already a 64-character hex string, return as is
  if (/^[a-f0-9]{64}$/i.test(cleaned)) {
    return cleaned.toLowerCase()
  }
  return crypto.createHash('sha256').update(cleaned).digest('hex')
}

/**
 * Normalizes phone number (E.164 without dashes or spaces) and hashes with SHA-256
 */
export function hashPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '+91' + cleaned // Default to India prefix if 10-digit
  }
  return hashSha256(cleaned)
}

/**
 * Send conversion event to X (Twitter) Ads Measurement API
 * POST https://ads-api.x.com/12/measurement/conversions/{pixel_id}
 */
export async function sendXConversionEvent(params: SendXConversionParams) {
  const pixelId = (params.pixelId || process.env.X_PIXEL_ID || 'rgkb5').trim()
  const token = (
    params.token ||
    process.env.X_PIXEL_TOKEN ||
    ''
  ).trim()

  const eventId = (params.eventId || process.env.X_CONVERSION_EVENT_ID || 'tw-rgkb5-purchase').trim()
  const conversionTime = params.conversionTime || new Date().toISOString()
  const eventSourceUrl = params.eventSourceUrl || 'https://no1domain.in/checkout'
  const conversionId = params.conversionId || `order-${Date.now()}`

  // Build identifier object (provide at least one identifier)
  const identifier: XConversionIdentifier = {}

  if (params.twclid) {
    identifier.twclid = params.twclid.trim()
  }

  const hashedEmail = hashSha256(params.email)
  if (hashedEmail) {
    identifier.hashed_email = hashedEmail
  }

  const hashedPhone = hashPhone(params.phone)
  if (hashedPhone) {
    identifier.hashed_phone_number = hashedPhone
  }

  if (params.ipAddress) {
    identifier.ip_address = params.ipAddress.trim()
  }

  if (params.userAgent) {
    identifier.user_agent = params.userAgent.trim()
  }

  // Ensure at least fallback IP/Agent exists if no email/phone/twclid provided
  if (!identifier.twclid && !identifier.hashed_email && !identifier.hashed_phone_number && !identifier.ip_address) {
    identifier.ip_address = '127.0.0.1'
    identifier.user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }

  const payload: XConversionPayload = {
    conversions: [
      {
        conversion_time: conversionTime,
        event_id: eventId,
        event_source_url: eventSourceUrl,
        conversion_id: conversionId,
        identifiers: [identifier],
      },
    ],
  }

  const endpoint = `https://ads-api.x.com/12/measurement/conversions/${pixelId}`

  console.log(`[X-CAPI] Sending event '${eventId}' to ${endpoint}:`, JSON.stringify(payload, null, 2))

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pixel-Token': token,
      },
      body: JSON.stringify(payload),
    })

    const resText = await res.text()
    let resJson: any = null
    try {
      resJson = JSON.parse(resText)
    } catch {
      resJson = { raw: resText }
    }

    console.log(`[X-CAPI] Response HTTP ${res.status}:`, resJson)

    return {
      success: res.ok,
      status: res.status,
      data: resJson,
      payload,
    }
  } catch (error: any) {
    console.error('[X-CAPI] Network / Dispatch error:', error)
    return {
      success: false,
      status: 0,
      error: error.message || 'Unknown network error',
      payload,
    }
  }
}
