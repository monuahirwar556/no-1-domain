const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function restore() {
  const dukanrant = await prisma.listing.findFirst({
    where: { domain: 'dukanrant.com' }
  })

  if (dukanrant) {
    const updated = await prisma.listing.update({
      where: { id: dukanrant.id },
      data: {
        status: 'ACTIVE',
        currentBid: 50,
        startingBid: 50,
        clicks: 1,
      }
    })
    console.log('Restored dukanrant.com to ACTIVE with bid 50:', updated)

    // Ensure corresponding bid is PAID
    const bid = await prisma.bid.findFirst({
      where: { listingId: dukanrant.id }
    })
    if (bid) {
      await prisma.bid.update({
        where: { id: bid.id },
        data: {
          status: 'PAID',
          amount: 50,
          position: 1,
        }
      })
      console.log('Updated bid to PAID')
    }

    // Ensure payment is SUCCESS
    const payment = await prisma.payment.findFirst({
      where: { userId: dukanrant.createdById }
    })
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          amount: 50,
        }
      })
      console.log('Updated payment to SUCCESS')
    }
  } else {
    console.log('dukanrant.com not found')
  }
}

restore().finally(() => prisma.$disconnect())
