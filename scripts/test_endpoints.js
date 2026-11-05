async function test() {
  const websiteId = '6a87764db93c0eb54865542c'
  const endpoints = [
    `https://datafa.st/api/user/websites/${websiteId}`,
    `https://datafa.st/api/user/websites/${websiteId}/analytics?period=last24h`,
    `https://datafa.st/api/share/${websiteId}`,
    `https://datafa.st/api/share/${websiteId}/analytics`,
    `https://datafa.st/api/websites/${websiteId}`,
  ]

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep)
      console.log(ep, res.status)
      if (res.ok) {
        const json = await res.json()
        console.log('Result:', JSON.stringify(json).slice(0, 300))
      }
    } catch (e) {
      console.log(ep, 'Error:', e.message)
    }
  }
}
test()
