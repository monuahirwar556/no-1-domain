const fs = require('fs')

const text = fs.readFileSync('C:/Users/monua/.gemini/antigravity-ide/brain/5a4098b1-7419-4346-bc48-be418539e33a/.system_generated/steps/567/content.md', 'utf8')

let idx = 0
while ((idx = text.indexOf('outbid.lol', idx)) !== -1) {
  console.log('--- MATCH AT', idx, '---')
  console.log(text.substring(Math.max(0, idx - 150), Math.min(text.length, idx + 350)))
  idx += 10
}
