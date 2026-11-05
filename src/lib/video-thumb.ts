import fs from 'fs'
import path from 'path'

export async function resolveListingImage(url?: string, videoUrl?: string, defaultHostname?: string): Promise<string> {
  const target = videoUrl || url || ''
  
  // 1. YouTube Video Thumbnail
  const ytMatch = target.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
  }

  // 2. Instagram Profile or Post Image
  if (target.includes('instagram.com')) {
    try {
      const cleanIgUrl = target.startsWith('http') ? target : `https://${target}`
      const igRes = await fetch(cleanIgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
      if (igRes.ok) {
        const html = await igRes.text()
        const match = html.match(/<meta property="og:image" content="([^"]+)"/)
        if (match && match[1]) {
          const rawImgUrl = match[1].replace(/&amp;/g, '&')
          try {
            const imgRes = await fetch(rawImgUrl)
            if (imgRes.ok) {
              const buffer = Buffer.from(await imgRes.arrayBuffer())
              const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
              if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
              const filename = `thumb_ig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`
              fs.writeFileSync(path.join(uploadsDir, filename), buffer)
              return `/uploads/${filename}`
            }
          } catch {
            return rawImgUrl
          }
        }
      }
    } catch (err) {
      console.warn('Instagram thumb resolution failed:', err)
    }
  }

  // 3. Fallback to favicon
  if (defaultHostname) {
    return `https://www.google.com/s2/favicons?domain=${defaultHostname}&sz=128`
  }

  return '/images/logo-transparent.png'
}
