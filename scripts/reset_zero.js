const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('--- Starting Complete Reset to ZERO for Live Launch ---')

  // 1. Delete all traffic tracking / visits
  const deletedVisits = await prisma.visit.deleteMany({})
  console.log(`Deleted ${deletedVisits.count} visits.`)

  // 2. Delete all payments
  const deletedPayments = await prisma.payment.deleteMany({})
  console.log(`Deleted ${deletedPayments.count} payments.`)

  // 3. Delete all bids
  const deletedBids = await prisma.bid.deleteMany({})
  console.log(`Deleted ${deletedBids.count} bids.`)

  // 4. Delete all listings (domains)
  const deletedListings = await prisma.listing.deleteMany({})
  console.log(`Deleted ${deletedListings.count} domain listings.`)

  // 5. Delete all non-admin users & sessions
  await prisma.session.deleteMany({})
  await prisma.account.deleteMany({})
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: { not: 'ADMIN' },
    },
  })
  console.log(`Deleted ${deletedUsers.count} dummy bidder users.`)

  // 6. Ensure default admin user is ready
  const passwordHash = await bcrypt.hash('Monu860@', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'monuahirwar556@gmail.com' },
    update: {
      name: 'monuahirwar556',
      password: passwordHash,
      role: 'ADMIN',
    },
    create: {
      email: 'monuahirwar556@gmail.com',
      name: 'monuahirwar556',
      password: passwordHash,
      role: 'ADMIN',
    },
  })
  console.log(`Admin account verified: ${admin.name} (${admin.email})`)

  // 7. Reset settings for clean live start (Preserve user's configured Razorpay keys)
  const existingKeyId = await prisma.setting.findUnique({ where: { key: 'razorpay_key_id' } })
  const existingKeySecret = await prisma.setting.findUnique({ where: { key: 'razorpay_key_secret' } })

  const liveSettings = [
    { key: 'currency', value: 'INR' },
    { key: 'currency_symbol', value: '₹' },
    { key: 'top1_increment', value: '50' },
    { key: 'other_position_increment', value: '50' },
    { key: 'minimum_starting_bid', value: '50' },
    { key: 'maximum_bid', value: '10000000' },
    { key: 'payment_gateway', value: 'Razorpay' },
    { key: 'razorpay_key_id', value: existingKeyId?.value || process.env.RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM' },
    { key: 'razorpay_key_secret', value: existingKeySecret?.value || process.env.RAZORPAY_KEY_SECRET || 'blxpBpB5MQYUrWo35a2ZMPsM' },
  ]

  for (const s of liveSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log('Platform settings updated: Minimum starting bid = ₹50, Increment = +₹50')

  // 8. Verify final counts
  const [uCount, lCount, bCount, pCount, vCount] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.bid.count(),
    prisma.payment.count(),
    prisma.visit.count(),
  ])

  console.log('\n=======================================')
  console.log('✅ ALL METRICS RESET TO ZERO FOR LIVE:')
  console.log(`- Listings (Domains): ${lCount}`)
  console.log(`- Bids:               ${bCount}`)
  console.log(`- Payments:           ${pCount}`)
  console.log(`- Visits:             ${vCount}`)
  console.log(`- Total Users:        ${uCount} (Admin only)`)
  console.log('=======================================\n')
}

main()
  .catch((e) => {
    console.error('Reset error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
