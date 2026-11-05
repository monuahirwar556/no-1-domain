const https = require('https')
const fs = require('fs')
const path = require('path')

const audioDir = path.join(__dirname, '..', 'public', 'audio')
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true })

// High converting, punchy Hindi script for 30s Meta Ad
const scenesData = [
  {
    file: 'scene1.mp3',
    text: 'क्या आपकी वेबसाइट पर ट्रैफिक नहीं आ रहा? महंगे ऐड्स में पैसे बर्बाद करना बंद करें!'
  },
  {
    file: 'scene2.mp3',
    text: 'पेश है नंबर वन डोमेन! भारत का सबसे पहला लाइव अटेंशन लीडरबोर्ड!'
  },
  {
    file: 'scene3.mp3',
    text: 'सिर्फ पचास रुपये में अपना डोमेन लिस्ट करें और पाएं नंबर वन क्राउन रैंक!'
  },
  {
    file: 'scene4.mp3',
    text: 'रियल टाइम लाइव विजिटर्स देखें और डायरेक्ट यूपीआई क्यूआर से तुरंत पे करें!'
  },
  {
    file: 'scene5.mp3',
    text: 'मौका हाथ से न जाने दें! अभी विजिट करें no1domain.in और अपना क्राउन क्लेम करें!'
  }
]

function downloadAudio(item) {
  return new Promise((resolve, reject) => {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=hi&q=' + encodeURIComponent(item.text)
    const filePath = path.join(audioDir, item.file)
    const fileStream = fs.createWriteStream(filePath)
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`))
      }
      res.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`Saved ${item.file}, size: ${fs.statSync(filePath).size} bytes`)
        resolve()
      })
    }).on('error', err => {
      reject(err)
    })
  })
}

async function run() {
  console.log('Generating high-quality natural Hindi voiceover...')
  for (const scene of scenesData) {
    await downloadAudio(scene)
  }
  
  // Combine all 5 into full_voiceover.mp3
  const combinedBuffers = scenesData.map(s => fs.readFileSync(path.join(audioDir, s.file)))
  const fullPath = path.join(audioDir, 'full_voiceover.mp3')
  fs.writeFileSync(fullPath, Buffer.concat(combinedBuffers))
  console.log('Successfully generated full_voiceover.mp3, size:', fs.statSync(fullPath).size)
}

run().catch(console.error)
