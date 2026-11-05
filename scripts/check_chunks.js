async function run() {
  const chunks = [
    'https://datafa.st/_next/static/chunks/app/share/%5BwebsiteId%5D/page-515621f0ce58814d.js',
    'https://datafa.st/_next/static/chunks/9511-ae57077c2e29f487.js',
    'https://datafa.st/_next/static/chunks/1310-59e232e28ce9a0e4.js',
    'https://datafa.st/_next/static/chunks/5194-9de962dbe4587480.js',
    'https://datafa.st/_next/static/chunks/8374-f7b1d683755ece89.js',
  ]

  for (const url of chunks) {
    try {
      const res = await fetch(url)
      const text = await res.text()
      const matches = text.match(/\/api\/[a-zA-Z0-9_\-\/]+/g)
      if (matches) {
        console.log(url, 'matches:', Array.from(new Set(matches)))
      }
      const supabaseMatches = text.match(/https:\/\/[a-z0-9]+\.supabase\.co/g)
      if (supabaseMatches) {
        console.log(url, 'supabase:', Array.from(new Set(supabaseMatches)))
      }
    } catch (e) {
      console.error(url, e.message)
    }
  }
}

run()
