const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'public', 'brands')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const brands = [
  {
    file: 'ayurvedalife.svg',
    name: 'AL',
    c1: '#065f46',
    c2: '#10b981',
    symbol: '<path d="M64 36c-16 0-26 12-26 26 0 16 14 30 26 30s26-14 26-30c0-14-10-26-26-26zm0 46c-6-6-12-16-12-24 0-8 6-14 12-14s12 6 12 14c0 8-6 18-12 24z" fill="#fff" opacity="0.9"/>',
    label: 'Ayurveda'
  },
  {
    file: 'shoppiekart.svg',
    name: 'SK',
    c1: '#1e40af',
    c2: '#06b6d4',
    symbol: '<path d="M42 42h8l8 24h24l6-16H52" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="58" cy="74" r="5" fill="#fff"/><circle cx="78" cy="74" r="5" fill="#fff"/>',
    label: 'Shoppie'
  },
  {
    file: 'urbanprint.svg',
    name: 'UP',
    c1: '#6b21a8',
    c2: '#ec4899',
    symbol: '<path d="M48 42h32v12H68v32H56V54H48V42z" fill="#fff"/><circle cx="80" cy="46" r="4" fill="#fbcfe8"/>',
    label: 'Streetwear'
  },
  {
    file: 'craftyvines.svg',
    name: 'CV',
    c1: '#92400e',
    c2: '#f59e0b',
    symbol: '<path d="M64 40c-12 10-18 22-14 32 4 10 14 14 24 10 10-4 14-14 10-24-2-6-8-12-20-18zm0 28c-4-4-6-10-4-14 2-4 6-6 10-4 4 2 6 6 4 10-2 4-6 6-10 8z" fill="#fff"/>',
    label: 'Crafts'
  },
  {
    file: 'fitprocoach.svg',
    name: 'FP',
    c1: '#c2410c',
    c2: '#ef4444',
    symbol: '<path d="M40 60h8v8h-8zm40 0h8v8h-8zm-32 2h24v4H48zm-6-6h4v16h-4zm36 0h4v16h-4z" fill="#fff"/>',
    label: 'FitPro'
  },
  {
    file: 'devagency.svg',
    name: 'DA',
    c1: '#3730a3',
    c2: '#38bdf8',
    symbol: '<path d="M52 50l-12 14 12 14m24-28l12 14-12 14m-10-32l-8 36" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    label: 'DevAgency'
  },
  {
    file: 'chotistore.svg',
    name: 'CS',
    c1: '#b45309',
    c2: '#eab308',
    symbol: '<path d="M48 54h32l-4 26H52L48 54zm8-12h16v6H56v-6z" fill="#fff" opacity="0.9"/>',
    label: 'Desi Food'
  },
  {
    file: 'glowskincare.svg',
    name: 'GL',
    c1: '#be123c',
    c2: '#fb7185',
    symbol: '<path d="M64 38c0 10 16 24 16 34 0 9-7 16-16 16s-16-7-16-16c0-10 16-24 16-34z" fill="#fff"/>',
    label: 'GlowSkin'
  },
  {
    file: 'bakesbyneha.svg',
    name: 'BN',
    c1: '#78350f',
    c2: '#d97706',
    symbol: '<path d="M48 64c0 12 7 18 16 18s16-6 16-18H48zm16-26c-10 0-16 6-16 14 0 6 4 10 16 10s16-4 16-10c0-8-6-14-16-14z" fill="#fff"/>',
    label: 'Bakery'
  },
  {
    file: 'smartdealsdaily.svg',
    name: 'SD',
    c1: '#047857',
    c2: '#10b981',
    symbol: '<path d="M46 52l18-14 18 14-6 24H52l-6-24zm18 4a4 4 0 100-8 4 4 0 000 8z" fill="#fff"/>',
    label: 'SmartDeals'
  },
  {
    file: 'thejewelbox.svg',
    name: 'JB',
    c1: '#581c87',
    c2: '#a855f7',
    symbol: '<path d="M50 48l14-12 14 12-7 28H57L50 48z" fill="#fff" opacity="0.95"/>',
    label: 'JewelBox'
  },
  {
    file: 'pawzcare.svg',
    name: 'PC',
    c1: '#0369a1',
    c2: '#06b6d4',
    symbol: '<circle cx="52" cy="50" r="4" fill="#fff"/><circle cx="64" cy="44" r="4.5" fill="#fff"/><circle cx="76" cy="50" r="4" fill="#fff"/><ellipse cx="64" cy="66" rx="10" ry="8" fill="#fff"/>',
    label: 'PawzCare'
  },
  {
    file: 'codewithaman.svg',
    name: 'CA',
    c1: '#1e1b4b',
    c2: '#6366f1',
    symbol: '<path d="M46 54l8 10-8 10m18 0h14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    label: 'CodeAman'
  },
  {
    file: 'delhidiaries.svg',
    name: 'DD',
    c1: '#991b1b',
    c2: '#f97316',
    symbol: '<path d="M44 48h40v30H44V48zm20-10l12 10H52l12-10z" fill="#fff"/>',
    label: 'DelhiDiary'
  },
  {
    file: 'quickresume.svg',
    name: 'QR',
    c1: '#1d4ed8',
    c2: '#38bdf8',
    symbol: '<path d="M48 40h24l10 10v32H48V40zm20 4v8h8M56 60h16m-16 8h12" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
    label: 'Resume'
  },
  {
    file: 'jaipurhandloom.svg',
    name: 'JH',
    c1: '#1e3a8a',
    c2: '#d97706',
    symbol: '<circle cx="64" cy="62" r="14" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M64 42v40M44 62h40" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    label: 'JaipurCraft'
  },
  {
    file: 'soundwavebeats.svg',
    name: 'SB',
    c1: '#4c1d95',
    c2: '#db2777',
    symbol: '<path d="M44 62v8m8-18v28m8-36v44m8-30v16m8-20v24m8-12v8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    label: 'SoundWave'
  },
  {
    file: 'snackboxindia.svg',
    name: 'SI',
    c1: '#c2410c',
    c2: '#fbbf24',
    symbol: '<path d="M46 52h36l-4 26H50L46 52zm6-12h24l3 6H49l3-6z" fill="#fff"/>',
    label: 'SnackBox'
  },
  {
    file: 'studybuddyapp.svg',
    name: 'SA',
    c1: '#075985',
    c2: '#3b82f6',
    symbol: '<path d="M46 68c8-4 18-4 18 0 0-4 10-4 18 0V48c-8-4-18-4-18 0 0-4-10-4-18 0v20z" fill="#fff"/>',
    label: 'StudyApp'
  },
  {
    file: 'desitadka.svg',
    name: 'DT',
    c1: '#991b1b',
    c2: '#f59e0b',
    symbol: '<path d="M46 62c0 10 8 18 18 18s18-8 18-18H46zm18-22c-6 6-4 12-4 16 0-8 8-10 8-16zm-8 4c-3 4-2 8-2 10 0-5 5-6 5-10z" fill="#fff"/>',
    label: 'DesiTadka'
  }
]

for (const b of brands) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="g_${b.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${b.c1}"/>
      <stop offset="100%" stop-color="${b.c2}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#g_${b.name})"/>
  <rect x="2" y="2" width="124" height="124" rx="26" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <g filter="url(#glow)">
    ${b.symbol}
  </g>
  <text x="64" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5" opacity="0.95">${b.label.toUpperCase()}</text>
</svg>`

  fs.writeFileSync(path.join(dir, b.file), svg, 'utf8')
}

console.log(`Generated ${brands.length} clean custom SVG brand logos in public/brands/!`)
