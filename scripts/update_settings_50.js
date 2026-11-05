const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { key: 'top1_increment' },
    update: { value: '50' },
    create: { key: 'top1_increment', value: '50' },
  });
  await prisma.setting.upsert({
    where: { key: 'other_position_increment' },
    update: { value: '50' },
    create: { key: 'other_position_increment', value: '50' },
  });
  await prisma.setting.upsert({
    where: { key: 'minimum_starting_bid' },
    update: { value: '50' },
    create: { key: 'minimum_starting_bid', value: '50' },
  });
  console.log('Database settings successfully updated: Website starting tier is ₹50!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
