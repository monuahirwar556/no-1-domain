const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('--- HEAD VERIFICATION ---');
    console.log('TITLE:', (data.match(/<title>.*?<\/title>/i) || [])[0]);
    console.log('OG:TITLE:', (data.match(/<meta[^>]*property=["']og:title["'][^>]*>/i) || [])[0]);
    console.log('CANONICAL:', (data.match(/<link[^>]*rel=["']canonical["'][^>]*>/i) || [])[0]);
    console.log('OG:URL:', (data.match(/<meta[^>]*property=["']og:url["'][^>]*>/i) || [])[0]);
    console.log('TWITTER:TITLE:', (data.match(/<meta[^>]*name=["']twitter:title["'][^>]*>/i) || [])[0]);
    console.log('DESCRIPTIONS FOUND:', (data.match(/<meta[^>]*name=["']description["'][^>]*>/i) || [])[0] || 'NONE (CLEAN)');
    console.log('-------------------------');
  });
});
