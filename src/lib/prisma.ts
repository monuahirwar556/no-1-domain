import { PrismaClient } from '@prisma/client'

// Guarantee DATABASE_URL is ALWAYS available so Prisma never throws 'Environment variable not found: DATABASE_URL'
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  schemaHealed: boolean | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Auto-heal missing SQLite columns (e.g. videoUrl, targetUrl) so Hostinger / older DBs never crash
if (typeof window === 'undefined' && !globalForPrisma.schemaHealed) {
  globalForPrisma.schemaHealed = true
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

  Promise.resolve().then(async () => {
    for (const sql of alterStatements) {
      try {
        await prisma.$executeRawUnsafe(sql)
      } catch {
        // Ignored: column already exists
      }
    }
  }).catch(() => {})
}

export default prisma