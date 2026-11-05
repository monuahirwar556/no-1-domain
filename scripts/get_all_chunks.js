const fs = require('fs')

const text = fs.readFileSync('C:/Users/monua/.gemini/antigravity-ide/brain/5a4098b1-7419-4346-bc48-be418539e33a/.system_generated/steps/567/content.md', 'utf8')

const regex = /static\/chunks\/([a-zA-Z0-9_-]+\.js)/g
let match
const chunks = new Set()
while ((match = regex.exec(text)) !== null) {
  chunks.add(match[1])
}
console.log('All chunks:', Array.from(chunks))
