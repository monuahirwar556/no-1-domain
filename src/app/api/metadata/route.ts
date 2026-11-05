import { NextRequest, NextResponse } from 'next/server'
import { detectWebsiteCategory } from '@/lib/categories'

export const dynamic = 'force-dynamic'

function isPrivateOrLocalHost(host: string): boolean {
  const clean = host.toLowerCase().trim().replace(/^\[|\]$/g, '')
  if (
    clean === 'localhost' ||
    clean.endsWith('.localhost') ||
    clean.endsWith('.local') ||
    clean.endsWith('.internal') ||
    clean.endsWith('.lan') ||
    clean === '0.0.0.0' ||
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean.startsWith('127.') ||
    clean.startsWith('10.') ||
    clean.startsWith('192.168.') ||
    clean.startsWith('169.254.')
  ) {
    return true
  }

  // 172.16.0.0 - 172.31.255.255
  const match172 = clean.match(/^172\.(\d+)\./)
  if (match172) {
    const octet = parseInt(match172[1], 10)
    if (octet >= 16 && octet <= 31) return true
  }

  return false
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawUrl = searchParams.get('url')

    if (!rawUrl || rawUrl.trim().length < 2) {
      return NextResponse.json({ message: 'URL required' }, { status: 400 })
    }

    let url = rawUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ message: 'Invalid URL format' }, { status: 400 })
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ message: 'Only HTTP and HTTPS protocols are permitted' }, { status: 400 })
    }

    const hostname = parsedUrl.hostname.replace(/^www\./, '')
    if (isPrivateOrLocalHost(hostname)) {
      return NextResponse.json({ message: 'Restricted domain or IP address' }, { status: 400 })
    }

    // Extract brand name:
    // e.g. yourbrand.in -> Yourbrand
    const parts = hostname.split('.')
    let brandPart = parts[0] || hostname
    if (parts.length > 2 && (parts[1] === 'co' || parts[1] === 'com' || parts[1] === 'org' || parts[1] === 'net')) {
      brandPart = parts[0]
    } else if (parts.length >= 2) {
      brandPart = parts.slice(0, parts.length - 1).join(' ')
    }

    const capitalizedName = brandPart.charAt(0).toUpperCase() + brandPart.slice(1)
    let title = `${capitalizedName} — Official Platform`
    let brandName = capitalizedName
    let description = ''
    let keywords = ''

    // 1. YouTube Video / Shorts title & author via oEmbed
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      try {
        const ytRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
          next: { revalidate: 3600 },
        })
        if (ytRes.ok) {
          const ytData = await ytRes.json()
          if (ytData.title) title = ytData.title
          if (ytData.author_name) brandName = ytData.author_name
        }
      } catch (e) {
        console.warn('YouTube oembed fetch failed:', e)
      }
    } else if (hostname.includes('instagram.com')) {
      // 2. Instagram Profile / Reel real name & title
      try {
        const igUserMatch = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/)
        if (igUserMatch && igUserMatch[1] && !['reel', 'p', 'tv', 'stories', 'explore'].includes(igUserMatch[1])) {
          title = `@${igUserMatch[1]}`
          brandName = `@${igUserMatch[1]}`
        }

        const igRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        })
        if (igRes.ok) {
          const html = await igRes.text()
          const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i)
          if (ogTitleMatch && ogTitleMatch[1]) {
            const rawTitle = ogTitleMatch[1]
              .replace(/&#064;/g, '@')
              .replace(/&#x2022;/g, '•')
              .replace(/&amp;/g, '&')
              .split('•')[0]
              .trim()
            if (rawTitle) {
              title = rawTitle
              brandName = rawTitle
            }
          }
        }
      } catch (e) {
        console.warn('Instagram title fetch failed:', e)
      }
    } else {
      // 3. Regular Website: Live Scrape with short timeout (3.5 seconds)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3500)

        const pageRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (pageRes.ok) {
          const html = await pageRes.text()

          // Extract <title>
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          if (titleMatch && titleMatch[1]) {
            const cleanTitle = titleMatch[1]
              .replace(/&amp;/g, '&')
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')
              .trim()
            if (cleanTitle && cleanTitle.length > 2 && cleanTitle.length < 120) {
              title = cleanTitle
            }
          }

          // Extract meta description
          const descMatch =
            html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
          if (descMatch && descMatch[1]) {
            description = descMatch[1]
              .replace(/&amp;/g, '&')
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')
              .trim()
          }

          // Extract meta keywords
          const kwMatch =
            html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i)
          if (kwMatch && kwMatch[1]) {
            keywords = kwMatch[1]
          }
        }
      } catch (e) {
        // Fallback gracefully to domain heuristics if network error or timeout
      }
    }

    const { resolveListingImage } = await import('@/lib/video-thumb')
    const faviconUrl = await resolveListingImage(url, undefined, hostname)

    // Detect category using domain name, title, description, and keywords
    const detectedCategory = detectWebsiteCategory(hostname, title, description, keywords)

    return NextResponse.json({
      valid: true,
      domain: brandName.startsWith('@') ? brandName : hostname,
      fullUrl: url,
      title,
      brandName,
      description,
      faviconUrl,
      detectedCategory,
    })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}
