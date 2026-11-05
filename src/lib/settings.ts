import prisma from './prisma'
import { ensureDatabaseReady } from './db-init'

export interface SiteSettings {
  currency: string
  currencySymbol: string
  top1Increment: number
  otherPositionIncrement: number
  minimumStartingBid: number
  maximumBid: number
  paymentGateway: string
  razorpayKeyId: string
  razorpayKeySecret: string
  upiId: string
  qrEnabled: boolean
  xPixelId?: string
  xPixelToken?: string
  xConversionEventId?: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  top1Increment: 50,
  otherPositionIncrement: 50,
  minimumStartingBid: 50,
  maximumBid: 10000000,
  paymentGateway: 'Razorpay',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'blxpBpB5MQYUrWo35a2ZMPsM',
  upiId: process.env.NEXT_PUBLIC_UPI_ID || 'paytm-7828003666@paytm',
  qrEnabled: true,
  xPixelId: process.env.X_PIXEL_ID || 'rgkb5',
  xPixelToken: process.env.X_PIXEL_TOKEN || '',
  xConversionEventId: process.env.X_CONVERSION_EVENT_ID || 'tw-rgkb5-purchase',
}

const SETTINGS_KEYS = {
  currency: 'currency',
  currencySymbol: 'currency_symbol',
  top1Increment: 'top1_increment',
  otherPositionIncrement: 'other_position_increment',
  minimumStartingBid: 'minimum_starting_bid',
  maximumBid: 'maximum_bid',
  paymentGateway: 'payment_gateway',
  razorpayKeyId: 'razorpay_key_id',
  razorpayKeySecret: 'razorpay_key_secret',
  upiId: 'upi_id',
  qrEnabled: 'qr_enabled',
  xPixelId: 'x_pixel_id',
  xPixelToken: 'x_pixel_token',
  xConversionEventId: 'x_conversion_event_id',
} as const

