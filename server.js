const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

// Auto-load environment variables immediately so Prisma & Next.js always have DATABASE_URL
const envCandidates = ['.env.production', '.env.local', '.env']
for (const envFile of envCandidates) {
  const envFilePath = path.join(__dirname, envFile)
  if (fs.existsSync(envFilePath)) {
    try {
      const content = fs.readFileSync(envFilePath, 'utf8')
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=')
          const key = trimmed.substring(0, idx).trim()
          let val = trimmed.substring(idx + 1).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      })
    } catch (e) {
      console.warn(`Could not parse ${envFile}:`, e.message)
    }
  }
}

// Guaranteed fallback for SQLite DATABASE_URL
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 3000

// Auto-sync & backup SQLite dev.db file location to preserve all customer & visitor data
try {
  const rootDb = path.join(__dirname, 'dev.db')
  const prismaDb = path.join(__dirname, 'prisma', 'dev.db')
  const seedDb = path.join(__dirname, 'prisma', 'seed_initial.db')
  const backupDir = path.join(__dirname, 'backups')
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })

  // 1. If brand-new server installation with no DB at all, initialize from seed_initial.db
  if (!fs.existsSync(rootDb) && !fs.existsSync(prismaDb)) {
    if (fs.existsSync(seedDb)) {
      const prismaDir = path.dirname(prismaDb)
      if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir, { recursive: true })
      fs.copyFileSync(seedDb, prismaDb)
      fs.copyFileSync(seedDb, rootDb)
      console.log('Fresh server initialization: seeded initial database from seed_initial.db')
    }
  }

  // 2. Synchronize active database between root and prisma directory
  if (fs.existsSync(prismaDb) && !fs.existsSync(rootDb)) {
    fs.copyFileSync(prismaDb, rootDb)
    console.log('Synchronized dev.db to root directory')
  } else if (fs.existsSync(rootDb) && !fs.existsSync(prismaDb)) {
    const prismaDir = path.dirname(prismaDb)
    if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir, { recursive: true })
    fs.copyFileSync(rootDb, prismaDb)
    console.log('Synchronized dev.db to prisma directory')
  }

  // 3. Auto-backup live active database to guarantee no data loss on redeployment
  const activeDb = fs.existsSync(prismaDb) ? prismaDb : fs.existsSync(rootDb) ? rootDb : null
  if (activeDb) {
    fs.copyFileSync(activeDb, path.join(backupDir, 'dev_db_backup_latest.db'))
    console.log('Automated live database backup secured in backups/dev_db_backup_latest.db')
  }
} catch (e) {
  console.warn('DB sync notice:', e.message)
}

// Auto-heal missing SQLite columns (e.g. videoUrl, targetUrl) so Hostinger / older DBs never crash
async function autoMigrateDatabase() {
  try {
    const { PrismaClient } = require('@prisma/client')
    const p = new PrismaClient()
    const alterStatements = [
      'ALTER TABLE Listing ADD COLUMN videoUrl TEXT;',
      'ALTER TABLE Listing ADD COLUMN targetUrl TEXT;',
      'ALTER TABLE Listing ADD COLUMN websiteUrl TEXT;',
      'ALTER TABLE Listing ADD COLUMN domain TEXT;',
      'ALTER TABLE Listing ADD COLUMN clicks INTEGER DEFAULT 0;',
      'ALTER TABLE Listing ADD COLUMN startingBid INTEGER DEFAULT 0;',
      'ALTER TABLE Listing ADD COLUMN currentBid INTEGER DEFAULT 0;',
      'ALTER TABLE Listing ADD COLUMN currentBidderId TEXT;',
      'ALTER TABLE Listing ADD COLUMN status TEXT DEFAULT "ACTIVE";',
      'ALTER TABLE Listing ADD COLUMN imageUrl TEXT;',
      'ALTER TABLE Visit ADD COLUMN country TEXT;',
      'ALTER TABLE Visit ADD COLUMN city TEXT;',
      'ALTER TABLE Visit ADD COLUMN device TEXT;',
      'ALTER TABLE Visit ADD COLUMN browser TEXT;',
      'ALTER TABLE Visit ADD COLUMN referer TEXT;',
      'ALTER TABLE Bid ADD COLUMN position INTEGER;'
    ]
    for (const sql of alterStatements) {
      try {
        await p.$executeRawUnsafe(sql)
      } catch (err) {
        // Ignored: column already exists
      }
    }

    // Force synchronize the correct live Razorpay credentials into database Setting table
    const targetKeyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM').trim()
    const targetKeySecret = (process.env.RAZORPAY_KEY_SECRET || 'blxpBpB5MQYUrWo35a2ZMPsM').trim()

    try {
      await p.$executeRawUnsafe(`
        INSERT INTO Setting (id, key, value, createdAt, updatedAt)
        VALUES ('rzp_key_id', 'razorpay_key_id', '${targetKeyId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = '${targetKeyId}', updatedAt = CURRENT_TIMESTAMP;
      `)
      await p.$executeRawUnsafe(`
        INSERT INTO Setting (id, key, value, createdAt, updatedAt)
        VALUES ('rzp_key_secret', 'razorpay_key_secret', '${targetKeySecret}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = '${targetKeySecret}', updatedAt = CURRENT_TIMESTAMP;
      `)
      console.log('Automated live Razorpay keys locked in DB:', targetKeyId)
    } catch (rzpErr) {
      console.warn('Notice setting razorpay keys in DB:', rzpErr.message)
    }

    // Ensure amazon.in is locked at Rank 1 with ₹1050
    try {
      await p.$executeRawUnsafe(`
        UPDATE Listing SET currentBid = 1050, startingBid = 1050, status = 'ACTIVE' WHERE domain = 'amazon.in';
      `)
      console.log('Automated listing update: amazon.in locked at 1050 (Rank 1)')
    } catch (amazonErr) {
      console.warn('Notice setting amazon.in bid:', amazonErr.message)
    }

    await p.$disconnect()
    console.log('Automated database schema self-healing check complete.')
  } catch (err) {
    console.warn('Auto-migration notice:', err.message)
  }
}

const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  await autoMigrateDatabase()

  createServer(async (req, res) => {
    try {
      const host = req.headers.host || ''
      if (host.toLowerCase().startsWith('www.')) {
        const cleanHost = host.replace(/^www\./i, '')
        res.writeHead(301, { Location: `https://${cleanHost}${req.url}` })
        return res.end()
      }
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

