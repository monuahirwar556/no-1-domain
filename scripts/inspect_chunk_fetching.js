async function inspect() {
  const url = 'https://datafa.st/_next/static/chunks/app/share/%5BwebsiteId%5D/page-515621f0ce58814d.js'
  const text = await (await fetch(url)).text()

  // Find strings like "POST", "GET", or action calls
  const matches = text.match(/queryFn:\s*function[^{]+{[^}]+}/g) || []
  console.log('queryFn matches:', matches.length)

  // Look for any string containing "period"
  const periodMatches = text.match(/["'][^"']*\bperiod\b[^"']*["']/g) || []
  console.log('period matches:', Array.from(new Set(periodMatches)).slice(0, 10))

  // Look for fetch calls
  const fetchCalls = text.match(/fetch\([^)]+\)/g) || []
  console.log('fetchCalls:', fetchCalls.slice(0, 10))
}

inspect()
