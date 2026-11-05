const fs = require('fs')

const text = fs.readFileSync('C:/Users/monua/.gemini/antigravity-ide/brain/5a4098b1-7419-4346-bc48-be418539e33a/.system_generated/steps/567/content.md', 'utf8')

// Look for server action IDs or Next.js action calls
const actions = text.match(/\$ACTION_ID_[a-zA-Z0-9_]+/g) || []
console.log('Action IDs:', actions)

// Search for any URLs or endpoints
const urls = text.match(/https?:\/\/[^\s"'<>]+/g) || []
console.log('URLs:', Array.from(new Set(urls)))

// Let's search for words like 'visitors', 'sessions', 'revenue', 'overview', 'country'
const keywords = ['visitor', 'session', 'revenue', 'country', 'sources', 'pages', 'devices', 'browsers']
keywords.forEach(k => {
  const count = (text.toLowerCase().match(new RegExp(k, 'g')) || []).length
  console.log(`${k}: ${count}`)
})
