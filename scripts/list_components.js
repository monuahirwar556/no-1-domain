const fs = require('fs')

const text = fs.readFileSync('C:/Users/monua/.gemini/antigravity-ide/brain/5a4098b1-7419-4346-bc48-be418539e33a/.system_generated/steps/567/content.md', 'utf8')

const matches = text.match(/@\/components\/[A-Za-z0-9_-]+/g)
console.log('All DataFast components:', Array.from(new Set(matches)))
