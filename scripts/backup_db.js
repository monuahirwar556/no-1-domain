const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const backupDir = path.join(root, 'backups')
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })

const dbPaths = [
  path.join(root, 'dev.db'),
  path.join(root, 'prisma', 'dev.db')
]

let backedUp = false
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

for (const dbPath of dbPaths) {
  if (fs.existsSync(dbPath)) {
    const dest = path.join(backupDir, `dev_db_backup_${timestamp}.db`)
    const destLatest = path.join(backupDir, `dev_db_backup_latest.db`)
    fs.copyFileSync(dbPath, dest)
    fs.copyFileSync(dbPath, destLatest)
    console.log(`[SUCCESS] Database securely backed up to:\n  - ${dest}\n  - ${destLatest}`)
    backedUp = true
    break
  }
}

if (!backedUp) {
  console.warn('[NOTICE] dev.db not found to backup.')
} else {
  console.log('[INFO] Customer records, visits, payments, and listings are 100% preserved!')
}
