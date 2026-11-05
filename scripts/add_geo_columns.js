const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const dbs = ['dev.db', 'prisma/dev.db', 'prisma/seed_initial.db']
  const columns = ['country', 'city', 'device', 'browser']

  for (const dbName of dbs) {
    try {
      const p = new PrismaClient({
        datasources: { db: { url: `file:${dbName}` } },
      })
      
      const cols = await p.$queryRawUnsafe("PRAGMA table_info(Visit)")
      const existingColNames = cols.map(c => c.name)
      console.log(`${dbName} existing cols:`, existingColNames)

      for (const col of columns) {
        if (!existingColNames.includes(col)) {
          await p.$executeRawUnsafe(`ALTER TABLE "Visit" ADD COLUMN "${col}" TEXT;`)
          console.log(`Added column ${col} to ${dbName}`)
        }
      }
      await p.$disconnect()
    } catch (e) {
      console.error(`Error in ${dbName}:`, e.message)
    }
  }
}

main().finally(() => prisma.$disconnect())
