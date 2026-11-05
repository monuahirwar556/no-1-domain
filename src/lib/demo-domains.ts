/**
 * NO. 1 DOMAIN - Real Live Websites Showcase By Category
 * 100% active, verified live websites on the internet.
 * Bids scale in strict steps of ₹50:
 * - In "All", geeksforgeeks.org is #1 at ₹1,000 (next outbid on All is ₹1,050).
 * - The top 20 showcase domains step down cleanly: 1000, 950, 900, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100, 50!
 * - In Beauty & Personal Care, purplle.com is #1 at ₹450 (next outbid is ₹500).
 * - When someone adds at ₹500 in Beauty & Personal Care, they become #1 (Fast 1) in that category!
 * - On "All", whoever gave the highest overall (₹1,000 / ₹1,050) stays #1!
 */

export interface DemoDomainData {
  title: string
  domain: string
  websiteUrl: string
  category: string
  rank: number
  tier: number
  clicks: number
  description: string
  status: 'ACTIVE'
  imageUrl: string
}

export const MAIN_SHOWCASE_DOMAINS: DemoDomainData[] = [
  // ==========================================
  // TOP 20 SHOWCASE DOMAINS (1000 down to 50 in steps of 50)
  // ==========================================

  // #1 - ₹1,050 - Ecommerce & Retail (Rank 1 overall on "All", next outbid = ₹1,100)
  {
    title: 'amazon.in',
    domain: 'amazon.in',
    websiteUrl: 'https://www.amazon.in',
    category: 'Ecommerce & Retail',
    rank: 1,
    tier: 1050,
    clicks: 712,
    description: "India's premier online marketplace for electronics, fashion, groceries, home appliances, and daily essentials.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.in&size=128',
  },

  // #2 - ₹1,000 - Tech, AI & Software (next outbid = ₹1,050)
  {
    title: 'geeksforgeeks.org',
    domain: 'geeksforgeeks.org',
    websiteUrl: 'https://www.geeksforgeeks.org',
    category: 'Tech, AI & Software',
    rank: 1,
    tier: 1000,
    clicks: 662,
    description: 'A computer science portal for geeks featuring coding tutorials, algorithms, and technical interview prep.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://geeksforgeeks.org&size=128',
  },

  // #3 - ₹950 - Education & EdTech (next outbid = ₹1,000)
  {
    title: 'internshala.com',
    domain: 'internshala.com',
    websiteUrl: 'https://internshala.com',
    category: 'Education & EdTech',
    rank: 1,
    tier: 950,
    clicks: 618,
    description: "India's largest internship and online training platform connecting students with thousands of companies.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://internshala.com&size=128',
  },

  // #4 - ₹900 - Education & EdTech
  {
    title: 'unstop.com',
    domain: 'unstop.com',
    websiteUrl: 'https://unstop.com',
    category: 'Education & EdTech',
    rank: 2,
    tier: 900,
    clicks: 574,
    description: 'Early talent discovery engagement and hiring platform for hackathons, business competitions, and quizzes.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://unstop.com&size=128',
  },

  // #5 - ₹800 - Media & Entertainment (Rank 1 in Media, next outbid = ₹850)
  {
    title: 'trak.in',
    domain: 'trak.in',
    websiteUrl: 'https://trak.in',
    category: 'Media & Entertainment',
    rank: 1,
    tier: 800,
    clicks: 500,
    description: 'Daily Indian tech buzz, smartphone launches, business trends, telecom developments, and consumer tech.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://trak.in&size=128',
  },

  // #6 - ₹750 - Fintech & Banking (Rank 1 in Fintech, next outbid = ₹800)
  {
    title: 'cred.club',
    domain: 'cred.club',
    websiteUrl: 'https://cred.club',
    category: 'Fintech & Banking',
    rank: 1,
    tier: 750,
    clicks: 471,
    description: 'Members-only club that rewards individuals for timely credit card bill payments with exclusive brand perks.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cred.club&size=128',
  },

  // #7 - ₹700 - Stock Trading & Investment (Rank 1 in Stock Trading, next outbid = ₹750)
  {
    title: 'groww.in',
    domain: 'groww.in',
    websiteUrl: 'https://groww.in',
    category: 'Stock Trading & Investment',
    rank: 1,
    tier: 700,
    clicks: 456,
    description: 'Fast-growing financial services platform for direct mutual funds, NSE & BSE stock trading, IPOs, and SIPs.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://groww.in&size=128',
  },

  // #8 - ₹650 - Marketing & SEO
  {
    title: 'socialsamosa.com',
    domain: 'socialsamosa.com',
    websiteUrl: 'https://www.socialsamosa.com',
    category: 'Marketing & SEO',
    rank: 2,
    tier: 650,
    clicks: 427,
    description: 'Knowledge portal covering social media marketing trends, Indian ad campaigns, agency news, and brand strategy.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://socialsamosa.com&size=128',
  },

  // #9 - ₹600 - Media & Entertainment
  {
    title: 'officechai.com',
    domain: 'officechai.com',
    websiteUrl: 'https://officechai.com',
    category: 'Media & Entertainment',
    rank: 2,
    tier: 600,
    clicks: 404,
    description: 'Stories and witty commentary on Indian startup hustle, workplace culture, venture funding, and founders.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://officechai.com&size=128',
  },

  // #10 - ₹550 - Marketing & SEO
  {
    title: 'medianama.com',
    domain: 'medianama.com',
    websiteUrl: 'https://www.medianama.com',
    category: 'Marketing & SEO',
    rank: 3,
    tier: 550,
    clicks: 382,
    description: 'Authoritative analysis of Indian technology policy, internet regulations, data privacy, and telecom laws.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://medianama.com&size=128',
  },

  // #11 - ₹500 - Tech, AI & Software
  {
    title: 'nextbigwhat.com',
    domain: 'nextbigwhat.com',
    websiteUrl: 'https://nextbigwhat.com',
    category: 'Tech, AI & Software',
    rank: 2,
    tier: 500,
    clicks: 360,
    description: 'Curated intelligence and community for product managers, AI founders, tech innovators, and startup growth.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nextbigwhat.com&size=128',
  },

  // #12 - ₹450 - Beauty & Personal Care (Rank 1 in Beauty! Next outbid = ₹500!)
  {
    title: 'purplle.com',
    domain: 'purplle.com',
    websiteUrl: 'https://www.purplle.com',
    category: 'Beauty & Personal Care',
    rank: 1,
    tier: 450,
    clicks: 338,
    description: "India's premier online beauty, cosmetics, fragrance and personal care shopping destination.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://purplle.com&size=128',
  },

  // #13 - ₹400 - Ecommerce & Shopping (Rank 1 in Ecommerce, next outbid = ₹450)
  {
    title: 'instamojo.com',
    domain: 'instamojo.com',
    websiteUrl: 'https://www.instamojo.com',
    category: 'Ecommerce & Shopping',
    rank: 1,
    tier: 400,
    clicks: 316,
    description: 'All-in-one D2C ecommerce platform empowering Indian small businesses to launch web stores and collect payments.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://instamojo.com&size=128',
  },

  // #14 - ₹350 - Media & Entertainment
  {
    title: 'dailyhunt.in',
    domain: 'dailyhunt.in',
    websiteUrl: 'https://m.dailyhunt.in',
    category: 'Media & Entertainment',
    rank: 3,
    tier: 350,
    clicks: 294,
    description: 'Leading vernacular news aggregator presenting hyper-local stories in 14+ regional Indian languages.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://dailyhunt.in&size=128',
  },

  // #15 - ₹300 - Fashion & Clothing (Rank 1 in Fashion, next outbid = ₹350)
  {
    title: 'snitch.co.in',
    domain: 'snitch.co.in',
    websiteUrl: 'https://www.snitch.co.in',
    category: 'Fashion & Clothing',
    rank: 1,
    tier: 300,
    clicks: 272,
    description: 'Fast-fashion menswear brand delivering modern street style, shirts, trousers, and co-ords for youth.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://snitch.co.in&size=128',
  },

  // #16 - ₹250 - Food Delivery & Dining (Rank 1 in Food Delivery, next outbid = ₹300)
  {
    title: 'magicpin.in',
    domain: 'magicpin.in',
    websiteUrl: 'https://magicpin.in',
    category: 'Food Delivery & Dining',
    rank: 1,
    tier: 250,
    clicks: 250,
    description: 'Hyperlocal discovery and savings platform for restaurants, cafes, fashion retail, and daily grocery.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://magicpin.in&size=128',
  },

  // #17 - ₹200 - Electronics & Gadgets (Rank 1 in Electronics, next outbid = ₹250)
  {
    title: 'boat-lifestyle.com',
    domain: 'boat-lifestyle.com',
    websiteUrl: 'https://www.boat-lifestyle.com',
    category: 'Electronics & Gadgets',
    rank: 1,
    tier: 200,
    clicks: 228,
    description: "India's leading consumer audio & wearables brand with smartwatches, TWS earbuds, and Bluetooth speakers.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://boat-lifestyle.com&size=128',
  },

  // #18 - ₹150 - Sports & Fitness (Rank 1 in Sports, next outbid = ₹200)
  {
    title: 'cult.fit',
    domain: 'cult.fit',
    websiteUrl: 'https://www.cult.fit',
    category: 'Sports & Fitness',
    rank: 1,
    tier: 150,
    clicks: 206,
    description: 'Holistic health and fitness ecosystem offering gym memberships, group fitness workouts, and sporting gear.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cult.fit&size=128',
  },

  // #19 - ₹100 - Healthcare & Pharmacy (Rank 1 in Healthcare, next outbid = ₹150)
  {
    title: '1mg.com',
    domain: '1mg.com',
    websiteUrl: 'https://www.1mg.com',
    category: 'Healthcare & Pharmacy',
    rank: 1,
    tier: 100,
    clicks: 184,
    description: 'Trusted online healthcare and digital pharma platform providing genuine medicines and lab tests at home.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://1mg.com&size=128',
  },

  // #20 - ₹50 - Media & Entertainment (Rank 5 in Media, next outbid = ₹100)
  {
    title: 'x.com',
    domain: 'x.com',
    websiteUrl: 'https://x.com',
    category: 'Media & Entertainment',
    rank: 5,
    tier: 50,
    clicks: 162,
    description: 'The global digital town square for breaking news, live real-time conversations, and trending community topics.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://x.com&size=128',
  },
]

