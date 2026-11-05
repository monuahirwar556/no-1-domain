const fs = require('fs');

async function testFetch(handle) {
  console.log(`\n--- Testing handle: ${handle} ---`);
  
  // Strategy 1: facebookexternalhit
  try {
    const res = await fetch(`https://www.instagram.com/${handle}/`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    console.log('Strategy 1 status:', res.status, 'final url:', res.url);
    const html = await res.text();
    const isLogin = res.url.includes('/accounts/login') || html.includes('login_page');
    console.log('Is login redirect?', isLogin);
    
    // Look for og:image
    const ogImg = html.match(/content="([^"]+)"\s+(?:property|name)="og:image"/) ||
                  html.match(/(?:property|name)="og:image"\s+content="([^"]+)"/);
    console.log('FULL RAW OG:IMAGE:');
    console.log(ogImg ? ogImg[1] : 'none');

    const jsonLd = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    console.log('JSON-LD found:', !!jsonLd);
    if (jsonLd) {
      try {
        const parsed = JSON.parse(jsonLd[1]);
        console.log('JSON-LD parsed name:', parsed.name, 'image:', parsed.image);
      } catch(e) {}
    }
    
    // Look for title
    const titleMatch = html.match(/content="([^"]+)"\s+(?:property|name)="og:title"/) ||
                       html.match(/(?:property|name)="og:title"\s+content="([^"]+)"/);
    console.log('og:title found:', titleMatch ? titleMatch[1] : 'none');
  } catch(e) {
    console.error('Strategy 1 error:', e.message);
  }

  // Strategy 2: Googlebot
  try {
    const res = await fetch(`https://www.instagram.com/${handle}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    console.log('Strategy 2 status:', res.status, 'final url:', res.url);
    const html = await res.text();
    const ogImg = html.match(/content="([^"]+)"\s+(?:property|name)="og:image"/) ||
                  html.match(/(?:property|name)="og:image"\s+content="([^"]+)"/);
    console.log('og:image (Googlebot):', ogImg ? ogImg[1].slice(0, 100) + '...' : 'none');
  } catch(e) {
    console.error('Strategy 2 error:', e.message);
  }
}

(async () => {
  await testFetch('monu_ahirwar1');
  await testFetch('rohit_vlogs07');
})();
