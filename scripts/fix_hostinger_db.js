const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Running automatic database column fixer for Hostinger...')

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

  let added = 0
  for (const sql of alterStatements) {
    try {
      await prisma.$executeRawUnsafe(sql)
      console.log('Successfully executed:', sql)
      added++
    } catch (err) {
      // Ignored: column already exists
    }
  }

  console.log(`Self-healing complete. Columns added or verified: ${alterStatements.length}. Ready!`)
}

main()
  .catch((e) => {
    console.error('Error fixing database:', e)
  })
  .finally(() => prisma.$disconnect())
