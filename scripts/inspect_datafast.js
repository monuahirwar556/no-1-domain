async function main() {
  try {
    const res = await fetch('https://datafa.st/_next/static/chunks/app/share/%5BwebsiteId%5D/page-515621f0ce58814d.js')
    const text = await res.text()
    
    // Search for API calls or endpoints
    const regex = /["'`](\/api\/[^"'`]+)["'`]/g
    let match
    const endpoints = new Set()
    while ((match = regex.exec(text)) !== null) {
      endpoints.add(match[1])
    }
    console.log('Endpoints in page chunk:', Array.from(endpoints))

    // Search for query keys or trpc/api routes
    const queryMatches = text.match(/queryKey:[^}]+/g)
    console.log('Query keys sample:', queryMatches?.slice(0, 5))
  } catch (e) {
    console.error(e)
  }
}
main()
