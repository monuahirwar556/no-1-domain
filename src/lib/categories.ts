export const CATEGORIES = [
  'All',
  'Fashion & Clothing',
  'Electronics & Gadgets',
  'Food Delivery & Dining',
  'Fintech & Banking',
  'Stock Trading & Investment',
  'Beauty & Personal Care',
  'Sports & Fitness',
  'Watches & Luxury',
  'Eyewear & Optical',
  'Ethnic & Handcrafted',
  'Ecommerce & Shopping',
  'Tech, AI & Software',
  'Travel, Flights & Hotels',
  'Real Estate & Property',
  'Automobile & EV',
  'Education & EdTech',
  'Healthcare & Pharmacy',
  'Media & Entertainment',
  'Marketing & SEO',
  'Gaming & Esports',
  'Crypto & Web3',
] as const

export type Category = (typeof CATEGORIES)[number]

interface CategoryRule {
  category: Exclude<Category, 'All'>
  domainKeywords: string[]
  contentKeywords: string[]
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Ecommerce & Shopping',
    domainKeywords: [
      'dukan', 'shop', 'store', 'cart', 'mart', 'bazaar', 'mandi', 'amazon',
      'flipkart', 'meesho', 'snapdeal', 'shopsy', 'jiomart', 'bigbasket', 'blinkit',
      'zepto', 'instamart', 'aliexpress', 'ebay', 'walmart', 'etsy', 'deal', 'mall',
      'retail', 'dropship', 'wholesale', 'buy', 'sell'
    ],
    contentKeywords: [
      'ecommerce', 'shopping', 'online shopping', 'add to cart', 'buy now', 'order online',
      'cash on delivery', 'free shipping', 'marketplace', 'storefront', 'products',
      'discounts', 'supermarket', 'groceries', 'b2b marketplace', 'retailer'
    ],
  },
  {
    category: 'Fashion & Clothing',
    domainKeywords: [
      'myntra', 'ajio', 'zara', 'hm', 'snitch', 'bewakoof', 'urbanic', 'pantaloons',
      'westside', 'manyavar', 'fashion', 'clothing', 'apparel', 'wear', 'dress', 'saree',
      'kurti', 'lehenga', 'jeans', 'shirt', 'outfit', 'boutique', 'footwear', 'sneaker'
    ],
    contentKeywords: [
      'fashion', 'clothing', 'apparel', 'menswear', 'womenswear', 'dresses', 'kurtis',
      'sarees', 'lehengas', 't-shirts', 'jeans', 'wardrobe', 'footwear', 'shoes',
      'sneakers', 'designer wear', 'streetwear', 'ethnic wear'
    ],
  },
  {
    category: 'Food Delivery & Dining',
    domainKeywords: [
      'zomato', 'swiggy', 'dominos', 'pizzahut', 'mcdonalds', 'kfc', 'burgerking',
      'starbucks', 'haldiram', 'faasos', 'behrouz', 'eatsure', 'food', 'dining',
      'kitchen', 'cafe', 'pizza', 'burger', 'bakery', 'restaurant', 'meal', 'dine'
    ],
    contentKeywords: [
      'food delivery', 'order food', 'restaurants', 'menu', 'dining', 'takeaway',
      'dishes', 'biryani', 'pizza', 'burger', 'bakery', 'sweets', 'desserts', 'kitchen',
      'meals', 'tiffin', 'recipes'
    ],
  },
  {
    category: 'Fintech & Banking',
    domainKeywords: [
      'paytm', 'phonepe', 'gpay', 'razorpay', 'cred', 'cashfree', 'hdfc', 'sbi',
      'icici', 'axis', 'kotak', 'bajaj', 'policybazaar', 'navi', 'slice', 'jupiter',
      'fi money', 'bank', 'banking', 'fintech', 'payment', 'wallet', 'loan', 'credit',
      'insurance', 'policy', 'recharge'
    ],
    contentKeywords: [
      'fintech', 'banking', 'upi payment', 'personal loan', 'home loan', 'credit card',
      'debit card', 'insurance policy', 'money transfer', 'emi', 'fastag', 'bill payment',
      'instant loan', 'p2p lending'
    ],
  },
  {
    category: 'Stock Trading & Investment',
    domainKeywords: [
      'zerodha', 'groww', 'angelone', 'upstox', 'motilal', 'icicidirect', '5paisa',
      'dhan', 'smallcase', 'kuvera', 'stock', 'stocks', 'trading', 'invest', 'shares',
      'equity', 'demat', 'mutualfund', 'broker'
    ],
    contentKeywords: [
      'stock market', 'trading platform', 'demat account', 'investing', 'mutual funds',
      'equity shares', 'nifty', 'sensex', 'ipo', 'options trading', 'futures and options',
      'portfolio management', 'share market'
    ],
  },
  {
    category: 'Beauty & Personal Care',
    domainKeywords: [
      'nykaa', 'purplle', 'mamaearth', 'sugar', 'mcaffeine', 'wowskin', 'plum',
      'kaybeauty', 'lakme', 'loreal', 'maybelline', 'dotandkey', 'minimalist',
      'beauty', 'cosmetic', 'makeup', 'skincare', 'haircare', 'salon', 'glow', 'perfume'
    ],
    contentKeywords: [
      'beauty products', 'cosmetics', 'makeup', 'skincare', 'hair care', 'serum',
      'lipstick', 'fragrance', 'perfume', 'shampoo', 'sunscreen', 'moisturizer',
      'dermatologist', 'salon treatment', 'anti-aging'
    ],
  },
  {
    category: 'Electronics & Gadgets',
    domainKeywords: [
      'boat', 'noise', 'boult', 'fireboltt', 'apple', 'samsung', 'oneplus', 'xiaomi',
      'realme', 'croma', 'reliancedigital', 'vijaysales', 'gadget', 'electronic',
      'mobile', 'phone', 'laptop', 'audio', 'headphone', 'earbud'
    ],
    contentKeywords: [
      'electronics', 'gadgets', 'smartphones', 'mobile phones', 'laptops', 'headphones',
      'earbuds', 'smartwatches', 'televisions', 'home appliances', 'chargers', 'speakers'
    ],
  },
  {
    category: 'Real Estate & Property',
    domainKeywords: [
      'magicbricks', '99acres', 'housing', 'nobroker', 'squareyards', 'commonfloor',
      'property', 'realestate', 'realty', 'plot', 'villa', 'apartment', 'flat', 'rentproperty'
    ],
    contentKeywords: [
      'real estate', 'buy property', 'flats for sale', 'apartments for rent',
      'commercial property', 'residential property', 'plots for sale', 'pg rental',
      'properties in india', 'builders and developers'
    ],
  },
  {
    category: 'Travel, Flights & Hotels',
    domainKeywords: [
      'makemytrip', 'goibibo', 'yatra', 'easemytrip', 'irctc', 'cleartrip', 'booking',
      'agoda', 'airbnb', 'oyo', 'trivago', 'travel', 'flight', 'hotel', 'tour', 'holiday',
      'vacation', 'resort', 'airline'
    ],
    contentKeywords: [
      'flight tickets', 'hotel booking', 'holiday packages', 'vacation packages',
      'travel agency', 'tour packages', 'resorts', 'train tickets', 'bus booking'
    ],
  },
  {
    category: 'Automobile & EV',
    domainKeywords: [
      'carwale', 'bikewale', 'cardekho', 'bikedekho', 'spinny', 'cars24', 'tatamotors',
      'maruti', 'hyundai', 'mahindra', 'olaelectric', 'ather', 'royalenfield', 'car',
      'bike', 'automobile', 'vehicle', 'ev', 'motors'
    ],
    contentKeywords: [
      'cars in india', 'bikes', 'electric vehicle', 'ev scooter', 'second hand cars',
      'used cars', 'automobile dealership', 'test drive', 'car insurance'
    ],
  },
  {
    category: 'Education & EdTech',
    domainKeywords: [
      'unacademy', 'byjus', 'physicswallah', 'vedantu', 'coursera', 'udemy', 'simplilearn',
      'upgrad', 'geeksforgeeks', 'education', 'edtech', 'academy', 'classes', 'coaching',
      'course', 'school', 'college', 'exam'
    ],
    contentKeywords: [
      'online courses', 'education', 'study materials', 'exam preparation', 'tuition classes',
      'learning app', 'certifications', 'neet coaching', 'jee preparation', 'upsc prep'
    ],
  },
  {
    category: 'Healthcare & Pharmacy',
    domainKeywords: [
      'pharmeasy', '1mg', 'netmeds', 'apollo', 'medplus', 'practo', 'mfine', 'health',
      'pharma', 'pharmacy', 'medicine', 'hospital', 'clinic', 'doctor'
    ],
    contentKeywords: [
      'online pharmacy', 'medicines online', 'consult doctor', 'lab tests', 'health checkup',
      'prescription medicines', 'hospital care', 'teleconsultation', 'wellness products'
    ],
  },
  {
    category: 'Sports & Fitness',
    domainKeywords: [
      'decathlon', 'cultfit', 'muscleblaze', 'myprotein', 'healthkart', 'nike', 'adidas',
      'puma', 'reebok', 'fitness', 'gym', 'sports', 'workout'
    ],
    contentKeywords: [
      'gym workout', 'fitness equipment', 'whey protein', 'nutrition supplements',
      'sportswear', 'cricket equipment', 'sports gear', 'yoga classes'
    ],
  },
  {
    category: 'Watches & Luxury',
    domainKeywords: [
      'titan', 'fastrack', 'fossil', 'rolex', 'tagheuer', 'ethos', 'casio', 'tissot',
      'watch', 'luxury', 'timepiece', 'chronograph'
    ],
    contentKeywords: [
      'luxury watches', 'analog watches', 'smart watches', 'timepieces', 'jewellery',
      'diamonds', 'swiss watches'
    ],
  },
  {
    category: 'Eyewear & Optical',
    domainKeywords: [
      'lenskart', 'titaneyeplus', 'coolwinks', 'rayban', 'specsmakers', 'eyewear',
      'optical', 'specs', 'glasses'
    ],
    contentKeywords: [
      'eyeglasses', 'sunglasses', 'contact lenses', 'optical frames', 'power glasses',
      'blue cut glasses', 'spectacles'
    ],
  },
  {
    category: 'Ethnic & Handcrafted',
    domainKeywords: [
      'fabindia', 'manyavar', 'jaypore', 'khadi', 'itokri', 'craftsvilla', 'ethnic',
      'handcraft', 'handloom', 'artisan'
    ],
    contentKeywords: [
      'ethnic wear', 'handcrafted products', 'handloom textiles', 'traditional artisans',
      'khadi products', 'handicrafts'
    ],
  },
  {
    category: 'Tech, AI & Software',
    domainKeywords: [
      'github', 'openai', 'chatgpt', 'vercel', 'hostinger', 'godaddy', 'zoho',
      'freshworks', 'tech', 'software', 'saas', 'cloud', 'ai', 'developer', 'api', 'code'
    ],
    contentKeywords: [
      'software development', 'artificial intelligence', 'ai tools', 'cloud computing',
      'saas application', 'api platform', 'coding tools', 'web development'
    ],
  },
  {
    category: 'Media & Entertainment',
    domainKeywords: [
      'youtube', 'netflix', 'spotify', 'hotstar', 'jiocinema', 'zee5', 'sonyliv',
      'primevideo', 'ndtv', 'aajtak', 'timesofindia', 'media', 'news', 'cinema',
      'movie', 'music', 'video', 'podcast'
    ],
    contentKeywords: [
      'watch movies', 'streaming video', 'music streaming', 'latest news', 'entertainment',
      'web series', 'tv shows', 'podcasts', 'video player'
    ],
  },
  {
    category: 'Marketing & SEO',
    domainKeywords: [
      'semrush', 'ahrefs', 'hubspot', 'canva', 'hootsuite', 'mailchimp', 'marketing',
      'seo', 'agency', 'advertise', 'branding'
    ],
    contentKeywords: [
      'digital marketing', 'search engine optimization', 'seo tools', 'social media ads',
      'advertising agency', 'lead generation', 'branding services'
    ],
  },
  {
    category: 'Gaming & Esports',
    domainKeywords: [
      'steam', 'epicgames', 'riotgames', 'playstation', 'xbox', 'bgmi', 'pubg',
      'freefire', 'roblox', 'ign', 'game', 'gaming', 'esports'
    ],
    contentKeywords: [
      'pc games', 'mobile games', 'esports tournaments', 'gameplay streaming',
      'video gaming', 'multiplayer gaming'
    ],
  },
  {
    category: 'Crypto & Web3',
    domainKeywords: [
      'binance', 'wazirx', 'coindcx', 'coinbase', 'metamask', 'polygon', 'solana',
      'opensea', 'crypto', 'web3', 'blockchain', 'nft', 'token'
    ],
    contentKeywords: [
      'cryptocurrency', 'bitcoin', 'ethereum', 'web3 wallet', 'blockchain network',
      'nft marketplace', 'defi finance'
    ],
  },
]