export async function getSettings(): Promise<SiteSettings> {
  const envKeyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim()
  const envKeySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim()

  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: Object.values(SETTINGS_KEYS),
        },
      },
    })

    const settingsMap = new Map(settings.map(s => [s.key, s.value]))
    const rawDbKeyId = (settingsMap.get(SETTINGS_KEYS.razorpayKeyId) || '').trim()
    const rawDbKeySecret = (settingsMap.get(SETTINGS_KEYS.razorpayKeySecret) || '').trim()

    // Blacklist obsolete / revoked keys so they NEVER leak from Hostinger's pre-existing DB
    const isOldRevokedKey = rawDbKeyId.includes('Ts1mCDRVp1m6We')
    const dbKeyId = isOldRevokedKey ? '' : rawDbKeyId
    const dbKeySecret = isOldRevokedKey ? '' : rawDbKeySecret

    const activeLiveKeyId = dbKeyId || envKeyId || DEFAULT_SETTINGS.razorpayKeyId
    const activeLiveKeySecret = dbKeySecret || envKeySecret || DEFAULT_SETTINGS.razorpayKeySecret

    // Asynchronously correct the DB if it held an obsolete key
    if (isOldRevokedKey) {
      prisma.setting.upsert({
        where: { key: 'razorpay_key_id' },
        update: { value: activeLiveKeyId },
        create: { key: 'razorpay_key_id', value: activeLiveKeyId },
      }).catch(() => {})
      prisma.setting.upsert({
        where: { key: 'razorpay_key_secret' },
        update: { value: activeLiveKeySecret },
        create: { key: 'razorpay_key_secret', value: activeLiveKeySecret },
      }).catch(() => {})
    }

    return {
      currency: settingsMap.get(SETTINGS_KEYS.currency) || DEFAULT_SETTINGS.currency,
      currencySymbol: settingsMap.get(SETTINGS_KEYS.currencySymbol) || DEFAULT_SETTINGS.currencySymbol,
      top1Increment: parseInt(settingsMap.get(SETTINGS_KEYS.top1Increment) || String(DEFAULT_SETTINGS.top1Increment)),
      otherPositionIncrement: parseInt(settingsMap.get(SETTINGS_KEYS.otherPositionIncrement) || String(DEFAULT_SETTINGS.otherPositionIncrement)),
      minimumStartingBid: parseInt(settingsMap.get(SETTINGS_KEYS.minimumStartingBid) || String(DEFAULT_SETTINGS.minimumStartingBid)),
      maximumBid: parseInt(settingsMap.get(SETTINGS_KEYS.maximumBid) || String(DEFAULT_SETTINGS.maximumBid)),
      paymentGateway: settingsMap.get(SETTINGS_KEYS.paymentGateway) || DEFAULT_SETTINGS.paymentGateway,
      // Always guarantee current live Razorpay credentials!
      razorpayKeyId: activeLiveKeyId,
      razorpayKeySecret: activeLiveKeySecret,
      upiId: settingsMap.get(SETTINGS_KEYS.upiId) || DEFAULT_SETTINGS.upiId,
      qrEnabled: settingsMap.get(SETTINGS_KEYS.qrEnabled) !== 'false',
      xPixelId: settingsMap.get(SETTINGS_KEYS.xPixelId) || DEFAULT_SETTINGS.xPixelId,
      xPixelToken: settingsMap.get(SETTINGS_KEYS.xPixelToken) || DEFAULT_SETTINGS.xPixelToken,
      xConversionEventId: settingsMap.get(SETTINGS_KEYS.xConversionEventId) || DEFAULT_SETTINGS.xConversionEventId,
    }
  } catch (err) {
    console.warn('Settings table not ready, initializing database...', err)
    await ensureDatabaseReady()
    try {
      const settings = await prisma.setting.findMany({
        where: {
          key: {
            in: Object.values(SETTINGS_KEYS),
          },
        },
      })
      const settingsMap = new Map(settings.map(s => [s.key, s.value]))
      const dbKeyId = (settingsMap.get(SETTINGS_KEYS.razorpayKeyId) || '').trim()
      const dbKeySecret = (settingsMap.get(SETTINGS_KEYS.razorpayKeySecret) || '').trim()

      return {
        currency: settingsMap.get(SETTINGS_KEYS.currency) || DEFAULT_SETTINGS.currency,
        currencySymbol: settingsMap.get(SETTINGS_KEYS.currencySymbol) || DEFAULT_SETTINGS.currencySymbol,
        top1Increment: parseInt(settingsMap.get(SETTINGS_KEYS.top1Increment) || String(DEFAULT_SETTINGS.top1Increment)),
        otherPositionIncrement: parseInt(settingsMap.get(SETTINGS_KEYS.otherPositionIncrement) || String(DEFAULT_SETTINGS.otherPositionIncrement)),
        minimumStartingBid: parseInt(settingsMap.get(SETTINGS_KEYS.minimumStartingBid) || String(DEFAULT_SETTINGS.minimumStartingBid)),
        maximumBid: parseInt(settingsMap.get(SETTINGS_KEYS.maximumBid) || String(DEFAULT_SETTINGS.maximumBid)),
        paymentGateway: settingsMap.get(SETTINGS_KEYS.paymentGateway) || DEFAULT_SETTINGS.paymentGateway,
        razorpayKeyId: dbKeyId || envKeyId || DEFAULT_SETTINGS.razorpayKeyId,
        razorpayKeySecret: dbKeySecret || envKeySecret || DEFAULT_SETTINGS.razorpayKeySecret,
        upiId: settingsMap.get(SETTINGS_KEYS.upiId) || DEFAULT_SETTINGS.upiId,
        qrEnabled: settingsMap.get(SETTINGS_KEYS.qrEnabled) !== 'false',
        xPixelId: settingsMap.get(SETTINGS_KEYS.xPixelId) || DEFAULT_SETTINGS.xPixelId,
        xPixelToken: settingsMap.get(SETTINGS_KEYS.xPixelToken) || DEFAULT_SETTINGS.xPixelToken,
        xConversionEventId: settingsMap.get(SETTINGS_KEYS.xConversionEventId) || DEFAULT_SETTINGS.xConversionEventId,
      }
    } catch (fallbackErr) {
      return DEFAULT_SETTINGS
    }
  }
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  await ensureDatabaseReady()
  const entries = Object.entries(settings)
    .map(([key, value]) => ({
      key: SETTINGS_KEYS[key as keyof typeof SETTINGS_KEYS],
      value: String(value).trim(),
    }))
    .filter(entry => entry.key !== undefined)

  await prisma.$transaction(
    entries.map(({ key, value }) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )

  // Immediately sync in-memory environment variables
  if (settings.razorpayKeyId) {
    const cleanKeyId = settings.razorpayKeyId.trim()
    process.env['RAZORPAY_KEY_ID'] = cleanKeyId
    const publicRzpKey = ['NEXT', 'PUBLIC', 'RAZORPAY', 'KEY', 'ID'].join('_')
    process.env[publicRzpKey] = cleanKeyId
  }
  if (settings.razorpayKeySecret) {
    process.env['RAZORPAY_KEY_SECRET'] = settings.razorpayKeySecret.trim()
  }
  if (settings.upiId) {
    const publicUpiKey = ['NEXT', 'PUBLIC', 'UPI', 'ID'].join('_')
    process.env[publicUpiKey] = settings.upiId.trim()
  }
  if (settings.xPixelId) {
    process.env.X_PIXEL_ID = settings.xPixelId.trim()
  }
  if (settings.xPixelToken) {
    process.env.X_PIXEL_TOKEN = settings.xPixelToken.trim()
  }
  if (settings.xConversionEventId) {
    process.env.X_CONVERSION_EVENT_ID = settings.xConversionEventId.trim()
  }

  // Also sync to .env file on disk if available so server restarts retain the keys
  try {
    const fs = await import('fs')
    const path = await import('path')
    const envPath = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8')
      if (settings.xPixelId) {
        const xpid = settings.xPixelId.trim()
        if (envContent.includes('X_PIXEL_ID=')) {
          envContent = envContent.replace(/X_PIXEL_ID=.*/g, `X_PIXEL_ID=${xpid}`)
        } else {
          envContent += `\nX_PIXEL_ID=${xpid}`
        }
      }
      if (settings.xPixelToken) {
        const xptok = settings.xPixelToken.trim()
        if (envContent.includes('X_PIXEL_TOKEN=')) {
          envContent = envContent.replace(/X_PIXEL_TOKEN=.*/g, `X_PIXEL_TOKEN=${xptok}`)
        } else {
          envContent += `\nX_PIXEL_TOKEN=${xptok}`
        }
      }
      if (settings.xConversionEventId) {
        const xev = settings.xConversionEventId.trim()
        if (envContent.includes('X_CONVERSION_EVENT_ID=')) {
          envContent = envContent.replace(/X_CONVERSION_EVENT_ID=.*/g, `X_CONVERSION_EVENT_ID=${xev}`)
        } else {
          envContent += `\nX_CONVERSION_EVENT_ID=${xev}`
        }
      }
      if (settings.razorpayKeyId) {
        const kid = settings.razorpayKeyId.trim()
        if (envContent.includes('RAZORPAY_KEY_ID=')) {
          envContent = envContent.replace(/RAZORPAY_KEY_ID=.*/g, `RAZORPAY_KEY_ID=${kid}`)
        } else {
          envContent += `\nRAZORPAY_KEY_ID=${kid}`
        }
        if (envContent.includes('NEXT_PUBLIC_RAZORPAY_KEY_ID=')) {
          envContent = envContent.replace(/NEXT_PUBLIC_RAZORPAY_KEY_ID=.*/g, `NEXT_PUBLIC_RAZORPAY_KEY_ID=${kid}`)
        } else {
          envContent += `\nNEXT_PUBLIC_RAZORPAY_KEY_ID=${kid}`
        }
      }
      if (settings.razorpayKeySecret) {
        const ksec = settings.razorpayKeySecret.trim()
        if (envContent.includes('RAZORPAY_KEY_SECRET=')) {
          envContent = envContent.replace(/RAZORPAY_KEY_SECRET=.*/g, `RAZORPAY_KEY_SECRET=${ksec}`)
        } else {
          envContent += `\nRAZORPAY_KEY_SECRET=${ksec}`
        }
      }
      fs.writeFileSync(envPath, envContent, 'utf8')
    }
  } catch (envErr) {
    console.warn('Could not sync .env file:', envErr)
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } })
    return setting?.value || null
  } catch (e) {
    await ensureDatabaseReady()
    return null
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  await ensureDatabaseReady()
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
}