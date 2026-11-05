const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding DUKANRANT OUTBID domain leaderboard database...')

  // 1. Settings
  const settings = [
    { key: 'currency', value: 'INR' },
    { key: 'currency_symbol', value: '₹' },
    { key: 'top1_increment', value: '200' },
    { key: 'other_position_increment', value: '100' },
    { key: 'minimum_starting_bid', value: '500' },
    { key: 'maximum_bid', value: '10000000' },
    { key: 'payment_gateway', value: 'Razorpay' },
    { key: 'razorpay_key_id', value: 'rzp_test_dukanrant_inr' },
    { key: 'razorpay_key_secret', value: 'dukanrant_secret_key' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // 2. Admin & Demo Bidder
  const passwordHash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dukanrant.in' },
    update: {},
    create: {
      email: 'admin@dukanrant.in',
      name: 'DUKANRANT Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  const demoBidder = await prisma.user.upsert({
    where: { email: 'bidder@dukanrant.in' },
    update: {},
    create: {
      email: 'bidder@dukanrant.in',
      name: 'Demo Company Bidder',
      password: passwordHash,
      role: 'USER',
    },
  })

  // 3. Clear old data for a fresh, verified domain board
  await prisma.payment.deleteMany({})
  await prisma.bid.deleteMany({})
  await prisma.listing.deleteMany({})

  const domains = [
    {
      title: 'Zara India — High Fashion & Runway Trend Collections',
      domain: 'zara.in',
      websiteUrl: 'https://www.zara.com/in/',
      description: 'Explore runway-inspired fashion trends for women, men, and children with fast delivery across India.',
      category: 'Ecommerce & Retail',
      clicks: 412,
      currentBid: 5000,
      email: 'zara@brand.in',
      name: 'Zara India',
    },
    {
      title: 'H&M India — Modern Everyday Essentials & Conscious Fashion',
      domain: 'hm.com',
      websiteUrl: 'https://www2.hm.com/en_in/',
      description: 'Sustainable fashion, urban streetwear, and premium conscious daily apparel collections.',
      category: 'Ecommerce & Retail',
      clicks: 348,
      currentBid: 4900,
      email: 'hm@brand.in',
      name: 'H&M Urban',
    },
    {
      title: 'Puma India — Forever Faster Performance Sports & Footwear',
      domain: 'puma.in',
      websiteUrl: 'https://in.puma.com/',
      description: 'Engineered running shoes, nitro athletics, and performance training apparel designed for champions.',
      category: 'Health & Lifestyle',
      clicks: 295,
      currentBid: 4500,
      email: 'puma@brand.in',
      name: 'Puma Sports Hub',
    },
    {
      title: 'Titan — Luxury Precision Watches & Heritage Timepieces',
      domain: 'titan.co.in',
      websiteUrl: 'https://www.titan.co.in/',
      description: 'Master craftsmanship, luxury mechanical timepieces, and next-generation smart accessories.',
      category: 'Ecommerce & Retail',
      clicks: 240,
      currentBid: 4200,
      email: 'titan@brand.in',
      name: 'Titan Watches',
    },
    {
      title: 'FabIndia — Organic Living & Handcrafted Traditional Apparel',
      domain: 'fabindia.com',
      websiteUrl: 'https://www.fabindia.com/',
      description: 'Authentic Indian craft traditions, handloom silk kurta sets, and organic wellness home products.',
      category: 'Ecommerce & Retail',
      clicks: 198,
      currentBid: 3900,
      email: 'fabindia@brand.in',
      name: 'FabIndia Organics',
    },
    {
      title: 'boAt Lifestyle — India\'s Leading Wireless Audio Brand',
      domain: 'boat-lifestyle.com',
      websiteUrl: 'https://www.boat-lifestyle.com/',
      description: 'Bass-heavy wireless earbuds, noise-cancelling headphones, and smart wearable fitness bands.',
      category: 'Tech & AI',
      clicks: 184,
      currentBid: 3500,
      email: 'boat@brand.in',
      name: 'boAt Lifestyle',
    },
    {
      title: 'Lenskart — Smart Eyewear, Sunglasses & 3D Virtual Try-on',
      domain: 'lenskart.com',
      websiteUrl: 'https://www.lenskart.com/',
      description: 'Trendsetting optical frames, blue-cut computer lenses, and polarized sunglasses online.',
      category: 'Ecommerce & Retail',
      clicks: 156,
      currentBid: 3100,
      email: 'lenskart@brand.in',
      name: 'Lenskart Eyewear',
    },
    {
      title: 'Nykaa — Curated Premier Cosmetics & Luxury Skincare',
      domain: 'nykaa.com',
      websiteUrl: 'https://www.nykaa.com/',
      description: 'India\'s largest online beauty destination with authentic global makeup and skincare brands.',
      category: 'Health & Lifestyle',
      clicks: 142,
      currentBid: 2800,
      email: 'nykaa@brand.in',
      name: 'Nykaa Beauty',
    },
    {
      title: 'Zerodha — High-speed Discount Brokerage & Investing Platform',
      domain: 'zerodha.com',
      websiteUrl: 'https://zerodha.com/',
      description: 'Zero brokerage investments in stocks, bonds, direct mutual funds, and trading instruments.',
      category: 'Business & Finance',
      clicks: 129,
      currentBid: 2500,
      email: 'zerodha@brand.in',
      name: 'Zerodha Kite',
    },
    {
      title: 'Swiggy — On-demand Gourmet Delivery & 10-Minute Groceries',
      domain: 'swiggy.com',
      websiteUrl: 'https://www.swiggy.com/',
      description: 'Lightning-fast restaurant delivery, Instamart pantry essentials, and curated dining experiences.',
      category: 'Ecommerce & Retail',
      clicks: 114,
      currentBid: 2200,
      email: 'swiggy@brand.in',
      name: 'Swiggy India',
    },
    {
      title: 'Razorpay — Complete Payment Gateway & Financial Banking Suite',
      domain: 'razorpay.com',
      websiteUrl: 'https://razorpay.com/',
      description: 'Accept seamless UPI, card, and netbanking payments with 99.9% uptime for digital businesses.',
      category: 'Business & Finance',
      clicks: 98,
      currentBid: 1900,
      email: 'razorpay@brand.in',
      name: 'Razorpay Payments',
    },
    {
      title: 'Zomato — Discover Top Restaurants, Nightlife & Dining Reviews',
      domain: 'zomato.com',
      websiteUrl: 'https://www.zomato.com/',
      description: 'Find top dining places, menu prices, food reviews, and book table reservations instantly.',
      category: 'Ecommerce & Retail',
      clicks: 86,
      currentBid: 1600,
      email: 'zomato@brand.in',
      name: 'Zomato Food',
    },
  ]

  const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < domains.length; i++) {
    const item = domains[i]
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: { name: item.name },
      create: {
        email: item.email,
        name: item.name,
        password: passwordHash,
        role: 'USER',
      },
    })

    const listing = await prisma.listing.create({
      data: {
        title: item.title,
        domain: item.domain,
        websiteUrl: item.websiteUrl,
        description: item.description,
        category: item.category,
        clicks: item.clicks,
        startingBid: 500,
        currentBid: item.currentBid,
        currentBidderId: user.id,
        imageUrl: `https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`,
        status: 'ACTIVE',
        endsAt: oneYearLater,
        createdById: admin.id,
      },
    })

    // Create the active paid bid
    await prisma.bid.create({
      data: {
        amount: item.currentBid,
        status: 'PAID',
        position: i + 1,
        listingId: listing.id,
        userId: user.id,
        createdAt: new Date(Date.now() - (i + 1) * 3600000),
      },
    })
  }

  console.log('Seeding complete! Initialized outbids.lol style domain leaderboard with top brand domains.')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