/**
 * Intelligent automatic website category detector.
 * Evaluates domain name, page title, meta description, and keywords
 * to choose the best matching category.
 */
export function detectWebsiteCategory(
  urlOrDomain: string,
  title?: string,
  description?: string,
  keywords?: string
): Exclude<Category, 'All'> {
  if (!urlOrDomain) return 'Ecommerce & Shopping'

  // Clean and normalize input text
  const cleanDomain = urlOrDomain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .replace(/[^a-z0-9]/g, '')

  const fullText = `${urlOrDomain} ${title || ''} ${description || ''} ${keywords || ''}`.toLowerCase()

  let bestCategory: Exclude<Category, 'All'> = 'Ecommerce & Shopping'
  let highestScore = 0

  for (const rule of CATEGORY_RULES) {
    let score = 0

    // 1. High-priority Domain keyword match (weight: 15 points)
    for (const kw of rule.domainKeywords) {
      const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (cleanDomain.includes(cleanKw)) {
        score += 15
        // Exact prefix or full brand match gets extra bonus
        if (cleanDomain.startsWith(cleanKw) || cleanDomain.endsWith(cleanKw)) {
          score += 10
        }
      }
    }

    // 2. Medium-priority Title / Content keyword matches (weight: 5 points each)
    for (const kw of rule.contentKeywords) {
      if (fullText.includes(kw.toLowerCase())) {
        score += 5
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestCategory = rule.category
    }
  }

  // Fallback default: if domain specifically has 'dukan', 'shop', 'store', 'cart', 'mart'
  if (
    cleanDomain.includes('dukan') ||
    cleanDomain.includes('shop') ||
    cleanDomain.includes('store') ||
    cleanDomain.includes('mart') ||
    cleanDomain.includes('bazaar') ||
    cleanDomain.includes('cart')
  ) {
    return 'Ecommerce & Shopping'
  }

  return bestCategory
}

