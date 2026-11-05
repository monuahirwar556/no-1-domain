const { PrismaClient } = require('@prisma/client')
const path = require('path')

const dbPaths = [
  path.resolve('dev.db'),
  path.resolve('prisma/dev.db'),
  path.resolve('prisma/seed_initial.db'),
  path.resolve('backups/dev_db_backup_latest.db'),
]

async function cleanAll() {
  for (const dbPath of dbPaths) {
    console.log(`\n--- Cleaning DB: ${dbPath} ---`)
    const fileUrl = `file:${dbPath}`
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: fileUrl,
        },
      },
    })

    try {
      const found = await prisma.listing.findMany({
        where: {
          OR: [
            { domain: { contains: 'dukanrant' } },
            { title: { contains: 'Dukanrant' } },
          ],
        },
      })
      console.log(`Found ${found.length} dukanrant listings in ${path.basename(dbPath)}`)

      for (const item of found) {
        await prisma.visit.deleteMany({ where: { listingId: item.id } }).catch(() => {})
        await prisma.payment.deleteMany({ where: { bid: { listingId: item.id } } }).catch(() => {})
        await prisma.bid.deleteMany({ where: { listingId: item.id } }).catch(() => {})
        await prisma.listing.delete({ where: { id: item.id } })
        console.log(`  -> Deleted listing ${item.domain} (${item.id})`)
      }

      const count = await prisma.listing.count({ where: { domain: 'dukanrant.com' } })
      console.log(`Remaining dukanrant in ${path.basename(dbPath)}: ${count}`)
    } catch (e) {
      console.error(`Error in ${dbPath}:`, e.message)
    } finally {
      await prisma.$disconnect()
    }
  }
}

cleanAll()
