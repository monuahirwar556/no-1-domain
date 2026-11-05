const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

const rootFiles = [
  'package.json',
  'package-lock.json',
  'server.js',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  'next.config.js',
  'next-env.d.ts',
  '.env',
  '.env.production',
  '.env.example',
  'README_BACKUP_GUIDE.md',
  'HOSTINGER_DEPLOY_GUIDE.md',
  'dev.db',
  'demo_domains.json',
]

const rootDirs = ['src', 'public', 'prisma', 'scripts']

let ZipArchiveClass = null
async function getZipArchive() {
  if (!ZipArchiveClass) {
    const archiver = await import('archiver')
    ZipArchiveClass = archiver.ZipArchive
  }
  return ZipArchiveClass
}

async function createZip(outPath, includeNext = false, isDeploy = false) {
  const ZipArchive = await getZipArchive()
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath)
    const archive = new ZipArchive({ zlib: { level: 9 } })

    output.on('close', () => {
      const mb = (archive.pointer() / 1024 / 1024).toFixed(2)
      console.log(`Created: ${path.basename(outPath)} (${mb} MB - ${archive.pointer()} bytes) [isDeploy=${isDeploy}]`)
      resolve()
    })

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') console.warn(err)
      else reject(err)
    })

    archive.on('error', (err) => reject(err))

    archive.pipe(output)

    // Add root files
    for (const f of rootFiles) {
      const fullPath = path.join(root, f)
      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: f })
      }
    }

    // Add root directories
    for (const d of rootDirs) {
      const fullDir = path.join(root, d)
      if (fs.existsSync(fullDir)) {
        archive.directory(fullDir, d, (entry) => {
          if (entry.name.endsWith('.zip')) return false
          return entry
        })
      }
    }

    // Add .next (excluding cache) if requested
    if (includeNext) {
      const nextDir = path.join(root, '.next')
      if (fs.existsSync(nextDir)) {
        archive.directory(nextDir, '.next', (entry) => {
          if (entry.name === 'cache' || entry.name.startsWith('cache/') || entry.name.startsWith('cache\\')) {
            return false
          }
          return entry
        })
      }
    }

    archive.finalize()
  })
}

async function main() {
  console.log('Generating complete project backup and production packages...')

  // 0. Ensure root dev.db and prisma/seed_initial.db are synced using the latest modified file
  const prismaDb = path.join(root, 'prisma', 'dev.db')
  const rootDb = path.join(root, 'dev.db')
  const seedDb = path.join(root, 'prisma', 'seed_initial.db')
  
  let sourceDb = null
  if (fs.existsSync(prismaDb) && fs.existsSync(rootDb)) {
    const prismaStat = fs.statSync(prismaDb)
    const rootStat = fs.statSync(rootDb)
    sourceDb = prismaStat.mtimeMs >= rootStat.mtimeMs ? prismaDb : rootDb
  } else if (fs.existsSync(prismaDb)) {
    sourceDb = prismaDb
  } else if (fs.existsSync(rootDb)) {
    sourceDb = rootDb
  }
  
  if (sourceDb) {
    if (sourceDb !== prismaDb) fs.copyFileSync(sourceDb, prismaDb)
    if (sourceDb !== rootDb) fs.copyFileSync(sourceDb, rootDb)
    fs.copyFileSync(sourceDb, seedDb)
    console.log(`Synchronized latest database from ${path.basename(sourceDb)} to all locations.`)
  }

  // Clean up any legacy DUKANRANT zip files
  const legacyZips = [
    path.join(root, 'DUKANRANT_HOSTINGER_DEPLOY.zip'),
    path.join(root, 'DUKANRANT_SOURCE_DEPLOY.zip'),
    path.join(root, 'public', 'DUKANRANT_HOSTINGER_DEPLOY.zip'),
    path.join(root, 'public', 'DUKANRANT_SOURCE_DEPLOY.zip'),
  ]
  for (const lz of legacyZips) {
    if (fs.existsSync(lz)) {
      try { fs.unlinkSync(lz) } catch (e) {}
    }
  }

  // Generate ONLY ONE single final deployment package
  const hostingerReadyPath = path.join(root, 'NO1DOMAIN_HOSTINGER_UPLOAD_READY.zip')
  await createZip(hostingerReadyPath, true, false)

  // Copy ONLY to Desktop and Downloads
  const targets = [
    path.join(process.env.USERPROFILE || '', 'OneDrive', 'Desktop', 'NO1DOMAIN_HOSTINGER_UPLOAD_READY.zip'),
    path.join(process.env.USERPROFILE || '', 'Desktop', 'NO1DOMAIN_HOSTINGER_UPLOAD_READY.zip'),
    path.join(process.env.USERPROFILE || '', 'Downloads', 'NO1DOMAIN_HOSTINGER_UPLOAD_READY.zip'),
  ]
  for (const t of targets) {
    try {
      if (fs.existsSync(path.dirname(t))) {
        fs.copyFileSync(hostingerReadyPath, t)
        console.log(`Copied to: ${t}`)
      }
    } catch (e) {}
  }

  console.log('\nSUCCESS! Exactly 1 clean file generated: NO1DOMAIN_HOSTINGER_UPLOAD_READY.zip')
}

main().catch((err) => {
  console.error('Packaging error:', err)
  process.exit(1)
})
