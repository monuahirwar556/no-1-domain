async function test() {
  const base = 'https://datafa.st/api/websites/6a87764db93c0eb54865542c'
  const subroutes = [
    '',
    '/stats',
    '/analytics',
    '/overview',
    '/locations',
    '/countries',
    '/paths',
    '/pages',
    '/sources',
    '/systems',
    '/devices',
    '/browsers',
    '/realtime',
    '/live',
    '/events',
    '/visitors',
    '/chart',
  ]

  for (const s of subroutes) {
    try {
      const url = `${base}${s}?period=last24h&granularity=hourly`
      const res = await fetch(url)
      console.log(s, res.status)
      if (res.ok) {
        const text = await res.text()
        console.log(`DATA FOR ${s}:`, text.slice(0, 300))
      }
    } catch (e) {
      console.log(s, e.message)
    }
  }
}

test()