export const CATEGORY_SUPPLEMENTARY_DOMAINS: DemoDomainData[] = [
  // ==========================================
  // SUPPLEMENTARY CATEGORY DOMAINS (for category-specific tabs)
  // ==========================================

  // --- Beauty & Personal Care (Rank 2, 3, 4) ---
  {
    title: 'mamaearth.in',
    domain: 'mamaearth.in',
    websiteUrl: 'https://mamaearth.in',
    category: 'Beauty & Personal Care',
    rank: 2,
    tier: 350,
    clicks: 190,
    description: 'Toxin-free, natural skincare, haircare, babycare and daily personal wellness products made with goodness of nature.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mamaearth.in&size=128',
  },
  {
    title: 'sugarcosmetics.com',
    domain: 'sugarcosmetics.com',
    websiteUrl: 'https://sugarcosmetics.com',
    category: 'Beauty & Personal Care',
    rank: 3,
    tier: 250,
    clicks: 160,
    description: 'High-performance, cruelty-free Indian cosmetics, lipsticks, and beauty essentials built for Indian skin tones.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://sugarcosmetics.com&size=128',
  },
  {
    title: 'plumgoodness.com',
    domain: 'plumgoodness.com',
    websiteUrl: 'https://plumgoodness.com',
    category: 'Beauty & Personal Care',
    rank: 4,
    tier: 150,
    clicks: 130,
    description: '100% vegan, clean beauty and science-backed personal care products with zero toxic chemicals.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://plumgoodness.com&size=128',
  },

  // --- Fashion & Clothing (Rank 2, 3) ---
  {
    title: 'bewakoof.com',
    domain: 'bewakoof.com',
    websiteUrl: 'https://www.bewakoof.com',
    category: 'Fashion & Clothing',
    rank: 2,
    tier: 200,
    clicks: 150,
    description: 'Quirky casual wear, printed graphic t-shirts, joggers, and modern lifestyle fashion for millennial youth.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://bewakoof.com&size=128',
  },
  {
    title: 'ajio.com',
    domain: 'ajio.com',
    websiteUrl: 'https://www.ajio.com',
    category: 'Fashion & Clothing',
    rank: 3,
    tier: 100,
    clicks: 120,
    description: 'Digital fashion and lifestyle platform curated by Reliance Retail with national and international brands.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ajio.com&size=128',
  },

  // --- Electronics & Gadgets (Rank 2) ---
  {
    title: 'gonoise.com',
    domain: 'gonoise.com',
    websiteUrl: 'https://www.gonoise.com',
    category: 'Electronics & Gadgets',
    rank: 2,
    tier: 150,
    clicks: 135,
    description: 'Connected consumer electronics brand offering smart wearables, wireless earphones, and tech accessories.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://gonoise.com&size=128',
  },

  // --- Food Delivery & Dining (Rank 2) ---
  {
    title: 'eatsure.com',
    domain: 'eatsure.com',
    websiteUrl: 'https://www.eatsure.com',
    category: 'Food Delivery & Dining',
    rank: 2,
    tier: 150,
    clicks: 120,
    description: 'Digital food court app allowing customers to order from multiple trusted cloud kitchen brands in a single order.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://eatsure.com&size=128',
  },

  // --- Fintech & Banking (Rank 2) ---
  {
    title: 'razorpay.com',
    domain: 'razorpay.com',
    websiteUrl: 'https://razorpay.com',
    category: 'Fintech & Banking',
    rank: 2,
    tier: 350,
    clicks: 180,
    description: 'Full-stack payments and financial solutions provider for businesses in India accepting cards, UPI, and netbanking.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://razorpay.com&size=128',
  },

  // --- Stock Trading & Investment (Rank 2) ---
  {
    title: 'zerodha.com',
    domain: 'zerodha.com',
    websiteUrl: 'https://zerodha.com',
    category: 'Stock Trading & Investment',
    rank: 2,
    tier: 350,
    clicks: 195,
    description: "India's largest discount retail broker pioneering zero-brokerage equity investments and Kite trading platform.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://zerodha.com&size=128',
  },

  // --- Sports & Fitness (Rank 2) ---
  {
    title: 'decathlon.in',
    domain: 'decathlon.in',
    websiteUrl: 'https://www.decathlon.in',
    category: 'Sports & Fitness',
    rank: 2,
    tier: 100,
    clicks: 110,
    description: 'Largest sporting goods retailer offering athletic gear, apparel, footwear, and equipment across 70+ sports.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://decathlon.in&size=128',
  },

  // --- Healthcare & Pharmacy (Rank 2) ---
  {
    title: 'pharmeasy.in',
    domain: 'pharmeasy.in',
    websiteUrl: 'https://pharmeasy.in',
    category: 'Healthcare & Pharmacy',
    rank: 2,
    tier: 50,
    clicks: 95,
    description: 'Consumer healthcare app for ordering diagnostic tests, prescription medicines, and healthcare essentials.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://pharmeasy.in&size=128',
  },

  // --- Travel, Flights & Hotels (Rank 1 & 2) ---
  {
    title: 'easemytrip.com',
    domain: 'easemytrip.com',
    websiteUrl: 'https://www.easemytrip.com',
    category: 'Travel, Flights & Hotels',
    rank: 1,
    tier: 50,
    clicks: 110,
    description: 'Zero-convenience-fee online flight booking, luxury hotel reservations, and custom holiday tour packages.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://easemytrip.com&size=128',
  },
  {
    title: 'ixigo.com',
    domain: 'ixigo.com',
    websiteUrl: 'https://www.ixigo.com',
    category: 'Travel, Flights & Hotels',
    rank: 2,
    tier: 50,
    clicks: 90,
    description: 'AI-based travel app for train ticket bookings, PNR status, flight comparisons, and bus tickets across India.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ixigo.com&size=128',
  },

  // --- Tech, AI & Software (Rank 3, 4) ---
  {
    title: 'hashnode.com',
    domain: 'hashnode.com',
    websiteUrl: 'https://hashnode.com',
    category: 'Tech, AI & Software',
    rank: 3,
    tier: 300,
    clicks: 170,
    description: 'Developer blogging platform powering custom engineering blogs, technical writing, and open knowledge sharing.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hashnode.com&size=128',
  },
  {
    title: 'daily.dev',
    domain: 'daily.dev',
    websiteUrl: 'https://daily.dev',
    category: 'Tech, AI & Software',
    rank: 4,
    tier: 200,
    clicks: 140,
    description: 'Developer news feed and curated technical insights from engineering blogs across the globe.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://daily.dev&size=128',
  },

  // --- Education & EdTech (Rank 3) ---
  {
    title: 'freecodecamp.org',
    domain: 'freecodecamp.org',
    websiteUrl: 'https://www.freecodecamp.org',
    category: 'Education & EdTech',
    rank: 3,
    tier: 250,
    clicks: 160,
    description: 'World-renowned open-source coding community offering free verified developer certifications and courses.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://freecodecamp.org&size=128',
  },

  // --- Media & Entertainment (Rank 4) ---
  {
    title: 'scoopwhoop.com',
    domain: 'scoopwhoop.com',
    websiteUrl: 'https://www.scoopwhoop.com',
    category: 'Media & Entertainment',
    rank: 4,
    tier: 200,
    clicks: 130,
    description: 'Youth-centric digital media publisher delivering viral culture, travel discoveries, entertainment, and opinions.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://scoopwhoop.com&size=128',
  },

  // --- Real Estate & Property (#1 and #2) ---
  {
    title: 'housing.com',
    domain: 'housing.com',
    websiteUrl: 'https://housing.com',
    category: 'Real Estate & Property',
    rank: 1,
    tier: 150,
    clicks: 130,
    description: 'PropTech platform offering verified real estate listings for buying, renting, and new home developments in India.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://housing.com&size=128',
  },
  {
    title: 'nobroker.in',
    domain: 'nobroker.in',
    websiteUrl: 'https://www.nobroker.in',
    category: 'Real Estate & Property',
    rank: 2,
    tier: 100,
    clicks: 105,
    description: 'Zero-brokerage real estate portal connecting property owners and tenants directly without intermediaries.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nobroker.in&size=128',
  },

  // --- Automobile & EV (#1 and #2) ---
  {
    title: 'cardekho.com',
    domain: 'cardekho.com',
    websiteUrl: 'https://www.cardekho.com',
    category: 'Automobile & EV',
    rank: 1,
    tier: 150,
    clicks: 125,
    description: "India's leading car search venture helping consumers buy cars that are right for them with expert reviews.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cardekho.com&size=128',
  },
  {
    title: 'bikewale.com',
    domain: 'bikewale.com',
    websiteUrl: 'https://www.bikewale.com',
    category: 'Automobile & EV',
    rank: 2,
    tier: 100,
    clicks: 95,
    description: 'Two-wheeler portal in India offering on-road bike prices, scooter comparisons, mileage reviews, and EV specs.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://bikewale.com&size=128',
  },

  // --- Eyewear & Optical (#1 and #2) ---
  {
    title: 'lenskart.com',
    domain: 'lenskart.com',
    websiteUrl: 'https://www.lenskart.com',
    category: 'Eyewear & Optical',
    rank: 1,
    tier: 200,
    clicks: 140,
    description: 'Omnichannel eyewear retailer offering prescription eyeglasses, polarized sunglasses, and contact lenses.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://lenskart.com&size=128',
  },
  {
    title: 'john-jacobs.com',
    domain: 'john-jacobs.com',
    websiteUrl: 'https://www.john-jacobs.com',
    category: 'Eyewear & Optical',
    rank: 2,
    tier: 100,
    clicks: 90,
    description: 'Premium handcrafted eyewear crafted with Italian acetate and titanium for discerning modern professionals.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://john-jacobs.com&size=128',
  },

  // --- Watches & Luxury (#1 and #2) ---
  {
    title: 'titan.co.in',
    domain: 'titan.co.in',
    websiteUrl: 'https://www.titan.co.in',
    category: 'Watches & Luxury',
    rank: 1,
    tier: 200,
    clicks: 145,
    description: "India's iconic watchmaker providing precision timepieces, Edge ultra-slim watches, and smart wearables.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://titan.co.in&size=128',
  },
  {
    title: 'fastrack.in',
    domain: 'fastrack.in',
    websiteUrl: 'https://www.fastrack.in',
    category: 'Watches & Luxury',
    rank: 2,
    tier: 100,
    clicks: 95,
    description: 'Youth lifestyle accessories brand showcasing stylish analog watches, reflex smartbands, and streetwear gear.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fastrack.in&size=128',
  },

  // --- Ethnic & Handcrafted (#1 and #2) ---
  {
    title: 'fabindia.com',
    domain: 'fabindia.com',
    websiteUrl: 'https://www.fabindia.com',
    category: 'Ethnic & Handcrafted',
    rank: 1,
    tier: 150,
    clicks: 130,
    description: 'Artisanal retail brand celebrating Indian heritage with handwoven ethnic garments, home linen, and organic foods.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fabindia.com&size=128',
  },
  {
    title: 'jaypore.com',
    domain: 'jaypore.com',
    websiteUrl: 'https://www.jaypore.com',
    category: 'Ethnic & Handcrafted',
    rank: 2,
    tier: 100,
    clicks: 90,
    description: 'Curated platform celebrating artisanal South Asian craft, silver jewelry, heritage handlooms, and traditional art.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://jaypore.com&size=128',
  },

  // --- Gaming & Esports (#1 and #2) ---
  {
    title: 'loco.gg',
    domain: 'loco.gg',
    websiteUrl: 'https://loco.gg',
    category: 'Gaming & Esports',
    rank: 1,
    tier: 100,
    clicks: 110,
    description: 'Leading game streaming and esports live broadcast platform featuring India’s top BGMI and Free Fire streamers.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://loco.gg&size=128',
  },
  {
    title: 'nodwingaming.com',
    domain: 'nodwingaming.com',
    websiteUrl: 'https://nodwingaming.com',
    category: 'Gaming & Esports',
    rank: 2,
    tier: 50,
    clicks: 85,
    description: 'South Asia’s premier esports enterprise producing championship tournaments, collegiate leagues, and gaming festivals.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nodwingaming.com&size=128',
  },

  // --- Crypto & Web3 (#1 and #2) ---
  {
    title: 'wazirx.com',
    domain: 'wazirx.com',
    websiteUrl: 'https://wazirx.com',
    category: 'Crypto & Web3',
    rank: 1,
    tier: 100,
    clicks: 115,
    description: "India's prominent digital assets exchange with auto-matching P2P engine and multi-coin trading pairs.",
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://wazirx.com&size=128',
  },
  {
    title: 'coindcx.com',
    domain: 'coindcx.com',
    websiteUrl: 'https://coindcx.com',
    category: 'Crypto & Web3',
    rank: 2,
    tier: 50,
    clicks: 85,
    description: 'India’s crypto unicorn exchange with deep liquidity, institutional-grade security, and simple crypto SIPs.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://coindcx.com&size=128',
  },

  // --- Ecommerce & Shopping (Rank 2) ---
  {
    title: 'meesho.com',
    domain: 'meesho.com',
    websiteUrl: 'https://www.meesho.com',
    category: 'Ecommerce & Shopping',
    rank: 2,
    tier: 250,
    clicks: 160,
    description: 'Social commerce marketplace empowering micro-entrepreneurs and consumers with wholesale-priced fashion and home goods.',
    status: 'ACTIVE',
    imageUrl: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://meesho.com&size=128',
  },
]

export const DEMO_SHOWCASE_DOMAINS: DemoDomainData[] = [
  ...MAIN_SHOWCASE_DOMAINS,
  ...CATEGORY_SUPPLEMENTARY_DOMAINS,
]

export function syncDummyDomainsWithRealCount(realCount?: number) {
  return DEMO_SHOWCASE_DOMAINS
}
