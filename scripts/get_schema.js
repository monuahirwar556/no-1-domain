const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tables = await prisma.$queryRawUnsafe("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
  console.log(JSON.stringify(tables, null, 2))
}

main().finally(() => prisma.$disconnect())
