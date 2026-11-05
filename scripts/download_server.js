const http = require('http')
const fs = require('fs')
const path = require('path')

const zipPath = path.join(__dirname, '..', 'DUKANRANT_HOSTINGER_DEPLOY.zip')
const adVideoHtml = path.join(__dirname, '..', 'public', 'ad-video.html')
const posterPath = path.join(__dirname, '..', 'public', 'images', 'meta-ad-poster.jpg')
const PORT = 5500

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0]

  if (urlPath === '/video-ad' || urlPath === '/video') {
    if (fs.existsSync(adVideoHtml)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(fs.readFileSync(adVideoHtml))
    }
  }

  if (urlPath === '/meta-ad-poster.jpg' || urlPath === '/poster') {
    if (fs.existsSync(posterPath)) {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' })
      return res.end(fs.readFileSync(posterPath))
    }
  }

  if (urlPath.startsWith('/audio/')) {
    const audioFileName = path.basename(urlPath)
    const audioFilePath = path.join(__dirname, '..', 'public', 'audio', audioFileName)
    if (fs.existsSync(audioFilePath)) {
      const stat = fs.statSync(audioFilePath)
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*'
      })
      return fs.createReadStream(audioFilePath).pipe(res)
    }
  }

  if (urlPath === '/download' || urlPath === '/DUKANRANT_HOSTINGER_DEPLOY.zip') {
    if (!fs.existsSync(zipPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('File not found')
    }
    const stat = fs.statSync(zipPath)
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="DUKANRANT_HOSTINGER_DEPLOY.zip"',
      'Access-Control-Allow-Origin': '*',
    })
    const readStream = fs.createReadStream(zipPath)
    return readStream.pipe(res)
  }

  const videoKitZipPath = path.join(__dirname, '..', 'NO1DOMAIN_VIDEO_KIT.zip')

  if (urlPath === '/video-kit.zip' || urlPath === '/kit') {
    if (fs.existsSync(videoKitZipPath)) {
      const stat = fs.statSync(videoKitZipPath)
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="NO1DOMAIN_VIDEO_KIT.zip"',
        'Access-Control-Allow-Origin': '*'
      })
      return fs.createReadStream(videoKitZipPath).pipe(res)
    }
  }

  if (urlPath.startsWith('/ad-pics/')) {
    const picName = path.basename(urlPath)
    const picPath = path.join(__dirname, '..', 'public', 'ad-pics', picName)
    if (fs.existsSync(picPath)) {
      const stat = fs.statSync(picPath)
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*'
      })
      return fs.createReadStream(picPath).pipe(res)
    }
  }

  if (urlPath === '/pics' || urlPath === '/gallery') {
    const pics = [
      { file: '01_Problem_Traffic_Alert.jpg', title: 'Scene 1: Traffic Problem (Hook)', desc: '🚨 Website Traffic Zero? Ads me paise barbaad band karein!' },
      { file: '02_Solution_Crown_Leaderboard.jpg', title: 'Scene 2: Crown Leaderboard (Solution)', desc: '👑 Introducing NO. 1 DOMAIN — India\'s 1st Attention Board' },
      { file: '03_Offer_50_Rupees_Boost.jpg', title: 'Scene 3: Launch Offer ₹50 (Offer)', desc: '⚡ Sirf ₹50 Mein Claim Karein Top #1 Spot' },
      { file: '04_Live_Proof_UPI_QR.jpg', title: 'Scene 4: Live Proof & UPI QR (Trust)', desc: '📡 1,480+ Real Live Visitors & Instant Dynamic QR' },
      { file: '05_CTA_Claim_Your_Crown.jpg', title: 'Scene 5: Claim Your Crown (CTA)', desc: '🚀 Abhi Visit Karein: no1domain.in aur apna rank lein!' }
    ]

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(`
      <!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>NO. 1 DOMAIN — 5 Ad Pictures Gallery</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #080914; color: #fff; padding: 30px 15px; text-align: center; }
          .header { max-width: 800px; margin: 0 auto 30px; }
          h1 { color: #facc15; font-size: 26px; margin-bottom: 8px; }
          p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
          .btn-download-all { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #eab308, #f59e0b); color: #020617; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 8px 25px rgba(234,179,8,0.4); transition: 0.2s; }
          .btn-download-all:hover { transform: scale(1.03); }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; max-width: 1300px; margin: 0 auto; }
          .card { background: #121424; border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: 0.3s; }
          .card:hover { transform: translateY(-6px); border-color: #facc15; box-shadow: 0 15px 40px rgba(250,204,21,0.2); }
          .img-box { position: relative; width: 100%; aspect-ratio: 9/16; background: #000; overflow: hidden; }
          .img-box img { width: 100%; height: 100%; object-fit: cover; }
          .info { padding: 16px; text-align: left; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
          .title { font-weight: 800; font-size: 15px; color: #facc15; margin-bottom: 6px; }
          .desc { font-size: 12px; color: #94a3b8; line-height: 1.4; margin-bottom: 12px; }
          .btn-save { display: block; text-align: center; background: #1e2139; color: #38bdf8; font-weight: 700; font-size: 12px; padding: 10px; border-radius: 8px; text-decoration: none; border: 1px solid rgba(56,189,248,0.4); }
          .btn-save:hover { background: #38bdf8; color: #020617; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📸 5 Ultra HD Video Ad Pictures (9:16 Reels Format)</h1>
          <p>Apna video banane ke liye ye 5 photos use karein! CapCut, VN Editor ya InShot me import karke 5-5 second set karein.</p>
          <a href="/video-kit.zip" class="btn-download-all">
            📦 Download All 5 Pictures + Audio Voiceovers (ZIP)
          </a>
        </div>

        <div class="grid">
          \${pics.map((p, idx) => \`
            <div class="card">
              <div class="img-box">
                <img src="/ad-pics/\${p.file}" alt="\${p.title}">
              </div>
              <div class="info">
                <div>
                  <div class="title">\${p.title}</div>
                  <div class="desc">\${p.desc}</div>
                </div>
                <a href="/ad-pics/\${p.file}" download="\${p.file}" class="btn-save">
                  ⬇️ Download Picture \${idx + 1} (HD JPG)
                </a>
              </div>
            </div>
          \`).join('')}
        </div>
      </body>
      </html>
    `)
  }

  // Home portal
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(`
    <!DOCTYPE html>
    <html lang="hi">
      <head>
        <meta charset="utf-8">
        <title>NO. 1 DOMAIN — Meta Ads & Deploy Center</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; background: #090a14; color: #fff; text-align: center; padding: 40px 15px; margin: 0; }
          .card { max-width: 650px; margin: 0 auto; background: #121424; border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
          h1 { color: #facc15; font-size: 24px; margin-bottom: 8px; }
          p { color: #94a3b8; font-size: 14px; margin-bottom: 25px; }
          .btn-grid { display: grid; gap: 14px; margin-bottom: 20px; }
          .btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 20px; border-radius: 12px; font-weight: 800; font-size: 14px; text-decoration: none; transition: 0.2s; }
          .btn-video { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; }
          .btn-poster { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff; }
          .btn-zip { background: linear-gradient(135deg, #eab308, #f59e0b); color: #020617; }
          .btn:hover { transform: scale(1.02); opacity: 0.95; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🎬 NO. 1 DOMAIN — Meta Ads &amp; Deployment</h1>
          <p>Meta Ads (Instagram Reels &amp; FB) Video &amp; Hostinger Deploy Hub</p>
          <div class="btn-grid">
            <a href="/pics" class="btn btn-poster" style="background: linear-gradient(135deg, #10b981, #06b6d4);">
              📸 View &amp; Download 5 HD Video Ad Pictures (/pics)
            </a>
            <a href="/video-kit.zip" class="btn btn-video" style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">
              📦 Download Video Creator Kit ZIP (5 Pictures + Studio Hindi Voiceovers)
            </a>
            <a href="/video-ad" class="btn btn-video">
              ▶ 30-Second Meta Ad Video (Ready-Made Animated Video with Voice)
            </a>
            <a href="/meta-ad-poster.jpg" target="_blank" class="btn btn-poster">
              🖼️ Download 9:16 High-Res Meta Ad Poster
            </a>
            <a href="/download" class="btn btn-zip">
              🚀 Download Latest Hostinger Deploy ZIP (DUKANRANT_HOSTINGER_DEPLOY.zip)
            </a>
          </div>
        </div>
      </body>
    </html>
  `)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
