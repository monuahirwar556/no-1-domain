async function searchAll() {
  const fs = require('fs')
  const scriptContent = fs.readFileSync('scripts/get_all_chunks.js', 'utf8')
  const chunkList = [
    '3464-c4db96fc93612efa.js',
    '6507-cc657b3a1b46a53c.js',
    '4150-1a7b15fb1aa55fb1.js',
    '3883-4f7b1b6aad2ecb24.js',
    '8205-0210118fbddbf202.js',
    '8530-afa4922112efc8de.js',
    '3409-39ce0b0d9306cc03.js',
    '5894-37a164e856f2dec9.js',
    '5118-2a16f0d93f373beb.js',
    '8124-b19940c9bf867634.js',
    '7592-29649e8b6cac1cb6.js',
    '7218-def9ddc8ef12cfe2.js',
    '1693-af7f2c81686fbec1.js',
    '4335-b02dbf32c3dd142e.js',
    '3768-4e7014035a19eebe.js',
    '4413-0be5475103489288.js',
    '2821-c44f8d2e92e92e91.js',
    '3087-107a746e84d32644.js',
    '104-cf5a3d2807790a35.js',
    '8374-f7b1d683755ece89.js',
    '5194-9de962dbe4587480.js',
    '1310-59e232e28ce9a0e4.js',
    '9511-ae57077c2e29f487.js'
  ]

  for (const c of chunkList) {
    try {
      const url = `https://datafa.st/_next/static/chunks/${c}`
      const res = await fetch(url)
      const text = await res.text()
      const apiMatches = text.match(/\/api\/[a-zA-Z0-9_\-\/]+/g)
      if (apiMatches) {
        console.log(c, 'APIs:', Array.from(new Set(apiMatches)))
      }
    } catch (e) {
      console.log(c, e.message)
    }
  }
}

searchAll()
