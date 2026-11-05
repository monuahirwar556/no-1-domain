const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const listing = await prisma.listing.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { currentBid: 'desc' },
  })

  if (listing) {
    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        imageUrl: '/uploads/monu_ahirwar.jpg',
        title: 'Monu Ahirwar (@monu_ahirwar1)',
        domain: '@monu_ahirwar1',
      },
    })
    console.log('Successfully updated listing image to /uploads/monu_ahirwar.jpg and title to Monu Ahirwar (@monu_ahirwar1)')
  } else {
    console.log('No listing found')
  }
}

main().finally(() => prisma.$disconnect())
