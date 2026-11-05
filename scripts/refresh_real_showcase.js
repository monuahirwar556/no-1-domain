const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up old demo entries from database...');
  // Delete all old dummy DEMO listings
  const deleted = await prisma.listing.deleteMany({
    where: { status: 'DEMO' },
  });
  console.log(`Deleted ${deleted.count} old demo listings.`);

  console.log('Database cleaned. Fresh 20 real Indian domains and 20 real Instagram profiles will load cleanly.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
