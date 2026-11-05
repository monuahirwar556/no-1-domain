const fs = require('fs')
const path = require('path')
const { ZipArchive } = require('archiver')

const zipPath = path.join(__dirname, '..', 'NO1DOMAIN_VIDEO_KIT.zip')
const output = fs.createWriteStream(zipPath)
const archive = new ZipArchive({ zlib: { level: 9 } })

output.on('close', function() {
  const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2)
  console.log(`Video Kit ZIP created: ${zipPath} (${sizeMB} MB)`)
  const userProfile = process.env.USERPROFILE || 'C:\\Users\\monua'
  try {
    fs.copyFileSync(zipPath, path.join(userProfile, 'Downloads', 'NO1DOMAIN_VIDEO_KIT.zip'))
    fs.copyFileSync(zipPath, path.join(userProfile, 'OneDrive', 'Desktop', 'NO1DOMAIN_VIDEO_KIT.zip'))
    console.log('Copied ZIP to Desktop and Downloads!')
  } catch(e) {
    console.warn('Copy notice:', e.message)
  }
})

archive.on('error', function(err) {
  throw err
})

archive.pipe(output)

const userProfile = process.env.USERPROFILE || 'C:\\Users\\monua'
const folder = path.join(userProfile, 'OneDrive', 'Desktop', 'NO1DOMAIN_VIDEO_PICS')

const readmeContent = `NO. 1 DOMAIN — VIDEO CREATION KIT (IMAGES + VOICEOVERS)
============================================================

5 HIGH-QUALITY 9:16 IMAGES FOR VIDEO EDITING (CapCut / VN / InShot / Premiere):
1. 01_Problem_Traffic_Alert.jpg (Hook: 0s-6s)
2. 02_Solution_Crown_Leaderboard.jpg (Solution: 6s-12s)
3. 03_Offer_50_Rupees_Boost.jpg (Offer ₹50: 12s-18s)
4. 04_Live_Proof_UPI_QR.jpg (Live Proof: 18s-24s)
5. 05_CTA_Claim_Your_Crown.jpg (Call To Action: 24s-30s)

AUDIO VOICEOVERS (NATURAL STUDIO HINDI):
- 01_Voiceover_Traffic_Problem.mp3: "क्या आपकी वेबसाइट पर ट्रैफिक नहीं आ रहा? महंगे ऐड्स में पैसे बर्बाद करना बंद करें!"
- 02_Voiceover_Solution_Crown.mp3: "पेश है नंबर वन डोमेन! भारत का सबसे पहला लाइव अटेंशन लीडरबोर्ड!"
- 03_Voiceover_Offer_50_Rupees.mp3: "सिर्फ पचास रुपये में अपना डोमेन लिस्ट करें और पाएं नंबर वन क्राउन रैंक!"
- 04_Voiceover_Proof_Live_UPI.mp3: "रियल टाइम लाइव विजिटर्स देखें और डायरेक्ट यूपीआई क्यूआर से तुरंत पे करें!"
- 05_Voiceover_CTA_Claim_Crown.mp3: "मौका हाथ से न जाने दें! अभी विजिट करें no1domain.in और अपना क्राउन क्लेम करें!"
- FULL_VOICEOVER_TRACK_30S.mp3 (Complete continuous 30s audio track)

HOW TO MAKE YOUR VIDEO IN 2 MINUTES:
1. Open CapCut, VN Editor, or InShot on your phone or PC.
2. Import all 5 images in order (each image set to 5-6 seconds duration).
3. Import FULL_VOICEOVER_TRACK_30S.mp3 (or individual audio clips).
4. Add zoom-in / slide transitions.
5. Export in 1080x1920 (9:16) format for Instagram Reels & Meta Ads!
`

archive.append(readmeContent, { name: 'VIDEO_INSTRUCTIONS_AND_SCRIPT.txt' })

if (fs.existsSync(folder)) {
  const files = fs.readdirSync(folder)
  files.forEach(f => {
    archive.file(path.join(folder, f), { name: f })
  })
}

archive.finalize()
